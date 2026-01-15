import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import Chat from '../models/Chat';
import { User } from '../models/User';

interface SocketUser {
  userId: string;
  socketId: string;
  name: string;
  avatar?: string;
}

class ChatService {
  private io: SocketIOServer | null = null;
  private onlineUsers: Map<string, SocketUser> = new Map();

  initialize(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
        credentials: true
      }
    });

    this.io.on('connection', (socket) => {
      console.log('🔌 New socket connection:', socket.id);

      // Authenticate user
      socket.on('authenticate', async (token: string) => {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
          const user = await User.findById(decoded.userId).select('name avatar');
          
          if (user) {
            this.onlineUsers.set(decoded.userId, {
              userId: decoded.userId,
              socketId: socket.id,
              name: user.name,
              avatar: user.avatar
            });

            socket.data.userId = decoded.userId;
            socket.join(`user:${decoded.userId}`);
            
            // Notify others that user is online
            this.io?.emit('user:online', {
              userId: decoded.userId,
              name: user.name,
              avatar: user.avatar
            });

            console.log(`✅ User authenticated: ${user.name} (${decoded.userId})`);
          }
        } catch (error) {
          console.error('Authentication error:', error);
          socket.emit('error', { message: 'Authentication failed' });
        }
      });

      // Join chat room
      socket.on('chat:join', (chatId: string) => {
        socket.join(`chat:${chatId}`);
        console.log(`User ${socket.data.userId} joined chat ${chatId}`);
      });

      // Leave chat room
      socket.on('chat:leave', (chatId: string) => {
        socket.leave(`chat:${chatId}`);
        console.log(`User ${socket.data.userId} left chat ${chatId}`);
      });

      // Send message
      socket.on('message:send', async (data: {
        chatId: string;
        content: string;
        type?: 'text' | 'image' | 'file';
        fileUrl?: string;
        fileName?: string;
      }) => {
        try {
          const userId = socket.data.userId;
          if (!userId) {
            socket.emit('error', { message: 'Not authenticated' });
            return;
          }

          const user = await User.findById(userId).select('name avatar');
          if (!user) {
            socket.emit('error', { message: 'User not found' });
            return;
          }

          const chat = await Chat.findById(data.chatId);
          if (!chat) {
            socket.emit('error', { message: 'Chat not found' });
            return;
          }

          // Check if user is participant
          if (!chat.participants.some(p => p.toString() === userId)) {
            socket.emit('error', { message: 'Not a participant' });
            return;
          }

          // Create message
          const message = {
            senderId: userId,
            senderName: user.name,
            senderAvatar: user.avatar,
            content: data.content,
            timestamp: new Date(),
            read: false,
            type: data.type || 'text',
            fileUrl: data.fileUrl,
            fileName: data.fileName
          };

          chat.messages.push(message);
          chat.lastMessage = data.content;
          chat.lastMessageTime = new Date();

          // Update unread count for other participants
          chat.participants.forEach(participantId => {
            if (participantId.toString() !== userId) {
              const count = chat.unreadCount.get(participantId.toString()) || 0;
              chat.unreadCount.set(participantId.toString(), count + 1);
            }
          });

          await chat.save();

          // Emit to all participants in the chat room
          this.io?.to(`chat:${data.chatId}`).emit('message:new', {
            chatId: data.chatId,
            message: {
              ...message,
              _id: chat.messages[chat.messages.length - 1]._id
            }
          });

          console.log(`📨 Message sent in chat ${data.chatId} by ${user.name}`);
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Mark messages as read
      socket.on('message:read', async (data: { chatId: string }) => {
        try {
          const userId = socket.data.userId;
          if (!userId) return;

          const chat = await Chat.findById(data.chatId);
          if (!chat) return;

          // Mark all messages as read for this user
          chat.messages.forEach(msg => {
            if (msg.senderId.toString() !== userId) {
              msg.read = true;
            }
          });

          // Reset unread count for this user
          chat.unreadCount.set(userId, 0);
          await chat.save();

          // Notify sender that messages were read
          this.io?.to(`chat:${data.chatId}`).emit('message:read', {
            chatId: data.chatId,
            userId
          });
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      });

      // Typing indicator
      socket.on('typing:start', (data: { chatId: string }) => {
        const userId = socket.data.userId;
        if (!userId) return;

        socket.to(`chat:${data.chatId}`).emit('typing:start', {
          chatId: data.chatId,
          userId
        });
      });

      socket.on('typing:stop', (data: { chatId: string }) => {
        const userId = socket.data.userId;
        if (!userId) return;

        socket.to(`chat:${data.chatId}`).emit('typing:stop', {
          chatId: data.chatId,
          userId
        });
      });

      // Disconnect
      socket.on('disconnect', () => {
        const userId = socket.data.userId;
        if (userId) {
          this.onlineUsers.delete(userId);
          this.io?.emit('user:offline', { userId });
          console.log(`👋 User ${userId} disconnected`);
        }
      });
    });

    console.log('✅ WebSocket server initialized');
  }

  getOnlineUsers(): SocketUser[] {
    return Array.from(this.onlineUsers.values());
  }

  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }
}

export const chatService = new ChatService();

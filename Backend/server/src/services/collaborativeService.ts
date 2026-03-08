import { Server, Socket } from 'socket.io';
import { CollaborativeSession } from '../models/CollaborativeSession';

interface ControlRequest {
  sessionCode: string;
  requesterId: string;
  requesterName: string;
}

class CollaborativeService {
  private io: Server | null = null;
  private controlRequests: Map<string, ControlRequest> = new Map();

  initialize(httpServer: any) {
    this.io = new Server(httpServer, {
      cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
        credentials: true
      },
      path: '/socket.io/collaborative'
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`🔌 Collaborative socket connected: ${socket.id}`);

      socket.on('create-session', async (data) => {
        await this.handleCreateSession(socket, data);
      });

      socket.on('join-session', async (data) => {
        await this.handleJoinSession(socket, data);
      });

      socket.on('code-change', async (data) => {
        await this.handleCodeChange(socket, data);
      });

      socket.on('request-control', async (data) => {
        await this.handleRequestControl(socket, data);
      });

      socket.on('grant-control', async (data) => {
        await this.handleGrantControl(socket, data);
      });

      socket.on('deny-control', async (data) => {
        await this.handleDenyControl(socket, data);
      });

      socket.on('chat-message', async (data) => {
        await this.handleChatMessage(socket, data);
      });

      socket.on('leave-session', async (data) => {
        await this.handleLeaveSession(socket, data);
      });

      socket.on('disconnect', () => {
        console.log(`🔌 Collaborative socket disconnected: ${socket.id}`);
      });
    });

    console.log('✅ Collaborative coding service initialized');
  }

  private generateSessionCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  private async handleCreateSession(socket: Socket, data: any) {
    try {
      const { userId, userName, language = 'javascript' } = data;
      
      let sessionCode = this.generateSessionCode();
      let exists = await CollaborativeSession.findOne({ sessionCode });
      
      while (exists) {
        sessionCode = this.generateSessionCode();
        exists = await CollaborativeSession.findOne({ sessionCode });
      }

      const session = await CollaborativeSession.create({
        sessionCode,
        hostId: userId,
        hostName: userName,
        controllerId: userId,
        language,
        participants: [{
          userId,
          name: userName,
          joinedAt: new Date(),
          isController: true
        }],
        currentCode: '',
        chatHistory: [],
        isActive: true
      });

      socket.join(sessionCode);
      
      socket.emit('session-created', {
        success: true,
        sessionCode,
        session: {
          sessionCode: session.sessionCode,
          hostId: session.hostId,
          hostName: session.hostName,
          participants: session.participants,
          currentCode: session.currentCode,
          language: session.language,
          controllerId: session.controllerId
        }
      });

      console.log(`✅ Session created: ${sessionCode} by ${userName}`);
    } catch (error) {
      console.error('Error creating session:', error);
      socket.emit('session-error', { message: 'Failed to create session' });
    }
  }

  private async handleJoinSession(socket: Socket, data: any) {
    try {
      const { sessionCode, userId, userName } = data;

      const session = await CollaborativeSession.findOne({ sessionCode, isActive: true });

      if (!session) {
        socket.emit('join-error', { message: 'Session not found or inactive' });
        return;
      }

      const alreadyJoined = session.participants.some(p => p.userId === userId);
      
      if (!alreadyJoined) {
        session.participants.push({
          userId,
          name: userName,
          joinedAt: new Date(),
          isController: false
        });
        await session.save();
      }

      socket.join(sessionCode);

      socket.emit('session-joined', {
        success: true,
        session: {
          sessionCode: session.sessionCode,
          hostId: session.hostId,
          hostName: session.hostName,
          participants: session.participants,
          currentCode: session.currentCode,
          language: session.language,
          controllerId: session.controllerId,
          chatHistory: session.chatHistory
        }
      });

      this.io?.to(sessionCode).emit('user-joined', {
        userId,
        userName,
        participants: session.participants
      });

      console.log(`✅ ${userName} joined session: ${sessionCode}`);
    } catch (error) {
      console.error('Error joining session:', error);
      socket.emit('join-error', { message: 'Failed to join session' });
    }
  }

  private async handleCodeChange(socket: Socket, data: any) {
    try {
      const { sessionCode, code, userId } = data;

      const session = await CollaborativeSession.findOne({ sessionCode });

      if (!session) {
        socket.emit('code-error', { message: 'Session not found' });
        return;
      }

      if (session.controllerId !== userId) {
        socket.emit('code-error', { message: 'You do not have control' });
        return;
      }

      session.currentCode = code;
      await session.save();

      socket.to(sessionCode).emit('code-updated', { code, userId });
    } catch (error) {
      console.error('Error updating code:', error);
    }
  }

  private async handleRequestControl(socket: Socket, data: any) {
    try {
      const { sessionCode, requesterId, requesterName } = data;

      const session = await CollaborativeSession.findOne({ sessionCode });

      if (!session) {
        socket.emit('control-error', { message: 'Session not found' });
        return;
      }

      const requestKey = `${sessionCode}-${requesterId}`;
      this.controlRequests.set(requestKey, { sessionCode, requesterId, requesterName });

      const controllerSocket = Array.from(this.io?.sockets.sockets.values() || [])
        .find(s => s.rooms.has(sessionCode));

      if (controllerSocket) {
        this.io?.to(sessionCode).emit('control-requested', {
          requesterId,
          requesterName,
          controllerId: session.controllerId
        });
      }

      console.log(`🎮 ${requesterName} requested control in ${sessionCode}`);
    } catch (error) {
      console.error('Error requesting control:', error);
    }
  }

  private async handleGrantControl(socket: Socket, data: any) {
    try {
      const { sessionCode, requesterId } = data;

      const session = await CollaborativeSession.findOne({ sessionCode });

      if (!session) {
        return;
      }

      session.participants.forEach(p => {
        p.isController = p.userId === requesterId;
      });

      session.controllerId = requesterId;
      await session.save();

      this.io?.to(sessionCode).emit('control-granted', {
        newControllerId: requesterId,
        participants: session.participants
      });

      const requestKey = `${sessionCode}-${requesterId}`;
      this.controlRequests.delete(requestKey);

      console.log(`✅ Control granted to ${requesterId} in ${sessionCode}`);
    } catch (error) {
      console.error('Error granting control:', error);
    }
  }

  private async handleDenyControl(socket: Socket, data: any) {
    try {
      const { sessionCode, requesterId } = data;

      this.io?.to(sessionCode).emit('control-denied', { requesterId });

      const requestKey = `${sessionCode}-${requesterId}`;
      this.controlRequests.delete(requestKey);

      console.log(`❌ Control denied to ${requesterId} in ${sessionCode}`);
    } catch (error) {
      console.error('Error denying control:', error);
    }
  }

  private async handleChatMessage(socket: Socket, data: any) {
    try {
      const { sessionCode, userId, userName, message } = data;

      const session = await CollaborativeSession.findOne({ sessionCode });

      if (!session) {
        return;
      }

      const chatMessage = {
        userId,
        userName,
        message,
        timestamp: new Date()
      };

      session.chatHistory.push(chatMessage);
      await session.save();

      this.io?.to(sessionCode).emit('chat-message', chatMessage);
    } catch (error) {
      console.error('Error sending chat message:', error);
    }
  }

  private async handleLeaveSession(socket: Socket, data: any) {
    try {
      const { sessionCode, userId, userName } = data;

      const session = await CollaborativeSession.findOne({ sessionCode });

      if (!session) {
        return;
      }

      session.participants = session.participants.filter(p => p.userId !== userId);

      if (session.participants.length === 0) {
        session.isActive = false;
        await session.save();
        console.log(`🔴 Session ${sessionCode} closed (no participants)`);
      } else {
        if (session.controllerId === userId) {
          const newController = session.participants[0];
          session.controllerId = newController.userId;
          newController.isController = true;
        }
        await session.save();

        this.io?.to(sessionCode).emit('user-left', {
          userId,
          userName,
          participants: session.participants,
          newControllerId: session.controllerId
        });
      }

      socket.leave(sessionCode);
      console.log(`👋 ${userName} left session: ${sessionCode}`);
    } catch (error) {
      console.error('Error leaving session:', error);
    }
  }
}

export const collaborativeService = new CollaborativeService();

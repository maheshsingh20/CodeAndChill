import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import CollaborativeSession from '../models/CollaborativeSession';
import { User } from '../models/User';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
  sessionToken?: string;
}

interface CodeChange {
  operation: 'insert' | 'delete' | 'replace';
  position: {
    line: number;
    column: number;
  };
  content: string;
  length?: number;
}

interface CursorPosition {
  line: number;
  column: number;
}

interface Selection {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}

export class CollaborativeHandler {
  private io: SocketIOServer;
  private sessionRooms: Map<string, Set<string>> = new Map();

  constructor(io: SocketIOServer) {
    this.io = io;
    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication token required'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        const user = await User.findById(decoded.userId);
        
        if (!user) {
          return next(new Error('User not found'));
        }

        socket.userId = decoded.userId;
        socket.username = user.name;
        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`User ${socket.username} connected to collaborative coding`);

      // Join session
      socket.on('join-session', async (data: { sessionToken: string }) => {
        try {
          await this.handleJoinSession(socket, data.sessionToken);
        } catch (error) {
          socket.emit('error', { message: 'Failed to join session' });
        }
      });

      // Leave session
      socket.on('leave-session', async () => {
        try {
          await this.handleLeaveSession(socket);
        } catch (error) {
          socket.emit('error', { message: 'Failed to leave session' });
        }
      });

      // Code changes
      socket.on('code-change', async (data: { change: CodeChange; code: string }) => {
        try {
          await this.handleCodeChange(socket, data.change, data.code);
        } catch (error) {
          socket.emit('error', { message: 'Failed to sync code change' });
        }
      });

      // Cursor position updates
      socket.on('cursor-position', async (data: { position: CursorPosition }) => {
        try {
          await this.handleCursorPosition(socket, data.position);
        } catch (error) {
          console.error('Failed to update cursor position:', error);
        }
      });

      // Selection updates
      socket.on('selection-change', async (data: { selection: Selection | null }) => {
        try {
          await this.handleSelectionChange(socket, data.selection);
        } catch (error) {
          console.error('Failed to update selection:', error);
        }
      });

      // Chat messages
      socket.on('chat-message', async (data: { message: string }) => {
        try {
          await this.handleChatMessage(socket, data.message);
        } catch (error) {
          socket.emit('error', { message: 'Failed to send chat message' });
        }
      });

      // Language change
      socket.on('language-change', async (data: { language: string }) => {
        try {
          await this.handleLanguageChange(socket, data.language);
        } catch (error) {
          socket.emit('error', { message: 'Failed to change language' });
        }
      });

      // Disconnect handling
      socket.on('disconnect', async () => {
        try {
          await this.handleDisconnect(socket);
        } catch (error) {
          console.error('Error handling disconnect:', error);
        }
      });
    });
  }

  private async handleJoinSession(socket: AuthenticatedSocket, sessionToken: string) {
    const session = await CollaborativeSession.findOne({ 
      sessionToken, 
      isActive: true 
    });

    if (!session) {
      socket.emit('error', { message: 'Session not found' });
      return;
    }

    // Check if user is a participant
    const participant = session.participants.find(
      p => p.userId.toString() === socket.userId && p.isActive
    );

    if (!participant) {
      socket.emit('error', { message: 'Not authorized to join this session' });
      return;
    }

    // Join socket room
    socket.sessionToken = sessionToken;
    socket.join(sessionToken);

    // Add to session rooms tracking
    if (!this.sessionRooms.has(sessionToken)) {
      this.sessionRooms.set(sessionToken, new Set());
    }
    this.sessionRooms.get(sessionToken)!.add(socket.id);

    // Update participant status
    participant.isActive = true;
    session.lastActivity = new Date();
    await session.save();

    // Notify others about user joining
    socket.to(sessionToken).emit('user-joined', {
      userId: socket.userId,
      username: socket.username
    });

    // Send current session state to the joining user
    socket.emit('session-joined', {
      sessionId: session._id,
      code: session.code,
      language: session.language,
      participants: session.participants.filter(p => p.isActive),
      settings: session.settings,
      isHost: session.hostId.toString() === socket.userId
    });

    // Send recent chat messages
    socket.emit('chat-history', {
      messages: session.chatMessages.slice(-50)
    });

    console.log(`User ${socket.username} joined session ${sessionToken}`);
  }

  private async handleLeaveSession(socket: AuthenticatedSocket) {
    if (!socket.sessionToken) return;

    const session = await CollaborativeSession.findOne({ 
      sessionToken: socket.sessionToken 
    });

    if (session) {
      const participant = session.participants.find(
        p => p.userId.toString() === socket.userId
      );

      if (participant) {
        participant.isActive = false;
        session.lastActivity = new Date();
        await session.save();
      }

      // Notify others about user leaving
      socket.to(socket.sessionToken).emit('user-left', {
        userId: socket.userId,
        username: socket.username
      });
    }

    // Remove from tracking
    const sessionRoom = this.sessionRooms.get(socket.sessionToken);
    if (sessionRoom) {
      sessionRoom.delete(socket.id);
      if (sessionRoom.size === 0) {
        this.sessionRooms.delete(socket.sessionToken);
      }
    }

    socket.leave(socket.sessionToken);
    socket.sessionToken = undefined;
  }

  private async handleCodeChange(socket: AuthenticatedSocket, change: CodeChange, newCode: string) {
    if (!socket.sessionToken) return;

    const session = await CollaborativeSession.findOne({ 
      sessionToken: socket.sessionToken,
      isActive: true 
    });

    if (!session) return;

    // Check edit permissions
    const canEdit = this.canUserEdit(session, socket.userId!);
    if (!canEdit) {
      socket.emit('error', { message: 'You do not have edit permissions' });
      return;
    }

    // Update session code
    session.code = newCode;
    
    // Add to code history
    session.codeHistory.push({
      userId: socket.userId!,
      username: socket.username!,
      change: change.content,
      timestamp: new Date(),
      operation: change.operation,
      position: change.position
    });

    // Keep only last 1000 history entries
    if (session.codeHistory.length > 1000) {
      session.codeHistory = session.codeHistory.slice(-1000);
    }

    session.lastActivity = new Date();
    await session.save();

    // Broadcast change to other participants
    socket.to(socket.sessionToken).emit('code-changed', {
      change,
      code: newCode,
      userId: socket.userId,
      username: socket.username
    });
  }

  private async handleCursorPosition(socket: AuthenticatedSocket, position: CursorPosition) {
    if (!socket.sessionToken) return;

    const session = await CollaborativeSession.findOne({ 
      sessionToken: socket.sessionToken,
      isActive: true 
    });

    if (!session) return;

    // Update participant cursor position
    const participant = session.participants.find(
      p => p.userId.toString() === socket.userId && p.isActive
    );

    if (participant) {
      participant.cursor = position;
      await session.save();

      // Broadcast cursor position to other participants
      socket.to(socket.sessionToken).emit('cursor-moved', {
        userId: socket.userId,
        username: socket.username,
        position
      });
    }
  }

  private async handleSelectionChange(socket: AuthenticatedSocket, selection: Selection | null) {
    if (!socket.sessionToken) return;

    const session = await CollaborativeSession.findOne({ 
      sessionToken: socket.sessionToken,
      isActive: true 
    });

    if (!session) return;

    // Update participant selection
    const participant = session.participants.find(
      p => p.userId.toString() === socket.userId && p.isActive
    );

    if (participant) {
      participant.selection = selection || undefined;
      await session.save();

      // Broadcast selection to other participants
      socket.to(socket.sessionToken).emit('selection-changed', {
        userId: socket.userId,
        username: socket.username,
        selection
      });
    }
  }

  private async handleChatMessage(socket: AuthenticatedSocket, message: string) {
    if (!socket.sessionToken || !message.trim()) return;

    const session = await CollaborativeSession.findOne({ 
      sessionToken: socket.sessionToken,
      isActive: true 
    });

    if (!session) return;

    // Check if chat is allowed
    if (!session.settings.allowChat) {
      socket.emit('error', { message: 'Chat is disabled in this session' });
      return;
    }

    const chatMessage = {
      userId: socket.userId!,
      username: socket.username!,
      message: message.trim(),
      timestamp: new Date(),
      type: 'message' as const
    };

    session.chatMessages.push(chatMessage);
    
    // Keep only last 100 messages
    if (session.chatMessages.length > 100) {
      session.chatMessages = session.chatMessages.slice(-100);
    }

    session.lastActivity = new Date();
    await session.save();

    // Broadcast message to all participants
    this.io.to(socket.sessionToken).emit('chat-message', chatMessage);
  }

  private async handleLanguageChange(socket: AuthenticatedSocket, language: string) {
    if (!socket.sessionToken) return;

    const session = await CollaborativeSession.findOne({ 
      sessionToken: socket.sessionToken,
      isActive: true 
    });

    if (!session) return;

    // Only host can change language
    if (session.hostId.toString() !== socket.userId) {
      socket.emit('error', { message: 'Only host can change language' });
      return;
    }

    session.language = language;
    session.lastActivity = new Date();
    await session.save();

    // Broadcast language change to all participants
    this.io.to(socket.sessionToken).emit('language-changed', {
      language,
      changedBy: socket.username
    });
  }

  private async handleDisconnect(socket: AuthenticatedSocket) {
    console.log(`User ${socket.username} disconnected from collaborative coding`);
    
    if (socket.sessionToken) {
      await this.handleLeaveSession(socket);
    }
  }

  private canUserEdit(session: any, userId: string): boolean {
    const { allowEdit } = session.settings;
    
    switch (allowEdit) {
      case 'host-only':
        return session.hostId.toString() === userId;
      case 'all-participants':
        return session.participants.some((p: any) => 
          p.userId.toString() === userId && p.isActive
        );
      case 'invited-only':
        // For now, treat as all-participants
        // Could be extended to have specific invited users
        return session.participants.some((p: any) => 
          p.userId.toString() === userId && p.isActive
        );
      default:
        return false;
    }
  }

  // Cleanup inactive sessions periodically
  public async cleanupInactiveSessions() {
    try {
      const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
      
      await CollaborativeSession.updateMany(
        { 
          lastActivity: { $lt: cutoffTime },
          isActive: true
        },
        { 
          isActive: false 
        }
      );
    } catch (error) {
      console.error('Error cleaning up inactive sessions:', error);
    }
  }
}
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import CollaborativeSession from '../models/CollaborativeSession';
import ContestLeaderboard from '../models/ContestLeaderboard';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

export const setupSocketHandlers = (io: Server) => {
  // Authentication middleware for socket connections
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.username = user.name;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.username} connected with socket ${socket.id}`);

    // Join user-specific room for personal notifications
    if (socket.userId) {
      socket.join(`user-${socket.userId}`);
      
      // Update user presence
      updateUserPresence(socket.userId, 'online', 'browsing');
    }

    // Handle collaborative coding sessions
    socket.on('join-collaborative-session', async (data) => {
      try {
        console.log(`[JOIN] User ${socket.username} attempting to join session:`, data);
        
        const { sessionToken } = data;
        
        if (!sessionToken) {
          console.error('[JOIN] No session token provided');
          socket.emit('error', { message: 'Session token is required' });
          return;
        }

        const session = await CollaborativeSession.findOne({ 
          sessionToken, 
          isActive: true 
        });

        if (!session) {
          console.error(`[JOIN] Session not found: ${sessionToken}`);
          socket.emit('error', { message: 'Session not found or inactive' });
          return;
        }

        // Refresh session data to get latest participants (in case user just joined via REST API)
        const refreshedSession = await CollaborativeSession.findOne({ 
          sessionToken, 
          isActive: true 
        });

        if (!refreshedSession) {
          console.error(`[JOIN] Session not found after refresh: ${sessionToken}`);
          socket.emit('error', { message: 'Session not found after refresh' });
          return;
        }

        // Check if user is a participant
        const isParticipant = refreshedSession.participants.some(p => 
          p.userId.toString() === socket.userId && p.isActive
        );

        if (!isParticipant) {
          console.error(`[JOIN] User ${socket.username} not a participant in session ${sessionToken}`);
          socket.emit('error', { 
            message: 'Not authorized to join this session. Please join via the session interface first.',
            code: 'NOT_PARTICIPANT'
          });
          return;
        }

        console.log(`[JOIN] User ${socket.username} joining session ${sessionToken} via socket`);

        // Join session room (using consistent naming)
        socket.join(`session-${sessionToken}`);
        
        console.log(`[JOIN] ✅ User ${socket.username} joined room: session-${sessionToken}`);
        
        // Notify other participants
        socket.to(`session-${sessionToken}`).emit('user-joined', {
          userId: socket.userId,
          username: socket.username,
          timestamp: new Date()
        });

        // Send current session state
        socket.emit('session-state', {
          code: refreshedSession.code || '',
          language: refreshedSession.language || 'javascript',
          participants: refreshedSession.participants.filter(p => p.isActive),
          settings: refreshedSession.settings,
          cursors: refreshedSession.cursors || [],
          chat: (refreshedSession.chat || []).slice(-50) // Last 50 messages
        });

        console.log(`User ${socket.username} joined session ${sessionToken}`);

      } catch (error) {
        console.error('Error joining collaborative session:', error);
        socket.emit('error', { message: 'Failed to join session' });
      }
    });

    // Handle real-time code changes
    socket.on('code-change', async (data) => {
      try {
        const { sessionToken, code, changes, language } = data;
        
        if (!sessionToken) {
          socket.emit('error', { message: 'Session token is required' });
          return;
        }

        // Verify session exists and user has permission
        const session = await CollaborativeSession.findOne({ 
          sessionToken, 
          isActive: true 
        });

        if (!session) {
          socket.emit('error', { message: 'Session not found' });
          return;
        }

        // Check if user can edit
        const isParticipant = session.participants.some(p => 
          p.userId.toString() === socket.userId && p.isActive
        );

        if (!isParticipant) {
          socket.emit('error', { message: 'Not authorized to edit this session' });
          return;
        }

        // Allow any participant to edit code (as requested)
        // const canEdit = session.settings.allowEdit === 'all-participants' || 
        //                session.hostId.toString() === socket.userId;

        // if (!canEdit) {
        //   socket.emit('error', { message: 'Edit permission denied' });
        //   return;
        // }

        // Update session in database
        const updateData: any = { 
          lastActivity: new Date()
        };
        
        if (code !== undefined) {
          updateData.code = code;
        }
        
        // Update language if provided and valid
        if (language) {
          const validLanguages = ['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust', 'html', 'css'];
          if (validLanguages.includes(language)) {
            updateData.language = language;
          }
        }
        
        await CollaborativeSession.findOneAndUpdate(
          { sessionToken },
          updateData
        );

        // Broadcast to other participants in the session
        socket.to(`session-${sessionToken}`).emit('code-update', {
          code: code !== undefined ? code : session.code,
          changes,
          language: language || session.language,
          userId: socket.userId,
          username: socket.username,
          timestamp: new Date()
        });

        console.log(`Code updated in session ${sessionToken} by ${socket.username}`);

      } catch (error) {
        console.error('Error handling code change:', error);
        socket.emit('error', { message: 'Failed to update code' });
      }
    });

    // Handle session sync request
    socket.on('sync-session', async (data) => {
      try {
        const { sessionToken } = data;
        
        if (!sessionToken) {
          socket.emit('error', { message: 'Session token is required' });
          return;
        }

        const session = await CollaborativeSession.findOne({ 
          sessionToken, 
          isActive: true 
        });

        if (!session) {
          socket.emit('error', { message: 'Session not found' });
          return;
        }

        // Send current session state to requesting user
        socket.emit('session-sync', {
          code: session.code || '',
          language: session.language || 'javascript',
          participants: session.participants.filter(p => p.isActive),
          settings: session.settings,
          chat: (session.chat || []).slice(-50),
          timestamp: new Date()
        });

      } catch (error) {
        console.error('Error syncing session:', error);
        socket.emit('error', { message: 'Failed to sync session' });
      }
    });

    // Handle language change specifically
    socket.on('language-change', async (data) => {
      try {
        const { sessionToken, language } = data;
        
        if (!sessionToken || !language) {
          socket.emit('error', { message: 'Session token and language are required' });
          return;
        }

        // Verify session exists and user has permission
        const session = await CollaborativeSession.findOne({ 
          sessionToken, 
          isActive: true 
        });

        if (!session) {
          socket.emit('error', { message: 'Session not found' });
          return;
        }

        // Allow any participant to change language (as requested)
        const isParticipant = session.participants.some(p => 
          p.userId.toString() === socket.userId && p.isActive
        );

        if (!isParticipant) {
          socket.emit('error', { message: 'Not authorized to change language' });
          return;
        }

        // Validate language
        const validLanguages = ['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust', 'html', 'css'];
        if (!validLanguages.includes(language)) {
          socket.emit('error', { message: 'Invalid language' });
          return;
        }

        // Update session language in database
        await CollaborativeSession.findOneAndUpdate(
          { sessionToken },
          { 
            language,
            lastActivity: new Date()
          }
        );

        // Broadcast language change to ALL participants (including sender)
        io.to(`session-${sessionToken}`).emit('language-update', {
          language,
          userId: socket.userId,
          username: socket.username,
          changedBy: socket.username,
          timestamp: new Date()
        });

        // Add system message about language change
        const updatedSession = await CollaborativeSession.findOne({ sessionToken });
        if (updatedSession) {
          const systemMessage = {
            userId: socket.userId,
            username: 'System',
            message: `${socket.username} changed the language to ${language}`,
            timestamp: new Date(),
            type: 'system' as const
          };

          if (!updatedSession.chat) {
            updatedSession.chat = [];
          }
          if (!updatedSession.chatMessages) {
            updatedSession.chatMessages = [];
          }
          updatedSession.chat.push(systemMessage);
          updatedSession.chatMessages.push(systemMessage);
          if (updatedSession.chat.length > 100) {
            updatedSession.chat = updatedSession.chat.slice(-100);
          }
          if (updatedSession.chatMessages.length > 100) {
            updatedSession.chatMessages = updatedSession.chatMessages.slice(-100);
          }
          await updatedSession.save();

          // Broadcast system message to all participants
          io.to(`session-${sessionToken}`).emit('chat-message', systemMessage);
        }



        console.log(`Language changed to ${language} in session ${sessionToken} by ${socket.username}`);

      } catch (error) {
        console.error('Error handling language change:', error);
        socket.emit('error', { message: 'Failed to change language' });
      }
    });

    // Handle cursor position updates
    socket.on('cursor-position', (data) => {
      const { sessionToken, position } = data;
      
      socket.to(`session-${sessionToken}`).emit('cursor-update', {
        userId: socket.userId,
        username: socket.username,
        position,
        timestamp: new Date()
      });
    });

    // Handle chat messages in collaborative sessions
    socket.on('session-chat', async (data) => {
      try {
        console.log(`[CHAT] Received chat message from ${socket.username}:`, data);
        
        const { sessionToken, message } = data;
        
        if (!sessionToken || !message) {
          console.error('[CHAT] Missing sessionToken or message');
          socket.emit('error', { message: 'Session token and message are required' });
          return;
        }

        const session = await CollaborativeSession.findOne({ 
          sessionToken, 
          isActive: true 
        });

        if (!session) {
          console.error(`[CHAT] Session not found: ${sessionToken}`);
          socket.emit('error', { message: 'Session not found' });
          return;
        }

        // Check if user is participant
        const isParticipant = session.participants.some(p => 
          p.userId.toString() === socket.userId && p.isActive
        );

        if (!isParticipant) {
          console.error(`[CHAT] User ${socket.username} not a participant in session ${sessionToken}`);
          socket.emit('error', { message: 'Not authorized to send messages in this session' });
          return;
        }

        // Check if chat is allowed
        if (!session.settings.allowChat) {
          console.error(`[CHAT] Chat disabled in session ${sessionToken}`);
          socket.emit('error', { message: 'Chat is disabled in this session' });
          return;
        }

        const chatMessage = {
          userId: socket.userId,
          username: socket.username,
          message: message.trim(),
          timestamp: new Date(),
          type: 'message' as const
        };

        console.log(`[CHAT] Saving message to database:`, chatMessage);

        // Save to database
        if (!session.chat) session.chat = [];
        if (!session.chatMessages) session.chatMessages = [];
        
        session.chat.push(chatMessage);
        session.chatMessages.push(chatMessage);
        
        if (session.chat.length > 100) {
          session.chat = session.chat.slice(-100);
        }
        if (session.chatMessages.length > 100) {
          session.chatMessages = session.chatMessages.slice(-100);
        }
        await session.save();

        console.log(`[CHAT] Broadcasting to room: session-${sessionToken}`);
        
        // Broadcast to ALL session participants (including sender)
        io.to(`session-${sessionToken}`).emit('chat-message', chatMessage);

        console.log(`[CHAT] ✅ Message sent successfully in session ${sessionToken} by ${socket.username}: ${message.substring(0, 50)}...`);

      } catch (error) {
        console.error('[CHAT] Error handling chat message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle live code execution
    socket.on('execute-code', async (data) => {
      try {
        const { sessionToken, code, language } = data;
        
        // Simulate code execution (integrate with Judge0 in production)
        const executionResult = await simulateCodeExecution(code, language);
        
        // Broadcast execution result to session
        io.to(`session-${sessionToken}`).emit('execution-result', {
          userId: socket.userId,
          result: executionResult,
          timestamp: new Date()
        });

      } catch (error) {
        socket.emit('execution-error', { message: 'Code execution failed' });
      }
    });

    // Handle contest leaderboard subscriptions
    socket.on('subscribe-leaderboard', (data) => {
      const { contestId } = data;
      socket.join(`contest-${contestId}`);
    });

    socket.on('unsubscribe-leaderboard', (data) => {
      const { contestId } = data;
      socket.leave(`contest-${contestId}`);
    });

    // Handle voice/video calling
    socket.on('call-user', (data) => {
      const { targetUserId, offer, sessionToken } = data;
      
      socket.to(`user-${targetUserId}`).emit('incoming-call', {
        from: socket.userId,
        fromUsername: socket.username,
        offer,
        sessionToken
      });
    });

    socket.on('answer-call', (data) => {
      const { targetUserId, answer } = data;
      
      socket.to(`user-${targetUserId}`).emit('call-answered', {
        from: socket.userId,
        answer
      });
    });

    socket.on('ice-candidate', (data) => {
      const { targetUserId, candidate } = data;
      
      socket.to(`user-${targetUserId}`).emit('ice-candidate', {
        from: socket.userId,
        candidate
      });
    });

    socket.on('end-call', (data) => {
      const { targetUserId } = data;
      
      socket.to(`user-${targetUserId}`).emit('call-ended', {
        from: socket.userId
      });
    });

    // Handle screen sharing
    socket.on('start-screen-share', (data) => {
      const { sessionToken } = data;
      
      socket.to(`session-${sessionToken}`).emit('screen-share-started', {
        userId: socket.userId,
        username: socket.username
      });
    });

    socket.on('stop-screen-share', (data) => {
      const { sessionToken } = data;
      
      socket.to(`session-${sessionToken}`).emit('screen-share-stopped', {
        userId: socket.userId
      });
    });

    // Handle typing indicators
    socket.on('typing-start', (data) => {
      const { sessionToken } = data;
      
      socket.to(`session-${sessionToken}`).emit('user-typing', {
        userId: socket.userId,
        username: socket.username,
        isTyping: true
      });
    });

    socket.on('typing-stop', (data) => {
      const { sessionToken } = data;
      
      socket.to(`session-${sessionToken}`).emit('user-typing', {
        userId: socket.userId,
        username: socket.username,
        isTyping: false
      });
    });

    // Handle test messages
    socket.on('test-message', (data) => {
      console.log('Test message received:', data);
      socket.emit('test-response', {
        message: 'Test message received successfully!',
        originalData: data,
        timestamp: new Date()
      });
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`User ${socket.username} disconnected`);
      
      if (socket.userId) {
        // Update user presence
        await updateUserPresence(socket.userId, 'offline', '');
        
        // Notify collaborative sessions
        const rooms = Array.from(socket.rooms);
        rooms.forEach(room => {
          if (room.startsWith('session-')) {
            socket.to(room).emit('user-left', {
              userId: socket.userId,
              username: socket.username,
              timestamp: new Date()
            });
          }
        });
      }
    });
  });
};

// Helper function to update user presence
async function updateUserPresence(userId: string, status: string, activity: string) {
  try {
    await User.findByIdAndUpdate(userId, {
      'presence.status': status,
      'presence.activity': activity,
      'presence.lastSeen': new Date()
    });
  } catch (error) {
    console.error('Error updating user presence:', error);
  }
}

// Helper function to simulate code execution
async function simulateCodeExecution(code: string, language: string) {
  // Simulate execution delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock execution result
  return {
    output: `Code executed successfully!\nLanguage: ${language}\nCode length: ${code.length} characters`,
    executionTime: Math.floor(Math.random() * 1000) + 100,
    memoryUsed: Math.floor(Math.random() * 50000) + 10000,
    status: 'success'
  };
}

// Function to broadcast leaderboard updates
export const broadcastLeaderboardUpdate = (io: Server, contestId: string, leaderboard: any) => {
  io.to(`contest-${contestId}`).emit('leaderboard-update', {
    leaderboard,
    timestamp: new Date()
  });
};

// Function to broadcast achievement notifications
export const broadcastAchievement = (io: Server, userId: string, achievement: any) => {
  io.to(`user-${userId}`).emit('achievement-unlocked', {
    achievement,
    timestamp: new Date()
  });
};
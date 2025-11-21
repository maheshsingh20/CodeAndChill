import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import CollaborativeSession from '../models/CollaborativeSession';
import { User } from '../models/User';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Create a new collaborative session
router.post('/sessions', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { title, description, language, isPublic, maxParticipants, settings } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const sessionToken = uuidv4();

    const session = new CollaborativeSession({
      title,
      description,
      hostId: userId,
      participants: [{
        userId,
        username: user.name,
        joinedAt: new Date(),
        isActive: true
      }],
      language: language || 'javascript',
      isPublic: isPublic || false,
      maxParticipants: maxParticipants || 10,
      sessionToken,
      settings: {
        allowEdit: settings?.allowEdit || 'all-participants',
        allowChat: settings?.allowChat !== false,
        allowVoice: settings?.allowVoice || false,
        theme: settings?.theme || 'dark',
        fontSize: settings?.fontSize || 14
      }
    });

    await session.save();

    res.status(201).json({
      success: true,
      session: {
        id: session._id,
        title: session.title,
        description: session.description,
        sessionToken: session.sessionToken,
        language: session.language,
        isPublic: session.isPublic,
        maxParticipants: session.maxParticipants,
        participants: session.participants,
        settings: session.settings,
        createdAt: session.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating collaborative session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Join a collaborative session
router.post('/sessions/:sessionToken/join', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { sessionToken } = req.params;
    const userId = req.user?._id;

    console.log(`User ${userId} attempting to join session ${sessionToken}`);

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const session = await CollaborativeSession.findOne({ sessionToken });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (!session.isActive) {
      return res.status(400).json({ error: 'Session is not active' });
    }

    // Check if user is already in session
    const existingParticipant = session.participants.find(p => p.userId.toString() === userId.toString());
    if (existingParticipant) {
      console.log(`User ${user.name} rejoining session ${sessionToken}`);
      existingParticipant.isActive = true;
      existingParticipant.joinedAt = new Date();
    } else {
      // Check if session is full
      const activeParticipants = session.participants.filter(p => p.isActive).length;
      if (activeParticipants >= session.maxParticipants) {
        return res.status(400).json({ error: 'Session is full' });
      }

      console.log(`Adding user ${user.name} to session ${sessionToken}`);
      session.participants.push({
        userId,
        username: user.name,
        joinedAt: new Date(),
        isActive: true
      });

      // Add system message
      if (!session.chat) {
        session.chat = [];
      }
      if (!session.chatMessages) {
        session.chatMessages = [];
      }
      const systemMessage = {
        userId,
        username: 'System',
        message: `${user.name} joined the session`,
        timestamp: new Date(),
        type: 'system' as const
      };
      session.chat.push(systemMessage);
      session.chatMessages.push(systemMessage);
    }

    session.lastActivity = new Date();
    await session.save();

    console.log(`User ${user.name} successfully joined session ${sessionToken}. Participants: ${session.participants.length}`);

    res.json({
      success: true,
      session: {
        id: session._id,
        title: session.title,
        description: session.description,
        code: session.code || '',
        language: session.language,
        participants: session.participants,
        settings: session.settings,
        chatMessages: (session.chat || []).slice(-50), // Last 50 messages
        isHost: session.hostId.toString() === userId.toString()
      }
    });
  } catch (error) {
    console.error('Error joining session:', error);
    res.status(500).json({ error: 'Failed to join session' });
  }
});

// Leave a collaborative session
router.post('/sessions/:sessionToken/leave', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { sessionToken } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const session = await CollaborativeSession.findOne({ sessionToken });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const participant = session.participants.find(p => p.userId.toString() === userId.toString());
    if (participant) {
      participant.isActive = false;

      // Add system message
      const systemMessage = {
        userId,
        username: 'System',
        message: `${participant.username} left the session`,
        timestamp: new Date(),
        type: 'system' as const
      };
      if (!session.chat) session.chat = [];
      if (!session.chatMessages) session.chatMessages = [];
      session.chat.push(systemMessage);
      session.chatMessages.push(systemMessage);

      // If host leaves, transfer ownership to next active participant
      if (session.hostId.toString() === userId.toString()) {
        const nextHost = session.participants.find(p => p.isActive && p.userId.toString() !== userId.toString());
        if (nextHost) {
          session.hostId = nextHost.userId;
          const hostMessage = {
            userId: nextHost.userId,
            username: 'System',
            message: `${nextHost.username} is now the host`,
            timestamp: new Date(),
            type: 'system' as const
          };
          session.chat.push(hostMessage);
          session.chatMessages.push(hostMessage);
        } else {
          // No active participants left, deactivate session
          session.isActive = false;
        }
      }

      session.lastActivity = new Date();
      await session.save();
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error leaving session:', error);
    res.status(500).json({ error: 'Failed to leave session' });
  }
});

// Get user's sessions
router.get('/sessions/my', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const sessions = await CollaborativeSession.find({
      $or: [
        { hostId: userId },
        { 'participants.userId': userId }
      ],
      isActive: true
    }).sort({ lastActivity: -1 }).limit(20);

    const sessionData = sessions.map(session => ({
      id: session._id,
      title: session.title,
      description: session.description,
      sessionToken: session.sessionToken,
      language: session.language,
      isPublic: session.isPublic,
      participantCount: session.participants.filter(p => p.isActive).length,
      maxParticipants: session.maxParticipants,
      isHost: session.hostId.toString() === userId.toString(),
      lastActivity: session.lastActivity,
      createdAt: session.createdAt
    }));

    res.json({ success: true, sessions: sessionData });
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get public sessions
router.get('/sessions/public', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const sessions = await CollaborativeSession.find({
      isPublic: true,
      isActive: true
    })
    .sort({ lastActivity: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('hostId', 'username');

    const sessionData = sessions.map(session => ({
      id: session._id,
      title: session.title,
      description: session.description,
      sessionToken: session.sessionToken,
      language: session.language,
      hostUsername: (session.hostId as any).username,
      participantCount: session.participants.filter(p => p.isActive).length,
      maxParticipants: session.maxParticipants,
      lastActivity: session.lastActivity,
      createdAt: session.createdAt
    }));

    const total = await CollaborativeSession.countDocuments({
      isPublic: true,
      isActive: true
    });

    res.json({
      success: true,
      sessions: sessionData,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching public sessions:', error);
    res.status(500).json({ error: 'Failed to fetch public sessions' });
  }
});

// Update session settings
router.put('/sessions/:sessionToken/settings', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { sessionToken } = req.params;
    const { settings } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const session = await CollaborativeSession.findOne({ sessionToken, isActive: true });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Only host can update settings
    if (session.hostId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Only host can update settings' });
    }

    session.settings = { ...session.settings, ...settings };
    session.lastActivity = new Date();
    await session.save();

    res.json({ success: true, settings: session.settings });
  } catch (error) {
    console.error('Error updating session settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Update session code
router.put('/sessions/:sessionToken/code', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { sessionToken } = req.params;
    const { code, language } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const session = await CollaborativeSession.findOne({ sessionToken, isActive: true });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Check if user is participant
    const isParticipant = session.participants.some(p => p.userId.toString() === userId.toString() && p.isActive);
    if (!isParticipant) {
      return res.status(403).json({ error: 'Not a participant in this session' });
    }

    // Check if user can edit (based on settings)
    const canEdit = session.settings.allowEdit === 'all-participants' || 
                   session.hostId.toString() === userId.toString();
    
    if (!canEdit) {
      return res.status(403).json({ error: 'Not allowed to edit code in this session' });
    }

    // Update code and optionally language
    if (code !== undefined) {
      session.code = code;
    }
    
    if (language !== undefined) {
      const validLanguages = ['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust', 'html', 'css'];
      if (validLanguages.includes(language)) {
        session.language = language;
      }
    }
    
    session.lastActivity = new Date();
    await session.save();

    res.json({ 
      success: true, 
      code: session.code,
      language: session.language,
      message: 'Code updated successfully'
    });
  } catch (error) {
    console.error('Error updating session code:', error);
    res.status(500).json({ error: 'Failed to update code' });
  }
});

// Update session language
router.put('/sessions/:sessionToken/language', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { sessionToken } = req.params;
    const { language } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const session = await CollaborativeSession.findOne({ sessionToken, isActive: true });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Check if user is participant
    const isParticipant = session.participants.some(p => p.userId.toString() === userId.toString() && p.isActive);
    if (!isParticipant) {
      return res.status(403).json({ error: 'Not a participant in this session' });
    }

    // Check if user can edit (based on settings)
    const canEdit = session.settings.allowEdit === 'all-participants' || 
                   session.hostId.toString() === userId.toString();
    
    if (!canEdit) {
      return res.status(403).json({ error: 'Not allowed to change language in this session' });
    }

    // Validate language
    const validLanguages = ['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust', 'html', 'css'];
    if (!validLanguages.includes(language)) {
      return res.status(400).json({ error: 'Invalid language' });
    }

    // Update language
    session.language = language;
    session.lastActivity = new Date();

    // Add system message
    const user = await User.findById(userId);
    if (user) {
      const langMessage = {
        userId,
        username: 'System',
        message: `${user.name} changed the language to ${language}`,
        timestamp: new Date(),
        type: 'system' as const
      };
      
      if (!session.chat) session.chat = [];
      if (!session.chatMessages) session.chatMessages = [];
      
      session.chat.push(langMessage);
      session.chatMessages.push(langMessage);

      // Keep only last 100 messages
      if (session.chat.length > 100) {
        session.chat = session.chat.slice(-100);
      }
      if (session.chatMessages.length > 100) {
        session.chatMessages = session.chatMessages.slice(-100);
      }
    }

    await session.save();

    res.json({ 
      success: true, 
      language: session.language,
      message: 'Language updated successfully'
    });
  } catch (error) {
    console.error('Error updating session language:', error);
    res.status(500).json({ error: 'Failed to update language' });
  }
});

// Debug endpoint to check session state
router.get('/sessions/:sessionToken/debug', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { sessionToken } = req.params;
    const userId = req.user?._id;

    const session = await CollaborativeSession.findOne({ sessionToken });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const isParticipant = session.participants.some(p => 
      p.userId.toString() === userId?.toString()
    );

    res.json({
      success: true,
      debug: {
        sessionExists: !!session,
        sessionActive: session.isActive,
        userIsParticipant: isParticipant,
        participantCount: session.participants.length,
        activeParticipants: session.participants.filter(p => p.isActive).length,
        participants: session.participants.map(p => ({
          userId: p.userId.toString(),
          username: p.username,
          isActive: p.isActive
        })),
        settings: session.settings,
        language: session.language,
        chatMessageCount: session.chat?.length || 0,
        currentUserId: userId?.toString()
      }
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({ error: 'Debug failed' });
  }
});

// Send chat message
router.post('/sessions/:sessionToken/chat', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { sessionToken } = req.params;
    const { message } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const session = await CollaborativeSession.findOne({ sessionToken, isActive: true });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Check if user is participant
    const isParticipant = session.participants.some(p => p.userId.toString() === userId.toString() && p.isActive);
    if (!isParticipant) {
      return res.status(403).json({ error: 'Not a participant in this session' });
    }

    // Check if chat is allowed
    if (!session.settings.allowChat) {
      return res.status(403).json({ error: 'Chat is disabled in this session' });
    }

    const chatMessage = {
      userId,
      username: user.name,
      message: message.trim(),
      timestamp: new Date(),
      type: 'message' as const
    };

    if (!session.chat) session.chat = [];
    if (!session.chatMessages) session.chatMessages = [];
    
    session.chat.push(chatMessage);
    session.chatMessages.push(chatMessage);
    
    // Keep only last 100 messages
    if (session.chat.length > 100) {
      session.chat = session.chat.slice(-100);
    }
    if (session.chatMessages.length > 100) {
      session.chatMessages = session.chatMessages.slice(-100);
    }

    session.lastActivity = new Date();
    await session.save();

    res.json({ success: true, message: chatMessage });
  } catch (error) {
    console.error('Error sending chat message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
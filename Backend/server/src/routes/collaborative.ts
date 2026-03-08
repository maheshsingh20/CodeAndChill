import { Router, Request, Response } from 'express';
import { CollaborativeSession } from '../models/CollaborativeSession';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Get session details
router.get('/session/:code', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code } = req.params;

    const session = await CollaborativeSession.findOne({ 
      sessionCode: code, 
      isActive: true 
    });

    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    res.json({
      sessionCode: session.sessionCode,
      hostId: session.hostId,
      hostName: session.hostName,
      participants: session.participants,
      currentCode: session.currentCode,
      language: session.language,
      controllerId: session.controllerId,
      chatHistory: session.chatHistory,
      createdAt: session.createdAt
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's active sessions
router.get('/my-sessions', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    const sessions = await CollaborativeSession.find({
      isActive: true,
      'participants.userId': userId
    }).sort({ updatedAt: -1 });

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// End session (host only)
router.delete('/session/:code', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code } = req.params;
    const userId = req.user?._id;

    const session = await CollaborativeSession.findOne({ sessionCode: code });

    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    if (session.hostId !== userId) {
      res.status(403).json({ message: 'Only the host can end the session' });
      return;
    }

    session.isActive = false;
    await session.save();

    res.json({ message: 'Session ended successfully' });
  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

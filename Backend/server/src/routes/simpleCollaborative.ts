import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory storage for simplicity (replace with database in production)
const sessions = new Map<string, {
  id: string;
  title: string;
  hostId: string;
  hostName: string;
  participants: Array<{
    userId: string;
    username: string;
    joinedAt: Date;
    isActive: boolean;
  }>;
  code: string;
  language: string;
  isActive: boolean;
  createdAt: Date;
  lastActivity: Date;
  chat: Array<{
    userId: string;
    username: string;
    message: string;
    timestamp: Date;
    type: 'message' | 'system';
  }>;
}>();

// Create a simple session
router.post('/create', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { title = 'Test Session', language = 'javascript' } = req.body;
    const userId = req.user?._id?.toString();

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const sessionId = uuidv4();
    const sessionData = {
      id: sessionId,
      title,
      hostId: userId,
      hostName: user.name,
      participants: [{
        userId,
        username: user.name,
        joinedAt: new Date(),
        is
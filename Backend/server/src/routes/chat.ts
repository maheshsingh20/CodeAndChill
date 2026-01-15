import express from 'express';
import Chat from '../models/Chat';
import { User } from '../models/User';
import { authMiddleware } from '../middleware/auth';
import { chatService } from '../services/chatService';

const router = express.Router();

// Get all chats for current user
router.get('/chats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?._id;
    
    const chats = await Chat.find({
      participants: userId
    })
      .sort({ lastMessageTime: -1 })
      .lean();

    // Add online status for participants
    const chatsWithStatus = chats.map(chat => ({
      ...chat,
      participantDetails: chat.participantDetails.map(p => ({
        ...p,
        isOnline: chatService.isUserOnline(p.userId.toString())
      }))
    }));

    res.json(chatsWithStatus);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Get or create chat with another user
router.post('/chats/direct', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?._id;
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ error: 'Recipient ID is required' });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [userId, recipientId] },
      isGroup: false
    });

    if (!chat) {
      // Get user details
      const [currentUser, recipient] = await Promise.all([
        User.findById(userId).select('name avatar'),
        User.findById(recipientId).select('name avatar')
      ]);

      if (!currentUser || !recipient) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Create new chat
      chat = new Chat({
        participants: [userId, recipientId],
        participantDetails: [
          {
            userId: currentUser._id,
            name: currentUser.name,
            avatar: currentUser.avatar
          },
          {
            userId: recipient._id,
            name: recipient.name,
            avatar: recipient.avatar
          }
        ],
        messages: [],
        isGroup: false,
        unreadCount: new Map()
      });

      await chat.save();
    }

    res.json(chat);
  } catch (error) {
    console.error('Error creating/fetching chat:', error);
    res.status(500).json({ error: 'Failed to create/fetch chat' });
  }
});

// Get chat by ID with messages
router.get('/chats/:chatId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?._id;
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p.toString() === userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Add online status
    const chatWithStatus = {
      ...chat.toObject(),
      participantDetails: chat.participantDetails.map(p => ({
        ...p,
        isOnline: chatService.isUserOnline(p.userId.toString())
      }))
    };

    res.json(chatWithStatus);
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
});

// Search users to start chat
router.get('/users/search', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?._id;
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const users = await User.find({
      _id: { $ne: userId },
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    })
      .select('name email avatar')
      .limit(20);

    // Add online status
    const usersWithStatus = users.map(user => ({
      ...user.toObject(),
      isOnline: chatService.isUserOnline(user._id.toString())
    }));

    res.json(usersWithStatus);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// Get online users
router.get('/users/online', authMiddleware, async (req, res) => {
  try {
    const onlineUsers = chatService.getOnlineUsers();
    res.json(onlineUsers);
  } catch (error) {
    console.error('Error fetching online users:', error);
    res.status(500).json({ error: 'Failed to fetch online users' });
  }
});

// Delete chat
router.delete('/chats/:chatId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?._id;
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p.toString() === userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Chat.findByIdAndDelete(chatId);
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

export default router;

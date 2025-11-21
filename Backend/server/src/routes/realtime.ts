import express from 'express';
import { Server } from 'socket.io';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import UserProgress from '../models/UserProgress';
import { User } from '../models/User';
import ContestLeaderboard from '../models/ContestLeaderboard';

const router = express.Router();

// Real-time progress tracking
router.post('/progress/update', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { courseId, lessonId, progressData, timeSpent } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Update progress in database
    const progress = await UserProgress.findOneAndUpdate(
      { userId, courseId },
      {
        $addToSet: { completedLessons: lessonId },
        $set: { 
          currentLesson: lessonId,
          lastAccessed: new Date()
        },
        $inc: { timeSpent: timeSpent || 0 }
      },
      { upsert: true, new: true }
    );

    // Calculate progress percentage
    const totalLessons = progressData?.totalLessons || 1;
    const completedCount = progress.completedLessons.length;
    progress.progressPercentage = Math.round((completedCount / totalLessons) * 100);
    await progress.save();

    // Emit real-time update to user
    const io = req.app.get('io') as Server;
    io.to(`user-${userId}`).emit('progressUpdate', {
      courseId,
      lessonId,
      progressPercentage: progress.progressPercentage,
      completedLessons: progress.completedLessons,
      timeSpent: progress.timeSpent,
      timestamp: new Date()
    });

    // Check for achievements
    const achievements = await checkAchievements(userId, progress);
    if (achievements.length > 0) {
      io.to(`user-${userId}`).emit('achievementUnlocked', achievements);
    }

    res.json({
      success: true,
      progress: {
        progressPercentage: progress.progressPercentage,
        completedLessons: progress.completedLessons,
        timeSpent: progress.timeSpent
      },
      achievements
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Real-time leaderboard updates
router.get('/leaderboard/live/:contestId', async (req, res) => {
  try {
    const { contestId } = req.params;
    
    const leaderboard = await ContestLeaderboard.find({ contestId })
      .sort({ totalScore: -1, totalPenalty: 1, lastSubmissionTime: 1 })
      .limit(50)
      .populate('userId', 'name avatar');

    // Add ranks
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    res.json({
      success: true,
      leaderboard,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error fetching live leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Real-time notifications
router.post('/notifications/send', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { userId, type, title, message, data } = req.body;
    const senderId = req.user?._id;

    const notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      data,
      timestamp: new Date(),
      senderId
    };

    // Emit notification to specific user
    const io = req.app.get('io') as Server;
    io.to(`user-${userId}`).emit('notification', notification);

    res.json({ success: true, notification });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Live activity feed
router.get('/activity/live', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?._id;
    
    // Get recent activities from various sources
    const activities = await getRecentActivities(userId);
    
    res.json({
      success: true,
      activities,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching live activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// Real-time user presence
router.post('/presence/update', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { status, activity } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Update user presence
    await User.findByIdAndUpdate(userId, {
      'presence.status': status,
      'presence.activity': activity,
      'presence.lastSeen': new Date()
    });

    // Emit presence update
    const io = req.app.get('io') as Server;
    io.emit('userPresenceUpdate', {
      userId,
      status,
      activity,
      timestamp: new Date()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating presence:', error);
    res.status(500).json({ error: 'Failed to update presence' });
  }
});

// Helper function to check achievements
async function checkAchievements(userId: string, progress: any) {
  const achievements = [];
  
  // First lesson completed
  if (progress.completedLessons.length === 1) {
    achievements.push({
      id: 'first-lesson',
      title: 'Getting Started!',
      description: 'Completed your first lesson',
      icon: '🎯',
      points: 10
    });
  }
  
  // Course completion milestones
  if (progress.progressPercentage === 25) {
    achievements.push({
      id: 'quarter-complete',
      title: 'Quarter Master',
      description: '25% course completion',
      icon: '🏃‍♂️',
      points: 25
    });
  }
  
  if (progress.progressPercentage === 50) {
    achievements.push({
      id: 'half-complete',
      title: 'Halfway Hero',
      description: '50% course completion',
      icon: '⭐',
      points: 50
    });
  }
  
  if (progress.progressPercentage === 100) {
    achievements.push({
      id: 'course-complete',
      title: 'Course Conqueror',
      description: 'Completed entire course',
      icon: '🏆',
      points: 100
    });
  }
  
  // Time-based achievements
  if (progress.timeSpent >= 60) { // 1 hour
    achievements.push({
      id: 'dedicated-learner',
      title: 'Dedicated Learner',
      description: 'Spent 1 hour learning',
      icon: '📚',
      points: 20
    });
  }
  
  return achievements;
}

// Helper function to get recent activities
async function getRecentActivities(userId: string) {
  // This would aggregate activities from various collections
  // For now, returning mock data structure
  return [
    {
      id: '1',
      type: 'lesson_completed',
      title: 'Completed "Introduction to React"',
      timestamp: new Date(),
      icon: '✅'
    },
    {
      id: '2',
      type: 'problem_solved',
      title: 'Solved "Two Sum" problem',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      icon: '🧩'
    }
  ];
}

export default router;
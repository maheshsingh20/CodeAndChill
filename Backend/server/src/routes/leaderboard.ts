import express from 'express';
import Leaderboard from '../models/Leaderboard';
import User from '../models/User';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get global leaderboard
router.get('/global', async (req, res) => {
  try {
    const { page = 1, limit = 50, sortBy = 'totalScore' } = req.query;
    
    const validSortFields = ['totalScore', 'problemsSolved', 'coursesCompleted', 'currentStreak'];
    const sortField = validSortFields.includes(sortBy as string) ? sortBy as string : 'totalScore';
    
    const leaderboard = await Leaderboard.find()
      .populate('userId', 'username email profilePicture')
      .sort({ [sortField]: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Leaderboard.countDocuments();

    res.json({
      leaderboard,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get user's rank and nearby users
router.get('/rank', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const userEntry = await Leaderboard.findOne({ userId })
      .populate('userId', 'username email profilePicture');
    
    if (!userEntry) {
      return res.status(404).json({ error: 'User not found in leaderboard' });
    }

    // Get users around current user's rank
    const range = 5;
    const startRank = Math.max(1, userEntry.rank - range);
    const endRank = userEntry.rank + range;

    const nearbyUsers = await Leaderboard.find({
      rank: { $gte: startRank, $lte: endRank }
    })
    .populate('userId', 'username email profilePicture')
    .sort({ rank: 1 });

    res.json({
      userRank: userEntry,
      nearbyUsers,
      totalUsers: await Leaderboard.countDocuments()
    });
  } catch (error) {
    console.error('Error fetching user rank:', error);
    res.status(500).json({ error: 'Failed to fetch user rank' });
  }
});

// Get top performers by category
router.get('/top/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;

    const validCategories = {
      'problems': 'problemsSolved',
      'courses': 'coursesCompleted',
      'streak': 'currentStreak',
      'quiz': 'averageQuizScore',
      'time': 'totalStudyTime'
    };

    const sortField = validCategories[category as keyof typeof validCategories];
    if (!sortField) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const topUsers = await Leaderboard.find()
      .populate('userId', 'username email profilePicture')
      .sort({ [sortField]: -1 })
      .limit(Number(limit));

    res.json({
      category,
      topUsers
    });
  } catch (error) {
    console.error('Error fetching top performers:', error);
    res.status(500).json({ error: 'Failed to fetch top performers' });
  }
});

// Get leaderboard statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Leaderboard.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          avgScore: { $avg: '$totalScore' },
          avgProblems: { $avg: '$problemsSolved' },
          avgCourses: { $avg: '$coursesCompleted' },
          avgQuizScore: { $avg: '$averageQuizScore' },
          avgStudyTime: { $avg: '$totalStudyTime' },
          maxScore: { $max: '$totalScore' },
          maxProblems: { $max: '$problemsSolved' },
          maxStreak: { $max: '$currentStreak' }
        }
      }
    ]);

    // Get distribution data
    const scoreDistribution = await Leaderboard.aggregate([
      {
        $bucket: {
          groupBy: '$totalScore',
          boundaries: [0, 100, 500, 1000, 2000, 5000, 10000, Infinity],
          default: 'Other',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    const problemsDistribution = await Leaderboard.aggregate([
      {
        $bucket: {
          groupBy: '$problemsSolved',
          boundaries: [0, 10, 25, 50, 100, 200, Infinity],
          default: 'Other',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    res.json({
      overview: stats[0] || {},
      distributions: {
        score: scoreDistribution,
        problems: problemsDistribution
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard stats' });
  }
});

// Get user's achievement progress
router.get('/achievements', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const userEntry = await Leaderboard.findOne({ userId });
    if (!userEntry) {
      return res.status(404).json({ error: 'User not found in leaderboard' });
    }

    // Define achievement criteria
    const achievements = [
      {
        id: 'first_problem',
        title: 'First Steps',
        description: 'Solve your first problem',
        icon: '🎯',
        criteria: { problemsSolved: 1 },
        unlocked: userEntry.problemsSolved >= 1
      },
      {
        id: 'problem_solver_10',
        title: 'Problem Solver',
        description: 'Solve 10 problems',
        icon: '🧩',
        criteria: { problemsSolved: 10 },
        unlocked: userEntry.problemsSolved >= 10
      },
      {
        id: 'problem_solver_50',
        title: 'Code Warrior',
        description: 'Solve 50 problems',
        icon: '⚔️',
        criteria: { problemsSolved: 50 },
        unlocked: userEntry.problemsSolved >= 50
      },
      {
        id: 'problem_solver_100',
        title: 'Code Master',
        description: 'Solve 100 problems',
        icon: '👑',
        criteria: { problemsSolved: 100 },
        unlocked: userEntry.problemsSolved >= 100
      },
      {
        id: 'streak_7',
        title: 'Consistent Learner',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        criteria: { currentStreak: 7 },
        unlocked: userEntry.currentStreak >= 7
      },
      {
        id: 'streak_30',
        title: 'Dedication Master',
        description: 'Maintain a 30-day streak',
        icon: '💎',
        criteria: { currentStreak: 30 },
        unlocked: userEntry.currentStreak >= 30
      },
      {
        id: 'course_complete_1',
        title: 'Graduate',
        description: 'Complete your first course',
        icon: '🎓',
        criteria: { coursesCompleted: 1 },
        unlocked: userEntry.coursesCompleted >= 1
      },
      {
        id: 'course_complete_5',
        title: 'Scholar',
        description: 'Complete 5 courses',
        icon: '📚',
        criteria: { coursesCompleted: 5 },
        unlocked: userEntry.coursesCompleted >= 5
      },
      {
        id: 'quiz_master',
        title: 'Quiz Champion',
        description: 'Maintain 90%+ average quiz score',
        icon: '🏆',
        criteria: { averageQuizScore: 90 },
        unlocked: userEntry.averageQuizScore >= 90
      },
      {
        id: 'top_10',
        title: 'Elite Performer',
        description: 'Reach top 10 in global leaderboard',
        icon: '⭐',
        criteria: { rank: 10 },
        unlocked: userEntry.rank <= 10
      }
    ];

    // Add progress for locked achievements
    const achievementsWithProgress = achievements.map(achievement => {
      if (!achievement.unlocked) {
        const criteriaKey = Object.keys(achievement.criteria)[0] as keyof typeof userEntry;
        const targetValue = achievement.criteria[criteriaKey as keyof typeof achievement.criteria];
        const currentValue = userEntry[criteriaKey] as number;
        
        return {
          ...achievement,
          progress: currentValue,
          maxProgress: targetValue,
          progressPercentage: Math.min((currentValue / targetValue) * 100, 100)
        };
      }
      return achievement;
    });

    res.json({
      achievements: achievementsWithProgress,
      unlockedCount: achievements.filter(a => a.unlocked).length,
      totalCount: achievements.length
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

export default router;
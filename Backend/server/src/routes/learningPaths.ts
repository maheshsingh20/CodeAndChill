import express from 'express';
import LearningPath from '../models/LearningPath';
import UserLearningPath from '../models/UserLearningPath';
import { Course } from '../models/Course';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all learning paths
router.get('/', async (req, res) => {
  try {
    const { difficulty, tags, page = 1, limit = 10 } = req.query;
    
    const filter: any = { isPublic: true };
    if (difficulty) filter.difficulty = difficulty;
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }
    
    const paths = await LearningPath.find(filter)
      .populate('createdBy', 'name')
      .populate('courses.courseId', 'courseTitle slug')
      .sort({ enrollmentCount: -1, averageRating: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await LearningPath.countDocuments(filter);
    
    // Transform courseTitle to title for frontend compatibility
    const transformedPaths = paths.map(path => {
      const pathObj = path.toObject();
      if (pathObj.courses) {
        pathObj.courses = pathObj.courses.map((course: any) => ({
          ...course,
          courseId: {
            ...course.courseId,
            title: course.courseId.courseTitle,
            description: `Learn ${course.courseId.courseTitle}`,
            difficulty: 'intermediate'
          }
        }));
      }
      return pathObj;
    });
    
    res.json({
      paths: transformedPaths,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    res.status(500).json({ error: 'Failed to fetch learning paths' });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  try {
    // For now, return static categories with dynamic stats
    const categories = [
      { _id: 'web-development', name: 'Web Development', description: 'Master modern web technologies from frontend to backend' },
      { _id: 'mobile-development', name: 'Mobile Development', description: 'Build native and cross-platform mobile applications' },
      { _id: 'data-science', name: 'Data Science & AI', description: 'Explore machine learning, AI, and data analytics' },
      { _id: 'backend-development', name: 'Backend Development', description: 'Server-side programming, APIs, and database management' },
      { _id: 'cybersecurity', name: 'Cybersecurity', description: 'Protect systems and learn ethical hacking techniques' },
      { _id: 'ui-ux-design', name: 'UI/UX Design', description: 'Design beautiful and user-friendly interfaces' },
      { _id: 'programming-fundamentals', name: 'Programming Fundamentals', description: 'Learn the basics of programming and computer science' },
      { _id: 'business-tech', name: 'Business & Technology', description: 'Bridge the gap between technology and business strategy' }
    ];

    // Add dynamic stats for each category
    const categoriesWithStats = await Promise.all(categories.map(async (category) => {
      const pathCount = await LearningPath.countDocuments({ 
        isPublic: true, 
        tags: { $in: [category._id.replace('-', ' ')] } 
      });
      
      const paths = await LearningPath.find({ 
        isPublic: true, 
        tags: { $in: [category._id.replace('-', ' ')] } 
      });
      
      const totalEnrollments = paths.reduce((sum, path) => sum + (path.enrollmentCount || 0), 0);
      const averageRating = paths.length > 0 
        ? paths.reduce((sum, path) => sum + (path.averageRating || 0), 0) / paths.length 
        : 0;

      return {
        ...category,
        pathCount,
        totalEnrollments,
        averageRating: Math.round(averageRating * 10) / 10,
        difficulty: 'mixed',
        estimatedTime: '2-6 months'
      };
    }));

    res.json(categoriesWithStats);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get available tags
router.get('/tags', async (req, res) => {
  try {
    const tags = await LearningPath.distinct('tags', { isPublic: true });
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// Search learning paths
router.get('/search', async (req, res) => {
  try {
    const { 
      query, 
      difficulty, 
      duration, 
      rating, 
      tags, 
      sortBy = 'relevance', 
      page = 1, 
      limit = 20 
    } = req.query;

    const filter: any = { isPublic: true };

    // Text search
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query as string, 'i')] } }
      ];
    }

    // Difficulty filter
    if (difficulty) {
      const difficultyArray = Array.isArray(difficulty) ? difficulty : (difficulty as string).split(',');
      filter.difficulty = { $in: difficultyArray };
    }

    // Rating filter
    if (rating) {
      filter.averageRating = { $gte: Number(rating) };
    }

    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : (tags as string).split(',');
      filter.tags = { $in: tagArray };
    }

    // Sorting
    let sort: any = {};
    switch (sortBy) {
      case 'popular':
        sort = { enrollmentCount: -1 };
        break;
      case 'rating':
        sort = { averageRating: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'duration':
        sort = { estimatedDuration: 1 };
        break;
      default:
        sort = { createdAt: -1 }; // Default to newest for relevance
    }

    const paths = await LearningPath.find(filter)
      .populate('createdBy', 'name')
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await LearningPath.countDocuments(filter);

    res.json({
      paths,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error searching learning paths:', error);
    res.status(500).json({ error: 'Failed to search learning paths' });
  }
});

// Get global stats
router.get('/stats/global', async (req, res) => {
  try {
    const totalPaths = await LearningPath.countDocuments({ isPublic: true });
    const paths = await LearningPath.find({ isPublic: true });
    
    const totalStudents = paths.reduce((sum, path) => sum + (path.enrollmentCount || 0), 0);
    const averageRating = paths.length > 0 
      ? paths.reduce((sum, path) => sum + (path.averageRating || 0), 0) / paths.length 
      : 0;
    
    const totalCategories = await LearningPath.distinct('tags', { isPublic: true });

    res.json({
      totalPaths,
      totalStudents,
      averageRating: Math.round(averageRating * 10) / 10,
      totalCategories: totalCategories.length
    });
  } catch (error) {
    console.error('Error fetching global stats:', error);
    res.status(500).json({ error: 'Failed to fetch global stats' });
  }
});

// Get learning path by ID
router.get('/:pathId', async (req, res) => {
  try {
    const { pathId } = req.params;
    
    const path = await LearningPath.findById(pathId)
      .populate('createdBy', 'name')
      .populate('courses.courseId', 'courseTitle slug modules')
      .populate('milestones.courseIds', 'courseTitle');
    
    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }
    
    // Transform courseTitle to title for frontend compatibility
    const transformedPath = path.toObject();
    if (transformedPath.courses) {
      transformedPath.courses = transformedPath.courses.map((course: any) => ({
        ...course,
        courseId: {
          ...course.courseId,
          title: course.courseId.courseTitle,
          description: `Learn ${course.courseId.courseTitle}`,
          difficulty: 'intermediate'
        }
      }));
    }
    
    res.json(transformedPath);
  } catch (error) {
    console.error('Error fetching learning path:', error);
    res.status(500).json({ error: 'Failed to fetch learning path' });
  }
});

// Enroll in learning path
router.post('/:pathId/enroll', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { pathId } = req.params;
    const userId = req.user._id;
    
    const path = await LearningPath.findById(pathId);
    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }
    
    // Check if already enrolled
    const existingEnrollment = await UserLearningPath.findOne({ userId, pathId });
    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this learning path' });
    }
    
    // Create enrollment
    const enrollment = new UserLearningPath({
      userId,
      pathId,
      progress: path.courses.map(course => ({
        courseId: course.courseId,
        progress: 0,
        timeSpent: 0
      })),
      milestoneProgress: path.milestones.map((milestone, index) => ({
        milestoneId: milestone._id || index.toString(),
        isCompleted: false
      }))
    });
    
    await enrollment.save();
    
    // Update enrollment count
    await LearningPath.findByIdAndUpdate(pathId, {
      $inc: { enrollmentCount: 1 }
    });
    
    res.json({ message: 'Successfully enrolled in learning path', enrollment });
  } catch (error) {
    console.error('Error enrolling in learning path:', error);
    res.status(500).json({ error: 'Failed to enroll in learning path' });
  }
});

// Get user's learning path progress
router.get('/:pathId/progress', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { pathId } = req.params;
    const userId = req.user._id;
    
    const progress = await UserLearningPath.findOne({ userId, pathId })
      .populate('pathId', 'title description courses milestones')
      .populate('progress.courseId', 'courseTitle slug')
      .populate('currentCourseId', 'courseTitle');
    
    if (!progress) {
      return res.status(404).json({ error: 'Not enrolled in this learning path' });
    }
    
    // Transform courseTitle to title for frontend compatibility with null checks
    const progressObj = progress.toObject();
    if (progressObj.progress) {
      progressObj.progress = progressObj.progress.map((p: any) => {
        // Handle null or undefined courseId
        if (!p.courseId) {
          return {
            ...p,
            courseId: {
              _id: 'unknown',
              title: 'Unknown Course',
              description: 'Course not found',
              slug: 'unknown'
            }
          };
        }
        
        // Handle courseId as object
        return {
          ...p,
          courseId: {
            ...p.courseId,
            title: p.courseId.courseTitle || p.courseId.title || 'Untitled Course',
            description: p.courseId.courseTitle ? `Learn ${p.courseId.courseTitle}` : 'Course description',
            slug: p.courseId.slug || 'unknown'
          }
        };
      });
    }
    
    res.json(progressObj);
  } catch (error) {
    console.error('Error fetching learning path progress:', error);
    res.status(500).json({ error: 'Failed to fetch learning path progress' });
  }
});

// Update course progress in learning path
router.post('/:pathId/progress/:courseId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { pathId, courseId } = req.params;
    const { progress, timeSpent } = req.body;
    const userId = req.user._id;
    
    const userPath = await UserLearningPath.findOne({ userId, pathId });
    if (!userPath) {
      return res.status(404).json({ error: 'Not enrolled in this learning path' });
    }
    
    // Update course progress
    const courseProgressIndex = userPath.progress.findIndex(
      p => p.courseId.toString() === courseId
    );
    
    if (courseProgressIndex === -1) {
      return res.status(404).json({ error: 'Course not found in learning path' });
    }
    
    userPath.progress[courseProgressIndex].progress = progress;
    userPath.progress[courseProgressIndex].timeSpent += timeSpent || 0;
    
    if (progress === 100 && !userPath.progress[courseProgressIndex].completedAt) {
      userPath.progress[courseProgressIndex].completedAt = new Date();
    }
    
    // Update overall progress
    const totalProgress = userPath.progress.reduce((sum, p) => sum + p.progress, 0);
    userPath.overallProgress = Math.round(totalProgress / userPath.progress.length);
    
    // Update total time spent
    userPath.totalTimeSpent = userPath.progress.reduce((sum, p) => sum + p.timeSpent, 0);
    
    // Check if path is completed
    if (userPath.overallProgress === 100 && !userPath.completedAt) {
      userPath.completedAt = new Date();
    }
    
    // Update last accessed
    userPath.lastAccessedAt = new Date();
    
    await userPath.save();
    
    res.json({ message: 'Progress updated successfully', progress: userPath });
  } catch (error) {
    console.error('Error updating learning path progress:', error);
    res.status(500).json({ error: 'Failed to update learning path progress' });
  }
});

// Get user's enrolled learning paths
router.get('/user/enrolled', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user._id;
    
    const enrolledPaths = await UserLearningPath.find({ userId, isActive: true })
      .populate('pathId', 'title description icon difficulty estimatedDuration tags')
      .sort({ lastAccessedAt: -1 });
    
    res.json(enrolledPaths);
  } catch (error) {
    console.error('Error fetching enrolled learning paths:', error);
    res.status(500).json({ error: 'Failed to fetch enrolled learning paths' });
  }
});

// Rate learning path
router.post('/:pathId/rate', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { pathId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user._id;
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const userPath = await UserLearningPath.findOne({ userId, pathId });
    if (!userPath) {
      return res.status(404).json({ error: 'Not enrolled in this learning path' });
    }
    
    const oldRating = userPath.rating;
    userPath.rating = rating;
    if (review) userPath.review = review;
    
    await userPath.save();
    
    // Update learning path average rating
    const path = await LearningPath.findById(pathId);
    if (path) {
      if (oldRating) {
        // Update existing rating
        const totalRatingPoints = path.averageRating * path.totalRatings;
        const newTotalPoints = totalRatingPoints - oldRating + rating;
        path.averageRating = newTotalPoints / path.totalRatings;
      } else {
        // New rating
        const totalRatingPoints = path.averageRating * path.totalRatings;
        path.totalRatings += 1;
        path.averageRating = (totalRatingPoints + rating) / path.totalRatings;
      }
      
      await path.save();
    }
    
    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Error rating learning path:', error);
    res.status(500).json({ error: 'Failed to rate learning path' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { timeframe = 'month', pathId } = req.query;
    
    // Mock leaderboard data for now
    const users = [
      {
        id: '1',
        name: 'Alex Chen',
        avatar: '/avatars/alex.jpg',
        rank: 1,
        previousRank: 2,
        totalPoints: 15420,
        completedPaths: 8,
        currentStreak: 45,
        longestStreak: 67,
        totalHours: 234,
        achievements: [],
        joinedDate: '2023-06-15'
      }
    ];

    res.json({ users, pathLeaderboards: [] });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get user analytics
router.get('/user/analytics', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user._id;
    const { timeframe = 'month' } = req.query;
    
    // Mock analytics data for now
    const analytics = {
      totalHours: 234,
      completedPaths: 8,
      currentStreak: 45,
      longestStreak: 67,
      averageRating: 4.8,
      totalPoints: 15420,
      rank: 3,
      weeklyGoal: 10,
      weeklyProgress: 7.5
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ error: 'Failed to fetch user analytics' });
  }
});

// Get user stats
router.get('/user/stats', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user._id;
    
    const enrolledPaths = await UserLearningPath.countDocuments({ userId, isActive: true });
    const completedPaths = await UserLearningPath.countDocuments({ userId, overallProgress: 100 });
    
    // Mock additional stats
    const stats = {
      totalHours: 234,
      completedPaths,
      currentStreak: 45,
      longestStreak: 67,
      averageRating: 4.8,
      totalPoints: 15420,
      rank: 3,
      weeklyGoal: 10,
      weeklyProgress: 7.5
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

// Get weekly activity
router.get('/user/activity/weekly', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user._id;
    
    // Mock weekly activity data
    const weeklyActivity = [
      { date: '2024-01-08', hours: 2.5, courses: 1, points: 150 },
      { date: '2024-01-09', hours: 1.8, courses: 0, points: 80 },
      { date: '2024-01-10', hours: 3.2, courses: 2, points: 220 },
      { date: '2024-01-11', hours: 0, courses: 0, points: 0 },
      { date: '2024-01-12', hours: 2.1, courses: 1, points: 180 },
      { date: '2024-01-13', hours: 1.5, courses: 1, points: 120 },
      { date: '2024-01-14', hours: 2.8, courses: 1, points: 200 }
    ];

    res.json(weeklyActivity);
  } catch (error) {
    console.error('Error fetching weekly activity:', error);
    res.status(500).json({ error: 'Failed to fetch weekly activity' });
  }
});

// Create learning path
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user._id;
    const pathData = req.body;
    
    const newPath = new LearningPath({
      ...pathData,
      createdBy: userId,
      enrollmentCount: 0,
      averageRating: 0,
      totalRatings: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newPath.save();
    
    res.status(201).json(newPath);
  } catch (error) {
    console.error('Error creating learning path:', error);
    res.status(500).json({ error: 'Failed to create learning path' });
  }
});

// Update learning path
router.put('/:pathId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { pathId } = req.params;
    const userId = req.user._id;
    const pathData = req.body;
    
    const path = await LearningPath.findById(pathId);
    
    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }
    
    if (path.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this path' });
    }
    
    Object.assign(path, pathData);
    path.updatedAt = new Date();
    
    await path.save();
    
    res.json(path);
  } catch (error) {
    console.error('Error updating learning path:', error);
    res.status(500).json({ error: 'Failed to update learning path' });
  }
});

// Delete learning path
router.delete('/:pathId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { pathId } = req.params;
    const userId = req.user._id;
    
    const path = await LearningPath.findById(pathId);
    
    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }
    
    if (path.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this path' });
    }
    
    await path.deleteOne();
    
    res.json({ message: 'Learning path deleted successfully' });
  } catch (error) {
    console.error('Error deleting learning path:', error);
    res.status(500).json({ error: 'Failed to delete learning path' });
  }
});

export default router;

// Get course content with lessons
router.get('/:pathId/courses/:courseId/content', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { pathId, courseId } = req.params;
    const userId = req.user._id;
    
    // Check if user is enrolled
    const userPath = await UserLearningPath.findOne({ userId, pathId });
    if (!userPath) {
      return res.status(403).json({ error: 'Not enrolled in this learning path' });
    }
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Error fetching course content:', error);
    res.status(500).json({ error: 'Failed to fetch course content' });
  }
});

// Discussions
router.get('/:pathId/discussions', async (req, res) => {
  try {
    const { pathId } = req.params;
    const { filter = 'all', page = 1, limit = 20 } = req.query;
    
    const Discussion = require('../models/Discussion').default;
    
    let query: any = { learningPathId: pathId };
    let sort: any = { createdAt: -1 };
    
    if (filter === 'popular') {
      sort = { likes: -1, createdAt: -1 };
    } else if (filter === 'pinned') {
      query.isPinned = true;
    }
    
    const discussions = await Discussion.find(query)
      .populate('userId', 'name email')
      .populate('replies.userId', 'name email')
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await Discussion.countDocuments(query);
    
    res.json({
      discussions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching discussions:', error);
    res.status(500).json({ error: 'Failed to fetch discussions' });
  }
});

router.post('/:pathId/discussions', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { pathId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;
    
    const Discussion = require('../models/Discussion').default;
    
    const discussion = new Discussion({
      learningPathId: pathId,
      userId,
      content
    });
    
    await discussion.save();
    await discussion.populate('userId', 'name email');
    
    res.json(discussion);
  } catch (error) {
    console.error('Error creating discussion:', error);
    res.status(500).json({ error: 'Failed to create discussion' });
  }
});

router.post('/:pathId/discussions/:discussionId/like', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { discussionId } = req.params;
    const userId = req.user._id;
    
    const Discussion = require('../models/Discussion').default;
    
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }
    
    const likeIndex = discussion.likes.indexOf(userId);
    if (likeIndex > -1) {
      discussion.likes.splice(likeIndex, 1);
    } else {
      discussion.likes.push(userId);
    }
    
    await discussion.save();
    
    res.json({ likes: discussion.likes.length, isLiked: likeIndex === -1 });
  } catch (error) {
    console.error('Error liking discussion:', error);
    res.status(500).json({ error: 'Failed to like discussion' });
  }
});

router.post('/:pathId/discussions/:discussionId/reply', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { discussionId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;
    
    const Discussion = require('../models/Discussion').default;
    
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }
    
    discussion.replies.push({
      userId,
      content,
      createdAt: new Date()
    });
    
    await discussion.save();
    await discussion.populate('replies.userId', 'name email');
    
    res.json(discussion);
  } catch (error) {
    console.error('Error replying to discussion:', error);
    res.status(500).json({ error: 'Failed to reply to discussion' });
  }
});

// Achievements
router.get('/:pathId/achievements', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { pathId } = req.params;
    const userId = req.user._id;
    
    const Achievement = require('../models/Achievement').default;
    
    const achievements = await Achievement.find({ userId, learningPathId: pathId });
    
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

router.post('/:pathId/achievements/check', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { pathId } = req.params;
    const userId = req.user._id;
    
    const Achievement = require('../models/Achievement').default;
    const LearningStreak = require('../models/LearningStreak').default;
    
    const userPath = await UserLearningPath.findOne({ userId, pathId });
    if (!userPath) {
      return res.status(404).json({ error: 'Not enrolled in this learning path' });
    }
    
    const newAchievements = [];
    
    // Check Quick Start
    if (userPath.progress.some((p: any) => p.progress > 0)) {
      const exists = await Achievement.findOne({ userId, achievementType: 'quick-start' });
      if (!exists) {
        const achievement = new Achievement({
          userId,
          learningPathId: pathId,
          achievementType: 'quick-start',
          title: 'Quick Start',
          description: 'Complete your first lesson',
          rarity: 'common'
        });
        await achievement.save();
        newAchievements.push(achievement);
      }
    }
    
    // Check Knowledge Seeker
    if (userPath.overallProgress >= 50) {
      const exists = await Achievement.findOne({ userId, achievementType: 'knowledge-seeker' });
      if (!exists) {
        const achievement = new Achievement({
          userId,
          learningPathId: pathId,
          achievementType: 'knowledge-seeker',
          title: 'Knowledge Seeker',
          description: 'Complete 50% of the learning path',
          rarity: 'rare'
        });
        await achievement.save();
        newAchievements.push(achievement);
      }
    }
    
    // Check Milestone Master
    if (userPath.milestoneProgress.every((m: any) => m.isCompleted)) {
      const exists = await Achievement.findOne({ userId, achievementType: 'milestone-master' });
      if (!exists) {
        const achievement = new Achievement({
          userId,
          learningPathId: pathId,
          achievementType: 'milestone-master',
          title: 'Milestone Master',
          description: 'Complete all milestones',
          rarity: 'epic'
        });
        await achievement.save();
        newAchievements.push(achievement);
      }
    }
    
    // Check Path Completer
    if (userPath.overallProgress === 100) {
      const exists = await Achievement.findOne({ userId, achievementType: 'path-completer' });
      if (!exists) {
        const achievement = new Achievement({
          userId,
          learningPathId: pathId,
          achievementType: 'path-completer',
          title: 'Path Completer',
          description: 'Complete the entire learning path',
          rarity: 'legendary'
        });
        await achievement.save();
        newAchievements.push(achievement);
      }
    }
    
    // Check 7-Day Streak
    const streak = await LearningStreak.findOne({ userId });
    if (streak && streak.currentStreak >= 7) {
      const exists = await Achievement.findOne({ userId, achievementType: '7-day-streak' });
      if (!exists) {
        const achievement = new Achievement({
          userId,
          learningPathId: pathId,
          achievementType: '7-day-streak',
          title: '7-Day Streak',
          description: 'Learn for 7 consecutive days',
          rarity: 'rare'
        });
        await achievement.save();
        newAchievements.push(achievement);
      }
    }
    
    res.json({ newAchievements });
  } catch (error) {
    console.error('Error checking achievements:', error);
    res.status(500).json({ error: 'Failed to check achievements' });
  }
});

// Learning Streak
router.get('/user/streak', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user._id;
    
    const LearningStreak = require('../models/LearningStreak').default;
    
    let streak = await LearningStreak.findOne({ userId });
    
    if (!streak) {
      streak = new LearningStreak({ userId });
      await streak.save();
    }
    
    // Check if streak needs to be updated
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (streak.lastActivityDate) {
      const lastActivity = new Date(streak.lastActivityDate);
      lastActivity.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff > 1) {
        // Streak broken
        streak.currentStreak = 0;
      }
    }
    
    res.json(streak);
  } catch (error) {
    console.error('Error fetching streak:', error);
    res.status(500).json({ error: 'Failed to fetch streak' });
  }
});

router.post('/user/streak/update', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user._id;
    
    const LearningStreak = require('../models/LearningStreak').default;
    
    let streak = await LearningStreak.findOne({ userId });
    
    if (!streak) {
      streak = new LearningStreak({ userId });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if already logged today
    const alreadyLoggedToday = streak.activityDates.some((date: Date) => {
      const activityDate = new Date(date);
      activityDate.setHours(0, 0, 0, 0);
      return activityDate.getTime() === today.getTime();
    });
    
    if (!alreadyLoggedToday) {
      streak.activityDates.push(today);
      
      if (streak.lastActivityDate) {
        const lastActivity = new Date(streak.lastActivityDate);
        lastActivity.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          // Consecutive day
          streak.currentStreak += 1;
        } else if (daysDiff > 1) {
          // Streak broken
          streak.currentStreak = 1;
        }
      } else {
        // First activity
        streak.currentStreak = 1;
      }
      
      streak.lastActivityDate = today;
      
      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
      }
      
      await streak.save();
    }
    
    res.json(streak);
  } catch (error) {
    console.error('Error updating streak:', error);
    res.status(500).json({ error: 'Failed to update streak' });
  }
});

// Bookmarks
router.get('/user/bookmarks', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user._id;
    
    const Bookmark = require('../models/Bookmark').default;
    
    const bookmarks = await Bookmark.find({ userId })
      .populate('learningPathId', 'title description icon difficulty');
    
    res.json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

router.post('/:pathId/bookmark', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { pathId } = req.params;
    const userId = req.user._id;
    
    const Bookmark = require('../models/Bookmark').default;
    
    const existing = await Bookmark.findOne({ userId, learningPathId: pathId });
    
    if (existing) {
      await existing.deleteOne();
      res.json({ bookmarked: false });
    } else {
      const bookmark = new Bookmark({
        userId,
        learningPathId: pathId
      });
      await bookmark.save();
      res.json({ bookmarked: true });
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({ error: 'Failed to toggle bookmark' });
  }
});

router.get('/:pathId/bookmark/status', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { pathId } = req.params;
    const userId = req.user._id;
    
    const Bookmark = require('../models/Bookmark').default;
    
    const bookmark = await Bookmark.findOne({ userId, learningPathId: pathId });
    
    res.json({ bookmarked: !!bookmark });
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    res.status(500).json({ error: 'Failed to check bookmark status' });
  }
});

// Submit Quiz Result
router.post('/:pathId/courses/:courseId/quiz/:lessonId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { pathId, courseId, lessonId } = req.params;
    const { quizTitle, totalQuestions, correctAnswers, answers, timeSpent } = req.body;
    const userId = req.user._id;

    const QuizResult = require('../models/QuizResult').default;

    const score = Math.round((correctAnswers / totalQuestions) * 100);

    const quizResult = new QuizResult({
      userId,
      learningPathId: pathId,
      courseId,
      lessonId,
      quizTitle,
      totalQuestions,
      correctAnswers,
      score,
      answers,
      timeSpent
    });

    await quizResult.save();

    res.json({
      message: 'Quiz result saved successfully',
      score,
      passed: score >= 70
    });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    res.status(500).json({ error: 'Failed to save quiz result' });
  }
});

// Get Quiz Results
router.get('/:pathId/courses/:courseId/quiz-results', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { pathId, courseId } = req.params;
    const userId = req.user._id;

    const QuizResult = require('../models/QuizResult').default;

    const results = await QuizResult.find({
      userId,
      learningPathId: pathId,
      courseId
    }).sort({ completedAt: -1 });

    res.json(results);
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({ error: 'Failed to fetch quiz results' });
  }
});

// Generate Certificate for Course
router.post('/:pathId/courses/:courseId/certificate', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { pathId, courseId } = req.params;
    const userId = req.user._id;

    const Certificate = require('../models/Certificate').default;
    const { Course } = require('../models/Course');
    const { User } = require('../models/User');

    // Check if course is completed
    const userPath = await UserLearningPath.findOne({ userId, pathId });
    if (!userPath) {
      return res.status(404).json({ error: 'Not enrolled in this learning path' });
    }

    const courseProgress = userPath.progress.find((p: any) => p.courseId.toString() === courseId);
    if (!courseProgress || courseProgress.progress !== 100) {
      return res.status(400).json({ error: 'Course not completed yet' });
    }

    // Check if certificate already exists
    const existingCert = await Certificate.findOne({
      userId,
      courseId,
      certificateType: 'course'
    });

    if (existingCert) {
      return res.json(existingCert);
    }

    // Get course and user details
    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    // Generate unique certificate ID
    const certificateId = `CERT-COURSE-${Date.now()}-${userId.toString().slice(-6)}`;

    // Create certificate
    const certificate = new Certificate({
      userId,
      courseId,
      learningPathId: pathId,
      certificateType: 'course',
      title: course.courseTitle,
      description: `Successfully completed ${course.courseTitle}`,
      certificateId,
      completionDate: courseProgress.completedAt || new Date(),
      skills: ['Data Structures', 'Algorithms', 'Problem Solving']
    });

    await certificate.save();

    // Update user profile with completed course
    if (!user.completedCourses) {
      user.completedCourses = [];
    }
    
    const alreadyCompleted = user.completedCourses.some(
      (c: any) => c.courseId.toString() === courseId
    );
    
    if (!alreadyCompleted) {
      user.completedCourses.push({
        courseId,
        courseTitle: course.courseTitle,
        completedAt: courseProgress.completedAt || new Date(),
        certificateId
      });
      user.totalCoursesCompleted = (user.totalCoursesCompleted || 0) + 1;
      await user.save();
    }

    res.json(certificate);
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
});

// Get User Certificates
router.get('/user/certificates', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user._id;
    const Certificate = require('../models/Certificate').default;

    const certificates = await Certificate.find({ userId })
      .populate('courseId', 'courseTitle')
      .populate('learningPathId', 'title icon')
      .sort({ issuedAt: -1 });

    res.json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// Certificate
router.get('/:pathId/certificate', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { pathId } = req.params;
    const userId = req.user._id;
    
    const userPath = await UserLearningPath.findOne({ userId, pathId })
      .populate('pathId', 'title');
    
    if (!userPath) {
      return res.status(404).json({ error: 'Not enrolled in this learning path' });
    }
    
    if (userPath.overallProgress !== 100) {
      return res.status(400).json({ error: 'Learning path not completed yet' });
    }
    
    const user = await require('../models/User').User.findById(userId);
    
    res.json({
      userName: user.name,
      pathTitle: userPath.pathId.title,
      completionDate: userPath.completedAt,
      certificateId: `CERT-${pathId}-${userId}`,
      pathId
    });
  } catch (error) {
    console.error('Error fetching certificate:', error);
    res.status(500).json({ error: 'Failed to fetch certificate' });
  }
});

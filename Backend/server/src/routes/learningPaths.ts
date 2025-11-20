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
      .populate('courses.courseId', 'title description difficulty')
      .sort({ enrollmentCount: -1, averageRating: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
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
    console.error('Error fetching learning paths:', error);
    res.status(500).json({ error: 'Failed to fetch learning paths' });
  }
});

// Get learning path by ID
router.get('/:pathId', async (req, res) => {
  try {
    const { pathId } = req.params;
    
    const path = await LearningPath.findById(pathId)
      .populate('createdBy', 'name')
      .populate('courses.courseId', 'title description difficulty estimatedDuration')
      .populate('milestones.courseIds', 'title');
    
    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }
    
    res.json(path);
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
      .populate('progress.courseId', 'title description')
      .populate('currentCourseId', 'title');
    
    if (!progress) {
      return res.status(404).json({ error: 'Not enrolled in this learning path' });
    }
    
    res.json(progress);
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

export default router;
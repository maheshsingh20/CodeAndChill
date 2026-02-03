import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { adminAuthMiddleware } from '../middleware/adminAuth';
import EngineeringCourse from '../models/EngineeringCourse';

const router = express.Router();

// Get all engineering courses (public)
router.get('/', async (req, res) => {
  try {
    const courses = await EngineeringCourse.find({ isActive: true })
      .select('id title description difficulty duration totalLessons estimatedHours category tags')
      .sort({ createdAt: -1 });
    
    res.json(courses);
  } catch (error) {
    console.error('Error fetching engineering courses:', error);
    res.status(500).json({ error: 'Failed to fetch engineering courses' });
  }
});

// Get specific engineering course by ID (public)
router.get('/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await EngineeringCourse.findOne({ id: courseId, isActive: true });
    
    if (!course) {
      return res.status(404).json({ error: 'Engineering course not found' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Error fetching engineering course:', error);
    res.status(500).json({ error: 'Failed to fetch engineering course' });
  }
});

// Get course progress for a specific engineering course (authenticated)
router.get('/:courseId/progress', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = (req.user as any)?._id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    // Check if course exists
    const course = await EngineeringCourse.findOne({ id: courseId, isActive: true });
    if (!course) {
      return res.status(404).json({ error: 'Engineering course not found' });
    }
    
    // Import UserProgress here to avoid circular dependency
    const UserProgress = (await import('../models/UserProgress')).default;
    
    let progress = await UserProgress.findOne({ userId, courseId });
    
    if (!progress) {
      progress = new UserProgress({
        userId,
        courseId,
        completedLessons: [],
        progressPercentage: 0,
        timeSpent: 0
      });
      await progress.save();
    }
    
    // Calculate progress based on course structure
    const totalLessons = course.totalLessons;
    const completedCount = progress.completedLessons.length;
    const calculatedProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    
    // Update progress percentage if it's different
    if (progress.progressPercentage !== calculatedProgress) {
      progress.progressPercentage = calculatedProgress;
      await progress.save();
    }
    
    res.json({
      ...progress.toObject(),
      course: {
        id: course.id,
        title: course.title,
        totalLessons: course.totalLessons
      }
    });
  } catch (error) {
    console.error('Error fetching engineering course progress:', error);
    res.status(500).json({ error: 'Failed to fetch course progress' });
  }
});

// Update lesson progress for engineering course (authenticated)
router.post('/:courseId/progress', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonId, timeSpent, completed } = req.body;
    const userId = (req.user as any)?._id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    // Check if course exists
    const course = await EngineeringCourse.findOne({ id: courseId, isActive: true });
    if (!course) {
      return res.status(404).json({ error: 'Engineering course not found' });
    }
    
    // Import UserProgress here to avoid circular dependency
    const UserProgress = (await import('../models/UserProgress')).default;
    
    let progress = await UserProgress.findOne({ userId, courseId });
    
    if (!progress) {
      progress = new UserProgress({
        userId,
        courseId,
        completedLessons: [],
        progressPercentage: 0,
        timeSpent: 0
      });
    }
    
    // Update time spent
    if (timeSpent) {
      progress.timeSpent += timeSpent;
    }
    
    // Update current lesson
    if (lessonId) {
      progress.currentLesson = lessonId;
    }
    
    progress.lastAccessed = new Date();
    
    // Mark lesson as completed if specified
    if (completed && lessonId && !progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      
      // Calculate progress percentage
      const totalLessons = course.totalLessons;
      progress.progressPercentage = Math.round((progress.completedLessons.length / totalLessons) * 100);
    }
    
    await progress.save();
    
    res.json({
      ...progress.toObject(),
      course: {
        id: course.id,
        title: course.title,
        totalLessons: course.totalLessons
      }
    });
  } catch (error) {
    console.error('Error updating engineering course progress:', error);
    res.status(500).json({ error: 'Failed to update course progress' });
  }
});

// ADMIN ROUTES FOR MANAGING ENGINEERING COURSES

// Get all courses for admin (including inactive)
router.get('/admin/courses', adminAuthMiddleware, async (req, res) => {
  try {
    const courses = await EngineeringCourse.find()
      .sort({ createdAt: -1 });
    
    res.json(courses);
  } catch (error) {
    console.error('Error fetching admin courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Create new engineering course
router.post('/admin/courses', adminAuthMiddleware, async (req, res) => {
  try {
    const {
      id,
      title,
      description,
      difficulty,
      duration,
      estimatedHours,
      category,
      tags,
      prerequisites,
      learningOutcomes,
      modules
    } = req.body;

    // Validate required fields
    if (!id || !title || !description || !difficulty || !duration || !estimatedHours || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if course ID already exists
    const existingCourse = await EngineeringCourse.findOne({ id });
    if (existingCourse) {
      return res.status(400).json({ error: 'Course ID already exists' });
    }

    // Calculate total lessons
    const totalLessons = modules?.reduce((total: number, module: any) => 
      total + (module.lessons?.length || 0), 0) || 0;

    const newCourse = new EngineeringCourse({
      id,
      title,
      description,
      difficulty,
      duration,
      totalLessons,
      estimatedHours,
      category,
      tags: tags || [],
      prerequisites: prerequisites || [],
      learningOutcomes: learningOutcomes || [],
      modules: modules || [],
      createdBy: (req.user as any)?.id || 'admin'
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating engineering course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update engineering course
router.put('/admin/courses/:courseId', adminAuthMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    const updateData = req.body;

    // Calculate total lessons if modules are updated
    if (updateData.modules) {
      updateData.totalLessons = updateData.modules.reduce((total: number, module: any) => 
        total + (module.lessons?.length || 0), 0);
    }

    const updatedCourse = await EngineeringCourse.findOneAndUpdate(
      { id: courseId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(updatedCourse);
  } catch (error) {
    console.error('Error updating engineering course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete engineering course (soft delete)
router.delete('/admin/courses/:courseId', adminAuthMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;

    const updatedCourse = await EngineeringCourse.findOneAndUpdate(
      { id: courseId },
      { isActive: false },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting engineering course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Add module to existing course
router.post('/admin/courses/:courseId/modules', adminAuthMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    const moduleData = req.body;

    const course = await EngineeringCourse.findOne({ id: courseId });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Generate module ID if not provided
    if (!moduleData.id) {
      moduleData.id = `module-${Date.now()}`;
    }

    // Set order if not provided
    if (!moduleData.order) {
      moduleData.order = course.modules.length + 1;
    }

    course.modules.push(moduleData);
    course.totalLessons = course.modules.reduce((total, module) => 
      total + module.lessons.length, 0);

    await course.save();
    res.json(course);
  } catch (error) {
    console.error('Error adding module:', error);
    res.status(500).json({ error: 'Failed to add module' });
  }
});

// Add lesson to existing module
router.post('/admin/courses/:courseId/modules/:moduleId/lessons', adminAuthMiddleware, async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const lessonData = req.body;

    const course = await EngineeringCourse.findOne({ id: courseId });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const module = course.modules.find(m => m.id === moduleId);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    // Generate lesson ID if not provided
    if (!lessonData.id) {
      lessonData.id = `lesson-${Date.now()}`;
    }

    // Set order if not provided
    if (!lessonData.order) {
      lessonData.order = module.lessons.length + 1;
    }

    module.lessons.push(lessonData);
    course.totalLessons = course.modules.reduce((total, module) => 
      total + module.lessons.length, 0);

    await course.save();
    res.json(course);
  } catch (error) {
    console.error('Error adding lesson:', error);
    res.status(500).json({ error: 'Failed to add lesson' });
  }
});

// Seed hardcoded courses to database (one-time migration)
router.post('/admin/seed-courses', adminAuthMiddleware, async (req, res) => {
  try {
    // Import and run the seeding function
    const { seedEngineeringCourses } = await import('../seeds/engineeringCourses');
    const seededCourses = await seedEngineeringCourses();

    res.json({
      message: `Successfully seeded ${seededCourses.length} courses`,
      courses: seededCourses.map(c => ({ id: c.id, title: c.title }))
    });
  } catch (error) {
    console.error('Error seeding courses:', error);
    res.status(500).json({ error: 'Failed to seed courses' });
  }
});
// Recalculate progress for all users (admin utility)
router.post('/admin/recalculate-progress', adminAuthMiddleware, async (req, res) => {
  try {
    // Import UserProgress here to avoid circular dependency
    const UserProgress = (await import('../models/UserProgress')).default;
    // Get all progress records
    const progressRecords = await UserProgress.find({});
    let updatedCount = 0;
    
    for (const progress of progressRecords) {
      // Get the course to check totalLessons
      const course = await EngineeringCourse.findOne({ id: progress.courseId });
      if (course) {
        const completedCount = progress.completedLessons.length;
        const calculatedProgress = course.totalLessons > 0 ? 
          Math.round((completedCount / course.totalLessons) * 100) : 0;
        
        if (progress.progressPercentage !== calculatedProgress) {
          progress.progressPercentage = calculatedProgress;
          await progress.save();
          updatedCount++;
        }
      }
    }
    
    res.json({
      message: `Successfully recalculated progress for ${updatedCount} records`,
      totalRecords: progressRecords.length,
      updatedRecords: updatedCount
    });
  } catch (error) {
    console.error('Error recalculating progress:', error);
    res.status(500).json({ error: 'Failed to recalculate progress' });
  }
});

export default router;
import express from 'express';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Engineering courses data (predefined)
const engineeringCourses = {
  'dsa': {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    description: 'Master fundamental data structures and algorithms essential for programming interviews and efficient coding.',
    difficulty: 'intermediate',
    duration: '60 hours',
    totalLessons: 45,
    estimatedHours: 60,
    modules: [
      {
        title: 'Arrays and Strings',
        lessons: ['Introduction to Arrays', 'Array Operations', 'String Manipulation', 'Two Pointer Technique']
      },
      {
        title: 'Linked Lists',
        lessons: ['Singly Linked Lists', 'Doubly Linked Lists', 'Circular Linked Lists', 'Advanced Operations']
      },
      {
        title: 'Stacks and Queues',
        lessons: ['Stack Implementation', 'Queue Implementation', 'Priority Queues', 'Applications']
      },
      {
        title: 'Trees and Graphs',
        lessons: ['Binary Trees', 'Binary Search Trees', 'Graph Representation', 'Graph Traversal']
      },
      {
        title: 'Dynamic Programming',
        lessons: ['Introduction to DP', 'Memoization', 'Tabulation', 'Advanced DP Problems']
      }
    ]
  },
  'dbms': {
    id: 'dbms',
    title: 'Database Management Systems',
    description: 'Learn database design, SQL, normalization, and advanced database concepts for modern applications.',
    difficulty: 'intermediate',
    duration: '45 hours',
    totalLessons: 35,
    estimatedHours: 45,
    modules: [
      {
        title: 'Database Fundamentals',
        lessons: ['Introduction to DBMS', 'Database Models', 'ER Diagrams', 'Relational Model']
      },
      {
        title: 'SQL Basics',
        lessons: ['DDL Commands', 'DML Commands', 'Basic Queries', 'Joins']
      },
      {
        title: 'Advanced SQL',
        lessons: ['Subqueries', 'Views', 'Stored Procedures', 'Triggers']
      },
      {
        title: 'Database Design',
        lessons: ['Normalization', 'Functional Dependencies', 'BCNF', 'Denormalization']
      },
      {
        title: 'Transaction Management',
        lessons: ['ACID Properties', 'Concurrency Control', 'Locking', 'Recovery']
      }
    ]
  },
  'operating-systems': {
    id: 'operating-systems',
    title: 'Operating Systems',
    description: 'Understand OS concepts including processes, memory management, file systems, and system calls.',
    difficulty: 'advanced',
    duration: '55 hours',
    totalLessons: 40,
    estimatedHours: 55,
    modules: [
      {
        title: 'OS Fundamentals',
        lessons: ['Introduction to OS', 'System Calls', 'OS Structure', 'Kernel vs User Mode']
      },
      {
        title: 'Process Management',
        lessons: ['Process Concept', 'Process Scheduling', 'Inter-process Communication', 'Threads']
      },
      {
        title: 'Memory Management',
        lessons: ['Memory Hierarchy', 'Paging', 'Segmentation', 'Virtual Memory']
      },
      {
        title: 'File Systems',
        lessons: ['File System Interface', 'File System Implementation', 'Directory Structure', 'File Allocation']
      },
      {
        title: 'Synchronization',
        lessons: ['Critical Section', 'Semaphores', 'Monitors', 'Deadlocks']
      }
    ]
  },
  'computer-networks': {
    id: 'computer-networks',
    title: 'Computer Networks',
    description: 'Explore networking protocols, TCP/IP, network security, and distributed systems fundamentals.',
    difficulty: 'advanced',
    duration: '50 hours',
    totalLessons: 38,
    estimatedHours: 50,
    modules: [
      {
        title: 'Network Fundamentals',
        lessons: ['Network Models', 'OSI Model', 'TCP/IP Stack', 'Network Topologies']
      },
      {
        title: 'Physical Layer',
        lessons: ['Transmission Media', 'Encoding', 'Multiplexing', 'Switching']
      },
      {
        title: 'Data Link Layer',
        lessons: ['Framing', 'Error Detection', 'Flow Control', 'MAC Protocols']
      },
      {
        title: 'Network Layer',
        lessons: ['IP Protocol', 'Routing Algorithms', 'Subnetting', 'ICMP']
      },
      {
        title: 'Transport Layer',
        lessons: ['TCP Protocol', 'UDP Protocol', 'Congestion Control', 'Socket Programming']
      }
    ]
  },
  'software-engineering': {
    id: 'software-engineering',
    title: 'Software Engineering',
    description: 'Learn software development lifecycle, design patterns, testing, and project management principles.',
    difficulty: 'intermediate',
    duration: '58 hours',
    totalLessons: 42,
    estimatedHours: 58,
    modules: [
      {
        title: 'SDLC Models',
        lessons: ['Waterfall Model', 'Agile Methodology', 'Scrum Framework', 'DevOps Practices']
      },
      {
        title: 'Requirements Engineering',
        lessons: ['Requirements Gathering', 'Use Cases', 'User Stories', 'Requirements Analysis']
      },
      {
        title: 'System Design',
        lessons: ['System Architecture', 'Design Patterns', 'UML Diagrams', 'Database Design']
      },
      {
        title: 'Testing',
        lessons: ['Testing Fundamentals', 'Unit Testing', 'Integration Testing', 'Test Automation']
      },
      {
        title: 'Project Management',
        lessons: ['Project Planning', 'Risk Management', 'Quality Assurance', 'Maintenance']
      }
    ]
  },
  'web-development': {
    id: 'web-development',
    title: 'Web Development',
    description: 'Build modern web applications with HTML, CSS, JavaScript, React, and backend technologies.',
    difficulty: 'beginner',
    duration: '70 hours',
    totalLessons: 50,
    estimatedHours: 70,
    modules: [
      {
        title: 'Frontend Fundamentals',
        lessons: ['HTML Basics', 'CSS Styling', 'JavaScript Fundamentals', 'DOM Manipulation']
      },
      {
        title: 'Modern JavaScript',
        lessons: ['ES6+ Features', 'Async Programming', 'Modules', 'Error Handling']
      },
      {
        title: 'React Development',
        lessons: ['React Basics', 'Components', 'State Management', 'Hooks']
      },
      {
        title: 'Backend Development',
        lessons: ['Node.js', 'Express.js', 'RESTful APIs', 'Database Integration']
      },
      {
        title: 'Full Stack Projects',
        lessons: ['Project Setup', 'Authentication', 'Deployment', 'Best Practices']
      }
    ]
  }
};

// Get all engineering courses
router.get('/', (req, res) => {
  try {
    const coursesList = Object.values(engineeringCourses).map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      difficulty: course.difficulty,
      duration: course.duration,
      totalLessons: course.totalLessons
    }));
    
    res.json(coursesList);
  } catch (error) {
    console.error('Error fetching engineering courses:', error);
    res.status(500).json({ error: 'Failed to fetch engineering courses' });
  }
});

// Get specific engineering course by ID
router.get('/:courseId', (req, res) => {
  try {
    const { courseId } = req.params;
    const course = engineeringCourses[courseId as keyof typeof engineeringCourses];
    
    if (!course) {
      return res.status(404).json({ error: 'Engineering course not found' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Error fetching engineering course:', error);
    res.status(500).json({ error: 'Failed to fetch engineering course' });
  }
});

// Get course progress for a specific engineering course
router.get('/:courseId/progress', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;
    
    // Check if course exists
    const course = engineeringCourses[courseId as keyof typeof engineeringCourses];
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

// Update lesson progress for engineering course
router.post('/:courseId/progress', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonId, timeSpent, completed } = req.body;
    const userId = req.user._id;
    
    // Check if course exists
    const course = engineeringCourses[courseId as keyof typeof engineeringCourses];
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

export default router;
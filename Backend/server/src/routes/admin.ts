import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin";
import { User } from "../models/User";
import Contest from "../models/Contest";
import { Problem } from "../models/Problem";
import { adminAuthMiddleware, checkPermission, AdminRequest } from "../middleware/adminAuth";

const router = Router();

// Admin login
router.post("/login", async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get admin profile
router.get("/profile", adminAuthMiddleware, async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    res.json({ admin: req.admin });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Dashboard stats
router.get("/stats", adminAuthMiddleware, async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const [
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      totalProblems,
      totalContests,
      totalSubmissions,
      recentActivity
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({
        lastActiveDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      User.countDocuments({
        joinDate: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      }),
      Problem.countDocuments(),
      Contest.countDocuments(),
      // Get total submissions count (assuming Submission model exists)
      User.aggregate([
        { $group: { _id: null, total: { $sum: "$totalSubmissions" } } }
      ]).then(result => result[0]?.total || 0),
      // Get recent activity
      User.find()
        .select('name email joinDate lastActiveDate')
        .sort({ joinDate: -1 })
        .limit(5)
    ]);

    // Get growth data for charts
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    const userGrowth = await Promise.all(
      last30Days.map(async (date) => {
        const count = await User.countDocuments({
          joinDate: { $lte: date }
        });
        return {
          date: date.toISOString().split('T')[0],
          users: count
        };
      })
    );

    res.json({
      overview: {
        totalUsers,
        activeUsers,
        newUsersThisMonth,
        totalProblems,
        totalContests,
        totalSubmissions
      },
      growth: {
        userGrowth
      },
      recentActivity
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// User management
router.get("/users", adminAuthMiddleware, checkPermission('view_users'), async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string || '';

    const query = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single user
router.get("/users/:id", adminAuthMiddleware, checkPermission('view_users'), async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update user
router.put("/users/:id", adminAuthMiddleware, checkPermission('edit_users'), async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { name, email, location, occupation, bio } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, location, occupation, bio },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ user, message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user
router.delete("/users/:id", adminAuthMiddleware, checkPermission('delete_users'), async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Contest management
router.get("/contests", adminAuthMiddleware, async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;

    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const contests = await Contest.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Contest.countDocuments(query);

    res.json({
      contests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching contests:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/contests", adminAuthMiddleware, checkPermission('edit_content'), async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const contestData = {
      ...req.body,
      createdBy: req.admin._id
    };

    const contest = new Contest(contestData);
    await contest.save();

    res.status(201).json({ 
      message: "Contest created successfully",
      contest 
    });
  } catch (error) {
    console.error("Error creating contest:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/contests/:id", adminAuthMiddleware, checkPermission('edit_content'), async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const contest = await Contest.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!contest) {
      res.status(404).json({ message: "Contest not found" });
      return;
    }

    res.json({ 
      message: "Contest updated successfully",
      contest 
    });
  } catch (error) {
    console.error("Error updating contest:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/contests/:id", adminAuthMiddleware, checkPermission('delete_content'), async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const contest = await Contest.findByIdAndDelete(id);
    
    if (!contest) {
      res.status(404).json({ message: "Contest not found" });
      return;
    }

    res.json({ message: "Contest deleted successfully" });
  } catch (error) {
    console.error("Error deleting contest:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/create-admin", adminAuthMiddleware, async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    if (req.admin.role !== 'super_admin') {
      res.status(403).json({ message: "Only super admins can create new admins" });
      return;
    }

    const { name, email, password, role, permissions } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      res.status(400).json({ message: "Admin already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role: role || 'admin',
      permissions: permissions || ['view_users', 'view_content', 'edit_content']
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Data seeding routes
// Problem CRUD operations
router.get("/problems", adminAuthMiddleware, async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string || '';

    const query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const problems = await Problem.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Problem.countDocuments(query);

    res.json({
      problems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/problems", adminAuthMiddleware, checkPermission('edit_content'), async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      difficulty,
      topic,
      testCases,
      constraints,
      timeLimit,
      memoryLimit,
      tags,
      isPublic,
      examples
    } = req.body;

    // Generate slug from title if not provided
    const slug = title?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || '';

    // Validate required fields
    if (!title || !description || !topic) {
      res.status(400).json({ 
        message: "Missing required fields: title, description, and topic are required" 
      });
      return;
    }

    // Ensure testCases have proper structure
    const validatedTestCases = (testCases || []).map((tc: any) => ({
      input: tc.input || '',
      expectedOutput: tc.expectedOutput || tc.output || ''
    }));

    const problem = new Problem({
      title,
      slug,
      description,
      difficulty: difficulty || 'Medium',
      topic: topic || 'General',
      examples: examples || [],
      constraints: Array.isArray(constraints) ? constraints : (constraints ? [constraints] : []),
      testCases: validatedTestCases
    });

    await problem.save();

    res.status(201).json({ 
      message: "Problem created successfully",
      problem 
    });
  } catch (error) {
    console.error("Error creating problem:", error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ 
        message: "Validation error", 
        details: error.message 
      });
    } else if (error.code === 11000) {
      res.status(400).json({ 
        message: "Problem with this slug already exists" 
      });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});

router.put("/problems/:id", adminAuthMiddleware, checkPermission('edit_content'), async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      difficulty,
      topic,
      testCases,
      constraints,
      examples
    } = req.body;

    // Generate slug from title if title is being updated
    const updateData: any = {
      title,
      description,
      difficulty: difficulty || 'Medium',
      topic: topic || 'General',
      examples: examples || [],
      constraints: Array.isArray(constraints) ? constraints : (constraints ? [constraints] : [])
    };

    if (title) {
      updateData.slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    if (testCases) {
      updateData.testCases = testCases.map((tc: any) => ({
        input: tc.input || '',
        expectedOutput: tc.expectedOutput || tc.output || ''
      }));
    }

    const problem = await Problem.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!problem) {
      res.status(404).json({ message: "Problem not found" });
      return;
    }

    res.json({ 
      message: "Problem updated successfully",
      problem 
    });
  } catch (error) {
    console.error("Error updating problem:", error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ 
        message: "Validation error", 
        details: error.message 
      });
    } else if (error.code === 11000) {
      res.status(400).json({ 
        message: "Problem with this slug already exists" 
      });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});

router.delete("/problems/:id", adminAuthMiddleware, checkPermission('delete_content'), async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const problem = await Problem.findByIdAndDelete(id);
    
    if (!problem) {
      res.status(404).json({ message: "Problem not found" });
      return;
    }

    res.json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error("Error deleting problem:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/problems/:id", adminAuthMiddleware, checkPermission('delete_content'), async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    // TODO: Implement when Problem model is ready
    res.json({ message: "Problem deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Quiz CRUD operations
router.get("/quizzes", adminAuthMiddleware, async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    // TODO: Implement when Quiz model is ready
    res.json({ quizzes: [] });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/quizzes", adminAuthMiddleware, checkPermission('edit_content'), async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    // TODO: Implement when Quiz model is ready
    res.json({ message: "Quiz created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/quizzes/:id", adminAuthMiddleware, checkPermission('edit_content'), async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    // TODO: Implement when Quiz model is ready
    res.json({ message: "Quiz updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/quizzes/:id", adminAuthMiddleware, checkPermission('delete_content'), async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    // TODO: Implement when Quiz model is ready
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Contest CRUD operations
router.get("/contests", adminAuthMiddleware, async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;

    const query = status ? { status } : {};

    const contests = await Contest.find(query)
      .populate('createdBy', 'name email')
      .populate('problems.problemId', 'title difficulty')
      .sort({ startTime: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Contest.countDocuments(query);

    res.json({
      contests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching contests:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/contests/:id", adminAuthMiddleware, async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('problems.problemId', 'title difficulty description')
      .populate('participants', 'name email');

    if (!contest) {
      res.status(404).json({ message: "Contest not found" });
      return;
    }

    res.json({ contest });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/contests", adminAuthMiddleware, checkPermission('edit_content'), async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      duration,
      problems,
      rules,
      prizes,
      maxParticipants,
      isPublic,
      tags
    } = req.body;

    // Validate dates
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (start >= end) {
      res.status(400).json({ message: "End time must be after start time" });
      return;
    }

    if (start < new Date()) {
      res.status(400).json({ message: "Start time must be in the future" });
      return;
    }

    // Validate problems exist
    if (problems && problems.length > 0) {
      const problemIds = problems.map((p: any) => p.problemId);
      const existingProblems = await Problem.find({ _id: { $in: problemIds } });
      
      if (existingProblems.length !== problemIds.length) {
        res.status(400).json({ message: "Some problems do not exist" });
        return;
      }
    }

    const contest = new Contest({
      title,
      description,
      startTime: start,
      endTime: end,
      duration,
      problems: problems || [],
      rules: rules || 'Standard contest rules apply',
      prizes: prizes || [],
      maxParticipants,
      isPublic: isPublic !== false,
      createdBy: req.admin._id,
      tags: tags || [],
      status: 'upcoming'
    });

    await contest.save();

    res.status(201).json({ 
      message: "Contest created successfully", 
      contest 
    });
  } catch (error) {
    console.error("Error creating contest:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/contests/:id", adminAuthMiddleware, checkPermission('edit_content'), async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      duration,
      problems,
      rules,
      prizes,
      maxParticipants,
      isPublic,
      tags,
      status
    } = req.body;

    const contest = await Contest.findById(req.params.id);
    if (!contest) {
      res.status(404).json({ message: "Contest not found" });
      return;
    }

    // Don't allow editing active or completed contests
    if (contest.status === 'active' && status !== 'completed') {
      res.status(400).json({ message: "Cannot edit active contest" });
      return;
    }

    // Validate dates if provided
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      if (start >= end) {
        res.status(400).json({ message: "End time must be after start time" });
        return;
      }
    }

    // Update fields
    if (title) contest.title = title;
    if (description) contest.description = description;
    if (startTime) contest.startTime = new Date(startTime);
    if (endTime) contest.endTime = new Date(endTime);
    if (duration) contest.duration = duration;
    if (problems) contest.problems = problems;
    if (rules) contest.rules = rules;
    if (prizes) contest.prizes = prizes;
    if (maxParticipants !== undefined) contest.maxParticipants = maxParticipants;
    if (isPublic !== undefined) contest.isPublic = isPublic;
    if (tags) contest.tags = tags;
    if (status) contest.status = status;

    await contest.save();

    res.json({ 
      message: "Contest updated successfully", 
      contest 
    });
  } catch (error) {
    console.error("Error updating contest:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/contests/:id", adminAuthMiddleware, checkPermission('delete_content'), async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const contest = await Contest.findById(req.params.id);
    
    if (!contest) {
      res.status(404).json({ message: "Contest not found" });
      return;
    }

    // Don't allow deleting active contests
    if (contest.status === 'active') {
      res.status(400).json({ message: "Cannot delete active contest" });
      return;
    }

    await Contest.findByIdAndDelete(req.params.id);

    res.json({ message: "Contest deleted successfully" });
  } catch (error) {
    console.error("Error deleting contest:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get available problems for contest
router.get("/contests/available-problems", adminAuthMiddleware, async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const problems = await Problem.find({ isPublic: true })
      .select('title difficulty tags')
      .sort({ difficulty: 1, title: 1 });

    res.json({ problems });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Data seeding routes
router.post("/seed/users", adminAuthMiddleware, async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const sampleUsers = [
      {
        name: "John Doe",
        email: "john@example.com",
        password: await bcrypt.hash("password123", 10),
        location: "New York, USA",
        occupation: "Full Stack Developer",
        bio: "Passionate about web development and open source",
        skills: ["JavaScript", "React", "Node.js", "MongoDB"],
        totalProblemsSolved: 45,
        currentStreak: 7
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: await bcrypt.hash("password123", 10),
        location: "London, UK",
        occupation: "Frontend Developer",
        bio: "UI/UX enthusiast and React expert",
        skills: ["React", "TypeScript", "CSS", "Tailwind"],
        totalProblemsSolved: 32,
        currentStreak: 5
      },
      {
        name: "Mike Johnson",
        email: "mike@example.com",
        password: await bcrypt.hash("password123", 10),
        location: "San Francisco, USA",
        occupation: "Backend Developer",
        bio: "Building scalable systems",
        skills: ["Python", "Django", "PostgreSQL", "Docker"],
        totalProblemsSolved: 58,
        currentStreak: 12
      }
    ];

    // Clear existing sample users
    await User.deleteMany({ email: { $in: sampleUsers.map(u => u.email) } });
    
    // Insert new users
    const created = await User.insertMany(sampleUsers);
    
    res.json({ 
      message: "Sample users seeded successfully", 
      count: created.length 
    });
  } catch (error) {
    console.error("Error seeding users:", error);
    res.status(500).json({ message: "Error seeding users" });
  }
});

router.post("/seed/courses", adminAuthMiddleware, async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    // This is a placeholder - you can implement actual course seeding
    res.json({ 
      message: "Course seeding not yet implemented", 
      count: 0 
    });
  } catch (error) {
    res.status(500).json({ message: "Error seeding courses" });
  }
});

router.post("/seed/problems", adminAuthMiddleware, async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    // This is a placeholder - you can implement actual problem seeding
    res.json({ 
      message: "Problem seeding not yet implemented", 
      count: 0 
    });
  } catch (error) {
    res.status(500).json({ message: "Error seeding problems" });
  }
});

router.post("/seed/quizzes", adminAuthMiddleware, async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    // This is a placeholder - you can implement actual quiz seeding
    res.json({ 
      message: "Quiz seeding not yet implemented", 
      count: 0 
    });
  } catch (error) {
    res.status(500).json({ message: "Error seeding quizzes" });
  }
});

router.post("/seed/clear", adminAuthMiddleware, async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    if (req.admin.role !== 'super_admin') {
      res.status(403).json({ message: "Only super admins can clear data" });
      return;
    }

    // Clear all collections except admins
    await User.deleteMany({});
    // Add more collections as needed
    
    res.json({ message: "All data cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing data" });
  }
});

export default router;

import { Router, Request, Response } from "express";
import { ProblemSet, UserProblem } from "../models";
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all problem sets
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const sets = await ProblemSet.find({});
    res.json(sets);
  } catch (error) {
    console.error("Problem sets fetch error:", error);
    res.status(500).json({ message: "Server error fetching problem sets" });
  }
});

// Get problem set by slug
router.get("/:slug", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const userId = req.user?._id;

    const problemSet = await ProblemSet.findOne({ slug }).populate("problems");
    
    if (!problemSet) {
      res.status(404).json({ message: "Problem set not found" });
      return;
    }

    // If user is authenticated, get their solved status for each problem
    if (userId) {
      const problemIds = problemSet.problems.map((p: any) => p._id);
      const userProblems = await UserProblem.find({
        userId,
        problemId: { $in: problemIds }
      });

      // Create a map of problem ID to solved status
      const solvedMap = new Map();
      userProblems.forEach(up => {
        solvedMap.set(up.problemId.toString(), up.status === 'solved');
      });

      // Add solved status to each problem
      const problemsWithStatus = problemSet.problems.map((problem: any) => {
        const solved = solvedMap.get(problem._id.toString()) || false;
        return {
          ...problem.toObject(),
          solved
        };
      });

      res.json({
        ...problemSet.toObject(),
        problems: problemsWithStatus
      });
    } else {
      // If not authenticated, just return the problem set without solved status
      res.json(problemSet);
    }
  } catch (error) {
    console.error("Problem set fetch error:", error);
    res.status(500).json({ message: "Server error fetching problem set" });
  }
});

// Get problem set progress for authenticated user
router.get("/:slug/progress", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const userId = req.user._id;

    // Get the problem set with its problems
    const problemSet = await ProblemSet.findOne({ slug }).populate("problems");
    
    if (!problemSet) {
      res.status(404).json({ message: "Problem set not found" });
      return;
    }

    const problemIds = problemSet.problems.map((p: any) => p._id);
    
    // Get user's progress on these problems
    const userProblems = await UserProblem.find({
      userId,
      problemId: { $in: problemIds }
    });

    const solvedProblems = userProblems.filter(up => up.status === 'solved').length;
    const attemptedProblems = userProblems.length;
    const totalProblems = problemIds.length;

    res.json({
      totalProblems,
      solvedProblems,
      attemptedProblems,
      progressPercentage: totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0
    });
  } catch (error) {
    console.error("Problem set progress fetch error:", error);
    res.status(500).json({ message: "Server error fetching problem set progress" });
  }
});

// Debug route to refresh solved status (temporary)
router.post("/:slug/refresh-status", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const userId = req.user._id;

    const problemSet = await ProblemSet.findOne({ slug }).populate('problems');
    if (!problemSet) {
      res.status(404).json({ message: "Problem set not found" });
      return;
    }

    const problemIds = problemSet.problems.map((p: any) => p._id);
    const userProblems = await UserProblem.find({
      userId,
      problemId: { $in: problemIds }
    });

    console.log(`🔄 Refreshing solved status for user ${userId} in problem set "${problemSet.title}"`);
    console.log(`   Found ${userProblems.length} user problem records`);

    // Get fresh data and return it
    const solvedMap = new Map();
    userProblems.forEach(up => {
      solvedMap.set(up.problemId.toString(), up.status === 'solved');
      console.log(`   Problem ${up.problemId}: ${up.status}`);
    });

    const problemsWithStatus = problemSet.problems.map((problem: any) => {
      const solved = solvedMap.get(problem._id.toString()) || false;
      return {
        ...problem.toObject(),
        solved
      };
    });

    const solvedCount = problemsWithStatus.filter(p => p.solved).length;
    console.log(`   Result: ${solvedCount} problems marked as solved`);

    res.json({
      message: "Status refreshed",
      totalProblems: problemIds.length,
      solvedProblems: solvedCount,
      problems: problemsWithStatus
    });
  } catch (error) {
    console.error("Refresh status error:", error);
    res.status(500).json({ message: "Server error refreshing status" });
  }
});

// Utility route to clean up orphaned UserProblem records (admin only)
router.post("/cleanup-orphaned", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // This should be restricted to admin users in production
    // For now, any authenticated user can run it
    
    console.log('🧹 Starting orphaned records cleanup...');
    
    // Get all valid problem IDs from current problem sets
    const allProblemSets = await ProblemSet.find();
    const validProblemIds = new Set();
    
    allProblemSets.forEach(ps => {
      ps.problems.forEach(problemId => {
        validProblemIds.add(problemId.toString());
      });
    });
    
    // Find orphaned UserProblem records
    const allUserProblems = await UserProblem.find();
    const orphanedRecords = allUserProblems.filter(up => 
      !validProblemIds.has(up.problemId.toString())
    );
    
    if (orphanedRecords.length > 0) {
      console.log(`Found ${orphanedRecords.length} orphaned records, cleaning up...`);
      
      // Remove orphaned records
      await UserProblem.deleteMany({
        _id: { $in: orphanedRecords.map(r => r._id) }
      });
      
      // Recalculate user statistics
      const affectedUserIds = [...new Set(orphanedRecords.map(r => r.userId.toString()))];
      
      for (const userId of affectedUserIds) {
        const remainingUserProblems = await UserProblem.find({ userId });
        const actualSolvedCount = remainingUserProblems.filter(up => up.status === 'solved').length;
        
        await User.findByIdAndUpdate(userId, {
          totalProblemsSolved: actualSolvedCount
        });
      }
      
      res.json({
        message: "Cleanup completed",
        orphanedRecordsRemoved: orphanedRecords.length,
        affectedUsers: affectedUserIds.length
      });
    } else {
      res.json({
        message: "No orphaned records found",
        orphanedRecordsRemoved: 0,
        affectedUsers: 0
      });
    }
    
  } catch (error) {
    console.error("Cleanup error:", error);
    res.status(500).json({ message: "Server error during cleanup" });
  }
});

export default router;
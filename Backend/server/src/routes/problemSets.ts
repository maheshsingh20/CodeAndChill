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
      const problemsWithStatus = problemSet.problems.map((problem: any) => ({
        ...problem.toObject(),
        solved: solvedMap.get(problem._id.toString()) || false
      }));

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

export default router;
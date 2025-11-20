import { Router, Request, Response } from "express";
import { Problem, ProblemSet } from "../models";

const router = Router();

// Get all problems
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const problems = await Problem.find({}).select("title slug difficulty topic");
    res.json(problems);
  } catch (error) {
    console.error("Problems fetch error:", error);
    res.status(500).json({ message: "Server error fetching problems" });
  }
});

// Get problem by slug
router.get("/:slug", async (req: Request, res: Response): Promise<void> => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    
    if (!problem) {
      res.status(404).json({ message: "Problem not found" });
      return;
    }

    res.json(problem);
  } catch (error) {
    console.error("Problem fetch error:", error);
    res.status(500).json({ message: "Server error fetching problem" });
  }
});

export default router;
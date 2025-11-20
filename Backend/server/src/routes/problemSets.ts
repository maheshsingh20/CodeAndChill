import { Router, Request, Response } from "express";
import { ProblemSet } from "../models";

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
router.get("/:slug", async (req: Request, res: Response): Promise<void> => {
  try {
    const problemSet = await ProblemSet.findOne({ slug: req.params.slug }).populate("problems");
    
    if (!problemSet) {
      res.status(404).json({ message: "Problem set not found" });
      return;
    }

    res.json(problemSet);
  } catch (error) {
    console.error("Problem set fetch error:", error);
    res.status(500).json({ message: "Server error fetching problem set" });
  }
});

export default router;
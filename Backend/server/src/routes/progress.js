import express, { Response } from "express";
import UserProgress from "../models/UserProgress.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js"; // We'll create this middleware file

const router = express.Router();

// GET a user's progress for a specific course
router.get("/:courseId", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const progress = await UserProgress.findOne({
      userId: req.user?.userId,
      courseId: req.params.courseId,
    });
    if (!progress) {
      // If no progress, return an empty array
      return res.json({ completedSubtopics: [] });
    }
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST to mark a subtopic as complete
router.post("/complete", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { courseId, subtopicId } = req.body;
  try {
    const progress = await UserProgress.findOneAndUpdate(
      { userId: req.user?.userId, courseId: courseId },
      { $addToSet: { completedSubtopics: subtopicId } }, // $addToSet prevents duplicates
      { upsert: true, new: true } // upsert:true creates the document if it doesn't exist
    );
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
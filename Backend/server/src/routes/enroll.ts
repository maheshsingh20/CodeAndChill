import { Router, Response } from "express";
import { GeneralCourse, Enrollment } from "../models";
import { authMiddleware, AuthRequest } from "../middleware";

const router = Router();

// Enroll in free courses
router.post("/free", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.body;
    
    const course = await GeneralCourse.findById(courseId);
    
    if (!course || course.cost > 0) {
      res.status(400).json({ message: "This course is not free." });
      return;
    }

    await Enrollment.findOneAndUpdate(
      { userId: req.user._id, courseId: courseId },
      { status: "enrolled" },
      { upsert: true }
    );

    res.status(201).json({ message: "Enrollment successful!" });
  } catch (error) {
    console.error("Free enrollment error:", error);
    res.status(500).json({ message: "Enrollment failed." });
  }
});

export default router;
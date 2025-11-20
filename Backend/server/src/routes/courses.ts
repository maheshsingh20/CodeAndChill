import { Router, Request, Response } from "express";
import { Course } from "../models";

const router = Router();

// Get all courses
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await Course.find({}).select("courseTitle slug");
    res.json(courses);
  } catch (error) {
    console.error("Courses fetch error:", error);
    res.status(500).json({ message: "Server error fetching courses" });
  }
});

// Get course by slug
router.get("/:slug", async (req: Request, res: Response): Promise<void> => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    res.json(course);
  } catch (error) {
    console.error("Course fetch error:", error);
    res.status(500).json({ message: "Server error fetching course" });
  }
});

export default router;
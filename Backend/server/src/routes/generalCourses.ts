import { Router, Request, Response } from "express";
import { GeneralCourse } from "../models";

const router = Router();

// Get all general courses
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await GeneralCourse.find({})
      .select("title slug description tutor cost")
      .lean();
    
    res.json(courses);
  } catch (error) {
    console.error("General courses fetch error:", error);
    res.status(500).json({ message: "Error fetching courses" });
  }
});

// Get general course by slug
router.get("/:slug", async (req: Request, res: Response): Promise<void> => {
  try {
    const course = await GeneralCourse.findOne({ slug: req.params.slug }).lean();
    
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    res.json(course);
  } catch (error) {
    console.error("General course fetch error:", error);
    res.status(500).json({ message: "Error fetching course detail" });
  }
});

export default router;
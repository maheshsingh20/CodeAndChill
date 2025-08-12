import express from "express";
import Course from "../models/Course.js"; // Use .js extension for imports

const router = express.Router();

// This route handles requests like GET /api/courses/operating-systems
router.get("/:slug", async (req, res) => {
  try {
    const courseSlug = req.params.slug;
    const course = await Course.findOne({ slug: courseSlug }); // Find by the 'slug' field

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Server error fetching course" });
  }
});

export default router;
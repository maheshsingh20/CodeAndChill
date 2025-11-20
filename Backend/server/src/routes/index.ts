import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import coursesRoutes from "./courses";
import generalCoursesRoutes from "./generalCourses";
import problemsRoutes from "./problems";
import problemSetsRoutes from "./problemSets";
import quizzesRoutes from "./quizzes";
import storiesRoutes from "./stories";
import enrollmentRoutes from "./enrollment";
import enrollRoutes from "./enroll";
import aiRoutes from "./ai";
import progressRoutes from "./progress";
import submissionRoutes from "./submissions";
import leaderboardRoutes from "./leaderboard";
import skillTestRoutes from "./skillTests";
import activityRoutes from "./activity";
import collaborativeRoutes from "./collaborative";
import contestRoutes from "./contests";
import learningPathRoutes from "./learningPaths";
import searchRoutes from "./search";
import feedbackRoutes from "./feedback";

const router = Router();

// Mount all routes
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/courses", coursesRoutes);
router.use("/general-courses", generalCoursesRoutes);
router.use("/problems", problemsRoutes);
router.use("/problem-sets", problemSetsRoutes);
router.use("/quizzes", quizzesRoutes);
router.use("/stories", storiesRoutes);
router.use("/enrollment", enrollmentRoutes);
router.use("/enroll", enrollRoutes);
router.use("/progress", progressRoutes);
router.use("/submissions", submissionRoutes);
router.use("/leaderboard", leaderboardRoutes);
router.use("/skill-tests", skillTestRoutes);
router.use("/activity", activityRoutes);
router.use("/collaborative", collaborativeRoutes);
router.use("/contests", contestRoutes);
router.use("/learning-paths", learningPathRoutes);
router.use("/search", searchRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/", aiRoutes); // AI routes are mounted at root level for /gemini-chat

export default router;
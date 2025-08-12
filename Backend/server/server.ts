import express from "express";
import type { Request, Response, NextFunction } from "express";
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

// =======================================================
// ## SETUP & CONFIGURATION ##
// =======================================================

if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
    process.exit(1);
}

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI!;
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// =======================================================
// ## DATABASE MODELS ##
// =======================================================

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema);

const SubtopicSchema = new mongoose.Schema({ id: { type: String, required: true }, title: { type: String, required: true }, content: { type: String, required: true } });
const TopicSchema = new mongoose.Schema({ title: { type: String, required: true }, subtopics: [SubtopicSchema] });
const ModuleSchema = new mongoose.Schema({ title: { type: String, required: true }, topics: [TopicSchema] });
const CourseSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  modules: [ModuleSchema],
});
const Course = mongoose.model("Course", CourseSchema);

const UserProgressSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  completedSubtopics: { type: [String], default: [] },
});
UserProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
const UserProgress = mongoose.model("UserProgress", UserProgressSchema);

// =======================================================
// ## AUTHENTICATION MIDDLEWARE ##
// =======================================================

export interface AuthRequest extends Request { user?: any; }
const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) { return res.status(401).json({ message: "No token provided" }); }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) { return res.status(401).json({ message: "User not found" }); }
    next();
  } catch (err) { res.status(401).json({ message: "Token is not valid" }); }
};

// =======================================================
// ## API ROUTES ##
// =======================================================

// --- Auth Routes ---
app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) { return res.status(400).json({ message: "User with this email already exists." });}
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, { expiresIn: "1d" });
        res.status(201).json({ token });
    } catch (error) { res.status(500).json({ message: "Server error during signup." }); }
});
app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) { return res.status(400).json({ message: "Invalid credentials." }); }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return res.status(400).json({ message: "Invalid credentials." }); }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "1d" });
        res.status(200).json({ token });
    } catch (error) { res.status(500).json({ message: "Server error during login." }); }
});

// --- Course Route ---
app.get("/api/courses/:slug", async (req: Request, res: Response) => {
    try {
        const course = await Course.findOne({ slug: req.params.slug });
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.json(course);
    } catch (error) { res.status(500).json({ message: "Server error fetching course" }); }
});

// --- Progress Routes ---
app.get("/api/progress/:courseId", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const progress = await UserProgress.findOne({ userId: req.user._id, courseId: req.params.courseId });
        res.json(progress || { completedSubtopics: [] });
    } catch (error) { res.status(500).json({ message: "Server error fetching progress" }); }
});
app.post("/api/progress/complete", authMiddleware, async (req: AuthRequest, res: Response) => {
    const { courseId, subtopicId } = req.body;
    try {
        const progress = await UserProgress.findOneAndUpdate(
            { userId: req.user._id, courseId },
            { $addToSet: { completedSubtopics: subtopicId } },
            { upsert: true, new: true }
        );
        res.json(progress);
    } catch (error) { res.status(500).json({ message: "Server error updating progress" }); }
});

// --- AI Chat Route ---
app.post("/api/chat", async (req: Request, res: Response) => {
    try {
        const { prompt } = req.body;
        if (!prompt) { return res.status(400).json({ error: "Prompt is required" }); }
        const ollamaRes = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model: "llama3", prompt: prompt, stream: true }),
        });
        if (!ollamaRes.ok || !ollamaRes.body) { throw new Error(`Ollama responded with status: ${ollamaRes.status}`); }
        res.setHeader("Content-Type", "application/octet-stream");
        ollamaRes.body.pipe(res);
    } catch (error) { console.error("Error in /api/chat:", error); if (!res.headersSent) { res.status(500).json({ error: "Failed to get response from Ollama" }); } }
});

// --- Start the Server ---
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
import express from "express";
import type { Request, Response, NextFunction } from "express";
import mongoose, { Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

// =======================================================
// ## SETUP & CONFIGURATION ##
// =======================================================

if (!process.env.GEMINI_API_KEY) {
  console.error("FATAL ERROR: GEMINI_API_KEY is not defined in .env file.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
  process.exit(1);
}

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/codeandchill";
mongoose
  .connect(MONGO_URI)
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

const SubtopicSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
});
const TopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtopics: [SubtopicSchema],
});
const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topics: [TopicSchema],
});
const CourseSchema = new mongoose.mongoose.Schema({
  courseTitle: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  modules: [ModuleSchema],
});
const Course = mongoose.model("Course", CourseSchema);

const UserProgressSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  completedSubtopics: { type: [String], default: [] },
});
UserProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
const UserProgress = mongoose.model("UserProgress", UserProgressSchema);

const TestCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
});
const ExampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String },
});
const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  topic: { type: String, required: true },
  description: { type: String, required: true },
  examples: [ExampleSchema],
  constraints: { type: [String], default: [] },
  testCases: [TestCaseSchema],
});
const Problem = mongoose.model("Problem", ProblemSchema);

// =======================================================
// ## AUTHENTICATION MIDDLEWARE ##
// =======================================================

export interface AuthRequest extends Request {
  user?: any;
}
const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// =======================================================
// ## API ROUTES ##
// =======================================================

// --- Auth Routes ---
app.post("/api/auth/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error during signup." });
  }
});
app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error during login." });
  }
});

// --- Course Routes ---
const courseRouter = express.Router();

// NEW: GET a list of all courses
courseRouter.get("/", async (req: Request, res: Response) => {
  try {
    // We only select a few fields for the list view
    const courses = await Course.find({}).select("courseTitle slug");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching courses" });
  }
});
// GET a single course by its slug
courseRouter.get("/:slug", async (req: Request, res: Response) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching course" });
  }
});

app.use("/api/courses", courseRouter);

// --- Progress Routes ---
app.get(
  "/api/progress/:courseId",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const progress = await UserProgress.findOne({
        userId: req.user._id,
        courseId: req.params.courseId,
      });
      res.json(progress || { completedSubtopics: [] });
    } catch (error) {
      res.status(500).json({ message: "Server error fetching progress" });
    }
  }
);
app.post(
  "/api/progress/complete",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const { courseId, subtopicId } = req.body;
    try {
      const progress = await UserProgress.findOneAndUpdate(
        { userId: req.user._id, courseId },
        { $addToSet: { completedSubtopics: subtopicId } },
        { upsert: true, new: true }
      );
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Server error updating progress" });
    }
  }
);

// --- Problem Routes ---
const problemRouter = express.Router();
problemRouter.get("/", async (req: Request, res: Response) => {
  try {
    const problems = await Problem.find({}).select(
      "title slug difficulty topic"
    );
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching problems" });
  }
});
problemRouter.get("/:slug", async (req: Request, res: Response) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching problem" });
  }
});
app.use("/api/problems", problemRouter);

// NEW: ProblemSet model is now defined here
const ProblemSetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  problems: [{ type: Schema.Types.ObjectId, ref: "Problem" }],
});
const ProblemSet = mongoose.model("ProblemSet", ProblemSetSchema);

// --- Problem Set Routes ---
const problemSetRouter = express.Router();

problemSetRouter.get("/", async (req: Request, res: Response) => {
  try {
    const sets = await ProblemSet.find({});
    res.json(sets);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

problemSetRouter.get("/:slug", async (req: Request, res: Response) => {
  try {
    const problemSet = await ProblemSet.findOne({
      slug: req.params.slug,
    }).populate("problems");
    if (!problemSet) {
      return res.status(404).json({ message: "Problem set not found" });
    }
    res.json(problemSet);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.use("/api/problem-sets", problemSetRouter);

app.post("/api/gemini-chat", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Use the SDK to generate content as a stream
    const result = await geminiModel.generateContentStream(prompt);

    // Set headers for streaming plain text
    res.setHeader("Content-Type", "text/plain; charset=utf-8");

    // Stream the response chunk by chunk
    for await (const chunk of result.stream) {
      res.write(chunk.text());
    }
    res.end();
  } catch (error) {
    console.error("Error in /api/gemini-chat:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to get response from Gemini" });
    }
  }
});

// --- NEW: User Profile & Settings Routes ---
// UPDATE current user's profile data
app.get(
  "/api/user/profile",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      // req.user is attached by the authMiddleware and already excludes the password
      res.json(req.user);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching profile" });
    }
  }
);
app.put(
  "/api/user/profile",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    // This route should also exist
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true }
    ).select("-password");
    res.json(updatedUser);
  }
);

// CHANGE current user's password
app.post(
  "/api/user/change-password",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current password." });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.json({ message: "Password updated successfully." });
    } catch (error) {
      res.status(500).json({ message: "Server error." });
    }
  }
);
// =======================================================
// ## DATABASE MODELS ##
// =======================================================
interface ISubject extends Document { name: string; slug: string; description: string; }
const SubjectSchema = new Schema<ISubject>({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
});
const Subject = mongoose.model<ISubject>("Subject", SubjectSchema);

interface IOption { text: string; isCorrect: boolean; }
interface IQuestion { questionText: string; options: IOption[]; explanation?: string; }
interface IQuiz extends Document { title: string; slug: string; subject: Types.ObjectId; questions: IQuestion[]; }
const OptionSchema = new Schema<IOption>({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
});
const QuestionSchema = new Schema<IQuestion>({
  questionText: { type: String, required: true },
  options: [OptionSchema],
  explanation: String,
});
const QuizSchema = new Schema<IQuiz>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  questions: [QuestionSchema],
});
const Quiz = mongoose.model<IQuiz>("Quiz", QuizSchema);

interface IResult extends Document { user: string; quizId: Types.ObjectId; score: number; total: number; answers: { question: string; selected: string; isCorrect: boolean }[]; }
const ResultSchema = new Schema<IResult>({
  user: { type: String, required: true }, // In a real app, this would be a ref to the User model
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  answers: [{ question: String, selected: String, isCorrect: Boolean }],
});
const Result = mongoose.model<IResult>("Result", ResultSchema);

// =======================================================
// ## API ROUTES ##
// =======================================================
app.get("/api/subjects", async (req: Request, res: Response) => {
  const subjects = await Subject.find({}).lean();
  res.json(subjects);
});

app.get("/api/subjects/:subjectSlug/quizzes", async (req: Request, res: Response) => {
  const subject = await Subject.findOne({ slug: req.params.subjectSlug }).lean();
  if (!subject) return res.status(404).json({ message: "Subject not found" });
  const quizzes = await Quiz.find({ subject: subject._id }).select("title slug").lean();
  res.json({ subject, quizzes });
});

// CORRECTED: This route now matches the frontend's /play/:quizSlug
app.get("/api/quizzes/play/:quizSlug", async (req: Request, res: Response) => {
  const quiz = await Quiz.findOne({ slug: req.params.quizSlug }).populate("subject", "name slug").lean();
  if (!quiz) return res.status(404).json({ message: "Quiz not found" });
  
  // Strip out correct answers before sending to the client
  const questionsForUser = quiz.questions.map((q) => ({
    questionText: q.questionText,
    options: q.options.map((opt) => ({ text: opt.text })),
  }));
  res.json({ ...quiz, questions: questionsForUser });
});

app.post("/api/quizzes/:quizId/submit", async (req: Request, res: Response) => {
  const { user, answers } = req.body as {
    user: string;
    answers: { [key: number]: number };
  };
  // CORRECTED: It now finds the quiz by its ID from the URL parameter
  const quiz = await Quiz.findById(req.params.quizId).populate(
    "subject",
    "slug"
  );

  if (!quiz) return res.status(404).json({ message: "Quiz not found" });
  if (!answers || typeof answers !== "object") {
    return res.status(400).json({ message: "Invalid answers format" });
  }

  let score = 0;
  const checkedAnswers = quiz.questions.map((q, idx) => {
    const selectedOptionIndex = answers[idx];
    const selectedOption = q.options[selectedOptionIndex];
    const isCorrect = selectedOption?.isCorrect === true;
    if (isCorrect) score++;
    return {
      question: q.questionText,
      selected: selectedOption?.text || "No Answer",
      isCorrect,
    };
  });

  const result = await Result.create({
    user: user || "guest",
    quizId: quiz._id, // Use the quiz's ID
    quizSlug: quiz.slug,
    subjectSlug: (quiz.subject as any).slug,
    score,
    total: quiz.questions.length,
    answers: checkedAnswers,
  });
  res.status(201).json({ resultId: result._id });
});

app.get("/api/results/:resultId", async (req: Request, res: Response) => {
  const result = await Result.findById(req.params.resultId).lean();
  if (!result) return res.status(404).json({ message: "Result not found" });
  const quiz = await Quiz.findOne({ slug: result.quizSlug })
    .populate("subject", "name")
    .lean();
  res.json({ result, quiz });
});
// --- Start the Server ---
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

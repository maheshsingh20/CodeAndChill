import express from "express";
import type { Request, Response, NextFunction } from "express";
import mongoose, { Schema, Types, Document } from "mongoose";
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

if (!process.env.GEMINI_API_KEY || !process.env.JWT_SECRET) {
  console.error("FATAL ERROR: API keys are not defined in .env file.");
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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// =======================================================
// ## DATABASE MODELS ##
// =======================================================

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, default: "Not specified" },
  occupation: { type: String, default: "Developer" },
  bio: { type: String, default: "Learning and growing every day!" },
  joinDate: { type: Date, default: Date.now },
  skills: { type: [String], default: [] },
  attempts: [{ type: Schema.Types.ObjectId, ref: "QuizAttempt" }],
});
const User = mongoose.model("User", userSchema);

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
const CourseSchema = new mongoose.Schema({
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

const ProblemSetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  problems: [{ type: Schema.Types.ObjectId, ref: "Problem" }],
});
const ProblemSet = mongoose.model("ProblemSet", ProblemSetSchema);

interface ISubject extends Document {
  name: string;
  slug: string;
  description: string;
}
const SubjectSchema = new Schema<ISubject>({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
});
const Subject = mongoose.model<ISubject>("Subject", SubjectSchema);

interface IOption {
  text: string;
  isCorrect: boolean;
}
const OptionSchema = new Schema<IOption>({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
});
const QuestionSchema = new Schema({
  questionText: { type: String, required: true },
  options: [OptionSchema],
  explanation: String,
});
interface IQuiz extends Document {
  title: string;
  slug: string;
  subject: Types.ObjectId;
  questions: IQuestion[];
}
const QuizSchema = new Schema<IQuiz>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  questions: [QuestionSchema],
});
const Quiz = mongoose.model<IQuiz>("Quiz", QuizSchema);

const QuizAttemptSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    answers: { type: Object, required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, required: true },
  },
  { timestamps: true }
);
const QuizAttempt = mongoose.model("QuizAttempt", QuizAttemptSchema);


// NEW: SuccessStory Model// NEW: SuccessStory Model


const SuccessStorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    company: { type: String, required: true },
    image: { type: String, required: true },
    quote: { type: String, required: true },
    skills: { type: [String], required: true },
    linkedinUrl: { type: String, default: "" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isApproved: { type: Boolean, default: false }, // For admin moderation
  },
  { timestamps: true }
);
const SuccessStory = mongoose.model("SuccessStory", SuccessStorySchema);


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
// --- Auth Routes ---
app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) { 
            return res.status(400).json({ message: "User with this email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword 
        });
        
        await newUser.save();
        
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, { expiresIn: "1d" });
        res.status(201).json({ token });
        
    } catch (error) { 
        // This log will show the specific error in your backend terminal
        console.error("SIGNUP ERROR:", error); 
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

// --- User Profile & Settings Routes ---
app.get(
  "/api/user/profile",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const userProfile = await User.findById(req.user._id)
        .populate({
          path: "attempts",
          populate: {
            path: "quizId",
            model: "Quiz",
            select: "title",
          },
        })
        .select("-password");
      res.json({ user: userProfile });
    } catch (error) {
      res.status(500).json({ message: "Server error fetching profile data" });
    }
  }
);
app.put(
  "/api/user/profile",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { name, email, location, occupation, bio } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { name, email, location, occupation, bio },
        { new: true }
      ).select("-password");
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error updating profile" });
    }
  }
);
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

// --- Course Routes ---
const courseRouter = express.Router();
courseRouter.get("/", async (req: Request, res: Response) => {
  try {
    const courses = await Course.find({}).select("courseTitle slug");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching courses" });
  }
});
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

// --- Problem & Problem Set Routes ---
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

const problemSetRouter = express.Router();
problemSetRouter.get("/", async (req: Request, res: Response) => {
  try {
    const sets = await ProblemSet.find({});
    res.json(sets);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching problem sets" });
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
    res.status(500).json({ message: "Server error fetching problem set" });
  }
});
app.use("/api/problem-sets", problemSetRouter);

// --- Quiz Routes ---
const quizRouter = express.Router();
quizRouter.get("/subjects", async (req, res) => {
  const subjects = await Subject.find({}).lean();
  res.json(subjects);
});
quizRouter.get(
  "/by-subject/:subjectSlug",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const subject = await Subject.findOne({
      slug: req.params.subjectSlug,
    }).lean();
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    const quizzes = await Quiz.find({ subject: subject._id })
      .select("title slug")
      .lean();
    const attempts = await QuizAttempt.find({
      userId: req.user._id,
      quizId: { $in: quizzes.map((q) => q._id) },
    });
    const quizzesWithStatus = quizzes.map((q) => {
      const attempt = attempts.find(
        (a) => a.quizId.toString() === q._id.toString()
      );
      return {
        ...q,
        completed: !!attempt,
        score: attempt ? `${attempt.score}/${attempt.totalQuestions}` : null,
      };
    });
    res.json({ subject, quizzes: quizzesWithStatus });
  }
);
quizRouter.get("/play/:quizSlug", async (req, res) => {
  const quiz = await Quiz.findOne({ slug: req.params.quizSlug }).lean();
  if (!quiz) return res.status(404).json({ message: "Quiz not found" });
  const questionsForUser = quiz.questions.map((q: { questionText: any; options: any[]; }) => ({
    questionText: q.questionText,
    options: q.options.map((opt) => ({ text: opt.text })),
  }));
  res.json({ _id: quiz._id, title: quiz.title, questions: questionsForUser });
});
// POST to submit a quiz
quizRouter.post("/:quizId/submit", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { answers } = req.body;
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        let score = 0;
        const totalQuestions = quiz.questions.length;
        
        const detailedAnswers = quiz.questions.map((question, index) => {
            const isCorrect = question.options[answers[index]]?.isCorrect === true;
            if (isCorrect) score++;
            return { questionIndex: index, selectedOptionIndex: answers[index], isCorrect };
        });

        // FIX: Calculate the percentage
        const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

        const attempt = new QuizAttempt({
            userId: req.user._id,
            quizId: quiz._id,
            score,
            totalQuestions: totalQuestions,
            answers: detailedAnswers,
            percentage: percentage // FIX: Add the percentage to the new document
        });
        await attempt.save();
        
        await User.findByIdAndUpdate(req.user._id, { $push: { attempts: attempt._id } });
        
        res.status(201).json({ attemptId: attempt._id });

    } catch (error) {
        console.error("SUBMISSION ERROR:", error);
        res.status(500).json({ message: "Server error during quiz submission" });
    }
});

quizRouter.get(
  "/results/:attemptId",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const attempt = await QuizAttempt.findById(req.params.attemptId).lean();
      if (!attempt || attempt.userId.toString() !== req.user._id.toString()) {
        return res.status(404).json({ message: "Attempt not found" });
      }

      const quiz = await Quiz.findById(attempt.quizId)
        .populate("subject", "name")
        .lean();
      if (!quiz) {
        return res.status(404).json({ message: "Associated quiz not found" });
      }

      // FIX: Send the data in the correct { result, quiz } format
      res.json({ result: attempt, quiz });
    } catch (error) {
      res.status(500).json({ message: "Server error fetching results" });
    }
  }
);
app.use("/api/quizzes", quizRouter);

// --- AI Chat Route ---
app.post("/api/gemini-chat", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    const result = await geminiModel.generateContentStream(prompt);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
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

//profile set up
// --- User Profile & Settings Routes ---
app.get("/api/user/profile-dashboard", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userProfile = await User.findById(req.user._id)
            .populate({
                path: 'attempts',
                populate: { path: 'quizId', model: 'Quiz', select: 'title' }
            })
            .select("-password");

        // Mock data for charts
        const activityData = [ { day: "Mon", solved: 4 }, { day: "Tue", solved: 3 }, { day: "Wed", solved: 7 }, { day: "Thu", solved: 5 }, { day: "Fri", solved: 8 }, { day: "Sat", solved: 12 }, { day: "Sun", solved: 6 }];
        const problemData = [ { level: "Easy", count: 75 }, { level: "Medium", count: 42 }, { level: "Hard", count: 8 }];
        const certificates = [ { course: "Advanced React Patterns" }, { course: "Data Structures in Python" }];

        res.json({
            user: userProfile,
            activity: activityData,
            problemStats: problemData,
            certificates: certificates,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching profile dashboard" });
    }
});
app.put("/api/user/profile", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, location, occupation, bio } = req.body;
        const updatedUser = await User.findByIdAndUpdate( req.user._id, { name, email, location, occupation, bio }, { new: true }).select("-password");
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating profile" });
    }
});
app.post("/api/user/change-password", authMiddleware, async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) { return res.status(404).json({ message: "User not found." }); }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) { return res.status(400).json({ message: "Incorrect current password." }); }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.json({ message: "Password updated successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});


// --- NEW: Success Story Routes ---
const storyRouter = express.Router();
// GET all APPROVED stories
storyRouter.get("/", async (req: Request, res: Response) => {
    try {
        // In a real app, you'd filter for isApproved: true
        const stories = await SuccessStory.find({}).sort({ createdAt: -1 });
        res.json(stories);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching stories" });
    }
});

// POST a new story (requires user to be logged in)
storyRouter.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { name, company, quote, skills, linkedinUrl } = req.body;
        
        const newStory = new SuccessStory({
            name,
            company,
            quote,
          skills,
            linkedinUrl,
            userId: req.user._id,
            image: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 9)}.jpg`
        });

        await newStory.save();
        res.status(201).json({ message: "Thank you! Your story has been submitted for review." });
    } catch (error) {
        res.status(400).json({ message: "Error submitting story" });
    }
});

app.use("/api/stories", storyRouter);


// --- Start the Server ---
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

import { Router, Response } from "express";
import { Subject, Quiz, QuizAttempt, User } from "../models";
import { authMiddleware, AuthRequest } from "../middleware";

const router = Router();

// Get all quizzes (root endpoint)
router.get("/", async (req, res): Promise<void> => {
  try {
    const quizzes = await Quiz.find({})
      .populate("subject", "name slug")
      .select("title slug subject createdAt")
      .limit(10)
      .lean();
    
    res.json({ quizzes });
  } catch (error) {
    console.error("Quizzes fetch error:", error);
    res.status(500).json({ message: "Server error fetching quizzes" });
  }
});

// Get all subjects
router.get("/subjects", async (req, res): Promise<void> => {
  try {
    const subjects = await Subject.find({}).lean();
    res.json(subjects);
  } catch (error) {
    console.error("Subjects fetch error:", error);
    res.status(500).json({ message: "Server error fetching subjects" });
  }
});

// Get quizzes by subject
router.get("/by-subject/:subjectSlug", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const subject = await Subject.findOne({ slug: req.params.subjectSlug }).lean();
    
    if (!subject) {
      res.status(404).json({ message: "Subject not found" });
      return;
    }

    const quizzes = await Quiz.find({ subject: subject._id }).select("title slug").lean();
    
    const attempts = await QuizAttempt.find({
      userId: req.user._id,
      quizId: { $in: quizzes.map((q) => q._id) },
    });

    const quizzesWithStatus = quizzes.map((q) => {
      const attempt = attempts.find((a) => a.quizId.toString() === q._id.toString());
      return {
        ...q,
        completed: !!attempt,
        score: attempt ? `${attempt.score}/${attempt.totalQuestions}` : null,
      };
    });

    res.json({ subject, quizzes: quizzesWithStatus });
  } catch (error) {
    console.error("Quizzes by subject fetch error:", error);
    res.status(500).json({ message: "Server error fetching quizzes" });
  }
});

// Get quiz for playing (without correct answers)
router.get("/play/:quizSlug", async (req, res): Promise<void> => {
  try {
    const quiz = await Quiz.findOne({ slug: req.params.quizSlug }).lean();
    
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    const questionsForUser = quiz.questions.map((q: any) => ({
      questionText: q.questionText,
      options: q.options.map((opt: any) => ({ text: opt.text })),
    }));

    res.json({ _id: quiz._id, title: quiz.title, questions: questionsForUser });
  } catch (error) {
    console.error("Quiz play fetch error:", error);
    res.status(500).json({ message: "Server error fetching quiz" });
  }
});

// Submit quiz
router.post("/:quizId/submit", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.quizId);
    
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    let score = 0;
    const totalQuestions = quiz.questions.length;

    const detailedAnswers = quiz.questions.map((question, index) => {
      const isCorrect = question.options[answers[index]]?.isCorrect === true;
      if (isCorrect) score++;
      return { questionIndex: index, selectedOptionIndex: answers[index], isCorrect };
    });

    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

    const attempt = new QuizAttempt({
      userId: req.user._id,
      quizId: quiz._id,
      score,
      totalQuestions: totalQuestions,
      answers: detailedAnswers,
      percentage: percentage,
    });

    await attempt.save();
    await User.findByIdAndUpdate(req.user._id, { $push: { attempts: attempt._id } });

    res.status(201).json({ attemptId: attempt._id });
  } catch (error) {
    console.error("Quiz submission error:", error);
    res.status(500).json({ message: "Server error during quiz submission" });
  }
});

// Get quiz results
router.get("/results/:attemptId", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const attempt = await QuizAttempt.findById(req.params.attemptId).lean();
    
    if (!attempt || attempt.userId.toString() !== req.user._id.toString()) {
      res.status(404).json({ message: "Attempt not found" });
      return;
    }

    const quiz = await Quiz.findById(attempt.quizId).populate("subject", "name").lean();
    
    if (!quiz) {
      res.status(404).json({ message: "Associated quiz not found" });
      return;
    }

    res.json({ result: attempt, quiz });
  } catch (error) {
    console.error("Quiz results fetch error:", error);
    res.status(500).json({ message: "Server error fetching results" });
  }
});

export default router;
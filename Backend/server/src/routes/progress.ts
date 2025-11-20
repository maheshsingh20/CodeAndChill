import express from 'express';
import UserProgress from '../models/UserProgress';
import Submission from '../models/Submission';
import Leaderboard from '../models/Leaderboard';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get user progress for a specific course
router.get('/course/:courseId', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    let progress = await UserProgress.findOne({ userId, courseId });
    
    if (!progress) {
      progress = new UserProgress({
        userId,
        courseId,
        completedLessons: [],
        progressPercentage: 0,
        timeSpent: 0
      });
      await progress.save();
    }

    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Update lesson progress
router.post('/lesson', authMiddleware, async (req, res) => {
  try {
    const { courseId, lessonId, timeSpent, completed } = req.body;
    const userId = req.user._id;

    let progress = await UserProgress.findOne({ userId, courseId });
    
    if (!progress) {
      progress = new UserProgress({
        userId,
        courseId,
        completedLessons: [],
        progressPercentage: 0,
        timeSpent: 0
      });
    }

    // Update time spent
    progress.timeSpent += timeSpent || 0;
    progress.currentLesson = lessonId;
    progress.lastAccessed = new Date();

    // Mark lesson as completed if specified
    if (completed && !progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      
      // Calculate progress percentage (assuming you have total lessons info)
      // This would need to be adjusted based on your course structure
      const totalLessons = 10; // This should come from course data
      progress.progressPercentage = (progress.completedLessons.length / totalLessons) * 100;
    }

    await progress.save();

    // Update leaderboard
    await updateLeaderboard(userId);

    res.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Add or update course notes
router.post('/notes', authMiddleware, async (req, res) => {
  try {
    const { courseId, lessonId, timestamp, content } = req.body;
    const userId = req.user._id;

    let progress = await UserProgress.findOne({ userId, courseId });
    
    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    progress.notes.push({
      lessonId,
      timestamp,
      content,
      createdAt: new Date()
    });

    await progress.save();
    res.json({ message: 'Note added successfully' });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ error: 'Failed to add note' });
  }
});

// Get user's overall statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get course progress
    const courseProgress = await UserProgress.find({ userId });
    const totalCourses = courseProgress.length;
    const completedCourses = courseProgress.filter(p => p.progressPercentage === 100).length;
    const totalStudyTime = courseProgress.reduce((sum, p) => sum + p.timeSpent, 0);

    // Get problem solving stats
    const submissions = await Submission.find({ userId });
    const totalProblems = new Set(submissions.map(s => s.problemId.toString())).size;
    const solvedProblems = new Set(
      submissions.filter(s => s.status === 'accepted').map(s => s.problemId.toString())
    ).size;

    // Calculate quiz average
    const allQuizScores = courseProgress.flatMap(p => p.quizScores);
    const averageQuizScore = allQuizScores.length > 0 
      ? allQuizScores.reduce((sum, q) => sum + (q.score / q.maxScore) * 100, 0) / allQuizScores.length
      : 0;

    // Get leaderboard info
    const leaderboardEntry = await Leaderboard.findOne({ userId });
    const totalUsers = await Leaderboard.countDocuments();

    const stats = {
      totalCourses,
      completedCourses,
      totalProblems,
      solvedProblems,
      totalStudyTime,
      averageQuizScore: Math.round(averageQuizScore * 10) / 10,
      currentStreak: leaderboardEntry?.currentStreak || 0,
      longestStreak: leaderboardEntry?.longestStreak || 0,
      rank: leaderboardEntry?.rank || totalUsers + 1,
      totalUsers
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Submit quiz score
router.post('/quiz', authMiddleware, async (req, res) => {
  try {
    const { courseId, quizId, score, maxScore } = req.body;
    const userId = req.user._id;

    let progress = await UserProgress.findOne({ userId, courseId });
    
    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    // Check if quiz already completed
    const existingQuiz = progress.quizScores.find(q => q.quizId === quizId);
    if (existingQuiz) {
      // Update if new score is better
      if (score > existingQuiz.score) {
        existingQuiz.score = score;
        existingQuiz.completedAt = new Date();
      }
    } else {
      progress.quizScores.push({
        quizId,
        score,
        maxScore,
        completedAt: new Date()
      });
    }

    await progress.save();

    // Update leaderboard
    await updateLeaderboard(userId);

    res.json({ message: 'Quiz score recorded successfully' });
  } catch (error) {
    console.error('Error recording quiz score:', error);
    res.status(500).json({ error: 'Failed to record quiz score' });
  }
});

// Helper function to update leaderboard
async function updateLeaderboard(userId: string) {
  try {
    const courseProgress = await UserProgress.find({ userId });
    const submissions = await Submission.find({ userId });

    const totalScore = submissions
      .filter(s => s.status === 'accepted')
      .reduce((sum, s) => sum + s.score, 0);

    const problemsSolved = new Set(
      submissions.filter(s => s.status === 'accepted').map(s => s.problemId.toString())
    ).size;

    const coursesCompleted = courseProgress.filter(p => p.progressPercentage === 100).length;

    const allQuizScores = courseProgress.flatMap(p => p.quizScores);
    const averageQuizScore = allQuizScores.length > 0 
      ? allQuizScores.reduce((sum, q) => sum + (q.score / q.maxScore) * 100, 0) / allQuizScores.length
      : 0;

    const totalStudyTime = courseProgress.reduce((sum, p) => sum + p.timeSpent, 0);

    // Calculate streak (simplified - would need more complex logic for actual streaks)
    const recentActivity = await UserProgress.find({ 
      userId, 
      lastAccessed: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
    });
    const currentStreak = recentActivity.length;

    let leaderboard = await Leaderboard.findOne({ userId });
    
    if (!leaderboard) {
      leaderboard = new Leaderboard({ userId });
    }

    leaderboard.totalScore = totalScore;
    leaderboard.problemsSolved = problemsSolved;
    leaderboard.coursesCompleted = coursesCompleted;
    leaderboard.averageQuizScore = averageQuizScore;
    leaderboard.currentStreak = currentStreak;
    leaderboard.longestStreak = Math.max(leaderboard.longestStreak, currentStreak);
    leaderboard.totalStudyTime = totalStudyTime;
    leaderboard.lastUpdated = new Date();

    await leaderboard.save();

    // Update ranks (this could be optimized with a background job)
    const allEntries = await Leaderboard.find().sort({ totalScore: -1 });
    for (let i = 0; i < allEntries.length; i++) {
      allEntries[i].rank = i + 1;
      await allEntries[i].save();
    }

  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
}

export default router;
import express from 'express';
import mongoose from 'mongoose';
import Submission from '../models/Submission';
import { Problem, User, UserProblem } from '../models';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { CodeExecutor } from '../services/codeExecutor';

const router = express.Router();
const codeExecutor = new CodeExecutor();

// Submit solution for a problem
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { problemId, code, language, testResults, score, status, executionTime, passedTestCases, totalTestCases } = req.body;
    const userId = req.user._id;

    console.log('📝 Submission request received:');
    console.log('- Problem ID:', problemId);
    console.log('- Language:', language);
    console.log('- Code length:', code?.length || 0);
    console.log('- User ID:', userId);
    console.log('- Status:', status);
    console.log('- Score:', score);
    console.log('- Test Results:', passedTestCases, '/', totalTestCases);

    // Validate input
    if (!problemId || !code || !language) {
      console.log('❌ Missing required fields:', { problemId: !!problemId, code: !!code, language: !!language });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get problem details - try by ObjectId first, then by slug
    let problem;
    if (mongoose.Types.ObjectId.isValid(problemId)) {
      problem = await Problem.findById(problemId);
    } else {
      // Try to find by slug
      problem = await Problem.findOne({ slug: problemId });
    }
    if (!problem) {
      console.log('❌ Problem not found for ID/slug:', problemId);
      return res.status(404).json({ error: 'Problem not found' });
    }

    console.log('✅ Problem found:', problem.title);
    
    // Use the actual ObjectId for database operations
    const actualProblemId = problem._id;

    // Create submission with provided results
    const submission = new Submission({
      userId,
      problemId: actualProblemId,
      code,
      language,
      status: status || 'pending',
      score: score || 0,
      executionTime: executionTime || 0,
      memoryUsed: 0, // Not tracked by custom compiler yet
      judgedAt: new Date()
    });

    // Add test results if provided
    if (testResults && Array.isArray(testResults)) {
      submission.testResults = testResults.map((result: any, index: number) => ({
        testCaseId: `test_${index + 1}`,
        input: result.input || '',
        expectedOutput: result.expectedOutput || '',
        actualOutput: result.actualOutput || '',
        passed: result.passed || false,
        executionTime: result.executionTime || 0,
        memoryUsed: result.memoryUsed || 0
      }));
    }

    await submission.save();

    // Update or create UserProblem record
    const existingUserProblem = await UserProblem.findOne({ userId, problemId: actualProblemId });
    
    if (existingUserProblem) {
      // Update existing record
      existingUserProblem.attempts += 1;
      
      // Update if this is a better submission
      if ((score || 0) > existingUserProblem.bestScore) {
        existingUserProblem.bestScore = score || 0;
        existingUserProblem.bestExecutionTime = executionTime || 0;
        existingUserProblem.bestSubmissionId = submission._id;
        existingUserProblem.language = language;
      }
      
      // Mark as solved if all test cases passed
      if (status === 'accepted' && existingUserProblem.status !== 'solved') {
        existingUserProblem.status = 'solved';
        existingUserProblem.solvedAt = new Date();
        
        console.log('🎉 Problem marked as SOLVED for user:', userId);
        
        // Update user's solved problems count
        await User.findByIdAndUpdate(userId, {
          $inc: { totalProblemsSolved: 1 }
        });
      }
      
      await existingUserProblem.save();
    } else {
      // Create new UserProblem record
      const userProblem = new UserProblem({
        userId,
        problemId: actualProblemId,
        difficulty: problem.difficulty,
        status: status === 'accepted' ? 'solved' : 'attempted',
        bestSubmissionId: submission._id,
        attempts: 1,
        bestScore: score || 0,
        bestExecutionTime: executionTime || 0,
        language,
        solvedAt: status === 'accepted' ? new Date() : undefined
      });
      
      await userProblem.save();
      
      if (status === 'accepted') {
        console.log('🎉 Problem marked as SOLVED for user (first attempt):', userId);
      }
      
      // Update user's problem counts
      const updateData: any = { $inc: { totalProblemsAttempted: 1 } };
      if (status === 'accepted') {
        updateData.$inc.totalProblemsSolved = 1;
      }
      
      await User.findByIdAndUpdate(userId, updateData);
    }

    res.json({
      submissionId: submission._id,
      status: submission.status,
      score: submission.score,
      executionTime: submission.executionTime,
      memoryUsed: submission.memoryUsed,
      passedTestCases: passedTestCases || 0,
      totalTestCases: totalTestCases || 0,
      message: status === 'accepted' ? 'Problem solved successfully!' : 'Submission recorded'
    });

  } catch (error) {
    console.error('Error submitting solution:', error);
    res.status(500).json({ error: 'Failed to submit solution' });
  }
});

// Get submission details
router.get('/:submissionId', authMiddleware, async (req, res) => {
  try {
    const { submissionId } = req.params;
    const userId = req.user._id;

    const submission = await Submission.findOne({ 
      _id: submissionId, 
      userId 
    }).populate('problemId', 'title difficulty');

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
});

// Get user's submissions for a problem
router.get('/problem/:problemId', authMiddleware, async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const submissions = await Submission.find({ 
      userId, 
      problemId 
    })
    .sort({ submittedAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .select('status score executionTime submittedAt judgedAt');

    const total = await Submission.countDocuments({ userId, problemId });

    res.json({
      submissions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Get user's all submissions
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, status, language } = req.query;

    const filter: any = { userId };
    if (status) filter.status = status;
    if (language) filter.language = language;

    const submissions = await Submission.find(filter)
      .populate('problemId', 'title difficulty')
      .sort({ submittedAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Submission.countDocuments(filter);

    res.json({
      submissions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Get submission statistics
router.get('/stats/summary', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Submission.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgScore: { $avg: '$score' },
          avgExecutionTime: { $avg: '$executionTime' }
        }
      }
    ]);

    const languageStats = await Submission.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$language',
          count: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
          }
        }
      }
    ]);

    const totalSubmissions = await Submission.countDocuments({ userId });
    const acceptedSubmissions = await Submission.countDocuments({ 
      userId, 
      status: 'accepted' 
    });

    const uniqueProblems = await Submission.distinct('problemId', { userId });
    const solvedProblems = await Submission.distinct('problemId', { 
      userId, 
      status: 'accepted' 
    });

    res.json({
      totalSubmissions,
      acceptedSubmissions,
      acceptanceRate: totalSubmissions > 0 ? (acceptedSubmissions / totalSubmissions) * 100 : 0,
      totalProblems: uniqueProblems.length,
      solvedProblems: solvedProblems.length,
      statusBreakdown: stats,
      languageBreakdown: languageStats
    });
  } catch (error) {
    console.error('Error fetching submission stats:', error);
    res.status(500).json({ error: 'Failed to fetch submission stats' });
  }
});

// Get problem status for a user
router.get('/problem/:problemId/status', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id;

    const userProblem = await UserProblem.findOne({ userId, problemId });
    
    if (!userProblem) {
      return res.json({ status: 'not_attempted' });
    }

    res.json({
      status: userProblem.status,
      attempts: userProblem.attempts,
      bestScore: userProblem.bestScore,
      solvedAt: userProblem.solvedAt,
      language: userProblem.language
    });
  } catch (error) {
    console.error('Error fetching problem status:', error);
    res.status(500).json({ error: 'Failed to fetch problem status' });
  }
});

// Get user's solved problems by difficulty
router.get('/solved/by-difficulty', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user._id;

    const solvedProblems = await UserProblem.find({ 
      userId, 
      status: 'solved' 
    })
    .populate('problemId', 'title slug difficulty topic')
    .sort({ solvedAt: -1 });

    const groupedByDifficulty = {
      Easy: [],
      Medium: [],
      Hard: []
    };

    solvedProblems.forEach(userProblem => {
      const difficulty = userProblem.difficulty;
      if (groupedByDifficulty[difficulty]) {
        groupedByDifficulty[difficulty].push({
          problemId: userProblem.problemId,
          solvedAt: userProblem.solvedAt,
          bestScore: userProblem.bestScore,
          attempts: userProblem.attempts,
          language: userProblem.language,
          executionTime: userProblem.bestExecutionTime
        });
      }
    });

    const stats = {
      total: solvedProblems.length,
      easy: groupedByDifficulty.Easy.length,
      medium: groupedByDifficulty.Medium.length,
      hard: groupedByDifficulty.Hard.length
    };

    res.json({
      stats,
      problems: groupedByDifficulty
    });
  } catch (error) {
    console.error('Error fetching solved problems:', error);
    res.status(500).json({ error: 'Failed to fetch solved problems' });
  }
});

export default router;
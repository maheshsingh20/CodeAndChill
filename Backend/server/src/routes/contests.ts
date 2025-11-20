import express from 'express';
import Contest from '../models/Contest';
import ContestSubmission from '../models/ContestSubmission';
import ContestLeaderboard from '../models/ContestLeaderboard';
import Problem from '../models/Problem';
import { User } from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all contests
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter: any = { isPublic: true };
    if (status) filter.status = status;
    
    const contests = await Contest.find(filter)
      .populate('createdBy', 'username')
      .sort({ startTime: status === 'upcoming' ? 1 : -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    // Update contest status based on current time
    const now = new Date();
    for (const contest of contests) {
      let newStatus = contest.status;
      
      if (now < contest.startTime) {
        newStatus = 'upcoming';
      } else if (now >= contest.startTime && now <= contest.endTime) {
        newStatus = 'active';
      } else if (now > contest.endTime) {
        newStatus = 'completed';
      }
      
      if (newStatus !== contest.status) {
        contest.status = newStatus;
        await contest.save();
      }
    }
    
    const total = await Contest.countDocuments(filter);
    
    res.json({
      contests,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({ error: 'Failed to fetch contests' });
  }
});

// Get contest by ID
router.get('/:contestId', async (req, res) => {
  try {
    const { contestId } = req.params;
    
    const contest = await Contest.findById(contestId)
      .populate('createdBy', 'username')
      .populate('problems.problemId', 'title difficulty description');
    
    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }
    
    // Update contest status
    const now = new Date();
    let newStatus = contest.status;
    
    if (now < contest.startTime) {
      newStatus = 'upcoming';
    } else if (now >= contest.startTime && now <= contest.endTime) {
      newStatus = 'active';
    } else if (now > contest.endTime) {
      newStatus = 'completed';
    }
    
    if (newStatus !== contest.status) {
      contest.status = newStatus;
      await contest.save();
    }
    
    res.json(contest);
  } catch (error) {
    console.error('Error fetching contest:', error);
    res.status(500).json({ error: 'Failed to fetch contest' });
  }
});

// Register for contest
router.post('/:contestId/register', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { contestId } = req.params;
    const userId = req.user._id;
    
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }
    
    // Check if contest is still upcoming
    if (contest.status !== 'upcoming') {
      return res.status(400).json({ error: 'Cannot register for this contest' });
    }
    
    // Check if already registered
    if (contest.participants.includes(userId)) {
      return res.status(400).json({ error: 'Already registered for this contest' });
    }
    
    // Check participant limit
    if (contest.maxParticipants && contest.participants.length >= contest.maxParticipants) {
      return res.status(400).json({ error: 'Contest is full' });
    }
    
    // Register user
    contest.participants.push(userId);
    await contest.save();
    
    // Create leaderboard entry
    const user = await User.findById(userId);
    const leaderboardEntry = new ContestLeaderboard({
      contestId,
      userId,
      username: user?.name || 'Unknown',
      totalScore: 0,
      totalPenalty: 0,
      problemsSolved: 0,
      problemScores: contest.problems.map(p => ({
        problemId: p.problemId,
        score: 0,
        attempts: 0,
        penalty: 0
      }))
    });
    
    await leaderboardEntry.save();
    
    res.json({ message: 'Successfully registered for contest' });
  } catch (error) {
    console.error('Error registering for contest:', error);
    res.status(500).json({ error: 'Failed to register for contest' });
  }
});

// Get contest problems (only for registered users during active contest)
router.get('/:contestId/problems', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { contestId } = req.params;
    const userId = req.user._id;
    
    const contest = await Contest.findById(contestId)
      .populate('problems.problemId');
    
    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }
    
    // Check if user is registered
    if (!contest.participants.includes(userId)) {
      return res.status(403).json({ error: 'Not registered for this contest' });
    }
    
    // Check if contest is active
    if (contest.status !== 'active') {
      return res.status(400).json({ error: 'Contest is not active' });
    }
    
    // Get user's submissions for this contest
    const submissions = await ContestSubmission.find({ contestId, userId });
    
    const problems = contest.problems.map(cp => {
      const problem = cp.problemId as any;
      const userSubmissions = submissions.filter(s => s.problemId.toString() === problem._id.toString());
      const bestSubmission = userSubmissions.find(s => s.status === 'accepted') || 
                           userSubmissions.sort((a, b) => b.score - a.score)[0];
      
      return {
        _id: problem._id,
        title: problem.title,
        difficulty: problem.difficulty,
        description: problem.description,
        points: cp.points,
        order: cp.order,
        attempts: userSubmissions.length,
        solved: bestSubmission?.status === 'accepted',
        bestScore: bestSubmission?.score || 0,
        testCases: problem.testCases?.map((tc: any) => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput
        })) || []
      };
    });
    
    res.json({ problems: problems.sort((a, b) => a.order - b.order) });
  } catch (error) {
    console.error('Error fetching contest problems:', error);
    res.status(500).json({ error: 'Failed to fetch contest problems' });
  }
});

// Submit solution
router.post('/:contestId/submit', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { contestId } = req.params;
    const { problemId, code, language } = req.body;
    const userId = req.user._id;
    
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }
    
    // Check if user is registered
    if (!contest.participants.includes(userId)) {
      return res.status(403).json({ error: 'Not registered for this contest' });
    }
    
    // Check if contest is active
    if (contest.status !== 'active') {
      return res.status(400).json({ error: 'Contest is not active' });
    }
    
    // Get problem details
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    
    // Create submission
    const submission = new ContestSubmission({
      contestId,
      userId,
      problemId,
      code,
      language,
      totalTestCases: problem.testCases?.length || 0,
      submittedAt: new Date()
    });
    
    // Simulate code execution (in real implementation, this would use a code execution service)
    const executionResult = await simulateCodeExecution(code, language, problem.testCases || []);
    
    submission.status = executionResult.status;
    submission.score = executionResult.score;
    submission.executionTime = executionResult.executionTime;
    submission.memoryUsed = executionResult.memoryUsed;
    submission.testCasesPassed = executionResult.testCasesPassed;
    submission.judgedAt = new Date();
    
    await submission.save();
    
    // Update leaderboard
    await updateLeaderboard(contestId, userId, problemId, submission);
    
    res.json({
      submissionId: submission._id,
      status: submission.status,
      score: submission.score,
      testCasesPassed: submission.testCasesPassed,
      totalTestCases: submission.totalTestCases,
      executionTime: submission.executionTime
    });
  } catch (error) {
    console.error('Error submitting solution:', error);
    res.status(500).json({ error: 'Failed to submit solution' });
  }
});

// Get contest leaderboard
router.get('/:contestId/leaderboard', async (req, res) => {
  try {
    const { contestId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const leaderboard = await ContestLeaderboard.find({ contestId })
      .sort({ totalScore: -1, totalPenalty: 1, lastSubmissionTime: 1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('userId', 'name avatar');
    
    // Update ranks
    leaderboard.forEach((entry, index) => {
      entry.rank = (Number(page) - 1) * Number(limit) + index + 1;
    });
    
    const total = await ContestLeaderboard.countDocuments({ contestId });
    
    res.json({
      leaderboard,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get user's contest submissions
router.get('/:contestId/submissions', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { contestId } = req.params;
    const userId = req.user._id;
    
    const submissions = await ContestSubmission.find({ contestId, userId })
      .populate('problemId', 'title')
      .sort({ submittedAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Helper function to simulate code execution
async function simulateCodeExecution(code: string, language: string, testCases: any[]) {
  // This is a simplified simulation - in production, you'd use a proper code execution service
  const executionTime = Math.floor(Math.random() * 1000) + 100; // 100-1100ms
  const memoryUsed = Math.floor(Math.random() * 50000) + 10000; // 10-60MB
  
  // Simulate test case results
  const passRate = Math.random();
  let testCasesPassed = 0;
  let status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compilation_error' = 'accepted';
  
  if (passRate > 0.8) {
    testCasesPassed = testCases.length;
    status = 'accepted';
  } else if (passRate > 0.6) {
    testCasesPassed = Math.floor(testCases.length * 0.7);
    status = 'wrong_answer';
  } else if (passRate > 0.4) {
    testCasesPassed = Math.floor(testCases.length * 0.5);
    status = 'time_limit_exceeded';
  } else if (passRate > 0.2) {
    testCasesPassed = Math.floor(testCases.length * 0.3);
    status = 'runtime_error';
  } else {
    testCasesPassed = 0;
    status = 'compilation_error';
  }
  
  const score = status === 'accepted' ? 100 : Math.floor((testCasesPassed / testCases.length) * 100);
  
  return {
    status,
    score,
    executionTime,
    memoryUsed,
    testCasesPassed
  };
}

// Helper function to update leaderboard
async function updateLeaderboard(contestId: string, userId: string, problemId: string, submission: any) {
  try {
    const leaderboard = await ContestLeaderboard.findOne({ contestId, userId });
    if (!leaderboard) return;
    
    const contest = await Contest.findById(contestId);
    if (!contest) return;
    
    const problemConfig = contest.problems.find(p => p.problemId.toString() === problemId);
    if (!problemConfig) return;
    
    // Find problem score entry
    const problemScoreIndex = leaderboard.problemScores.findIndex(
      ps => ps.problemId.toString() === problemId
    );
    
    if (problemScoreIndex === -1) return;
    
    const problemScore = leaderboard.problemScores[problemScoreIndex];
    problemScore.attempts += 1;
    
    // Calculate penalty (20 minutes per wrong submission before first correct one)
    if (submission.status !== 'accepted' && !problemScore.solvedAt) {
      problemScore.penalty += 20;
    }
    
    // If this is the first accepted solution for this problem
    if (submission.status === 'accepted' && !problemScore.solvedAt) {
      problemScore.score = problemConfig.points;
      problemScore.solvedAt = submission.submittedAt;
      leaderboard.problemsSolved += 1;
    }
    
    // Recalculate totals
    leaderboard.totalScore = leaderboard.problemScores.reduce((sum, ps) => sum + ps.score, 0);
    leaderboard.totalPenalty = leaderboard.problemScores.reduce((sum, ps) => sum + ps.penalty, 0);
    leaderboard.lastSubmissionTime = submission.submittedAt;
    
    await leaderboard.save();
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
}

export default router;
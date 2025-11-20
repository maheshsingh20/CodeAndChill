import express from 'express';
import SkillTest from '../models/SkillTest';
import SkillTestAttempt from '../models/SkillTestAttempt';
import { User } from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all available skill tests
router.get('/', async (req, res) => {
  try {
    const { skill, difficulty, page = 1, limit = 10 } = req.query;
    
    const filter: any = { isActive: true };
    if (skill) filter.skillName = new RegExp(skill as string, 'i');
    if (difficulty) filter.difficulty = difficulty;

    const skillTests = await SkillTest.find(filter)
      .select('-questions.correctAnswer -questions.explanation') // Hide answers from list
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await SkillTest.countDocuments(filter);

    res.json({
      skillTests,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching skill tests:', error);
    res.status(500).json({ error: 'Failed to fetch skill tests' });
  }
});

// Get available skills (unique skill names)
router.get('/skills', async (req, res) => {
  try {
    const skills = await SkillTest.distinct('skillName', { isActive: true });
    res.json({ skills: skills.sort() });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// Get skill test by ID (for taking the test)
router.get('/:testId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { testId } = req.params;
    const userId = req.user._id;

    const skillTest = await SkillTest.findById(testId);
    if (!skillTest) {
      return res.status(404).json({ error: 'Skill test not found' });
    }

    // Check if user has already passed this skill test
    const existingAttempt = await SkillTestAttempt.findOne({
      userId,
      skillTestId: testId,
      passed: true
    });

    // Remove correct answers and explanations for security
    const testForUser = {
      ...skillTest.toObject(),
      questions: skillTest.questions.map(q => ({
        id: q.id,
        question: q.question,
        type: q.type,
        options: q.options,
        points: q.points,
        codeTemplate: q.codeTemplate
      })),
      alreadyPassed: !!existingAttempt
    };

    res.json(testForUser);
  } catch (error) {
    console.error('Error fetching skill test:', error);
    res.status(500).json({ error: 'Failed to fetch skill test' });
  }
});

// Submit skill test attempt
router.post('/:testId/submit', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { testId } = req.params;
    const userId = req.user._id;
    const { answers, timeSpent, startedAt } = req.body;

    const skillTest = await SkillTest.findById(testId);
    if (!skillTest) {
      return res.status(404).json({ error: 'Skill test not found' });
    }

    // Check if user has already passed this skill test
    const existingPassedAttempt = await SkillTestAttempt.findOne({
      userId,
      skillTestId: testId,
      passed: true
    });

    if (existingPassedAttempt) {
      return res.status(400).json({ error: 'You have already passed this skill test' });
    }

    // Calculate score
    let totalScore = 0;
    let totalPoints = 0;
    const gradedAnswers = [];

    for (const question of skillTest.questions) {
      const userAnswer = answers.find((a: any) => a.questionId === question.id);
      totalPoints += question.points;

      if (userAnswer) {
        let isCorrect = false;
        
        // Check answer based on question type
        if (question.type === 'multiple_choice' || question.type === 'true_false') {
          isCorrect = userAnswer.answer === question.correctAnswer;
        } else if (question.type === 'code') {
          // For code questions, we'll do a simple string comparison
          // In a real implementation, you'd want to execute and test the code
          isCorrect = userAnswer.answer.trim() === question.correctAnswer;
        }

        const points = isCorrect ? question.points : 0;
        totalScore += points;

        gradedAnswers.push({
          questionId: question.id,
          answer: userAnswer.answer,
          isCorrect,
          points,
          timeSpent: userAnswer.timeSpent || 0
        });
      } else {
        gradedAnswers.push({
          questionId: question.id,
          answer: '',
          isCorrect: false,
          points: 0,
          timeSpent: 0
        });
      }
    }

    const percentage = Math.round((totalScore / totalPoints) * 100);
    const passed = percentage >= skillTest.passingScore;

    // Create attempt record
    const attempt = new SkillTestAttempt({
      userId,
      skillTestId: testId,
      skillName: skillTest.skillName,
      answers: gradedAnswers,
      score: totalScore,
      totalPoints,
      percentage,
      passed,
      timeSpent,
      startedAt: new Date(startedAt),
      completedAt: new Date(),
      skillAwarded: false
    });

    await attempt.save();

    // If passed, add skill to user profile
    if (passed) {
      const user = await User.findById(userId);
      if (user && !user.skills.includes(skillTest.skillName)) {
        user.skills.push(skillTest.skillName);
        await user.save();
        
        // Mark skill as awarded
        attempt.skillAwarded = true;
        await attempt.save();
      }
    }

    // Return results with explanations
    const resultsWithExplanations = {
      attemptId: attempt._id,
      passed,
      score: totalScore,
      totalPoints,
      percentage,
      skillAwarded: passed && attempt.skillAwarded,
      skillName: skillTest.skillName,
      questions: skillTest.questions.map(q => {
        const userAnswer = gradedAnswers.find(a => a.questionId === q.id);
        return {
          id: q.id,
          question: q.question,
          type: q.type,
          options: q.options,
          correctAnswer: q.correctAnswer,
          userAnswer: userAnswer?.answer,
          isCorrect: userAnswer?.isCorrect,
          points: q.points,
          earnedPoints: userAnswer?.points || 0,
          explanation: q.explanation
        };
      })
    };

    res.json(resultsWithExplanations);
  } catch (error) {
    console.error('Error submitting skill test:', error);
    res.status(500).json({ error: 'Failed to submit skill test' });
  }
});

// Get user's skill test attempts
router.get('/attempts/history', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, skill, passed } = req.query;

    const filter: any = { userId };
    if (skill) filter.skillName = new RegExp(skill as string, 'i');
    if (passed !== undefined) filter.passed = passed === 'true';

    const attempts = await SkillTestAttempt.find(filter)
      .populate('skillTestId', 'title difficulty')
      .sort({ completedAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await SkillTestAttempt.countDocuments(filter);

    res.json({
      attempts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching skill test attempts:', error);
    res.status(500).json({ error: 'Failed to fetch attempts' });
  }
});

// Get attempt details
router.get('/attempts/:attemptId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { attemptId } = req.params;
    const userId = req.user._id;

    const attempt = await SkillTestAttempt.findOne({
      _id: attemptId,
      userId
    }).populate('skillTestId');

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    res.json(attempt);
  } catch (error) {
    console.error('Error fetching attempt details:', error);
    res.status(500).json({ error: 'Failed to fetch attempt details' });
  }
});

// Get user's earned skills from skill tests
router.get('/earned/skills', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user._id;

    const earnedSkills = await SkillTestAttempt.find({
      userId,
      passed: true,
      skillAwarded: true
    }).select('skillName completedAt percentage').sort({ completedAt: -1 });

    res.json({ earnedSkills });
  } catch (error) {
    console.error('Error fetching earned skills:', error);
    res.status(500).json({ error: 'Failed to fetch earned skills' });
  }
});

export default router;
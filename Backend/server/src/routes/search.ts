import { Router, Request, Response } from "express";
import { GeneralCourse, ProblemSet, Subject, Quiz, Contest } from "../models";
import SkillTest from "../models/SkillTest";
import { authMiddleware, AuthRequest } from "../middleware";

const router = Router();

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'problem' | 'quiz' | 'contest' | 'skill-test';
  url: string;
  category?: string;
  difficulty?: string;
  tags?: string[];
  score?: number; // Relevance score
}

// Global search endpoint
router.get("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { q: query, limit = 20 } = req.query;
    
    if (!query || typeof query !== 'string') {
      res.status(400).json({ message: "Query parameter 'q' is required" });
      return;
    }

    const searchQuery = query.trim();
    if (searchQuery.length < 2) {
      res.json({ results: [] });
      return;
    }

    const results: SearchResult[] = [];

    // Create regex for case-insensitive search
    const searchRegex = new RegExp(searchQuery, 'i');

    // Search courses
    try {
      const courses = await GeneralCourse.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
          { tags: { $in: [searchRegex] } }
        ]
      }).limit(10);

      courses.forEach(course => {
        const score = calculateRelevanceScore(course.title, course.description, searchQuery);
        results.push({
          id: course._id.toString(),
          title: course.title,
          description: course.description,
          type: 'course',
          url: `/courses/${course.slug}`,
          category: course.category,
          tags: course.tags,
          score
        });
      });
    } catch (error) {
      console.error('Course search error:', error);
    }

    // Search problem sets and problems
    try {
      const problemSets = await ProblemSet.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
          { 'problems.title': searchRegex },
          { 'problems.description': searchRegex }
        ]
      }).limit(10);

      problemSets.forEach(set => {
        // Add problem set itself
        const setScore = calculateRelevanceScore(set.title, set.description, searchQuery);
        results.push({
          id: set._id.toString(),
          title: set.title,
          description: set.description,
          type: 'problem',
          url: `/problems/${set._id}`,
          difficulty: set.difficulty,
          category: set.category,
          score: setScore
        });

        // Add individual problems that match
        set.problems?.forEach(problem => {
          if (searchRegex.test(problem.title) || searchRegex.test(problem.description)) {
            const problemScore = calculateRelevanceScore(problem.title, problem.description, searchQuery);
            results.push({
              id: problem._id.toString(),
              title: problem.title,
              description: problem.description,
              type: 'problem',
              url: `/solve/${problem._id}`,
              difficulty: problem.difficulty,
              category: set.category,
              score: problemScore
            });
          }
        });
      });
    } catch (error) {
      console.error('Problem search error:', error);
    }

    // Search quiz subjects
    try {
      const subjects = await Subject.find({
        name: searchRegex
      }).limit(5);

      subjects.forEach(subject => {
        const score = calculateRelevanceScore(subject.name, `Quiz subject: ${subject.name}`, searchQuery);
        results.push({
          id: subject._id.toString(),
          title: subject.name,
          description: `Quiz subject: ${subject.name}`,
          type: 'quiz',
          url: `/quizzes/subjects/${subject.slug}`,
          category: 'Quiz',
          score
        });
      });
    } catch (error) {
      console.error('Quiz search error:', error);
    }

    // Search contests
    try {
      const contests = await Contest.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex }
        ]
      }).limit(5);

      contests.forEach(contest => {
        const score = calculateRelevanceScore(contest.title, contest.description, searchQuery);
        results.push({
          id: contest._id.toString(),
          title: contest.title,
          description: contest.description,
          type: 'contest',
          url: `/contests/${contest._id}`,
          category: 'Contest',
          score
        });
      });
    } catch (error) {
      console.error('Contest search error:', error);
    }

    // Search skill tests
    try {
      const skillTests = await SkillTest.find({
        $or: [
          { skill: searchRegex },
          { title: searchRegex }
        ]
      }).limit(5);

      skillTests.forEach(test => {
        const title = test.title || `${test.skill} Skill Test`;
        const description = `Test your ${test.skill} skills`;
        const score = calculateRelevanceScore(title, description, searchQuery);
        results.push({
          id: test._id.toString(),
          title,
          description,
          type: 'skill-test',
          url: `/skill-tests/${test._id}`,
          difficulty: test.difficulty,
          category: test.skill,
          score
        });
      });
    } catch (error) {
      console.error('Skill test search error:', error);
    }

    // Sort by relevance score (highest first) and limit results
    const sortedResults = results
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, parseInt(limit as string));

    res.json({
      results: sortedResults,
      total: sortedResults.length,
      query: searchQuery
    });

  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error during search" });
  }
});

// Calculate relevance score based on title and description matches
function calculateRelevanceScore(title: string, description: string, query: string): number {
  const queryLower = query.toLowerCase();
  const titleLower = title.toLowerCase();
  const descriptionLower = description.toLowerCase();
  
  let score = 0;
  
  // Exact title match gets highest score
  if (titleLower === queryLower) {
    score += 100;
  }
  // Title starts with query
  else if (titleLower.startsWith(queryLower)) {
    score += 80;
  }
  // Title contains query
  else if (titleLower.includes(queryLower)) {
    score += 60;
  }
  
  // Description contains query
  if (descriptionLower.includes(queryLower)) {
    score += 20;
  }
  
  // Bonus for shorter titles (more specific matches)
  if (title.length < 50) {
    score += 10;
  }
  
  return score;
}

export default router;
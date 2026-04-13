import { Router, Request, Response } from "express";
import { 
  ProblemSet, 
  Subject, 
  Quiz, 
  Contest, 
  CollaborativeSession,
  Course,
  SuccessStory
} from "../models";
import SkillTest from "../models/SkillTest";
import EngineeringCourse from "../models/EngineeringCourse";
import LearningPath from "../models/LearningPath";
import BlogPost from "../models/BlogPost";
import CommunityPost from "../models/CommunityPost";
import Job from "../models/Job";
import { authMiddleware, AuthRequest } from "../middleware";

const router = Router();

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'problem' | 'quiz' | 'contest' | 'skill-test' | 'collaborative' | 'learning-path' | 'blog' | 'community' | 'job' | 'success-story' | 'engineering-course';
  url: string;
  category?: string;
  difficulty?: string;
  tags?: string[];
  score?: number; // Relevance score
  sessionCode?: string; // For collaborative sessions
  participants?: number; // For collaborative sessions
  language?: string; // For collaborative sessions
  author?: string; // For blog/community posts
  company?: string; // For jobs
  location?: string; // For jobs
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
          id: (set._id as any).toString(),
          title: set.title,
          description: set.description,
          type: 'problem',
          url: `/problems/${set._id}`,
          score: setScore
        });

        // Add individual problems that match (problems are ObjectIds, skip individual problem search here)

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
          id: (subject._id as any).toString(),
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
          id: (contest._id as any).toString(),
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
          { skillName: searchRegex },
          { title: searchRegex }
        ]
      }).limit(5);

      skillTests.forEach(test => {
        const title = test.title || `${test.skillName} Skill Test`;
        const description = `Test your ${test.skillName} skills`;
        const score = calculateRelevanceScore(title, description, searchQuery);
        results.push({
          id: (test._id as any).toString(),
          title,
          description,
          type: 'skill-test',
          url: `/skill-tests/${test._id}`,
          difficulty: test.difficulty,
          category: test.skillName,
          score
        });
      });
    } catch (error) {
      console.error('Skill test search error:', error);
    }

    // Search active collaborative sessions
    try {
      const sessions = await CollaborativeSession.find({
        isActive: true,
        $or: [
          { sessionCode: searchRegex },
          { hostName: searchRegex },
          { language: searchRegex },
          { 'participants.name': searchRegex }
        ]
      }).limit(5);

      sessions.forEach(session => {
        const title = `${session.hostName}'s ${session.language} Session`;
        const description = `Active collaborative coding session with ${session.participants.length} participant(s)`;
        let score = calculateRelevanceScore(title, description, searchQuery);
        
        // Boost score if searching by session code
        if (session.sessionCode.toLowerCase().includes(searchQuery.toLowerCase())) {
          score += 50;
        }

        results.push({
          id: (session._id as any).toString(),
          title,
          description,
          type: 'collaborative',
          url: `/collaborative/${session.sessionCode}`,
          category: 'Collaborative Coding',
          sessionCode: session.sessionCode,
          participants: session.participants.length,
          language: session.language,
          score
        });
      });
    } catch (error) {
      console.error('Collaborative session search error:', error);
    }

    // Search CS courses (free courses)
    try {
      const courses = await Course.find({
        $or: [
          { courseTitle: searchRegex },
          { slug: searchRegex }
        ]
      }).limit(5);

      courses.forEach(course => {
        const score = calculateRelevanceScore(course.courseTitle, course.courseTitle, searchQuery);
        results.push({
          id: (course._id as any).toString(),
          title: course.courseTitle,
          description: course.courseTitle,
          type: 'course',
          url: `/courses/${course.slug}`,
          score
        });
      });
    } catch (error) {
      console.error('Course search error:', error);
    }

    // Search engineering courses (paid courses)
    try {
      const engineeringCourses = await EngineeringCourse.find({
        isActive: true,
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
          { tags: searchRegex }
        ]
      }).limit(5);

      engineeringCourses.forEach(course => {
        const score = calculateRelevanceScore(course.title, course.description, searchQuery);
        results.push({
          id: (course._id as any).toString(),
          title: course.title,
          description: course.description,
          type: 'engineering-course',
          url: `/engineering-courses/${course.id}`,
          category: course.category,
          difficulty: course.difficulty,
          score
        });
      });
    } catch (error) {
      console.error('Engineering course search error:', error);
    }

    // Search learning paths
    try {
      const learningPaths = await LearningPath.find({
        isPublic: true,
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { tags: searchRegex }
        ]
      }).limit(5);

      learningPaths.forEach(path => {
        const score = calculateRelevanceScore(path.title, path.description, searchQuery);
        results.push({
          id: (path._id as any).toString(),
          title: path.title,
          description: path.description,
          type: 'learning-path',
          url: `/learning-paths/${path._id}`,
          difficulty: path.difficulty,
          score
        });
      });
    } catch (error) {
      console.error('Learning path search error:', error);
    }

    // Search blog posts
    try {
      const blogPosts = await BlogPost.find({
        $or: [
          { title: searchRegex },
          { content: searchRegex },
          { tags: searchRegex },
          { author: searchRegex }
        ]
      }).limit(5);

      blogPosts.forEach(post => {
        const score = calculateRelevanceScore(post.title, post.content.substring(0, 200), searchQuery);
        results.push({
          id: (post._id as any).toString(),
          title: post.title,
          description: post.content.substring(0, 150) + '...',
          type: 'blog',
          url: `/blog/${post._id}`,
          category: 'Blog',
          author: (post.author as any)?.toString(),
          tags: post.tags,
          score
        });
      });
    } catch (error) {
      console.error('Blog post search error:', error);
    }

    // Search community posts
    try {
      const communityPosts = await CommunityPost.find({
        $or: [
          { title: searchRegex },
          { content: searchRegex },
          { tags: searchRegex }
        ]
      }).limit(5);

      communityPosts.forEach(post => {
        const score = calculateRelevanceScore(post.title, post.content.substring(0, 200), searchQuery);
        results.push({
          id: (post._id as any).toString(),
          title: post.title,
          description: post.content.substring(0, 150) + '...',
          type: 'community',
          url: `/forum/${post._id}`,
          category: 'Community',
          tags: post.tags,
          score
        });
      });
    } catch (error) {
      console.error('Community post search error:', error);
    }

    // Search jobs
    try {
      const jobs = await Job.find({
        isActive: true,
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { company: searchRegex },
          { location: searchRegex },
          { skills: searchRegex },
          { type: searchRegex }
        ]
      }).limit(5);

      jobs.forEach(job => {
        const score = calculateRelevanceScore(job.title, job.description, searchQuery);
        results.push({
          id: (job._id as any).toString(),
          title: job.title,
          description: job.description.substring(0, 150) + '...',
          type: 'job',
          url: `/jobs/${job._id}`,
          category: job.type,
          company: job.company,
          location: job.location,
          score
        });
      });
    } catch (error) {
      console.error('Job search error:', error);
    }

    // Search success stories
    try {
      const stories = await SuccessStory.find({
        $or: [
          { name: searchRegex },
          { company: searchRegex },
          { quote: searchRegex },
          { skills: searchRegex }
        ]
      }).limit(5);

      stories.forEach(story => {
        const title = `${story.name} - ${story.company}`;
        const score = calculateRelevanceScore(title, story.quote, searchQuery);
        results.push({
          id: (story._id as any).toString(),
          title,
          description: story.quote.substring(0, 150) + '...',
          type: 'success-story',
          url: `/success-stories/${story._id}`,
          category: 'Success Story',
          company: story.company,
          score
        });
      });
    } catch (error) {
      console.error('Success story search error:', error);
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
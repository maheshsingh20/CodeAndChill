const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'problem' | 'quiz' | 'contest' | 'skill-test';
  url: string;
  category?: string;
  difficulty?: string;
  tags?: string[];
}

export class SearchService {
  private static getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Global search across all content types
  static async globalSearch(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];

    try {
      // Try to use the backend search API first
      try {
        const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}&limit=20`, {
          headers: this.getAuthHeaders()
        });
        
        if (response.ok) {
          const data = await response.json();
          return data.results || [];
        }
      } catch (backendError) {
        console.log('Backend search unavailable, falling back to client-side search');
      }

      // Fallback to client-side search if backend is unavailable
      const results: SearchResult[] = [];

      // Search in parallel across different content types
      const [courses, problems, quizzes, contests, skillTests] = await Promise.allSettled([
        this.searchCourses(query),
        this.searchProblems(query),
        this.searchQuizzes(query),
        this.searchContests(query),
        this.searchSkillTests(query)
      ]);

      // Combine results from all successful searches
      if (courses.status === 'fulfilled') results.push(...courses.value);
      if (problems.status === 'fulfilled') results.push(...problems.value);
      if (quizzes.status === 'fulfilled') results.push(...quizzes.value);
      if (contests.status === 'fulfilled') results.push(...contests.value);
      if (skillTests.status === 'fulfilled') results.push(...skillTests.value);

      // Sort by relevance (exact matches first, then partial matches)
      return results.sort((a, b) => {
        const aExact = a.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
        const bExact = b.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
        return bExact - aExact;
      });
    } catch (error) {
      console.error('Global search error:', error);
      return [];
    }
  }

  // Search courses
  static async searchCourses(query: string): Promise<SearchResult[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/general-courses`);
      if (!response.ok) return [];
      
      const courses = await response.json();
      
      return courses
        .filter((course: any) => 
          course.title.toLowerCase().includes(query.toLowerCase()) ||
          course.description.toLowerCase().includes(query.toLowerCase()) ||
          course.category.toLowerCase().includes(query.toLowerCase())
        )
        .map((course: any) => ({
          id: course._id,
          title: course.title,
          description: course.description,
          type: 'course' as const,
          url: `/courses/${course.slug}`,
          category: course.category,
          tags: course.tags || []
        }));
    } catch (error) {
      console.error('Course search error:', error);
      return [];
    }
  }

  // Search problems
  static async searchProblems(query: string): Promise<SearchResult[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/problem-sets`);
      if (!response.ok) return [];
      
      const problemSets = await response.json();
      const results: SearchResult[] = [];

      problemSets.forEach((set: any) => {
        // Search in problem set title
        if (set.title.toLowerCase().includes(query.toLowerCase()) ||
            set.description.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            id: set._id,
            title: set.title,
            description: set.description,
            type: 'problem' as const,
            url: `/problems/${set._id}`,
            difficulty: set.difficulty,
            category: set.category
          });
        }

        // Search in individual problems
        set.problems?.forEach((problem: any) => {
          if (problem.title.toLowerCase().includes(query.toLowerCase()) ||
              problem.description.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              id: problem._id,
              title: problem.title,
              description: problem.description,
              type: 'problem' as const,
              url: `/solve/${problem._id}`,
              difficulty: problem.difficulty,
              category: set.category
            });
          }
        });
      });

      return results;
    } catch (error) {
      console.error('Problem search error:', error);
      return [];
    }
  }

  // Search quizzes
  static async searchQuizzes(query: string): Promise<SearchResult[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/subjects`);
      if (!response.ok) return [];
      
      const subjects = await response.json();
      const results: SearchResult[] = [];

      for (const subject of subjects) {
        if (subject.name.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            id: subject._id,
            title: subject.name,
            description: `Quiz subject: ${subject.name}`,
            type: 'quiz' as const,
            url: `/quizzes/subjects/${subject.slug}`,
            category: 'Quiz'
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Quiz search error:', error);
      return [];
    }
  }

  // Search contests
  static async searchContests(query: string): Promise<SearchResult[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/contests`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) return [];
      
      const contests = await response.json();
      
      return contests
        .filter((contest: any) => 
          contest.title.toLowerCase().includes(query.toLowerCase()) ||
          contest.description.toLowerCase().includes(query.toLowerCase())
        )
        .map((contest: any) => ({
          id: contest._id,
          title: contest.title,
          description: contest.description,
          type: 'contest' as const,
          url: `/contests/${contest._id}`,
          category: 'Contest'
        }));
    } catch (error) {
      console.error('Contest search error:', error);
      return [];
    }
  }

  // Search skill tests
  static async searchSkillTests(query: string): Promise<SearchResult[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/skill-tests`);
      if (!response.ok) return [];
      
      const skillTests = await response.json();
      
      return skillTests.tests
        ?.filter((test: any) => 
          test.skill.toLowerCase().includes(query.toLowerCase()) ||
          test.title.toLowerCase().includes(query.toLowerCase())
        )
        .map((test: any) => ({
          id: test._id,
          title: test.title || `${test.skill} Skill Test`,
          description: `Test your ${test.skill} skills`,
          type: 'skill-test' as const,
          url: `/skill-tests/${test._id}`,
          difficulty: test.difficulty,
          category: test.skill
        })) || [];
    } catch (error) {
      console.error('Skill test search error:', error);
      return [];
    }
  }
}
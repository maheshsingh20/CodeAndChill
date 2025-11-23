import { API_BASE_URL } from '@/constants';

export interface LearningPath {
  _id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  prerequisites: string[];
  tags: string[];
  isPublic: boolean;
  createdBy: {
    _id: string;
    name: string;
  };
  courses: {
    courseId: {
      _id: string;
      title: string;
      description: string;
      difficulty: string;
    };
    order: number;
    isRequired: boolean;
    estimatedHours: number;
  }[];
  milestones: {
    _id: string;
    title: string;
    description: string;
    courseIds: string[];
    order: number;
  }[];
  enrollmentCount: number;
  completionRate: number;
  averageRating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserLearningPath {
  _id: string;
  userId: string;
  pathId: LearningPath;
  enrolledAt: string;
  startedAt?: string;
  completedAt?: string;
  currentCourseId?: string;
  progress: {
    courseId: {
      _id: string;
      title: string;
      description: string;
    };
    completedAt?: string;
    progress: number;
    timeSpent: number;
  }[];
  milestoneProgress: {
    milestoneId: string;
    completedAt?: string;
    isCompleted: boolean;
  }[];
  totalTimeSpent: number;
  overallProgress: number;
  rating?: number;
  review?: string;
  isActive: boolean;
  lastAccessedAt: string;
}

export class LearningPathService {
  private static getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Get all learning paths
  static async getLearningPaths(difficulty?: string, tags?: string[], page = 1, limit = 10) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(difficulty && { difficulty }),
        ...(tags && tags.length > 0 && { tags: tags.join(',') })
      });

      const response = await fetch(`${API_BASE_URL}/learning-paths?${params}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch learning paths');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching learning paths:', error);
      throw error;
    }
  }

  // Get learning path by ID
  static async getLearningPath(pathId: string): Promise<LearningPath> {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/${pathId}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch learning path');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching learning path:', error);
      throw error;
    }
  }

  // Enroll in learning path
  static async enrollInPath(pathId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/${pathId}/enroll`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to enroll in learning path');
      }

      return await response.json();
    } catch (error) {
      console.error('Error enrolling in learning path:', error);
      throw error;
    }
  }

  // Get user's learning path progress
  static async getPathProgress(pathId: string): Promise<UserLearningPath> {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/${pathId}/progress`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch learning path progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching learning path progress:', error);
      throw error;
    }
  }

  // Update course progress
  static async updateCourseProgress(pathId: string, courseId: string, progress: number, timeSpent: number = 0) {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/${pathId}/progress/${courseId}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          progress,
          timeSpent
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update course progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating course progress:', error);
      throw error;
    }
  }

  // Get user's enrolled learning paths
  static async getEnrolledPaths(): Promise<UserLearningPath[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/user/enrolled`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch enrolled learning paths');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching enrolled learning paths:', error);
      throw error;
    }
  }

  // Rate learning path
  static async ratePath(pathId: string, rating: number, review?: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/${pathId}/rate`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          rating,
          review
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to rate learning path');
      }

      return await response.json();
    } catch (error) {
      console.error('Error rating learning path:', error);
      throw error;
    }
  }

  // Helper methods
  static getDifficultyColor(difficulty: string) {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  }

  static getDifficultyBadgeColor(difficulty: string) {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  }

  static formatDuration(hours: number): string {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`;
    }
    if (hours < 24) {
      return `${Math.round(hours)}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return `${days}d ${remainingHours}h`;
  }

  static getProgressColor(progress: number) {
    if (progress === 100) return 'text-green-400';
    if (progress >= 75) return 'text-blue-400';
    if (progress >= 50) return 'text-yellow-400';
    if (progress >= 25) return 'text-orange-400';
    return 'text-gray-400';
  }

  static getProgressBarColor(progress: number) {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-gray-500';
  }

  // Get course content
  static async getCourseContent(pathId: string, courseId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/${pathId}/courses/${courseId}/content`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch course content');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching course content:', error);
      throw error;
    }
  }

  // Discussions
  static async getDiscussions(pathId: string, filter = 'all', page = 1) {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/${pathId}/discussions?filter=${filter}&page=${page}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch discussions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching discussions:', error);
      throw error;
    }
  }

  static async postDiscussion(pathId: string, content: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/${pathId}/discussions`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error('Failed to post discussion');
      }

      return await response.json();
    } catch (error) {
      console.error('Error posting discussion:', error);
      throw error;
    }
  }

  static async likeDiscussion(pathId: string, discussionId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/${pathId}/discussions/${discussionId}/like`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to like discussion');
      }

      return await response.json();
    } catch (error) {
      console.error('Error liking discussion:', error);
      throw error;
    }
  }

  static async replyToDiscussion(pathId: string, discussionId: string, content: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/${pathId}/discussions/${discussionId}/reply`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error('Failed to reply to discussion');
      }

      return await response.json();
    } catch (error) {
      console.error('Error replying to discussion:', error);
      throw error;
    }
  }

  // Achievements
  static async getAchievements(pathId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/${pathId}/achievements`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch achievements');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  }

  static async checkAchievements(pathId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/${pathId}/achievements/check`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to check achievements');
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking achievements:', error);
      throw error;
    }
  }

  // Streak
  static async getStreak() {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/user/streak`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch streak');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching streak:', error);
      throw error;
    }
  }

  static async updateStreak() {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/user/streak/update`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to update streak');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
  }

  // Bookmarks
  static async getBookmarks() {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/user/bookmarks`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookmarks');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      throw error;
    }
  }

  static async toggleBookmark(pathId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/${pathId}/bookmark`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to toggle bookmark');
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      throw error;
    }
  }

  static async getBookmarkStatus(pathId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/${pathId}/bookmark/status`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to check bookmark status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      throw error;
    }
  }

  // Quiz Results
  static async submitQuizResult(
    pathId: string,
    courseId: string,
    lessonId: string,
    quizTitle: string,
    totalQuestions: number,
    correctAnswers: number,
    answers: any[],
    timeSpent: number
  ) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/learning-paths/${pathId}/courses/${courseId}/quiz/${lessonId}`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            quizTitle,
            totalQuestions,
            correctAnswers,
            answers,
            timeSpent
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit quiz result');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting quiz result:', error);
      throw error;
    }
  }

  static async getQuizResults(pathId: string, courseId: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/learning-paths/${pathId}/courses/${courseId}/quiz-results`,
        {
          headers: this.getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch quiz results');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      throw error;
    }
  }

  // Certificates
  static async generateCourseCertificate(pathId: string, courseId: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/learning-paths/${pathId}/courses/${courseId}/certificate`,
        {
          method: 'POST',
          headers: this.getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate certificate');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating certificate:', error);
      throw error;
    }
  }

  static async getUserCertificates() {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/user/certificates`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch certificates');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching certificates:', error);
      throw error;
    }
  }

  static async getCertificate(pathId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/${pathId}/certificate`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch certificate');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching certificate:', error);
      throw error;
    }
  }
}
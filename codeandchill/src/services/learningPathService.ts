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
}
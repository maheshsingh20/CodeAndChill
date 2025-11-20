const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`;

export class UserService {
  private static getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Get user profile
  static async getProfile() {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return response.json();
  }

  // Get user dashboard data
  static async getProfileDashboard() {
    const response = await fetch(`${API_BASE_URL}/user/profile-dashboard`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile dashboard');
    }
    
    return response.json();
  }

  // Update user profile
  static async updateProfile(profileData: any) {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    return response.json();
  }

  // Update user preferences
  static async updatePreferences(preferences: any) {
    const response = await fetch(`${API_BASE_URL}/user/preferences`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(preferences)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update preferences');
    }
    
    return response.json();
  }

  // Update user statistics
  static async updateStats(stats: {
    problemsAttempted?: number;
    problemsSolved?: number;
    quizzesTaken?: number;
    coursesCompleted?: number;
    streakUpdate?: boolean;
  }) {
    const response = await fetch(`${API_BASE_URL}/user/update-stats`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(stats)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update statistics');
    }
    
    return response.json();
  }

  // Get user achievements
  static async getAchievements() {
    const response = await fetch(`${API_BASE_URL}/user/achievements`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch achievements');
    }
    
    return response.json();
  }

  // Change password
  static async changePassword(currentPassword: string, newPassword: string) {
    const response = await fetch(`${API_BASE_URL}/user/change-password`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to change password');
    }
    
    return response.json();
  }

  // Helper method to update user activity (call this when user completes activities)
  static async recordActivity(activityType: 'problem_solved' | 'quiz_completed' | 'course_completed' | 'skill_test_passed') {
    const updates: any = { streakUpdate: true };
    
    switch (activityType) {
      case 'problem_solved':
        updates.problemsAttempted = 1;
        updates.problemsSolved = 1;
        break;
      case 'quiz_completed':
        updates.quizzesTaken = 1;
        break;
      case 'course_completed':
        updates.coursesCompleted = 1;
        break;
      case 'skill_test_passed':
        // Skill test completion is handled by the backend when skill is awarded
        break;
    }
    
    return this.updateStats(updates);
  }

  // Skill test related methods
  static async getSkillTests(params?: { skill?: string; difficulty?: string; page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.skill) searchParams.append('skill', params.skill);
    if (params?.difficulty) searchParams.append('difficulty', params.difficulty);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/skill-tests?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch skill tests');
    return response.json();
  }

  static async getSkillTest(testId: string) {
    const response = await fetch(`${API_BASE_URL}/skill-tests/${testId}`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch skill test');
    return response.json();
  }

  static async submitSkillTest(testId: string, answers: any[], timeSpent: number, startedAt: string) {
    const response = await fetch(`${API_BASE_URL}/skill-tests/${testId}/submit`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ answers, timeSpent, startedAt })
    });
    if (!response.ok) throw new Error('Failed to submit skill test');
    return response.json();
  }

  static async getSkillTestAttempts(params?: { page?: number; limit?: number; skill?: string; passed?: boolean }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.skill) searchParams.append('skill', params.skill);
    if (params?.passed !== undefined) searchParams.append('passed', params.passed.toString());

    const response = await fetch(`${API_BASE_URL}/skill-tests/attempts/history?${searchParams}`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch skill test attempts');
    return response.json();
  }

  static async getEarnedSkills() {
    const response = await fetch(`${API_BASE_URL}/skill-tests/earned/skills`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch earned skills');
    return response.json();
  }
}
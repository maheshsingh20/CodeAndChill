const API_BASE_URL = 'http://localhost:3001/api';

export type ActivityType = 'course_viewing' | 'problem_solving' | 'quiz_taking' | 'skill_testing' | 'forum_browsing' | 'general_browsing';

export class ActivityService {
  private static sessionId: string | null = null;
  private static currentActivity: ActivityType | null = null;
  private static sessionStartTime: number | null = null;
  private static activityStartTime: number | null = null;
  private static isTracking = false;

  private static getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Start a new session
  static async startSession(activityType: ActivityType = 'general_browsing', metadata?: any) {
    try {
      // Check if we have a valid token before making API calls
      const token = localStorage.getItem('authToken');
      if (this.isTracking || !token) return;

      const response = await fetch(`${API_BASE_URL}/activity/session/start`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ activityType, metadata })
      });

      if (!response.ok) throw new Error('Failed to start session');

      const data = await response.json();
      this.sessionId = data.sessionId;
      this.currentActivity = activityType;
      this.sessionStartTime = Date.now();
      this.activityStartTime = Date.now();
      this.isTracking = true;

      // Set up periodic updates
      this.startPeriodicUpdates();

      console.log('Activity tracking started:', activityType);
    } catch (error) {
      console.error('Error starting activity session:', error);
    }
  }

  // Update current activity
  static async updateActivity(activityType: ActivityType, metadata?: any) {
    try {
      // Check if we have a valid token before making API calls
      const token = localStorage.getItem('authToken');
      if (!this.isTracking || !this.sessionId || !token) return;

      const timeSpent = this.activityStartTime 
        ? Math.floor((Date.now() - this.activityStartTime) / 1000)
        : 0;

      const response = await fetch(`${API_BASE_URL}/activity/update`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          sessionId: this.sessionId,
          activityType,
          metadata,
          timeSpent
        })
      });

      if (!response.ok) throw new Error('Failed to update activity');

      this.currentActivity = activityType;
      this.activityStartTime = Date.now();

      console.log('Activity updated:', activityType);
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  }

  // End current session
  static async endSession() {
    try {
      // Check if we have a valid token before making API calls
      const token = localStorage.getItem('authToken');
      if (!this.isTracking || !this.sessionId || !token) return;

      const timeSpent = this.activityStartTime 
        ? Math.floor((Date.now() - this.activityStartTime) / 1000)
        : 0;

      const response = await fetch(`${API_BASE_URL}/activity/session/end`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          sessionId: this.sessionId,
          timeSpent
        })
      });

      if (!response.ok) throw new Error('Failed to end session');

      this.resetState();
      console.log('Activity tracking ended');
    } catch (error) {
      console.error('Error ending activity session:', error);
    }
  }

  // Get daily activity data
  static async getDailyActivity(days: number = 7) {
    try {
      const response = await fetch(`${API_BASE_URL}/activity/daily/${days}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) throw new Error('Failed to fetch daily activity');

      return response.json();
    } catch (error) {
      console.error('Error fetching daily activity:', error);
      throw error;
    }
  }

  // Get activity breakdown by type
  static async getActivityBreakdown(days: number = 7) {
    try {
      const response = await fetch(`${API_BASE_URL}/activity/breakdown/${days}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) throw new Error('Failed to fetch activity breakdown');

      return response.json();
    } catch (error) {
      console.error('Error fetching activity breakdown:', error);
      throw error;
    }
  }

  // Get current session info
  static async getCurrentSession() {
    try {
      const response = await fetch(`${API_BASE_URL}/activity/session/current`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) throw new Error('Failed to fetch current session');

      return response.json();
    } catch (error) {
      console.error('Error fetching current session:', error);
      throw error;
    }
  }

  // Start periodic updates (every 30 seconds)
  private static startPeriodicUpdates() {
    setInterval(() => {
      // Check if we still have a valid token before updating
      const token = localStorage.getItem('authToken');
      if (this.isTracking && this.sessionId && this.currentActivity && token) {
        this.updateActivity(this.currentActivity);
      }
    }, 30000); // Update every 30 seconds
  }

  // Cleanup session data
  private static resetState() {
    this.sessionId = null;
    this.currentActivity = null;
    this.sessionStartTime = null;
    this.activityStartTime = null;
    this.isTracking = false;
  }

  // Public cleanup method for logout
  static async cleanup() {
    try {
      // Check if we have a valid token before trying to end session
      const token = localStorage.getItem('authToken');
      if (this.isTracking && this.sessionId && token) {
        try {
          await this.endSession();
        } catch (error) {
          // Ignore errors during cleanup - session might already be ended
          console.log('Session cleanup completed (may have already been ended)');
        }
      }
    } catch (error) {
      console.error('Error during activity service cleanup:', error);
    } finally {
      // Always reset the state regardless of API call success
      this.sessionId = null;
      this.currentActivity = null;
      this.sessionStartTime = null;
      this.activityStartTime = null;
      this.isTracking = false;
    }
  }

  // Initialize activity tracking when user logs in
  static async initializeTracking() {
    try {
      // Always start a fresh session for new login to avoid conflicts
      await this.startSession();
    } catch (error) {
      console.error('Error initializing activity tracking:', error);
    }
  }

  // Helper methods for specific activities
  static trackCourseViewing(courseId: string) {
    this.updateActivity('course_viewing', { courseId });
  }

  static trackProblemSolving(problemId: string) {
    this.updateActivity('problem_solving', { problemId });
  }

  static trackQuizTaking(quizId: string) {
    this.updateActivity('quiz_taking', { quizId });
  }

  static trackSkillTesting(skillTestId: string) {
    this.updateActivity('skill_testing', { skillTestId });
  }

  static trackForumBrowsing() {
    this.updateActivity('forum_browsing');
  }

  static trackGeneralBrowsing(page?: string) {
    this.updateActivity('general_browsing', { page });
  }
}

// Note: Automatic session management removed to prevent logout issues on page refresh
// Activity sessions will be managed manually through the cleanup system
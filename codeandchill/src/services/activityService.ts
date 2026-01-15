const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export type ActivityType = 'course_viewing' | 'problem_solving' | 'quiz_taking' | 'skill_testing' | 'forum_browsing' | 'general_browsing';

export class ActivityService {
  private static sessionId: string | null = null;
  private static currentActivity: ActivityType | null = null;
  private static sessionStartTime: number | null = null;
  private static activityStartTime: number | null = null;
  private static isTracking = false;
  private static periodicUpdateInterval: ReturnType<typeof setInterval> | null = null;
  private static lastMetadata: any = null;
  
  // Add option to disable activity tracking completely
  // Can be controlled via environment variable or programmatically
  private static isEnabled = import.meta.env.VITE_ENABLE_ACTIVITY_TRACKING !== 'false';

  static setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.cleanup();
    }
  }

  static isActivityTrackingEnabled() {
    return this.isEnabled;
  }

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
      // Check if activity tracking is enabled
      if (!this.isEnabled) return;
      
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
      // Check if activity tracking is enabled
      if (!this.isEnabled) return;
      
      // Check if we have a valid token before making API calls
      const token = localStorage.getItem('authToken');
      if (!this.isTracking || !this.sessionId || !token) return;

      // Don't update if it's the same activity type and metadata (reduce API calls)
      if (this.currentActivity === activityType && 
          JSON.stringify(metadata) === JSON.stringify(this.lastMetadata)) {
        return;
      }

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

      const previousActivity = this.currentActivity;
      this.currentActivity = activityType;
      this.lastMetadata = metadata;
      this.activityStartTime = Date.now();

      // Only log when activity actually changes
      if (previousActivity !== activityType) {
        console.log('Activity updated:', activityType);
      }
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

  // Start periodic updates (every 2 minutes)
  private static startPeriodicUpdates() {
    // Clear any existing interval first
    if (this.periodicUpdateInterval) {
      clearInterval(this.periodicUpdateInterval);
    }

    this.periodicUpdateInterval = setInterval(() => {
      // Check if we still have a valid token before updating
      const token = localStorage.getItem('authToken');
      if (this.isTracking && this.sessionId && this.currentActivity && token) {
        // Only update if there's been significant activity (reduce console spam)
        this.updateActivitySilent(this.currentActivity);
      }
    }, 120000); // Increased to every 2 minutes to reduce conflicts
  }

  // Silent update method that doesn't log to console
  private static async updateActivitySilent(activityType: ActivityType, metadata?: any) {
    try {
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

      // Only log significant activity changes, not periodic updates
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  }

  // Cleanup session data
  private static resetState() {
    // Clear the periodic update interval
    if (this.periodicUpdateInterval) {
      clearInterval(this.periodicUpdateInterval);
      this.periodicUpdateInterval = null;
    }
    
    this.sessionId = null;
    this.currentActivity = null;
    this.sessionStartTime = null;
    this.activityStartTime = null;
    this.lastMetadata = null;
    this.isTracking = false;
  }

  // Public cleanup method for logout
  static async cleanup() {
    try {
      // Clear the periodic update interval first
      if (this.periodicUpdateInterval) {
        clearInterval(this.periodicUpdateInterval);
        this.periodicUpdateInterval = null;
      }

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
      this.resetState();
    }
  }

  // Initialize activity tracking when user logs in
  static async initializeTracking() {
    try {
      // Check if activity tracking is enabled
      if (!this.isEnabled) return;
      
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
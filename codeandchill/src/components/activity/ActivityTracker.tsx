import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ActivityService, ActivityType } from '@/services/activityService';

interface ActivityTrackerProps {
  isAuthenticated: boolean;
}

export const ActivityTracker: React.FC<ActivityTrackerProps> = ({ isAuthenticated }) => {
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      // End session if user logs out
      ActivityService.endSession();
      return;
    }

    // Initialize tracking when user is authenticated
    ActivityService.initializeTracking();

    return () => {
      // Cleanup on unmount
      ActivityService.endSession();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Track activity based on current route
    const trackRouteActivity = () => {
      const path = location.pathname;
      let activityType: ActivityType = 'general_browsing';
      let metadata: any = {};

      // Determine activity type based on route
      if (path.startsWith('/courses/') || path.startsWith('/learn/')) {
        activityType = 'course_viewing';
        const courseId = path.split('/')[2];
        if (courseId) metadata.courseId = courseId;
      } else if (path.startsWith('/problems/') || path.startsWith('/solve/')) {
        activityType = 'problem_solving';
        const problemId = path.split('/')[2];
        if (problemId) metadata.problemId = problemId;
      } else if (path.startsWith('/quizzes/') || path.includes('/quiz')) {
        activityType = 'quiz_taking';
        const quizId = path.split('/')[2];
        if (quizId) metadata.quizId = quizId;
      } else if (path.startsWith('/skill-tests/')) {
        activityType = 'skill_testing';
        const skillTestId = path.split('/')[2];
        if (skillTestId) metadata.skillTestId = skillTestId;
      } else if (path.startsWith('/forum')) {
        activityType = 'forum_browsing';
      } else {
        activityType = 'general_browsing';
        metadata.page = path;
      }

      // Update activity
      ActivityService.updateActivity(activityType, metadata);
    };

    // Track initial route
    trackRouteActivity();

    // Set up route change tracking with a small delay to ensure the route has changed
    const timeoutId = setTimeout(trackRouteActivity, 100);

    return () => clearTimeout(timeoutId);
  }, [location.pathname, isAuthenticated]);

  // Set up activity tracking for specific user interactions
  useEffect(() => {
    if (!isAuthenticated) return;

    // Track video play/pause events
    const handleVideoPlay = (event: Event) => {
      const target = event.target as HTMLVideoElement;
      if (target.tagName === 'VIDEO') {
        ActivityService.trackCourseViewing(target.dataset.courseId || 'unknown');
      }
    };

    // Track form submissions (quiz answers, problem submissions)
    const handleFormSubmit = (event: Event) => {
      const target = event.target as HTMLFormElement;
      const formType = target.dataset.activityType;
      
      if (formType === 'quiz') {
        ActivityService.trackQuizTaking(target.dataset.quizId || 'unknown');
      } else if (formType === 'problem') {
        ActivityService.trackProblemSolving(target.dataset.problemId || 'unknown');
      }
    };

    // Track clicks on specific elements
    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement;
      
      // Track course navigation
      if (target.closest('[data-activity="course-navigation"]')) {
        const courseId = target.closest('[data-course-id]')?.getAttribute('data-course-id');
        if (courseId) ActivityService.trackCourseViewing(courseId);
      }
      
      // Track problem attempts
      if (target.closest('[data-activity="problem-attempt"]')) {
        const problemId = target.closest('[data-problem-id]')?.getAttribute('data-problem-id');
        if (problemId) ActivityService.trackProblemSolving(problemId);
      }
    };

    // Add event listeners
    document.addEventListener('play', handleVideoPlay, true);
    document.addEventListener('submit', handleFormSubmit, true);
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('play', handleVideoPlay, true);
      document.removeEventListener('submit', handleFormSubmit, true);
      document.removeEventListener('click', handleClick, true);
    };
  }, [isAuthenticated]);

  // Track user engagement (mouse movement, keyboard activity)
  useEffect(() => {
    if (!isAuthenticated) return;

    let lastActivity = Date.now();
    let isIdle = false;
    const IDLE_THRESHOLD = 5 * 60 * 1000; // 5 minutes

    const updateLastActivity = () => {
      lastActivity = Date.now();
      if (isIdle) {
        isIdle = false;
        // Resume tracking
        ActivityService.initializeTracking();
      }
    };

    const checkIdle = () => {
      const now = Date.now();
      if (now - lastActivity > IDLE_THRESHOLD && !isIdle) {
        isIdle = true;
        // Pause tracking when idle
        ActivityService.endSession();
      }
    };

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateLastActivity, true);
    });

    // Check for idle state every minute
    const idleInterval = setInterval(checkIdle, 60000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateLastActivity, true);
      });
      clearInterval(idleInterval);
    };
  }, [isAuthenticated]);

  return null; // This component doesn't render anything
};
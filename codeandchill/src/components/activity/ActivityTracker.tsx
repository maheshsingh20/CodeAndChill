import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ActivityService, ActivityType } from '@/services/activityService';
interface ActivityTrackerProps {
  isAuthenticated: boolean;
}
export const ActivityTracker: React.FC<ActivityTrackerProps> = ({ isAuthenticated }) => {
  const location = useLocation();
  const lastPathRef = useRef<string>('');
  const initializationRef = useRef<boolean>(false);
  useEffect(() => {
    // Check if activity tracking is enabled
    if (!ActivityService.isActivityTrackingEnabled()) return;
    if (!isAuthenticated) {
      // End session if user logs out
      ActivityService.cleanup();
      initializationRef.current = false;
      return;
    }
    // Initialize tracking when user is authenticated (only once)
    if (!initializationRef.current) {
      ActivityService.initializeTracking();
      initializationRef.current = true;
    }
    return () => {
      // Cleanup on unmount
      ActivityService.cleanup();
      initializationRef.current = false;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    // Check if activity tracking is enabled
    if (!ActivityService.isActivityTrackingEnabled() || !isAuthenticated) return;
    // Only track if the path actually changed
    if (lastPathRef.current === location.pathname) return;
    lastPathRef.current = location.pathname;

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

    // Track route change with a small delay to ensure the route has changed
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

  // Track user engagement (mouse movement, keyboard activity) - Optimized
  useEffect(() => {
    if (!isAuthenticated) return;

    let lastActivity = Date.now();
    let isIdle = false;
    let activityTimeout: ReturnType<typeof setTimeout>;
    const IDLE_THRESHOLD = 5 * 60 * 1000; // 5 minutes
    const ACTIVITY_DEBOUNCE = 1000; // 1 second debounce

    const updateLastActivity = () => {
      // Debounce activity updates to prevent excessive API calls
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(() => {
        lastActivity = Date.now();
        if (isIdle) {
          isIdle = false;
          // Resume tracking
          ActivityService.initializeTracking();
        }
      }, ACTIVITY_DEBOUNCE);
    };

    const checkIdle = () => {
      const now = Date.now();
      if (now - lastActivity > IDLE_THRESHOLD && !isIdle) {
        isIdle = true;
        // Pause tracking when idle
        ActivityService.cleanup();
      }
    };

    // Track user activity (reduced event list for better performance)
    const events = ['mousedown', 'keypress', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateLastActivity, { passive: true });
    });

    // Check for idle state every 2 minutes instead of every minute
    const idleInterval = setInterval(checkIdle, 120000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateLastActivity);
      });
      clearInterval(idleInterval);
      clearTimeout(activityTimeout);
    };
  }, [isAuthenticated]);

  return null; // This component doesn't render anything
};
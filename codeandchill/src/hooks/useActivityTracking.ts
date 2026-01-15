/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ActivityService, ActivityType } from '@/services/activityService';

export const useActivityTracking = (activityType?: ActivityType, metadata?: any) => {
  const location = useLocation();
  const lastActivityRef = useRef<ActivityType | null>(null);

  useEffect(() => {
    // Determine activity type based on current route if not provided
    let currentActivityType: ActivityType = activityType || 'general_browsing';
    let currentMetadata = metadata || {};

    if (!activityType) {
      const path = location.pathname;
      
      if (path.includes('/courses') || path.includes('/learn')) {
        currentActivityType = 'course_viewing';
        const courseId = path.split('/').pop();
        if (courseId) currentMetadata.courseId = courseId;
      } else if (path.includes('/problems') || path.includes('/solve') || path.includes('/problem-solver')) {
        currentActivityType = 'problem_solving';
        const problemId = path.split('/').pop();
        if (problemId) currentMetadata.problemId = problemId;
      } else if (path.includes('/quiz')) {
        currentActivityType = 'quiz_taking';
        const quizId = path.split('/').pop();
        if (quizId) currentMetadata.quizId = quizId;
      } else if (path.includes('/skill-test')) {
        currentActivityType = 'skill_testing';
        const testId = path.split('/').pop();
        if (testId) currentMetadata.skillTestId = testId;
      } else if (path.includes('/forum')) {
        currentActivityType = 'forum_browsing';
      } else {
        currentActivityType = 'general_browsing';
        currentMetadata.page = path;
      }
    }

    // Update activity if it changed
    if (lastActivityRef.current !== currentActivityType) {
      ActivityService.updateActivity(currentActivityType, currentMetadata);
      lastActivityRef.current = currentActivityType;
    }

    return () => {
      // Cleanup if component unmounts
      lastActivityRef.current = null;
    };
  }, [location.pathname, activityType, metadata]);

  return {
    trackActivity: (type: ActivityType, meta?: any) => {
      ActivityService.updateActivity(type, meta);
      lastActivityRef.current = type;
    }
  };
};
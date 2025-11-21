import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';

interface ProgressUpdate {
  courseId: string;
  lessonId: string;
  progressPercentage: number;
  completedLessons: string[];
  timeSpent: number;
  timestamp: Date;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
}

interface UseRealTimeProgressOptions {
  courseId?: string;
  onProgressUpdate?: (progress: ProgressUpdate) => void;
  onAchievementUnlocked?: (achievements: Achievement[]) => void;
}

export const useRealTimeProgress = (options: UseRealTimeProgressOptions = {}) => {
  const { courseId, onProgressUpdate, onAchievementUnlocked } = options;
  const { socket, connected } = useSocket({ autoConnect: true });
  
  const [progress, setProgress] = useState<ProgressUpdate | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Update progress in real-time
  const updateProgress = useCallback(async (
    lessonId: string,
    progressData: any,
    timeSpent: number = 0
  ) => {
    if (!courseId || !connected) return;

    setIsUpdating(true);
    
    try {
      const response = await fetch('/api/realtime/progress/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          courseId,
          lessonId,
          progressData,
          timeSpent
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Real-time update will be received via socket
        if (result.achievements?.length > 0) {
          setAchievements(prev => [...prev, ...result.achievements]);
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [courseId, connected]);

  // Listen for real-time progress updates
  useEffect(() => {
    if (!socket || !connected) return;

    const handleProgressUpdate = (update: ProgressUpdate) => {
      setProgress(update);
      onProgressUpdate?.(update);
    };

    const handleAchievementUnlocked = (newAchievements: Achievement[]) => {
      setAchievements(prev => [...prev, ...newAchievements]);
      onAchievementUnlocked?.(newAchievements);
    };

    socket.on('progressUpdate', handleProgressUpdate);
    socket.on('achievementUnlocked', handleAchievementUnlocked);

    return () => {
      socket.off('progressUpdate', handleProgressUpdate);
      socket.off('achievementUnlocked', handleAchievementUnlocked);
    };
  }, [socket, connected, onProgressUpdate, onAchievementUnlocked]);

  return {
    progress,
    achievements,
    isUpdating,
    updateProgress,
    clearAchievements: () => setAchievements([])
  };
};

export default useRealTimeProgress;
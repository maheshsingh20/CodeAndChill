import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ActivityService } from '@/services/activityService';
import { Activity } from 'lucide-react';

interface CurrentSession {
  hasActiveSession: boolean;
  sessionId?: string;
  startTime?: string;
  currentActivity?: string;
  totalTimeToday?: number;
}

export const RealTimeActivity: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<CurrentSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentSession();
    
    // Update every 30 seconds
    const interval = setInterval(fetchCurrentSession, 3000000000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchCurrentSession = async () => {
    try {
      const sessionData = await ActivityService.getCurrentSession();
      setCurrentSession(sessionData);
    } catch (error) {
      console.error('Error fetching current session:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3);
    const minutes = Math.floor((seconds % 3) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getActivityLabel = (activity: string) => {
    switch (activity) {
      case 'course_viewing': return 'Watching Course';
      case 'problem_solving': return 'Solving Problems';
      case 'quiz_taking': return 'Taking Quiz';
      case 'skill_testing': return 'Skill Testing';
      case 'forum_browsing': return 'Browsing Forum';
      case 'general_browsing': return 'Browsing Platform';
      default: return 'Active';
    }
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'course_viewing': return 'bg-blue-500';
      case 'problem_solving': return 'bg-green-500';
      case 'quiz_taking': return 'bg-purple-500';
      case 'skill_testing': return 'bg-orange-500';
      case 'forum_browsing': return 'bg-pink-500';
      case 'general_browsing': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-6 bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2 text-sm">
          <Activity size={16} />
          Live Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {currentSession?.hasActiveSession ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">Active Now</span>
                </div>
                <Badge 
                  className={`${getActivityColor(currentSession.currentActivity || '')} text-white text-xs`}
                >
                  {getActivityLabel(currentSession.currentActivity || '')}
                </Badge>
              </div>
              
              <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">
                  {formatDuration(currentSession.totalTimeToday || 0)}
                </div>
                <p className="text-gray-400 text-xs">today</p>
              </div>
            </>
          ) : (
            <div className="text-center p-4">
              <div className="w-2 h-2 bg-gray-500 rounded-full mx-auto mb-2"></div>
              <span className="text-gray-400 text-sm">Not active</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

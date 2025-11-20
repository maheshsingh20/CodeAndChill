import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ActivityService } from '@/services/activityService';
import { 
  BookOpen, 
  Code, 
  Brain, 
  Target, 
  MessageSquare, 
  Monitor,
  Clock,
  TrendingUp
} from 'lucide-react';

interface ActivityBreakdownData {
  course_viewing: number;
  problem_solving: number;
  quiz_taking: number;
  skill_testing: number;
  forum_browsing: number;
  general_browsing: number;
}

export const ActivityBreakdown: React.FC = () => {
  const [breakdown, setBreakdown] = useState<ActivityBreakdownData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    fetchActivityBreakdown();
  }, [days]);

  const fetchActivityBreakdown = async () => {
    try {
      setLoading(true);
      const data = await ActivityService.getActivityBreakdown(days);
      setBreakdown(data.breakdown);
    } catch (error) {
      console.error('Error fetching activity breakdown:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'course_viewing': return <BookOpen size={16} className="text-blue-400" />;
      case 'problem_solving': return <Code size={16} className="text-green-400" />;
      case 'quiz_taking': return <Brain size={16} className="text-purple-400" />;
      case 'skill_testing': return <Target size={16} className="text-orange-400" />;
      case 'forum_browsing': return <MessageSquare size={16} className="text-pink-400" />;
      case 'general_browsing': return <Monitor size={16} className="text-gray-400" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'course_viewing': return 'Course Viewing';
      case 'problem_solving': return 'Problem Solving';
      case 'quiz_taking': return 'Quiz Taking';
      case 'skill_testing': return 'Skill Testing';
      case 'forum_browsing': return 'Forum Browsing';
      case 'general_browsing': return 'General Browsing';
      default: return type;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
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
        <CardHeader>
          <CardTitle className="text-white">Activity Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-2 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!breakdown) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Activity Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-center py-8">No activity data available</p>
        </CardContent>
      </Card>
    );
  }

  const totalTime = Object.values(breakdown).reduce((sum, time) => sum + time, 0);
  const sortedActivities = Object.entries(breakdown)
    .sort(([, a], [, b]) => b - a)
    .filter(([, time]) => time > 0);

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp size={20} />
            Activity Breakdown
          </CardTitle>
          <div className="flex gap-2">
            {[7, 14, 30].map((period) => (
              <Badge
                key={period}
                variant={days === period ? "default" : "outline"}
                className={`cursor-pointer ${
                  days === period 
                    ? 'bg-purple-600 text-white' 
                    : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setDays(period)}
              >
                {period}d
              </Badge>
            ))}
          </div>
        </div>
        <p className="text-gray-400 text-sm">
          Time spent on different activities (last {days} days)
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Total Time */}
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-purple-400" />
                <span className="text-white font-medium">Total Time</span>
              </div>
              <span className="text-purple-400 font-bold">
                {Math.floor(totalTime / 3600)}h {Math.floor((totalTime % 3600) / 60)}m
              </span>
            </div>
          </div>

          {/* Activity Breakdown */}
          {sortedActivities.length > 0 ? (
            <div className="space-y-3">
              {sortedActivities.map(([type, time]) => {
                const percentage = totalTime > 0 ? (time / totalTime) * 100 : 0;
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getActivityIcon(type)}
                        <span className="text-gray-300 text-sm">
                          {getActivityLabel(type)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium">
                          {Math.floor(time / 60)}m
                        </span>
                        <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                          {percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress value={percentage} className="h-2" />
                      <div 
                        className={`absolute top-0 left-0 h-2 rounded-full ${getActivityColor(type)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Monitor className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-400">No activity recorded yet</p>
              <p className="text-gray-500 text-sm">Start using the platform to see your activity breakdown</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
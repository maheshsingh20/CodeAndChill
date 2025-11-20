import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ActivityService } from '@/services/activityService';
import { Calendar, TrendingUp, Clock } from 'lucide-react';

interface DailyActivity {
  date: string;
  totalTime: number;
  sessions: number;
  activities: {
    course_viewing: number;
    problem_solving: number;
    quiz_taking: number;
    skill_testing: number;
    forum_browsing: number;
    general_browsing: number;
  };
}

export const DailyActivityChart: React.FC = () => {
  const [dailyData, setDailyData] = useState<DailyActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    fetchDailyActivity();
  }, [days]);

  const fetchDailyActivity = async () => {
    try {
      setLoading(true);
      const data = await ActivityService.getDailyActivity(days);
      setDailyData(data.dailyActivity || []);
    } catch (error) {
      console.error('Error fetching daily activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getActivityIntensity = (totalTime: number) => {
    if (totalTime >= 7200) return 'high'; // 2+ hours
    if (totalTime >= 3600) return 'medium'; // 1+ hours
    if (totalTime >= 1800) return 'low'; // 30+ minutes
    return 'minimal';
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-orange-500';
      case 'minimal': return 'bg-gray-500';
      default: return 'bg-gray-600';
    }
  };

  const getIntensityLabel = (intensity: string) => {
    switch (intensity) {
      case 'high': return 'High Activity';
      case 'medium': return 'Medium Activity';
      case 'low': return 'Low Activity';
      case 'minimal': return 'Minimal Activity';
      default: return 'No Activity';
    }
  };

  const maxTime = Math.max(...dailyData.map(d => d.totalTime), 1);

  if (loading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Daily Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(days)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-8 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar size={20} />
            Daily Activity
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
          Your daily activity over the last {days} days
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {dailyData.length > 0 ? (
            <>
              {/* Activity Chart */}
              <div className="space-y-2">
                {dailyData.map((day, index) => {
                  const intensity = getActivityIntensity(day.totalTime);
                  const widthPercentage = maxTime > 0 ? (day.totalTime / maxTime) * 100 : 0;
                  
                  return (
                    <div key={day.date} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300 w-20">
                          {formatDate(day.date)}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">
                            {formatDuration(day.totalTime)}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getIntensityColor(intensity)} border-0 text-white`}
                          >
                            {day.sessions} sessions
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="relative h-6 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getIntensityColor(intensity)} transition-all duration-300`}
                          style={{ width: `${Math.max(widthPercentage, 2)}%` }}
                        />
                        <div className="absolute inset-0 flex items-center px-2">
                          <span className="text-xs text-white font-medium">
                            {getIntensityLabel(intensity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Stats */}
              <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-purple-400">
                      {formatDuration(dailyData.reduce((sum, day) => sum + day.totalTime, 0))}
                    </div>
                    <p className="text-xs text-gray-400">Total Time</p>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-400">
                      {Math.round(dailyData.reduce((sum, day) => sum + day.totalTime, 0) / dailyData.length / 60)}m
                    </div>
                    <p className="text-xs text-gray-400">Daily Average</p>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-400">
                      {dailyData.filter(day => day.totalTime > 0).length}
                    </div>
                    <p className="text-xs text-gray-400">Active Days</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-400">No activity data available</p>
              <p className="text-gray-500 text-sm">Start using the platform to see your daily activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
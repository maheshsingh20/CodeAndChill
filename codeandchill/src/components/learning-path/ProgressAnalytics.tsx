import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Award,
  Calendar,
  Zap,
  Brain
} from 'lucide-react';

interface ProgressAnalyticsProps {
  userProgress: any;
  path: any;
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({ userProgress, path }) => {
  const [streak, setStreak] = useState<any>(null);

  useEffect(() => {
    fetchStreak();
  }, []);

  const fetchStreak = async () => {
    try {
      const { LearningPathService } = await import('@/services/learningPathService');
      const streakData = await LearningPathService.getStreak();
      setStreak(streakData);
    } catch (error) {
      console.error('Error fetching streak:', error);
    }
  };

  if (!userProgress) {
    return (
      <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
        <CardContent className="py-20 text-center">
          <BarChart3 size={64} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">No Analytics Available</h3>
          <p className="text-gray-400">Start learning to see your progress analytics</p>
        </CardContent>
      </Card>
    );
  }

  const completedCourses = userProgress.progress.filter((p: any) => p.progress === 100).length;
  const totalCourses = userProgress.progress.length;
  const avgProgress = userProgress.overallProgress;
  const totalHours = Math.floor(userProgress.totalTimeSpent / 60);
  const totalMinutes = userProgress.totalTimeSpent % 60;

  const stats = [
    {
      icon: Target,
      label: 'Overall Progress',
      value: `${avgProgress}%`,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      icon: Award,
      label: 'Courses Completed',
      value: `${completedCourses}/${totalCourses}`,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      icon: Clock,
      label: 'Time Invested',
      value: `${totalHours}h ${totalMinutes}m`,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      icon: Zap,
      label: 'Learning Streak',
      value: streak ? `${streak.currentStreak} days` : 'Loading...',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={stat.color} size={24} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Course Progress Breakdown */}
      <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-2">
            <Brain size={20} />
            Course Progress Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {userProgress.progress.map((courseProgress: any, index: number) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">{courseProgress.courseId.title}</span>
                <span className="text-purple-400 font-semibold">{courseProgress.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${courseProgress.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {Math.floor(courseProgress.timeSpent / 60)}h {courseProgress.timeSpent % 60}m spent
                </span>
                {courseProgress.completedAt && (
                  <span className="flex items-center gap-1 text-green-400">
                    <Award size={12} />
                    Completed {new Date(courseProgress.completedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Learning Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-2">
              <Calendar size={20} />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <div className="flex-1">
                <p className="font-medium text-sm bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">Completed a course</p>
                <p className="text-gray-400 text-xs">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <div className="flex-1">
                <p className="font-medium text-sm bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">Started new lesson</p>
                <p className="text-gray-400 text-xs">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <div className="flex-1">
                <p className="font-medium text-sm bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">Earned achievement</p>
                <p className="text-gray-400 text-xs">1 day ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-2">
              <TrendingUp size={20} />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <p className="text-green-400 font-semibold mb-1">Great Progress!</p>
              <p className="text-gray-300 text-sm">You're ahead of 75% of learners in this path</p>
            </div>
            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-400 font-semibold mb-1">Consistent Learner</p>
              <p className="text-gray-300 text-sm">You've maintained a 7-day learning streak</p>
            </div>
            <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
              <p className="text-purple-400 font-semibold mb-1">Quick Learner</p>
              <p className="text-gray-300 text-sm">Completing courses 20% faster than average</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

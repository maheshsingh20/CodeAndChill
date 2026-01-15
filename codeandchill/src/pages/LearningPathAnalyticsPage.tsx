import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LearningPathService } from '@/services/learningPathService';
import { useUser } from '@/contexts/UserContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Award,
  Calendar,
  Users,
  BookOpen,
  Star,
  Flame,
  Zap,
  Brain,
  Trophy,
  Activity,
  PieChart,
  LineChart,
  Download,
  Share2
} from 'lucide-react';

interface LearningStats {
  totalHours: number;
  completedPaths: number;
  currentStreak: number;
  longestStreak: number;
  averageRating: number;
  totalPoints: number;
  rank: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

interface PathProgress {
  pathId: string;
  pathName: string;
  pathIcon: string;
  progress: number;
  timeSpent: number;
  startDate: string;
  estimatedCompletion: string;
  difficulty: string;
}

interface WeeklyActivity {
  date: string;
  hours: number;
  courses: number;
  points: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
  progress?: number;
  maxProgress?: number;
}

export const LearningPathAnalyticsPage: React.FC = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const [userStats, setUserStats] = useState<LearningStats | null>(null);
  const [pathProgress, setPathProgress] = useState<PathProgress[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user, timeframe]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [stats, enrolled, activity, userAchievements] = await Promise.all([
        LearningPathService.getUserStats(),
        LearningPathService.getEnrolledPaths(),
        LearningPathService.getWeeklyActivity(),
        LearningPathService.getAchievements('')
      ]);

      setUserStats(stats);

      // Map enrolled paths to progress format
      const mappedProgress = enrolled.map((path: any) => ({
        pathId: path.pathId._id,
        pathName: path.pathId.title,
        pathIcon: path.pathId.icon,
        progress: path.overallProgress,
        timeSpent: path.totalTimeSpent,
        startDate: path.enrolledAt,
        estimatedCompletion: calculateEstimatedCompletion(path),
        difficulty: path.pathId.difficulty
      }));

      setPathProgress(mappedProgress);
      setWeeklyActivity(activity);
      setAchievements(userAchievements);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Fallback to mock data
      setUserStats(getMockStats());
      setPathProgress(getMockPathProgress());
      setWeeklyActivity(getMockWeeklyActivity());
      setAchievements(getMockAchievements());
    } finally {
      setLoading(false);
    }
  };

  const calculateEstimatedCompletion = (userPath: any) => {
    const startDate = new Date(userPath.enrolledAt);
    const estimatedDays = userPath.pathId.estimatedDuration * 7; // Convert weeks to days
    const completionDate = new Date(startDate.getTime() + estimatedDays * 24 * 60 * 60 * 1000);
    return completionDate.toISOString();
  };

  const getMockStats = (): LearningStats => ({
    totalHours: 234,
    completedPaths: 8,
    currentStreak: 45,
    longestStreak: 67,
    averageRating: 4.8,
    totalPoints: 15420,
    rank: 3,
    weeklyGoal: 10,
    weeklyProgress: 7.5
  });

  const getMockPathProgress = (): PathProgress[] => [
    {
      pathId: '1',
      pathName: 'Full Stack Web Development',
      pathIcon: '🌐',
      progress: 75,
      timeSpent: 89,
      startDate: '2024-01-15',
      estimatedCompletion: '2024-03-15',
      difficulty: 'intermediate'
    },
    {
      pathId: '2',
      pathName: 'Data Science & Machine Learning',
      pathIcon: '🧠',
      progress: 60,
      timeSpent: 67,
      startDate: '2024-01-10',
      estimatedCompletion: '2024-04-10',
      difficulty: 'advanced'
    },
    {
      pathId: '3',
      pathName: 'Mobile App Development',
      pathIcon: '📱',
      progress: 100,
      timeSpent: 78,
      startDate: '2023-12-01',
      estimatedCompletion: '2024-02-01',
      difficulty: 'intermediate'
    }
  ];

  const getMockWeeklyActivity = (): WeeklyActivity[] => [
    { date: '2024-01-08', hours: 2.5, courses: 1, points: 150 },
    { date: '2024-01-09', hours: 1.8, courses: 0, points: 80 },
    { date: '2024-01-10', hours: 3.2, courses: 2, points: 220 },
    { date: '2024-01-11', hours: 0, courses: 0, points: 0 },
    { date: '2024-01-12', hours: 2.1, courses: 1, points: 180 },
    { date: '2024-01-13', hours: 1.5, courses: 1, points: 120 },
    { date: '2024-01-14', hours: 2.8, courses: 1, points: 200 }
  ];

  const getMockAchievements = (): Achievement[] => [
    {
      id: '1',
      name: 'Path Master',
      description: 'Complete 5 learning paths',
      icon: '🏆',
      rarity: 'epic',
      unlockedAt: '2024-01-15',
      progress: 8,
      maxProgress: 10
    },
    {
      id: '2',
      name: 'Quick Learner',
      description: 'Complete a path in under 30 days',
      icon: '⚡',
      rarity: 'rare',
      unlockedAt: '2024-01-10',
      progress: 3,
      maxProgress: 5
    },
    {
      id: '3',
      name: 'Streak Master',
      description: 'Maintain a 30-day learning streak',
      icon: '🔥',
      rarity: 'legendary',
      unlockedAt: '2024-01-20',
      progress: 45,
      maxProgress: 30
    },
    {
      id: '4',
      name: 'Knowledge Seeker',
      description: 'Complete 100 lessons',
      icon: '📚',
      rarity: 'common',
      unlockedAt: '2024-01-05',
      progress: 156,
      maxProgress: 100
    },
    {
      id: '5',
      name: 'Code Warrior',
      description: 'Solve 50 coding challenges',
      icon: '⚔️',
      rarity: 'epic',
      unlockedAt: '2024-01-12',
      progress: 67,
      maxProgress: 50
    },
    {
      id: '6',
      name: 'Team Player',
      description: 'Help 10 fellow learners',
      icon: '🤝',
      rarity: 'rare',
      unlockedAt: '2024-01-08',
      progress: 15,
      maxProgress: 10
    }
  ];

  // Get mock data
  const mockStats = getMockStats();
  const mockPathProgress = getMockPathProgress();
  const mockWeeklyActivity = getMockWeeklyActivity();
  const mockAchievements = getMockAchievements();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getAchievementRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500 bg-gray-500/10';
      case 'rare': return 'border-blue-500 bg-blue-500/10';
      case 'epic': return 'border-purple-500 bg-purple-500/10';
      case 'legendary': return 'border-yellow-500 bg-yellow-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Use actual data when available, fallback to mock data
  const displayStats = userStats || mockStats;
  const displayPathProgress = pathProgress.length > 0 ? pathProgress : mockPathProgress;
  const displayWeeklyActivity = weeklyActivity.length > 0 ? weeklyActivity : mockWeeklyActivity;
  const displayAchievements = achievements.length > 0 ? achievements : mockAchievements;

  const weeklyGoalProgress = displayStats ? (displayStats.weeklyProgress / displayStats.weeklyGoal) * 100 : 0;

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-black">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Please log in to view your analytics</h2>
            <p className="text-gray-400">You need to be logged in to access your learning analytics.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-500/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <BarChart3 className="text-purple-400" size={48} />
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                Learning Analytics
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-2xl">
              Track your progress and insights across all learning paths
            </p>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="px-4 py-2 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-white focus:border-gray-500 focus:outline-none"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <Download size={16} className="mr-2" />
              Export
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <Share2 size={16} className="mr-2" />
              Share
            </Button>
          </div>
        </header>

        {/* Quick Stats */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="animate-pulse">
                    <div className="w-6 h-6 bg-gray-600 rounded mx-auto mb-2"></div>
                    <div className="w-12 h-6 bg-gray-600 rounded mx-auto mb-1"></div>
                    <div className="w-16 h-3 bg-gray-600 rounded mx-auto"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="text-blue-400" size={24} />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {displayStats?.totalHours || 0}h
                </div>
                <div className="text-xs text-gray-400">Total Hours</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="text-green-400" size={24} />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {displayStats?.completedPaths || 0}
                </div>
                <div className="text-xs text-gray-400">Completed Paths</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Flame className="text-orange-400" size={24} />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  {displayStats?.currentStreak || 0}
                </div>
                <div className="text-xs text-gray-400">Day Streak</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="text-yellow-400" size={24} />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  #{displayStats?.rank || 'N/A'}
                </div>
                <div className="text-xs text-gray-400">Global Rank</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="text-purple-400" size={24} />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {displayStats?.averageRating?.toFixed(1) || 'N/A'}
                </div>
                <div className="text-xs text-gray-400">Avg Rating</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="text-indigo-400" size={24} />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                  {displayStats?.totalPoints?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-gray-400">Total Points</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              <Activity size={16} className="mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-purple-600">
              <Target size={16} className="mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-purple-600">
              <Calendar size={16} className="mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600">
              <Award size={16} className="mr-2" />
              Achievements
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Weekly Goal */}
              <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-2">
                    <Target size={20} />
                    Weekly Goal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {displayStats.weeklyProgress}h / {displayStats.weeklyGoal}h
                    </div>
                    <div className="text-sm text-gray-400">This week</div>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-gray-700 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500 relative overflow-hidden"
                        style={{ width: `${Math.min(weeklyGoalProgress, 100)}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                    <div className="text-center mt-2 text-sm text-gray-400">
                      {weeklyGoalProgress.toFixed(0)}% complete
                    </div>
                  </div>

                  {weeklyGoalProgress >= 100 && (
                    <div className="text-center p-3 bg-green-900/30 border border-green-500/30 rounded-lg">
                      <div className="text-green-400 font-semibold">🎉 Goal Achieved!</div>
                      <div className="text-sm text-gray-300">Great job this week!</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Learning Streak */}
              <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-2">
                    <Flame className="text-orange-400" />
                    Learning Streak
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                      {displayStats.currentStreak} days
                    </div>
                    <div className="text-sm text-gray-400">Current streak</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Longest streak</span>
                      <span className="text-yellow-400 font-semibold">{displayStats.longestStreak} days</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">This month</span>
                      <span className="text-blue-400 font-semibold">28 days</span>
                    </div>
                  </div>

                  {displayStats.currentStreak >= 7 ? (
                    <div className="p-3 bg-orange-900/30 border border-orange-500/30 rounded-lg">
                      <div className="text-orange-400 font-semibold text-sm">Keep it up!</div>
                      <div className="text-xs text-gray-300">You're on fire! 🔥</div>
                    </div>
                  ) : (
                    <div className="p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                      <div className="text-blue-400 font-semibold text-sm">Build your streak!</div>
                      <div className="text-xs text-gray-300">Learn daily to maintain momentum 💪</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-2">
                    <Award className="text-yellow-400" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {displayAchievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className={`p-3 rounded-lg border ${getAchievementRarityColor(achievement.rarity)}`}>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-sm">{achievement.name}</h4>
                          <p className="text-xs text-gray-400">{achievement.description}</p>
                          {achievement.unlockedAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              Unlocked {formatDate(achievement.unlockedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {displayAchievements.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Award size={32} className="mx-auto mb-2 opacity-50" />
                      <p>No achievements yet</p>
                      <p className="text-sm">Complete learning paths to earn achievements!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Weekly Activity Chart */}
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-2">
                  <LineChart size={20} />
                  Weekly Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {displayWeeklyActivity.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-gray-400 mb-2">
                        {formatDate(day.date)}
                      </div>
                      <div
                        className="bg-gradient-to-t from-purple-600 to-blue-600 rounded-md mx-auto transition-all duration-300 hover:scale-110 cursor-pointer"
                        style={{
                          height: `${Math.max(day.hours * 20, 8)}px`,
                          width: '24px'
                        }}
                        title={`${day.hours}h, ${day.courses} courses, ${day.points} points`}
                      />
                      <div className="text-xs text-gray-300 mt-2 font-semibold">
                        {day.hours}h
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center text-sm text-gray-400">
                  Total: {displayWeeklyActivity.reduce((sum, day) => sum + day.hours, 0)}h this week
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            {loading ? (
              <div className="grid gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-600 rounded"></div>
                          <div className="flex-1 space-y-2">
                            <div className="w-48 h-4 bg-gray-600 rounded"></div>
                            <div className="w-32 h-3 bg-gray-600 rounded"></div>
                          </div>
                          <div className="w-16 h-8 bg-gray-600 rounded"></div>
                        </div>
                        <div className="w-full h-3 bg-gray-600 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : displayPathProgress.length > 0 ? (
              <div className="grid gap-6">
                {displayPathProgress.map((path) => (
                  <Card key={path.pathId} className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{path.pathIcon}</span>
                          <div>
                            <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                              {path.pathName}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`${getDifficultyColor(path.difficulty)} border text-xs`}>
                                {path.difficulty}
                              </Badge>
                              <span className="text-sm text-gray-400">
                                Started {formatDate(path.startDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            {path.progress}%
                          </div>
                          <div className="text-sm text-gray-400">{path.timeSpent}h spent</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative">
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${path.progress === 100
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                              : 'bg-gradient-to-r from-purple-500 to-blue-500'
                              } relative overflow-hidden`}
                            style={{ width: `${path.progress}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">Progress</div>
                          <div className="font-semibold text-white">{path.progress}%</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Time Spent</div>
                          <div className="font-semibold text-white">{path.timeSpent}h</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Started</div>
                          <div className="font-semibold text-white">{formatDate(path.startDate)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Est. Completion</div>
                          <div className="font-semibold text-white">{formatDate(path.estimatedCompletion)}</div>
                        </div>
                      </div>

                      {path.progress === 100 && (
                        <div className="p-3 bg-green-900/30 border border-green-500/30 rounded-lg">
                          <div className="flex items-center gap-2 text-green-400 font-semibold">
                            <Trophy size={16} />
                            Path Completed!
                          </div>
                          <div className="text-sm text-gray-300">Congratulations on finishing this learning path!</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-12 max-w-md mx-auto">
                  <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">
                    No Learning Paths Yet
                  </h2>
                  <p className="text-gray-400 mb-6">
                    Start your learning journey by enrolling in a path that matches your goals.
                  </p>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                    <BookOpen size={16} className="mr-2" />
                    Browse Learning Paths
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Daily Activity */}
              <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                    Daily Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {displayWeeklyActivity.slice(-5).map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                      <div>
                        <div className="font-semibold text-white">{formatDate(day.date)}</div>
                        <div className="text-sm text-gray-400">{day.courses} courses completed</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-400">{day.hours}h</div>
                        <div className="text-sm text-gray-400">{day.points} pts</div>
                      </div>
                    </div>
                  ))}

                  {displayWeeklyActivity.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                      <p>No recent activity</p>
                      <p className="text-sm">Start learning to see your activity here!</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Learning Distribution */}
              <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                    Learning Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { category: 'Web Development', hours: 89, color: 'bg-blue-500' },
                    { category: 'Machine Learning', hours: 67, color: 'bg-purple-500' },
                    { category: 'Mobile Development', hours: 78, color: 'bg-green-500' }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">{item.category}</span>
                        <span className="text-white font-semibold">{item.hours}h</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${(item.hours / 234) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
                    <CardContent className="p-6">
                      <div className="animate-pulse flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-600 rounded"></div>
                        <div className="flex-1 space-y-2">
                          <div className="w-32 h-4 bg-gray-600 rounded"></div>
                          <div className="w-48 h-3 bg-gray-600 rounded"></div>
                          <div className="w-full h-2 bg-gray-600 rounded"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : displayAchievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayAchievements.map((achievement) => (
                  <Card key={achievement.id} className={`bg-gradient-to-br from-gray-900 via-black to-gray-800 border ${getAchievementRarityColor(achievement.rarity)}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-white">{achievement.name}</h3>
                            <Badge className={`${getAchievementRarityColor(achievement.rarity)} border text-xs capitalize`}>
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm mb-3">{achievement.description}</p>

                          {achievement.progress !== undefined && achievement.maxProgress && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Progress</span>
                                <span className="text-white font-semibold">
                                  {achievement.progress} / {achievement.maxProgress}
                                </span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${Math.min((achievement.progress / achievement.maxProgress) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {achievement.unlockedAt && (
                            <div className="text-xs text-gray-500 mt-2">
                              Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-12 max-w-md mx-auto">
                  <Award className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">
                    No Achievements Yet
                  </h2>
                  <p className="text-gray-400 mb-6">
                    Complete learning paths and challenges to earn achievements and showcase your progress.
                  </p>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                    <Target size={16} className="mr-2" />
                    Start Learning
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
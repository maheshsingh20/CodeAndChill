import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  Clock,
  Target,
  BookOpen,
  Code,
  Trophy,
  Flame,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LearningPathProgress } from '@/components/learning-path/LearningPathProgress';
import { useUser } from '@/contexts/UserContext';
import { API_BASE_URL } from '@/constants';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface UserStats {
  totalCourses: number;
  completedCourses: number;
  totalProblems: number;
  solvedProblems: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyTime: number; // in minutes
  averageScore: number;
  rank: number;
  totalUsers: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

interface ActivityData {
  date: string;
  studyTime: number;
  problemsSolved: number;
  quizScore: number;
}

export const UserDashboard: React.FC = () => {
  const { user } = useUser();
  const [stats, setStats] = useState<UserStats>({
    totalCourses: 0,
    completedCourses: 0,
    totalProblems: 0,
    solvedProblems: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalStudyTime: 0,
    averageScore: 0,
    rank: 0,
    totalUsers: 0
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [skillsData, setSkillsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) return;

      // Fetch user profile with stats
      const profileResponse = await fetch(`${API_BASE_URL}/user/profile-dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();

        setStats({
          totalCourses: profileData.stats?.totalCoursesCompleted || 0,
          completedCourses: profileData.stats?.totalCoursesCompleted || 0,
          totalProblems: profileData.stats?.totalProblemsAttempted || 0,
          solvedProblems: profileData.stats?.totalProblemsSolved || 0,
          currentStreak: profileData.stats?.currentStreak || 0,
          longestStreak: profileData.stats?.longestStreak || 0,
          totalStudyTime: 0,
          averageScore: 0,
          rank: 0,
          totalUsers: 0
        });

        // Use activity data from profile-dashboard
        if (profileData.activity) {
          const formattedActivity = profileData.activity.map((item: any, index: number) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - index));
            return {
              date: date.toISOString().split('T')[0],
              studyTime: 0,
              problemsSolved: item.solved || 0,
              quizScore: 0
            };
          });
          setActivityData(formattedActivity);
        }
      }

      // Fetch achievements
      const achievementsResponse = await fetch(`${API_BASE_URL}/user/achievements`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (achievementsResponse.ok) {
        const achievementsData = await achievementsResponse.json();
        // Convert backend format to frontend format
        const formattedAchievements = achievementsData.achievements.map((ach: any) => ({
          id: ach.id,
          title: ach.title,
          description: ach.description,
          icon: ach.icon,
          unlockedAt: ach.unlocked ? new Date() : undefined,
          progress: ach.progress,
          maxProgress: ach.maxProgress
        }));
        setAchievements(formattedAchievements);
      }

      if (achievementsResponse.ok) {
        const achievementsData = await achievementsResponse.json();
        setAchievements(achievementsData.achievements || []);
      }

      // Fetch activity data (last 7 days)
      const activityResponse = await fetch(`${API_BASE_URL}/progress/activity?days=7`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (activityResponse.ok) {
        const activityDataResponse = await activityResponse.json();
        setActivityData(activityDataResponse.activity || []);
      }

      // Fetch skills/problem stats
      const skillsResponse = await fetch(`${API_BASE_URL}/submissions/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (skillsResponse.ok) {
        const skillsDataResponse = await skillsResponse.json();
        // Convert language breakdown to skills format
        const languageBreakdown = skillsDataResponse.languageBreakdown || {};
        const skills = Object.entries(languageBreakdown).map(([name, count]: [string, any]) => ({
          name,
          value: count,
          color: getLanguageColor(name)
        }));
        setSkillsData(skills);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLanguageColor = (language: string): string => {
    const colors: { [key: string]: string } = {
      'JavaScript': '#f7df1e',
      'TypeScript': '#3178c6',
      'Python': '#3776ab',
      'Java': '#007396',
      'C++': '#00599c',
      'C': '#a8b9cc',
      'C#': '#239120',
      'Go': '#00add8',
      'Rust': '#ce422b',
      'PHP': '#777bb4',
      'Ruby': '#cc342d'
    };
    return colors[language] || '#6b7280';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getCompletionPercentage = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-700 rounded w-24"></div>
                <div className="h-8 bg-gray-700 rounded w-16"></div>
                <div className="h-2 bg-gray-700 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
        <div className="text-center text-gray-400 py-12">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-purple-900/50 via-black to-purple-800/30 border border-gray-700 hover:border-gray-600 rounded-md shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="bg-gradient-to-r from-purple-200 via-purple-100 to-purple-200 bg-clip-text text-transparent text-sm">Course Progress</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                {stats.completedCourses}/{stats.totalCourses}
              </p>
            </div>
            <BookOpen className="text-purple-400" size={24} />
          </div>
          <Progress
            value={getCompletionPercentage(stats.completedCourses, stats.totalCourses)}
            className="mt-3"
          />
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-900/50 via-black to-green-800/30 border border-gray-700 hover:border-gray-600 rounded-md shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="bg-gradient-to-r from-green-200 via-green-100 to-green-200 bg-clip-text text-transparent text-sm">Problems Solved</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                {stats.solvedProblems}/{stats.totalProblems}
              </p>
            </div>
            <Code className="text-green-400" size={24} />
          </div>
          <Progress
            value={getCompletionPercentage(stats.solvedProblems, stats.totalProblems)}
            className="mt-3"
          />
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-900/50 via-black to-orange-800/30 border border-gray-700 hover:border-gray-600 rounded-md shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="bg-gradient-to-r from-orange-200 via-orange-100 to-orange-200 bg-clip-text text-transparent text-sm">Current Streak</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">{stats.currentStreak} days</p>
            </div>
            <Flame className="text-orange-400" size={24} />
          </div>
          <p className="bg-gradient-to-r from-orange-300 via-orange-200 to-orange-300 bg-clip-text text-transparent text-xs mt-2">
            Longest: {stats.longestStreak} days
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-900/50 via-black to-blue-800/30 border border-gray-700 hover:border-gray-600 rounded-md shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 bg-clip-text text-transparent text-sm">Global Rank</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                #{stats.rank}
              </p>
            </div>
            <Trophy className="text-blue-400" size={24} />
          </div>
          <p className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 bg-clip-text text-transparent text-xs mt-2">
            Top {Math.round((stats.rank / stats.totalUsers) * 100)}%
          </p>
        </Card>
      </div>

      {/* Learning Path Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LearningPathProgress />
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 backdrop-blur-sm border border-gray-700 hover:border-gray-600 rounded-md shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
          <div className="p-6">
            <h3 className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center text-lg font-semibold mb-4">
              <Target className="mr-2" size={20} />
              Quick Actions
            </h3>
          </div>
          <div className="p-6 pt-0 space-y-3">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start">
              <BookOpen className="mr-2" size={16} />
              Continue Learning
            </Button>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white justify-start">
              <Code className="mr-2" size={16} />
              Practice Problems
            </Button>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white justify-start">
              <Trophy className="mr-2" size={16} />
              Join Contest
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {/* Activity Chart */}
          <div className="p-6 bg-gradient-to-br from-gray-900 via-black to-gray-800 backdrop-blur-sm border border-gray-700 hover:border-gray-600 rounded-md shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-4">Study Activity (Last 7 Days)</h3>
            {activityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="studyTime"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    name="Study Time (min)"
                  />
                  <Line
                    type="monotone"
                    dataKey="problemsSolved"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Problems Solved"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Clock className="mx-auto mb-3 opacity-30" size={48} />
                <p>No activity data yet. Start learning to see your progress!</p>
              </div>
            )}
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-to-br from-gray-900 via-black to-gray-800 backdrop-blur-sm border border-gray-700 hover:border-gray-600 rounded-md shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="text-blue-400" size={16} />
                    <span className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent">Total Study Time</span>
                  </div>
                  <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent font-semibold">
                    {formatTime(stats.totalStudyTime)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="text-green-400" size={16} />
                    <span className="text-gray-300">Average Quiz Score</span>
                  </div>
                  <span className="text-white font-semibold">
                    {stats.averageScore}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="text-purple-400" size={16} />
                    <span className="text-gray-300">Success Rate</span>
                  </div>
                  <span className="text-white font-semibold">
                    {getCompletionPercentage(stats.solvedProblems, stats.totalProblems)}%
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gray-900/50 backdrop-blur-sm border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Weekly Quiz Scores</h3>
              {activityData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      stroke="#9CA3AF"
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="quizScore" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Target className="mx-auto mb-3 opacity-30" size={48} />
                  <p>No quiz data available</p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card className="p-6 bg-gray-900/50 backdrop-blur-sm border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
            {achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className={`p-4 ${achievement.unlockedAt
                      ? 'bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 border-yellow-600'
                      : 'bg-gray-800 border-gray-600'
                      }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${achievement.unlockedAt ? 'text-yellow-300' : 'text-gray-300'
                          }`}>
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">
                          {achievement.description}
                        </p>

                        {achievement.unlockedAt ? (
                          <Badge variant="secondary" className="mt-2 bg-yellow-600 text-yellow-100">
                            <Award size={12} className="mr-1" />
                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </Badge>
                        ) : achievement.progress !== undefined ? (
                          <div className="mt-2">
                            <Progress
                              value={(achievement.progress! / achievement.maxProgress!) * 100}
                              className="w-full"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                              {achievement.progress}/{achievement.maxProgress}
                            </p>
                          </div>
                        ) : (
                          <Badge variant="outline" className="mt-2">
                            Locked
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Trophy className="mx-auto mb-3 opacity-30" size={48} />
                <p>Start learning to unlock achievements!</p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-gray-900/50 backdrop-blur-sm border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Programming Languages</h3>
              {skillsData.length > 0 ? (
                <div className="space-y-4">
                  {skillsData.slice(0, 5).map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">{skill.name}</span>
                        <span className="text-white font-semibold">{skill.value} submissions</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((skill.value / Math.max(...skillsData.map(s => s.value))) * 100, 100)}%`,
                            backgroundColor: skill.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Code className="mx-auto mb-3 opacity-30" size={48} />
                  <p>Solve problems to track your language skills</p>
                </div>
              )}
            </Card>

            <Card className="p-6 bg-gray-900/50 backdrop-blur-sm border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Language Distribution</h3>
              {skillsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={skillsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {skillsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Target className="mx-auto mb-3 opacity-30" size={48} />
                  <p>No language data available yet</p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
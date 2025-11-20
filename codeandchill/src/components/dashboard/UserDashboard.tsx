import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Award, 
  Clock, 
  Target, 
  BookOpen, 
  Code, 
  Trophy,
  Calendar,
  Flame,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LearningPathProgress } from '@/components/learning-path/LearningPathProgress';
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
  const [stats, setStats] = useState<UserStats>({
    totalCourses: 12,
    completedCourses: 8,
    totalProblems: 150,
    solvedProblems: 89,
    currentStreak: 7,
    longestStreak: 15,
    totalStudyTime: 2340, // 39 hours
    averageScore: 87.5,
    rank: 23,
    totalUsers: 1250
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first course',
      icon: '🎯',
      unlockedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Problem Solver',
      description: 'Solve 50 coding problems',
      icon: '🧩',
      unlockedAt: new Date('2024-02-10')
    },
    {
      id: '3',
      title: 'Streak Master',
      description: 'Maintain a 10-day study streak',
      icon: '🔥',
      unlockedAt: new Date('2024-02-20')
    },
    {
      id: '4',
      title: 'Quiz Champion',
      description: 'Score 90%+ on 10 quizzes',
      icon: '🏆',
      progress: 7,
      maxProgress: 10
    },
    {
      id: '5',
      title: 'Code Master',
      description: 'Solve 100 coding problems',
      icon: '💻',
      progress: 89,
      maxProgress: 100
    }
  ]);

  const [activityData] = useState<ActivityData[]>([
    { date: '2024-02-15', studyTime: 45, problemsSolved: 3, quizScore: 85 },
    { date: '2024-02-16', studyTime: 60, problemsSolved: 5, quizScore: 92 },
    { date: '2024-02-17', studyTime: 30, problemsSolved: 2, quizScore: 78 },
    { date: '2024-02-18', studyTime: 75, problemsSolved: 4, quizScore: 95 },
    { date: '2024-02-19', studyTime: 50, problemsSolved: 3, quizScore: 88 },
    { date: '2024-02-20', studyTime: 90, problemsSolved: 6, quizScore: 91 },
    { date: '2024-02-21', studyTime: 40, problemsSolved: 2, quizScore: 87 }
  ]);

  const skillsData = [
    { name: 'JavaScript', value: 85, color: '#f7df1e' },
    { name: 'React', value: 78, color: '#61dafb' },
    { name: 'Python', value: 72, color: '#3776ab' },
    { name: 'Node.js', value: 68, color: '#339933' },
    { name: 'TypeScript', value: 65, color: '#3178c6' }
  ];

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getCompletionPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Course Progress</p>
              <p className="text-2xl font-bold text-white">
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

        <Card className="p-6 bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm">Problems Solved</p>
              <p className="text-2xl font-bold text-white">
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

        <Card className="p-6 bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-200 text-sm">Current Streak</p>
              <p className="text-2xl font-bold text-white">{stats.currentStreak} days</p>
            </div>
            <Flame className="text-orange-400" size={24} />
          </div>
          <p className="text-orange-300 text-xs mt-2">
            Longest: {stats.longestStreak} days
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Global Rank</p>
              <p className="text-2xl font-bold text-white">
                #{stats.rank}
              </p>
            </div>
            <Trophy className="text-blue-400" size={24} />
          </div>
          <p className="text-blue-300 text-xs mt-2">
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
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="mr-2" size={20} />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {/* Activity Chart */}
          <Card className="p-6 bg-gray-900/50 backdrop-blur-sm border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Study Activity (Last 7 Days)</h3>
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
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-gray-900/50 backdrop-blur-sm border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="text-blue-400" size={16} />
                    <span className="text-gray-300">Total Study Time</span>
                  </div>
                  <span className="text-white font-semibold">
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
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card className="p-6 bg-gray-900/50 backdrop-blur-sm border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`p-4 ${
                    achievement.unlockedAt 
                      ? 'bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 border-yellow-600' 
                      : 'bg-gray-800 border-gray-600'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${
                        achievement.unlockedAt ? 'text-yellow-300' : 'text-gray-300'
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">
                        {achievement.description}
                      </p>
                      
                      {achievement.unlockedAt ? (
                        <Badge variant="secondary" className="mt-2 bg-yellow-600 text-yellow-100">
                          <Award size={12} className="mr-1" />
                          Unlocked {achievement.unlockedAt.toLocaleDateString()}
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
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-gray-900/50 backdrop-blur-sm border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Skill Levels</h3>
              <div className="space-y-4">
                {skillsData.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">{skill.name}</span>
                      <span className="text-white font-semibold">{skill.value}%</span>
                    </div>
                    <Progress value={skill.value} className="w-full" />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gray-900/50 backdrop-blur-sm border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Skill Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={skillsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {skillsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
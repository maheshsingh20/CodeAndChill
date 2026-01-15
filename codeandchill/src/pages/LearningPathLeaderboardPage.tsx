import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LearningPathService } from '@/services/learningPathService';
import { useUser } from '@/contexts/UserContext';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Star,
  TrendingUp,
  Users,
  Target,
  Zap,
  Calendar,
  BookOpen,
  Clock,
  Flame,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  rank: number;
  previousRank?: number;
  totalPoints: number;
  completedPaths: number;
  currentStreak: number;
  longestStreak: number;
  totalHours: number;
  achievements: Achievement[];
  joinedDate: string;
  isCurrentUser?: boolean;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
}

interface PathLeaderboard {
  pathId: string;
  pathName: string;
  pathIcon: string;
  topUsers: LeaderboardUser[];
}

export const LearningPathLeaderboardPage: React.FC = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('global');
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('month');
  const [selectedPath, setSelectedPath] = useState<string>('all');
  const [leaderboardData, setLeaderboardData] = useState<any>(null);
  const [pathLeaderboards, setPathLeaderboards] = useState<PathLeaderboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboardData();
  }, [timeframe, selectedPath]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      const data = await LearningPathService.getLeaderboard(timeframe, selectedPath === 'all' ? undefined : selectedPath);
      setLeaderboardData(data);

      // If we have path-specific data, set it
      if (data.pathLeaderboards) {
        setPathLeaderboards(data.pathLeaderboards);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      // Fallback to mock data
      setLeaderboardData({
        users: getMockUsers(),
        achievements: getMockAchievements()
      });
      setPathLeaderboards(getMockPathLeaderboards());
    } finally {
      setLoading(false);
    }
  };

  const getMockUsers = () => [
    {
      id: '1',
      name: 'Alex Chen',
      avatar: '/avatars/alex.jpg',
      rank: 1,
      previousRank: 2,
      totalPoints: 15420,
      completedPaths: 8,
      currentStreak: 45,
      longestStreak: 67,
      totalHours: 234,
      achievements: [
        {
          id: '1',
          name: 'Path Master',
          description: 'Complete 5 learning paths',
          icon: '🏆',
          rarity: 'epic' as const,
          unlockedAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Quick Learner',
          description: 'Complete a path in under 30 days',
          icon: '⚡',
          rarity: 'rare' as const,
          unlockedAt: '2024-01-10'
        },
        {
          id: '3',
          name: 'Streak Master',
          description: 'Maintain a 30-day learning streak',
          icon: '🔥',
          rarity: 'legendary' as const,
          unlockedAt: '2024-01-20'
        }
      ],
      joinedDate: '2023-06-15',
      isCurrentUser: user?.name === 'Alex Chen'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
      rank: 2,
      previousRank: 1,
      totalPoints: 14850,
      completedPaths: 7,
      currentStreak: 32,
      longestStreak: 58,
      totalHours: 198,
      achievements: [
        {
          id: '4',
          name: 'Code Warrior',
          description: 'Complete 100 coding challenges',
          icon: '⚔️',
          rarity: 'epic' as const,
          unlockedAt: '2024-01-12'
        }
      ],
      joinedDate: '2023-07-20',
      isCurrentUser: user?.name === 'Sarah Johnson'
    },
    {
      id: '3',
      name: 'Mike Rodriguez',
      avatar: '/avatars/mike.jpg',
      rank: 3,
      previousRank: 4,
      totalPoints: 13200,
      completedPaths: 6,
      currentStreak: 28,
      longestStreak: 45,
      totalHours: 167,
      achievements: [
        {
          id: '5',
          name: 'Team Player',
          description: 'Help 10 fellow learners',
          icon: '🤝',
          rarity: 'rare' as const,
          unlockedAt: '2024-01-08'
        }
      ],
      joinedDate: '2023-08-10',
      isCurrentUser: user?.name === 'Mike Rodriguez'
    },
    {
      id: '4',
      name: 'Emily Davis',
      avatar: '/avatars/emily.jpg',
      rank: 4,
      previousRank: 3,
      totalPoints: 12800,
      completedPaths: 5,
      currentStreak: 21,
      longestStreak: 39,
      totalHours: 145,
      achievements: [
        {
          id: '6',
          name: 'First Steps',
          description: 'Complete your first learning path',
          icon: '👶',
          rarity: 'common' as const,
          unlockedAt: '2023-12-15'
        }
      ],
      joinedDate: '2023-09-05',
      isCurrentUser: user?.name === 'Emily Davis'
    },
    {
      id: '5',
      name: 'David Kim',
      avatar: '/avatars/david.jpg',
      rank: 5,
      previousRank: 6,
      totalPoints: 11900,
      completedPaths: 4,
      currentStreak: 15,
      longestStreak: 33,
      totalHours: 123,
      achievements: [
        {
          id: '7',
          name: 'Night Owl',
          description: 'Complete lessons after midnight',
          icon: '🦉',
          rarity: 'rare' as const,
          unlockedAt: '2024-01-05'
        }
      ],
      joinedDate: '2023-10-12',
      isCurrentUser: user?.name === 'David Kim'
    }
  ];

  const getMockAchievements = () => [
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
      name: 'First Steps',
      description: 'Complete your first learning path',
      icon: '👶',
      rarity: 'common',
      unlockedAt: '2023-12-15',
      progress: 1,
      maxProgress: 1
    }
  ];

  const getMockPathLeaderboards = () => [
    {
      pathId: '1',
      pathName: 'Full Stack Web Development',
      pathIcon: '🌐',
      topUsers: mockUsers.slice(0, 5)
    },
    {
      pathId: '2',
      pathName: 'Data Science & Machine Learning',
      pathIcon: '🧠',
      topUsers: mockUsers.slice(0, 5)
    },
    {
      pathId: '3',
      pathName: 'Mobile App Development',
      pathIcon: '📱',
      topUsers: mockUsers.slice(0, 5)
    }
  ];

  // Get mock data
  const mockUsers = getMockUsers();
  const mockAchievements = getMockAchievements();
  const mockPathLeaderboards = getMockPathLeaderboards();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="text-yellow-400" size={24} />;
      case 2: return <Medal className="text-gray-300" size={24} />;
      case 3: return <Award className="text-amber-600" size={24} />;
      default: return <span className="text-2xl font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankChange = (user: LeaderboardUser) => {
    if (!user.previousRank) return null;
    const change = user.previousRank - user.rank;
    if (change > 0) {
      return (
        <div className="flex items-center gap-1 text-green-400 text-sm">
          <ChevronUp size={14} />
          <span>+{change}</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center gap-1 text-red-400 text-sm">
          <ChevronDown size={14} />
          <span>{change}</span>
        </div>
      );
    }
    return <div className="text-gray-500 text-sm">-</div>;
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

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Trophy className="text-yellow-400" size={48} />
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
              Leaderboard
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Compete with learners worldwide and track your progress
          </p>
        </header>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-4 py-2 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-white focus:border-gray-500 focus:outline-none"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>

          <select
            value={selectedPath}
            onChange={(e) => setSelectedPath(e.target.value)}
            className="px-4 py-2 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-white focus:border-gray-500 focus:outline-none"
          >
            <option value="all">All Paths</option>
            {pathLeaderboards.map(path => (
              <option key={path.pathId} value={path.pathId}>
                {path.pathName}
              </option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 p-1 mx-auto">
            <TabsTrigger value="global" className="data-[state=active]:bg-purple-600">
              <Trophy size={16} className="mr-2" />
              Global Rankings
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600">
              <Award size={16} className="mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="paths" className="data-[state=active]:bg-purple-600">
              <BookOpen size={16} className="mr-2" />
              Path Rankings
            </TabsTrigger>
            <TabsTrigger value="streaks" className="data-[state=active]:bg-purple-600">
              <Flame size={16} className="mr-2" />
              Learning Streaks
            </TabsTrigger>
          </TabsList>

          {/* Global Rankings Tab */}
          <TabsContent value="global" className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {/* Top 3 Podium */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {(leaderboardData?.users || []).slice(0, 3).map((user: any, index: number) => (
                    <Card key={user.id} className={`relative overflow-hidden ${user.rank === 1
                      ? 'bg-gradient-to-br from-yellow-900/30 via-yellow-800/20 to-yellow-900/30 border-yellow-500/30'
                      : user.rank === 2
                        ? 'bg-gradient-to-br from-gray-700/30 via-gray-600/20 to-gray-700/30 border-gray-400/30'
                        : 'bg-gradient-to-br from-amber-900/30 via-amber-800/20 to-amber-900/30 border-amber-600/30'
                      } border transition-all duration-300 hover:scale-105`}>
                      {user.rank === 1 && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
                      )}

                      <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-4">
                          {getRankIcon(user.rank)}
                        </div>
                        <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-purple-500/30">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-xl font-bold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                          {user.name}
                        </CardTitle>
                        {user.isCurrentUser && (
                          <Badge className="bg-purple-600 text-white">You</Badge>
                        )}
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            {user.totalPoints.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-400">Total Points</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-bold text-green-400">{user.completedPaths}</div>
                            <div className="text-gray-400">Paths</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-orange-400">{user.currentStreak}</div>
                            <div className="text-gray-400">Streak</div>
                          </div>
                        </div>

                        {getRankChange(user) && (
                          <div className="flex justify-center">
                            {getRankChange(user)}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Full Leaderboard */}
                <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
                  <CardHeader>
                    <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-2">
                      <TrendingUp size={20} />
                      Global Leaderboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockUsers.map((user) => (
                        <div key={user.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:border-purple-500/50 ${user.isCurrentUser
                          ? 'bg-purple-900/20 border-purple-500/30'
                          : 'bg-gray-800/30 border-gray-700 hover:bg-gray-700/30'
                          }`}>
                          <div className="flex items-center justify-center w-12 h-12">
                            {getRankIcon(user.rank)}
                          </div>

                          <Avatar className="w-12 h-12">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                                {user.name}
                              </h4>
                              {user.isCurrentUser && (
                                <Badge className="bg-purple-600 text-white text-xs">You</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span>{user.totalPoints.toLocaleString()} pts</span>
                              <span>{user.completedPaths} paths</span>
                              <span className="flex items-center gap-1">
                                <Flame size={12} className="text-orange-400" />
                                {user.currentStreak}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {getRankChange(user)}
                            <div className="flex gap-1">
                              {user.achievements.slice(0, 3).map((achievement) => (
                                <div
                                  key={achievement.id}
                                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm ${getAchievementRarityColor(achievement.rarity)}`}
                                  title={achievement.name}
                                >
                                  {achievement.icon}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['legendary', 'epic', 'rare', 'common'].map((rarity) => (
                <Card key={rarity} className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
                  <CardHeader>
                    <CardTitle className={`capitalize ${rarity === 'legendary' ? 'text-yellow-400' :
                      rarity === 'epic' ? 'text-purple-400' :
                        rarity === 'rare' ? 'text-blue-400' : 'text-gray-400'
                      }`}>
                      {rarity} Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockUsers[0].achievements
                      .filter(a => a.rarity === rarity)
                      .map((achievement) => (
                        <div key={achievement.id} className={`p-3 rounded-lg border ${getAchievementRarityColor(achievement.rarity)}`}>
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{achievement.icon}</div>
                            <div>
                              <h4 className="font-semibold text-white">{achievement.name}</h4>
                              <p className="text-sm text-gray-400">{achievement.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Path Rankings Tab */}
          <TabsContent value="paths" className="space-y-6">
            <div className="grid gap-6">
              {mockPathLeaderboards.map((pathBoard) => (
                <Card key={pathBoard.pathId} className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
                  <CardHeader>
                    <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-3">
                      <span className="text-2xl">{pathBoard.pathIcon}</span>
                      {pathBoard.pathName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pathBoard.topUsers.slice(0, 5).map((user, index) => (
                        <div key={user.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/30">
                          <div className="flex items-center justify-center w-8 h-8 text-lg font-bold text-gray-400">
                            #{index + 1}
                          </div>
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{user.name}</h4>
                            <div className="text-sm text-gray-400">{user.totalPoints.toLocaleString()} points</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Learning Streaks Tab */}
          <TabsContent value="streaks" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Streaks */}
              <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-2">
                    <Flame className="text-orange-400" />
                    Current Streaks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockUsers
                    .sort((a, b) => b.currentStreak - a.currentStreak)
                    .map((user, index) => (
                      <div key={user.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/30">
                        <div className="flex items-center justify-center w-8 h-8 text-lg font-bold text-orange-400">
                          #{index + 1}
                        </div>
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{user.name}</h4>
                          <div className="text-sm text-gray-400">{user.currentStreak} days</div>
                        </div>
                        <Flame className="text-orange-400" size={20} />
                      </div>
                    ))}
                </CardContent>
              </Card>

              {/* Longest Streaks */}
              <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-2">
                    <Award className="text-yellow-400" />
                    Longest Streaks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockUsers
                    .sort((a, b) => b.longestStreak - a.longestStreak)
                    .map((user, index) => (
                      <div key={user.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/30">
                        <div className="flex items-center justify-center w-8 h-8 text-lg font-bold text-yellow-400">
                          #{index + 1}
                        </div>
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{user.name}</h4>
                          <div className="text-sm text-gray-400">{user.longestStreak} days</div>
                        </div>
                        <Trophy className="text-yellow-400" size={20} />
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Flame,
  Crown,
  Rocket,
  Brain,
  Lock
} from 'lucide-react';

interface AchievementBadgesProps {
  userProgress: any;
  path: any;
}

export const AchievementBadges: React.FC<AchievementBadgesProps> = ({ userProgress, path }) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProgress && path) {
      fetchAchievements();
    }
  }, [userProgress, path]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const { LearningPathService } = await import('@/services/learningPathService');
      const data = await LearningPathService.getAchievements(path._id);
      setUnlockedAchievements(data);
      
      // Check for new achievements
      await LearningPathService.checkAchievements(path._id);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!userProgress) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardContent className="py-20 text-center">
          <Award size={64} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Achievements Yet</h3>
          <p className="text-gray-400">Start learning to unlock achievements and badges</p>
        </CardContent>
      </Card>
    );
  }

  const isAchievementUnlocked = (type: string) => {
    return unlockedAchievements.some(a => a.achievementType === type);
  };

  const achievements = [
    {
      id: 1,
      type: 'quick-start',
      icon: Rocket,
      title: 'Quick Start',
      description: 'Complete your first lesson',
      unlocked: isAchievementUnlocked('quick-start'),
      color: 'from-blue-500 to-cyan-500',
      rarity: 'common'
    },
    {
      id: 2,
      type: '7-day-streak',
      icon: Flame,
      title: '7-Day Streak',
      description: 'Learn for 7 consecutive days',
      unlocked: isAchievementUnlocked('7-day-streak'),
      color: 'from-orange-500 to-red-500',
      rarity: 'rare'
    },
    {
      id: 3,
      type: 'knowledge-seeker',
      icon: Brain,
      title: 'Knowledge Seeker',
      description: 'Complete 50% of the learning path',
      unlocked: isAchievementUnlocked('knowledge-seeker'),
      color: 'from-purple-500 to-pink-500',
      rarity: 'rare'
    },
    {
      id: 4,
      type: 'milestone-master',
      icon: Target,
      title: 'Milestone Master',
      description: 'Complete all milestones',
      unlocked: isAchievementUnlocked('milestone-master'),
      color: 'from-green-500 to-emerald-500',
      rarity: 'epic'
    },
    {
      id: 5,
      type: 'path-completer',
      icon: Trophy,
      title: 'Path Completer',
      description: 'Complete the entire learning path',
      unlocked: isAchievementUnlocked('path-completer'),
      color: 'from-yellow-500 to-amber-500',
      rarity: 'legendary'
    },
    {
      id: 6,
      type: 'top-performer',
      icon: Crown,
      title: 'Top Performer',
      description: 'Finish in top 10% of learners',
      unlocked: isAchievementUnlocked('top-performer'),
      color: 'from-purple-600 to-indigo-600',
      rarity: 'legendary'
    },
    {
      id: 7,
      type: 'speed-learner',
      icon: Zap,
      title: 'Speed Learner',
      description: 'Complete a course in record time',
      unlocked: isAchievementUnlocked('speed-learner'),
      color: 'from-yellow-400 to-orange-400',
      rarity: 'epic'
    },
    {
      id: 8,
      type: 'perfect-score',
      icon: Star,
      title: 'Perfect Score',
      description: 'Get 100% on all quizzes',
      unlocked: isAchievementUnlocked('perfect-score'),
      color: 'from-blue-400 to-purple-400',
      rarity: 'epic'
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-500';
      case 'rare': return 'text-blue-400 border-blue-500';
      case 'epic': return 'text-purple-400 border-purple-500';
      case 'legendary': return 'text-yellow-400 border-yellow-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {unlockedCount} / {totalCount} Achievements Unlocked
              </h3>
              <p className="text-gray-300">
                Keep learning to unlock more badges and achievements!
              </p>
            </div>
            <div className="text-6xl">
              <Trophy className="text-yellow-400" size={64} />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map((achievement) => (
          <Card 
            key={achievement.id}
            className={`relative overflow-hidden transition-all ${
              achievement.unlocked
                ? 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20'
                : 'bg-gray-900/50 border-gray-800 opacity-60'
            }`}
          >
            <CardContent className="p-6">
              {!achievement.unlocked && (
                <div className="absolute top-2 right-2">
                  <Lock size={16} className="text-gray-600" />
                </div>
              )}
              
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${achievement.color} flex items-center justify-center mb-4 ${
                !achievement.unlocked && 'grayscale opacity-50'
              }`}>
                <achievement.icon size={32} className="text-white" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                    {achievement.title}
                  </h4>
                </div>
                
                <p className={`text-sm ${achievement.unlocked ? 'text-gray-400' : 'text-gray-600'}`}>
                  {achievement.description}
                </p>
                
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getRarityColor(achievement.rarity)}`}
                >
                  {achievement.rarity.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Achievements */}
      {unlockedCount > 0 && (
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Star size={20} />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements
              .filter(a => a.unlocked)
              .slice(0, 3)
              .map((achievement) => (
                <div 
                  key={achievement.id}
                  className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center`}>
                    <achievement.icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-white font-semibold">{achievement.title}</h5>
                    <p className="text-gray-400 text-sm">{achievement.description}</p>
                  </div>
                  <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                    {achievement.rarity}
                  </Badge>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

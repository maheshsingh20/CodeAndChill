import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Trophy, Target, Zap } from 'lucide-react';
import { useRealTimeProgress } from '@/hooks/useRealTimeProgress';
import { motion, AnimatePresence } from 'framer-motion';

interface RealTimeProgressBarProps {
  courseId: string;
  totalLessons: number;
  className?: string;
}

export const RealTimeProgressBar: React.FC<RealTimeProgressBarProps> = ({
  courseId,
  totalLessons,
  className = ''
}) => {
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<any>(null);

  const { progress, achievements, isUpdating } = useRealTimeProgress({
    courseId,
    onProgressUpdate: (update) => {
      console.log('Progress updated:', update);
    },
    onAchievementUnlocked: (newAchievements) => {
      if (newAchievements.length > 0) {
        setCurrentAchievement(newAchievements[0]);
        setShowAchievement(true);
        setTimeout(() => setShowAchievement(false), 5000);
      }
    }
  });

  const progressPercentage = progress?.progressPercentage || 0;
  const completedLessons = progress?.completedLessons?.length || 0;
  const timeSpent = progress?.timeSpent || 0;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Progress Bar */}
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Course Progress</h3>
              {isUpdating && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="h-4 w-4 text-yellow-500" />
                </motion.div>
              )}
            </div>
            <Badge variant="secondary" className="text-sm">
              {completedLessons}/{totalLessons} lessons
            </Badge>
          </div>

          {/* Animated Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-3 transition-all duration-500 ease-out"
            />
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeSpent)} spent</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span>{achievements.length} achievements</span>
            </div>
          </div>

          {/* Progress Animation Overlay */}
          {isUpdating && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          )}
        </CardContent>
      </Card>

      {/* Achievement Notification */}
      <AnimatePresence>
        {showAchievement && currentAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-4 right-4 z-50"
          >
            <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg border-0">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{currentAchievement.icon}</div>
                  <div>
                    <h4 className="font-bold text-sm">Achievement Unlocked!</h4>
                    <p className="text-xs opacity-90">{currentAchievement.title}</p>
                    <p className="text-xs opacity-75">{currentAchievement.description}</p>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    +{currentAchievement.points}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-sm mb-3 flex items-center">
              <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
              Recent Achievements
            </h4>
            <div className="space-y-2">
              {achievements.slice(-3).map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50"
                >
                  <span className="text-lg">{achievement.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{achievement.title}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    +{achievement.points}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeProgressBar;
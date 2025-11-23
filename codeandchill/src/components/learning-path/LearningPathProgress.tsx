import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LearningPathService, UserLearningPath } from '@/services/learningPathService';
import { useUser } from '@/contexts/UserContext';
import { BookOpen, TrendingUp, Award, Plus, Clock, Target } from 'lucide-react';

export const LearningPathProgress: React.FC = () => {
  const { user } = useUser();
  const [enrolledPaths, setEnrolledPaths] = useState<UserLearningPath[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEnrolledPaths();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchEnrolledPaths = async () => {
    try {
      setLoading(true);
      const paths = await LearningPathService.getEnrolledPaths();
      setEnrolledPaths(paths.slice(0, 3)); // Show only top 3 in dashboard
    } catch (error) {
      console.error('Error fetching enrolled paths:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'text-green-400';
    if (progress >= 75) return 'text-blue-400';
    if (progress >= 50) return 'text-yellow-400';
    if (progress >= 25) return 'text-orange-400';
    return 'text-gray-400';
  };

  const getProgressBarColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-gray-500';
  };

  if (!user) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BookOpen className="mr-2" size={20} />
            Learning Paths
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <BookOpen className="mx-auto mb-4 text-gray-500" size={32} />
          <p className="text-gray-400 mb-4">Sign in to track your learning progress</p>
          <Link to="/auth?tab=login">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Sign In
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BookOpen className="mr-2" size={20} />
            Learning Path Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-700 rounded w-32 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-12 animate-pulse"></div>
                </div>
                <div className="h-2 bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (enrolledPaths.length === 0) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BookOpen className="mr-2" size={20} />
            Learning Paths
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <TrendingUp className="mx-auto mb-4 text-gray-500" size={32} />
          <h3 className="text-lg font-medium text-white mb-2">Start Your Learning Journey</h3>
          <p className="text-gray-400 mb-4">
            Choose from structured learning paths to master new skills
          </p>
          <Link to="/learning-paths">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2" size={16} />
              Browse Learning Paths
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="mr-2" size={20} />
            Learning Path Progress
          </div>
          <Badge variant="outline" className="text-xs border-gray-600">
            {enrolledPaths.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {enrolledPaths.map((userPath) => {
            const progress = userPath.overallProgress;
            const isCompleted = progress === 100;
            
            return (
              <div key={userPath._id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300 text-sm">
                      {userPath.pathId.icon} {userPath.pathId.title}
                    </span>
                    {isCompleted && (
                      <Award className="text-green-400" size={14} />
                    )}
                  </div>
                  <span className={`font-medium text-sm ${getProgressColor(progress)}`}>
                    {progress}%
                  </span>
                </div>
                <div className="relative">
                  <Progress 
                    value={progress} 
                    className="h-2"
                  />
                  <div 
                    className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-300 ${getProgressBarColor(progress)}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                {/* Course Progress Summary */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {userPath.progress.filter(p => p.progress === 100).length} / {userPath.progress.length} courses
                  </span>
                  <span>
                    {LearningPathService.formatDuration(userPath.totalTimeSpent / 60)} spent
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 space-y-2">
          <Link to="/learning-paths" className="block">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              View All Paths
            </Button>
          </Link>
          
          {enrolledPaths.length > 0 && enrolledPaths[0].pathId && (
            <div className="text-center">
              <Link 
                to={`/learning-paths/${enrolledPaths[0].pathId._id}`} 
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Continue Current Path →
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
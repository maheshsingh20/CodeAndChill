import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LearningPathService, LearningPath, UserLearningPath } from '@/services/learningPathService';
import { useUser } from '@/contexts/UserContext';
import { BookOpen, Target, Filter, TrendingUp, Clock, Users, Star, Award, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PathCardProps {
  path: LearningPath;
  userProgress?: UserLearningPath;
  onEnroll?: (pathId: string) => void;
  showProgress?: boolean;
}

const PathCard: React.FC<PathCardProps> = ({ 
  path, 
  userProgress, 
  onEnroll, 
  showProgress = false 
}) => {
  const isEnrolled = !!userProgress;
  const progress = userProgress?.overallProgress || 0;
  const isCompleted = progress === 100;

  const handleEnroll = () => {
    if (onEnroll && !isEnrolled) {
      onEnroll(path._id);
    }
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-purple-500/50 transition-all duration-300 group h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="text-3xl mb-2">{path.icon}</div>
          <Badge className={`${LearningPathService.getDifficultyBadgeColor(path.difficulty)} border`}>
            {path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)}
          </Badge>
        </div>
        
        <CardTitle className="text-white group-hover:text-purple-300 transition-colors line-clamp-2">
          {path.title}
        </CardTitle>
        
        <p className="text-gray-400 text-sm line-clamp-3">
          {path.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar (if enrolled) */}
        {showProgress && isEnrolled && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Progress</span>
              <span className={`font-medium ${LearningPathService.getProgressColor(progress)}`}>
                {progress}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${LearningPathService.getProgressBarColor(progress)}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            {isCompleted && (
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <Award size={14} />
                <span>Completed!</span>
              </div>
            )}
          </div>
        )}

        {/* Path Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <Clock size={16} />
            <span>{LearningPathService.formatDuration(path.estimatedDuration)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-300">
            <BookOpen size={16} />
            <span>{path.courses.length} courses</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-300">
            <Users size={16} />
            <span>{path.enrollmentCount.toLocaleString()} enrolled</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-300">
            <Star size={16} className="text-yellow-400" />
            <span>{path.averageRating.toFixed(1)} ({path.totalRatings} reviews)</span>
          </div>
        </div>

        {/* Tags */}
        {path.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {path.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs border-gray-600 text-gray-400">
                {tag}
              </Badge>
            ))}
            {path.tags.length > 3 && (
              <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                +{path.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Milestones Preview */}
        {path.milestones.length > 0 && (
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Target size={14} className="text-purple-400" />
              <span className="text-sm font-medium text-white">{path.milestones.length} Milestones</span>
            </div>
            <div className="text-xs text-gray-300">
              🎯 {path.milestones[0]?.title}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {isEnrolled ? (
            <Link to={`/learning-paths/${path._id}`} className="block">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                {isCompleted ? 'Review Path' : 'Continue Learning'}
              </Button>
            </Link>
          ) : (
            <div className="space-y-2">
              <Button 
                onClick={handleEnroll}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Enroll Now
              </Button>
              <Link to={`/learning-paths/${path._id}`} className="block">
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                  View Details
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const LearningPathsPage: React.FC = () => {
  const { user } = useUser();
  const [allPaths, setAllPaths] = useState<LearningPath[]>([]);
  const [enrolledPaths, setEnrolledPaths] = useState<UserLearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledLoading, setEnrolledLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');

  // Get unique tags from all paths
  const allTags = Array.from(new Set(allPaths.flatMap(path => path.tags)));

  useEffect(() => {
    fetchAllPaths();
    if (user) {
      fetchEnrolledPaths();
    }
  }, [user]);

  useEffect(() => {
    fetchAllPaths();
  }, [difficultyFilter, tagFilter]);

  const fetchAllPaths = async () => {
    try {
      setLoading(true);
      const difficulty = difficultyFilter === 'all' ? undefined : difficultyFilter;
      const tags = tagFilter === 'all' ? undefined : [tagFilter];
      
      const response = await LearningPathService.getLearningPaths(difficulty, tags, 1, 20);
      setAllPaths(response.paths);
    } catch (error) {
      console.error('Error fetching learning paths:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledPaths = async () => {
    try {
      setEnrolledLoading(true);
      const paths = await LearningPathService.getEnrolledPaths();
      setEnrolledPaths(paths);
    } catch (error) {
      console.error('Error fetching enrolled paths:', error);
    } finally {
      setEnrolledLoading(false);
    }
  };

  const handleEnroll = async (pathId: string) => {
    if (!user) {
      // Redirect to login or show login modal
      return;
    }

    try {
      await LearningPathService.enrollInPath(pathId);
      // Refresh enrolled paths
      fetchEnrolledPaths();
      // Show success message
      alert('Successfully enrolled in learning path!');
    } catch (error: any) {
      console.error('Enrollment failed:', error);
      alert(error.message || 'Failed to enroll in learning path');
    }
  };

  const getEnrolledPathProgress = (pathId: string) => {
    return enrolledPaths.find(ep => ep.pathId._id === pathId);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-64"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <BookOpen className="text-purple-400" size={36} />
            Learning Paths
          </h1>
          <p className="text-gray-300 text-lg">
            Structured learning journeys to master new skills and advance your career
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-gray-300 text-sm">Filters:</span>
          </div>
          
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-600">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-600">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allTags.map(tag => (
                <SelectItem key={tag} value={tag}>
                  {tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(difficultyFilter !== 'all' || tagFilter !== 'all') && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setDifficultyFilter('all');
                setTagFilter('all');
              }}
              className="border-gray-600 text-gray-300"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-gray-800/50 border-gray-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
              All Paths ({allPaths.length})
            </TabsTrigger>
            {user && (
              <TabsTrigger value="enrolled" className="data-[state=active]:bg-blue-600">
                My Paths ({enrolledPaths.length})
              </TabsTrigger>
            )}
            <TabsTrigger value="popular" className="data-[state=active]:bg-green-600">
              Popular
            </TabsTrigger>
          </TabsList>

          {/* All Paths Tab */}
          <TabsContent value="all" className="mt-6">
            {allPaths.length === 0 ? (
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardContent className="p-12 text-center">
                  <BookOpen className="mx-auto mb-4 text-gray-500" size={48} />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No learning paths found
                  </h3>
                  <p className="text-gray-400">
                    Try adjusting your filters or check back later for new paths.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {allPaths.map((path) => (
                  <PathCard 
                    key={path._id} 
                    path={path} 
                    userProgress={getEnrolledPathProgress(path._id)}
                    onEnroll={handleEnroll}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Enrolled Paths Tab */}
          {user && (
            <TabsContent value="enrolled" className="mt-6">
              {enrolledLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-96 bg-gray-800 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : enrolledPaths.length === 0 ? (
                <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                  <CardContent className="p-12 text-center">
                    <Target className="mx-auto mb-4 text-gray-500" size={48} />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No enrolled paths yet
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Start your learning journey by enrolling in a path that matches your goals.
                    </p>
                    <Button onClick={() => setActiveTab('all')} className="bg-purple-600 hover:bg-purple-700">
                      Browse All Paths
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {enrolledPaths.map((userPath) => (
                    <PathCard 
                      key={userPath._id} 
                      path={userPath.pathId} 
                      userProgress={userPath}
                      showProgress={true}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          )}

          {/* Popular Paths Tab */}
          <TabsContent value="popular" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allPaths
                .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
                .slice(0, 6)
                .map((path) => (
                  <PathCard 
                    key={path._id} 
                    path={path} 
                    userProgress={getEnrolledPathProgress(path._id)}
                    onEnroll={handleEnroll}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
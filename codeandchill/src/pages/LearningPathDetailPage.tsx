import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LearningPathService, LearningPath, UserLearningPath } from '@/services/learningPathService';
import { useUser } from '@/contexts/UserContext';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Award, 
  Target, 
  CheckCircle, 
  PlayCircle,
  ArrowLeft,
  Trophy
} from 'lucide-react';

export const LearningPathDetailPage: React.FC = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const { user } = useUser();
  const [path, setPath] = useState<LearningPath | null>(null);
  const [userProgress, setUserProgress] = useState<UserLearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (pathId) {
      fetchPathDetails();
      if (user) {
        fetchUserProgress();
      }
    }
  }, [pathId, user]);

  const fetchPathDetails = async () => {
    try {
      setLoading(true);
      const pathData = await LearningPathService.getLearningPath(pathId!);
      setPath(pathData);
    } catch (error) {
      console.error('Error fetching path details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const progress = await LearningPathService.getPathProgress(pathId!);
      setUserProgress(progress);
    } catch (error) {
      // User not enrolled, which is fine
      console.log('User not enrolled in this path');
    }
  };

  const handleEnroll = async () => {
    if (!user || !pathId) return;

    try {
      setEnrolling(true);
      await LearningPathService.enrollInPath(pathId);
      await fetchUserProgress();
      alert('Successfully enrolled in learning path!');
    } catch (error: any) {
      console.error('Enrollment failed:', error);
      alert(error.message || 'Failed to enroll in learning path');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-64"></div>
            <div className="h-64 bg-gray-800 rounded-lg"></div>
            <div className="h-96 bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto text-center py-20">
          <h1 className="text-2xl font-bold text-white mb-4">Learning Path Not Found</h1>
          <p className="text-gray-400 mb-6">The learning path you're looking for doesn't exist.</p>
          <Link to="/learning-paths">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Browse Learning Paths
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isEnrolled = !!userProgress;
  const progress = userProgress?.overallProgress || 0;
  const isCompleted = progress === 100;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/learning-paths" 
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Learning Paths
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-6xl">{path.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{path.title}</h1>
                <Badge className={`${LearningPathService.getDifficultyBadgeColor(path.difficulty)} border`}>
                  {path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)}
                </Badge>
              </div>
              <p className="text-gray-300 text-lg mb-4">{path.description}</p>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{LearningPathService.formatDuration(path.estimatedDuration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={16} />
                  <span>{path.courses.length} courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{path.enrollmentCount.toLocaleString()} enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-400" />
                  <span>{path.averageRating.toFixed(1)} ({path.totalRatings} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment Status & Action */}
          {user && (
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              {isEnrolled ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Your Progress</span>
                    <span className={`font-bold ${LearningPathService.getProgressColor(progress)}`}>
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${LearningPathService.getProgressBarColor(progress)}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {isCompleted && (
                    <div className="flex items-center gap-2 text-green-400">
                      <Trophy size={16} />
                      <span className="font-medium">Congratulations! You've completed this path!</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium mb-1">Ready to start learning?</h3>
                    <p className="text-gray-400 text-sm">Enroll now to track your progress and earn certificates</p>
                  </div>
                  <Button 
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course List */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen size={20} />
                  Courses ({path.courses.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {path.courses.map((course, index) => {
                  const courseProgress = userProgress?.progress.find(p => p.courseId._id === course.courseId._id);
                  const isCompleted = courseProgress?.progress === 100;
                  const canAccess = isEnrolled && (index === 0 || userProgress?.progress[index - 1]?.progress === 100);

                  return (
                    <div 
                      key={course.courseId._id}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                        canAccess 
                          ? 'bg-gray-700/30 border-gray-600 hover:border-purple-500/50' 
                          : 'bg-gray-800/30 border-gray-700 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{course.courseId.title}</h4>
                        <p className="text-gray-400 text-sm">{course.courseId.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{LearningPathService.formatDuration(course.estimatedHours)}</span>
                          {course.isRequired && <Badge variant="outline" className="text-xs">Required</Badge>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <CheckCircle className="text-green-400" size={20} />
                        ) : canAccess ? (
                          <PlayCircle className="text-blue-400" size={20} />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Milestones */}
            {path.milestones.length > 0 && (
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target size={20} />
                    Milestones ({path.milestones.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {path.milestones.map((milestone, index) => {
                    const milestoneProgress = userProgress?.milestoneProgress.find(mp => mp.milestoneId === milestone._id);
                    const isCompleted = milestoneProgress?.isCompleted;

                    return (
                      <div key={milestone._id} className="flex items-start gap-4 p-4 rounded-lg bg-gray-700/30">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          isCompleted ? 'bg-green-600' : 'bg-gray-600'
                        } text-white font-semibold text-sm`}>
                          {isCompleted ? <Award size={16} /> : index + 1}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className={`font-medium ${isCompleted ? 'text-green-400' : 'text-white'}`}>
                            {milestone.title}
                          </h4>
                          <p className="text-gray-400 text-sm mt-1">{milestone.description}</p>
                          {isCompleted && milestoneProgress?.completedAt && (
                            <p className="text-green-400 text-xs mt-2">
                              Completed on {new Date(milestoneProgress.completedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prerequisites */}
            {path.prerequisites.length > 0 && (
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Prerequisites</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {path.prerequisites.map((prereq, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-center gap-2">
                        <CheckCircle size={14} className="text-green-400" />
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {path.tags.length > 0 && (
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {path.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-gray-600 text-gray-300">
                        {tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Creator Info */}
            {path.createdBy && (
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Created By</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                      {path.createdBy.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{path.createdBy.name || 'Admin'}</p>
                      <p className="text-gray-400 text-sm">Learning Path Creator</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
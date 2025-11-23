import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Trophy,
  Lock,
  MessageSquare,
  BarChart3,
  Download,
  Share2,
  Bookmark,
  TrendingUp,
  Zap,
  Brain,
  Code,
  FileText,
  Video
} from 'lucide-react';
import { CoursePlayer } from '@/components/learning-path/CoursePlayer';
import { ProgressAnalytics } from '@/components/learning-path/ProgressAnalytics';
import { DiscussionPanel } from '@/components/learning-path/DiscussionPanel';
import { CertificateGenerator } from '@/components/learning-path/CertificateGenerator';
import { AchievementBadges } from '@/components/learning-path/AchievementBadges';

export const LearningPathDetailPage: React.FC = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const { user } = useUser();
  const [path, setPath] = useState<LearningPath | null>(null);
  const [userProgress, setUserProgress] = useState<UserLearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [certificate, setCertificate] = useState<any>(null);

  useEffect(() => {
    if (pathId) {
      fetchPathDetails();
      if (user) {
        fetchUserProgress();
        fetchBookmarkStatus();
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
      
      // Update streak when user accesses the page
      await LearningPathService.updateStreak();
      
      // Fetch certificate if completed
      if (progress.overallProgress === 100) {
        fetchCertificate();
      }
    } catch (error) {
      console.log('User not enrolled in this path');
    }
  };

  const fetchBookmarkStatus = async () => {
    try {
      const status = await LearningPathService.getBookmarkStatus(pathId!);
      setIsBookmarked(status.bookmarked);
    } catch (error) {
      console.error('Error fetching bookmark status:', error);
    }
  };

  const fetchCertificate = async () => {
    try {
      const cert = await LearningPathService.getCertificate(pathId!);
      setCertificate(cert);
    } catch (error) {
      console.error('Error fetching certificate:', error);
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

  const handleCourseClick = (course: any, index: number) => {
    const canAccess = isEnrolled && (index === 0 || userProgress?.progress[index - 1]?.progress === 100);
    if (canAccess) {
      setSelectedCourse(course);
      setActiveTab('learn');
    }
  };

  const handleProgressUpdate = async (courseId: string, progress: number, timeSpent: number) => {
    if (!pathId) return;
    try {
      await LearningPathService.updateCourseProgress(pathId, courseId, progress, timeSpent);
      await fetchUserProgress();
      
      // Check for new achievements
      await LearningPathService.checkAchievements(pathId);
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: path?.title,
        text: path?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const toggleBookmark = async () => {
    if (!pathId) return;
    try {
      const result = await LearningPathService.toggleBookmark(pathId);
      setIsBookmarked(result.bookmarked);
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const handleDownloadCertificate = () => {
    if (certificate) {
      // TODO: Implement PDF generation
      alert('Certificate download will be implemented soon!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
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
        <div className="max-w-7xl mx-auto text-center py-20">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            to="/learning-paths" 
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Learning Paths
          </Link>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleBookmark}
              className={`border-gray-600 ${isBookmarked ? 'text-yellow-400' : 'text-gray-400'}`}
            >
              <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-gray-600 text-gray-400"
            >
              <Share2 size={16} />
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-2xl p-8 mb-8 border border-purple-500/20">
          <div className="flex items-start gap-6">
            <div className="text-7xl">{path.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-bold text-white">{path.title}</h1>
                <Badge className={`${LearningPathService.getDifficultyBadgeColor(path.difficulty)} border`}>
                  {path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)}
                </Badge>
              </div>
              <p className="text-gray-300 text-lg mb-6">{path.description}</p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-400 mb-1">
                    <Clock size={18} />
                    <span className="text-sm font-medium">Duration</span>
                  </div>
                  <p className="text-white font-bold">{LearningPathService.formatDuration(path.estimatedDuration)}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-400 mb-1">
                    <BookOpen size={18} />
                    <span className="text-sm font-medium">Courses</span>
                  </div>
                  <p className="text-white font-bold">{path.courses.length}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-purple-400 mb-1">
                    <Users size={18} />
                    <span className="text-sm font-medium">Enrolled</span>
                  </div>
                  <p className="text-white font-bold">{path.enrollmentCount.toLocaleString()}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-yellow-400 mb-1">
                    <Star size={18} />
                    <span className="text-sm font-medium">Rating</span>
                  </div>
                  <p className="text-white font-bold">{path.averageRating.toFixed(1)} ({path.totalRatings})</p>
                </div>
              </div>

              {/* Enrollment Status */}
              {user && (
                <div className="bg-gray-800/70 rounded-lg p-5">
                  {isEnrolled ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="text-blue-400" size={24} />
                          <div>
                            <span className="text-white font-semibold text-lg">Your Progress</span>
                            <p className="text-gray-400 text-sm">Keep up the great work!</p>
                          </div>
                        </div>
                        <span className={`text-3xl font-bold ${LearningPathService.getProgressColor(progress)}`}>
                          {progress}%
                        </span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-700 rounded-full h-4">
                          <div 
                            className={`h-4 rounded-full transition-all duration-500 ${LearningPathService.getProgressBarColor(progress)} relative overflow-hidden`}
                            style={{ width: `${progress}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                          </div>
                        </div>
                      </div>
                      {isCompleted && certificate && (
                        <div className="flex items-center justify-between bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <Trophy className="text-yellow-400" size={28} />
                            <div>
                              <span className="text-green-400 font-bold text-lg">Congratulations!</span>
                              <p className="text-gray-300 text-sm">You've completed this learning path</p>
                            </div>
                          </div>
                          <Button onClick={handleDownloadCertificate} className="bg-green-600 hover:bg-green-700">
                            <Download size={16} className="mr-2" />
                            Get Certificate
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Zap className="text-yellow-400" size={32} />
                        <div>
                          <h3 className="text-white font-bold text-lg mb-1">Ready to start your journey?</h3>
                          <p className="text-gray-400">Enroll now to track progress, earn certificates, and join the community</p>
                        </div>
                      </div>
                      <Button 
                        onClick={handleEnroll}
                        disabled={enrolling}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg"
                      >
                        {enrolling ? 'Enrolling...' : 'Enroll Now'}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              <BookOpen size={16} className="mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="learn" className="data-[state=active]:bg-purple-600" disabled={!isEnrolled}>
              <PlayCircle size={16} className="mr-2" />
              Learn
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600" disabled={!isEnrolled}>
              <BarChart3 size={16} className="mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="discussion" className="data-[state=active]:bg-purple-600">
              <MessageSquare size={16} className="mr-2" />
              Discussion
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600" disabled={!isEnrolled}>
              <Award size={16} className="mr-2" />
              Achievements
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Course List */}
              <div className="lg:col-span-2">
                <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Code size={20} />
                      Course Curriculum ({path.courses.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {path.courses.map((course, index) => {
                      const courseProgress = userProgress?.progress.find(p => p.courseId._id === course.courseId._id);
                      const isCompleted = courseProgress?.progress === 100;
                      const canAccess = isEnrolled && (index === 0 || userProgress?.progress[index - 1]?.progress === 100);
                      const currentProgress = courseProgress?.progress || 0;

                      return (
                        <div 
                          key={course.courseId._id}
                          onClick={() => handleCourseClick(course, index)}
                          className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
                            canAccess 
                              ? 'bg-gradient-to-r from-gray-700/40 to-gray-800/40 border-gray-600 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer' 
                              : 'bg-gray-800/30 border-gray-700 opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center gap-4 p-5">
                            <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg transition-all ${
                              isCompleted 
                                ? 'bg-green-600 text-white' 
                                : canAccess 
                                  ? 'bg-purple-600 text-white group-hover:scale-110' 
                                  : 'bg-gray-700 text-gray-500'
                            }`}>
                              {isCompleted ? <CheckCircle size={24} /> : index + 1}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-white font-semibold text-lg">{course.courseId.title}</h4>
                                {course.isRequired && (
                                  <Badge variant="outline" className="text-xs border-red-500/50 text-red-400">
                                    Required
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm mb-2">{course.courseId.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock size={12} />
                                  {LearningPathService.formatDuration(course.estimatedHours)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Brain size={12} />
                                  {course.courseId.difficulty}
                                </span>
                              </div>
                              
                              {canAccess && currentProgress > 0 && currentProgress < 100 && (
                                <div className="mt-3">
                                  <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-gray-400">Progress</span>
                                    <span className="text-purple-400 font-semibold">{currentProgress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${currentProgress}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {!canAccess && <Lock className="text-gray-600" size={20} />}
                              {canAccess && !isCompleted && (
                                <PlayCircle className="text-blue-400 group-hover:scale-110 transition-transform" size={24} />
                              )}
                              {isCompleted && (
                                <CheckCircle className="text-green-400" size={24} />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Milestones */}
                {path.milestones.length > 0 && (
                  <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 mt-6">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Target size={20} />
                        Learning Milestones ({path.milestones.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {path.milestones.map((milestone, index) => {
                        const milestoneProgress = userProgress?.milestoneProgress.find(mp => mp.milestoneId === milestone._id);
                        const isCompleted = milestoneProgress?.isCompleted;

                        return (
                          <div key={milestone._id} className={`flex items-start gap-4 p-5 rounded-xl border transition-all ${
                            isCompleted 
                              ? 'bg-green-900/20 border-green-500/30' 
                              : 'bg-gray-700/30 border-gray-600'
                          }`}>
                            <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg ${
                              isCompleted ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                            }`}>
                              {isCompleted ? <Award size={24} /> : index + 1}
                            </div>
                            
                            <div className="flex-1">
                              <h4 className={`font-semibold text-lg mb-1 ${isCompleted ? 'text-green-400' : 'text-white'}`}>
                                {milestone.title}
                              </h4>
                              <p className="text-gray-400 text-sm">{milestone.description}</p>
                              {isCompleted && milestoneProgress?.completedAt && (
                                <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                                  <CheckCircle size={12} />
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
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <FileText size={18} />
                        Prerequisites
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {path.prerequisites.map((prereq, index) => (
                          <li key={index} className="text-gray-300 text-sm flex items-center gap-2">
                            <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
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
                      <CardTitle className="text-white text-lg">Topics Covered</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {path.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20">
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
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                          {path.createdBy.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{path.createdBy.name || 'Admin'}</p>
                          <p className="text-gray-400 text-sm">Learning Path Creator</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Learn Tab */}
          <TabsContent value="learn">
            {selectedCourse ? (
              <CoursePlayer 
                course={selectedCourse}
                pathId={pathId!}
                onProgressUpdate={handleProgressUpdate}
                onClose={() => setSelectedCourse(null)}
              />
            ) : (
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardContent className="py-20 text-center">
                  <Video size={64} className="mx-auto text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Select a Course to Start Learning</h3>
                  <p className="text-gray-400">Choose a course from the overview tab to begin</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <ProgressAnalytics userProgress={userProgress} path={path} />
          </TabsContent>

          {/* Discussion Tab */}
          <TabsContent value="discussion">
            <DiscussionPanel pathId={pathId!} />
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <AchievementBadges userProgress={userProgress} path={path} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

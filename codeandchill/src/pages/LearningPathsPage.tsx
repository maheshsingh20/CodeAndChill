import React, { useState, useEffect } from 'react';
import { LearningPathService, LearningPath, UserLearningPath } from '@/services/learningPathService';
import { useUser } from '@/contexts/UserContext';
import { BookOpen, Target, Clock, Users, Star, Award, ArrowRight } from 'lucide-react';
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  const handleEnroll = () => {
    if (onEnroll && !isEnrolled) {
      onEnroll(path._id);
    }
  };

  return (
    <div className="group h-full">
      <div className="h-full min-h-[420px] bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{path.icon}</div>
              <div className={`px-3 py-1 rounded-md text-xs font-medium ${getDifficultyColor(path.difficulty)}`}>
                {path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
          </div>

          {/* Content */}
          <div className="flex-grow space-y-4">
            {/* Title */}
            <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-purple-100 group-hover:to-purple-200 transition-all duration-300 leading-tight">
              {path.title}
            </h3>

            {/* Description */}
            <p className="text-sm bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300 leading-relaxed line-clamp-3">
              {path.description}
            </p>

            {/* Progress Bar (if enrolled) */}
            {showProgress && isEnrolled && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">Progress</span>
                  <span className={`font-medium ${progress === 100 ? 'text-green-400' : progress > 50 ? 'text-yellow-400' : 'text-blue-400'}`}>
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${progress === 100 ? 'bg-green-400' : progress > 50 ? 'bg-yellow-400' : 'bg-blue-400'}`}
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
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-500" />
                <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                  {LearningPathService.formatDuration(path.estimatedDuration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-gray-500" />
                <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                  {path.courses.length} courses
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Users size={14} className="text-gray-500" />
                <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                  {path.enrollmentCount.toLocaleString()} enrolled
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Star size={14} className="text-yellow-400" />
                <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                  {path.averageRating.toFixed(1)} ({path.totalRatings} reviews)
                </span>
              </div>
            </div>

            {/* Tags */}
            {path.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {path.tags.slice(0, 3).map((tag) => (
                  <div key={tag} className="px-2 py-1 bg-black/30 backdrop-blur-sm border border-gray-600 rounded text-xs">
                    <span className="bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
                      {tag}
                    </span>
                  </div>
                ))}
                {path.tags.length > 3 && (
                  <div className="px-2 py-1 bg-black/30 backdrop-blur-sm border border-gray-600 rounded text-xs">
                    <span className="bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
                      +{path.tags.length - 3}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Milestones Preview */}
            {path.milestones.length > 0 && (
              <div className="bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={14} className="text-purple-400" />
                  <span className="text-sm font-medium bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                    {path.milestones.length} Milestones
                  </span>
                </div>
                <div className="text-xs bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                  🎯 {path.milestones[0]?.title}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            {isEnrolled ? (
              <Link to={`/learning-paths/${path._id}`} className="block">
                <div className="flex items-center justify-center space-x-2 text-xs">
                  <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300">
                    {isCompleted ? 'Review Path' : 'Continue Learning'}
                  </span>
                  <div className="w-4 h-0.5 bg-gray-600 rounded-sm group-hover:bg-gray-500 transition-colors duration-300" />
                </div>
              </Link>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleEnroll}
                  className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-md transition-all duration-300"
                >
                  Enroll Now
                </button>
                <Link to={`/learning-paths/${path._id}`} className="block">
                  <div className="flex items-center justify-center space-x-2 text-xs py-1">
                    <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300">
                      View Details
                    </span>
                    <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-gray-300 transition-all duration-300" />
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
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
      return;
    }

    try {
      await LearningPathService.enrollInPath(pathId);
      fetchEnrolledPaths();
      alert('Successfully enrolled in learning path!');
    } catch (error: any) {
      console.error('Enrollment failed:', error);
      alert(error.message || 'Failed to enroll in learning path');
    }
  };

  const getEnrolledPathProgress = (pathId: string) => {
    return enrolledPaths.find(ep => ep.pathId && ep.pathId._id === pathId);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black">
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Navigation */}
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <BookOpen className="text-purple-400" size={48} />
            Learning Paths
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Structured learning journeys to master new skills and advance your career
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-2 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-white focus:border-gray-500 focus:outline-none transition-all duration-300"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="px-4 py-2 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-white focus:border-gray-500 focus:outline-none transition-all duration-300"
          >
            <option value="all">All Categories</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>
                {tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>

          {(difficultyFilter !== 'all' || tagFilter !== 'all') && (
            <button
              onClick={() => {
                setDifficultyFilter('all');
                setTagFilter('all');
              }}
              className="px-4 py-2 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-gray-300 hover:border-gray-500 hover:text-white transition-all duration-300"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { key: 'all', label: `All Paths (${allPaths.length})`, color: 'purple' },
            ...(user ? [{ key: 'enrolled', label: `My Paths (${enrolledPaths.length})`, color: 'blue' }] : []),
            { key: 'popular', label: 'Popular', color: 'green' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${activeTab === tab.key
                ? 'bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border border-gray-500 text-white'
                : 'bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main>
          {/* All Paths Tab */}
          {activeTab === 'all' && (
            <>
              {allPaths.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-12 max-w-md mx-auto">
                    <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">
                      No Learning Paths Found
                    </h2>
                    <p className="text-gray-400">
                      Try adjusting your filters or check back later for new paths.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            </>
          )}

          {/* Enrolled Paths Tab */}
          {activeTab === 'enrolled' && user && (
            <>
              {enrolledLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-96 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md animate-pulse" />
                  ))}
                </div>
              ) : enrolledPaths.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-12 max-w-md mx-auto">
                    <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">
                      No Enrolled Paths Yet
                    </h2>
                    <p className="text-gray-400 mb-6">
                      Start your learning journey by enrolling in a path that matches your goals.
                    </p>
                    <button
                      onClick={() => setActiveTab('all')}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-md transition-all duration-300"
                    >
                      Browse All Paths
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            </>
          )}

          {/* Popular Paths Tab */}
          {activeTab === 'popular' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          )}
        </main>
      </div>
    </div>
  );
};
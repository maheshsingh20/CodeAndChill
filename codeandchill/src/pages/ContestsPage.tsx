import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ContestService, Contest } from '@/services/contestService';
import { Trophy, Users, Clock, Calendar, Award, ArrowRight } from 'lucide-react';

export const ContestsPage: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchContests();
  }, [activeTab]);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const status = activeTab === 'all' ? undefined : activeTab;
      const response = await ContestService.getContests(status, 1, 20);
      setContests(response.contests);
    } catch (error) {
      console.error('Error fetching contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (problemCount: number) => {
    if (problemCount <= 2) return 'text-green-400';
    if (problemCount <= 4) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'upcoming': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'completed': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black">
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <Trophy className="text-yellow-400" size={48} />
            Live Coding Contests
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Compete with developers worldwide in real-time coding challenges
          </p>
        </header>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { key: 'all', label: 'All Contests', color: 'purple' },
            { key: 'upcoming', label: 'Upcoming', color: 'blue' },
            { key: 'active', label: 'Live Now', color: 'green' },
            { key: 'completed', label: 'Completed', color: 'gray' }
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
          {contests.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-12 max-w-md mx-auto">
                <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">
                  No Contests Found
                </h2>
                <p className="text-gray-400">
                  {activeTab === 'active'
                    ? 'No contests are currently active. Check back soon!'
                    : `No ${activeTab} contests available at the moment.`
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contests.map((contest) => (
                <div key={contest._id} className="group h-full">
                  <Link to={`/contests/${contest._id}`} className="block h-full">
                    <div className="h-full min-h-[400px] bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
                      <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(contest.status)}`}>
                            {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                          </div>
                          {contest.status === 'active' && (
                            <div className="flex items-center gap-1 text-green-400 text-sm">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              LIVE
                            </div>
                          )}
                          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                        </div>

                        {/* Content */}
                        <div className="flex-grow space-y-4">
                          {/* Title */}
                          <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-yellow-100 group-hover:to-yellow-200 transition-all duration-300 leading-tight">
                            {contest.title}
                          </h3>

                          {/* Description */}
                          <p className="text-sm bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300 leading-relaxed line-clamp-2">
                            {contest.description}
                          </p>

                          {/* Contest Info */}
                          <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-gray-500" />
                              <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                                {formatDate(contest.startTime)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-gray-500" />
                              <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                                {ContestService.formatDuration(contest.duration)}
                              </span>
                              {contest.status === 'active' && (
                                <span className="text-yellow-400 ml-2 text-xs">
                                  {ContestService.formatTimeRemaining(contest.endTime)}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <Users size={14} className="text-gray-500" />
                              <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                                {contest.participants.length} participants
                                {contest.maxParticipants && ` / ${contest.maxParticipants}`}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Trophy size={14} className="text-gray-500" />
                              <span className={`${getDifficultyColor(contest.problems.length)} font-medium`}>
                                {contest.problems.length} problems
                              </span>
                            </div>
                          </div>

                          {/* Tags */}
                          {contest.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {contest.tags.slice(0, 3).map((tag) => (
                                <div key={tag} className="px-2 py-1 bg-black/30 backdrop-blur-sm border border-gray-600 rounded text-xs">
                                  <span className="bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
                                    {tag}
                                  </span>
                                </div>
                              ))}
                              {contest.tags.length > 3 && (
                                <div className="px-2 py-1 bg-black/30 backdrop-blur-sm border border-gray-600 rounded text-xs">
                                  <span className="bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
                                    +{contest.tags.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Prizes */}
                          {contest.prizes.length > 0 && (
                            <div className="bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Award size={14} className="text-yellow-400" />
                                <span className="text-sm font-medium bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                                  Prizes
                                </span>
                              </div>
                              <div className="text-xs bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                                🥇 {contest.prizes[0]?.description}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="mt-6 pt-4 border-t border-gray-700">
                          <div className="flex items-center justify-center space-x-2 text-xs">
                            <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300">
                              {contest.status === 'active' ? 'Join Contest' : 'View Details'}
                            </span>
                            <div className="w-4 h-0.5 bg-gray-600 rounded-sm group-hover:bg-gray-500 transition-colors duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
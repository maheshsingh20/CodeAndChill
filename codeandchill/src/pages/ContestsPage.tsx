import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContestService, Contest } from '@/services/contestService';
import { ContestTimer } from '@/components/contest/ContestTimer';
import { Trophy, Users, Clock, Calendar, Tag, Award } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-64"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-800 rounded-lg"></div>
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
            <Trophy className="text-yellow-400" size={36} />
            Live Coding Contests
          </h1>
          <p className="text-gray-300 text-lg">
            Compete with developers worldwide in real-time coding challenges
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-gray-800/50 border-gray-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
              All Contests
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-blue-600">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-green-600">
              Live Now
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-gray-600">
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {contests.length === 0 ? (
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardContent className="p-12 text-center">
                  <Trophy className="mx-auto mb-4 text-gray-500" size={48} />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No contests found
                  </h3>
                  <p className="text-gray-400">
                    {activeTab === 'active' 
                      ? 'No contests are currently active. Check back soon!'
                      : `No ${activeTab} contests available at the moment.`
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {contests.map((contest) => (
                  <Card key={contest._id} className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-purple-500/50 transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={`${ContestService.getStatusBadgeColor(contest.status)} border`}>
                          {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                        </Badge>
                        {contest.status === 'active' && (
                          <div className="flex items-center gap-1 text-green-400 text-sm">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            LIVE
                          </div>
                        )}
                      </div>
                      
                      <CardTitle className="text-white group-hover:text-purple-300 transition-colors">
                        {contest.title}
                      </CardTitle>
                      
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {contest.description}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Contest Info */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Calendar size={16} />
                          <span>{formatDate(contest.startTime)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock size={16} />
                          <span>{ContestService.formatDuration(contest.duration)}</span>
                          {contest.status === 'active' && (
                            <span className="text-yellow-400 ml-2">
                              {ContestService.formatTimeRemaining(contest.endTime)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-300">
                          <Users size={16} />
                          <span>{contest.participants.length} participants</span>
                          {contest.maxParticipants && (
                            <span className="text-gray-500">
                              / {contest.maxParticipants}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-300">
                          <Trophy size={16} />
                          <span className={getDifficultyColor(contest.problems.length)}>
                            {contest.problems.length} problems
                          </span>
                        </div>
                      </div>

                      {/* Tags */}
                      {contest.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {contest.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs border-gray-600 text-gray-400">
                              {tag}
                            </Badge>
                          ))}
                          {contest.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                              +{contest.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Prizes */}
                      {contest.prizes.length > 0 && (
                        <div className="bg-gray-700/30 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Award size={14} className="text-yellow-400" />
                            <span className="text-sm font-medium text-white">Prizes</span>
                          </div>
                          <div className="text-xs text-gray-300">
                            🥇 {contest.prizes[0]?.description}
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <Link to={`/contests/${contest._id}`} className="block">
                        <Button 
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                          variant="default"
                        >
                          {contest.status === 'active' ? 'Join Contest' : 'View Details'}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
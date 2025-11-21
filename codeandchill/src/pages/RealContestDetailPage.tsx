import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContestTimer } from '@/components/contest/ContestTimer';
import { 
  ArrowLeft, 
  Users, 
  Trophy, 
  Clock, 
  CheckCircle,
  Lock,
  Play
} from 'lucide-react';

interface Contest {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'upcoming' | 'active' | 'completed';
  participants: string[];
  problems: Array<{
    problemId: {
      _id: string;
      title: string;
      difficulty: string;
    };
    points: number;
    order: number;
  }>;
  rules: string;
  prizes: Array<{
    position: number;
    description: string;
    points?: number;
  }>;
  maxParticipants?: number;
  isPublic: boolean;
  tags: string[];
}

export const RealContestDetailPage: React.FC = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchContestDetails();
  }, [contestId]);

  const fetchContestDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/contests/${contestId}`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContest(data);
        
        // Check if user is registered
        if (token) {
          const userId = JSON.parse(atob(token.split('.')[1])).id;
          setIsRegistered(data.participants.includes(userId));
        }
      }
    } catch (error) {
      console.error('Error fetching contest:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setRegistering(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/contests/${contestId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Successfully registered for contest!');
        setIsRegistered(true);
        fetchContestDetails();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to register');
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('Failed to register for contest');
    } finally {
      setRegistering(false);
    }
  };

  const handleJoinContest = () => {
    if (!isRegistered) {
      alert('You must register for this contest before joining!');
      return;
    }
    if (contest?.status !== 'active') {
      alert('Contest is not active yet!');
      return;
    }
    navigate(`/contests/${contestId}/compete`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Upcoming</Badge>;
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Completed</Badge>;
      default:
        return null;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'hard':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-64"></div>
            <div className="h-64 bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto text-center py-20">
          <h1 className="text-2xl font-bold text-white mb-4">Contest Not Found</h1>
          <Link to="/contests">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Browse Contests
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/contests" 
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Contests
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{contest.title}</h1>
                {getStatusBadge(contest.status)}
                {isRegistered && (
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    <CheckCircle size={14} className="mr-1" />
                    Registered
                  </Badge>
                )}
              </div>
              <p className="text-gray-300 text-lg mb-4">{contest.description}</p>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{contest.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{contest.participants.length} registered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy size={16} />
                  <span>{contest.problems.length} problems</span>
                </div>
              </div>
            </div>

            {/* Timer */}
            <ContestTimer 
              startTime={contest.startTime}
              endTime={contest.endTime}
              status={contest.status}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {contest.status === 'upcoming' && !isRegistered && (
              <Button
                onClick={handleRegister}
                disabled={registering}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {registering ? 'Registering...' : 'Register for Contest'}
              </Button>
            )}
            
            {contest.status === 'active' && (
              <Button
                onClick={handleJoinContest}
                disabled={!isRegistered}
                className="bg-green-600 hover:bg-green-700"
              >
                {isRegistered ? (
                  <>
                    <Play size={16} className="mr-2" />
                    Join Contest
                  </>
                ) : (
                  <>
                    <Lock size={16} className="mr-2" />
                    Registration Required
                  </>
                )}
              </Button>
            )}

            {contest.status === 'completed' && (
              <Button
                onClick={() => navigate(`/contests/${contestId}/leaderboard`)}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Trophy size={16} className="mr-2" />
                View Leaderboard
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Problems */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy size={20} />
                  Problems ({contest.problems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contest.problems.sort((a, b) => a.order - b.order).map((problem, index) => (
                    <div 
                      key={problem.problemId._id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30 border border-gray-600 hover:border-purple-500/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{problem.problemId.title}</h4>
                          <span className={`text-sm ${getDifficultyColor(problem.problemId.difficulty)}`}>
                            {problem.problemId.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-purple-400 font-semibold">{problem.points} pts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rules */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Contest Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 whitespace-pre-line">{contest.rules}</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contest Info */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Contest Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-400 mb-1">Start Time</div>
                  <div className="text-white font-medium">
                    {new Date(contest.startTime).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">End Time</div>
                  <div className="text-white font-medium">
                    {new Date(contest.endTime).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Duration</div>
                  <div className="text-white font-medium">{contest.duration} minutes</div>
                </div>
              </CardContent>
            </Card>

            {/* Prizes */}
            {contest.prizes.length > 0 && (
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Trophy size={18} className="text-yellow-400" />
                    Prizes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {contest.prizes.map((prize, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-yellow-400 font-semibold">#{prize.position}</span>
                        <span>{prize.description}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {contest.tags.length > 0 && (
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {contest.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                        {tag}
                      </Badge>
                    ))}
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

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award, TrendingUp, Users, Clock } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import { motion, AnimatePresence } from 'framer-motion';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  totalScore: number;
  totalPenalty: number;
  problemsSolved: number;
  lastSubmissionTime: Date;
  trend?: 'up' | 'down' | 'same';
  previousRank?: number;
}

interface LiveLeaderboardProps {
  contestId?: string;
  type?: 'contest' | 'global' | 'problems';
  maxEntries?: number;
  className?: string;
}

export const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({
  contestId,
  type = 'global',
  maxEntries = 10,
  className = ''
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { socket, connected } = useSocket({ autoConnect: true });

  // Fetch initial leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const endpoint = contestId 
          ? `/api/realtime/leaderboard/live/${contestId}`
          : `/api/leaderboard/${type}`;
        
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          setLeaderboard(data.leaderboard.slice(0, maxEntries));
          setLastUpdated(new Date(data.lastUpdated));
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [contestId, type, maxEntries]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!socket || !connected) return;

    if (contestId) {
      socket.emit('subscribe-leaderboard', { contestId });
    }

    const handleLeaderboardUpdate = (data: any) => {
      const newLeaderboard = data.leaderboard.slice(0, maxEntries);
      
      // Calculate trends
      const updatedLeaderboard = newLeaderboard.map((entry: LeaderboardEntry) => {
        const oldEntry = leaderboard.find(old => old.userId === entry.userId);
        let trend: 'up' | 'down' | 'same' = 'same';
        
        if (oldEntry) {
          if (entry.rank < oldEntry.rank) trend = 'up';
          else if (entry.rank > oldEntry.rank) trend = 'down';
        }
        
        return {
          ...entry,
          trend,
          previousRank: oldEntry?.rank
        };
      });
      
      setLeaderboard(updatedLeaderboard);
      setLastUpdated(new Date(data.timestamp));
    };

    socket.on('leaderboard-update', handleLeaderboardUpdate);

    return () => {
      socket.off('leaderboard-update', handleLeaderboardUpdate);
      if (contestId) {
        socket.emit('unsubscribe-leaderboard', { contestId });
      }
    };
  }, [socket, connected, contestId, leaderboard, maxEntries]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Live Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
                <div className="w-16 h-6 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Live Leaderboard</span>
            {connected && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            )}
          </CardTitle>
          {lastUpdated && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Updated {formatTime(lastUpdated)}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {leaderboard.map((entry, index) => (
              <motion.div
                key={entry.userId}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  entry.trend === 'up' 
                    ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800' 
                    : entry.trend === 'down'
                    ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800'
                    : 'bg-muted/30 hover:bg-muted/50'
                }`}
              >
                {/* Rank */}
                <div className="flex items-center space-x-2 w-12">
                  {getRankIcon(entry.rank)}
                  {getTrendIcon(entry.trend)}
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-3 flex-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={entry.avatar} />
                    <AvatarFallback>
                      {entry.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {entry.username}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{entry.problemsSolved} solved</span>
                      {entry.totalPenalty > 0 && (
                        <span>• {entry.totalPenalty}min penalty</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <Badge 
                    variant={entry.rank <= 3 ? "default" : "secondary"}
                    className="font-mono"
                  >
                    {entry.totalScore}
                  </Badge>
                  {entry.trend && entry.previousRank && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {entry.trend === 'up' ? '↑' : '↓'} from #{entry.previousRank}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No participants yet</p>
          </div>
        )}

        {/* Live indicator */}
        {connected && (
          <div className="flex items-center justify-center mt-4 pt-4 border-t">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Live updates enabled</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveLeaderboard;
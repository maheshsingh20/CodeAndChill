import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, Code, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SolvedProblem {
  problemId: {
    _id: string;
    title: string;
    slug: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topic: string;
  };
  solvedAt: string;
  bestScore: number;
  attempts: number;
  language: string;
  executionTime: number;
}

interface SolvedProblemsData {
  stats: {
    total: number;
    easy: number;
    medium: number;
    hard: number;
  };
  problems: {
    Easy: SolvedProblem[];
    Medium: SolvedProblem[];
    Hard: SolvedProblem[];
  };
}

export const SolvedProblems: React.FC = () => {
  const [data, setData] = useState<SolvedProblemsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSolvedProblems();
  }, []);

  const fetchSolvedProblems = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/user/solved-problems', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch solved problems');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatExecutionTime = (time: number) => {
    if (time < 1000) {
      return `${time.toFixed(0)}ms`;
    }
    return `${(time / 1000).toFixed(2)}s`;
  };

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Solved Problems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-700 rounded"></div>
              <div className="h-3 bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Solved Problems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-400">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const renderProblemList = (problems: SolvedProblem[], difficulty: string) => {
    if (problems.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No {difficulty.toLowerCase()} problems solved yet</p>
          <p className="text-sm mt-2">Start solving problems to see them here!</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {problems.map((problem) => (
          <Card key={problem.problemId._id} className="bg-gray-900 border-gray-600 hover:border-gray-500 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <Link 
                      to={`/solve/${problem.problemId._id}`}
                      className="text-white hover:text-blue-400 font-medium transition-colors"
                    >
                      {problem.problemId.title}
                    </Link>
                    <Badge className={getDifficultyColor(problem.problemId.difficulty)}>
                      {problem.problemId.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Solved {formatDate(problem.solvedAt)}
                    </span>
                    <span>Topic: {problem.problemId.topic}</span>
                    <span>Language: {problem.language}</span>
                  </div>
                </div>
                
                <div className="text-right text-sm">
                  <div className="text-green-400 font-medium">
                    {problem.bestScore}% Score
                  </div>
                  <div className="text-gray-400">
                    {formatExecutionTime(problem.executionTime)}
                  </div>
                  <div className="text-gray-500">
                    {problem.attempts} attempt{problem.attempts !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Solved Problems
        </CardTitle>
        <div className="flex gap-4 text-sm">
          <span className="text-gray-300">
            Total: <span className="text-white font-medium">{data.stats.total}</span>
          </span>
          <span className="text-green-400">
            Easy: <span className="font-medium">{data.stats.easy}</span>
          </span>
          <span className="text-yellow-400">
            Medium: <span className="font-medium">{data.stats.medium}</span>
          </span>
          <span className="text-red-400">
            Hard: <span className="font-medium">{data.stats.hard}</span>
          </span>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-gray-600">
              All ({data.stats.total})
            </TabsTrigger>
            <TabsTrigger value="easy" className="data-[state=active]:bg-green-600">
              Easy ({data.stats.easy})
            </TabsTrigger>
            <TabsTrigger value="medium" className="data-[state=active]:bg-yellow-600">
              Medium ({data.stats.medium})
            </TabsTrigger>
            <TabsTrigger value="hard" className="data-[state=active]:bg-red-600">
              Hard ({data.stats.hard})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <div className="space-y-6">
              {data.stats.easy > 0 && (
                <div>
                  <h4 className="text-green-400 font-medium mb-3 flex items-center gap-2">
                    Easy Problems ({data.stats.easy})
                  </h4>
                  {renderProblemList(data.problems.Easy, 'Easy')}
                </div>
              )}
              
              {data.stats.medium > 0 && (
                <div>
                  <h4 className="text-yellow-400 font-medium mb-3 flex items-center gap-2">
                    Medium Problems ({data.stats.medium})
                  </h4>
                  {renderProblemList(data.problems.Medium, 'Medium')}
                </div>
              )}
              
              {data.stats.hard > 0 && (
                <div>
                  <h4 className="text-red-400 font-medium mb-3 flex items-center gap-2">
                    Hard Problems ({data.stats.hard})
                  </h4>
                  {renderProblemList(data.problems.Hard, 'Hard')}
                </div>
              )}
              
              {data.stats.total === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No problems solved yet</h3>
                  <p className="mb-4">Start your coding journey by solving your first problem!</p>
                  <Link 
                    to="/problems" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Problems
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="easy" className="mt-4">
            {renderProblemList(data.problems.Easy, 'Easy')}
          </TabsContent>
          
          <TabsContent value="medium" className="mt-4">
            {renderProblemList(data.problems.Medium, 'Medium')}
          </TabsContent>
          
          <TabsContent value="hard" className="mt-4">
            {renderProblemList(data.problems.Hard, 'Hard')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
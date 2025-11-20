import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContestService, Contest, ContestProblem, ContestSubmission } from '@/services/contestService';
import { useUser } from '@/contexts/UserContext';
import { Trophy, Clock, Send, CheckCircle, XCircle, AlertTriangle, Code, Target, Users } from 'lucide-react';

export const ContestCompetePage: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [contest, setContest] = useState<Contest | null>(null);
  const [problems, setProblems] = useState<ContestProblem[]>([]);
  const [submissions, setSubmissions] = useState<ContestSubmission[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<ContestProblem | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('problem');

  useEffect(() => {
    if (contestId) {
      fetchContestData();
      // Refresh data every 30 seconds
      const interval = setInterval(fetchContestData, 30000);
      return () => clearInterval(interval);
    }
  }, [contestId]);

  useEffect(() => {
    if (problems.length > 0 && !selectedProblem) {
      setSelectedProblem(problems[0]);
    }
  }, [problems]);

  const fetchContestData = async () => {
    try {
      setLoading(true);
      const [contestData, problemsData, submissionsData] = await Promise.all([
        ContestService.getContest(contestId!),
        ContestService.getContestProblems(contestId!),
        ContestService.getUserSubmissions(contestId!)
      ]);
      
      setContest(contestData);
      setProblems(problemsData.problems);
      setSubmissions(submissionsData);
    } catch (error: any) {
      console.error('Error fetching contest data:', error);
      if (error.message.includes('Not registered')) {
        navigate(`/contests/${contestId}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedProblem || !code.trim()) {
      alert('Please select a problem and write some code');
      return;
    }

    try {
      setSubmitting(true);
      const result = await ContestService.submitSolution(
        contestId!,
        selectedProblem._id,
        code,
        language
      );
      
      // Refresh submissions
      const updatedSubmissions = await ContestService.getUserSubmissions(contestId!);
      setSubmissions(updatedSubmissions);
      
      // Show result
      alert(`Submission ${result.status}! Score: ${result.score}/100`);
    } catch (error: any) {
      console.error('Submission failed:', error);
      alert(error.message || 'Failed to submit solution');
    } finally {
      setSubmitting(false);
    }
  };

  const getSubmissionIcon = (status: ContestSubmission['status']) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="text-green-400" size={16} />;
      case 'wrong_answer': return <XCircle className="text-red-400" size={16} />;
      case 'time_limit_exceeded': return <Clock className="text-yellow-400" size={16} />;
      case 'runtime_error': return <AlertTriangle className="text-orange-400" size={16} />;
      case 'compilation_error': return <XCircle className="text-purple-400" size={16} />;
      case 'pending': return <Clock className="text-blue-400" size={16} />;
      default: return <AlertTriangle className="text-gray-400" size={16} />;
    }
  };

  const getProblemStatus = (problem: ContestProblem) => {
    const problemSubmissions = submissions.filter(s => s.problemId === problem._id);
    const accepted = problemSubmissions.find(s => s.status === 'accepted');
    
    if (accepted) return { status: 'solved', color: 'text-green-400', icon: '✓' };
    if (problemSubmissions.length > 0) return { status: 'attempted', color: 'text-yellow-400', icon: '○' };
    return { status: 'unsolved', color: 'text-gray-400', icon: '○' };
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-96"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-96 bg-gray-800 rounded-lg"></div>
              <div className="lg:col-span-2 h-96 bg-gray-800 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!contest || !user) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto text-center py-20">
          <AlertTriangle className="mx-auto mb-4 text-red-400" size={48} />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-6">You must be registered for this contest to compete.</p>
          <Button onClick={() => navigate(`/contests/${contestId}`)} className="bg-purple-600 hover:bg-purple-700">
            Back to Contest
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate(`/contests/${contestId}`)}
                className="text-gray-400 hover:text-white"
              >
                ← Back to Contest
              </Button>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                COMPETING
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span className="font-mono">
                  {ContestService.formatTimeRemaining(contest.endTime)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy size={16} />
                <span>{problems.filter(p => getProblemStatus(p).status === 'solved').length}/{problems.length}</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white">{contest.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Problems Sidebar */}
          <div className="space-y-4">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Target size={20} />
                  Problems
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {problems.map((problem) => {
                  const status = getProblemStatus(problem);
                  return (
                    <div
                      key={problem._id}
                      onClick={() => setSelectedProblem(problem)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedProblem?._id === problem._id
                          ? 'bg-purple-600/30 border border-purple-500/50'
                          : 'bg-gray-700/30 hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`font-mono ${status.color}`}>{status.icon}</span>
                          <div>
                            <h4 className="font-medium text-white">Problem {problem.order}</h4>
                            <p className="text-sm text-gray-400">{problem.points} points</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs border-gray-600">
                          {problem.difficulty}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Recent Submissions */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Recent Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {submissions.slice(0, 10).map((submission) => (
                    <div key={submission._id} className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
                      <div className="flex items-center gap-2">
                        {getSubmissionIcon(submission.status)}
                        <span className="text-sm text-white">P{problems.find(p => p._id === submission.problemId)?.order}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white">{submission.score}/100</p>
                        <p className="text-xs text-gray-400">
                          {new Date(submission.submittedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {submissions.length === 0 && (
                    <p className="text-gray-400 text-sm text-center py-4">No submissions yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {selectedProblem && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-gray-800/50 border-gray-700 mb-4">
                  <TabsTrigger value="problem" className="data-[state=active]:bg-purple-600">
                    Problem
                  </TabsTrigger>
                  <TabsTrigger value="solution" className="data-[state=active]:bg-purple-600">
                    Solution
                  </TabsTrigger>
                </TabsList>

                {/* Problem Tab */}
                <TabsContent value="problem">
                  <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">
                          Problem {selectedProblem.order}: {selectedProblem.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-600/20 text-purple-400">
                            {selectedProblem.points} points
                          </Badge>
                          <Badge variant="outline" className="border-gray-600">
                            {selectedProblem.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="prose prose-invert max-w-none">
                        <div className="text-gray-300 whitespace-pre-line">
                          {selectedProblem.description}
                        </div>
                      </div>

                      {/* Test Cases */}
                      {selectedProblem.testCases.length > 0 && (
                        <div>
                          <h4 className="text-white font-semibold mb-3">Sample Test Cases</h4>
                          <div className="space-y-4">
                            {selectedProblem.testCases.slice(0, 2).map((testCase, index) => (
                              <div key={index} className="bg-gray-700/30 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h5 className="text-sm font-medium text-gray-400 mb-2">Input:</h5>
                                    <pre className="bg-gray-900 p-2 rounded text-sm text-gray-300">
                                      {testCase.input}
                                    </pre>
                                  </div>
                                  <div>
                                    <h5 className="text-sm font-medium text-gray-400 mb-2">Expected Output:</h5>
                                    <pre className="bg-gray-900 p-2 rounded text-sm text-gray-300">
                                      {testCase.expectedOutput}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Solution Tab */}
                <TabsContent value="solution">
                  <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                          <Code size={20} />
                          Solution Editor
                        </CardTitle>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="javascript">JavaScript</SelectItem>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="java">Java</SelectItem>
                            <SelectItem value="cpp">C++</SelectItem>
                            <SelectItem value="typescript">TypeScript</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative">
                        <textarea
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder={`Write your ${language} solution here...`}
                          className="w-full h-96 bg-gray-900 border border-gray-600 rounded-lg p-4 text-white font-mono text-sm resize-none focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                          Problem {selectedProblem.order} • {selectedProblem.attempts} attempts
                        </div>
                        <Button
                          onClick={handleSubmit}
                          disabled={submitting || !code.trim()}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {submitting ? (
                            'Submitting...'
                          ) : (
                            <>
                              <Send className="mr-2" size={16} />
                              Submit Solution
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
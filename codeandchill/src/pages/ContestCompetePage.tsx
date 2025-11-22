import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContestTimer } from '@/components/contest/ContestTimer';
import { 
  Trophy, 
  Code, 
  Send, 
  CheckCircle, 
  XCircle,
  Loader2
} from 'lucide-react';
import Editor from '@monaco-editor/react';

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  description: string;
  points: number;
  order: number;
  attempts: number;
  solved: boolean;
  bestScore: number;
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
}

interface Contest {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  duration: number;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  totalScore: number;
  problemsSolved: number;
  totalPenalty: number;
  lastSubmissionTime: string;
}

const LANGUAGE_IDS: { [key: string]: number } = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50
};

export const ContestCompetePage: React.FC = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  
  const [contest, setContest] = useState<Contest | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [code, setCode] = useState('// Write your code here\n');
  const [language, setLanguage] = useState('javascript');
  const [submitting, setSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContestData();
    fetchLeaderboard();
    
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [contestId]);

  useEffect(() => {
    if (problems.length > 0 && !selectedProblem) {
      setSelectedProblem(problems[0]);
    }
  }, [problems]);

  const fetchContestData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const contestRes = await fetch(`http://localhost:3001/api/contests/${contestId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (contestRes.ok) {
        const contestData = await contestRes.json();
        setContest(contestData);
        
        if (contestData.status !== 'active') {
          alert('Contest is not active!');
          navigate(`/contests/${contestId}`);
          return;
        }
      }
      
      const problemsRes = await fetch(`http://localhost:3001/api/contests/${contestId}/problems`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (problemsRes.ok) {
        const data = await problemsRes.json();
        setProblems(data.problems);
      } else {
        const error = await problemsRes.json();
        alert(error.error || 'Failed to load problems');
        navigate(`/contests/${contestId}`);
      }
    } catch (error) {
      console.error('Error fetching contest data:', error);
      alert('Failed to load contest');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/contests/${contestId}/leaderboard`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const executeCode = async (testCase: any) => {
    try {
      const apiKey = import.meta.env.VITE_RAPID_API_KEY;
      const apiHost = import.meta.env.VITE_RAPID_API_HOST;
      
      const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost
        },
        body: JSON.stringify({
          source_code: code,
          language_id: LANGUAGE_IDS[language],
          stdin: testCase.input,
          expected_output: testCase.expectedOutput
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      }
      return null;
    } catch (error) {
      console.error('Error executing code:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!selectedProblem) return;

    setSubmitting(true);
    setTestResults(null);

    try {
      const results: Array<{
        input: string;
        expectedOutput: string;
        actualOutput: string;
        passed: boolean;
        status: string;
        time: any;
        memory: any;
      }> = [];
      let passedCount = 0;

      for (const testCase of selectedProblem.testCases) {
        const result = await executeCode(testCase);
        
        if (result) {
          const passed = result.status?.id === 3;
          if (passed) passedCount++;
          
          results.push({
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: result.stdout || result.stderr || 'No output',
            passed,
            status: result.status?.description || 'Unknown',
            time: result.time,
            memory: result.memory
          });
        }
      }

      setTestResults({
        results,
        passedCount,
        totalCount: selectedProblem.testCases.length,
        allPassed: passedCount === selectedProblem.testCases.length
      });

      const token = localStorage.getItem('authToken');
      const submitResponse = await fetch(`http://localhost:3001/api/contests/${contestId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          problemId: selectedProblem._id,
          code,
          language,
          testCasesPassed: passedCount,
          totalTestCases: selectedProblem.testCases.length
        })
      });

      if (submitResponse.ok) {
        const submitData = await submitResponse.json();
        alert(`Submission successful! Score: ${submitData.score}/100`);
        
        fetchContestData();
        fetchLeaderboard();
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Failed to submit solution');
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'hard': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Trophy className="text-yellow-400" size={24} />
              <div>
                <h1 className="text-xl font-bold text-white">{contest?.title}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    LIVE
                  </Badge>
                  <span>•</span>
                  <span>{problems.length} Problems</span>
                </div>
              </div>
            </div>
            
            {contest && (
              <ContestTimer
                startTime={contest.startTime}
                endTime={contest.endTime}
                status={contest.status as any}
              />
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white text-lg">Problems</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {problems.map((problem, index) => (
                  <div
                    key={problem._id}
                    onClick={() => setSelectedProblem(problem)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedProblem?._id === problem._id
                        ? 'bg-purple-600 border-purple-500'
                        : 'bg-gray-700/30 border-gray-600 hover:border-purple-500/50'
                    } border`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">
                        {index + 1}. {problem.title}
                      </span>
                      {problem.solved && (
                        <CheckCircle size={16} className="text-green-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <Badge className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                      <span className="text-purple-400 font-semibold">{problem.points} pts</span>
                    </div>
                    {problem.attempts > 0 && (
                      <div className="text-xs text-gray-400 mt-1">
                        {problem.attempts} attempt{problem.attempts !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="col-span-6">
            <Tabs defaultValue="problem" className="space-y-4">
              <TabsList className="bg-gray-800/50 border border-gray-700">
                <TabsTrigger value="problem">Problem</TabsTrigger>
                <TabsTrigger value="submissions">My Submissions</TabsTrigger>
              </TabsList>

              <TabsContent value="problem">
                {selectedProblem && (
                  <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-2xl">
                          {selectedProblem.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getDifficultyColor(selectedProblem.difficulty)}>
                            {selectedProblem.difficulty}
                          </Badge>
                          <span className="text-purple-400 font-semibold text-lg">
                            {selectedProblem.points} points
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-gray-300 whitespace-pre-line">
                        {selectedProblem.description}
                      </div>

                      <div>
                        <h3 className="text-white font-semibold mb-3">Sample Test Cases</h3>
                        <div className="space-y-3">
                          {selectedProblem.testCases.slice(0, 2).map((tc, index) => (
                            <div key={index} className="bg-gray-900/50 p-4 rounded-lg">
                              <div className="mb-2">
                                <span className="text-gray-400 text-sm">Input:</span>
                                <pre className="text-white mt-1 font-mono text-sm">{tc.input}</pre>
                              </div>
                              <div>
                                <span className="text-gray-400 text-sm">Expected Output:</span>
                                <pre className="text-white mt-1 font-mono text-sm">{tc.expectedOutput}</pre>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="submissions">
                <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Submission History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">Your submissions will appear here</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 mt-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Code size={20} />
                    Code Editor
                  </CardTitle>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-1"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-700 rounded-lg overflow-hidden">
                  <Editor
                    height="400px"
                    language={language}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true
                    }}
                  />
                </div>

                <div className="flex gap-3 mt-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={16} className="mr-2" />
                        Submit Solution
                      </>
                    )}
                  </Button>
                </div>

                {testResults && (
                  <div className="mt-4 space-y-3">
                    <div className={`p-4 rounded-lg ${
                      testResults.allPassed 
                        ? 'bg-green-500/10 border border-green-500/30' 
                        : 'bg-red-500/10 border border-red-500/30'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {testResults.allPassed ? (
                          <CheckCircle className="text-green-400" size={20} />
                        ) : (
                          <XCircle className="text-red-400" size={20} />
                        )}
                        <span className={`font-semibold ${
                          testResults.allPassed ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {testResults.passedCount}/{testResults.totalCount} Test Cases Passed
                        </span>
                      </div>
                    </div>

                    {testResults.results.map((result: any, index: number) => (
                      <div key={index} className="bg-gray-900/50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">Test Case {index + 1}</span>
                          {result.passed ? (
                            <CheckCircle className="text-green-400" size={16} />
                          ) : (
                            <XCircle className="text-red-400" size={16} />
                          )}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-400">Status:</span>
                            <span className={`ml-2 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                              {result.status}
                            </span>
                          </div>
                          {!result.passed && (
                            <>
                              <div>
                                <span className="text-gray-400">Expected:</span>
                                <pre className="text-white mt-1 font-mono">{result.expectedOutput}</pre>
                              </div>
                              <div>
                                <span className="text-gray-400">Got:</span>
                                <pre className="text-white mt-1 font-mono">{result.actualOutput}</pre>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="col-span-3">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Trophy className="text-yellow-400" size={20} />
                  Live Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboard.slice(0, 10).map((entry, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        index === 0 ? 'bg-yellow-500/10 border border-yellow-500/30' :
                        index === 1 ? 'bg-gray-400/10 border border-gray-400/30' :
                        index === 2 ? 'bg-orange-500/10 border border-orange-500/30' :
                        'bg-gray-700/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${
                            index === 0 ? 'text-yellow-400' :
                            index === 1 ? 'text-gray-300' :
                            index === 2 ? 'text-orange-400' :
                            'text-gray-400'
                          }`}>
                            #{entry.rank}
                          </span>
                          <span className="text-white font-medium truncate">
                            {entry.username}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-purple-400 font-semibold">
                          {entry.totalScore} pts
                        </span>
                        <span className="text-gray-400">
                          {entry.problemsSolved} solved
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

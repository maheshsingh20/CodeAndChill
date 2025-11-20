import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Play, RotateCcw, Save, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  testCases: TestCase[];
  starterCode: string;
  language: string;
}

interface ProblemSolverProps {
  problem: Problem;
  onSubmit: (code: string, results: any) => void;
}

export const ProblemSolver: React.FC<ProblemSolverProps> = ({
  problem,
  onSubmit
}) => {
  const [code, setCode] = useState(problem.starterCode);
  const [language, setLanguage] = useState(problem.language);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('problem');
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'typescript', label: 'TypeScript' }
  ];

  const runCode = async () => {
    setIsRunning(true);
    setActiveTab('results');
    
    try {
      const startTime = Date.now();
      
      // Simulate code execution (replace with actual execution service)
      const results = await Promise.all(
        problem.testCases.map(async (testCase, index) => {
          // Simulate execution delay
          await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
          
          // Mock execution result
          const passed = Math.random() > 0.3; // 70% pass rate for demo
          return {
            testCaseId: testCase.id,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: passed ? testCase.expectedOutput : 'Wrong output',
            passed,
            executionTime: Math.floor(Math.random() * 100) + 10
          };
        })
      );
      
      const endTime = Date.now();
      setExecutionTime(endTime - startTime);
      setTestResults(results);
      
    } catch (error) {
      console.error('Execution error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const submitSolution = () => {
    const passedTests = testResults.filter(result => result.passed).length;
    const totalTests = testResults.length;
    
    onSubmit(code, {
      passed: passedTests === totalTests,
      passedTests,
      totalTests,
      executionTime,
      testResults
    });
  };

  const resetCode = () => {
    setCode(problem.starterCode);
    setTestResults([]);
    setExecutionTime(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const passedTests = testResults.filter(result => result.passed).length;
  const totalTests = testResults.length;
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-screen">
      {/* Problem Description */}
      <div className="flex flex-col">
        <Card className="flex-1 p-6 bg-gray-900/50 backdrop-blur-sm border-gray-700">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="problem">Problem</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="problem" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">{problem.title}</h2>
                  <Badge className={`${getDifficultyColor(problem.difficulty)} text-white`}>
                    {problem.difficulty}
                  </Badge>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <div 
                    className="text-gray-300"
                    dangerouslySetInnerHTML={{ __html: problem.description }}
                  />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Test Cases</h3>
                  {problem.testCases.filter(tc => !tc.isHidden).map((testCase, index) => (
                    <Card key={testCase.id} className="p-3 bg-gray-800 border-gray-600">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-300">Example {index + 1}:</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Input:</p>
                            <code className="text-sm bg-gray-700 p-2 rounded block text-green-400">
                              {testCase.input}
                            </code>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Output:</p>
                            <code className="text-sm bg-gray-700 p-2 rounded block text-blue-400">
                              {testCase.expectedOutput}
                            </code>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="results" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Test Results</h3>
                  {totalTests > 0 && (
                    <Badge variant={successRate === 100 ? "default" : "destructive"}>
                      {passedTests}/{totalTests} Passed
                    </Badge>
                  )}
                </div>
                
                {totalTests > 0 && (
                  <div className="space-y-2">
                    <Progress value={successRate} className="w-full" />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Success Rate: {successRate.toFixed(1)}%</span>
                      {executionTime && <span>Execution Time: {executionTime}ms</span>}
                    </div>
                  </div>
                )}
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {testResults.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                      Run your code to see test results
                    </p>
                  ) : (
                    testResults.map((result, index) => (
                      <Card key={result.testCaseId} className="p-3 bg-gray-800 border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-300">
                            Test Case {index + 1}
                          </span>
                          <div className="flex items-center space-x-2">
                            {result.passed ? (
                              <CheckCircle size={16} className="text-green-500" />
                            ) : (
                              <XCircle size={16} className="text-red-500" />
                            )}
                            <span className="text-xs text-gray-400">
                              {result.executionTime}ms
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2 text-xs">
                          <div>
                            <span className="text-gray-400">Input: </span>
                            <code className="text-green-400">{result.input}</code>
                          </div>
                          <div>
                            <span className="text-gray-400">Expected: </span>
                            <code className="text-blue-400">{result.expectedOutput}</code>
                          </div>
                          <div>
                            <span className="text-gray-400">Actual: </span>
                            <code className={result.passed ? "text-green-400" : "text-red-400"}>
                              {result.actualOutput}
                            </code>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      {/* Code Editor */}
      <div className="flex flex-col">
        <Card className="flex-1 p-4 bg-gray-900/50 backdrop-blur-sm border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-800 text-white text-sm rounded px-3 py-1 border border-gray-600"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={resetCode}
                variant="outline"
                size="sm"
                className="border-gray-600"
              >
                <RotateCcw size={16} className="mr-1" />
                Reset
              </Button>
              <Button
                onClick={runCode}
                disabled={isRunning}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                {isRunning ? (
                  <Clock size={16} className="mr-1 animate-spin" />
                ) : (
                  <Play size={16} className="mr-1" />
                )}
                {isRunning ? 'Running...' : 'Run'}
              </Button>
              {totalTests > 0 && (
                <Button
                  onClick={submitSolution}
                  disabled={successRate !== 100}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Save size={16} className="mr-1" />
                  Submit
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex-1 border border-gray-600 rounded-lg overflow-hidden">
            <Editor
              height="calc(100vh - 200px)"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on'
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};
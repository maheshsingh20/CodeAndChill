import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Flag, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Trophy,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Editor } from '@monaco-editor/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

interface Question {
  id: string;
  question: string;
  type: 'multiple_choice' | 'code' | 'true_false';
  options?: string[];
  points: number;
  codeTemplate?: string;
}

interface SkillTest {
  _id: string;
  skillName: string;
  title: string;
  description: string;
  difficulty: string;
  duration: number;
  passingScore: number;
  questions: Question[];
  alreadyPassed: boolean;
}

interface TestResults {
  passed: boolean;
  score: number;
  totalPoints: number;
  percentage: number;
  skillAwarded: boolean;
  skillName: string;
  questions: any[];
}

export const SkillTestTaking: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { refreshUser } = useUser();
  
  const [skillTest, setSkillTest] = useState<SkillTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: any }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime] = useState(Date.now());
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (testId) {
      fetchSkillTest();
    }
  }, [testId]);

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, showResults]);

  const fetchSkillTest = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/skill-tests/${testId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch skill test');
      
      const data = await response.json();
      setSkillTest(data);
      setTimeLeft(data.duration * 60); // Convert minutes to seconds
    } catch (error) {
      console.error('Error fetching skill test:', error);
      navigate('/skill-tests');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        questionId,
        answer,
        timeSpent: Math.floor((Date.now() - startTime) / 1000)
      }
    }));
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSubmitTest = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/skill-tests/${testId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          answers: Object.values(answers),
          timeSpent: Math.floor((Date.now() - startTime) / 1000),
          startedAt: new Date(startTime).toISOString()
        })
      });

      if (!response.ok) throw new Error('Failed to submit test');
      
      const results = await response.json();
      setTestResults(results);
      setShowResults(true);
      
      // Refresh user data if skill was awarded
      if (results.skillAwarded) {
        await refreshUser();
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Failed to submit test. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!skillTest) return 0;
    return (Object.keys(answers).length / skillTest.questions.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading skill test...</div>
      </div>
    );
  }

  if (!skillTest) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Skill test not found</div>
      </div>
    );
  }

  if (skillTest.alreadyPassed) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <Card className="max-w-md p-8 bg-gray-800 border-gray-700 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Already Passed!</h2>
          <p className="text-gray-400 mb-6">
            You have already passed the {skillTest.skillName} skill test.
          </p>
          <Button onClick={() => navigate('/skill-tests')} className="bg-purple-600 hover:bg-purple-700">
            Back to Skill Tests
          </Button>
        </Card>
      </div>
    );
  }

  if (showResults && testResults) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Results Header */}
          <Card className="p-8 bg-gray-800/50 backdrop-blur-sm border-gray-700 text-center">
            <div className="space-y-4">
              {testResults.passed ? (
                <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
              ) : (
                <XCircle className="mx-auto h-20 w-20 text-red-500" />
              )}
              
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {testResults.passed ? 'Congratulations!' : 'Test Complete'}
                </h1>
                <p className="text-gray-400">
                  {testResults.passed 
                    ? `You passed the ${testResults.skillName} skill test!`
                    : `You scored ${testResults.percentage}%. You need ${skillTest.passingScore}% to pass.`
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">{testResults.percentage}%</div>
                  <div className="text-sm text-gray-400">Score</div>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">
                    {testResults.score}/{testResults.totalPoints}
                  </div>
                  <div className="text-sm text-gray-400">Points</div>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">
                    {testResults.skillAwarded ? 'Yes' : 'No'}
                  </div>
                  <div className="text-sm text-gray-400">Skill Awarded</div>
                </div>
              </div>

              {testResults.skillAwarded && (
                <div className="p-4 bg-gradient-to-r from-green-900/30 to-green-800/20 border border-green-600 rounded-lg">
                  <Trophy className="mx-auto h-8 w-8 text-yellow-400 mb-2" />
                  <p className="text-green-300 font-semibold">
                    🎉 {testResults.skillName} skill has been added to your profile!
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Question Review */}
          <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Question Review</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {testResults.questions.map((question, index) => (
                <div key={question.id} className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-white">
                      {index + 1}. {question.question}
                    </h3>
                    {question.isCorrect ? (
                      <CheckCircle size={20} className="text-green-500 flex-shrink-0 ml-2" />
                    ) : (
                      <XCircle size={20} className="text-red-500 flex-shrink-0 ml-2" />
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Your answer: </span>
                      <span className={question.isCorrect ? 'text-green-400' : 'text-red-400'}>
                        {question.userAnswer || 'No answer'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Correct answer: </span>
                      <span className="text-green-400">{question.correctAnswer}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Points: </span>
                      <span className="text-white">
                        {question.earnedPoints}/{question.points}
                      </span>
                    </div>
                    {question.explanation && (
                      <div className="mt-2 p-2 bg-blue-900/30 border border-blue-500 rounded">
                        <span className="text-blue-300 text-sm">
                          <strong>Explanation:</strong> {question.explanation}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => navigate('/skill-tests')}
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              Back to Skill Tests
            </Button>
            <Button 
              onClick={() => navigate('/profile')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              View Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = skillTest.questions[currentQuestion];
  const isLastQuestion = currentQuestion === skillTest.questions.length - 1;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{skillTest.title}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <Badge className="bg-purple-600 text-white">
                  <Target size={12} className="mr-1" />
                  {skillTest.skillName}
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  {skillTest.difficulty}
                </Badge>
                <span className="text-gray-400 text-sm">
                  Question {currentQuestion + 1} of {skillTest.questions.length}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-2xl font-mono font-bold ${
                timeLeft < 300 ? 'text-red-400' : 'text-white'
              }`}>
                <Clock className="inline mr-2" size={20} />
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-400">
                {skillTest.passingScore}% required to pass
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <Progress value={getProgressPercentage()} className="w-full" />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>{Object.keys(answers).length} answered</span>
              <span>{flaggedQuestions.size} flagged</span>
            </div>
          </div>
        </Card>

        {/* Question */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-lg font-medium text-white pr-4">
                  {currentQ.question}
                </h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{currentQ.points} pts</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFlag(currentQ.id)}
                    className={flaggedQuestions.has(currentQ.id) ? 'text-yellow-400' : 'text-gray-400'}
                  >
                    <Flag size={16} />
                  </Button>
                </div>
              </div>

              {/* Answer Input */}
              <div className="space-y-4">
                {currentQ.type === 'multiple_choice' && (
                  <RadioGroup
                    value={answers[currentQ.id]?.answer?.toString()}
                    onValueChange={(value) => handleAnswerChange(currentQ.id, parseInt(value))}
                  >
                    {currentQ.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 rounded hover:bg-gray-700/50">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 text-gray-300 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQ.type === 'true_false' && (
                  <RadioGroup
                    value={answers[currentQ.id]?.answer?.toString()}
                    onValueChange={(value) => handleAnswerChange(currentQ.id, value === 'true')}
                  >
                    <div className="flex items-center space-x-2 p-3 rounded hover:bg-gray-700/50">
                      <RadioGroupItem value="true" id="true" />
                      <Label htmlFor="true" className="flex-1 text-gray-300 cursor-pointer">
                        True
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded hover:bg-gray-700/50">
                      <RadioGroupItem value="false" id="false" />
                      <Label htmlFor="false" className="flex-1 text-gray-300 cursor-pointer">
                        False
                      </Label>
                    </div>
                  </RadioGroup>
                )}

                {currentQ.type === 'code' && (
                  <div className="space-y-2">
                    <Label className="text-gray-300">Write your code:</Label>
                    <div className="border border-gray-600 rounded-lg overflow-hidden">
                      <Editor
                        height="300px"
                        defaultLanguage="javascript"
                        value={answers[currentQ.id]?.answer || currentQ.codeTemplate || ''}
                        onChange={(value) => handleAnswerChange(currentQ.id, value || '')}
                        theme="vs-dark"
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          lineNumbers: 'on',
                          automaticLayout: true
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Questions</h3>
              <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
                {skillTest.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-8 h-8 rounded text-sm font-medium ${
                      index === currentQuestion
                        ? 'bg-purple-600 text-white'
                        : answers[skillTest.questions[index].id]
                        ? 'bg-green-600 text-white'
                        : flaggedQuestions.has(skillTest.questions[index].id)
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 space-y-2 text-xs text-gray-400">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-600 rounded mr-2"></div>
                  Current
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-600 rounded mr-2"></div>
                  Answered
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-600 rounded mr-2"></div>
                  Flagged
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <Card className="p-4 bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="border-gray-600 text-gray-300"
            >
              <ArrowLeft size={16} className="mr-1" />
              Previous
            </Button>

            <div className="flex space-x-2">
              {timeLeft < 300 && (
                <div className="flex items-center text-red-400 text-sm">
                  <AlertTriangle size={16} className="mr-1" />
                  Less than 5 minutes remaining!
                </div>
              )}
            </div>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmitTest}
                disabled={isSubmitting || Object.keys(answers).length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Test'}
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestion(prev => Math.min(skillTest.questions.length - 1, prev + 1))}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Next
                <ArrowRight size={16} className="ml-1" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
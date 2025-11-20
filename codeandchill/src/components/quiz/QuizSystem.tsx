import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, ArrowRight, ArrowLeft, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  points: number;
}

interface QuizProps {
  quizId: string;
  title: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  onComplete: (results: QuizResults) => void;
}

interface QuizResults {
  score: number;
  totalPoints: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  answers: { [questionId: string]: number };
}

export const QuizSystem: React.FC<QuizProps> = ({
  quizId,
  title,
  questions,
  timeLimit,
  onComplete
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(timeLimit ? timeLimit * 60 : null);
  const [startTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
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

  const calculateResults = (): QuizResults => {
    let score = 0;
    let correctAnswers = 0;
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correctAnswer) {
        score += question.points;
        correctAnswers++;
      }
    });

    return {
      score,
      totalPoints,
      correctAnswers,
      totalQuestions: questions.length,
      timeSpent: Math.floor((Date.now() - startTime) / 1000),
      answers
    };
  };

  const handleSubmitQuiz = () => {
    const results = calculateResults();
    setIsCompleted(true);
    setShowResults(true);
    onComplete(results);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const answeredQuestions = Object.keys(answers).length;
    return (answeredQuestions / questions.length) * 100;
  };

  if (showResults) {
    const results = calculateResults();
    const percentage = (results.score / results.totalPoints) * 100;

    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gray-900/50 backdrop-blur-sm border-gray-700">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">Quiz Completed!</h2>
            <p className="text-gray-400">{title}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gray-800 border-gray-600">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">
                  {percentage.toFixed(1)}%
                </div>
                <p className="text-gray-400">Score</p>
              </div>
            </Card>

            <Card className="p-6 bg-gray-800 border-gray-600">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {results.correctAnswers}/{results.totalQuestions}
                </div>
                <p className="text-gray-400">Correct Answers</p>
              </div>
            </Card>

            <Card className="p-6 bg-gray-800 border-gray-600">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {formatTime(results.timeSpent)}
                </div>
                <p className="text-gray-400">Time Spent</p>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Review Answers</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <Card key={question.id} className="p-4 bg-gray-800 border-gray-600 text-left">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white">
                        {index + 1}. {question.question}
                      </h4>
                      {isCorrect ? (
                        <CheckCircle size={20} className="text-green-500 flex-shrink-0 ml-2" />
                      ) : (
                        <XCircle size={20} className="text-red-500 flex-shrink-0 ml-2" />
                      )}
                    </div>

                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isUserAnswer = userAnswer === optionIndex;
                        const isCorrectAnswer = optionIndex === question.correctAnswer;

                        return (
                          <div
                            key={optionIndex}
                            className={`p-2 rounded text-sm ${
                              isCorrectAnswer
                                ? 'bg-green-900/50 border border-green-500 text-green-300'
                                : isUserAnswer
                                ? 'bg-red-900/50 border border-red-500 text-red-300'
                                : 'bg-gray-700 text-gray-300'
                            }`}
                          >
                            {option}
                          </div>
                        );
                      })}
                    </div>

                    {question.explanation && (
                      <div className="mt-3 p-3 bg-blue-900/30 border border-blue-500 rounded">
                        <p className="text-sm text-blue-300">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = answers[currentQ.id] !== undefined;

  return (
    <Card className="max-w-4xl mx-auto p-6 bg-gray-900/50 backdrop-blur-sm border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {timeLeft !== null && (
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-gray-400" />
              <span className={`font-mono ${timeLeft < 300 ? 'text-red-400' : 'text-gray-300'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          )}
          
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

      {/* Progress */}
      <div className="mb-6">
        <Progress value={getProgressPercentage()} className="w-full" />
        <div className="flex justify-between text-sm text-gray-400 mt-1">
          <span>{Object.keys(answers).length} answered</span>
          <span>{flaggedQuestions.size} flagged</span>
        </div>
      </div>

      {/* Question */}
      <Card className="p-6 mb-6 bg-gray-800 border-gray-600">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-medium text-white pr-4">
            {currentQ.question}
          </h3>
          <Badge variant="secondary" className="flex-shrink-0">
            {currentQ.points} pts
          </Badge>
        </div>

        <RadioGroup
          value={answers[currentQ.id]?.toString()}
          onValueChange={(value) => handleAnswerSelect(currentQ.id, parseInt(value))}
        >
          {currentQ.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 p-3 rounded hover:bg-gray-700/50">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-1 text-gray-300 cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="border-gray-600"
        >
          <ArrowLeft size={16} className="mr-1" />
          Previous
        </Button>

        <div className="flex space-x-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 rounded text-sm font-medium ${
                index === currentQuestion
                  ? 'bg-purple-600 text-white'
                  : answers[questions[index].id] !== undefined
                  ? 'bg-green-600 text-white'
                  : flaggedQuestions.has(questions[index].id)
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-600 text-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {isLastQuestion ? (
          <Button
            onClick={handleSubmitQuiz}
            disabled={Object.keys(answers).length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
            disabled={!canProceed}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Next
            <ArrowRight size={16} className="ml-1" />
          </Button>
        )}
      </div>
    </Card>
  );
};
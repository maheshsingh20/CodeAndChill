import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LearningPathService } from '@/services/learningPathService';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  BookOpen,
  Code,
  CheckCircle,
  Clock,
  X,
  Volume2,
  Maximize,
  FileText,
  Award,
  Target
} from 'lucide-react';

interface CoursePlayerProps {
  course: any;
  pathId: string;
  onProgressUpdate: (courseId: string, progress: number, timeSpent: number) => void;
  onClose: () => void;
}

interface Lesson {
  id: string;
  title: string;
  duration: number;
  videoUrl?: string;
  content: string;
  codeExamples?: Array<{
    language: string;
    code: string;
    description: string;
  }>;
  quiz?: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  pathId,
  onProgressUpdate,
  onClose
}) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Extract lessons from course modules
  const lessons: Lesson[] = course.courseId?.modules?.flatMap((module: any) =>
    module.topics?.flatMap((topic: any) =>
      topic.subtopics?.map((subtopic: any) => ({
        id: subtopic.id,
        title: subtopic.title,
        duration: subtopic.duration || 15,
        videoUrl: subtopic.videoUrl,
        content: subtopic.content || '',
        codeExamples: subtopic.codeExamples || [],
        quiz: subtopic.quiz || []
      })) || []
    ) || []
  ) || [];

  const currentLesson = lessons[currentLessonIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    // Calculate progress based on completed lessons
    const progressPercentage = (completedLessons.size / lessons.length) * 100;
    setProgress(progressPercentage);

    // Update progress in parent component
    if (progressPercentage > 0) {
      onProgressUpdate(course.courseId._id, progressPercentage, Math.floor(timeSpent / 60));
    }
  }, [completedLessons, timeSpent, course.courseId._id, onProgressUpdate]);

  const handleLessonComplete = () => {
    if (currentLesson) {
      setCompletedLessons(prev => new Set([...prev, currentLesson.id]));

      // Auto-advance to next lesson
      if (currentLessonIndex < lessons.length - 1) {
        setTimeout(() => {
          setCurrentLessonIndex(prev => prev + 1);
        }, 1000);
      }
    }
  };

  const handleQuizSubmit = () => {
    if (!currentLesson?.quiz) return;

    let correct = 0;
    currentLesson.quiz.forEach((question, index) => {
      if (quizAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / currentLesson.quiz.length) * 100);
    setQuizScore(score);
    setShowQuizResults(true);

    // Mark lesson as complete if quiz passed (70% or higher)
    if (score >= 70) {
      handleLessonComplete();
    }
  };

  const nextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
      setQuizAnswers({});
      setShowQuizResults(false);
    }
  };

  const previousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
      setQuizAnswers({});
      setShowQuizResults(false);
    }
  };

  if (!currentLesson) {
    return (
      <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
        <CardContent className="py-20 text-center">
          <BookOpen size={64} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">No Lessons Available</h3>
          <p className="text-gray-400">This course doesn't have any lessons yet.</p>
          <Button onClick={onClose} className="mt-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
            Back to Course Overview
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                {course.courseId.title}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <span className="flex items-center gap-1">
                  <BookOpen size={16} />
                  Lesson {currentLessonIndex + 1} of {lessons.length}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
                </span>
                <Badge className="bg-purple-600/20 text-purple-300 border border-purple-500/30">
                  {Math.round(progress)}% Complete
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-gray-600 text-gray-400 hover:bg-gray-700"
            >
              <X size={16} />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Lesson Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Video Player (if video available) */}
          {currentLesson.videoUrl && (
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <CardContent className="p-0">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={currentLesson.videoUrl}
                    title={currentLesson.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>

                {/* Video Controls */}
                <div className="p-4 bg-gray-900/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                      </Button>
                      <span className="font-medium bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">{currentLesson.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Volume2 size={16} className="text-gray-400" />
                      <Maximize size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lesson Content */}
          <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-2">
                <FileText size={20} />
                {currentLesson.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: currentLesson.content }}
              />
            </CardContent>
          </Card>

          {/* Code Examples */}
          {currentLesson.codeExamples && currentLesson.codeExamples.length > 0 && (
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-2">
                  <Code size={20} />
                  Code Examples
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="0" className="w-full">
                  <TabsList className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
                    {currentLesson.codeExamples.map((example, index) => (
                      <TabsTrigger key={index} value={index.toString()}>
                        {example.language}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {currentLesson.codeExamples.map((example, index) => (
                    <TabsContent key={index} value={index.toString()}>
                      <div className="space-y-3">
                        <p className="text-gray-300 text-sm">{example.description}</p>
                        <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                          <code className="text-green-400 text-sm">{example.code}</code>
                        </pre>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Quiz */}
          {currentLesson.quiz && currentLesson.quiz.length > 0 && (
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-2">
                  <Award size={20} />
                  Knowledge Check
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showQuizResults ? (
                  <div className="space-y-6">
                    {currentLesson.quiz.map((question, qIndex) => (
                      <div key={qIndex} className="space-y-3">
                        <h4 className="text-white font-medium">
                          {qIndex + 1}. {question.question}
                        </h4>
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <label
                              key={oIndex}
                              className="flex items-center gap-3 p-3 rounded-lg border border-gray-600 hover:border-purple-500/50 cursor-pointer transition-colors"
                            >
                              <input
                                type="radio"
                                name={`question-${qIndex}`}
                                value={oIndex}
                                onChange={() => setQuizAnswers(prev => ({ ...prev, [qIndex]: oIndex }))}
                                className="text-purple-600"
                              />
                              <span className="text-gray-300">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length !== currentLesson.quiz.length}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Submit Quiz
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className={`text-6xl ${quizScore >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                      {quizScore >= 70 ? '🎉' : '📚'}
                    </div>
                    <h3 className={`text-2xl font-bold ${quizScore >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                      {quizScore}% Score
                    </h3>
                    <p className="text-gray-300">
                      {quizScore >= 70
                        ? 'Great job! You can proceed to the next lesson.'
                        : 'Keep studying! Review the content and try again.'}
                    </p>
                    {quizScore >= 70 && (
                      <div className="flex items-center justify-center gap-2 text-green-400">
                        <CheckCircle size={20} />
                        <span>Lesson Completed!</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={previousLesson}
              disabled={currentLessonIndex === 0}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <SkipBack size={16} className="mr-2" />
              Previous Lesson
            </Button>

            {!currentLesson.quiz && (
              <Button
                onClick={handleLessonComplete}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle size={16} className="mr-2" />
                Mark Complete
              </Button>
            )}

            <Button
              variant="outline"
              onClick={nextLesson}
              disabled={currentLessonIndex === lessons.length - 1}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Next Lesson
              <SkipForward size={16} className="ml-2" />
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lesson List */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Course Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => setCurrentLessonIndex(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${index === currentLessonIndex
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-600 hover:border-gray-500'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {completedLessons.has(lesson.id) ? (
                        <CheckCircle size={16} className="text-green-400" />
                      ) : (
                        <div className={`w-4 h-4 rounded-full border-2 ${index === currentLessonIndex ? 'border-purple-400' : 'border-gray-500'
                          }`} />
                      )}
                      <div>
                        <p className={`font-medium ${index === currentLessonIndex ? 'text-purple-300' : 'text-white'
                          }`}>
                          {lesson.title}
                        </p>
                        <p className="text-gray-400 text-sm">{lesson.duration}min</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Progress Summary */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Target size={18} />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {Math.round(progress)}%
                </div>
                <p className="text-gray-400 text-sm">Course Completion</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Lessons Completed:</span>
                  <span>{completedLessons.size}/{lessons.length}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Time Spent:</span>
                  <span>{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
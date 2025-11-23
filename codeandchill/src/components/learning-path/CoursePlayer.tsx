import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  CheckCircle, 
  X,
  BookOpen,
  FileText,
  Video,
  Code,
  Clock
} from 'lucide-react';

interface CoursePlayerProps {
  course: any;
  pathId: string;
  onProgressUpdate: (courseId: string, progress: number, timeSpent: number) => void;
  onClose: () => void;
}

interface QuizComponentProps {
  quiz: any[];
  quizTitle: string;
  lessonId: string;
  onComplete: (score: number, answers: any[]) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ quiz, quizTitle, lessonId, onComplete }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    if (!showResults) {
      setSelectedAnswers({
        ...selectedAnswers,
        [questionIndex]: optionIndex
      });
    }
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    const answerDetails = quiz.map((q, idx) => ({
      questionIndex: idx,
      selectedAnswer: selectedAnswers[idx],
      correctAnswer: q.correctAnswer,
      isCorrect: selectedAnswers[idx] === q.correctAnswer
    }));

    answerDetails.forEach(answer => {
      if (answer.isCorrect) correctCount++;
    });

    setScore(correctCount);
    setShowResults(true);
    
    // Auto-complete and move to next lesson after showing results
    setTimeout(() => {
      onComplete(correctCount, answerDetails);
    }, 2000);
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  return (
    <div className="bg-gray-900/50 rounded-lg p-8 min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Quiz Time! 🎯</h2>
        {showResults && (
          <div className="text-right">
            <p className="text-2xl font-bold text-white">
              Score: {score}/{quiz.length}
            </p>
            <p className={`text-sm ${score === quiz.length ? 'text-green-400' : score >= quiz.length / 2 ? 'text-yellow-400' : 'text-red-400'}`}>
              {score === quiz.length ? 'Perfect! 🎉' : score >= quiz.length / 2 ? 'Good job! 👍' : 'Keep practicing! 💪'}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {quiz.map((q, questionIdx) => {
          const isAnswered = selectedAnswers[questionIdx] !== undefined;
          const isCorrect = selectedAnswers[questionIdx] === q.correctAnswer;

          return (
            <div 
              key={questionIdx} 
              className={`bg-gray-800/50 rounded-lg p-6 border-2 transition-all ${
                showResults 
                  ? isCorrect 
                    ? 'border-green-500/50' 
                    : 'border-red-500/50'
                  : 'border-gray-700'
              }`}
            >
              <p className="text-white font-semibold text-lg mb-4">
                {questionIdx + 1}. {q.question}
              </p>
              <div className="space-y-3">
                {q.options.map((option: string, optIdx: number) => {
                  const isSelected = selectedAnswers[questionIdx] === optIdx;
                  const isCorrectOption = optIdx === q.correctAnswer;
                  
                  let buttonClass = 'w-full text-left p-4 rounded-lg transition-all border-2 ';
                  
                  if (showResults) {
                    if (isCorrectOption) {
                      buttonClass += 'bg-green-900/30 border-green-500 text-green-300';
                    } else if (isSelected && !isCorrectOption) {
                      buttonClass += 'bg-red-900/30 border-red-500 text-red-300';
                    } else {
                      buttonClass += 'bg-gray-700/30 border-gray-600 text-gray-400';
                    }
                  } else {
                    if (isSelected) {
                      buttonClass += 'bg-purple-600 border-purple-500 text-white';
                    } else {
                      buttonClass += 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswerSelect(questionIdx, optIdx)}
                      disabled={showResults}
                      className={buttonClass}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span className="flex-1">{option}</span>
                        {showResults && isCorrectOption && (
                          <CheckCircle className="text-green-400" size={20} />
                        )}
                        {showResults && isSelected && !isCorrectOption && (
                          <X className="text-red-400" size={20} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex gap-4">
        {!showResults ? (
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length !== quiz.length}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold"
          >
            Submit Quiz
          </Button>
        ) : (
          <>
            <Button
              onClick={handleRetry}
              variant="outline"
              className="flex-1 border-gray-600 py-6 text-lg"
            >
              Retry Quiz
            </Button>
            {score === quiz.length && (
              <Button
                onClick={onComplete}
                className="flex-1 bg-green-600 hover:bg-green-700 py-6 text-lg"
              >
                <CheckCircle className="mr-2" size={20} />
                Continue
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export const CoursePlayer: React.FC<CoursePlayerProps> = ({ 
  course, 
  pathId, 
  onProgressUpdate, 
  onClose 
}) => {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [courseContent, setCourseContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchCourseContent();
  }, [course.courseId._id]);

  const fetchCourseContent = async () => {
    try {
      setLoading(true);
      const { LearningPathService } = await import('@/services/learningPathService');
      const content = await LearningPathService.getCourseContent(pathId, course.courseId._id);
      setCourseContent(content);
    } catch (error) {
      console.error('Error fetching course content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
        // Auto-progress simulation
        setProgress(prev => Math.min(prev + 0.5, 100));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleComplete = async () => {
    // Update progress
    onProgressUpdate(course.courseId._id, 100, Math.floor(timeSpent / 60));
    
    // Generate certificate for completed course
    try {
      const { LearningPathService } = await import('@/services/learningPathService');
      await LearningPathService.generateCourseCertificate(pathId, course.courseId._id);
      alert('🎉 Congratulations! Course completed and certificate generated!');
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
    
    onClose();
  };

  // Extract lessons from course content
  const lessons = courseContent?.modules?.flatMap((module: any) => 
    module.topics?.flatMap((topic: any) => 
      topic.subtopics?.map((subtopic: any) => ({
        title: subtopic.title,
        type: subtopic.videoUrl ? 'video' : subtopic.quiz?.length > 0 ? 'quiz' : 'text',
        duration: subtopic.duration ? `${subtopic.duration}:00` : '10:00',
        content: subtopic.content,
        videoUrl: subtopic.videoUrl,
        quiz: subtopic.quiz,
        codeExamples: subtopic.codeExamples
      }))
    )
  ) || [];

  if (loading) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardContent className="py-20 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading course content...</p>
        </CardContent>
      </Card>
    );
  }

  if (!courseContent || lessons.length === 0) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardContent className="py-20 text-center">
          <Video size={64} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Content Available</h3>
          <p className="text-gray-400">This course doesn't have any lessons yet</p>
          <Button onClick={onClose} className="mt-4">Go Back</Button>
        </CardContent>
      </Card>
    );
  }

  const currentLessonData = lessons[currentLesson];

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {/* Main Player */}
      <div className="lg:col-span-3">
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">{course.courseId.title}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={20} />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dynamic Content Area */}
            {currentLessonData.type === 'video' && currentLessonData.videoUrl ? (
              /* Video Player */
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <iframe
                  src={currentLessonData.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={currentLessonData.title}
                />
              </div>
            ) : currentLessonData.type === 'text' ? (
              /* Text Lesson */
              <div className="bg-gray-900/50 rounded-lg p-8 min-h-[400px]">
                <h2 className="text-3xl font-bold text-white mb-6">{currentLessonData.title}</h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ __html: currentLessonData.content }} 
                    className="text-gray-300 leading-relaxed"
                  />
                </div>
                
                {currentLessonData.codeExamples && currentLessonData.codeExamples.length > 0 && (
                  <div className="mt-8 space-y-6">
                    <h3 className="text-2xl font-bold text-white border-b border-gray-700 pb-2">
                      Code Examples
                    </h3>
                    {currentLessonData.codeExamples.map((example: any, idx: number) => (
                      <div key={idx} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-gray-400 font-medium">{example.description}</p>
                          <span className="text-xs bg-purple-600 px-3 py-1 rounded-full text-white">
                            {example.language}
                          </span>
                        </div>
                        <pre className="bg-gray-950 p-4 rounded-lg overflow-x-auto border border-gray-800">
                          <code className="text-sm text-green-400 font-mono">{example.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : currentLessonData.type === 'quiz' && currentLessonData.quiz ? (
              /* Interactive Quiz */
              <QuizComponent 
                quiz={currentLessonData.quiz}
                quizTitle={currentLessonData.title}
                lessonId={currentLessonData.id || `lesson-${currentLesson}`}
                onComplete={async (correctCount, answerDetails) => {
                  // Save quiz result to backend
                  try {
                    const { LearningPathService } = await import('@/services/learningPathService');
                    await LearningPathService.submitQuizResult(
                      pathId,
                      course.courseId._id,
                      currentLessonData.id || `lesson-${currentLesson}`,
                      currentLessonData.title,
                      currentLessonData.quiz.length,
                      correctCount,
                      answerDetails,
                      timeSpent
                    );
                  } catch (error) {
                    console.error('Error saving quiz result:', error);
                  }

                  // Mark lesson as completed
                  setCompletedLessons(prev => new Set([...prev, currentLesson]));
                  
                  // Auto-advance to next lesson
                  if (currentLesson < lessons.length - 1) {
                    setTimeout(() => {
                      setCurrentLesson(currentLesson + 1);
                    }, 2500);
                  }
                }}
              />
            ) : (
              /* Fallback */
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FileText size={64} className="mx-auto text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {currentLessonData.title}
                  </h3>
                  <p className="text-gray-400">
                    Lesson {currentLesson + 1} of {lessons.length}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  Lesson {currentLesson + 1} of {lessons.length}
                </span>
                <Progress value={(completedLessons.size / lessons.length) * 100} className="flex-1" />
                <span className="text-sm text-gray-400">
                  {Math.round((completedLessons.size / lessons.length) * 100)}% Complete
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                  disabled={currentLesson === 0}
                  className="border-gray-600 flex-1"
                >
                  <SkipBack size={16} className="mr-2" />
                  Previous
                </Button>
                
                {!completedLessons.has(currentLesson) && currentLessonData.type !== 'quiz' && (
                  <Button
                    onClick={() => {
                      setCompletedLessons(prev => new Set([...prev, currentLesson]));
                      if (currentLesson < lessons.length - 1) {
                        setTimeout(() => setCurrentLesson(currentLesson + 1), 500);
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Mark Complete
                  </Button>
                )}
                
                {currentLesson === lessons.length - 1 && completedLessons.size === lessons.length ? (
                  <Button
                    onClick={handleComplete}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Complete Course
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentLesson(Math.min(lessons.length - 1, currentLesson + 1))}
                    className="bg-purple-600 hover:bg-purple-700 flex-1"
                    disabled={currentLesson === lessons.length - 1}
                  >
                    Next
                    <SkipForward size={16} className="ml-2" />
                  </Button>
                )}
              </div>
            </div>

            {/* Content Description */}
            <div className="bg-gray-900/50 rounded-lg p-6">
              <h4 className="text-white font-semibold mb-2">About this lesson</h4>
              <p className="text-gray-400 text-sm">
                {course.courseId.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lesson List */}
      <div className="lg:col-span-1">
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Course Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {lessons.map((lesson, index) => {
              const isCompleted = completedLessons.has(index);
              const isCurrent = currentLesson === index;
              
              return (
                <button
                  key={index}
                  onClick={() => setCurrentLesson(index)}
                  className={`w-full text-left p-3 rounded-lg transition-all relative ${
                    isCurrent
                      ? 'bg-purple-600 text-white'
                      : isCompleted
                        ? 'bg-green-900/30 text-green-300 border border-green-500/30'
                        : 'bg-gray-700/30 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCurrent 
                        ? 'bg-white/20' 
                        : isCompleted 
                          ? 'bg-green-600' 
                          : 'bg-gray-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle size={14} />
                      ) : (
                        <>
                          {lesson.type === 'video' && <Video size={14} />}
                          {lesson.type === 'text' && <FileText size={14} />}
                          {lesson.type === 'code' && <Code size={14} />}
                          {lesson.type === 'quiz' && <BookOpen size={14} />}
                        </>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{lesson.title}</p>
                      <p className="text-xs opacity-70 flex items-center gap-1">
                        <Clock size={10} />
                        {lesson.duration}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

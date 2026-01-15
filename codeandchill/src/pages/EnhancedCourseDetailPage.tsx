import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Clock,
  BookOpen,
  Code,
  FileText,
  Award,
  ChevronRight,
  ChevronLeft,
  Play,
  Download
} from "lucide-react";
import { EnhancedCourseContentSidebar } from "@/components/engineering/EnhancedCourseContentSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/contexts/UserContext";

interface CodeExample {
  language: string;
  code: string;
  description: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Resource {
  title: string;
  url: string;
  type: 'article' | 'video' | 'documentation' | 'exercise';
}

interface Subtopic {
  id: string;
  title: string;
  content: string;
  duration?: number;
  videoUrl?: string;
  codeExamples?: CodeExample[];
  quiz?: QuizQuestion[];
  resources?: Resource[];
}

interface Topic {
  title: string;
  subtopics: Subtopic[];
}

interface Module {
  title: string;
  topics: Topic[];
}

interface CourseData {
  _id: string;
  courseTitle: string;
  modules: Module[];
}

interface UserProgress {
  completedLessons: string[];
  progressPercentage: number;
  currentLesson: string;
}

export function EnhancedCourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<Subtopic | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedLessons: [],
    progressPercentage: 0,
    currentLesson: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  useEffect(() => {
    fetchCourseData();
    fetchUserProgress();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      // List of engineering course IDs
      const engineeringCourseIds = ['dsa', 'dbms', 'operating-systems', 'computer-networks', 'software-engineering', 'web-development'];

      let response;
      if (engineeringCourseIds.includes(courseId || '')) {
        // Use engineering courses API
        response = await fetch(`http://localhost:3001/api/engineering-courses/${courseId}`);
      } else {
        // Use regular courses API
        response = await fetch(`http://localhost:3001/api/courses/${courseId}`);
      }

      if (!response.ok) throw new Error('Failed to fetch course');

      const data = await response.json();

      // Transform engineering course data to match expected format
      if (engineeringCourseIds.includes(courseId || '')) {
        const transformedData = {
          _id: data.id,
          courseTitle: data.title,
          modules: data.modules ? data.modules.map((module: any, moduleIndex: number) => ({
            title: module.title,
            topics: [{
              title: module.title,
              subtopics: module.lessons ? module.lessons.map((lesson: string, lessonIndex: number) => ({
                id: `${moduleIndex}-${lessonIndex}`,
                title: lesson,
                content: `Content for ${lesson}. This lesson covers important concepts and practical applications.`,
                duration: 30 // Default duration
              })) : []
            }]
          })) : []
        };
        setCourseData(transformedData);
      } else {
        setCourseData(data);
      }

      // Set first subtopic as default if available
      const modules = engineeringCourseIds.includes(courseId || '') ?
        (data.modules ? data.modules.map((module: any, moduleIndex: number) => ({
          title: module.title,
          topics: [{
            title: module.title,
            subtopics: module.lessons ? module.lessons.map((lesson: string, lessonIndex: number) => ({
              id: `${moduleIndex}-${lessonIndex}`,
              title: lesson,
              content: `Content for ${lesson}. This lesson covers important concepts and practical applications.`,
              duration: 30
            })) : []
          }]
        })) : []) :
        data.modules;

      if (modules[0]?.topics?.[0]?.subtopics?.[0]) {
        setSelectedSubtopic(modules[0].topics[0].subtopics[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const token = localStorage.getItem('authToken');

      // List of engineering course IDs
      const engineeringCourseIds = ['dsa', 'dbms', 'operating-systems', 'computer-networks', 'software-engineering', 'web-development'];

      let response;
      if (engineeringCourseIds.includes(courseId || '')) {
        // Use engineering courses progress API
        response = await fetch(
          `http://localhost:3001/api/engineering-courses/${courseId}/progress`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Use regular progress API
        response = await fetch(
          `http://localhost:3001/api/progress/course/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      if (response.ok) {
        const data = await response.json();
        setUserProgress(data);
      }
    } catch (err) {
      console.error('Failed to fetch progress:', err);
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    try {
      const token = localStorage.getItem('authToken');

      // List of engineering course IDs
      const engineeringCourseIds = ['dsa', 'dbms', 'operating-systems', 'computer-networks', 'software-engineering', 'web-development'];

      let response;
      if (engineeringCourseIds.includes(courseId || '')) {
        // Use engineering courses progress API
        response = await fetch(`http://localhost:3001/api/engineering-courses/${courseId}/progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            lessonId,
            completed: true
          })
        });
      } else {
        // Use regular progress API
        response = await fetch('http://localhost:3001/api/progress/lesson', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            courseId,
            lessonId,
            completed: true
          })
        });
      }

      if (response.ok) {
        const data = await response.json();
        setUserProgress(data);

        // Check if course is complete
        if (data.progressPercentage === 100) {
          alert('🎉 Congratulations! You have completed this course!');
        }
      }
    } catch (err) {
      console.error('Failed to mark lesson complete:', err);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return userProgress.completedLessons.includes(lessonId);
  };

  const handleQuizSubmit = () => {
    setShowQuizResults(true);
  };

  const getQuizScore = () => {
    if (!selectedSubtopic?.quiz) return 0;
    let correct = 0;
    selectedSubtopic.quiz.forEach((q, index) => {
      if (quizAnswers[index] === q.correctAnswer) correct++;
    });
    return Math.round((correct / selectedSubtopic.quiz.length) * 100);
  };

  const navigateToNextLesson = () => {
    if (!courseData || !selectedSubtopic) return;

    // Find current position and navigate to next
    for (const module of courseData.modules) {
      for (const topic of module.topics) {
        const currentIndex = topic.subtopics.findIndex(s => s.id === selectedSubtopic.id);
        if (currentIndex !== -1 && currentIndex < topic.subtopics.length - 1) {
          setSelectedSubtopic(topic.subtopics[currentIndex + 1]);
          return;
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Skeleton className="lg:col-span-1 h-96" />
          <Skeleton className="lg:col-span-3 h-[80vh]" />
        </div>
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold text-red-500">Failed to Load Course</h2>
        <p className="text-gray-400 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/3 via-blue-500/3 to-cyan-500/3 rounded-full blur-3xl" />
      </div>

      {/* Course Header */}
      <div className="bg-gradient-to-br from-gray-900/80 via-black/80 to-gray-800/80 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-4">
                {courseData.courseTitle}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <span className="flex items-center gap-2 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  {courseData.modules.length} Modules
                </span>
                <span className="flex items-center gap-2 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                  <Clock className="w-4 h-4 text-blue-400" />
                  {userProgress.progressPercentage}% Complete
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-xl p-6 min-w-[280px]">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-white mb-1">{userProgress.progressPercentage}%</div>
                <div className="text-sm bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                  Course Progress
                </div>
              </div>
              <Progress value={userProgress.progressPercentage} className="mb-3" />
              <p className="text-sm text-center bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                {userProgress.completedLessons.length} lessons completed
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/60 sticky top-4">
              <div className="mb-6">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                  Course Content
                </h2>
              </div>
              <EnhancedCourseContentSidebar
                modules={courseData.modules}
                onSelectSubtopic={setSelectedSubtopic}
                selectedSubtopicId={selectedSubtopic?.id}
                completedLessons={userProgress.completedLessons}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {selectedSubtopic && (
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-xl hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/60">
                <div className="border-b border-gray-700 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-3">
                        {selectedSubtopic.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        {selectedSubtopic.duration && (
                          <span className="flex items-center gap-1 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                            <Clock className="w-4 h-4 text-blue-400" />
                            {selectedSubtopic.duration} min
                          </span>
                        )}
                        {isLessonCompleted(selectedSubtopic.id) && (
                          <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                    {!isLessonCompleted(selectedSubtopic.id) && (
                      <Button
                        onClick={() => markLessonComplete(selectedSubtopic.id)}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-black/30 backdrop-blur-sm border border-gray-600">
                      <TabsTrigger
                        value="content"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                      >
                        Content
                      </TabsTrigger>
                      <TabsTrigger
                        value="code"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                      >
                        Code Examples
                      </TabsTrigger>
                      <TabsTrigger
                        value="quiz"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                      >
                        Quiz
                      </TabsTrigger>
                      <TabsTrigger
                        value="resources"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                      >
                        Resources
                      </TabsTrigger>
                    </TabsList>

                    {/* Content Tab */}
                    <TabsContent value="content" className="mt-6">
                      {selectedSubtopic.videoUrl && (
                        <div className="mb-6">
                          <div className="aspect-video bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-lg flex items-center justify-center">
                            <Play className="w-16 h-16 text-purple-400" />
                            <p className="text-gray-400 ml-4">Video: {selectedSubtopic.videoUrl}</p>
                          </div>
                        </div>
                      )}

                      <div className="prose prose-invert max-w-none">
                        {selectedSubtopic.content.split('\n\n').map((paragraph, index) => (
                          <p key={index} className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent leading-relaxed mb-4">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Code Examples Tab */}
                    <TabsContent value="code" className="mt-6">
                      {selectedSubtopic.codeExamples && selectedSubtopic.codeExamples.length > 0 ? (
                        <div className="space-y-6">
                          {selectedSubtopic.codeExamples.map((example, index) => (
                            <div key={index} className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-xl hover:border-gray-600 transition-all duration-300">
                              <div className="p-4 border-b border-gray-700">
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="border-purple-500/30 text-purple-300">{example.language}</Badge>
                                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                    <Download className="w-4 h-4 mr-2" />
                                    Copy Code
                                  </Button>
                                </div>
                                <p className="text-sm bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent mt-2">{example.description}</p>
                              </div>
                              <div className="p-4">
                                <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto border border-gray-700">
                                  <code className="text-green-400 text-sm">{example.code}</code>
                                </pre>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-xl p-8">
                            <Code className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                            <p className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">No code examples available for this lesson</p>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    {/* Quiz Tab */}
                    <TabsContent value="quiz" className="mt-6">
                      {selectedSubtopic.quiz && selectedSubtopic.quiz.length > 0 ? (
                        <div className="space-y-6">
                          {selectedSubtopic.quiz.map((question, qIndex) => (
                            <div key={qIndex} className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-xl hover:border-gray-600 transition-all duration-300">
                              <div className="p-4 border-b border-gray-700">
                                <h3 className="text-lg font-semibold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                                  Question {qIndex + 1}
                                </h3>
                                <p className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent mt-2">{question.question}</p>
                              </div>
                              <div className="p-4">
                                <div className="space-y-2">
                                  {question.options.map((option, oIndex) => (
                                    <button
                                      key={oIndex}
                                      onClick={() => setQuizAnswers({ ...quizAnswers, [qIndex]: oIndex })}
                                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${quizAnswers[qIndex] === oIndex
                                        ? 'border-blue-500 bg-blue-900/20'
                                        : 'border-gray-700 hover:border-gray-600'
                                        } ${showQuizResults && oIndex === question.correctAnswer
                                          ? 'border-green-500 bg-green-900/20'
                                          : showQuizResults && quizAnswers[qIndex] === oIndex
                                            ? 'border-red-500 bg-red-900/20'
                                            : ''
                                        }`}
                                    >
                                      <span className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent">{option}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}

                          <div className="flex items-center justify-between">
                            <Button
                              onClick={handleQuizSubmit}
                              disabled={Object.keys(quizAnswers).length !== selectedSubtopic.quiz.length}
                              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0"
                            >
                              Submit Quiz
                            </Button>
                            {showQuizResults && (
                              <div className="text-right">
                                <p className="text-2xl font-bold text-white">
                                  Score: {getQuizScore()}%
                                </p>
                                <p className="text-sm bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                                  {Object.values(quizAnswers).filter((a, i) => a === selectedSubtopic.quiz![i].correctAnswer).length} / {selectedSubtopic.quiz.length} correct
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-xl p-8">
                            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                            <p className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">No quiz available for this lesson</p>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    {/* Resources Tab */}
                    <TabsContent value="resources" className="mt-6">
                      {selectedSubtopic.resources && selectedSubtopic.resources.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedSubtopic.resources.map((resource, index) => (
                            <div key={index} className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-xl hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/60">
                              <div className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-lg">
                                    <FileText className="w-5 h-5 text-blue-400" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-1">{resource.title}</h4>
                                    <Badge variant="outline" className="text-xs mb-2 border-purple-500/30 text-purple-300">
                                      {resource.type}
                                    </Badge>
                                    <a
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                                    >
                                      View Resource
                                      <ChevronRight className="w-3 h-3" />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-xl p-8">
                            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                            <p className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">No additional resources available for this lesson</p>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white hover:bg-gray-800">
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous Lesson
                    </Button>
                    <Button
                      onClick={navigateToNextLesson}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0"
                    >
                      Next Lesson
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Course Completion Modal */}
      {userProgress.progressPercentage === 100 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-xl max-w-md mx-4 shadow-2xl">
            <div className="p-8 text-center">
              <div className="p-4 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-xl w-fit mx-auto mb-6">
                <Award className="w-16 h-16 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">
                Congratulations!
              </h2>
              <p className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent mb-6">
                You've completed {courseData.courseTitle}
              </p>
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0">
                Download Certificate
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

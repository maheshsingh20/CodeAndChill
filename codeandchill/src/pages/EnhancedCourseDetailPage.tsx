import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  Circle, 
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
      const response = await fetch(`http://localhost:3001/api/courses/${courseId}`);
      if (!response.ok) throw new Error('Failed to fetch course');
      
      const data = await response.json();
      setCourseData(data);
      
      // Set first subtopic as default
      if (data.modules[0]?.topics[0]?.subtopics[0]) {
        setSelectedSubtopic(data.modules[0].topics[0].subtopics[0]);
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
      const response = await fetch(
        `http://localhost:3001/api/progress/course/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
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
      const response = await fetch('http://localhost:3001/api/progress/lesson', {
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
    <div className="min-h-screen bg-gray-900">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 border-b border-gray-700">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{courseData.courseTitle}</h1>
              <div className="flex items-center gap-4 text-gray-300">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {courseData.modules.length} Modules
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {userProgress.progressPercentage}% Complete
                </span>
              </div>
            </div>
            <div className="text-right">
              <Progress value={userProgress.progressPercentage} className="w-48 mb-2" />
              <p className="text-sm text-gray-300">
                {userProgress.completedLessons.length} lessons completed
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700 sticky top-4">
              <CardHeader>
                <CardTitle className="text-white">Course Content</CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedCourseContentSidebar
                  modules={courseData.modules}
                  onSelectSubtopic={setSelectedSubtopic}
                  selectedSubtopicId={selectedSubtopic?.id}
                  completedLessons={userProgress.completedLessons}
                />
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {selectedSubtopic && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="border-b border-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl text-white mb-2">
                        {selectedSubtopic.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        {selectedSubtopic.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {selectedSubtopic.duration} min
                          </span>
                        )}
                        {isLessonCompleted(selectedSubtopic.id) && (
                          <Badge className="bg-green-600">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                    {!isLessonCompleted(selectedSubtopic.id) && (
                      <Button
                        onClick={() => markLessonComplete(selectedSubtopic.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-gray-700">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="code">Code Examples</TabsTrigger>
                      <TabsTrigger value="quiz">Quiz</TabsTrigger>
                      <TabsTrigger value="resources">Resources</TabsTrigger>
                    </TabsList>

                    {/* Content Tab */}
                    <TabsContent value="content" className="mt-6">
                      {selectedSubtopic.videoUrl && (
                        <div className="mb-6">
                          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                            <Play className="w-16 h-16 text-gray-600" />
                            <p className="text-gray-400 ml-4">Video: {selectedSubtopic.videoUrl}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="prose prose-invert max-w-none">
                        {selectedSubtopic.content.split('\n\n').map((paragraph, index) => (
                          <p key={index} className="text-gray-300 leading-relaxed mb-4">
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
                            <Card key={index} className="bg-gray-900 border-gray-700">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline">{example.language}</Badge>
                                  <Button variant="ghost" size="sm">
                                    <Download className="w-4 h-4 mr-2" />
                                    Copy Code
                                  </Button>
                                </div>
                                <p className="text-sm text-gray-400 mt-2">{example.description}</p>
                              </CardHeader>
                              <CardContent>
                                <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                                  <code className="text-green-400 text-sm">{example.code}</code>
                                </pre>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-400">
                          <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No code examples available for this lesson</p>
                        </div>
                      )}
                    </TabsContent>

                    {/* Quiz Tab */}
                    <TabsContent value="quiz" className="mt-6">
                      {selectedSubtopic.quiz && selectedSubtopic.quiz.length > 0 ? (
                        <div className="space-y-6">
                          {selectedSubtopic.quiz.map((question, qIndex) => (
                            <Card key={qIndex} className="bg-gray-900 border-gray-700">
                              <CardHeader>
                                <CardTitle className="text-lg text-white">
                                  Question {qIndex + 1}
                                </CardTitle>
                                <p className="text-gray-300">{question.question}</p>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  {question.options.map((option, oIndex) => (
                                    <button
                                      key={oIndex}
                                      onClick={() => setQuizAnswers({...quizAnswers, [qIndex]: oIndex})}
                                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                                        quizAnswers[qIndex] === oIndex
                                          ? 'border-blue-500 bg-blue-900/20'
                                          : 'border-gray-700 hover:border-gray-600'
                                      } ${
                                        showQuizResults && oIndex === question.correctAnswer
                                          ? 'border-green-500 bg-green-900/20'
                                          : showQuizResults && quizAnswers[qIndex] === oIndex
                                          ? 'border-red-500 bg-red-900/20'
                                          : ''
                                      }`}
                                    >
                                      <span className="text-gray-300">{option}</span>
                                    </button>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          
                          <div className="flex items-center justify-between">
                            <Button
                              onClick={handleQuizSubmit}
                              disabled={Object.keys(quizAnswers).length !== selectedSubtopic.quiz.length}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Submit Quiz
                            </Button>
                            {showQuizResults && (
                              <div className="text-right">
                                <p className="text-2xl font-bold text-white">
                                  Score: {getQuizScore()}%
                                </p>
                                <p className="text-sm text-gray-400">
                                  {Object.values(quizAnswers).filter((a, i) => a === selectedSubtopic.quiz![i].correctAnswer).length} / {selectedSubtopic.quiz.length} correct
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-400">
                          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No quiz available for this lesson</p>
                        </div>
                      )}
                    </TabsContent>

                    {/* Resources Tab */}
                    <TabsContent value="resources" className="mt-6">
                      {selectedSubtopic.resources && selectedSubtopic.resources.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedSubtopic.resources.map((resource, index) => (
                            <Card key={index} className="bg-gray-900 border-gray-700 hover:border-blue-500 transition-colors">
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-blue-900/20 rounded-lg">
                                    <FileText className="w-5 h-5 text-blue-400" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-white mb-1">{resource.title}</h4>
                                    <Badge variant="outline" className="text-xs mb-2">
                                      {resource.type}
                                    </Badge>
                                    <a
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                    >
                                      View Resource
                                      <ChevronRight className="w-3 h-3" />
                                    </a>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-400">
                          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No additional resources available for this lesson</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
                    <Button variant="outline" className="border-gray-600">
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous Lesson
                    </Button>
                    <Button
                      onClick={navigateToNextLesson}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Next Lesson
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>

      {/* Course Completion Modal */}
      {userProgress.progressPercentage === 100 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-800 border-gray-700 max-w-md">
            <CardContent className="p-8 text-center">
              <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Congratulations!
              </h2>
              <p className="text-gray-300 mb-6">
                You've completed {courseData.courseTitle}
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Download Certificate
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { CourseContentSidebar } from "@/components/engineering/CourseContentSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { RealTimeProgressBar } from "@/components/realtime/RealTimeProgressBar";
import { useRealTimeProgress } from "@/hooks/useRealTimeProgress";

interface Subtopic {
  id: string;
  title: string;
  content: string;
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

export function GeneralCourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [selectedContent, setSelectedContent] = useState<string>("");
  const [currentLessonId, setCurrentLessonId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Real-time progress tracking
  const { updateProgress } = useRealTimeProgress({
    courseId: courseId || '',
    onProgressUpdate: (progress) => {
      console.log('Real-time progress update:', progress);
    },
    onAchievementUnlocked: (achievements) => {
      console.log('New achievements:', achievements);
    }
  });

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      setError(null);
      setCourseData(null);

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

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Server responded with ${response.status}.`
          );
        }

        const data = await response.json();

        // Transform engineering course data to match expected format
        let courseData: CourseData;
        if (engineeringCourseIds.includes(courseId || '')) {
          courseData = {
            _id: data.id,
            courseTitle: data.title,
            modules: data.modules ? data.modules.map((module: any, moduleIndex: number) => ({
              title: module.title,
              topics: [{
                title: module.title,
                subtopics: module.lessons ? module.lessons.map((lesson: string, lessonIndex: number) => ({
                  id: `${moduleIndex}-${lessonIndex}`,
                  title: lesson,
                  content: `Content for ${lesson}. This lesson covers important concepts and practical applications in ${module.title}.

This is a comprehensive lesson that will help you understand the fundamental concepts and practical applications. You'll learn through examples, exercises, and real-world scenarios.

Key topics covered:
- Core concepts and definitions
- Practical implementation techniques
- Best practices and common patterns
- Real-world applications and use cases

Take your time to understand each concept thoroughly before moving to the next lesson.`
                })) : []
              }]
            })) : []
          };
        } else {
          courseData = data;
        }

        if (courseData && courseData.modules) {
          setCourseData(courseData);
          if (courseData.modules[0]?.topics[0]?.subtopics[0]) {
            const firstLesson = courseData.modules[0].topics[0].subtopics[0];
            setSelectedContent(firstLesson.content);
            setCurrentLessonId(firstLesson.id);
            setStartTime(new Date());
          } else {
            setSelectedContent(
              "Welcome! Select a topic from the left to get started."
            );
          }
        } else {
          throw new Error("Received invalid course data from the server.");
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCourseData();
  }, [courseId]);

  // Track time spent on lessons
  useEffect(() => {
    if (!startTime || !currentLessonId) return;

    const interval = setInterval(() => {
      const now = new Date();
      const spent = Math.floor((now.getTime() - startTime.getTime()) / 60000); // minutes
      setTimeSpent(spent);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [startTime, currentLessonId]);

  // Handle lesson selection with progress tracking
  const handleLessonSelect = async (content: string, lessonId?: string) => {
    // Update progress for previous lesson
    if (currentLessonId && timeSpent > 0 && courseData) {
      const totalLessons = courseData.modules.reduce(
        (total, module) => total + module.topics.reduce(
          (topicTotal, topic) => topicTotal + topic.subtopics.length, 0
        ), 0
      );

      await updateProgress(currentLessonId, { totalLessons }, timeSpent);
    }

    // Set new lesson
    setSelectedContent(content);
    if (lessonId) {
      setCurrentLessonId(lessonId);
      setStartTime(new Date());
      setTimeSpent(0);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-1 h-96 w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-xl animate-pulse" />
            <div className="lg:col-span-3 h-[80vh] w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-xl p-8 max-w-md mx-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-2">
            Failed to Load Course
          </h2>
          <p className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">{error}</p>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-xl p-8 max-w-md mx-4">
          <p className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent text-center">
            Course data could not be loaded.
          </p>
        </div>
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

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <aside className="lg:col-span-1 lg:sticky top-8">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/60">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-6">
                {courseData.courseTitle}
              </h2>
              <CourseContentSidebar
                modules={courseData.modules}
                onSelectContent={(content, lessonId) => handleLessonSelect(content, lessonId)}
              />

              {/* Real-time Progress Bar */}
              {courseId && (
                <div className="mt-6 p-4 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-lg">
                  <RealTimeProgressBar
                    courseId={courseId}
                    totalLessons={courseData.modules.reduce(
                      (total, module) => total + module.topics.reduce(
                        (topicTotal, topic) => topicTotal + topic.subtopics.length, 0
                      ), 0
                    )}
                  />
                </div>
              )}
            </div>
          </aside>

          <main className="lg:col-span-3">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-xl hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/60 min-h-[80vh]">
              <div className="p-8 lg:p-12">
                <div className="prose prose-invert prose-lg max-w-none">
                  {selectedContent.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-6 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

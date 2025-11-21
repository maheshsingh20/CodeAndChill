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
        const response = await fetch(
          `http://localhost:3001/api/courses/${courseId}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Server responded with ${response.status}.`
          );
        }

        const data: CourseData = await response.json();

        if (data && data.modules) {
          setCourseData(data);
          if (data.modules[0]?.topics[0]?.subtopics[0]) {
            const firstLesson = data.modules[0].topics[0].subtopics[0];
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
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <Skeleton className="lg:col-span-1 h-96 w-full rounded-2xl shadow-lg" />
          <Skeleton className="lg:col-span-3 h-[80vh] w-full rounded-2xl shadow-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold text-destructive">
          Failed to Load Course
        </h2>
        <p className="text-muted-foreground mt-2">{error}</p>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="container mx-auto p-8 text-center">
        Course data could not be loaded.
      </div>
    );
  }

  return (
    <section className="w-full section-professional relative">
      {/* Consistent Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 gradient-secondary opacity-5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(120,119,198,0.08),transparent_50%)]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <aside className="lg:col-span-1 lg:sticky top-24">
            <div className="card-professional glass-effect p-6 border-gradient">
              <h2 className="text-2xl font-bold text-primary mb-6 heading-gradient">
                {courseData.courseTitle}
              </h2>
              <CourseContentSidebar
                modules={courseData.modules}
                onSelectContent={(content, lessonId) => handleLessonSelect(content, lessonId)}
              />
              
              {/* Real-time Progress Bar */}
              {courseId && (
                <div className="mt-6">
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
            <Card className="card-professional professional-shadow-xl min-h-[80vh] border-0">
              <CardContent className="p-8 lg:p-12">
                <div className="prose dark:prose-invert prose-lg max-w-none">
                  {selectedContent.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-6 text-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </section>
  );
}

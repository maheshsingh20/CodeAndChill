import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { CourseContentSidebar } from "@/components/engineering/CourseContentSidebar.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";

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

export function EngineeringCourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [selectedContent, setSelectedContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            setSelectedContent(data.modules[0].topics[0].subtopics[0].content);
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
    <section className="w-full py-16 bg-gradient-to-b from-lime-100 via-gray-100 to-cyan-100">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          <aside className="lg:col-span-1 lg:sticky top-24 bg-gradient-to-b from-cyan-50 to-lime-50 rounded-2xl shadow-xl border border-cyan-200 p-6">
            <h2 className="text-2xl font-bold text-cyan-900 mb-4">
              {courseData.courseTitle}
            </h2>
            <CourseContentSidebar
              modules={courseData.modules}
              onSelectContent={setSelectedContent}
            />
          </aside>
          <main className="lg:col-span-3">
            <Card className="rounded-2xl shadow-xl bg-gradient-to-b from-cyan-50 to-lime-50 min-h-[80vh] border border-cyan-200">
              <CardContent className="p-8">
                <div className="prose dark:prose-invert prose-lg max-w-none text-cyan-900">
                  {selectedContent.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
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

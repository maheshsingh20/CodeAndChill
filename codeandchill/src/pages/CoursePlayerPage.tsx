import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlayCircle, FileText, TableIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

// --- TypeScript Type Definitions ---
interface Topic {
  _id: string;
  title: string;
  contentType: "video" | "text" | "table";
  videoUrl?: string;
  textContent?: string;
  tableData?: string[][];
}
interface Lesson {
  _id: string;
  title: string;
  topics: Topic[];
}
interface Module {
  _id: string;
  title: string;
  lessons: Lesson[];
}
interface Course {
  _id: string;
  title: string;
  modules: Module[];
}

export function CoursePlayerPage() {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!slug) return;
    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3001/api/general-courses/content/${slug}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to load course content.");
        const data = await response.json();
        setCourse(data);
        // Set the very first topic as the default active one
        if (data.modules?.[0]?.lessons?.[0]?.topics?.[0]) {
          setActiveTopic(data.modules[0].lessons[0].topics[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [slug, token]);

  if (loading || !course) {
    return (
      <div className="flex h-[calc(100vh-5rem)] bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e]">
        <aside className="w-80 border-r border-[#333366] h-full p-4">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-24 w-full" />
        </aside>
        <main className="flex-1 p-8">
          <Skeleton className="w-full h-full rounded-2xl" />
        </main>
      </div>
    );
  }

  const getTopicIcon = (contentType: string) => {
    switch (contentType) {
      case "video":
        return <PlayCircle className="h-5 w-5 flex-shrink-0 text-[#00ffff]" />;
      case "text":
        return <FileText className="h-5 w-5 flex-shrink-0 text-[#00ffff]" />;
      case "table":
        return <TableIcon className="h-5 w-5 flex-shrink-0 text-[#00ffff]" />;
      default:
        return <PlayCircle className="h-5 w-5 flex-shrink-0 text-[#00ffff]" />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      {/* Sidebar */}
      <aside className="w-80 border-r border-[#333366] h-full overflow-y-auto bg-[#1a1a2e]/70 backdrop-blur-md shadow-lg">
        <div className="p-4 border-b border-[#333366]">
          <Link
            to={`/courses/${slug}`}
            className="font-semibold text-cyan-400 hover:text-[#00ffff] hover:underline transition-colors"
          >
            &larr; Back to Course Details
          </Link>
          <h2 className="text-xl font-bold mt-3 bg-gradient-to-r from-red-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {course.title}
          </h2>
        </div>
        <Accordion
          type="multiple"
          defaultValue={["item-0"]}
          className="w-full px-3 py-4 space-y-3"
        >
          {course.modules.map((module, index) => (
            <AccordionItem
              key={module._id}
              value={`item-${index}`}
              className="rounded-xl border border-[#333366] bg-[#0a0a1a]/60 backdrop-blur-sm hover:border-cyan-400 transition-colors"
            >
              <AccordionTrigger className="font-semibold text-left flex items-center gap-3 px-5 py-3 hover:bg-[#111133] transition-colors rounded-xl">
                <span className="text-cyan-400">{module.title}</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4">
                <ul className="space-y-1">
                  {module.lessons.map((lesson) => (
                    <li key={lesson._id}>
                      <p className="font-semibold text-gray-400 px-3 py-1">
                        {lesson.title}
                      </p>
                      <ul className="pl-4">
                        {lesson.topics.map((topic) => (
                          <li key={topic._id}>
                            <button
                              onClick={() => setActiveTopic(topic)}
                              className={`w-full text-left flex items-center gap-4 px-3 py-2 rounded-lg transition-colors truncate ${
                                activeTopic?._id === topic._id
                                  ? "bg-[#111133] text-[#00ffff]"
                                  : "text-[#66ffff]/80 hover:text-[#00ffff] hover:bg-[#111133]/50"
                              }`}
                            >
                              {getTopicIcon(topic.contentType)}
                              <span className="flex-grow truncate">
                                {topic.title}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-[#1a1a2e]/70 backdrop-blur-md">
        <div className="flex-grow p-8 overflow-y-auto">
          {activeTopic ? (
            <>
              {activeTopic.contentType === "video" && (
                <div className="w-full max-w-5xl mx-auto aspect-video bg-[#0a0a1a] rounded-2xl shadow-lg border-2 border-cyan-400 overflow-hidden">
                  <iframe
                    src={activeTopic.videoUrl}
                    title={activeTopic.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              {activeTopic.contentType === "text" && (
                <Card className="p-8 bg-[#0a0a1a]/80 border border-[#333366] prose prose-invert max-w-none">
                  {activeTopic.textContent}
                </Card>
              )}
              {activeTopic.contentType === "table" && (
                <Card className="p-8 bg-[#0a0a1a]/80 border border-[#333366]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        {activeTopic.tableData![0].map((header, i) => (
                          <th
                            key={i}
                            className="p-3 border-b border-[#333366] text-cyan-400"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activeTopic.tableData!.slice(1).map((row, i) => (
                        <tr key={i} className="border-b border-[#333366]/50">
                          {row.map((cell, j) => (
                            <td key={j} className="p-3">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Select a topic from the sidebar to begin.</p>
            </div>
          )}
        </div>
        <div className="p-8 border-t border-[#333366]/50 bg-[#0f0c29]/70 shadow-inner">
          <h1 className="text-3xl font-bold text-[#00ffff]">
            {activeTopic?.title || "Select a Topic"}
          </h1>
        </div>
      </main>
    </div>
  );
}

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { PlayCircle, CheckCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const courseData = {
  title: "Advanced React Patterns",
  modules: [
    {
      title: "Module 1: Introduction",
      lessons: ["Why Patterns Matter", "Thinking in Components"],
      completed: true,
    },
    {
      title: "Module 2: HOCs",
      lessons: ["Creating Your First HOC", "Real-World Examples"],
      completed: true,
    },
    {
      title: "Module 3: Render Props",
      lessons: ["Understanding Render Props", "Practical Applications"],
      completed: false,
    },
    {
      title: "Module 4: Custom Hooks",
      lessons: ["useMemo and useCallback", "Creating Custom Hooks"],
      completed: false,
    },
  ],
};

export function CoursePlayerPage() {
  const { courseId } = useParams();

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      {/* Sidebar */}
      <aside className="w-80 border-r border-[#333366] h-full overflow-y-auto bg-[#1a1a2e]/70 backdrop-blur-md shadow-lg rounded-tr-2xl rounded-br-2xl">
        <div className="p-4 border-b border-[#333366]">
          <Link
            to={`/courses/${courseId}`}
            className="font-semibold text-cyan-400 hover:text-[#00ffff] hover:underline transition-colors"
          >
            &larr; Back to Course Details
          </Link>
          <h2 className="text-xl font-bold mt-3 bg-gradient-to-r from-red-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {courseData.title}
          </h2>
        </div>
        <Accordion
          type="multiple"
          defaultValue={["item-0", "item-1"]}
          className="w-full px-3 py-4 space-y-3"
        >
          {courseData.modules.map((module, index) => (
            <AccordionItem
              key={module.title}
              value={`item-${index}`}
              className="rounded-xl border border-[#333366] bg-[#0a0a1a]/60 backdrop-blur-sm hover:border-cyan-400 transition-colors"
            >
              <AccordionTrigger className="font-semibold text-left flex items-center gap-3 px-5 py-3 hover:bg-[#111133] transition-colors rounded-xl">
                {module.completed && (
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                )}
                <span className="text-cyan-400">{module.title}</span>
              </AccordionTrigger>
              <AccordionContent className="px-8 py-4">
                <ul className="space-y-2">
                  {module.lessons.map((lesson) => (
                    <li key={lesson}>
                      <button className="w-full text-left flex items-center gap-4 text-[#66ffff]/80 hover:text-[#00ffff] px-3 py-2 rounded-lg hover:bg-[#111133] transition-colors truncate">
                        <PlayCircle className="h-5 w-5 flex-shrink-0 text-[#00ffff]" />
                        <span className="flex-grow truncate">{lesson}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </aside>

      {/* Main Content: Video Player */}
      <main className="flex-1 flex flex-col bg-[#1a1a2e]/70 backdrop-blur-md rounded-tl-2xl rounded-bl-2xl shadow-inner">
        <div className="flex-grow flex items-center justify-center rounded-tl-2xl rounded-bl-2xl mx-6 my-6">
          {/* Placeholder for video player */}
          <div className="w-full max-w-5xl aspect-video bg-[#0a0a1a] rounded-2xl shadow-lg text-white flex items-center justify-center border-2 border-cyan-400">
            <PlayCircle size={72} className="text-[#00ffff]" />
          </div>
        </div>
        <div className="p-8 border-t border-[#333366]/50 bg-[#0f0c29]/70 rounded-bl-2xl rounded-br-2xl shadow-inner">
          <h1 className="text-3xl font-bold text-[#00ffff]">
            Lesson 1: Why Patterns Matter
          </h1>
          <p className="text-[#66ffff]/70 mt-2">
            Module 1: Introduction to Advanced Patterns
          </p>
        </div>
      </main>
    </div>
  );
}

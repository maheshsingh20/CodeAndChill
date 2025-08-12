import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion.tsx";
import { PlayCircle, CheckCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const courseData = {
  title: "Advanced React Patterns",
  modules: [
    { title: "Module 1: Introduction", lessons: ["Why Patterns Matter", "Thinking in Components"], completed: true },
    { title: "Module 2: HOCs", lessons: ["Creating Your First HOC", "Real-World Examples"], completed: true },
    { title: "Module 3: Render Props", lessons: ["Understanding Render Props", "Practical Applications"], completed: false },
    { title: "Module 4: Custom Hooks", lessons: ["useMemo and useCallback", "Creating Custom Hooks"], completed: false },
  ]
};

export function CoursePlayerPage() {
  const { courseId } = useParams();

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-gradient-to-b from-lime-100 via-gray-100 to-cyan-100 text-cyan-900">
      {/* Sidebar */}
      <aside className="w-80 border-r border-cyan-300/40 h-full overflow-y-auto bg-gradient-to-br from-cyan-100 via-lime-100 to-gray-100 shadow-lg rounded-tr-2xl rounded-br-2xl">
        <div className="p-4 border-b border-cyan-300/40">
          <Link
            to={`/courses/${courseId}`}
            className="font-semibold hover:text-cyan-700 hover:underline transition-colors"
          >
            &larr; Back to Course Details
          </Link>
          <h2 className="text-xl font-bold mt-3">{courseData.title}</h2>
        </div>
        <Accordion type="multiple" defaultValue={["item-0", "item-1"]} className="w-full px-3 py-4 space-y-3">
          {courseData.modules.map((module, index) => (
            <AccordionItem
              key={module.title}
              value={`item-${index}`}
              className="rounded-xl border border-cyan-300/40 bg-white/70 backdrop-blur-sm"
            >
              <AccordionTrigger className="font-semibold text-left flex items-center gap-3 px-5 py-3 hover:bg-cyan-100 transition-colors rounded-xl">
                {module.completed && <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />}
                <span>{module.title}</span>
              </AccordionTrigger>
              <AccordionContent className="px-8 py-4">
                <ul className="space-y-2">
                  {module.lessons.map(lesson => (
                    <li key={lesson}>
                      <button className="w-full text-left flex items-center gap-4 text-cyan-700 hover:text-cyan-900 px-3 py-2 rounded-lg hover:bg-cyan-200 transition-colors truncate">
                        <PlayCircle className="h-5 w-5 flex-shrink-0 text-cyan-700" />
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
      <main className="flex-1 flex flex-col bg-gradient-to-br from-cyan-100 via-lime-100 to-gray-100 rounded-tl-2xl rounded-bl-2xl shadow-inner">
        <div className="flex-grow bg-black flex items-center justify-center rounded-tl-2xl rounded-bl-2xl shadow-lg mx-6 my-6">
          {/* Placeholder for video player */}
          <div className="w-full max-w-5xl aspect-video bg-slate-900 rounded-2xl shadow-lg text-white flex items-center justify-center">
            <PlayCircle size={72} className="text-cyan-400" />
          </div>
        </div>
        <div className="p-8 border-t border-cyan-300/40 bg-white/90 rounded-bl-2xl rounded-br-2xl shadow-inner">
          <h1 className="text-3xl font-bold text-cyan-900">Lesson 1: Why Patterns Matter</h1>
          <p className="text-cyan-700 mt-2">Module 1: Introduction to Advanced Patterns</p>
        </div>
      </main>
    </div>
  );
}

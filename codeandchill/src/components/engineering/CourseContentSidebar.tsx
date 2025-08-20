import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";

type Subtopic = {
  id: string;
  title: string;
  content: string;
};

type Topic = {
  title: string;
  subtopics: Subtopic[];
};

type Module = {
  title: string;
  topics: Topic[];
};

interface CourseContentSidebarProps {
  modules: Module[];
  onSelectContent: (content: string) => void;
}

export function CourseContentSidebar({
  modules,
  onSelectContent,
}: CourseContentSidebarProps) {
  if (!modules || !Array.isArray(modules)) {
    return <div className="p-4 text-cyan-800">Loading content...</div>;
  }

  return (
    <div className="w-full bg-gradient-to-b from-lime-100 via-gray-100 to-cyan-100 p-4 rounded-2xl shadow-xl">
      <Accordion
        type="single"
        collapsible
        defaultValue="module-0"
        className="w-full"
      >
        {modules.map((module, moduleIndex) => (
          <AccordionItem
            key={module.title}
            value={`module-${moduleIndex}`}
            className="rounded-xl border border-cyan-200 mb-2 shadow-sm"
          >
            <AccordionTrigger className="font-bold text-lg text-cyan-900 bg-cyan-100 hover:bg-cyan-200 rounded-xl px-4 py-2">
              {module.title}
            </AccordionTrigger>
            <AccordionContent className="bg-cyan-50 rounded-b-xl px-2 py-2">
              <Accordion type="single" collapsible>
                {module.topics?.map((topic, topicIndex) => (
                  <AccordionItem
                    key={topic.title}
                    value={`topic-${topicIndex}`}
                    className="border-l-2 border-cyan-200 pl-4 mb-1 rounded-lg"
                  >
                    <AccordionTrigger className="font-semibold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 rounded-lg px-3 py-1">
                      {topic.title}
                    </AccordionTrigger>
                    <AccordionContent className="px-2 py-1">
                      <ul className="space-y-1 pl-2">
                        {topic.subtopics?.map((subheading) => (
                          <li key={subheading.id}>
                            <button
                              onClick={() =>
                                onSelectContent(subheading.content)
                              }
                              className="w-full text-left p-2 rounded-md text-cyan-800 hover:bg-cyan-200 focus:bg-cyan-300 focus:text-cyan-900 transition"
                            >
                              {subheading.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

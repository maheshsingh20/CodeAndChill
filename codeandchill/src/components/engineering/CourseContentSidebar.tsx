import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion.tsx";

// --- TypeScript Type Definitions ---
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
  modules: Module[]; // This prop can sometimes be undefined during initial render
  onSelectContent: (content: string) => void;
}

export function CourseContentSidebar({ modules, onSelectContent }: CourseContentSidebarProps) {
  // FIX: Add a check to handle cases where modules might not be loaded yet.
  if (!modules || !Array.isArray(modules)) {
    return <div>Loading content...</div>; // Or return null
  }

  return (
    <Accordion type="single" collapsible defaultValue="module-0" className="w-full">
      {modules.map((module, moduleIndex) => (
        <AccordionItem key={module.title} value={`module-${moduleIndex}`}>
          <AccordionTrigger className="font-bold text-lg text-left">
            {module.title}
          </AccordionTrigger>
          <AccordionContent>
            <Accordion type="single" collapsible>
              {module.topics?.map((topic, topicIndex) => ( // Added optional chaining for safety
                <AccordionItem key={topic.title} value={`topic-${topicIndex}`} className="border-l pl-4">
                  <AccordionTrigger className="font-semibold text-left">
                    {topic.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-1 pl-4">
                      {topic.subtopics?.map(subheading => ( // Added optional chaining for safety
                        <li key={subheading.id}>
                          <button
                            onClick={() => onSelectContent(subheading.content)}
                            className="w-full text-left p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-primary focus:text-primary-foreground focus:outline-none"
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
  );
}
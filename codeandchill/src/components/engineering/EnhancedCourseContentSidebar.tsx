import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Subtopic {
  id: string;
  title: string;
  content: string;
  duration?: number;
}

interface Topic {
  title: string;
  subtopics: Subtopic[];
}

interface Module {
  title: string;
  topics: Topic[];
}

interface EnhancedCourseContentSidebarProps {
  modules: Module[];
  onSelectSubtopic: (subtopic: Subtopic) => void;
  selectedSubtopicId?: string;
  completedLessons: string[];
}

export function EnhancedCourseContentSidebar({
  modules,
  onSelectSubtopic,
  selectedSubtopicId,
  completedLessons
}: EnhancedCourseContentSidebarProps) {
  const isCompleted = (subtopicId: string) => completedLessons.includes(subtopicId);

  const getModuleProgress = (module: Module) => {
    // Safety check to ensure topics array exists
    if (!module.topics || !Array.isArray(module.topics)) {
      return 0;
    }

    const totalLessons = module.topics.reduce((sum, topic) => {
      if (!topic.subtopics || !Array.isArray(topic.subtopics)) {
        return sum;
      }
      return sum + topic.subtopics.length;
    }, 0);

    const completedCount = module.topics.reduce((sum, topic) => {
      // Safety check for subtopics
      if (!topic.subtopics || !Array.isArray(topic.subtopics)) {
        return sum;
      }
      return sum + topic.subtopics.filter(s => isCompleted(s.id)).length;
    }, 0);

    return totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  };

  return (
    <div className="w-full space-y-2">
      <Accordion
        type="single"
        collapsible
        defaultValue="module-0"
        className="w-full"
      >
        {modules.map((module, moduleIndex) => {
          const progress = getModuleProgress(module);

          return (
            <AccordionItem
              key={moduleIndex}
              value={`module-${moduleIndex}`}
              className="border border-gray-700 rounded-lg mb-3 overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="text-left">
                    <div className="font-semibold text-white mb-1">
                      Module {moduleIndex + 1}: {module.title}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{progress}%</span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-2 pb-2">
                <Accordion type="single" collapsible>
                  {module.topics && Array.isArray(module.topics) ? module.topics.map((topic, topicIndex) => (
                    <AccordionItem
                      key={topicIndex}
                      value={`topic-${topicIndex}`}
                      className="border-l-2 border-gray-700 ml-2 mb-2"
                    >
                      <AccordionTrigger className="px-3 py-2 text-sm hover:bg-gray-700/30 rounded">
                        <span className="text-gray-300">{topic.title}</span>
                      </AccordionTrigger>

                      <AccordionContent className="px-2 py-1">
                        <ul className="space-y-1">
                          {topic.subtopics && Array.isArray(topic.subtopics) ? topic.subtopics.map((subtopic) => {
                            const completed = isCompleted(subtopic.id);
                            const isSelected = selectedSubtopicId === subtopic.id;

                            return (
                              <li key={subtopic.id}>
                                <button
                                  onClick={() => onSelectSubtopic(subtopic)}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${isSelected
                                    ? 'bg-blue-600 text-white'
                                    : completed
                                      ? 'bg-green-900/20 text-green-300 hover:bg-green-900/30'
                                      : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
                                    }`}
                                >
                                  {completed ? (
                                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-400" />
                                  ) : (
                                    <Circle className="w-4 h-4 flex-shrink-0" />
                                  )}
                                  <span className="flex-1">{subtopic.title}</span>
                                  {subtopic.duration && (
                                    <Badge variant="outline" className="text-xs">
                                      {subtopic.duration}m
                                    </Badge>
                                  )}
                                </button>
                              </li>
                            );
                          }) : (
                            <li className="text-gray-500 text-sm px-3 py-2">No lessons available</li>
                          )}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )) : (
                    <div className="text-gray-500 text-sm px-3 py-2">No topics available</div>
                  )}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

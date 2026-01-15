import React, { useEffect, useState } from "react";
import { Section } from "./Section";
import { Link } from "react-router-dom";
import { ArrowRight, BrainCircuit, Code, FileQuestion } from "lucide-react";
import api from "@/services/api";

const iconMap: Record<string, React.ReactElement> = {
  Code: <Code className="h-8 w-8 text-yellow-400" />,
  BrainCircuit: <BrainCircuit className="h-8 w-8 text-cyan-400" />,
  FileQuestion: <FileQuestion className="h-8 w-8 text-green-400" />,
};

export function QuizzesSection() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get<{ quizzes: any[] }>('/quizzes');
        setQuizzes(response.quizzes?.slice(0, 3) || []);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) {
    return <Section title="Test Your Knowledge" viewAllLink="/quizzes"><div className="text-center text-gray-400">Loading quizzes...</div></Section>;
  }

  return (
    <Section title="Test Your Knowledge" viewAllLink="/quizzes">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="group h-full"
          >
            <Link to={`/quizzes/${quiz._id}`} className="block h-full">
              <div className="h-full min-h-[280px] bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
                <div className="flex flex-col h-full">
                  {/* Header with Icon */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md group-hover:border-gray-500 transition-all duration-300">
                      {iconMap[quiz.icon] || <FileQuestion className="h-8 w-8 text-green-400" />}
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                  </div>

                  {/* Content */}
                  <div className="flex-grow space-y-4">
                    {/* Title */}
                    <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-cyan-100 group-hover:to-cyan-200 transition-all duration-300">
                      {quiz.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300 leading-relaxed">
                      {quiz.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                        {quiz.questions?.length || 0} Questions
                      </span>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300">
                          Start Quiz
                        </span>
                        <div className="w-4 h-0.5 bg-gray-600 rounded-sm group-hover:bg-gray-500 transition-colors duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </Section>
  );
}

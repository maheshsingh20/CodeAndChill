import React, { useEffect, useState } from "react";
import { Section } from "./Section";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
        const response = await api.get<any[]>('/quizzes');
        setQuizzes(response.slice(0, 3));
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {quizzes.map((quiz) => (
          <Card
            key={quiz._id}
            className="
              relative rounded-3xl border border-gray-800/50 
              bg-gradient-to-b from-gray-900/90 to-black/90
              shadow-lg shadow-cyan-500/10 
              hover:shadow-cyan-500/20 hover:-translate-y-1
              transition-all duration-300 ease-in-out flex flex-col group
            "
          >
            {/* Header */}
            <CardHeader className="p-6">
              <div
                className="
                  p-3 rounded-full w-fit mb-4 
                  bg-gradient-to-r from-gray-800/80 to-gray-700/60 
                  border border-gray-700/50
                "
              >
                {iconMap[quiz.icon] || <FileQuestion className="h-8 w-8 text-green-400" />}
              </div>
              <CardTitle className="text-xl font-bold text-gray-100 group-hover:text-cyan-400 transition-colors">
                {quiz.title}
              </CardTitle>
            </CardHeader>

            {/* Content */}
            <CardContent className="p-6 pt-0 flex-grow">
              <CardDescription className="text-gray-400">
                {quiz.description}
              </CardDescription>
            </CardContent>

            {/* Footer */}
            <CardFooter
              className="
                p-6 flex justify-between items-center 
                border-t border-gray-800/70 bg-gray-900/60 rounded-b-3xl
              "
            >
              <span className="font-semibold text-sm text-gray-400">
                {quiz.questions?.length || 0} Questions
              </span>
              <Button
                asChild
                className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow-md shadow-cyan-600/30 transition-all"
              >
                <Link to={`/quizzes/${quiz._id}`}>
                  Start Quiz
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Section>
  );
}

import React from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface ProblemSetCardProps {
  set: {
    slug: string;
    title: string;
    author: string;
    description: string;
    problemsCount: number;
    icon: React.ReactNode;
  };
}

export function ProblemSetCard({ set }: ProblemSetCardProps) {
  return (
    <Link to={`/problems/${set.slug}`} className="group">
      <Card
        className="
          flex flex-col h-full rounded-2xl border-2 border-cyan-500
          bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900
          shadow-lg hover:shadow-2xl hover:scale-[1.03]
          transition-all duration-300
          backdrop-blur-sm
        "
      >
        <CardHeader className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-cyan-700 text-white rounded-xl mt-1 shadow-md group-hover:bg-cyan-600 transition-colors">
              {set.icon}
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                {set.title}
              </CardTitle>
              <CardDescription className="mt-1 text-cyan-300/80 text-sm">
                by {set.author}
              </CardDescription>
            </div>
          </div>
          <p className="text-cyan-200/70 text-sm pt-4">{set.description}</p>
        </CardHeader>

        <CardFooter className="p-6 mt-auto flex justify-between items-center bg-gray-800/50 border-t border-cyan-600 rounded-b-2xl">
          <span className="font-semibold text-cyan-300/90">
            {set.problemsCount} Problems
          </span>
          <div className="flex items-center text-cyan-400 font-semibold group-hover:text-cyan-300 transition-colors">
            View Set
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

import React from 'react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

type ProblemSet = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  problemsCount: number;
  author: string;
};

interface ProblemSetCardProps {
  set: ProblemSet;
}

export function ProblemSetCard({ set }: ProblemSetCardProps) {
  return (
    <Link to={`/problems/${set.id}`} className="group block focus:outline-none">
      <Card
        className="
          rounded-2xl
          bg-gradient-to-br from-white via-cyan-50 to-blue-50
          border border-cyan-100
          shadow-lg
          transition-all
          duration-300
          ease-in-out
          flex flex-col
          h-full
          hover:shadow-xl
          hover:scale-[1.02]
          focus-within:shadow-xl
        "
      >
        {/* Card Header */}
        <CardHeader className="p-6">
          <div className="flex items-start gap-4">
            {/* Icon bubble */}
            <div
              className="
                p-4
                bg-gradient-to-br from-cyan-100 to-cyan-200
                text-cyan-900
                rounded-xl
                mt-1
                shadow-inner
                transition-transform
                group-hover:scale-105
                group-focus-within:scale-105
              "
            >
              {set.icon}
            </div>

            {/* Title & author */}
            <div>
              <CardTitle className="text-xl font-bold text-cyan-900 group-hover:text-cyan-800 transition-colors">
                {set.title}
              </CardTitle>
              <CardDescription className="mt-1 text-cyan-800/80">
                by {set.author}
              </CardDescription>
            </div>
          </div>

          {/* Description */}
          <p className="text-cyan-800/70 text-sm pt-4">{set.description}</p>
        </CardHeader>

        {/* Footer */}
        <CardFooter
          className="
            p-6 mt-auto
            flex justify-between items-center
            bg-gradient-to-r from-cyan-50 to-blue-50
            rounded-b-2xl
            border-t border-cyan-100
          "
        >
          <span className="font-semibold text-cyan-700">
            {set.problemsCount} Problems
          </span>
          <div
            className="
              flex items-center
              text-cyan-700
              font-semibold
              transition
              group-hover:text-cyan-800
            "
          >
            View Set
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

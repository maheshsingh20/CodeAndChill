import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface Problem {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
}

interface ProblemDescriptionProps {
  problem?: Problem | null;
  loading?: boolean;
}

export function ProblemDescription({
  problem,
  loading = false,
}: ProblemDescriptionProps) {
  const difficultyColors: Record<Problem["difficulty"], string> = {
    Easy: "bg-green-900/50 text-green-300 border-green-700",
    Medium: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
    Hard: "bg-red-900/50 text-red-300 border-red-700",
  };

  if (loading || !problem) {
    return (
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          <div className="h-8 w-2/3 bg-gray-700/50 rounded animate-pulse"></div>
          <div className="h-6 w-20 bg-gray-700/50 rounded animate-pulse"></div>
          <div className="h-20 w-full bg-gray-700/50 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
            {problem.title}
          </h1>
          <Badge
            className={`font-semibold text-sm ${difficultyColors[problem.difficulty]
              }`}
          >
            {problem.difficulty}
          </Badge>
        </div>

        <div className="space-y-6">
          <div className="text-gray-300 space-y-4 leading-relaxed">
            {problem.description.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">Examples</h3>
            {problem.examples.map((example, index) => (
              <div
                key={index}
                className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30"
              >
                <p className="font-semibold text-gray-200 mb-3">
                  Example {index + 1}:
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Input: </span>
                    <code className="bg-gray-800/60 px-2 py-1 rounded text-green-400">
                      {example.input}
                    </code>
                  </div>
                  <div>
                    <span className="text-gray-400">Output: </span>
                    <code className="bg-gray-800/60 px-2 py-1 rounded text-blue-400">
                      {example.output}
                    </code>
                  </div>
                  {example.explanation && (
                    <div className="text-xs text-gray-400 mt-2">
                      <strong>Explanation:</strong> {example.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-3">Constraints</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              {problem.constraints.map((con, i) => (
                <li key={i}>{con}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

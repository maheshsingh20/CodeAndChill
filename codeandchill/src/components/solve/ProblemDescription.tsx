import React from "react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";

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
      <Card className="flex flex-col h-full bg-gray-950 border border-gray-800">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-8 w-2/3 bg-gray-800" />
          <Skeleton className="h-6 w-20 bg-gray-800" />
          <Skeleton className="h-20 w-full bg-gray-800" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full bg-gray-950 border border-gray-800">
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-100">
              {problem.title}
            </h1>
            <Badge
              className={`font-semibold text-sm ${
                difficultyColors[problem.difficulty]
              }`}
            >
              {problem.difficulty}
            </Badge>
          </div>

          <div className="space-y-6">
            {/* FIX: Applied direct text colors for visibility */}
            <div className="text-gray-400 space-y-4">
              {problem.description.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            {problem.examples.map((example, index) => (
              <div
                key={index}
                className="p-4 bg-gray-900 rounded-lg border border-gray-700"
              >
                <p className="font-semibold text-gray-200">
                  Example {index + 1}:
                </p>
                <pre className="bg-black/50 p-3 rounded-md mt-2 text-sm text-gray-300 overflow-auto">
                  <code>
                    <strong>Input:</strong> {example.input}
                    <br />
                    <strong>Output:</strong> {example.output}
                  </code>
                </pre>
                {example.explanation && (
                  <p className="mt-2 text-sm text-gray-400">
                    <strong>Explanation:</strong> {example.explanation}
                  </p>
                )}
              </div>
            ))}

            <div>
              <h3 className="font-semibold text-gray-200">Constraints:</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-400">
                {problem.constraints.map((con, i) => (
                  <li key={i}>{con}</li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

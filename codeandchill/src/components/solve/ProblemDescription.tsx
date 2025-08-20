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
    Easy: "bg-green-900/50 text-green-200 border-green-700",
    Medium: "bg-yellow-900/50 text-yellow-200 border-yellow-700",
    Hard: "bg-red-900/50 text-red-200 border-red-700",
  };

  if (loading || !problem) {
    return (
      <Card className="flex flex-col h-full border border-cyan-700 bg-black text-white">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-8 w-2/3 bg-gray-700" />
          <Skeleton className="h-6 w-20 bg-gray-700" />
          <Skeleton className="h-20 w-full bg-gray-700" />
          <Skeleton className="h-16 w-full bg-gray-700" />
          <Skeleton className="h-10 w-1/3 bg-gray-700" />
          <Skeleton className="h-24 w-full bg-gray-700" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full border border-cyan-700 bg-black text-white">
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-white">{problem.title}</h1>
            <Badge
              className={`font-semibold text-sm ${
                difficultyColors[problem.difficulty]
              }`}
            >
              {problem.difficulty}
            </Badge>
          </div>

          <div className="prose max-w-none text-white">
            {problem.description.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}

            {problem.examples.map((example, index) => (
              <div
                key={index}
                className="mt-6 p-4 bg-gray-900 border border-cyan-700"
              >
                <p className="font-semibold text-green-200">
                  Example {index + 1}:
                </p>
                <pre className="bg-black p-3 rounded-none text-sm border border-cyan-700 text-white overflow-auto">
                  <code>
                    <strong>Input:</strong> {example.input}
                    <br />
                    <strong>Output:</strong> {example.output}
                  </code>
                </pre>
                {example.explanation && (
                  <p className="mt-2 text-sm text-gray-300">
                    <strong>Explanation:</strong> {example.explanation}
                  </p>
                )}
              </div>
            ))}

            <h3 className="mt-6 font-semibold text-green-200">Constraints:</h3>
            <ul className="list-disc pl-5 bg-gray-900 border border-cyan-700 p-3 text-white">
              {problem.constraints.map((con, i) => (
                <li key={i}>{con}</li>
              ))}
            </ul>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

import React from 'react';
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Link } from "react-router-dom";
import { CheckCircle } from 'lucide-react';

const problemSetDetails = {
  id: "sda-sheet",
  name: "SDA Problem Set",
  description:
    "A curated list of 450+ DSA problems to master data structures and algorithms, curated by Striver.",
  problems: [
    { id: "arrays-1", title: "Sort an array of 0s, 1s and 2s", difficulty: "Easy", topic: "Arrays", solved: true },
    { id: "arrays-2", title: "Find the duplicate in an array of N+1 integers", difficulty: "Easy", topic: "Arrays", solved: true },
    { id: "strings-1", title: "Reverse a String", difficulty: "Easy", topic: "Strings", solved: false },
    { id: "dp-1", title: "Longest Common Subsequence", difficulty: "Medium", topic: "Dynamic Programming", solved: false },
    { id: "graphs-1", title: "BFS of graph", difficulty: "Medium", topic: "Graphs", solved: false },
  ]
};

export function ProblemSetDetailPage() {
  const { setId } = useParams<{ setId: string }>();

  const difficultyColors: Record<string, string> = {
    Easy: "text-green-600",
    Medium: "text-yellow-600",
    Hard: "text-red-600",
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-lime-100 via-gray-100 to-cyan-100">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-cyan-900">
            {problemSetDetails.name}
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-cyan-800/90">
            {problemSetDetails.description}
          </p>
        </header>

        {/* Table Card */}
        <main>
          <Card
            className="
              rounded-2xl
              shadow-xl
              border-2 border-cyan-200
              bg-gradient-to-br from-lime-100 via-gray-100 to-cyan-100
              overflow-hidden
              transition-all duration-300 ease-in-out
              hover:shadow-2xl hover:scale-[1.02]
            "
            role="region"
            aria-label={`${problemSetDetails.name} problems`}
          >
            <Table>
              <TableHeader className="bg-cyan-100/40">
                <TableRow>
                  <TableHead className="w-[80px] text-cyan-900">Status</TableHead>
                  <TableHead className="text-cyan-900">Problem</TableHead>
                  <TableHead className="hidden md:table-cell text-cyan-900">Topic</TableHead>
                  <TableHead className="text-right text-cyan-900">Difficulty</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {problemSetDetails.problems.map((problem) => (
                  <TableRow
                    key={problem.id}
                    className={`
                      transition-colors
                      hover:bg-cyan-50/60
                      ${problem.solved ? 'bg-lime-50/60' : ''}
                    `}
                  >
                    <TableCell className="text-center">
                      {problem.solved && <CheckCircle className="h-5 w-5 text-green-500" aria-hidden />}
                    </TableCell>

                    <TableCell>
                      <Link
                        to={`/solve/${problem.id}`}
                        className="font-semibold text-cyan-800 hover:text-cyan-900 hover:underline"
                        aria-label={`Open problem ${problem.title}`}
                      >
                        {problem.title}
                      </Link>
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary" className="bg-lime-100 text-lime-900 border-lime-200">
                        {problem.topic}
                      </Badge>
                    </TableCell>

                    <TableCell className={`text-right font-medium ${difficultyColors[problem.difficulty]}`}>
                      {problem.difficulty}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </main>
      </div>
    </div>
  );
}

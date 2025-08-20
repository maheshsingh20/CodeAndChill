import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton.tsx";

export function ProblemSetDetailPage() {
  const { setId } = useParams<{ setId: string }>();
  const [problemSet, setProblemSet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblemSet = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3001/api/problem-sets/${setId}`
        );
        const data = await response.json();
        setProblemSet(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (setId) fetchProblemSet();
  }, [setId]);

  const difficultyColors: Record<string, string> = {
    Easy: "text-green-400",
    Medium: "text-yellow-400",
    Hard: "text-red-400",
  };

  if (loading || !problemSet) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen flex items-center justify-center px-8">
        <Skeleton className="h-[60vh] w-full rounded-2xl bg-gray-700/30 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-cyan-200">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-cyan-400 drop-shadow-md">
            {problemSet.title}
          </h1>
          <p className="mt-4 text-lg text-cyan-300/80 max-w-2xl mx-auto">
            {problemSet.description}
          </p>
        </header>

        {/* Problems Table */}
        <main>
          <Card className="rounded-2xl shadow-2xl overflow-hidden border border-cyan-700 backdrop-blur-lg bg-gray-900/50">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-800/70">
                  <TableHead className="w-[80px] text-cyan-400">
                    Status
                  </TableHead>
                  <TableHead className="text-cyan-300">Problem</TableHead>
                  <TableHead className="hidden md:table-cell text-cyan-300">
                    Topic
                  </TableHead>
                  <TableHead className="text-right text-cyan-300">
                    Difficulty
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {problemSet.problems.map((problem: any) => (
                  <TableRow
                    key={problem.slug}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <TableCell className="text-center">
                      {problem.solved && (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/solve/${problem.slug}`}
                        className="font-semibold text-cyan-300 hover:text-cyan-400 transition-colors"
                      >
                        {problem.title}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant="secondary"
                        className="bg-cyan-700 text-cyan-200"
                      >
                        {problem.topic}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        difficultyColors[problem.difficulty]
                      }`}
                    >
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

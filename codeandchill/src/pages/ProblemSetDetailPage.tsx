/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
// FIX: Import Card from its own file
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle } from "lucide-react";

export function ProblemSetDetailPage() {
  const { setId } = useParams<{ setId: string }>();
  const [problemSet, setProblemSet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchProblemSet = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3001/api/problem-sets/${setId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to load data.");
        setProblemSet(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (setId) fetchProblemSet();
  }, [setId, token]);

  const difficultyColors: Record<string, string> = {
    Easy: "text-green-400",
    Medium: "text-yellow-400",
    Hard: "text-red-400",
  };

  if (loading || !problemSet) {
    return (
      <div className="container p-8">
        <Skeleton className="h-[60vh] w-full" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen text-foreground relative">
      {/* Consistent Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            {problemSet.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {problemSet.description}
          </p>
        </header>
        <main>
          <Card className="rounded-2xl shadow-2xl overflow-hidden border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Status</TableHead>
                  <TableHead>Problem</TableHead>
                  <TableHead className="hidden md:table-cell">Topic</TableHead>
                  <TableHead className="text-right">Difficulty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {problemSet.problems.map((problem: any) => (
                  <TableRow key={problem.slug} className="hover:bg-muted/50">
                    <TableCell className="text-center">
                      {problem.solved && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/solve/${problem.slug}`}
                        className="font-semibold text-primary hover:underline"
                      >
                        {problem.title}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary">{problem.topic}</Badge>
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

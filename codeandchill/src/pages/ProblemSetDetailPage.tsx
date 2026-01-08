/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Clock,
  Users,
  Trophy,
  ArrowLeft,
  Play,
  BookOpen,
  Target,
  TrendingUp
} from "lucide-react";

export function ProblemSetDetailPage() {
  const { setId } = useParams<{ setId: string }>();
  const [problemSet, setProblemSet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchProblemSet = async () => {
      setLoading(true);
      try {
        const headers: any = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(
          `http://localhost:3001/api/problem-sets/${setId}`,
          { headers }
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

  const difficultyColors: Record<string, { text: string; bg: string; border: string }> = {
    Easy: { text: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/30" },
    Medium: { text: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/30" },
    Hard: { text: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30" },
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full">
        <div className="container mx-auto max-w-7xl px-6 section-padding">
          {/* Loading Header */}
          <div className="mb-12">
            <div className="h-8 bg-gray-700/20 rounded-lg w-32 mb-6 animate-pulse"></div>
            <div className="h-12 bg-gray-700/20 rounded-lg w-96 mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-700/15 rounded-lg w-64 animate-pulse"></div>
          </div>

          {/* Loading Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-800/20 rounded-xl border border-gray-700/20 animate-pulse"></div>
            ))}
          </div>

          {/* Loading Table */}
          <div className="h-96 bg-gray-800/20 rounded-xl border border-gray-700/20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!problemSet) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Problem Set Not Found</h2>
          <p className="text-gray-400 mb-6">The problem set you're looking for doesn't exist.</p>
          <Link to="/problems">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Problem Sets
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const solvedCount = problemSet.problems?.filter((p: any) => p.solved).length || 0;
  const totalCount = problemSet.problems?.length || 0;
  const progressPercentage = totalCount > 0 ? (solvedCount / totalCount) * 100 : 0;

  const difficultyStats = problemSet.problems?.reduce((acc: any, problem: any) => {
    acc[problem.difficulty] = (acc[problem.difficulty] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto max-w-7xl px-6 section-padding">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link to="/problems">
            <Button variant="ghost" className="text-gray-400 hover:text-gray-200 p-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Problem Sets
            </Button>
          </Link>
        </div>

        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4 leading-tight">
                {problemSet.title}
              </h1>
              <p className="text-lg text-gray-400 mb-6 leading-relaxed max-w-3xl">
                {problemSet.description}
              </p>

              {/* Progress Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">
                    Progress: {solvedCount} of {totalCount} problems solved
                  </span>
                  <span className="text-sm font-medium text-gray-300">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <Progress
                  value={progressPercentage}
                  className="h-2 bg-gray-800"
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="flex-shrink-0">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Solving
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gray-800/40 border-gray-700/40 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-gray-100 mb-1">{totalCount}</div>
              <div className="text-sm text-gray-400">Total Problems</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/40 border-gray-700/40 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-gray-100 mb-1">{solvedCount}</div>
              <div className="text-sm text-gray-400">Solved</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/40 border-gray-700/40 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-gray-100 mb-1">{totalCount - solvedCount}</div>
              <div className="text-sm text-gray-400">Remaining</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/40 border-gray-700/40 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-gray-100 mb-1">{Math.round(progressPercentage)}%</div>
              <div className="text-sm text-gray-400">Complete</div>
            </CardContent>
          </Card>
        </div>

        {/* Problems Table */}
        <Card className="bg-gray-800/40 border-gray-700/40 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-gray-100">Problems</CardTitle>
            <CardDescription className="text-gray-400">
              Click on any problem to start solving
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700/40 hover:bg-gray-800/20">
                  <TableHead className="w-[80px] text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Problem</TableHead>
                  <TableHead className="hidden md:table-cell text-gray-300">Topic</TableHead>
                  <TableHead className="text-right text-gray-300">Difficulty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {problemSet.problems?.map((problem: any, index: number) => (
                  <TableRow
                    key={problem.slug}
                    className="border-gray-700/30 hover:bg-gray-800/30 transition-colors duration-200"
                  >
                    <TableCell className="text-center">
                      {problem.solved ? (
                        <CheckCircle className="h-5 w-5 text-green-400 mx-auto" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-600 rounded-full mx-auto"></div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/solve/${problem.slug}`}
                        className="group flex items-center gap-3"
                      >
                        <span className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center text-xs font-medium text-gray-400 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors duration-200">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-200 group-hover:text-white transition-colors duration-200">
                          {problem.title}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant="secondary"
                        className="bg-gray-700/50 text-gray-300 border border-gray-600/30"
                      >
                        {problem.topic}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        className={`${difficultyColors[problem.difficulty]?.bg} ${difficultyColors[problem.difficulty]?.text} ${difficultyColors[problem.difficulty]?.border} border font-medium`}
                      >
                        {problem.difficulty}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
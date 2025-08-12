import React from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { ContestSidebar } from "@/components/contests/ContestSidebar.tsx";
import { Link } from "react-router-dom";

const contestDetails = {
  id: "algomaster-aug25",
  name: "AlgoMaster Monthly Finals",
  status: "Open",
  endsIn: "2025-08-30T20:00:00",
  level: "Intermediate",
  description:
    "The monthly finals for our AlgoMaster series. Compete against the best to solve 5 challenging algorithmic problems in 3 hours.",
  rules: [
    "This is an individual participation contest.",
    "There are 5 problems to be solved in 3 hours.",
    "Submissions are accepted in C++, Java, and Python.",
    "Any plagiarism will result in disqualification.",
  ],
  prizes: [
    "Cash Prizes for Top 3",
    "T-shirts for Top 100",
    "Certificates for all participants",
  ],
  problems: [
    { id: "A", title: "Array Manipulation", difficulty: "Easy", score: 100, solved: true },
    { id: "B", title: "Tree Traversal", difficulty: "Medium", score: 250, solved: false },
    { id: "C", title: "Dynamic Programming", difficulty: "Medium", score: 500, solved: false },
    { id: "D", title: "Graph Theory", difficulty: "Hard", score: 750, solved: false },
    { id: "E", title: "Advanced Algorithms", difficulty: "Hard", score: 1000, solved: false },
  ],
};

export function ContestDetailPage() {
  const { contestId } = useParams<{ contestId: string }>();

  const difficultyColors: Record<string, string> = {
    Easy: "text-green-700 font-semibold",
    Medium: "text-yellow-700 font-semibold",
    Hard: "text-red-700 font-semibold",
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-lime-50 via-gray-100 to-cyan-50">
      {/* Page Header */}
      <header className="py-12 bg-white border-b border-cyan-200 rounded-b-2xl shadow-sm">
        <div className="container mx-auto max-w-7xl px-6 md:px-12">
          <Badge
            variant="outline"
            className="mb-3 rounded-full px-4 py-1 text-cyan-800 border-cyan-300 font-semibold"
          >
            {contestDetails.level}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-cyan-900 leading-tight">
            {contestDetails.name}
          </h1>
          <p className="mt-5 max-w-3xl text-lg md:text-xl text-cyan-800 font-medium leading-relaxed">
            {contestDetails.description}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-6 md:px-12 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-14 items-start">
          {/* Left side: Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="problems" className="w-full">
              <TabsList className="grid grid-cols-3 max-w-md rounded-lg border border-cyan-200 bg-white shadow-md">
                <TabsTrigger
                  value="problems"
                  className="text-cyan-900 font-semibold hover:bg-cyan-100 focus:bg-cyan-200"
                >
                  Problems
                </TabsTrigger>
                <TabsTrigger
                  value="rules"
                  className="text-cyan-900 font-semibold hover:bg-cyan-100 focus:bg-cyan-200"
                >
                  Rules
                </TabsTrigger>
                <TabsTrigger
                  value="leaderboard"
                  className="text-cyan-900 font-semibold hover:bg-cyan-100 focus:bg-cyan-200"
                >
                  Leaderboard
                </TabsTrigger>
              </TabsList>

              {/* Problems Tab */}
              <TabsContent value="problems" className="mt-8">
                <Card className="rounded-2xl border border-cyan-200 bg-white shadow-md">
                  <Table className="overflow-x-auto">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]">#</TableHead>
                        <TableHead>Problem Title</TableHead>
                        <TableHead className="text-center">Difficulty</TableHead>
                        <TableHead className="text-right w-[80px]">Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contestDetails.problems.map((problem) => (
                        <TableRow
                          key={problem.id}
                          className={`transition-colors cursor-pointer ${
                            problem.solved ? "bg-green-100 hover:bg-green-200" : "hover:bg-cyan-50"
                          }`}
                        >
                          <TableCell className="font-semibold text-cyan-900">{problem.id}</TableCell>
                          <TableCell>
                            <Link
                              to={`/problems/${problem.id}`}
                              className="font-semibold text-cyan-900 hover:text-primary hover:underline"
                            >
                              {problem.title}
                            </Link>
                          </TableCell>
                          <TableCell className={`text-center ${difficultyColors[problem.difficulty]}`}>
                            {problem.difficulty}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-cyan-900">
                            {problem.score}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              {/* Rules Tab */}
              <TabsContent value="rules" className="mt-8">
                <Card className="rounded-2xl border border-cyan-200 bg-white shadow-md p-8">
                  <CardTitle className="text-2xl font-bold text-cyan-900 mb-6">
                    Contest Rules
                  </CardTitle>
                  <ul className="list-disc pl-6 space-y-3 text-cyan-700 font-medium leading-relaxed">
                    {contestDetails.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>

                  <div className="mt-10">
                    <CardTitle className="text-2xl font-bold text-cyan-900 mb-4">
                      Prizes
                    </CardTitle>
                    <ul className="list-disc pl-6 space-y-3 text-cyan-700 font-medium leading-relaxed">
                      {contestDetails.prizes.map((prize, idx) => (
                        <li key={idx}>{prize}</li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </TabsContent>

              {/* Leaderboard Tab */}
              <TabsContent value="leaderboard" className="mt-8">
                <Card className="rounded-2xl border border-cyan-200 bg-white shadow-md p-10 text-center">
                  <CardTitle className="text-2xl font-bold text-cyan-900">
                    Leaderboard
                  </CardTitle>
                  <p className="mt-4 text-cyan-700 font-medium text-lg">
                    The leaderboard will be available after the contest begins.
                  </p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right side: Sticky Sidebar */}
          <div className="lg:sticky top-28">
            <ContestSidebar contest={contestDetails} />
          </div>
        </div>
      </div>
    </div>
  );
}

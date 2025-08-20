import React from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card.tsx";
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
    {
      id: "A",
      title: "Array Manipulation",
      difficulty: "Easy",
      score: 100,
      solved: true,
    },
    {
      id: "B",
      title: "Tree Traversal",
      difficulty: "Medium",
      score: 250,
      solved: false,
    },
    {
      id: "C",
      title: "Dynamic Programming",
      difficulty: "Medium",
      score: 500,
      solved: false,
    },
    {
      id: "D",
      title: "Graph Theory",
      difficulty: "Hard",
      score: 750,
      solved: false,
    },
    {
      id: "E",
      title: "Advanced Algorithms",
      difficulty: "Hard",
      score: 1000,
      solved: false,
    },
  ],
};

export function ContestDetailPage() {
  const { contestId } = useParams<{ contestId: string }>();

  const difficultyColors: Record<string, string> = {
    Easy: "text-pink-400 font-semibold",
    Medium: "text-red-400 font-semibold",
    Hard: "text-violet-400 font-semibold",
  };

  return (
    <div className="min-h-screen w-full bg-gray-950 text-white font-sans">
      {/* Page Header */}
      <header className="py-12 border-b border-gray-800">
        <div className="container mx-auto max-w-7xl px-6 md:px-12">
          <Badge
            variant="outline"
            className="mb-3 rounded-full px-4 py-1 font-semibold border-gradient-pink-red-violet bg-gradient-to-r from-pink-400 via-red-400 to-violet-400 text-transparent bg-clip-text"
          >
            {contestDetails.level}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gradient-pink-red-violet bg-clip-text text-transparent mb-4">
            {contestDetails.name}
          </h1>
          <p className="mt-5 max-w-3xl text-lg md:text-xl text-gray-300 font-medium leading-relaxed">
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
              <TabsList className="grid grid-cols-3 max-w-md rounded-lg border border-red-600 bg-gray-900">
                {["problems", "rules", "leaderboard"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="text-gray-300 font-semibold hover:text-white hover:bg-gray-800 focus:bg-gray-700 transition-all"
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Problems Tab */}
              <TabsContent value="problems" className="mt-8">
                <Card className="border border-red-600 bg-gray-900 hover:border-gradient-pink-red-violet transition-all rounded-xl">
                  <Table className="overflow-x-auto text-gray-300">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]">#</TableHead>
                        <TableHead>Problem Title</TableHead>
                        <TableHead className="text-center">
                          Difficulty
                        </TableHead>
                        <TableHead className="text-right w-[80px]">
                          Score
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contestDetails.problems.map((problem) => (
                        <TableRow
                          key={problem.id}
                          className={`transition-colors cursor-pointer ${
                            problem.solved
                              ? "bg-gray-800 hover:bg-gray-700"
                              : "hover:bg-gray-850"
                          }`}
                        >
                          <TableCell
                            className={`font-semibold ${
                              difficultyColors[problem.difficulty]
                            }`}
                          >
                            {problem.id}
                          </TableCell>
                          <TableCell>
                            <Link
                              to={`/problems/${problem.id}`}
                              className="font-semibold text-gray-200 hover:text-white hover:underline"
                            >
                              {problem.title}
                            </Link>
                          </TableCell>
                          <TableCell
                            className={`text-center ${
                              difficultyColors[problem.difficulty]
                            }`}
                          >
                            {problem.difficulty}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-gray-200">
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
                <Card className="border border-red-600 bg-gray-900 p-8 hover:border-gradient-pink-red-violet transition-all rounded-xl">
                  <CardTitle className="text-2xl font-bold text-gradient-pink-red-violet bg-clip-text text-transparent mb-6">
                    Contest Rules
                  </CardTitle>
                  <ul className="list-disc pl-6 space-y-3 text-gray-300 font-medium leading-relaxed">
                    {contestDetails.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>

                  <div className="mt-10">
                    <CardTitle className="text-2xl font-bold text-gradient-pink-red-violet bg-clip-text text-transparent mb-4">
                      Prizes
                    </CardTitle>
                    <ul className="list-disc pl-6 space-y-3 text-gray-300 font-medium leading-relaxed">
                      {contestDetails.prizes.map((prize, idx) => (
                        <li key={idx}>{prize}</li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </TabsContent>

              {/* Leaderboard Tab */}
              <TabsContent value="leaderboard" className="mt-8">
                <Card className="border border-red-600 bg-gray-900 p-10 text-center hover:border-gradient-pink-red-violet transition-all rounded-xl">
                  <CardTitle className="text-2xl font-bold text-gradient-pink-red-violet bg-clip-text text-transparent">
                    Leaderboard
                  </CardTitle>
                  <p className="mt-4 text-gray-300 font-medium text-lg">
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

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
          .font-sans { font-family: 'Poppins', sans-serif; }
          .border-gradient-pink-red-violet {
            border-image: linear-gradient(90deg, #f72585, #ff4d6d, #7209b7);
            border-image-slice: 1;
          }
          .text-gradient-pink-red-violet {
            background: linear-gradient(90deg, #f72585, #ff4d6d, #7209b7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}
      </style>
    </div>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Target, CheckCircle, AlertCircle, Lightbulb, Code } from "lucide-react";

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
    Easy: "from-green-400 to-emerald-500",
    Medium: "from-yellow-400 to-orange-500",
    Hard: "from-red-400 to-rose-500",
  };

  const difficultyBgColors: Record<Problem["difficulty"], string> = {
    Easy: "bg-green-500/10 border-green-500/20",
    Medium: "bg-yellow-500/10 border-yellow-500/20",
    Hard: "bg-red-500/10 border-red-500/20",
  };

  if (loading || !problem) {
    return (
      <Card className="neon-glass-card rounded-xl border-gray-700/50">
        <CardContent className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 w-2/3 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-700/50 rounded animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-700/50 rounded animate-pulse"></div>
            <div className="h-4 w-5/6 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="h-4 w-4/5 bg-gray-700/50 rounded animate-pulse"></div>
          </div>
          <div className="h-32 w-full bg-gray-700/50 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
    >
      <Card className="neon-glass-card rounded-xl border-gray-700/50 overflow-hidden flex-1 flex flex-col">
        <CardContent className="p-0 flex flex-col flex-1">
          {/* Header */}
          <div className="p-8 border-b border-gray-700/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold neon-text-blue">Problem Statement</h2>
            </div>

            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold neon-text-blue mb-2">
                  {problem.title}
                </h1>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`${difficultyBgColors[problem.difficulty]} font-semibold px-3 py-1`}
                  >
                    <span className={`bg-gradient-to-r ${difficultyColors[problem.difficulty]} bg-clip-text text-transparent`}>
                      {problem.difficulty}
                    </span>
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-8 space-y-8 pb-16">
              {/* Description */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold neon-text-purple">Description</h3>
                </div>
                <div className="text-gray-300 leading-relaxed space-y-3 pl-7">
                  {problem.description.split("\n").map((line, i) => (
                    <p key={i} className="text-gray-300">{line}</p>
                  ))}
                </div>
              </motion.div>

              {/* Examples */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold neon-text-orange">Examples</h3>
                </div>

                <div className="space-y-4 pl-7">
                  {problem.examples.map((example, index) => (
                    <motion.div
                      key={index}
                      className="neon-glass-card rounded-lg p-6 border border-gray-700/30"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                          {index + 1}
                        </div>
                        <span className="font-semibold text-gray-200">
                          Example {index + 1}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Code className="w-4 h-4 text-green-400" />
                              <span className="text-sm font-medium text-gray-400">Input:</span>
                            </div>
                            <code className="block bg-gray-900/60 border border-gray-700/50 px-3 py-2 rounded-md text-green-400 text-sm font-mono break-all">
                              {example.input}
                            </code>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-blue-400" />
                              <span className="text-sm font-medium text-gray-400">Output:</span>
                            </div>
                            <code className="block bg-gray-900/60 border border-gray-700/50 px-3 py-2 rounded-md text-blue-400 text-sm font-mono break-all">
                              {example.output}
                            </code>
                          </div>
                        </div>

                        {example.explanation && (
                          <div className="mt-4 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-md">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-sm font-medium text-yellow-400">Explanation:</span>
                                <p className="text-sm text-gray-300 mt-1">{example.explanation}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Constraints */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <h3 className="text-lg font-semibold text-red-400">Constraints</h3>
                </div>

                <div className="pl-7">
                  <div className="neon-glass-card rounded-lg p-4 border border-red-500/20 bg-red-500/5">
                    <ul className="space-y-2">
                      {problem.constraints.map((constraint, i) => (
                        <motion.li
                          key={i}
                          className="flex items-start gap-3 text-gray-300"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.05 }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                          <span className="text-sm break-words">{constraint}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Tips Section */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="neon-glass-card rounded-lg p-6 border border-cyan-500/20 bg-cyan-500/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-cyan-400" />
                    <h4 className="font-semibold text-cyan-400">Pro Tips</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>Read the problem statement carefully and understand the input/output format</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>Test your solution with the provided examples before submitting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>Consider edge cases and constraints when designing your algorithm</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}

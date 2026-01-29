/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ProblemDescription } from "@/components/solve/ProblemDescription";
import { CodeEditorPanel } from "@/components/solve/CodeEditorPanel";
import { ArrowLeft, Code2, Timer, Trophy, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Smart problem type detection based on title and description
function detectProblemType(title?: string, description?: string): string {
  const titleLower = (title || '').toLowerCase();
  const descLower = (description || '').toLowerCase();

  // Two Sum variations
  if (titleLower.includes('two sum') || titleLower.includes('2sum')) {
    return 'two-sum';
  }

  // Maximum Subarray variations
  if (titleLower.includes('maximum subarray') ||
    titleLower.includes('max subarray') ||
    titleLower.includes('kadane') ||
    descLower.includes('contiguous subarray')) {
    return 'maximum-subarray';
  }

  // Linked List variations
  if (titleLower.includes('reverse linked list') ||
    titleLower.includes('linked list') ||
    descLower.includes('listnode')) {
    return 'reverse-linked-list';
  }

  // Binary Tree variations
  if (titleLower.includes('binary tree') ||
    titleLower.includes('tree') ||
    descLower.includes('treenode')) {
    return 'binary-tree';
  }

  // String problems
  if (titleLower.includes('palindrome') ||
    titleLower.includes('string') ||
    titleLower.includes('anagram')) {
    return 'string';
  }

  // Array problems (default for most)
  if (titleLower.includes('array') ||
    descLower.includes('array') ||
    descLower.includes('nums')) {
    return 'array';
  }

  // Default fallback
  return 'array';
}

export function SolveProblemPage() {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const [problemData, setProblemData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblemData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3001/api/problems/${problemId}`
        );
        const data = await response.json();
        setProblemData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (problemId) fetchProblemData();
  }, [problemId]);

  const difficultyColors = {
    Easy: "from-green-400 to-emerald-500",
    Medium: "from-yellow-400 to-orange-500",
    Hard: "from-red-400 to-rose-500"
  };

  const difficultyBgColors = {
    Easy: "bg-green-500/10 border-green-500/20",
    Medium: "bg-yellow-500/10 border-yellow-500/20",
    Hard: "bg-red-500/10 border-red-500/20"
  };

  if (loading || !problemData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto max-w-7xl px-4 py-6">
          {/* Header Skeleton */}
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-10 h-10 bg-gray-800/50 rounded-lg animate-pulse"></div>
            <div className="h-8 w-64 bg-gray-800/50 rounded animate-pulse"></div>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Problem Description Skeleton */}
            <motion.div
              className="neon-glass-card rounded-xl p-8 space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
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
            </motion.div>

            {/* Code Editor Skeleton */}
            <motion.div
              className="neon-glass-card rounded-xl p-8 space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-center">
                <div className="h-6 w-1/2 bg-gray-700/50 rounded animate-pulse"></div>
                <div className="h-8 w-32 bg-gray-700/50 rounded animate-pulse"></div>
              </div>
              <div className="h-80 w-full bg-gray-700/50 rounded animate-pulse"></div>
              <div className="flex gap-3">
                <div className="h-10 w-24 bg-gray-700/50 rounded animate-pulse"></div>
                <div className="h-10 w-32 bg-gray-700/50 rounded animate-pulse"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-6 min-h-screen flex flex-col">
        {/* Enhanced Header */}
        <motion.div
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4 flex-shrink-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="neon-glass-card border-gray-700/50 hover:border-blue-500/50 text-gray-300 hover:text-white transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg neon-glass-card">
                <Code2 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold neon-text-blue">
                  {problemData.title}
                </h1>
                <p className="text-gray-400 text-sm">
                  {problemData.topic} • {problemData.testCases?.length || 0} test cases
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Badge
              className={`${difficultyBgColors[problemData.difficulty as keyof typeof difficultyBgColors]} font-semibold px-3 py-1`}
            >
              <span className={`bg-gradient-to-r ${difficultyColors[problemData.difficulty as keyof typeof difficultyColors]} bg-clip-text text-transparent`}>
                {problemData.difficulty}
              </span>
            </Badge>

            {/* Stats */}
            <div className="hidden sm:flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Timer className="w-4 h-4" />
                <span>~15 min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>1.2k solved</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                <span>85% success</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content - Flexible Layout */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-0 overflow-hidden">
          {/* Enhanced Problem Description */}
          <motion.div
            className="flex flex-col min-h-0 overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ProblemDescription
              problem={problemData}
              loading={false}
            />
          </motion.div>

          {/* Enhanced Code Editor */}
          <motion.div
            className="flex flex-col min-h-0 overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CodeEditorPanel
              testCases={problemData.testCases}
              problemId={problemData._id || problemId || ''}
            />
          </motion.div>
        </div>

        {/* Bottom Stats Bar */}
        <motion.div
          className="mt-6 neon-glass-card rounded-xl p-4 flex-shrink-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Dynamic Test Execution</span>
              </div>
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span>Multi-language Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-green-400" />
                <span>Real-time Feedback</span>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              Powered by CodeAndChill Engine
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

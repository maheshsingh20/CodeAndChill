import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Lightbulb, Code, ArrowRight, Zap } from 'lucide-react';

export const ProblemSolverPage: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);

  const solveProblem = async () => {
    if (!problem.trim()) return;

    setLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      setSolution(`Here's a step-by-step approach to solve your problem:

1. **Understand the Problem**: Break down the requirements
2. **Plan the Solution**: Think about the algorithm or approach
3. **Implement**: Write clean, readable code
4. **Test**: Verify your solution works correctly
5. **Optimize**: Improve performance if needed

Example solution structure:
\`\`\`python
def solve_problem():
    # Your solution here
    pass
\`\`\`

This is a placeholder response. In a real implementation, this would connect to an AI service to provide actual problem-solving assistance.`);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lightbulb className="h-12 w-12 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
              Problem Solver
            </h1>
          </div>
          <p className="text-xl bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent max-w-3xl mx-auto">
            Get step-by-step solutions and hints for your coding problems
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 rounded-md p-6 shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Code className="text-blue-400" size={20} />
              <h2 className="text-xl font-semibold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                Describe Your Problem
              </h2>
            </div>

            <Textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe your coding problem here... For example: 'I need to find the maximum element in an array' or 'How do I reverse a linked list?'"
              className="min-h-[300px] bg-gray-800 border-gray-600 text-white mb-4"
            />

            <Button
              onClick={solveProblem}
              disabled={loading || !problem.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Problem...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap size={16} />
                  Get Solution
                  <ArrowRight size={16} />
                </div>
              )}
            </Button>
          </div>

          {/* Solution Section */}
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 rounded-md p-6 shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="text-yellow-400" size={20} />
              <h2 className="text-xl font-semibold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                Solution & Hints
              </h2>
            </div>

            <div className="min-h-[300px] bg-gray-800 border border-gray-600 rounded-md p-4">
              {solution ? (
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent">
                    {solution}
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <Lightbulb className="mx-auto text-gray-600 mb-4" size={48} />
                    <p className="bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 bg-clip-text text-transparent">
                      Enter your problem description and click "Get Solution" to receive step-by-step guidance
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 rounded-md p-6 text-center shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
            <Code className="mx-auto text-blue-400 mb-3" size={32} />
            <h3 className="text-lg font-semibold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">
              Algorithm Analysis
            </h3>
            <p className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent text-sm">
              Get detailed explanations of algorithms and data structures
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 rounded-md p-6 text-center shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
            <Lightbulb className="mx-auto text-yellow-400 mb-3" size={32} />
            <h3 className="text-lg font-semibold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">
              Smart Hints
            </h3>
            <p className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent text-sm">
              Receive progressive hints without spoiling the solution
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 rounded-md p-6 text-center shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
            <Zap className="mx-auto text-purple-400 mb-3" size={32} />
            <h3 className="text-lg font-semibold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">
              Multiple Languages
            </h3>
            <p className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent text-sm">
              Solutions provided in Python, JavaScript, Java, and more
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
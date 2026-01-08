/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProblemDescription } from "@/components/solve/ProblemDescription";
import { CodeEditorPanel } from "@/components/solve/CodeEditorPanel";

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

  if (loading || !problemData) {
    return (
      <div className="min-h-screen w-full">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-8">
            <div className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm rounded-lg p-6 space-y-4">
              <div className="h-8 w-2/3 bg-gray-700/50 rounded animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-700/50 rounded animate-pulse"></div>
              <div className="h-20 w-full bg-gray-700/50 rounded animate-pulse"></div>
            </div>
            <div className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm rounded-lg p-6 space-y-4">
              <div className="h-8 w-1/2 bg-gray-700/50 rounded animate-pulse"></div>
              <div className="h-64 w-full bg-gray-700/50 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-8">
          {/* Problem Description */}
          <div className="space-y-6">
            <ProblemDescription
              problem={problemData}
              loading={false}
            />
          </div>

          {/* Code Editor */}
          <div className="space-y-6">
            <CodeEditorPanel
              testCases={problemData.testCases}
              problemId={problemData._id || problemId || ''}
              problemType={
                problemData.type ||
                problemData.problemType ||
                detectProblemType(problemData.title, problemData.description) ||
                "array"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

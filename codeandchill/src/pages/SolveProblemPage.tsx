import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProblemDescription } from "@/components/solve/ProblemDescription.tsx";
import { CodeEditorPanel } from "@/components/solve/CodeEditorPanel.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 h-[calc(100vh-4rem)] bg-gray-900">
        <Skeleton className="h-full w-full animate-pulse bg-gray-700/50" />
        <Skeleton className="h-full w-full animate-pulse bg-gray-700/50" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 h-[calc(100vh-4rem)] bg-gray-900 text-white">
      {/* Problem Description */}
      <div className="h-full overflow-auto">
        <ProblemDescription
          problem={problemData}
          loading={false}
          // Pass a flag for dark theme inside ProblemDescription
        />
      </div>

      {/* Code Editor */}
      <div className="h-full overflow-auto">
        <CodeEditorPanel testCases={problemData.testCases} />
      </div>
    </div>
  );
}

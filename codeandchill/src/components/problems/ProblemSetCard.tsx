import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Code, CheckCircle } from "lucide-react";

interface ProblemSetCardProps {
  set: {
    slug: string;
    title: string;
    author: string;
    description: string;
    problemsCount: number;
    icon: React.ReactNode;
  };
}

interface ProblemSetProgress {
  totalProblems: number;
  solvedProblems: number;
  attemptedProblems: number;
}

export function ProblemSetCard({ set }: ProblemSetCardProps) {
  const [progress, setProgress] = useState<ProblemSetProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProblemSetProgress();
  }, [set.slug]);

  const fetchProblemSetProgress = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:3001/api/problem-sets/${set.slug}/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProgress(data);
      }
    } catch (error) {
      console.error('Error fetching problem set progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = () => {
    if (!progress || progress.totalProblems === 0) return 0;
    return Math.round((progress.solvedProblems / progress.totalProblems) * 100);
  };

  const isCompleted = progress && progress.solvedProblems === progress.totalProblems && progress.totalProblems > 0;

  return (
    <div className="group h-full">
      <Link to={`/problems/${set.slug}`} className="block h-full">
        <div className="h-full min-h-[320px] bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md group-hover:border-gray-500 transition-all duration-300">
                  <div className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                    {set.icon ? (
                      <span className="w-6 h-6">{set.icon}</span>
                    ) : (
                      <Code className="w-6 h-6" />
                    )}
                  </div>
                </div>
                {isCompleted && (
                  <div className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-md text-xs font-medium">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span className="text-green-400">Completed</span>
                    </div>
                  </div>
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
            </div>

            {/* Content */}
            <div className="flex-grow space-y-4">
              {/* Title */}
              <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-blue-100 group-hover:to-blue-200 transition-all duration-300 leading-tight">
                {set.title}
              </h3>

              {/* Author */}
              <div className="flex items-center gap-2 text-sm">
                <Users size={14} className="text-gray-500" />
                <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                  by {set.author}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300 leading-relaxed">
                {set.description}
              </p>

              {/* Progress Bar */}
              {progress && !loading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">Progress</span>
                    <span className={`font-medium ${isCompleted ? 'text-green-400' : 'text-blue-400'}`}>
                      {progress.solvedProblems}/{progress.totalProblems} solved ({getProgressPercentage()}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-400' : 'bg-blue-400'}`}
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div className="px-3 py-1 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md text-xs font-medium">
                  <span className="bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
                    {set.problemsCount} Problems
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300">
                    {isCompleted ? 'Review' : 'Start Solving'}
                  </span>
                  <div className="w-4 h-0.5 bg-gray-600 rounded-sm group-hover:bg-gray-500 transition-colors duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
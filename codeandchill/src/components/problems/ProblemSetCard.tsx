import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Code, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    <Card className={`group h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 border-gray-700/40 bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-sm overflow-hidden ${isCompleted ? 'ring-2 ring-green-500/30' : ''}`}>
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${isCompleted ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-400' : 'bg-gradient-to-r from-transparent via-blue-400/60 to-transparent opacity-0 group-hover:opacity-100'} transition-opacity duration-300`}></div>

      {/* Completion badge */}
      {isCompleted && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1 bg-green-500/20 border border-green-500/30 rounded-full px-2 py-1">
            <CheckCircle className="w-3 h-3 text-green-400 fill-current" />
            <span className="text-xs text-green-400 font-medium">Completed</span>
          </div>
        </div>
      )}

      <CardHeader className="pb-6 relative">
        <div className="flex items-start gap-4">
          <div className={`p-4 ${isCompleted ? 'bg-green-500/20 border-green-500/30' : 'bg-blue-500/20 border-blue-500/30'} border rounded-xl group-hover:${isCompleted ? 'bg-green-500/30 border-green-400/50' : 'bg-blue-500/30 border-blue-400/50'} transition-all duration-300 group-hover:scale-110 shadow-lg`}>
            <div className={`${isCompleted ? 'text-green-400 group-hover:text-green-300' : 'text-blue-400 group-hover:text-blue-300'} transition-colors duration-300 w-6 h-6 flex items-center justify-center`}>
              {set.icon ? (
                React.cloneElement(set.icon as React.ReactElement, {
                  className: "w-6 h-6"
                })
              ) : (
                <Code className="w-6 h-6" />
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors duration-300 leading-tight mb-2 relative">
              {set.title}
              {/* Animated underline */}
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isCompleted ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-blue-400 to-blue-600'} transition-all duration-300 group-hover:w-full`}></span>
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
              <Users className="w-3 h-3" />
              by {set.author}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-6 px-6">
        <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300 mb-4">
          {set.description}
        </p>

        {/* Progress bar */}
        {progress && !loading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Progress</span>
              <span className={`font-medium ${isCompleted ? 'text-green-400' : 'text-blue-400'}`}>
                {progress.solvedProblems}/{progress.totalProblems} solved ({getProgressPercentage()}%)
              </span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${isCompleted ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-blue-500 to-blue-400'}`}
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-6 px-6 pb-6 border-t border-gray-700/40 group-hover:border-gray-600/50 transition-colors duration-300">
        <Badge
          variant="secondary"
          className="bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/30 px-3 py-1.5 text-xs font-medium"
        >
          {set.problemsCount} Problems
        </Badge>

        <Link to={`/problems/${set.slug}`}>
          <Button
            size="sm"
            className={`${isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-all duration-300 group-hover:scale-105 shadow-lg hover:shadow-xl px-4 py-2 font-semibold`}
          >
            {isCompleted ? 'Review' : 'Start Solving'}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>

      {/* Corner accent */}
      <div className={`absolute top-0 right-0 w-20 h-20 ${isCompleted ? 'bg-gradient-to-bl from-green-500/10 to-transparent' : 'bg-gradient-to-bl from-blue-500/10 to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>

      {/* Hover glow effect */}
      <div className={`absolute inset-0 ${isCompleted ? 'bg-gradient-to-br from-green-500/5 via-transparent to-green-500/5' : 'bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
    </Card>
  );
}
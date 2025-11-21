/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
interface Option {
  text: string;
  isCorrect: boolean;
}
interface Question {
  questionText: string;
  options: Option[];
  explanation: string;
}
interface Quiz {
  title: string;
  questions: Question[];
}
interface Answer {
  questionIndex: number;
  selectedOptionIndex: number;
  isCorrect: boolean;
}
interface Result {
  score: number;
  totalQuestions: number;
  answers: Answer[];
}
interface ResultData {
  result: Result;
  quiz: Quiz;
}

export function QuizResultPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      setError(null);
      if (!attemptId || attemptId === "undefined") {
        setError("No attempt ID found in URL.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:3001/api/quizzes/results/${attemptId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!response.ok) throw new Error("Failed to fetch quiz results.");
        const data = await response.json();
        setResultData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [attemptId, token]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl py-12 space-y-8">
        <Skeleton className="h-48 w-full rounded-3xl bg-gray-800/50" />
        <Skeleton className="h-64 w-full rounded-3xl bg-gray-800/50" />
      </div>
    );
  }

  if (error || !resultData) {
    return (
      <div className="container p-8 text-center text-red-500">
        {error || "Could not load results."}
      </div>
    );
  }

  const { result, quiz } = resultData;
  const percentage = ((result.score / result.totalQuestions) * 100).toFixed(0);

  return (
    <div className="min-h-screen text-gray-100 py-12 px-6 relative">
      {/* Consistent Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="container mx-auto max-w-4xl space-y-12">
        {/* Result Summary Card */}
        <Card className="p-8 text-center rounded-3xl shadow-xl shadow-purple-500/20 bg-gradient-to-br from-black via-gray-900 to-black hover:shadow-2xl hover:shadow-purple-400/30 transition-all duration-500 border border-gray-800">
          <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Quiz Results: {quiz.title}
          </CardTitle>
          <p
            className={cn(
              "text-6xl font-bold my-6",
              parseInt(percentage) >= 70 ? "text-green-400" : "text-red-400"
            )}
          >
            {percentage}%
          </p>
          <p className="font-semibold text-lg">
            You scored {result.score} out of {result.totalQuestions}.
          </p>
          <Button
            asChild
            className="mt-6 bg-purple-700 hover:bg-purple-600 text-white"
          >
            <Link to="/quizzes">Back to Quizzes</Link>
          </Button>
        </Card>

        {/* Detailed Analysis Header */}
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500">
          Detailed Analysis
        </h2>

        {/* Questions */}
        <div className="space-y-6">
          {quiz.questions.map((question, index) => {
            const userAnswer = result.answers.find(
              (a) => a.questionIndex === index
            );
            return (
              <Card
                key={index}
                className="p-6 rounded-3xl shadow-lg shadow-blue-400/20 bg-gradient-to-br from-black via-gray-900 to-black hover:shadow-xl hover:shadow-blue-400/30 transition-all duration-500 border border-gray-800"
              >
                <p className="font-semibold text-lg text-gray-100">
                  {question.questionText}
                </p>
                <div className="mt-4 space-y-2">
                  {question.options.map((opt, optIndex) => {
                    const isUserAnswer =
                      userAnswer?.selectedOptionIndex === optIndex;
                    return (
                      <div
                        key={optIndex}
                        className={cn(
                          "p-3 border rounded-lg flex items-center gap-3",
                          opt.isCorrect && "border-green-500 bg-green-500/10",
                          isUserAnswer &&
                            !opt.isCorrect &&
                            "border-red-500 bg-red-500/10"
                        )}
                      >
                        {opt.isCorrect ? (
                          <CheckCircle className="text-green-500 flex-shrink-0" />
                        ) : isUserAnswer ? (
                          <XCircle className="text-red-500 flex-shrink-0" />
                        ) : (
                          <div className="w-6 h-6 flex-shrink-0" />
                        )}
                        <p className="text-gray-200">{opt.text}</p>
                      </div>
                    );
                  })}
                </div>
                {!userAnswer?.isCorrect && (
                  <p className="text-gray-400 text-sm mt-4 pt-4 border-t border-gray-800">
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { CheckCircle, XCircle } from "lucide-react";

export function QuizResultPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      setError(null);
      if (!attemptId) {
        setError("No attempt ID found in URL.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3001/api/quizzes/results/${attemptId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch quiz results.");
        }
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
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !resultData) {
    return (
      <div className="container p-8 text-center text-destructive">
        {error || "Could not load results."}
      </div>
    );
  }

  const { result, quiz } = resultData;
  const percentage = ((result.score / result.total) * 100).toFixed(0);

  return (
    <div className="bg-muted/30 w-full min-h-screen">
      <div className="container mx-auto max-w-4xl py-12">
        <Card className="p-8 text-center rounded-2xl shadow-xl">
          <CardTitle className="text-3xl">Quiz Results: {quiz.title}</CardTitle>
          <CardDescription>{quiz.subject.name}</CardDescription>
          <p
            className={`text-6xl font-bold my-6 ${
              parseInt(percentage) >= 70 ? "text-green-500" : "text-red-500"
            }`}
          >
            {percentage}%
          </p>
          <p className="font-semibold text-lg">
            You scored {result.score} out of {result.total}.
          </p>
          <Button asChild className="mt-6">
            <Link to="/quizzes">Back to Quizzes</Link>
          </Button>
        </Card>

        <h2 className="text-2xl font-bold mt-12 mb-6">Detailed Analysis</h2>
        <div className="space-y-4">
          {quiz.questions.map((question: any, index: number) => {
            const userAnswer = result.answers.find(
              (a: any) => a.questionIndex === index
            );
            return (
              <Card key={index} className="p-6">
                <p className="font-semibold text-lg">{question.questionText}</p>
                <div className="mt-4 space-y-2">
                  {question.options.map((opt: any, optIndex: number) => {
                    const isUserAnswer =
                      userAnswer?.selectedOptionIndex === optIndex;
                    return (
                      <div
                        key={optIndex}
                        className={`p-3 border rounded-md flex items-center gap-3 ${
                          opt.isCorrect
                            ? "border-green-500 bg-green-50"
                            : isUserAnswer
                            ? "border-red-500 bg-red-50"
                            : "border-border"
                        }`}
                      >
                        {opt.isCorrect ? (
                          <CheckCircle className="text-green-500" />
                        ) : isUserAnswer ? (
                          <XCircle className="text-red-500" />
                        ) : (
                          <div className="w-6 h-6" />
                        )}
                        <p>{opt.text}</p>
                      </div>
                    );
                  })}
                </div>
                {!userAnswer?.isCorrect && (
                  <p className="text-sm text-muted-foreground mt-4 pt-4 border-t">
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

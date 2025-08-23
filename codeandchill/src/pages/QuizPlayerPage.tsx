import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";

interface Quiz {
  _id: string;
  title: string;
  questions: { questionText: string; options: { text: string }[] }[];
}

export function QuizPlayerPage() {
  const { quizSlug } = useParams<{ quizSlug: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetch(`http://localhost:3001/api/quizzes/play/${quizSlug}`)
      .then((res) => res.json())
      .then((data) => {
        setQuiz(data);
        setLoading(false);
      });
  }, [quizSlug]);

  const handleSubmit = async () => {
    if (!quiz) return;
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/quizzes/${quiz._id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answers }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Submission failed.");
      navigate(`/quizzes/results/${data.attemptId}`);
    } catch (error) {
      console.error("Failed to submit quiz", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !quiz) {
    return (
      <div className="container p-8">
        <Skeleton className="h-[60vh] w-full max-w-4xl mx-auto rounded-3xl bg-gray-800/50" />
      </div>
    );
  }

  const question = quiz.questions[currentQ];
  const isLastQuestion = currentQ === quiz.questions.length - 1;
  const progressPercent = ((currentQ + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 py-12 px-6">
      <div className="container mx-auto max-w-4xl space-y-12">
        <Card className="rounded-3xl shadow-xl shadow-purple-500/20 bg-gradient-to-br from-black via-gray-900 to-black hover:shadow-2xl hover:shadow-purple-400/30 transition-all duration-500 border border-gray-800">
          <CardHeader>
            <Progress value={progressPercent} className="mb-4" />
            <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              {quiz.title}
            </CardTitle>
            <CardDescription>
              Question {currentQ + 1} of {quiz.questions.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-xl mb-6 text-gray-100">
              {question.questionText}
            </p>
            <RadioGroup
              onValueChange={(val) =>
                setAnswers({ ...answers, [currentQ]: parseInt(val) })
              }
              value={answers[currentQ]?.toString()}
              className="space-y-3"
            >
              {question.options.map((opt, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-gray-700 bg-black/80 hover:bg-gray-800 transition"
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`opt-${index}`}
                  />
                  <Label
                    htmlFor={`opt-${index}`}
                    className="text-base flex-grow cursor-pointer text-gray-100"
                  >
                    {opt.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <div className="mt-8 flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setCurrentQ((q) => q - 1)}
                disabled={currentQ === 0}
                className="border-gray-700 text-gray-100 hover:bg-gray-800"
              >
                Previous
              </Button>
              {isLastQuestion ? (
                <Button
                  onClick={handleSubmit}
                  disabled={
                    loading ||
                    Object.keys(answers).length !== quiz.questions.length
                  }
                  className="bg-purple-700 hover:bg-purple-600 text-white"
                >
                  {loading ? "Submitting..." : "Submit Quiz"}
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQ((q) => q + 1)}
                  disabled={answers[currentQ] === undefined}
                  className="bg-purple-700 hover:bg-purple-600 text-white"
                >
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

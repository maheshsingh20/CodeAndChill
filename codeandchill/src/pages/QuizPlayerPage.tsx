import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// FIX: Import each component from its own specific file
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

// --- TypeScript Type Definitions ---
interface Option {
  text: string;
}
interface Question {
  questionText: string;
  options: Option[];
}
interface Quiz {
  _id: string;
  title: string;
  questions: Question[];
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
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3001/api/quizzes/play/${quizSlug}`
        );
        if (!response.ok) throw new Error("Could not load the quiz.");
        const data = await response.json();
        setQuiz(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (quizSlug) fetchQuiz();
  }, [quizSlug]);

  const handleAnswerSelect = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQ]: optionIndex });
  };

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
        <Skeleton className="h-[60vh] w-full max-w-4xl mx-auto" />
      </div>
    );
  }

  const question = quiz.questions[currentQ];
  const isLastQuestion = currentQ === quiz.questions.length - 1;
  const progressPercent = ((currentQ + 1) / quiz.questions.length) * 100;

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <Card className="rounded-2xl shadow-xl">
        <CardHeader>
          <Progress value={progressPercent} className="mb-4" />
          <CardTitle>{quiz.title}</CardTitle>
          <CardDescription>
            Question {currentQ + 1} of {quiz.questions.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-xl mb-6">{question.questionText}</p>
          <RadioGroup
            onValueChange={(val) => handleAnswerSelect(parseInt(val))}
            value={answers[currentQ]?.toString()}
            className="space-y-3"
          >
            {question.options.map((opt, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 rounded-md border transition-colors hover:bg-muted has-[:checked]:bg-primary/10 has-[:checked]:border-primary"
              >
                <RadioGroupItem value={index.toString()} id={`opt-${index}`} />
                <Label
                  htmlFor={`opt-${index}`}
                  className="text-base flex-grow cursor-pointer"
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
            >
              Previous
            </Button>
            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== quiz.questions.length}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQ((q) => q + 1)}
                disabled={answers[currentQ] === undefined}
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

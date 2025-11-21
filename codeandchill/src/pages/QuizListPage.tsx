/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function QuizListPage() {
  const { subjectSlug } = useParams();
  const [data, setData] = useState<{ subject: { name: string } | null; quizzes: any[] }>({ subject: null, quizzes: [] });
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (subjectSlug) {
      fetch(`http://localhost:3001/api/quizzes/by-subject/${subjectSlug}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setData);
    }
  }, [subjectSlug, token]);

  if (!data.subject) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-200">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-100 py-12 px-6 relative">
      {/* Consistent Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          {data.subject.name} Quizzes
        </h1>
      </header>
      <main className="space-y-6 max-w-4xl mx-auto">
        {data.quizzes.map((quiz: any) => (
          <Card
            key={quiz.slug}
            className={`p-6 flex items-center justify-between rounded-3xl border border-gray-800 shadow-lg shadow-purple-500/20 hover:shadow-2xl hover:shadow-pink-500/30 transition-all duration-500 bg-black`}
          >
            <div>
              <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500">
                {quiz.title}
              </CardTitle>
              {quiz.completed && (
                <p className="flex items-center gap-2 text-green-400 font-semibold mt-1">
                  <CheckCircle className="w-5 h-5" /> Completed | Score:{" "}
                  {quiz.score}
                </p>
              )}
            </div>
            <Button
              asChild
              className={`bg-purple-700 hover:bg-purple-600 text-white`}
            >
              <Link to={`/quizzes/play/${quiz.slug}`}>
                {quiz.completed ? "Review" : "Start Quiz"}
              </Link>
            </Button>
          </Card>
        ))}
      </main>
    </div>
  );
}

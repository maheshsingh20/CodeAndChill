import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";

export function QuizListPage() {
  const { subjectSlug } = useParams();
  const [data, setData] = useState({ subject: null, quizzes: [] });

  useEffect(() => {
    if (subjectSlug) {
      fetch(`http://localhost:3001/api/subjects/${subjectSlug}/quizzes`)
        .then((res) => res.json())
        .then(setData);
    }
  }, [subjectSlug]);

  if (!data.subject) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold">{data.subject.name} Quizzes</h1>
      </header>
      <main className="space-y-4 max-w-4xl mx-auto">
        {data.quizzes.map((quiz: any) => (
          <Card
            key={quiz.slug}
            className="p-4 flex items-center justify-between"
          >
            <CardTitle className="text-lg">{quiz.title}</CardTitle>
            <Button asChild>
              <Link to={`/quizzes/play/${quiz.slug}`}>Start Quiz</Link>
            </Button>
          </Card>
        ))}
      </main>
    </div>
  );
}

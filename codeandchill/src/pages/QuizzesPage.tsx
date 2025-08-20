import React, { useState, useEffect } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Link } from "react-router-dom";

export function QuizzesPage() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/subjects")
      .then((res) => res.json())
      .then(setSubjects);
  }, []);

  return (
    <div className="container mx-auto py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold">Quiz Categories</h1>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subjects.map((subject: any) => (
          <Link to={`/quizzes/subjects/${subject.slug}`} key={subject.slug}>
            <Card className="hover:shadow-xl transition-shadow rounded-2xl p-6 h-full">
              <CardTitle className="text-2xl">{subject.name}</CardTitle>
              <CardDescription className="mt-2">
                {subject.description}
              </CardDescription>
            </Card>
          </Link>
        ))}
      </main>
    </div>
  );
}

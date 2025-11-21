/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export function QuizzesPage() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/quizzes/subjects")
      .then((res) => res.json())
      .then(setSubjects);
  }, []);

  return (
    <div className="min-h-screen text-gray-100 py-12 px-6 relative">
      {/* Consistent Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <header className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Quiz Categories
        </h1>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {subjects.map((subject: any) => (
          <Link
            to={`/quizzes/subjects/${subject.slug}`}
            key={subject.slug}
            className="transform transition-transform hover:scale-105"
          >
            <Card className="h-full p-6 rounded-3xl border border-gray-800 bg-black shadow-lg shadow-purple-500/20 hover:shadow-2xl hover:shadow-pink-500/30 transition-shadow duration-500">
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500">
                {subject.name}
              </CardTitle>
              <CardDescription className="mt-3 text-gray-300">
                {subject.description}
              </CardDescription>
            </Card>
          </Link>
        ))}
      </main>
    </div>
  );
}

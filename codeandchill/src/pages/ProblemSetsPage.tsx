/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { ProblemSetCard } from "@/components/problems/ProblemSetCard";
import { Skeleton } from "@/components/ui/skeleton";
import { BookCheck, Swords, Trophy } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  "sda-sheet": <BookCheck />,
  "cses-100": <Trophy />,
  "tle-eliminators": <Swords />,
};

export function ProblemSetsPage() {
  const [problemSets, setProblemSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblemSets = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3001/api/problem-sets");
        const data = await response.json();
        setProblemSets(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblemSets();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 w-full min-h-screen flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-64 w-full rounded-2xl bg-gray-700/30 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 w-full min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-cyan-400 drop-shadow-md">
            Problem Sets
          </h1>
          <p className="mt-4 text-lg text-cyan-300/90 max-w-2xl mx-auto">
            Sharpen your skills with our curated collections. Practice, learn,
            and level up your problem-solving game.
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {problemSets.map((set) => (
            <ProblemSetCard
              key={set.slug}
              set={{ ...set, icon: iconMap[set.slug] }}
            />
          ))}
        </main>
      </div>
    </div>
  );
}

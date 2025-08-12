import React from 'react';
import { ProblemSetCard } from "@/components/problems/ProblemSetCard.tsx";
import { BookCheck, Swords, Trophy } from 'lucide-react';

// Mock data for the problem sets
const problemSets = [
  { id: "sda-sheet", icon: <BookCheck size={32} />, title: "SDA Problem Set", description: "A curated list of 450+ DSA problems to master data structures and algorithms.", problemsCount: 450, author: "Striver" },
  { id: "cses-100", icon: <Trophy size={32} />, title: "CSES 100", description: "The 100 most fundamental competitive programming problems from the CSES problem set.", problemsCount: 100, author: "CSES" },
  { id: "tle-eliminators", icon: <Swords size={32} />, title: "TLE Eliminators", description: "A collection of challenging problems focused on time complexity and optimization.", problemsCount: 50, author: "Community" },
];

export function ProblemSetsPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-lime-100 via-gray-100 to-cyan-100">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-cyan-900">
            Problem Sets
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-cyan-800/90">
            Sharpen your skills with our curated collections of coding challenges.
          </p>
        </header>

        {/* Grid */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {problemSets.map(set => (
            <div key={set.id} className="rounded-2xl border-2 border-cyan-200 p-0">
              {/* keep ProblemSetCard as the inner card; outer wrapper provides consistent border */}
              <ProblemSetCard set={set} />
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

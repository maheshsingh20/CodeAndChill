/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { ProblemSetCard } from "@/components/problems/ProblemSetCard";
import { BookCheck, Swords, Trophy, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ReactNode> = {
  "sda-sheet": <BookCheck />,
  "cses-100": <Trophy />,
  "tle-eliminators": <Swords />,
};

export function ProblemSetsPage() {
  const [problemSets, setProblemSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredSets = problemSets.filter(set =>
    set.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    set.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen w-full">
        <div className="container mx-auto max-w-7xl px-6 section-padding">
          {/* Loading Header */}
          <div className="mb-12">
            <div className="h-12 bg-gray-700/20 rounded-lg w-80 mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-700/15 rounded-lg w-96 animate-pulse"></div>
          </div>

          {/* Loading Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-80 bg-gray-800/30 rounded-xl border border-gray-700/30 p-6 animate-pulse backdrop-blur-sm"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-gray-700/40 rounded-lg">
                    <BookCheck className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-700/30 rounded-lg w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-700/20 rounded-lg w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="h-4 bg-gray-700/20 rounded-lg w-full"></div>
                  <div className="h-4 bg-gray-700/20 rounded-lg w-4/5"></div>
                  <div className="h-4 bg-gray-700/20 rounded-lg w-3/5"></div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
                  <div className="h-6 bg-gray-700/30 rounded-full w-28"></div>
                  <div className="h-9 bg-gray-700/30 rounded-lg w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto max-w-7xl px-6 section-padding">
        {/* Enhanced Header Section */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-100 mb-4 leading-tight">
                Problem Sets
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
                Practice coding challenges with our expertly curated problem collections
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex-shrink-0 w-full lg:w-96">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search problem sets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-600/50 text-gray-100 placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 h-12"
                />
              </div>
            </div>
          </div>

          {/* Results Counter */}
          {searchTerm && (
            <div className="mt-6 text-sm text-gray-500">
              Found {filteredSets.length} problem set{filteredSets.length !== 1 ? 's' : ''}
              {searchTerm && ` matching "${searchTerm}"`}
            </div>
          )}
        </div>

        {/* Problem Sets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSets.map((set) => (
            <ProblemSetCard
              key={set.slug}
              set={{ ...set, icon: iconMap[set.slug] }}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredSets.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No problem sets found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? `No results found for "${searchTerm}". Try a different search term.`
                : "No problem sets are available at the moment."
              }
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                onClick={() => setSearchTerm("")}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
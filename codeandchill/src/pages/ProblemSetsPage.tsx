import React, { useState, useEffect } from "react";
import { ProblemSetCard } from "@/components/problems/ProblemSetCard";
import { BookCheck, Swords, Trophy, Search, Code } from "lucide-react";

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
      <div className="w-full min-h-screen bg-black">
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <Code className="text-blue-400" size={48} />
            Problem Sets
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Practice coding challenges with our expertly curated problem collections
          </p>
        </header>

        {/* Search Bar */}
        <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search problem sets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 pl-12 pr-4 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Results Counter */}
        {searchTerm && (
          <div className="text-center mb-8 text-sm text-gray-500">
            Found {filteredSets.length} problem set{filteredSets.length !== 1 ? 's' : ''}
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        )}

        {/* Main Content */}
        <main>
          {filteredSets.length === 0 && !loading ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-12 max-w-md mx-auto">
                <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">
                  No Problem Sets Found
                </h2>
                <p className="text-gray-400 mb-6">
                  {searchTerm
                    ? `No results found for "${searchTerm}". Try a different search term.`
                    : "No problem sets are available at the moment."
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-6 py-3 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-gray-300 hover:border-gray-500 hover:text-white transition-all duration-300"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSets.map((set) => (
                <ProblemSetCard
                  key={set.slug}
                  set={{ ...set, icon: iconMap[set.slug] }}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
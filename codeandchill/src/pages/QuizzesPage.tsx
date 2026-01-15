import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Brain, ArrowRight, BookOpen } from "lucide-react";

interface Subject {
  slug: string;
  name: string;
  description: string;
  quizCount?: number;
}

export function QuizzesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/quizzes/subjects");
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        // Fallback data
        setSubjects([
          {
            slug: "javascript",
            name: "JavaScript",
            description: "Test your knowledge of JavaScript fundamentals, ES6+, and modern frameworks",
            quizCount: 15
          },
          {
            slug: "python",
            name: "Python",
            description: "Explore Python basics, data structures, and popular libraries",
            quizCount: 12
          },
          {
            slug: "react",
            name: "React",
            description: "Master React components, hooks, state management, and best practices",
            quizCount: 18
          },
          {
            slug: "algorithms",
            name: "Algorithms",
            description: "Challenge yourself with sorting, searching, and optimization problems",
            quizCount: 20
          },
          {
            slug: "databases",
            name: "Databases",
            description: "Learn SQL, NoSQL, database design, and optimization techniques",
            quizCount: 10
          },
          {
            slug: "web-development",
            name: "Web Development",
            description: "Full-stack development concepts, APIs, and modern web technologies",
            quizCount: 25
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black">
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md animate-pulse" />
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <Brain className="text-purple-400" size={48} />
            Quiz Categories
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Test your knowledge across various programming topics and technologies
          </p>
        </header>

        {/* Main Content */}
        <main>
          {subjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-12 max-w-md mx-auto">
                <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">
                  No Quiz Categories Found
                </h2>
                <p className="text-gray-400">
                  Quiz categories will be available here soon.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <div key={subject.slug} className="group h-full">
                  <Link to={`/quizzes/subjects/${subject.slug}`} className="block h-full">
                    <div className="h-full min-h-[240px] bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
                      <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md group-hover:border-gray-500 transition-all duration-300">
                            <Brain className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                        </div>

                        {/* Content */}
                        <div className="flex-grow space-y-4">
                          {/* Title */}
                          <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-purple-100 group-hover:to-purple-200 transition-all duration-300 leading-tight">
                            {subject.name}
                          </h3>

                          {/* Description */}
                          <p className="text-sm bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300 leading-relaxed">
                            {subject.description}
                          </p>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 pt-4 border-t border-gray-700">
                          <div className="flex items-center justify-between">
                            {subject.quizCount && (
                              <div className="px-3 py-1 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md text-xs font-medium">
                                <span className="bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
                                  {subject.quizCount} Quizzes
                                </span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2 text-xs ml-auto">
                              <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300">
                                Start Quiz
                              </span>
                              <div className="w-4 h-0.5 bg-gray-600 rounded-sm group-hover:bg-gray-500 transition-colors duration-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Database, Network, Server, BookOpen, ArrowRight, Clock, Users, Star, Code, Palette } from "lucide-react";

// Enhanced engineering subjects data with more details
const subjects = [
  {
    id: "dsa",
    icon: <Cpu size={32} />,
    title: "Data Structures & Algorithms",
    description: "Master fundamental data structures and algorithms essential for programming interviews and efficient coding.",
    difficulty: "intermediate",
    duration: "60 hours",
    students: "15,420",
    rating: 4.8,
    color: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-900/30 via-blue-800/20 to-blue-900/30",
    borderColor: "border-blue-500/30"
  },
  {
    id: "dbms",
    icon: <Database size={32} />,
    title: "Database Management Systems",
    description: "Learn database design, SQL, normalization, and advanced database concepts for modern applications.",
    difficulty: "intermediate",
    duration: "45 hours",
    students: "12,850",
    rating: 4.7,
    color: "from-green-500 to-emerald-500",
    bgGradient: "from-green-900/30 via-green-800/20 to-green-900/30",
    borderColor: "border-green-500/30"
  },
  {
    id: "operating-systems",
    icon: <Server size={32} />,
    title: "Operating Systems",
    description: "Understand OS concepts including processes, memory management, file systems, and system calls.",
    difficulty: "advanced",
    duration: "55 hours",
    students: "9,640",
    rating: 4.6,
    color: "from-orange-500 to-red-500",
    bgGradient: "from-orange-900/30 via-orange-800/20 to-orange-900/30",
    borderColor: "border-orange-500/30"
  },
  {
    id: "computer-networks",
    icon: <Network size={32} />,
    title: "Computer Networks",
    description: "Explore networking protocols, TCP/IP, network security, and distributed systems fundamentals.",
    difficulty: "advanced",
    duration: "50 hours",
    students: "8,920",
    rating: 4.5,
    color: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-900/30 via-purple-800/20 to-purple-900/30",
    borderColor: "border-purple-500/30"
  },
  {
    id: "software-engineering",
    icon: <Code size={32} />,
    title: "Software Engineering",
    description: "Learn software development lifecycle, design patterns, testing, and project management principles.",
    difficulty: "intermediate",
    duration: "58 hours",
    students: "11,200",
    rating: 4.7,
    color: "from-indigo-500 to-blue-500",
    bgGradient: "from-indigo-900/30 via-indigo-800/20 to-indigo-900/30",
    borderColor: "border-indigo-500/30"
  },
  {
    id: "web-development",
    icon: <Palette size={32} />,
    title: "Web Development",
    description: "Build modern web applications with HTML, CSS, JavaScript, React, and backend technologies.",
    difficulty: "beginner",
    duration: "70 hours",
    students: "18,750",
    rating: 4.9,
    color: "from-yellow-500 to-orange-500",
    bgGradient: "from-yellow-900/30 via-yellow-800/20 to-yellow-900/30",
    borderColor: "border-yellow-500/30"
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
    case 'intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'advanced': return 'bg-red-500/20 text-red-300 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

export function GeneralCoursesPage() {
  return (
    <div className="w-full min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-500/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <BookOpen className="text-purple-400" size={48} />
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
              Core Engineering Subjects
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Master the foundational subjects of Computer Science with our comprehensive curriculum designed for B.Tech students
          </p>
        </header>

        {/* Subjects Grid */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <Link key={subject.id} to={`/engineering-courses/${subject.id}`}>
              <div className="group h-full">
                <div className={`h-full min-h-[420px] bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60 hover:scale-[1.02]`}>
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${subject.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {subject.icon}
                        </div>
                        <div className={`px-3 py-1 rounded-md text-xs font-medium ${getDifficultyColor(subject.difficulty)}`}>
                          {subject.difficulty.charAt(0).toUpperCase() + subject.difficulty.slice(1)}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                    </div>

                    {/* Content */}
                    <div className="flex-grow space-y-4">
                      {/* Title */}
                      <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-purple-100 group-hover:to-purple-200 transition-all duration-300 leading-tight">
                        {subject.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300 leading-relaxed line-clamp-3">
                        {subject.description}
                      </p>

                      {/* Subject Info */}
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-gray-500" />
                          <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                            {subject.duration}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-gray-500" />
                          <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                            {subject.students} students
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Star size={14} className="text-yellow-400" />
                          <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                            {subject.rating} rating
                          </span>
                        </div>
                      </div>

                      {/* Featured Badge */}
                      {subject.rating >= 4.8 && (
                        <div className="bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md p-3">
                          <div className="flex items-center gap-2">
                            <Star size={14} className="text-yellow-400 fill-current" />
                            <span className="text-sm font-medium bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                              Highly Rated
                            </span>
                          </div>
                          <div className="text-xs bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                            ⭐ Top choice for students
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-gray-700">
                      <div className="flex items-center justify-center space-x-2 text-xs">
                        <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300">
                          Start Learning
                        </span>
                        <div className="w-4 h-0.5 bg-gray-600 rounded-sm group-hover:bg-gray-500 transition-colors duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </main>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
              Ready to start your engineering journey?
            </h3>
            <p className="text-gray-400 mb-6">
              Choose a subject that interests you and begin building your foundation in computer science.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/learning-paths">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-md transition-all duration-300 flex items-center gap-2">
                  <BookOpen size={16} />
                  Browse Learning Paths
                </button>
              </Link>
              <Link to="/dashboard">
                <button className="px-6 py-3 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white font-medium rounded-md transition-all duration-300">
                  View Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

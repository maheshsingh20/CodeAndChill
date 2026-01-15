import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Users, Star, ArrowRight, Target } from "lucide-react";

const learningPaths = [
  {
    id: 1,
    title: "Full-Stack Web Development",
    description: "Master the complete web development stack from frontend to backend",
    icon: "🌐",
    difficulty: "Intermediate",
    duration: "120 hours",
    enrolled: 1247,
    rating: 4.6,
    courses: 8,
    iconColor: "text-blue-400"
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    description: "Comprehensive guide to DSA concepts and problem-solving techniques",
    icon: "🧠",
    difficulty: "Intermediate",
    duration: "80 hours",
    enrolled: 2156,
    rating: 4.8,
    courses: 6,
    iconColor: "text-purple-400"
  },
  {
    id: 3,
    title: "Machine Learning Fundamentals",
    description: "Dive into the world of AI and machine learning with Python",
    icon: "🤖",
    difficulty: "Advanced",
    duration: "100 hours",
    enrolled: 987,
    rating: 4.7,
    courses: 10,
    iconColor: "text-green-400"
  }
];

export function LearningPathsSection() {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-3">
            <BookOpen className="text-purple-400" size={32} />
            Learning Paths
          </h2>
          <p className="text-gray-400 mt-2">
            Structured learning journeys to master new skills
          </p>
        </div>
        <Link to="/learning-paths">
          <div className="px-6 py-3 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md hover:border-gray-500 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-2">
              View All Paths
              <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningPaths.map((path) => (
          <div key={path.id} className="group h-full">
            <Link to={`/learning-paths/${path.id}`} className="block h-full">
              <div className="h-full min-h-[320px] bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{path.icon}</div>
                      <div className="px-3 py-1 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md text-xs font-medium">
                        <span className="bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
                          {path.difficulty}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                  </div>

                  {/* Content */}
                  <div className="flex-grow space-y-4">
                    {/* Title */}
                    <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-purple-100 group-hover:to-purple-200 transition-all duration-300">
                      {path.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300 leading-relaxed">
                      {path.description}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-500" />
                        <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                          {path.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target size={14} className="text-gray-500" />
                        <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                          {path.courses} courses
                        </span>
                      </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-gray-500" />
                        <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                          {path.enrolled.toLocaleString()} enrolled
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star size={14} className="text-yellow-400" />
                        <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                          {path.rating}
                        </span>
                      </div>
                    </div>
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
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
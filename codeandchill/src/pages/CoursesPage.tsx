import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, BookOpen, User, DollarSign } from "lucide-react";

interface Course {
  _id: string;
  slug: string;
  title: string;
  description: string;
  tutor: { name: string };
  cost: number;
}

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:3001/api/general-courses"
        );
        const data = await response.json();
        setCourses(data);
        setFilteredCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    let result = courses;

    if (filterOption === "free") {
      result = result.filter((course) => course.cost === 0);
    } else if (filterOption === "paid") {
      result = result.filter((course) => course.cost > 0);
    }

    if (searchTerm) {
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(result);
  }, [searchTerm, filterOption, courses]);

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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
            Explore Our Courses
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Choose a path and master the in-demand skills for a career in tech with our comprehensive course catalog.
          </p>
        </header>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-6 mb-12">
          {/* Search Input */}
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="search"
              placeholder="Search by title or description..."
              className="w-full h-14 pl-12 pr-4 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Select */}
          <div className="relative">
            <select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              className="w-full sm:w-[200px] h-14 px-4 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-white focus:border-gray-500 focus:outline-none transition-all duration-300 appearance-none cursor-pointer"
            >
              <option value="all">All Prices</option>
              <option value="free">Free Courses</option>
              <option value="paid">Paid Courses</option>
            </select>
            <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 rotate-90 pointer-events-none" />
          </div>
        </div>

        {/* Main Content */}
        <main>
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div key={course._id} className="group h-full">
                  <Link to={`/courses/${course.slug}`} className="block h-full">
                    <div className="h-full min-h-[320px] bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
                      <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md group-hover:border-gray-500 transition-all duration-300">
                            <BookOpen className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                          </div>
                          <div className="px-3 py-1 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md text-xs font-medium">
                            <span className={`${course.cost === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                              {course.cost === 0 ? "Free" : `$${course.cost}`}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-grow space-y-4">
                          {/* Title */}
                          <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-blue-100 group-hover:to-blue-200 transition-all duration-300 leading-tight">
                            {course.title}
                          </h3>

                          {/* Tutor */}
                          <div className="flex items-center gap-2 text-sm">
                            <User size={14} className="text-gray-500" />
                            <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                              by {course.tutor.name}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-sm bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300 leading-relaxed line-clamp-3">
                            {course.description}
                          </p>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 pt-4 border-t border-gray-700">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <DollarSign size={14} className="text-gray-500" />
                              <span className="text-lg font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                                {course.cost === 0 ? "Free" : `$${course.cost}`}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs">
                              <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300">
                                View Course
                              </span>
                              <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-12 max-w-md mx-auto">
                <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">
                  No Courses Found
                </h2>
                <p className="text-gray-400">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Target, Clock, Award, TrendingUp, ArrowRight, Users } from "lucide-react";
import api from "@/services/api";

const difficultyColors = {
  Beginner: "bg-green-500/20 text-green-300 border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-300 border-red-500/30"
};

export function SkillTestsSection() {
  const [skillTests, setSkillTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkillTests = async () => {
      try {
        const response = await api.get<{ skillTests: any[] }>('/skill-tests');
        setSkillTests(response.skillTests?.slice(0, 3) || []);
      } catch (error) {
        console.error('Error fetching skill tests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkillTests();
  }, []);

  if (loading) {
    return <section className="space-y-8"><div className="text-center text-gray-400">Loading skill tests...</div></section>;
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-3">
            <Target className="text-orange-400" size={32} />
            Skill Tests
          </h2>
          <p className="text-gray-400 mt-2">
            Evaluate your programming skills and get certified
          </p>
        </div>
        <Link to="/skill-tests">
          <div className="px-6 py-3 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md hover:border-gray-500 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-2">
              View All Tests
              <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillTests.map((test) => (
          <div key={test._id} className="group h-full">
            <Link to={`/skill-tests/${test._id}`} className="block h-full">
              <div className="h-full min-h-[320px] bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{test.icon || "📝"}</div>
                      <div className={`px-3 py-1 rounded-md text-xs font-medium ${difficultyColors[test.difficulty] || difficultyColors.Intermediate}`}>
                        {test.difficulty}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                  </div>

                  {/* Content */}
                  <div className="flex-grow space-y-4">
                    {/* Title */}
                    <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-orange-100 group-hover:to-orange-200 transition-all duration-300">
                      {test.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300 leading-relaxed">
                      {test.description}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-500" />
                        <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                          {test.duration} min
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award size={14} className="text-gray-500" />
                        <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                          {test.questions?.length || 0} questions
                        </span>
                      </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={14} className="text-gray-500" />
                        <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                          {test.attempts || 0} taken
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-gray-500" />
                        <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                          {Math.floor(Math.random() * 500) + 100} enrolled
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-center space-x-2 text-xs">
                      <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300">
                        Start Test
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
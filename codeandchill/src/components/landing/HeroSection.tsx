import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Users, Trophy } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, courses: 0, problems: 0 });

  useEffect(() => {
    const animateStats = () => {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;
      
      const targets = { users: 10000, courses: 150, problems: 5000 };
      let step = 0;

      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        
        setStats({
          users: Math.floor(targets.users * progress),
          courses: Math.floor(targets.courses * progress),
          problems: Math.floor(targets.problems * progress),
        });

        if (step >= steps) {
          clearInterval(timer);
          setStats(targets);
        }
      }, interval);

      return () => clearInterval(timer);
    };

    animateStats();
  }, []);

  return (
    <section className="py-20">
      <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30">
            <span className="text-purple-400 text-sm font-medium">🚀 Welcome to CodeNChill</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Learn to Code
            </span>
            <br />
            <span className="text-white">The Fun Way</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Master programming through interactive courses, real-world projects, and competitive challenges. 
            Join thousands of developers on their coding journey.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/courses')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              Start Learning Free
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="px-8 py-4 border-2 border-slate-700 rounded-xl font-semibold text-white hover:border-slate-600 transition-all duration-300"
            >
              View Courses
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-slate-700/30">
              <Users className="w-8 h-8 text-purple-400" />
              <div className="text-3xl font-bold text-white">{stats.users.toLocaleString()}+</div>
              <div className="text-slate-400">Active Learners</div>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-slate-700/30">
              <Code2 className="w-8 h-8 text-pink-400" />
              <div className="text-3xl font-bold text-white">{stats.courses}+</div>
              <div className="text-slate-400">Courses</div>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-slate-700/30">
              <Trophy className="w-8 h-8 text-blue-400" />
              <div className="text-3xl font-bold text-white">{stats.problems.toLocaleString()}+</div>
              <div className="text-slate-400">Problems Solved</div>
            </div>
          </div>
        </div>
    </section>
  );
};

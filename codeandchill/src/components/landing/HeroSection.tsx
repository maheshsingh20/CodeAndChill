import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Users, Trophy } from 'lucide-react';
import { AnimatedSection } from '../ui/AnimatedSection';

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
        <AnimatedSection animation="fadeIn" delay={200}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 animate-glow-pulse">
            <span className="text-purple-400 text-sm font-medium">🚀 Welcome to CodeNChill</span>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="slideUp" delay={400}>
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Learn to Code
            </span>
            <br />
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">The Fun Way</span>
          </h1>
        </AnimatedSection>

        <AnimatedSection animation="slideUp" delay={600}>
          {/* Description */}
          <p className="text-xl bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-transparent max-w-2xl mx-auto">
            Master programming through interactive courses, real-world projects, and competitive challenges.
            Join thousands of developers on their coding journey.
          </p>
        </AnimatedSection>

        <AnimatedSection animation="scaleUp" delay={800}>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/courses')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 hover-lift"
            >
              Start Learning Free
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="px-8 py-4 border-2 border-slate-700 rounded-xl font-semibold text-white hover:border-slate-600 transition-all duration-300 hover-scale"
            >
              View Courses
            </button>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fadeIn" delay={1000}>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 rounded-md shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300 hover:-translate-y-2">
              <Users className="w-8 h-8 text-purple-400 animate-float" />
              <div className="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">{stats.users.toLocaleString()}+</div>
              <div className="bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-transparent">Active Learners</div>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 rounded-md shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300 hover:-translate-y-2">
              <Code2 className="w-8 h-8 text-pink-400 animate-float" style={{ animationDelay: '1s' }} />
              <div className="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">{stats.courses}+</div>
              <div className="bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-transparent">Courses</div>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 rounded-md shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300 hover:-translate-y-2">
              <Trophy className="w-8 h-8 text-blue-400 animate-float" style={{ animationDelay: '2s' }} />
              <div className="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">{stats.problems.toLocaleString()}+</div>
              <div className="bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-transparent">Problems Solved</div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Database, Brain, Zap } from 'lucide-react';

const paths = [
  {
    icon: Globe,
    title: 'Web Development',
    description: 'Master HTML, CSS, JavaScript, React, and modern web technologies.',
    courses: 45,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Database,
    title: 'Data Structures & Algorithms',
    description: 'Build strong foundations in DSA for technical interviews.',
    courses: 30,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Brain,
    title: 'AI & Machine Learning',
    description: 'Dive into artificial intelligence and machine learning concepts.',
    courses: 25,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Zap,
    title: 'Competitive Programming',
    description: 'Sharpen your problem-solving skills for coding competitions.',
    courses: 50,
    gradient: 'from-yellow-500 to-orange-500',
  },
];

export const LearningPathsSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20">
      {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Learning Path</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Structured roadmaps to guide you from beginner to expert
          </p>
        </div>

        {/* Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paths.map((path, index) => (
            <div
              key={index}
              onClick={() => navigate('/courses')}
              className="group cursor-pointer p-6 rounded-xl border border-slate-700/30 hover:border-slate-600 transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`w-14 h-14 rounded-xl  ${path.gradient} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <path.icon className="w-full h-full text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{path.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{path.description}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-purple-400 font-medium">{path.courses} courses</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-500">Start learning →</span>
              </div>
            </div>
          ))}
        </div>
    </section>
  );
};

import React from 'react';
import { Code2, Users, Trophy, Sparkles, BookOpen, Award } from 'lucide-react';

const features = [
  {
    icon: Code2,
    title: 'Interactive Coding',
    description: 'Learn by doing with our interactive code editor and instant feedback.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Users,
    title: 'Collaborative Learning',
    description: 'Connect with peers, share solutions, and learn together in real-time.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Trophy,
    title: 'Coding Contests',
    description: 'Test your skills in competitive programming challenges and win prizes.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Assistant',
    description: 'Get personalized help and hints from our intelligent coding assistant.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: BookOpen,
    title: 'Structured Courses',
    description: 'Follow curated learning paths from beginner to advanced levels.',
    gradient: 'from-red-500 to-pink-500',
  },
  {
    icon: Award,
    title: 'Earn Certificates',
    description: 'Showcase your achievements with verified completion certificates.',
    gradient: 'from-indigo-500 to-purple-500',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20">
      {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need to <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Excel</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Powerful features designed to accelerate your coding journey
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl border border-slate-700/30 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} p-2.5 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-full h-full text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
    </section>
  );
};

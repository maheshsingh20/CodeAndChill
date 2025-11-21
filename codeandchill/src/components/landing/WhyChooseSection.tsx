import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Clock, Target, Rocket, Star } from 'lucide-react';

const benefits = [
  'Learn at your own pace with flexible schedules',
  'Get instant feedback on your code',
  'Access to premium courses and content',
  'Join a community of 10,000+ developers',
  'Earn certificates to boost your career',
  'Lifetime access to all course materials',
];

const stats = [
  { icon: Clock, value: '24/7', label: 'Learning Access' },
  { icon: Target, value: '95%', label: 'Success Rate' },
  { icon: Rocket, value: '500+', label: 'Companies Hiring' },
  { icon: Star, value: '4.9/5', label: 'Average Rating' },
];

export const WhyChooseSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20">
      {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">CodeNChill</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Join thousands of developers who trust us for their learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Benefits List */}
          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-lg text-slate-300 group-hover:text-white transition-colors duration-300">
                  {benefit}
                </p>
              </div>
            ))}
            <button
              onClick={() => navigate('/courses')}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              Get Started Now
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-slate-700/30 hover:border-slate-600 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-2.5 mb-4">
                  <stat.icon className="w-full h-full text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
    </section>
  );
};

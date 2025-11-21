import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl border-2 border-purple-500/30 p-12">
          {/* Content */}
          <div className="relative z-10 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">Start Your Journey Today</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Ready to Level Up Your Coding Skills?
            </h2>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Join our community of passionate developers and start learning with interactive courses, 
              real-world projects, and expert guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button
                onClick={() => navigate('/courses')}
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                Start Learning Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button
                onClick={() => navigate('/contests')}
                className="px-8 py-4 border-2 border-slate-700 rounded-xl font-semibold text-white hover:border-slate-600 transition-all duration-300"
              >
                View Contests
              </button>
            </div>

            <p className="text-slate-500 text-sm pt-4">
              No credit card required • Free forever • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

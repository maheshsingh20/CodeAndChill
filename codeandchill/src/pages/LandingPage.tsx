import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { LearningPathsSection } from '../components/landing/LearningPathsSection';
import { WhyChooseSection } from '../components/landing/WhyChooseSection';
import { CTASection } from '../components/landing/CTASection';
import { Link } from 'react-router-dom';
import { Code, Github, Twitter, Linkedin, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen text-gray-100 relative bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      
      {/* Fixed Background Layer - Override App.tsx background */}
      <div className="fixed inset-0 z-0">
        {/* Animated gradient orbs - subtle purple and blue tones */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content - Must be above background */}
      <div className="relative z-10">
        <div className="container mx-auto max-w-7xl px-6 md:px-12">
          <HeroSection />
          <FeaturesSection />
          <LearningPathsSection />
          <WhyChooseSection />
          <CTASection />
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-800 mt-16">
          <div className="container mx-auto px-6 py-16">
            <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4">
              {/* Brand & Social */}
              <div className="space-y-6 md:col-span-1">
                <Link to="/" className="flex items-center gap-3">
                  <Code className="h-8 w-8 text-blue-400" />
                  <span className="text-2xl font-extrabold tracking-tight text-slate-100">
                    Code & Chill
                  </span>
                </Link>
                <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                  Your partner in lifelong learning and skill development.
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <a
                    href="#"
                    className="text-slate-500 hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-800/50"
                  >
                    <Twitter />
                  </a>
                  <a
                    href="#"
                    className="text-slate-500 hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-800/50"
                  >
                    <Github />
                  </a>
                  <a
                    href="#"
                    className="text-slate-500 hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-800/50"
                  >
                    <Linkedin />
                  </a>
                </div>
              </div>
              {/* Quick Links */}
              <div className="space-y-4">
                <h4 className="font-bold uppercase tracking-wider text-slate-200 text-sm">
                  Quick Links
                </h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      to="/auth"
                      className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
                    >
                      Get Started
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#features"
                      className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#learning-paths"
                      className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
                    >
                      Learning Paths
                    </a>
                  </li>
                </ul>
              </div>
              {/* Resources */}
              <div className="space-y-3">
                <h4 className="font-semibold uppercase tracking-wider text-slate-200 text-sm">
                  Resources
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
                    >
                      Community
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
                    >
                      Support
                    </a>
                  </li>
                </ul>
              </div>
              {/* Newsletter */}
              <div className="space-y-3">
                <h4 className="font-semibold uppercase tracking-wider text-slate-200 text-sm">
                  Stay Connected
                </h4>
                <p className="text-sm text-slate-400">
                  Subscribe to our newsletter for the latest updates.
                </p>
                <form className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-slate-800/50 border-slate-700 text-slate-200"
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Subscribe
                  </Button>
                </form>
              </div>
            </div>
          </div>
          <div className="bg-gray-950/50 border-t border-gray-800">
            <div className="container mx-auto py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-400">
                © 2025 Code and Chill, Inc. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

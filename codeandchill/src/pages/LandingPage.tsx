import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { LearningPathsSection } from '../components/landing/LearningPathsSection';
import { WhyChooseSection } from '../components/landing/WhyChooseSection';
import { CTASection } from '../components/landing/CTASection';
import { PageBackground } from '../components/ui/PageBackground';
import { Link } from 'react-router-dom';
import { Code, Github, Twitter, Linkedin, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="container mx-auto max-w-7xl px-6 md:px-12">
        <HeroSection />
        <FeaturesSection />
        <LearningPathsSection />
        <WhyChooseSection />
        <CTASection />
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-700 mt-16">
        <div className="container mx-auto px-6 py-16">
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4">
            {/* Brand & Social */}
            <div className="space-y-6 md:col-span-1">
              <Link to="/" className="flex items-center gap-3">
                <Code className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                  Code & Chill
                </span>
              </Link>
              <p className="text-sm bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-transparent max-w-xs leading-relaxed">
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
              <h4 className="font-bold uppercase tracking-wider bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-clip-text text-transparent text-sm">
                Quick Links
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    to="/auth"
                    className="bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-transparent hover:from-slate-200 hover:via-slate-100 hover:to-slate-200 transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </li>
                <li>
                  <a
                    href="#features"
                    className="bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-transparent hover:from-slate-200 hover:via-slate-100 hover:to-slate-200 transition-all duration-200"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#learning-paths"
                    className="bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-transparent hover:from-slate-200 hover:via-slate-100 hover:to-slate-200 transition-all duration-200"
                  >
                    Learning Paths
                  </a>
                </li>
              </ul>
            </div>
            {/* Resources */}
            <div className="space-y-3">
              <h4 className="font-semibold uppercase tracking-wider bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-clip-text text-transparent text-sm">
                Resources
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-transparent hover:from-slate-200 hover:via-slate-100 hover:to-slate-200 transition-all duration-200"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-transparent hover:from-slate-200 hover:via-slate-100 hover:to-slate-200 transition-all duration-200"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-transparent hover:from-slate-200 hover:via-slate-100 hover:to-slate-200 transition-all duration-200"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
            {/* Newsletter */}
            <div className="space-y-3">
              <h4 className="font-semibold uppercase tracking-wider bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-clip-text text-transparent text-sm">
                Stay Connected
              </h4>
              <p className="text-sm bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-transparent">
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
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border-t border-gray-700">
          <div className="container mx-auto py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-transparent">
              © 2025 Code and Chill, Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

import React from 'react';
import { AnimatedSection } from '../ui/AnimatedSection';
import { StaggeredList } from '../ui/StaggeredList';
import { AnimatedCard, FeatureCard, CourseCard } from '../ui/AnimatedCard';
import { Code, Zap, Users, Trophy, Star, BookOpen } from 'lucide-react';

export const AnimationShowcase: React.FC = () => {
  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Interactive Coding",
      description: "Learn by doing with hands-on coding exercises"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast Learning",
      description: "Accelerated learning paths designed for efficiency"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community",
      description: "Join a vibrant community of learners and mentors"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Achievements",
      description: "Earn badges and certificates as you progress"
    }
  ];

  const courses = [
    {
      title: "JavaScript Fundamentals",
      description: "Master the basics of JavaScript programming",
      progress: 75
    },
    {
      title: "React Development",
      description: "Build modern web applications with React",
      progress: 45
    },
    {
      title: "Node.js Backend",
      description: "Create powerful server-side applications",
      progress: 30
    }
  ];

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* Header */}
        <AnimatedSection animation="fadeIn" className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Animation <span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Showcase</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Experience smooth animations and transitions throughout the platform
          </p>
        </AnimatedSection>

        {/* Different Animation Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedSection animation="slideUp" delay={100}>
            <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Slide Up</h3>
              <p className="text-gray-400 text-sm">Elements slide up from bottom</p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="slideLeft" delay={200}>
            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20 text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Slide Left</h3>
              <p className="text-gray-400 text-sm">Elements slide in from right</p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="scaleUp" delay={300}>
            <div className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20 text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Scale Up</h3>
              <p className="text-gray-400 text-sm">Elements scale from small to normal</p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="rotateIn" delay={400}>
            <div className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20 text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Rotate In</h3>
              <p className="text-gray-400 text-sm">Elements rotate while scaling</p>
            </div>
          </AnimatedSection>
        </div>

        {/* Staggered Animation */}
        <AnimatedSection animation="slideUp" className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Staggered Animations</h2>
          <p className="text-gray-400">Items animate one after another with a delay</p>
        </AnimatedSection>

        <StaggeredList
          staggerDelay={150}
          animation="slideUp"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </StaggeredList>

        {/* Animated Cards */}
        <AnimatedSection animation="slideUp" className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Interactive Cards</h2>
          <p className="text-gray-400">Hover over cards to see interaction effects</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <CourseCard
              key={index}
              title={course.title}
              description={course.description}
              progress={course.progress}
              delay={index * 200}
              onClick={() => console.log(`Clicked ${course.title}`)}
            />
          ))}
        </div>

        {/* Hover Effects Demo */}
        <AnimatedSection animation="fadeIn" className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Hover Effects</h2>
          <p className="text-gray-400">Different hover animations for various elements</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 hover-lift text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold">Lift Effect</h3>
            <p className="text-gray-400 text-sm mt-2">Lifts up on hover</p>
          </div>

          <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 hover-scale text-center">
            <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold">Scale Effect</h3>
            <p className="text-gray-400 text-sm mt-2">Scales up on hover</p>
          </div>

          <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 hover-glow text-center">
            <Zap className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold">Glow Effect</h3>
            <p className="text-gray-400 text-sm mt-2">Glows on hover</p>
          </div>

          <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 animate-shimmer text-center">
            <Trophy className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold">Shimmer Effect</h3>
            <p className="text-gray-400 text-sm mt-2">Continuous shimmer</p>
          </div>
        </div>

        {/* Loading Animations */}
        <AnimatedSection animation="slideUp" className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Loading Animations</h2>

          <div className="flex justify-center items-center space-x-8">
            <div className="text-center">
              <div className="loading-dots text-blue-400 mb-2">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p className="text-gray-400 text-sm">Loading Dots</p>
            </div>

            <div className="text-center">
              <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-400 text-sm">Spinner</p>
            </div>

            <div className="text-center">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse mx-auto mb-2"></div>
              <p className="text-gray-400 text-sm">Pulse</p>
            </div>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
};
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap,
  Code,
  Sparkles,
  Users,
  Target,
  BookOpen,
  MessageSquare,
  MessageCircle,
  Bot,
  ArrowRight
} from "lucide-react";

const quickActions = [
  {
    title: "Solve Problems",
    description: "Practice coding challenges and improve your skills",
    icon: Zap,
    href: "/problems",
    iconColor: "text-orange-300",
    category: "Practice"
  },
  {
    title: "Take Courses",
    description: "Learn new technologies with structured content",
    icon: Code,
    href: "/courses",
    iconColor: "text-blue-300",
    category: "Learn"
  },
  {
    title: "Join Contests",
    description: "Compete with developers worldwide",
    icon: Sparkles,
    href: "/contests",
    iconColor: "text-purple-300",
    category: "Compete"
  },
  {
    title: "Skill Tests",
    description: "Assess and validate your programming abilities",
    icon: Target,
    href: "/skill-tests",
    iconColor: "text-green-300",
    category: "Test"
  },
  {
    title: "Learning Paths",
    description: "Follow structured learning journeys",
    icon: BookOpen,
    href: "/learning-paths",
    iconColor: "text-blue-300",
    category: "Learn"
  },
  {
    title: "Chat",
    description: "Connect with other users in real-time",
    icon: MessageCircle,
    href: "/chat",
    iconColor: "text-pink-300",
    category: "Social"
  },
  {
    title: "Community",
    description: "Connect and discuss with fellow developers",
    icon: MessageSquare,
    href: "/forum",
    iconColor: "text-purple-300",
    category: "Social"
  },
  {
    title: "AI Assistant",
    description: "Get instant help with coding problems",
    icon: Bot,
    href: "/ai",
    iconColor: "text-green-300",
    category: "AI"
  }
];

export function QuickAccessSection() {
  return (
    <section className="space-y-10">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
          <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Quick
          </span>
          {" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
            Access
          </span>
        </h2>
        <p className="text-lg bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent max-w-2xl mx-auto">
          Jump right into your favorite activities and accelerate your coding journey
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{
              scale: 1.05,
              y: -8,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to={action.href} className="group block h-full">
              <div className="h-full min-h-[240px] bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
                <div className="flex flex-col h-full">
                  {/* Category Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="px-3 py-1 bg-black/50 backdrop-blur-sm border border-gray-600 rounded-md text-xs font-medium">
                      <span className="bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
                        {action.category}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-md bg-black/30 backdrop-blur-sm border border-gray-600 flex items-center justify-center group-hover:border-gray-500 transition-all duration-300">
                      <action.icon className={`w-10 h-10 ${action.iconColor} group-hover:scale-110 transition-transform duration-300 drop-shadow-lg`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-3 flex-grow">
                    {/* Title */}
                    <h3 className="font-bold text-xl bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-blue-100 group-hover:to-blue-200 transition-all duration-300">
                      {action.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300 leading-relaxed px-2">
                      {action.description}
                    </p>
                  </div>

                  {/* Action indicator */}
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-center space-x-2 text-xs">
                      <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300">
                        Get Started
                      </span>
                      <div className="w-4 h-0.5 bg-gray-600 rounded-sm group-hover:bg-gray-500 transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Bottom section */}
      <motion.div
        className="text-center pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent font-medium">
              All systems ready
            </span>
          </div>
          <div className="w-px h-4 bg-gray-600" />
          <span className="text-xs bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
            Choose your path
          </span>
        </div>
      </motion.div>
    </section>
  );
}
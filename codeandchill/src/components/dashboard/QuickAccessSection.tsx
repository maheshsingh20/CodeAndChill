import React from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  Code,
  Sparkles,
  Users,
  Target,
  BookOpen,
  MessageSquare,
  Bot
} from "lucide-react";

const quickActions = [
  {
    title: "Solve Problems",
    description: "Practice coding challenges",
    icon: Zap,
    href: "/problems",
    bgGradient: "from-yellow-500/10 to-orange-500/20",
    borderColor: "border-yellow-500/30",
    iconBg: "bg-yellow-500/20",
    iconColor: "text-yellow-300",
    titleColor: "text-yellow-100",
    descColor: "text-yellow-200/80",
    hoverGlow: "hover:shadow-yellow-500/25",
  },
  {
    title: "Take Courses",
    description: "Learn new technologies",
    icon: Code,
    href: "/courses",
    bgGradient: "from-blue-500/10 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-300",
    titleColor: "text-blue-100",
    descColor: "text-blue-200/80",
    hoverGlow: "hover:shadow-blue-500/25",
  },
  {
    title: "Join Contests",
    description: "Compete with others",
    icon: Sparkles,
    href: "/contests",
    bgGradient: "from-purple-500/10 to-pink-500/20",
    borderColor: "border-purple-500/30",
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-300",
    titleColor: "text-purple-100",
    descColor: "text-purple-200/80",
    hoverGlow: "hover:shadow-purple-500/25",
  },
  {
    title: "Live Coding",
    description: "Code with friends",
    icon: Users,
    href: "/collaborative",
    bgGradient: "from-green-500/10 to-emerald-500/20",
    borderColor: "border-green-500/30",
    iconBg: "bg-green-500/20",
    iconColor: "text-green-300",
    titleColor: "text-green-100",
    descColor: "text-green-200/80",
    hoverGlow: "hover:shadow-green-500/25",
  },
  {
    title: "Skill Tests",
    description: "Assess your abilities",
    icon: Target,
    href: "/skill-tests",
    bgGradient: "from-orange-500/10 to-red-500/20",
    borderColor: "border-orange-500/30",
    iconBg: "bg-orange-500/20",
    iconColor: "text-orange-300",
    titleColor: "text-orange-100",
    descColor: "text-orange-200/80",
    hoverGlow: "hover:shadow-orange-500/25",
  },
  {
    title: "Learning Paths",
    description: "Structured learning",
    icon: BookOpen,
    href: "/learning-paths",
    bgGradient: "from-indigo-500/10 to-purple-500/20",
    borderColor: "border-indigo-500/30",
    iconBg: "bg-indigo-500/20",
    iconColor: "text-indigo-300",
    titleColor: "text-indigo-100",
    descColor: "text-indigo-200/80",
    hoverGlow: "hover:shadow-indigo-500/25",
  },
  {
    title: "Community",
    description: "Connect & discuss",
    icon: MessageSquare,
    href: "/forum",
    bgGradient: "from-pink-500/10 to-rose-500/20",
    borderColor: "border-pink-500/30",
    iconBg: "bg-pink-500/20",
    iconColor: "text-pink-300",
    titleColor: "text-pink-100",
    descColor: "text-pink-200/80",
    hoverGlow: "hover:shadow-pink-500/25",
  },
  {
    title: "AI Assistant",
    description: "Get coding help",
    icon: Bot,
    href: "/ai",
    bgGradient: "from-cyan-500/10 to-teal-500/20",
    borderColor: "border-cyan-500/30",
    iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-300",
    titleColor: "text-cyan-100",
    descColor: "text-cyan-200/80",
    hoverGlow: "hover:shadow-cyan-500/25",
  }
];

export function QuickAccessSection() {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent">
          Quick Access
        </h2>
        <p className="text-gray-400 mt-2">
          Jump right into your favorite activities
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Link key={action.title} to={action.href} className="group">
            <div className={`
              relative overflow-hidden rounded-lg p-4 
              bg-gradient-to-br ${action.bgGradient}
              border ${action.borderColor}
              backdrop-blur-sm
              transition-all duration-300 ease-out
              hover:scale-105 hover:-translate-y-1
              hover:shadow-xl ${action.hoverGlow}
              hover:border-opacity-60
            `}>
              {/* Animated background glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${action.bgGradient} blur-xl`} />
              </div>

              {/* Content */}
              <div className="relative z-10 text-center space-y-3">
                {/* Icon */}
                <div className={`
                  mx-auto w-12 h-12 rounded-md ${action.iconBg} 
                  flex items-center justify-center
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className={`font-semibold text-sm ${action.titleColor} group-hover:text-opacity-90 transition-colors`}>
                  {action.title}
                </h3>

                {/* Description */}
                <p className={`text-xs ${action.descColor} group-hover:opacity-90 transition-opacity`}>
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
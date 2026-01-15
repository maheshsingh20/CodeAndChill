import React from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  BookOpen,
  Users,
  Bot,
  Code,
  Settings,
  ArrowRight,
  Wrench
} from "lucide-react";

const tools = [
  {
    id: 1,
    title: "Community Forum",
    description: "Connect with fellow developers and get help",
    icon: MessageSquare,
    href: "/forum",
    iconColor: "text-blue-400",
    stats: "12.5k discussions"
  },
  {
    id: 2,
    title: "Developer Blog",
    description: "Read latest tech articles and tutorials",
    icon: BookOpen,
    href: "/blogpage",
    iconColor: "text-green-400",
    stats: "250+ articles"
  },
  {
    id: 3,
    title: "Success Stories",
    description: "Get inspired by community achievements",
    icon: Users,
    href: "/success-stories",
    iconColor: "text-purple-400",
    stats: "180+ stories"
  },
  {
    id: 4,
    title: "AI Assistant",
    description: "Get coding help from our AI companion",
    icon: Bot,
    href: "/ai",
    iconColor: "text-orange-400",
    stats: "24/7 available"
  },
  {
    id: 5,
    title: "Code Playground",
    description: "Test and experiment with code snippets",
    icon: Code,
    href: "/playground",
    iconColor: "text-cyan-400",
    stats: "Run instantly"
  },
  {
    id: 6,
    title: "Problem Solver",
    description: "Get step-by-step solutions to coding problems",
    icon: Settings,
    href: "/problem-solver",
    iconColor: "text-pink-400",
    stats: "Smart hints"
  }
];

export function ToolsSection() {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-3">
            <Wrench className="text-cyan-400" size={32} />
            Developer Tools & Community
          </h2>
          <p className="text-gray-400 mt-2">
            Essential tools and resources for your coding journey
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div key={tool.id} className="group h-full">
            <Link to={tool.href} className="block h-full">
              <div className="h-full min-h-[240px] bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md group-hover:border-gray-500 transition-all duration-300">
                      <tool.icon className={`w-6 h-6 ${tool.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                    <div className="px-3 py-1 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md text-xs font-medium">
                      <span className="bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
                        {tool.stats}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow space-y-3">
                    {/* Title */}
                    <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-cyan-100 group-hover:to-cyan-200 transition-all duration-300">
                      {tool.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-center space-x-2 text-xs">
                      <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300">
                        Explore Tool
                      </span>
                      <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
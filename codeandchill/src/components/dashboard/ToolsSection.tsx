import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    icon: <MessageSquare size={24} />,
    href: "/forum",
    color: "bg-blue-500/20 text-blue-400",
    stats: "12.5k discussions"
  },
  {
    id: 2,
    title: "Developer Blog",
    description: "Read latest tech articles and tutorials",
    icon: <BookOpen size={24} />,
    href: "/blogpage",
    color: "bg-green-500/20 text-green-400",
    stats: "250+ articles"
  },
  {
    id: 3,
    title: "Success Stories",
    description: "Get inspired by community achievements",
    icon: <Users size={24} />,
    href: "/success-stories",
    color: "bg-purple-500/20 text-purple-400",
    stats: "180+ stories"
  },
  {
    id: 4,
    title: "AI Assistant",
    description: "Get coding help from our AI companion",
    icon: <Bot size={24} />,
    href: "/ai",
    color: "bg-orange-500/20 text-orange-400",
    stats: "24/7 available"
  },
  {
    id: 5,
    title: "Code Playground",
    description: "Test and experiment with code snippets",
    icon: <Code size={24} />,
    href: "/playground",
    color: "bg-cyan-500/20 text-cyan-400",
    stats: "Run instantly"
  },
  {
    id: 6,
    title: "Problem Solver",
    description: "Get step-by-step solutions to coding problems",
    icon: <Settings size={24} />,
    href: "/problem-solver",
    color: "bg-pink-500/20 text-pink-400",
    stats: "Smart hints"
  }
];

export function ToolsSection() {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="heading-secondary flex items-center gap-3">
            <Wrench className="text-cyan-400" size={32} />
            Developer Tools & Community
          </h2>
          <p className="text-slate-400 mt-2">
            Essential tools and resources for your coding journey
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card key={tool.id} className="glass-card hover-lift group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-lg ${tool.color}`}>
                  {tool.icon}
                </div>
                <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded">
                  {tool.stats}
                </span>
              </div>
              <CardTitle className="text-white group-hover:text-purple-300 transition-colors">
                {tool.title}
              </CardTitle>
              <p className="text-slate-400 text-sm">
                {tool.description}
              </p>
            </CardHeader>
            
            <CardContent>
              <Link to={tool.href} className="block">
                <Button size="sm" className="w-full btn-outline group-hover:btn-default transition-all">
                  Explore
                  <ArrowRight size={14} className="ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
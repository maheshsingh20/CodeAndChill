import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
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
    icon: <Zap size={24} />,
    href: "/problems",
    color: "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30",
    gradient: "from-yellow-500/10 to-orange-500/10"
  },
  {
    title: "Take Courses",
    description: "Learn new technologies",
    icon: <Code size={24} />,
    href: "/courses",
    color: "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30",
    gradient: "from-blue-500/10 to-cyan-500/10"
  },
  {
    title: "Join Contests",
    description: "Compete with others",
    icon: <Sparkles size={24} />,
    href: "/contests",
    color: "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30",
    gradient: "from-purple-500/10 to-pink-500/10"
  },
  {
    title: "Live Coding",
    description: "Code with friends",
    icon: <Users size={24} />,
    href: "/collaborative",
    color: "bg-green-500/20 text-green-400 hover:bg-green-500/30",
    gradient: "from-green-500/10 to-emerald-500/10"
  },
  {
    title: "Skill Tests",
    description: "Assess your abilities",
    icon: <Target size={24} />,
    href: "/skill-tests",
    color: "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30",
    gradient: "from-orange-500/10 to-red-500/10"
  },
  {
    title: "Learning Paths",
    description: "Structured learning",
    icon: <BookOpen size={24} />,
    href: "/learning-paths",
    color: "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30",
    gradient: "from-indigo-500/10 to-purple-500/10"
  },
  {
    title: "Community",
    description: "Connect & discuss",
    icon: <MessageSquare size={24} />,
    href: "/forum",
    color: "bg-pink-500/20 text-pink-400 hover:bg-pink-500/30",
    gradient: "from-pink-500/10 to-rose-500/10"
  },
  {
    title: "AI Assistant",
    description: "Get coding help",
    icon: <Bot size={24} />,
    href: "/ai",
    color: "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30",
    gradient: "from-cyan-500/10 to-teal-500/10"
  }
];

export function QuickAccessSection() {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="heading-secondary">Quick Access</h2>
        <p className="text-slate-400 mt-2">
          Jump right into your favorite activities
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link key={action.title} to={action.href} className="group">
            <Card className={`glass-card hover-lift transition-all duration-300 ${action.color} border-0`}>
              <CardContent className="p-6 text-center">
                <div className={`mx-auto mb-3 p-3 rounded-xl bg-gradient-to-br ${action.gradient} w-fit`}>
                  {action.icon}
                </div>
                <h3 className="font-semibold text-white mb-1 group-hover:text-current transition-colors">
                  {action.title}
                </h3>
                <p className="text-xs text-slate-400 group-hover:text-current/80 transition-colors">
                  {action.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
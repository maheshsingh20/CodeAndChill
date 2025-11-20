import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Users, Star, ArrowRight, Target } from "lucide-react";

const learningPaths = [
  {
    id: 1,
    title: "Full-Stack Web Development",
    description: "Master the complete web development stack from frontend to backend",
    icon: "🌐",
    difficulty: "Intermediate",
    duration: "120 hours",
    enrolled: 1247,
    rating: 4.6,
    courses: 8,
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    description: "Comprehensive guide to DSA concepts and problem-solving techniques",
    icon: "🧠",
    difficulty: "Intermediate",
    duration: "80 hours",
    enrolled: 2156,
    rating: 4.8,
    courses: 6,
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30"
  },
  {
    id: 3,
    title: "Machine Learning Fundamentals",
    description: "Dive into the world of AI and machine learning with Python",
    icon: "🤖",
    difficulty: "Advanced",
    duration: "100 hours",
    enrolled: 987,
    rating: 4.7,
    courses: 10,
    color: "bg-green-500/20 text-green-400 border-green-500/30"
  }
];

export function LearningPathsSection() {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="heading-secondary flex items-center gap-3">
            <BookOpen className="text-purple-400" size={32} />
            Learning Paths
          </h2>
          <p className="text-slate-400 mt-2">
            Structured learning journeys to master new skills
          </p>
        </div>
        <Link to="/learning-paths">
          <Button className="btn-default">
            View All Paths
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningPaths.map((path) => (
          <Card key={path.id} className="glass-card hover-lift group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{path.icon}</div>
                <Badge className={`${path.color} border text-xs`}>
                  {path.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-white group-hover:text-purple-300 transition-colors">
                {path.title}
              </CardTitle>
              <p className="text-slate-400 text-sm">
                {path.description}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock size={14} />
                  <span>{path.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Target size={14} />
                  <span>{path.courses} courses</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Users size={14} />
                  <span>{path.enrolled.toLocaleString()} enrolled</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Star size={14} className="text-yellow-400" />
                  <span>{path.rating}</span>
                </div>
              </div>
              
              <Link to={`/learning-paths/${path.id}`} className="block">
                <Button size="sm" className="w-full btn-default">
                  Start Learning
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Clock, Award, TrendingUp, ArrowRight } from "lucide-react";

const skillTests = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of core JavaScript concepts",
    difficulty: "Beginner",
    duration: "30 min",
    questions: 25,
    participants: 1234,
    icon: "🟨",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  },
  {
    id: 2,
    title: "React Development",
    description: "Assess your React skills and component knowledge",
    difficulty: "Intermediate",
    duration: "45 min",
    questions: 30,
    participants: 892,
    icon: "⚛️",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
  },
  {
    id: 3,
    title: "Data Structures & Algorithms",
    description: "Challenge your problem-solving abilities",
    difficulty: "Advanced",
    duration: "60 min",
    questions: 20,
    participants: 567,
    icon: "🧠",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30"
  }
];

export function SkillTestsSection() {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="heading-secondary flex items-center gap-3">
            <Target className="text-orange-400" size={32} />
            Skill Tests
          </h2>
          <p className="text-slate-400 mt-2">
            Evaluate your programming skills and get certified
          </p>
        </div>
        <Link to="/skill-tests">
          <Button className="btn-default">
            View All Tests
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillTests.map((test) => (
          <Card key={test.id} className="glass-card hover-lift group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{test.icon}</div>
                <Badge className={`${test.color} border text-xs`}>
                  {test.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-white group-hover:text-purple-300 transition-colors">
                {test.title}
              </CardTitle>
              <p className="text-slate-400 text-sm">
                {test.description}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock size={14} />
                  <span>{test.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Award size={14} />
                  <span>{test.questions} questions</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <TrendingUp size={14} />
                  <span>{test.participants.toLocaleString()} taken</span>
                </div>
                <Link to={`/skill-tests/${test.id}`}>
                  <Button size="sm" className="btn-default">
                    Start Test
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Clock, Award, TrendingUp, ArrowRight } from "lucide-react";
import api from "@/services/api";

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function SkillTestsSection() {
  const [skillTests, setSkillTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkillTests = async () => {
      try {
        const response = await api.get<any[]>('/skill-tests');
        setSkillTests(response.slice(0, 3));
      } catch (error) {
        console.error('Error fetching skill tests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkillTests();
  }, []);

  if (loading) {
    return <section className="space-y-8"><div className="text-center text-gray-400">Loading skill tests...</div></section>;
  }
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
          <Card key={test._id} className="glass-card hover-lift group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{test.icon || "📝"}</div>
                <Badge className={`${difficultyColors[test.difficulty] || difficultyColors.Intermediate} border text-xs`}>
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
                  <span>{test.duration} min</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Award size={14} />
                  <span>{test.questions?.length || 0} questions</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <TrendingUp size={14} />
                  <span>{test.attempts || 0} taken</span>
                </div>
                <Link to={`/skill-tests/${test._id}`}>
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
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

type Subject = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
};

interface SubjectCardProps {
  subject: Subject;
}

export function SubjectCard({ subject }: SubjectCardProps) {
  return (
    <div className="glass-card group hover-lift overflow-hidden relative">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)] group-hover:opacity-80 transition-opacity duration-500" />

      {/* Content */}
      <div className="flex-row items-start gap-6 p-8 relative z-10">
        <div className="flex items-start gap-6 mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-xl shadow-lg group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-500/25 transition-all duration-300">
            {subject.icon}
          </div>
          <div className="flex-1">
            <h3 className="heading-tertiary mb-3 group-hover:text-blue-400 transition-colors duration-300">
              {subject.title}
            </h3>
            <p className="text-slate-400 leading-relaxed">
              {subject.description}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <Button
            asChild
            className="btn btn-default w-full font-semibold text-base group/btn"
          >
            <Link to={`/engineering-courses/${subject.id}`}>
              Start Learning
              <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

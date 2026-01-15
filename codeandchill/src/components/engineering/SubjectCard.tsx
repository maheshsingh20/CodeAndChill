import {
  EnhancedCard,
  EnhancedCardDescription,
  EnhancedCardFooter,
  EnhancedCardHeader,
  EnhancedCardTitle,
} from "@/components/ui/enhanced-card";
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
  // Different colors for different subjects
  const getSubjectColor = (id: string) => {
    const colorMap: Record<string, string> = {
      'operating-systems': 'text-blue-400',
      'dbms': 'text-green-400',
      'computer-networks': 'text-purple-400',
      'dsa': 'text-orange-400',
      'software-engineering': 'text-cyan-400',
      'web-development': 'text-pink-400',
    };
    return colorMap[id] || 'text-indigo-400';
  };

  const getBgColor = (id: string) => {
    const colorMap: Record<string, string> = {
      'operating-systems': 'bg-blue-600/20',
      'dbms': 'bg-green-600/20',
      'computer-networks': 'bg-purple-600/20',
      'dsa': 'bg-orange-600/20',
      'software-engineering': 'bg-cyan-600/20',
      'web-development': 'bg-pink-600/20',
    };
    return colorMap[id] || 'bg-indigo-600/20';
  };

  const getButtonColor = (id: string) => {
    const colorMap: Record<string, string> = {
      'operating-systems': 'bg-blue-600 hover:bg-blue-700',
      'dbms': 'bg-green-600 hover:bg-green-700',
      'computer-networks': 'bg-purple-600 hover:bg-purple-700',
      'dsa': 'bg-orange-600 hover:bg-orange-700',
      'software-engineering': 'bg-cyan-600 hover:bg-cyan-700',
      'web-development': 'bg-pink-600 hover:bg-pink-700',
    };
    return colorMap[id] || 'bg-indigo-600 hover:bg-indigo-700';
  };

  const iconColor = getSubjectColor(subject.id);
  const bgColor = getBgColor(subject.id);
  const buttonColor = getButtonColor(subject.id);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 rounded-md p-6 shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300 group overflow-hidden relative">
      {/* Content */}
      <div className="flex items-start gap-6 mb-6 w-full">
        <div className={`p-4 ${bgColor} rounded-xl shadow-lg group-hover:scale-110 transition-all duration-300`}>
          <div className={iconColor}>
            {subject.icon}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-3 group-hover:from-gray-100 group-hover:via-white group-hover:to-gray-100 transition-all duration-300">
            {subject.title}
          </h3>
          <p className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent leading-relaxed">
            {subject.description}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Button
          asChild
          className={`w-full font-semibold text-base group/btn ${buttonColor} text-white border-0`}
        >
          <Link to={`/engineering-courses/${subject.id}`}>
            Start Learning
            <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

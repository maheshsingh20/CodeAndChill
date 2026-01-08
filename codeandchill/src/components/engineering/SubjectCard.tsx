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
    const colorMap: Record<string, any> = {
      'operating-systems': 'blue',
      'dbms': 'green',
      'computer-networks': 'purple',
      'dsa': 'orange',
      'software-engineering': 'cyan',
      'web-development': 'pink',
    };
    return colorMap[id] || 'indigo';
  };

  const color = getSubjectColor(subject.id);

  return (
    <EnhancedCard
      variant="neon"
      color={color}
      hover={true}
      glow={true}
      animated={true}
      className="group overflow-hidden relative"
    >
      {/* Content */}
      <EnhancedCardHeader className="flex-row items-start gap-6 relative z-10">
        <div className="flex items-start gap-6 mb-6 w-full">
          <div className={`p-4 bg-gradient-to-br from-${color}-600 to-${color}-500 text-white rounded-xl shadow-lg group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-${color}-500/25 transition-all duration-300`}>
            {subject.icon}
          </div>
          <div className="flex-1">
            <EnhancedCardTitle
              gradient={true}
              color={color}
              className={`mb-3 group-hover:text-${color}-300 transition-colors duration-300`}
            >
              {subject.title}
            </EnhancedCardTitle>
            <EnhancedCardDescription className="leading-relaxed">
              {subject.description}
            </EnhancedCardDescription>
          </div>
        </div>
      </EnhancedCardHeader>

      {/* Footer */}
      <EnhancedCardFooter className="relative z-10">
        <Button
          asChild
          className={`w-full font-semibold text-base group/btn bg-${color}-600 hover:bg-${color}-500 text-white border-0`}
        >
          <Link to={`/engineering-courses/${subject.id}`}>
            Start Learning
            <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </Link>
        </Button>
      </EnhancedCardFooter>
    </EnhancedCard>
  );
}

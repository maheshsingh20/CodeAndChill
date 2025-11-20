import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface ProblemSetCardProps {
  set: {
    slug: string;
    title: string;
    author: string;
    description: string;
    problemsCount: number;
    icon: React.ReactNode;
  };
}

export function ProblemSetCard({ set }: ProblemSetCardProps) {
  return (
    <Link to={`/problems/${set.slug}`} className="group">
      <Card className="card glass-card flex flex-col h-full hover-lift">
        <CardHeader className="card-header p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary text-primary-foreground rounded-lg mt-1 shadow-md group-hover:bg-primary/90 transition-colors">
              {set.icon}
            </div>
            <div>
              <CardTitle className="card-title text-xl font-bold group-hover:text-primary transition-colors">
                {set.title}
              </CardTitle>
              <CardDescription className="card-description mt-1 text-sm">
                by {set.author}
              </CardDescription>
            </div>
          </div>
          <p className="text-muted-foreground text-sm pt-4">{set.description}</p>
        </CardHeader>

        <CardFooter className="card-footer p-6 mt-auto flex justify-between items-center border-t border-border">
          <span className="font-semibold text-foreground">
            {set.problemsCount} Problems
          </span>
          <div className="flex items-center text-primary font-semibold group-hover:text-primary/80 transition-colors">
            View Set
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
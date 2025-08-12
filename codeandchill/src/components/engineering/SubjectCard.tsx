import React from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
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
    <Card
      className="relative rounded-2xl shadow-lg 
                 bg-gradient-to-br from-cyan-50 via-white to-lime-50
                 border border-cyan-200
                 hover:shadow-2xl hover:scale-[1.02] hover:border-cyan-400
                 transition-all duration-300 ease-in-out
                 flex flex-col group overflow-hidden"
    >
      {/* Background image overlay */}
      <div
        className="absolute inset-0 bg-[url('/pattern-bg.png')] bg-cover bg-center opacity-10 pointer-events-none"
      ></div>

      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-transparent to-cyan-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
      ></div>

      {/* Content */}
      <CardHeader className="flex-row items-start gap-6 p-6 relative z-10">
        <div className="p-4 bg-cyan-100 text-cyan-800 rounded-xl mt-1 shadow-sm">
          {subject.icon}
        </div>
        <div>
          <CardTitle className="text-xl font-bold text-cyan-900">
            {subject.title}
          </CardTitle>
          <CardDescription className="mt-2 text-cyan-800/80">
            {subject.description}
          </CardDescription>
        </div>
      </CardHeader>

      {/* Footer Button */}
      <CardFooter className="p-6 mt-auto relative z-10">
        <Button
          asChild
          className="w-full font-semibold bg-cyan-700 hover:bg-cyan-800 
                     text-white rounded-xl shadow-md transition-all duration-300"
        >
          <Link to={`/engineering-courses/${subject.id}`}>
            Start Learning
            <ArrowRight
              className="ml-2 h-4 w-4 transition-transform duration-300 
                         group-hover:translate-x-1"
            />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

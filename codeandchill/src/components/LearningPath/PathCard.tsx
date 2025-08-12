import React from 'react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

type Path = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  courseCount: number;
};

interface PathCardProps {
  path: Path;
}

export function PathCard({ path }: PathCardProps) {
  return (
    <Card
      className="
        rounded-2xl 
        bg-gradient-to-br from-white/95 to-cyan-50
        shadow-lg 
        transition-all 
        duration-300 
        ease-in-out 
        flex 
        flex-col 
        group
        hover:shadow-xl
        hover:scale-[1.02]
        focus-within:shadow-xl
        outline-none
        border border-cyan-100
      "
      tabIndex={0} // Focusable for keyboard users
    >
      {/* Card Header */}
      <CardHeader className="flex-row items-start gap-6 p-6">
        {/* Icon container */}
        <div
          className="
            p-5 
            bg-gradient-to-br from-cyan-100 to-cyan-200
            text-cyan-800 
            rounded-3xl 
            shadow-inner 
            flex 
            items-center 
            justify-center
            transition-transform
            group-hover:scale-105
            group-focus-within:scale-105
          "
        >
          {path.icon}
        </div>

        {/* Title & description */}
        <div>
          <CardTitle className="text-2xl font-extrabold text-cyan-900">
            {path.title}
          </CardTitle>
          <CardDescription className="mt-2 text-cyan-800/80">
            {path.description}
          </CardDescription>
        </div>
      </CardHeader>

      {/* Footer */}
      <CardFooter
        className="
          p-6 
          mt-auto 
          flex 
          justify-between 
          items-center 
          bg-cyan-50/60
          rounded-b-2xl 
          border-t border-cyan-100
        "
      >
        <span className="font-semibold text-cyan-700 uppercase tracking-wide text-sm">
          {path.courseCount} Courses
        </span>

        <Button asChild aria-label={`View details for ${path.title} path`}>
          <Link
            to={`/paths/${path.id}`}
            className="
              flex 
              items-center 
              text-cyan-700
              font-semibold 
              focus-visible:outline-none 
              focus-visible:ring-2 
              focus-visible:ring-cyan-400 
              focus-visible:ring-offset-2 
              transition
              group-hover:text-cyan-800
            "
          >
            View Path
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

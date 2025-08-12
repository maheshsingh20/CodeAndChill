import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button.tsx";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface SectionProps {
  title: string;
  viewAllLink?: string;
  children: ReactNode;
}

export function Section({ title, viewAllLink, children }: SectionProps) {
  return (
    <section aria-labelledby={`${title.toLowerCase().replace(/\s+/g, "-")}-heading`} className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2
          id={`${title.toLowerCase().replace(/\s+/g, "-")}-heading`}
          className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900"
        >
          {title}
        </h2>
        {viewAllLink && (
          <Button
            asChild
            variant="ghost"
            className="hidden sm:flex text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            aria-label={`View all ${title.toLowerCase()}`}
          >
            <Link to={viewAllLink}>
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
      <div>{children}</div>
    </section>
  );
}

import { ReactNode } from "react";
import { NeonButton } from "@/components/ui/NeonCard";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface SectionProps {
  title: string;
  viewAllLink?: string;
  children: ReactNode;
}

export function Section({ title, viewAllLink, children }: SectionProps) {
  const headingId = `${title.toLowerCase().replace(/\s+/g, "-")}-heading`;

  return (
    <section aria-labelledby={headingId} className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2
          id={headingId}
          className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent"
        >
          {title}
        </h2>

        {viewAllLink && (
          <Link to={viewAllLink} className="hidden sm:block">
            <NeonButton variant="outline" glowColor="blue" className="text-sm">
              <span className="flex items-center gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </span>
            </NeonButton>
          </Link>
        )}
      </div>

      <div>{children}</div>
    </section>
  );
}
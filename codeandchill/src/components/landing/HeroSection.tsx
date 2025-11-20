import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40 gradient-bg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid max-w-5xl mx-auto items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Text Content */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Upgrade Your Skills, Anytime, Anywhere.
            </h1>
            <p className="max-w-2xl text-muted-foreground md:text-xl lg:text-base mx-auto lg:mx-0">
              Unlock your potential with our AI-powered learning platform.
              Interactive coding playgrounds, expert-led video courses, and
              instant feedback to accelerate your growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="btn btn-default group"
              >
                <Link to="/signup">
                  Start Learning Free
                  <ArrowRight className="inline-block w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="btn btn-outline"
              >
                <Link to="/courses">Browse Courses</Link>
              </Button>
            </div>
          </div>

          {/* Visual Card */}
          <div className="flex justify-center">
            <div className="card glass-card w-full max-w-md h-64 lg:h-80 flex items-center justify-center">
              <div className="text-center">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mx-auto mb-4"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="3"
                    fill="hsl(var(--primary))"
                    opacity="0.1"
                  />
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="3"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 13h8M8 17h8"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="7" cy="9" r="1.5" fill="hsl(var(--accent))" />
                  <circle cx="12" cy="9" r="1.5" fill="hsl(var(--accent))" />
                  <circle cx="17" cy="9" r="1.5" fill="hsl(var(--accent))" />
                </svg>
                <p className="text-primary font-semibold">
                  Interactive Coding Playground
                </p>
                <p className="text-muted-foreground text-sm">
                  Try code, see results instantly!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
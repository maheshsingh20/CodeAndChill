import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid max-w-5xl mx-auto items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Text Content */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-cyan-400 drop-shadow-neon">
              Upgrade Your Skills, Anytime, Anywhere.
            </h1>
            <p className="max-w-2xl text-cyan-300/80 md:text-xl lg:text-base mx-auto lg:mx-0">
              Unlock your potential with our AI-powered learning platform.
              Interactive coding playgrounds, expert-led video courses, and
              instant feedback to accelerate your growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="group bg-cyan-700 hover:bg-cyan-600 text-white font-semibold rounded-xl shadow-neon-lg"
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
                className="border-cyan-400 text-cyan-300 font-semibold rounded-xl hover:bg-cyan-900/20 hover:border-cyan-300"
              >
                <Link to="/courses">Browse Courses</Link>
              </Button>
            </div>
          </div>

          {/* Visual Card */}
          <div className="flex justify-center">
            <div className="w-full max-w-md h-64 lg:h-80 rounded-2xl shadow-neon-lg flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border border-cyan-400">
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
                    fill="#06b6d4"
                    opacity="0.1"
                  />
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="3"
                    stroke="#22d3ee"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 13h8M8 17h8"
                    stroke="#22d3ee"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="7" cy="9" r="1.5" fill="#a3e635" />
                  <circle cx="12" cy="9" r="1.5" fill="#a3e635" />
                  <circle cx="17" cy="9" r="1.5" fill="#a3e635" />
                </svg>
                <p className="text-cyan-400 font-semibold drop-shadow-neon">
                  Interactive Coding Playground
                </p>
                <p className="text-cyan-300 text-sm opacity-80">
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

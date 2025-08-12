import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-b from-lime-100 via-gray-100 to-cyan-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid max-w-5xl mx-auto items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-cyan-900 drop-shadow">
              Upgrade Your Skills, Anytime, Anywhere.
            </h1>
            <p className="max-w-2xl text-cyan-800/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto lg:mx-0">
              Unlock your potential with our AI-powered learning platform.
              Interactive coding playgrounds, expert-led video courses, and
              instant feedback to accelerate your growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="group bg-cyan-700 hover:bg-cyan-800 text-white font-semibold rounded-xl shadow"
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
                className="border-cyan-700 text-cyan-800 font-semibold rounded-xl"
              >
                <Link to="/courses">
                  Browse Courses
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            {/* Engaging visual: gradient card with icon */}
            <div className="w-full max-w-md h-64 lg:h-80 rounded-2xl shadow-xl flex items-center justify-center bg-gradient-to-br from-cyan-100 via-lime-100 to-gray-100 border-2 border-cyan-200">
              <div className="text-center">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="mx-auto mb-4">
                  <rect x="3" y="5" width="18" height="14" rx="3" fill="#22d3ee" opacity="0.2"/>
                  <rect x="3" y="5" width="18" height="14" rx="3" stroke="#06b6d4" strokeWidth="2"/>
                  <path d="M8 13h8M8 17h8" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="7" cy="9" r="1.5" fill="#a3e635"/>
                  <circle cx="12" cy="9" r="1.5" fill="#a3e635"/>
                  <circle cx="17" cy="9" r="1.5" fill="#a3e635"/>
                </svg>
                <p className="text-cyan-800 font-semibold">Interactive Coding Playground</p>
                <p className="text-cyan-700 text-sm opacity-80">Try code, see results instantly!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
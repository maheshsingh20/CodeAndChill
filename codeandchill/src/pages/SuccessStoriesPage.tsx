import React from "react";
import { Button } from "@/components/ui/button.tsx";
import { StoryCard } from "@/components/success/StoryCard.tsx";
import { PenSquare, Sparkles } from "lucide-react";

// Success stories mock data
const stories = [
  {
    name: "Priya Sharma",
    company: "Google",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    quote:
      "The DSA course was a complete game-changer for my interviews. The hands-on problems gave me the confidence to tackle any question.",
    skills: ["Data Structures", "Algorithms", "C++"],
  },
  {
    name: "Rohan Mehra",
    company: "Microsoft",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote:
      "I went from knowing basic HTML to building a full-stack MERN application. The learning path was structured perfectly.",
    skills: ["React", "Node.js", "MongoDB"],
  },
  {
    name: "Anjali Singh",
    company: "Amazon",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "The mock interviews and resume guidance were invaluable. I landed my dream job just two months after completing the DevOps path!",
    skills: ["AWS", "Docker", "CI/CD"],
  },
  {
    name: "Vikram Reddy",
    company: "Netflix",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    quote:
      "The AI & ML specialization is top-notch. The projects are challenging and directly applicable to real-world scenarios.",
    skills: ["Python", "TensorFlow"],
  },
  {
    name: "Meera Desai",
    company: "Apple",
    image: "https://randomuser.me/api/portraits/women/50.jpg",
    quote:
      "The community support is amazing. Whenever I was stuck, there was always someone to help me in the Discord channel.",
    skills: ["System Design", "Java"],
  },
  {
    name: "Arjun Kumar",
    company: "Meta",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    quote:
      "The competitive programming track prepared me perfectly for the high-pressure environment of technical rounds.",
    skills: ["Competitive Programming"],
  },
];

export function SuccessStoriesPage() {
  return (
    <div
      className={`
        w-full min-h-screen
        bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800
        border-t border-cyan-400/40
      `}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Header */}
        <header className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
            <span className="uppercase tracking-wide text-cyan-400 font-semibold text-sm">
              Real Journeys
            </span>
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
          </div>
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight 
            bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg"
          >
            Success Stories
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed">
            Read how{" "}
            <span className="font-semibold text-cyan-400">
              Code &amp; Chill
            </span>{" "}
            has helped learners achieve their{" "}
            <span className="font-semibold text-purple-400">dream careers</span>
            .
          </p>
          <Button
            size="lg"
            className="mt-8 font-semibold bg-cyan-600 hover:bg-cyan-700 text-white 
            shadow-lg shadow-cyan-500/30 rounded-xl px-6 py-3 transition-transform hover:scale-[1.02]"
          >
            <PenSquare className="mr-2 h-5 w-5" />
            Share Your Story
          </Button>
        </header>

        {/* Stories Grid */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {stories.map((story) => (
            <StoryCard key={story.name} story={story} />
          ))}
        </main>
      </div>
    </div>
  );
}

import React from "react";
import { Button } from "@/components/ui/button.tsx";
import { StoryCard } from "@/components/success/StoryCard.tsx";
import { PenSquare } from "lucide-react";

// Mock data for success stories
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
        bg-gradient-to-br from-lime-100 via-gray-100 to-cyan-100
        border-t-4 border-cyan-200
      `}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-cyan-900">
            Success Stories
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-cyan-800/80">
            Read how <span className="font-semibold text-cyan-900">Code &amp; Chill</span> has helped learners achieve their career dreams.
          </p>
          <Button
            size="lg"
            className="mt-6 font-semibold bg-cyan-700 hover:bg-cyan-800 text-white shadow-md rounded-xl"
          >
            <PenSquare className="mr-2 h-5 w-5" />
            Share Your Story
          </Button>
        </header>

        {/* Stories Grid */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <StoryCard key={story.name} story={story} />
          ))}
        </main>
      </div>
    </div>
  );
}

import React from "react";
import { Sparkles } from "lucide-react";

interface WelcomeBackProps {
  userName?: string;
  quote?: string;
  author?: string;
}

export function WelcomeBack({
  userName = "Alex",
  quote = "“The only way to do great work is to love what you do.”",
  author = "— Steve Jobs",
}: WelcomeBackProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <section
      aria-label="Welcome back user"
      className="w-full px-6 md:px-12 py-14 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Date */}
        <p className="text-sm text-gray-200 opacity-70 tracking-wide">
          {currentDate}
        </p>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-cyan-400" />
          Welcome back, <span className="capitalize">{userName}</span>!
        </h1>

        {/* Quote */}
        <blockquote className="mt-4 max-w-3xl text-xl md:text-2xl italic font-semibold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
          {quote}
        </blockquote>
        <p className="text-right text-gray-200 opacity-80 font-medium">
          {author}
        </p>
      </div>
    </section>
  );
}

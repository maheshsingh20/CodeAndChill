import React from "react";

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
      className="max-w-7xl mx-auto px-6 md:px-12 py-10"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Greeting Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground select-none">{currentDate}</p>
          <h1 className="text-5xl font-extrabold text-primary leading-tight truncate">
            Welcome back, <span className="capitalize">{userName}</span>!
          </h1>
          <p className="mt-6 max-w-lg text-lg italic text-muted-foreground font-medium">
            {quote}
          </p>
          <p className="mt-2 text-right text-muted-foreground font-semibold">{author}</p>
        </div>
      </div>
    </section>
  );
}

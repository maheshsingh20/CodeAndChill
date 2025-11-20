import { Sparkles } from "lucide-react";

interface WelcomeBackProps {
  userName?: string;
  quote?: string;
  author?: string;
}

export function WelcomeBack({
  userName = "Alex",
  quote = "The only way to do great work is to love what you do.",
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
      className="w-full px-6 md:px-12 py-14 gradient-bg border-b border-border"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Date */}
        <p className="text-sm text-slate-500 tracking-wide uppercase font-medium">
          {currentDate}
        </p>

        {/* Heading */}
        <h1 className="heading-primary flex items-center gap-4">
          <Sparkles className="h-10 w-10 text-blue-400" />
          Welcome back, <span className="capitalize text-blue-400">{userName}</span>!
        </h1>

        {/* Quote */}
        <blockquote className="mt-6 max-w-4xl text-xl md:text-2xl italic font-medium text-slate-300 leading-relaxed">
          "{quote}"
        </blockquote>
        <p className="text-right text-slate-400 font-medium text-lg">
          {author}
        </p>
      </div>
    </section>
  );
}
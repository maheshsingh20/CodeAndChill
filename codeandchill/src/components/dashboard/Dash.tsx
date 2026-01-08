import { Sparkles } from "lucide-react";
import { CodedBackground3D } from "@/components/ui/CodedBackground3D";
import { FloatingCodeSnippets } from "@/components/ui/FloatingCodeSnippets";
import { MatrixRain } from "@/components/ui/MatrixRain";
import { BinaryRain } from "@/components/ui/BinaryRain";

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
      className="relative w-full px-6 md:px-12 py-14 overflow-hidden min-h-[60vh]"
    >
      {/* Matrix Rain Background */}
      <MatrixRain opacity={0.08} />

      {/* Binary Rain */}
      <BinaryRain density={0.3} speed={0.8} />

      {/* 3D Animated Background */}
      <CodedBackground3D />

      {/* Floating Code Snippets */}
      <FloatingCodeSnippets />

      {/* Additional overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent pointer-events-none" />

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-purple-900/5 to-cyan-900/5 animate-pulse pointer-events-none" />

      <div className="relative z-20 max-w-7xl mx-auto flex flex-col gap-6">
        {/* Date with enhanced styling */}
        <div className="relative">
          <p className="text-sm text-gray-300 tracking-wide uppercase font-medium drop-shadow-lg">
            {currentDate}
          </p>
          <div className="absolute -bottom-1 left-0 w-16 h-0.5 bg-gradient-to-r from-blue-400 to-transparent"></div>
        </div>

        {/* Heading with enhanced animations */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight flex items-center gap-4 flex-wrap">
          <Sparkles className="h-10 w-10 text-blue-400 drop-shadow-lg animate-pulse" />
          <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent drop-shadow-2xl animate-in slide-in-from-left duration-1000">
            Welcome back,
          </span>
          <span className="capitalize bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl animate-in slide-in-from-right duration-1000 delay-300">
            {userName}
          </span>
          <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent drop-shadow-2xl animate-in slide-in-from-left duration-1000 delay-500">
            !
          </span>
        </h1>

        {/* Quote with enhanced styling */}
        <div className="mt-6 max-w-4xl animate-in fade-in duration-1000 delay-700">
          <blockquote className="text-xl md:text-2xl italic font-medium leading-relaxed">
            <span className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent drop-shadow-lg">
              "{quote}"
            </span>
          </blockquote>
          <p className="text-right text-gray-200 font-medium text-lg drop-shadow-lg mt-4">
            {author}
          </p>
        </div>

        {/* Coding stats or quick actions */}
        <div className="mt-8 flex gap-4 animate-in slide-in-from-bottom duration-1000 delay-1000 flex-wrap">
          <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg backdrop-blur-sm">
            <span className="text-blue-300 text-sm font-mono">Ready to code</span>
          </div>
          <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg backdrop-blur-sm">
            <span className="text-green-300 text-sm font-mono">System online</span>
          </div>
          <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg backdrop-blur-sm">
            <span className="text-purple-300 text-sm font-mono">AI assistant active</span>
          </div>
        </div>
      </div>
    </section>
  );
}
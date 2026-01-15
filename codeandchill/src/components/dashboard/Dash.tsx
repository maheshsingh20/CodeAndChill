import { Sparkles, Code, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";
import { CodedBackground3D } from "@/components/ui/CodedBackground3D";
import { FloatingCodeSnippets } from "@/components/ui/FloatingCodeSnippets";
import { MatrixRain } from "@/components/ui/MatrixRain";
import { BinaryRain } from "@/components/ui/BinaryRain";
import "@/styles/animated-background.css";

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

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section
      aria-label="Welcome back user"
      className="relative w-full px-6 md:px-12 py-20 overflow-hidden min-h-[70vh]"
    >
      <div className="relative z-20 max-w-7xl mx-auto">
        {/* Enhanced Date and Time Section */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <p className="text-sm bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-clip-text text-transparent tracking-wider uppercase font-semibold mb-1">
              {currentDate}
            </p>
            <p className="text-xs bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent font-mono">
              {currentTime}
            </p>
            <div className="absolute -bottom-2 left-0 w-20 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-transparent animate-pulse"></div>
          </div>

          <div className="flex items-center gap-3">
            <motion.div
              className="px-3 py-1 bg-black border border-green-500/30 rounded-full"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="bg-gradient-to-r from-green-200 via-green-100 to-green-200 bg-clip-text text-transparent text-xs font-mono flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Online
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Main Heading */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
            <motion.div
              className="flex items-center gap-6 flex-wrap mb-4"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-12 w-12 md:h-16 md:w-16 text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text drop-shadow-2xl" />
              </motion.div>
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
                Welcome back,
              </span>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <span className="capitalize bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl block">
                {userName}
                <motion.span
                  className="inline-block ml-2"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  !
                </motion.span>
              </span>
            </motion.div>
          </h1>

          {/* Enhanced Subtitle */}
          <motion.p
            className="text-xl md:text-2xl bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent max-w-3xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Ready to{" "}
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-semibold">
              code
            </span>
            ,{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent font-semibold">
              learn
            </span>
            , and{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent font-semibold">
              innovate
            </span>
            ? Let's make today amazing!
          </motion.p>
        </motion.div>

        {/* Enhanced Quote Section with Better Styling */}
        <motion.div
          className="mt-12 max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 md:p-10">
            <blockquote className="relative text-xl md:text-2xl lg:text-3xl italic font-medium leading-relaxed mb-6">
              <span className="text-gray-100 drop-shadow-lg">
                "{quote}"
              </span>
            </blockquote>
            <p className="text-right text-gray-300 font-semibold text-lg">
              {author}
            </p>
          </div>
        </motion.div>

        {/* Enhanced Status Cards with Simple Dark Design */}
        <motion.div
          className="mt-12 flex gap-4 flex-wrap"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {[
            { icon: Code, text: "Ready to code", color: "blue", iconColor: "text-blue-300" },
            { icon: Zap, text: "System online", color: "green", iconColor: "text-green-300" },
            { icon: Star, text: "AI assistant active", color: "purple", iconColor: "text-purple-300" }
          ].map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="px-6 py-3 bg-black border border-gray-800 rounded-lg hover:border-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-900 border border-gray-700">
                    <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                  </div>
                  <span className={`text-sm font-mono bg-gradient-to-r from-white via-${item.color}-100 to-${item.color}-200 bg-clip-text text-transparent transition-all duration-300`}>
                    {item.text}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
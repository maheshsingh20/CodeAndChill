import { Sparkles, Code, Trophy, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import "@/styles/animated-background.css";

interface WelcomeBackProps {
  userName?: string;
  quote?: string;
  author?: string;
}

export function WelcomeBack({
  userName = "Alex",
  quote = "The only way to do great work is to love what you do.",
  author = "— Steve Jobs"
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
      className="relative w-full px-6 md:px-12 py-16 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto">
        {/* Top Bar with Date and Status */}
        <motion.div
          className="flex items-center justify-between mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <p className="text-sm bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent tracking-wider uppercase font-semibold mb-1">
              {currentDate}
            </p>
            <p className="text-xs text-gray-400 font-mono">
              {currentTime}
            </p>
            <div className="absolute -bottom-2 left-0 w-16 h-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-transparent"></div>
          </div>

          <div className="flex items-center gap-3">
            <motion.div
              className="px-4 py-1.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-full backdrop-blur-sm"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-green-400 text-xs font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Learning Mode Active
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Welcome Section */}
        <motion.div
          className="space-y-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
            <motion.div
              className="flex items-center gap-4 flex-wrap mb-3"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-10 w-10 md:h-14 md:w-14 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
              </motion.div>
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                Welcome back,
              </span>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-4"
            >
              <span className="capitalize bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl">
                {userName}
              </span>
              <motion.span
                className="inline-block ml-2 text-purple-400"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                !
              </motion.span>
            </motion.div>
          </h1>

          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            Continue your learning journey. Master new skills, solve challenges, and level up your coding expertise.
          </motion.p>
        </motion.div>

        {/* Motivational Quote */}
        <motion.div
          className="max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-md rounded-2xl p-8 md:p-10 border border-gray-800 overflow-hidden">
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full"></div>

            <div className="relative z-10">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold mt-2">
                  Daily Inspiration
                </span>
              </div>

              <blockquote className="text-lg md:text-xl italic font-medium leading-relaxed mb-4 text-gray-200">
                "{quote}"
              </blockquote>

              <p className="text-right text-gray-400 font-medium text-sm">
                {author}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Action Status Cards */}
        <motion.div
          className="mt-10 flex gap-3 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.7 }}
        >
          {[
            { icon: Code, text: "Code Editor Ready", color: "blue" },
            { icon: Trophy, text: "Challenges Available", color: "yellow" },
            { icon: TrendingUp, text: "Progress Tracking", color: "green" }
          ].map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 1.9 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="px-5 py-2.5 bg-black/50 border border-gray-800 rounded-lg hover:border-gray-700 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center gap-2.5">
                  <item.icon className={`w-4 h-4 text-${item.color}-400`} />
                  <span className="text-sm text-gray-300 font-medium">
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
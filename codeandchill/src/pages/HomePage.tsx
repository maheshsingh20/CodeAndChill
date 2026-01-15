import React, { JSX } from "react";
import { motion, Variants } from "framer-motion";
import { WelcomeBack } from "@/components/dashboard/Dash";
import { LearningPaths } from "@/components/dashboard/LearningPaths";
import { ContestsPreview } from "@/components/dashboard/ContestsPreview";
import { ContinueLearning } from "@/components/dashboard/ContinueLearning";
import { CommunitySection } from "@/components/dashboard/CommunitySection";
import { BlogSection } from "@/components/dashboard/BlogSection";
import { SuccessStories } from "@/components/dashboard/SuccessStories";
import { YourActivityFeed } from "@/components/dashboard/YourActivityFeed";
import { QuizzesSection } from "@/components/dashboard/QuizzesSection";
import { SkillTestsSection } from "@/components/dashboard/SkillTestsSection";
import { LearningPathsSection } from "@/components/dashboard/LearningPathsSection";
import { ToolsSection } from "@/components/dashboard/ToolsSection";
import { QuickAccessSection } from "@/components/dashboard/QuickAccessSection";
import { useUser } from "@/contexts/UserContext";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import "@/styles/modern-homepage.css";
import "@/styles/animated-background.css";

const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
    filter: "blur(10px)"
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1
    }
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const animationProps = {
  variants: sectionVariants,
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, margin: "-100px" },
  whileHover: {
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export function HomePage(): JSX.Element {
  const { user, loading } = useUser();

  return (
    <div className="page-container">
      {/* Welcome Section with Enhanced Animation */}
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <WelcomeBack userName={loading ? "Loading..." : (user?.name || "User")} />
      </motion.div>

      <motion.div
        className="container mx-auto max-w-7xl px-6 md:px-12 section-padding space-y-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Quick Access with Glass Morphism */}
        <motion.div
          {...animationProps}
          className="relative group"
        >
          <div className="relative backdrop-blur-sm bg-gray-900/30 border border-gray-800/50 rounded-lg p-8 shadow-2xl">
            <QuickAccessSection />
          </div>
        </motion.div>

        {/* Continue Learning with Enhanced Cards */}
        <motion.div
          {...animationProps}
          className="relative group"
        >
          <div className="relative backdrop-blur-sm bg-gray-900/30 border border-gray-800/50 rounded-lg p-8 shadow-2xl">
            <ContinueLearning />
          </div>
        </motion.div>

        {/* Quizzes Section */}
        <motion.div
          {...animationProps}
          className="relative group"
        >
          <div className="relative backdrop-blur-sm bg-gray-900/30 border border-gray-800/50 rounded-lg p-8 shadow-2xl">
            <QuizzesSection />
          </div>
        </motion.div>

        {/* Learning Paths */}
        <motion.div
          {...animationProps}
          className="relative group"
        >
          <div className="relative backdrop-blur-sm bg-gray-900/30 border border-gray-800/50 rounded-lg p-8 shadow-2xl">
            <LearningPathsSection />
          </div>
        </motion.div>

        {/* Skill Tests */}
        <motion.div
          {...animationProps}
          className="relative group"
        >
          <div className="relative backdrop-blur-sm bg-gray-900/30 border border-gray-800/50 rounded-lg p-8 shadow-2xl">
            <SkillTestsSection />
          </div>
        </motion.div>

        {/* Contests Preview */}
        <motion.div
          {...animationProps}
          className="relative group"
        >
          <div className="relative backdrop-blur-sm bg-gray-900/30 border border-gray-800/50 rounded-lg p-8 shadow-2xl">
            <ContestsPreview />
          </div>
        </motion.div>

        {/* Tools Section */}
        <motion.div
          {...animationProps}
          className="relative group"
        >
          <div className="relative backdrop-blur-sm bg-gray-900/30 border border-gray-800/50 rounded-lg p-8 shadow-2xl">
            <ToolsSection />
          </div>
        </motion.div>

        {/* Two Column Layout with Enhanced Styling */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
          variants={containerVariants}
        >
          <div className="lg:col-span-2 space-y-8">
            {/* Community Section */}
            <motion.div
              {...animationProps}
              className="relative group"
            >
              <div className="relative backdrop-blur-sm bg-gray-900/30 border border-gray-800/50 rounded-lg p-8 shadow-2xl">
                <CommunitySection />
              </div>
            </motion.div>

            {/* Blog Section */}
            <motion.div
              {...animationProps}
              className="relative group"
            >
              <div className="relative backdrop-blur-sm bg-gray-900/30 border border-gray-800/50 rounded-lg p-8 shadow-2xl">
                <BlogSection />
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            {/* Success Stories */}
            <motion.div
              {...animationProps}
              className="relative group"
            >
              <div className="relative backdrop-blur-sm bg-gray-900/30 border border-gray-800/50 rounded-lg p-8 shadow-2xl">
                <SuccessStories />
              </div>
            </motion.div>

            {/* Activity Feed */}
            <motion.div
              {...animationProps}
              className="relative group"
            >
              <div className="relative backdrop-blur-sm bg-gray-900/30 border border-gray-800/50 rounded-lg p-8 shadow-2xl">
                <YourActivityFeed />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

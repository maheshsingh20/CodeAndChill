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

const sectionVariants:Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } },
};

const animationProps = {
  variants: sectionVariants,
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true },
};

export function HomePage(): JSX.Element {
  const { user, loading } = useUser();

  return (
    <div className="min-h-screen w-full relative">
      {/* Consistent Background - matches landing page */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Welcome Section */}
      <WelcomeBack userName={loading ? "Loading..." : (user?.name || "User")} />

      <div className="container mx-auto max-w-7xl px-6 md:px-12 section-padding space-y-16">
        <motion.div {...animationProps}>
          <QuickAccessSection />
        </motion.div>

        <motion.div {...animationProps}>
          <ContinueLearning />
        </motion.div>

        <motion.div {...animationProps}>
          <QuizzesSection />
        </motion.div>

        <motion.div {...animationProps}>
          <LearningPathsSection />
        </motion.div>

        <motion.div {...animationProps}>
          <SkillTestsSection />
        </motion.div>

        <motion.div {...animationProps}>
          <ContestsPreview />
        </motion.div>

        <motion.div {...animationProps}>
          <ToolsSection />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          <div className="lg:col-span-2 space-y-16">
            <motion.div {...animationProps}>
              <CommunitySection />
            </motion.div>

            <motion.div {...animationProps}>
              <BlogSection />
            </motion.div>
          </div>

          <div className="lg:col-span-1 space-y-16">
            <motion.div {...animationProps}>
              <SuccessStories />
            </motion.div>

            <motion.div {...animationProps}>
              <YourActivityFeed />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

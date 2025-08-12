import { motion } from "framer-motion";
import { WelcomeBack } from "@/components/dashboard/Dash.tsx";
import { LearningPaths } from "@/components/dashboard/LearningPaths.tsx";
import { ContestsPreview } from "@/components/dashboard/ContestsPreview.tsx";
import { ContinueLearning } from "@/components/dashboard/ContinueLearning.tsx";
import { CommunitySection } from "@/components/dashboard/CommunitySection.tsx";
import { BlogSection } from "@/components/dashboard/BlogSection.tsx";
import { SuccessStories } from "@/components/dashboard/SuccessStories.tsx";
import { YourActivityFeed } from "@/components/dashboard/YourActivityFeed.tsx";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const animationProps = {
  variants: sectionVariants,
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true },
};

export function HomePage(): JSX.Element {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-lime-100 via-gray-50 to-cyan-100">
      {/* DashboardHeader is full width and outside container */}
      <WelcomeBack
        userName="Mahesh"
        coursesInProgress={3}
        problemsSolved={7}
        achievements={2}
      />
      <div className="container mx-auto max-w-7xl px-6 md:px-12 py-16 space-y-20">
        <motion.div {...animationProps}>
          <ContinueLearning />
        </motion.div>

        <motion.div {...animationProps}>
          <LearningPaths />
        </motion.div>

        <motion.div {...animationProps}>
          <ContestsPreview />
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

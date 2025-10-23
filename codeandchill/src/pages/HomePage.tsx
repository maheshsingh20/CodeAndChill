import React, { useState, useEffect, JSX } from "react";
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
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const token = localStorage.getItem("token"); // or wherever you store JWT
        const response = await fetch("http://localhost:3001/api/user/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // send JWT
          },
        });

        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        console.log("Profile data:", data); // check API response
        setUserName(data.name || "User"); // adjust based on your API
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserName("User");
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-foreground">
      {/* Welcome Section */}
      <WelcomeBack userName={loading ? "Loading..." : (userName || "User")} />

      <div className="container mx-auto max-w-7xl px-6 md:px-12 py-16 space-y-20">
        <motion.div {...animationProps}>
          <ContinueLearning />
        </motion.div>

        <motion.div {...animationProps}>
          <QuizzesSection />
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

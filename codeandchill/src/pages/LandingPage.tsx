// src/pages/LandingPage.tsx
import React from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { KeyFeatures } from "@/components/landing/KeyFeatures";
import { PopularTopics } from "@/components/landing/PopularTopic";
import { ContestsPreview } from "@/components/landing/ContestsPreview";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { NewsletterSection } from "@/components/landing/NewsletterSection";

export function LandingPage() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-gradient-to-br from-lime-100 via-white to-cyan-100">
      {/* Hero */}
      <HeroSection />

      {/* Key Features */}
      <KeyFeatures />

      {/* Popular Topics */}
      <PopularTopics />

      {/* Contests */}
      <ContestsPreview />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Newsletter Signup */}
      <NewsletterSection />
    </main>
  );
}

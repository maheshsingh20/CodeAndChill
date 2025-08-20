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
    <main className="flex flex-col w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-cyan-200">
      {/* Hero Section */}
      <section className="w-full py-16 bg-gradient-to-b from-gray-900 via-gray-900/90 to-gray-950">
        <HeroSection />
      </section>

      {/* Key Features */}
      <section className="w-full py-16 px-4 md:px-12">
        <KeyFeatures />
      </section>

      {/* Popular Topics */}
      <section className="w-full py-16 px-4 md:px-12">
        <PopularTopics />
      </section>

      {/* Contests Preview */}
      <section className="w-full py-16 px-4 md:px-12">
        <ContestsPreview />
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-16 px-4 md:px-12 bg-gradient-to-b from-gray-900/80 to-gray-950/90">
        <TestimonialsSection />
      </section>

      {/* Newsletter Signup */}
      <section className="w-full py-16 px-4 md:px-12">
        <NewsletterSection />
      </section>
    </main>
  );
}

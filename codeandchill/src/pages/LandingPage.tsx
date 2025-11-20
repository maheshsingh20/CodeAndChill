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
    <main className="flex flex-col w-full min-h-screen bg-background text-foreground">
      {/* Professional Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(45,212,191,0.1),transparent_50%)]" />
      </div>

      {/* Hero Section */}
      <section className="section-hero section-professional">
        <HeroSection />
      </section>

      {/* Key Features */}
      <section className="section-professional bg-card/30">
        <div className="container mx-auto px-4 md:px-12">
          <KeyFeatures />
        </div>
      </section>

      {/* Popular Topics */}
      <section className="section-professional">
        <div className="container mx-auto px-4 md:px-12">
          <PopularTopics />
        </div>
      </section>

      {/* Contests Preview */}
      <section className="section-professional bg-muted/30">
        <div className="container mx-auto px-4 md:px-12">
          <ContestsPreview />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-professional gradient-secondary/5">
        <div className="container mx-auto px-4 md:px-12">
          <TestimonialsSection />
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="section-professional bg-card/50">
        <div className="container mx-auto px-4 md:px-12">
          <NewsletterSection />
        </div>
      </section>
    </main>
  );
}

import React, { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Handle newsletter subscription logic here
    console.log("Form submitted");
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-cyan-400 drop-shadow-neon">
            Join Our Learning Community
          </h2>
          <p className="text-cyan-300/80 md:text-lg">
            Get the latest course updates, free resources, and career tips
            delivered to your inbox.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-md mx-auto items-center gap-3 mt-6"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-gray-800 border border-cyan-400 text-cyan-200 placeholder:text-cyan-500 rounded-lg focus:ring-2 focus:ring-cyan-500"
              aria-label="Email"
              required
            />
            <Button
              type="submit"
              className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold rounded-lg shadow-neon-lg transition-all"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

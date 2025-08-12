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
    <section className="py-20 bg-gradient-to-br from-lime-100 via-gray-100 to-cyan-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-cyan-900">
            Join Our Learning Community
          </h2>
          <p className="text-cyan-800/90 md:text-lg">
            Get the latest course updates, free resources, and career tips
            delivered to your inbox.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-md mx-auto items-center gap-2 mt-4"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white border border-cyan-200 text-cyan-900 placeholder:text-cyan-400 rounded-lg"
              aria-label="Email"
              required
            />
            <Button
              type="submit"
              className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold rounded-lg"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

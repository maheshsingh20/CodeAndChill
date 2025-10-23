import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const calculateTimeLeft = () => {
  const contestDate = new Date("2025-08-20T20:00:00");
  const difference = +contestDate - +new Date();
  let timeLeft: Record<string, number> = {};
  if (difference > 0) {
    timeLeft = {
      Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      Mins: Math.floor((difference / 1000 / 60) % 60),
    };
  }
  return timeLeft;
};

export function ContestsPreview() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);
    return () => clearTimeout(timer);
  });

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-cyan-200">
      <div className="container mx-auto px-6">
        <Card className="p-8 md:p-12 rounded-2xl shadow-2xl bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border border-cyan-600">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            {/* Countdown */}
            <div className="space-y-6 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 drop-shadow-neon">
                Weekly Coding Contest
              </h2>
              <p className="text-cyan-300/90 text-lg">
                The next big challenge starts in:
              </p>
              <div className="flex gap-4 justify-center md:justify-start flex-wrap">
                {Object.keys(timeLeft).length > 0 ? (
                  Object.entries(timeLeft).map(([interval, value]) => (
                    <div
                      key={interval}
                      className="text-center p-4 bg-gray-900/60 backdrop-blur-sm rounded-xl shadow-neon w-24 border border-cyan-500 hover:scale-105 transition-transform duration-200"
                    >
                      <p className="text-3xl font-bold text-cyan-400">
                        {value}
                      </p>
                      <p className="text-sm uppercase text-cyan-300/80">
                        {interval}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-2xl font-bold text-cyan-400 drop-shadow-neon">
                    Contest is Live!
                  </p>
                )}
              </div>
            </div>

            {/* Call to Action */}
            <div className="space-y-6 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-semibold text-cyan-400 drop-shadow-neon">
                Ready to Test Your Skills?
              </h3>
              <p className="text-cyan-300/80 text-lg">
                Solve problems, compete with others, and get recognized for your
                talent. Sign up to get notified!
              </p>
              <Button
                size="lg"
                asChild
                className="w-full max-w-xs bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl shadow-neon transition-all duration-300"
              >
                <Link to="/auth">Sign Up & Compete</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

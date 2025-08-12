import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Link } from "react-router-dom";

const calculateTimeLeft = () => {
  const contestDate = new Date("2025-08-20T20:00:00");
  const difference = +contestDate - +new Date();
  let timeLeft = {};
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
    <section className="py-20 lg:py-28 bg-gradient-to-b from-lime-100 via-gray-100 to-cyan-100">
      <div className="container mx-auto px-6">
        <Card className="p-8 md:p-12 rounded-2xl shadow-xl bg-gradient-to-br from-cyan-100 via-lime-100 to-gray-100 border-2 border-cyan-200">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-cyan-900 drop-shadow">
                Weekly Coding Contest
              </h2>
              <p className="text-cyan-800/90">
                The next big challenge starts in:
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                {Object.keys(timeLeft).length > 0 ? (
                  Object.entries(timeLeft).map(([interval, value]) => (
                    <div
                      key={interval}
                      className="text-center p-4 bg-white/80 rounded-lg shadow-inner w-24 border border-cyan-200"
                    >
                      <p className="text-3xl font-bold text-cyan-700">{value}</p>
                      <p className="text-sm uppercase text-cyan-800/70">
                        {interval}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-2xl font-bold text-cyan-700">
                    Contest is Live!
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-6 text-center md:text-left">
              <h3 className="text-2xl font-semibold text-cyan-900">
                Ready to Test Your Skills?
              </h3>
              <p className="text-cyan-800/90">
                Solve problems, compete with others, and get recognized for your talent. Sign up to get notified!
              </p>
              <Button
                size="lg"
                asChild
                className="w-full max-w-xs bg-cyan-700 hover:bg-cyan-800 text-white font-semibold rounded-xl shadow"
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

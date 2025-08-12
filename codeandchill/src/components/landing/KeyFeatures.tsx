import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Code, Bot, Briefcase, Trophy, Edit, Award } from "lucide-react";

export function KeyFeatures() {
  const features = [
    {
      icon: <Code className="h-8 w-8 text-lime-700" />,
      title: "Hands-on Coding",
      description: "Practice DSA, Web Dev, and AI/ML in a real environment.",
      bg: "bg-lime-100",
    },
    {
      icon: <Bot className="h-8 w-8 text-cyan-700" />,
      title: "AI Learning Assistant",
      description: "Get code explanations, hints, and debugging help 24/7.",
      bg: "bg-cyan-100",
    },
    {
      icon: <Briefcase className="h-8 w-8 text-lime-700" />,
      title: "Placement-Focused",
      description: "Prepare with mock interviews, aptitude tests, and resume help.",
      bg: "bg-lime-100",
    },
    {
      icon: <Trophy className="h-8 w-8 text-cyan-700" />,
      title: "Live Contests",
      description: "Compete, climb the leaderboards, and win exciting prizes.",
      bg: "bg-cyan-100",
    },
    {
      icon: <Edit className="h-8 w-8 text-lime-700" />,
      title: "Interactive Problem-Solving",
      description: "Solve problems directly in our built-in code editor.",
      bg: "bg-lime-100",
    },
    {
      icon: <Award className="h-8 w-8 text-cyan-700" />,
      title: "Verified Certificates",
      description: "Earn certificates to showcase your skills on LinkedIn.",
      bg: "bg-cyan-100",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-lime-100 via-gray-100 to-cyan-100">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-cyan-900 drop-shadow">
            Why Choose Code & Chill?
          </h2>
          <p className="max-w-2xl mx-auto text-cyan-800/80 md:text-xl">
            Everything you need to succeed, all in one platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className={`p-6 rounded-2xl border-2 border-cyan-200 shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 flex flex-col items-center text-center bg-gradient-to-br from-white to-gray-50`}
            >
              <div className={`p-4 rounded-full mb-4 ${feature.bg}`}>
                {feature.icon}
              </div>
              <CardHeader className="p-0">
                <CardTitle className="text-cyan-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardDescription className="mt-2 flex-grow text-cyan-800/90">
                {feature.description}
              </CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { PathCard } from "@/components/LearningPath/PathCard.tsx";
import { Code, Bot, Server, Cpu } from "lucide-react";

const paths = [
  {
    id: "full-stack",
    icon: <Code size={32} />,
    title: "Full-Stack Development",
    description:
      "Master the MERN stack and build complete web applications from scratch.",
    courseCount: 12,
  },
  {
    id: "ai-ml",
    icon: <Bot size={32} />,
    title: "Data Science & AI",
    description:
      "Dive into machine learning, data analysis, and neural networks.",
    courseCount: 15,
  },
  {
    id: "cp",
    icon: <Cpu size={32} />,
    title: "Competitive Programming",
    description:
      "Hone your DSA skills and excel in top-tier coding competitions.",
    courseCount: 8,
  },
  {
    id: "devops",
    icon: <Server size={32} />,
    title: "Cloud Computing & DevOps",
    description:
      "Learn to build, deploy, and scale modern applications on the cloud.",
    courseCount: 10,
  },
];

export function LearningPathsPage() {
  return (
    <div className="w-full min-h-screen bg-[#0a0a1a] text-white">
      <style>
        {`
          .text-gradient {
            background: linear-gradient(90deg, #ff0044, #bb00ff, #ff00ff, #00ff99);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .bg-card-dark {
            background-color: rgba(30, 30, 50, 0.85);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 0, 255, 0.3);
            transition: 0.3s;
          }
          .bg-card-dark:hover {
            border-color: rgba(255, 0, 255, 0.6);
          }
        `}
      </style>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gradient">
            Learning Paths
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-pink-400/80">
            Follow our expert-curated roadmaps to master a skill from start to
            finish.
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {paths.map((path) => (
            <PathCard key={path.id} path={path} className="bg-card-dark" />
          ))}
        </main>
      </div>
    </div>
  );
}

import { Section } from "./Section";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Code, Bot, Server } from "lucide-react";

export function LearningPaths() {
  const paths = [
    {
      icon: <Code size={32} />,
      title: "Full-Stack Development",
      desc: "Master the MERN stack from scratch to deployment.",
    },
    {
      icon: <Bot size={32} />,
      title: "AI & Machine Learning",
      desc: "Dive into data science, neural networks, and more.",
    },
    {
      icon: <Server size={32} />,
      title: "Cloud & DevOps",
      desc: "Learn to build, deploy, and scale modern applications.",
    },
  ];

  return (
    <Section title="Learning Paths" viewAllLink="/paths">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {paths.map((path) => (
          <Card
            key={path.title}
            className="card hover-lift glass-card p-6 flex items-center gap-6 min-h-[140px]"
          >
            <div className="p-4 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              {path.icon}
            </div>
            <div className="flex flex-col">
              <CardTitle className="card-title text-lg font-bold">
                {path.title}
              </CardTitle>
              <CardDescription className="card-description mt-1">
                {path.desc}
              </CardDescription>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
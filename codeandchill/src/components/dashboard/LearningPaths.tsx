import { Section } from "./Section";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Code, Bot, Server } from "lucide-react";

export function LearningPaths() {
  const paths = [
    {
      icon: <Code size={32} />,
      title: "Full-Stack Development",
      desc: "Master the MERN stack from scratch to deployment.",
      gradient: "from-lime-200 via-gray-200 to-cyan-100",
      iconBg: "bg-lime-400 text-lime-900",
      border: "border-lime-300",
      text: "text-lime-900",
    },
    {
      icon: <Bot size={32} />,
      title: "AI & Machine Learning",
      desc: "Dive into data science, neural networks, and more.",
      gradient: "from-gray-200 via-cyan-100 to-lime-200",
      iconBg: "bg-cyan-200 text-cyan-900",
      border: "border-cyan-200",
      text: "text-cyan-900",
    },
    {
      icon: <Server size={32} />,
      title: "Cloud & DevOps",
      desc: "Learn to build, deploy, and scale modern applications.",
      gradient: "from-cyan-100 via-lime-200 to-gray-200",
      iconBg: "bg-gray-200 text-gray-900",
      border: "border-gray-300",
      text: "text-gray-900",
    },
  ];

  return (
    <Section title="Learning Paths" viewAllLink="/paths">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {paths.map((path) => (
          <Card
            key={path.title}
            className={`
              rounded-2xl shadow-lg border-2 ${path.border}
              bg-gradient-to-br ${path.gradient}
              hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 ease-in-out
              p-8 flex items-center gap-6 min-h-[140px]
            `}
          >
            <div className={`p-4 rounded-xl shadow ${path.iconBg}`}>{path.icon}</div>
            <div>
              <CardTitle className={`text-lg font-bold ${path.text} drop-shadow`}>{path.title}</CardTitle>
              <CardDescription className={`mt-1 ${path.text}/90`}>{path.desc}</CardDescription>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
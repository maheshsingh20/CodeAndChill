import { Section } from "./Section";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Code, Bot, Server } from "lucide-react";

export function LearningPaths() {
  const paths = [
    {
      icon: <Code size={32} className="text-cyan-400" />,
      title: "Full-Stack Development",
      desc: "Master the MERN stack from scratch to deployment.",
      gradient: "from-gray-900/80 via-gray-800/70 to-gray-900/90",
      iconBg: "bg-gray-800/60 text-cyan-400",
      border: "border-gray-700",
      textGradient:
        "bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-500",
    },
    {
      icon: <Bot size={32} className="text-purple-400" />,
      title: "AI & Machine Learning",
      desc: "Dive into data science, neural networks, and more.",
      gradient: "from-gray-900/80 via-gray-800/70 to-gray-900/90",
      iconBg: "bg-gray-800/60 text-purple-400",
      border: "border-gray-700",
      textGradient:
        "bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500",
    },
    {
      icon: <Server size={32} className="text-green-400" />,
      title: "Cloud & DevOps",
      desc: "Learn to build, deploy, and scale modern applications.",
      gradient: "from-gray-900/80 via-gray-800/70 to-gray-900/90",
      iconBg: "bg-gray-800/60 text-green-400",
      border: "border-gray-700",
      textGradient:
        "bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-green-400 to-green-500",
    },
  ];

  return (
    <Section title="Learning Paths" viewAllLink="/paths">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {paths.map((path) => (
          <Card
            key={path.title}
            className={`
              rounded-2xl shadow-xl ${path.border}
              bg-gradient-to-br ${path.gradient}
              hover:shadow-neon hover:scale-[1.03] transition-all duration-300 ease-in-out
              p-6 flex items-center gap-6 min-h-[140px]
            `}
          >
            <div
              className={`p-4 rounded-xl shadow-md ${path.iconBg} flex items-center justify-center`}
            >
              {path.icon}
            </div>
            <div className="flex flex-col">
              <CardTitle
                className={`text-lg font-bold ${path.textGradient} drop-shadow-md`}
              >
                {path.title}
              </CardTitle>
              <CardDescription className={`${path.textGradient}/80 mt-1`}>
                {path.desc}
              </CardDescription>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

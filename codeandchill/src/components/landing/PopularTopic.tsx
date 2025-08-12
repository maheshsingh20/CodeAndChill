// src/components/landing/PopularTopics.tsx
import { BookOpen, Terminal, Brain, Globe } from "lucide-react";

export function PopularTopics() {
  const topics = [
    {
      title: "Web Development",
      description: "Master HTML, CSS, JavaScript, and modern frameworks.",
      icon: Globe,
      color: "from-blue-100 to-blue-200",
    },
    {
      title: "Data Structures & Algorithms",
      description: "Sharpen your problem-solving skills for coding interviews.",
      icon: Brain,
      color: "from-amber-100 to-amber-200",
    },
    {
      title: "Backend Development",
      description: "Learn server-side programming with Node.js, databases, and APIs.",
      icon: Terminal,
      color: "from-green-100 to-green-200",
    },
    {
      title: "Machine Learning",
      description: "Dive into AI, neural networks, and real-world ML applications.",
      icon: BookOpen,
      color: "from-purple-100 to-purple-200",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-lime-100 via-gray-50 to-cyan-100">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center text-cyan-900 mb-12">
      Popular Topics
    </h2>
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {topics.map((topic) => {
        const Icon = topic.icon;
        return (
          <div
            key={topic.title}
            className={`p-6 rounded-xl bg-gradient-to-br ${topic.color} shadow-md hover:shadow-lg transition-shadow duration-200`}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm mb-4">
              <Icon className="h-6 w-6 text-cyan-700" />
            </div>
            <h3 className="text-lg font-semibold text-cyan-900 mb-2">
              {topic.title}
            </h3>
            <p className="text-sm text-cyan-800">{topic.description}</p>
          </div>
        );
      })}
    </div>
  </div>
</section>

  );
}

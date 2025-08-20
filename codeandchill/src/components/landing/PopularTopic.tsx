import { BookOpen, Terminal, Brain, Globe } from "lucide-react";

export function PopularTopics() {
  const topics = [
    {
      title: "Web Development",
      description: "Master HTML, CSS, JavaScript, and modern frameworks.",
      icon: Globe,
      color: "from-blue-700 via-blue-800 to-blue-900",
    },
    {
      title: "Data Structures & Algorithms",
      description: "Sharpen your problem-solving skills for coding interviews.",
      icon: Brain,
      color: "from-amber-700 via-amber-800 to-amber-900",
    },
    {
      title: "Backend Development",
      description:
        "Learn server-side programming with Node.js, databases, and APIs.",
      icon: Terminal,
      color: "from-green-700 via-green-800 to-green-900",
    },
    {
      title: "Machine Learning",
      description:
        "Dive into AI, neural networks, and real-world ML applications.",
      icon: BookOpen,
      color: "from-purple-700 via-purple-800 to-purple-900",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-cyan-400 drop-shadow-neon mb-12">
          Popular Topics
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((topic) => {
            const Icon = topic.icon;
            return (
              <div
                key={topic.title}
                className={`
                  p-6 rounded-2xl bg-gradient-to-br ${topic.color} 
                  shadow-lg hover:shadow-xl transform hover:scale-[1.03] 
                  transition-all duration-300 flex flex-col items-center text-center
                `}
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-black/20 backdrop-blur-md mb-4 shadow-inner">
                  <Icon className="h-7 w-7 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2 drop-shadow">
                  {topic.title}
                </h3>
                <p className="text-sm text-cyan-300/80">{topic.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

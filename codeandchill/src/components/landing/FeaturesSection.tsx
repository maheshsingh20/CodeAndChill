import {
  Award,
  Bot,
  Code,
  MonitorSmartphone,
  PlayCircle,
  FileQuestion,
} from "lucide-react";

const features = [
  {
    icon: (
      <PlayCircle className="w-8 h-8 text-cyan-400 bg-gray-900/20 rounded-xl p-1 drop-shadow-neon" />
    ),
    title: "Video & PDF Learning",
    description: "Learn from high-quality videos and supplemental documents.",
    bg: "bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800",
  },
  {
    icon: (
      <Code className="w-8 h-8 text-lime-400 bg-gray-900/20 rounded-xl p-1 drop-shadow-neon" />
    ),
    title: "Coding Playground",
    description:
      "Practice your skills in a live, interactive coding environment.",
    bg: "bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800",
  },
  {
    icon: (
      <Bot className="w-8 h-8 text-cyan-400 bg-gray-900/20 rounded-xl p-1 drop-shadow-neon" />
    ),
    title: "AI Learning Assistant",
    description: "Get instant help and feedback from our AI-powered tutor.",
    bg: "bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800",
  },
  {
    icon: (
      <FileQuestion className="w-8 h-8 text-lime-400 bg-gray-900/20 rounded-xl p-1 drop-shadow-neon" />
    ),
    title: "Quizzes & Assessments",
    description:
      "Test your knowledge and track your progress with our quizzes.",
    bg: "bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800",
  },
  {
    icon: (
      <Award className="w-8 h-8 text-cyan-400 bg-gray-900/20 rounded-xl p-1 drop-shadow-neon" />
    ),
    title: "Earn Certificates",
    description:
      "Receive a certificate upon course completion to boost your resume.",
    bg: "bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800",
  },
  {
    icon: (
      <MonitorSmartphone className="w-8 h-8 text-lime-400 bg-gray-900/20 rounded-xl p-1 drop-shadow-neon" />
    ),
    title: "Mobile & Desktop Access",
    description: "Learn on the go, anytime, from any of your devices.",
    bg: "bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-cyan-400 drop-shadow-neon">
            Everything You Need to Succeed
          </h2>
          <p className="max-w-2xl mx-auto text-cyan-300/80 md:text-xl">
            Our platform is packed with features designed to provide the best
            learning experience.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`
                p-7 rounded-2xl shadow-neon border border-cyan-400
                ${feature.bg}
                hover:shadow-neon-lg hover:scale-[1.03] transition-all duration-300
                flex flex-col items-start
              `}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-cyan-400 drop-shadow-neon">
                {feature.title}
              </h3>
              <p className="text-cyan-300/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

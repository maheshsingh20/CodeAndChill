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
    icon: <PlayCircle className="w-8 h-8 text-cyan-700 bg-cyan-100 rounded-xl p-1" />,
    title: "Video & PDF Learning",
    description: "Learn from high-quality videos and supplemental documents.",
    bg: "bg-gradient-to-br from-cyan-100 via-lime-100 to-gray-100",
  },
  {
    icon: <Code className="w-8 h-8 text-lime-700 bg-lime-100 rounded-xl p-1" />,
    title: "Coding Playground",
    description: "Practice your skills in a live, interactive coding environment.",
    bg: "bg-gradient-to-br from-lime-100 via-gray-100 to-cyan-100",
  },
  {
    icon: <Bot className="w-8 h-8 text-cyan-700 bg-cyan-100 rounded-xl p-1" />,
    title: "AI Learning Assistant",
    description: "Get instant help and feedback from our AI-powered tutor.",
    bg: "bg-gradient-to-br from-cyan-100 via-gray-100 to-lime-100",
  },
  {
    icon: <FileQuestion className="w-8 h-8 text-lime-700 bg-lime-100 rounded-xl p-1" />,
    title: "Quizzes & Assessments",
    description: "Test your knowledge and track your progress with our quizzes.",
    bg: "bg-gradient-to-br from-lime-100 via-cyan-100 to-gray-100",
  },
  {
    icon: <Award className="w-8 h-8 text-cyan-700 bg-cyan-100 rounded-xl p-1" />,
    title: "Earn Certificates",
    description: "Receive a certificate upon course completion to boost your resume.",
    bg: "bg-gradient-to-br from-cyan-100 via-lime-100 to-gray-100",
  },
  {
    icon: <MonitorSmartphone className="w-8 h-8 text-lime-700 bg-lime-100 rounded-xl p-1" />,
    title: "Mobile & Desktop Access",
    description: "Learn on the go, anytime, from any of your devices.",
    bg: "bg-gradient-to-br from-lime-100 via-gray-100 to-cyan-100",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-lime-100 via-gray-100 to-cyan-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-cyan-900 drop-shadow">
            Everything You Need to Succeed
          </h2>
          <p className="max-w-2xl mx-auto text-cyan-800/80 md:text-xl/relaxed">
            Our platform is packed with features designed to provide the best
            learning experience.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`
                p-7 rounded-2xl shadow-lg border-2 border-cyan-200
                ${feature.bg}
                hover:shadow-xl hover:scale-[1.03] transition-all duration-300
                flex flex-col items-start
              `}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-cyan-900">{feature.title}</h3>
              <p className="text-cyan-800/90">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

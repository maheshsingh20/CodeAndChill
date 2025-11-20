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
    icon: <PlayCircle className="w-8 h-8" />,
    title: "Video & PDF Learning",
    description: "Learn from high-quality videos and supplemental documents.",
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: "Coding Playground",
    description:
      "Practice your skills in a live, interactive coding environment.",
  },
  {
    icon: <Bot className="w-8 h-8" />,
    title: "AI Learning Assistant",
    description: "Get instant help and feedback from our AI-powered tutor.",
  },
  {
    icon: <FileQuestion className="w-8 h-8" />,
    title: "Quizzes & Assessments",
    description:
      "Test your knowledge and track your progress with our quizzes.",
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Earn Certificates",
    description:
      "Receive a certificate upon course completion to boost your resume.",
  },
  {
    icon: <MonitorSmartphone className="w-8 h-8" />,
    title: "Mobile & Desktop Access",
    description: "Learn on the go, anytime, from any of your devices.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 gradient-bg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-foreground">
            Everything You Need to Succeed
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl">
            Our platform is packed with features designed to provide the best
            learning experience.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card glass-card p-7 hover-lift flex flex-col items-start"
            >
              <div className="mb-4 p-2 rounded-lg bg-primary/10 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
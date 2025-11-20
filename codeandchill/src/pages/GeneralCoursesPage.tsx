import { SubjectCard } from "@/components/engineering/SubjectCard";
import { Cpu, Database, Network, Server } from "lucide-react";

// Mock data for the engineering subjects
const subjects = [
  {
    id: "operating-systems",
    icon: <Server />,
    title: "Operating Systems",
    description:
      "Understand the core concepts of OS, from process management to memory allocation.",
  },
  {
    id: "dbms",
    icon: <Database />,
    title: "Database Management",
    description:
      "Learn about relational databases, SQL, and how data is stored and retrieved efficiently.",
  },
  {
    id: "computer-networks",
    icon: <Network />,
    title: "Computer Networks",
    description:
      "Explore the layers of the internet, protocols, and how devices communicate.",
  },
  {
    id: "dsa",
    icon: <Cpu />,
    title: "Data Structures & Algorithms",
    description:
      "The foundation of all software engineering. Master key data structures and algorithms.",
   },
   {
      id: "software-engineering",
      icon: <Cpu />,
      title: "Software Engineering",
      description:
         "Learn about software development methodologies, project management, and best practices.",
   },
   {
      id: "web-development",
      icon: <Cpu />,
      title: "Web Development",
      description:
         "Build responsive and accessible web applications using modern frameworks, HTML, CSS, and JavaScript/TypeScript.",
   }
];

export function GeneralCoursesPage() {
  return (
    <div className="relative w-full min-h-screen bg-background">
      {/* Shadcn Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 gradient-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,hsl(var(--accent)/0.1),transparent_50%)]" />
      </div>

      <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 section-padding">
        <header className="text-center mb-20">
          <h1 className="heading-primary mb-8">
            Core Engineering Subjects
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Master the foundational subjects of Computer Science with our comprehensive curriculum designed for B.Tech students.
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {subjects.map((subject) => (
            <div key={subject.id} className="hover-lift">
              <SubjectCard subject={subject} />
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

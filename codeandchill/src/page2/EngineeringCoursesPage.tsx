import React from "react";
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

export function EngineeringCoursesPage() {
  return (
    <div
      className="relative w-full min-h-screen 
                 bg-gradient-to-br from-cyan-50 via-white to-lime-50
                 overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 bg-[url('/pattern-bg.png')] bg-cover bg-center opacity-10 pointer-events-none"
      ></div>

      {/* Light top-down glow */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-transparent to-cyan-100 opacity-20 pointer-events-none"
      ></div>

      <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-cyan-900 drop-shadow-sm">
            Core Engineering Subjects
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-cyan-800/80">
            Deep dive into the foundational subjects of Computer Science.
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </main>
      </div>
    </div>
  );
}

import React from 'react';
import { Section } from "./Section";
import { CleanCourseCard } from "@/components/ui/CleanCourseCard";
import { Cpu, Database, Network, Server } from "lucide-react";

// Engineering subjects data (same as GeneralCoursesPage)
const engineeringSubjects = [
  {
    id: "operating-systems",
    icon: <Server className="w-6 h-6" />,
    title: "Operating Systems",
    description: "Understand the core concepts of OS, from process management to memory allocation.",
  },
  {
    id: "dbms",
    icon: <Database className="w-6 h-6" />,
    title: "Database Management",
    description: "Learn about relational databases, SQL, and how data is stored and retrieved efficiently.",
  },
  {
    id: "computer-networks",
    icon: <Network className="w-6 h-6" />,
    title: "Computer Networks",
    description: "Explore the layers of the internet, protocols, and how devices communicate.",
  },
  {
    id: "dsa",
    icon: <Cpu className="w-6 h-6" />,
    title: "Data Structures & Algorithms",
    description: "The foundation of all software engineering. Master key data structures and algorithms.",
  },
  {
    id: "software-engineering",
    icon: <Cpu className="w-6 h-6" />,
    title: "Software Engineering",
    description: "Learn about software development methodologies, project management, and best practices.",
  },
  {
    id: "web-development",
    icon: <Cpu className="w-6 h-6" />,
    title: "Web Development",
    description: "Build responsive and accessible web applications using modern frameworks, HTML, CSS, and JavaScript/TypeScript.",
  }
];

export function ContinueLearning() {
  // Show only first 3 courses for homepage
  const featuredCourses = engineeringSubjects.slice(0, 3);

  // Mock progress data - in real app, this would come from user's enrollment data
  const getProgressForCourse = (id: string) => {
    const progressMap: Record<string, number> = {
      'operating-systems': 65, // User is 65% through OS
      'dbms': 0, // Not started
      'computer-networks': 0, // Not started
    };
    return progressMap[id] || 0;
  };

  return (
    <Section title="Continue Learning" viewAllLink="/engineering-courses">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredCourses.map((course, index) => (
          <CleanCourseCard
            key={course.id}
            id={course.id}
            icon={course.icon}
            title={course.title}
            description={course.description}
            progress={getProgressForCourse(course.id)}
            className={`animate-in slide-in-from-bottom duration-500 delay-${index * 100}`}
          />
        ))}
      </div>
    </Section>
  );
}
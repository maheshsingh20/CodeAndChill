import React from "react";
import { useParams } from "react-router-dom";
import { CourseRoadmap } from "@/components/LearningPath/CourseRoadmap.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Code } from "lucide-react";

const pathsData = {
  "full-stack": {
    icon: <Code size={48} />,
    title: "Full-Stack Development Path",
    description:
      "This path will take you from the fundamentals of web development to mastering the MERN stack. By the end, you'll be able to build and deploy complex, real-world applications.",
    instructor: {
      name: "Jane Doe",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    tags: ["React", "Node.js", "MongoDB", "Express"],
    roadmap: [
      {
        level: "Beginner (Level 1)",
        courses: [
          {
            id: "html-css",
            title: "HTML, CSS, & JavaScript for Beginners",
          },
          { id: "react-basics", title: "React Fundamentals" },
        ],
      },
      {
        level: "Intermediate (Level 2)",
        courses: [
          {
            id: "nodejs-express",
            title: "Back-end Development with Node.js & Express",
          },
          { id: "mongodb", title: "MongoDB for Beginners" },
        ],
      },
      {
        level: "Advanced (Level 3)",
        courses: [
          { id: "advanced-react", title: "Advanced React Patterns" },
          { id: "mern-deployment", title: "Deploying MERN Applications" },
        ],
      },
    ],
  },
  // Add other paths here
};

export function PathDetailPage() {
  const { pathId } = useParams<{ pathId: string }>();
  const path = pathsData[pathId ?? "full-stack"];

  if (!path) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold text-xl">
        Learning Path not found.
      </div>
    );
  }

  return (
    <div
      className={`
        w-full min-h-screen
        bg-gradient-to-br from-lime-100 via-gray-100 to-cyan-100
        border-t-4 border-cyan-200
      `}
    >
      {/* Header */}
      <header className="py-16 bg-white/70 backdrop-blur-md shadow-lg border-b border-cyan-200">
        <div className="container mx-auto max-w-7xl px-6 flex flex-col md:flex-row md:items-center md:gap-10">
          <div
            className="p-4 bg-cyan-100 text-cyan-800 rounded-full w-fit mb-6 md:mb-0 shadow-md transition-transform duration-300 hover:scale-105"
            aria-hidden="true"
          >
            {path.icon}
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-cyan-900">
              {path.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-cyan-800/80">
              {path.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              {/* Instructor */}
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-cyan-300">
                  <AvatarImage
                    src={path.instructor.image}
                    alt={`Instructor ${path.instructor.name}`}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/fallback-avatar.png";
                    }}
                  />
                  <AvatarFallback>
                    {path.instructor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-cyan-900">
                  Curated by {path.instructor.name}
                </span>
              </div>
              {/* Tags */}
              {path.tags?.length > 0 && (
                <div
                  className="flex flex-wrap gap-3"
                  role="list"
                  aria-label="Technology tags"
                >
                  {path.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="uppercase text-sm bg-cyan-50 text-cyan-800 border border-cyan-200 hover:bg-cyan-100 transition"
                      role="listitem"
                      tabIndex={0}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main
        role="main"
        aria-label={`${path.title} roadmap`}
        className="container mx-auto max-w-7xl px-6 py-12"
      >
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 transition hover:shadow-xl">
          {path.roadmap?.length ? (
            <CourseRoadmap roadmap={path.roadmap} />
          ) : (
            <p className="text-center text-cyan-800/70">
              No roadmap available.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

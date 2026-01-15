import React from "react";
import { useParams } from "react-router-dom";
import { CourseRoadmap } from "@/components/learning-path/CourseRoadmap";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
          { id: "html-css", title: "HTML, CSS, & JavaScript for Beginners" },
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
};

export function PathDetailPage() {
  const { pathId } = useParams<{ pathId: string }>();
  const path = pathsData[pathId ?? "full-stack"];

  if (!path) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold text-xl">
        Learning Path not found.
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>
      <header className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-800 border-b border-gray-700">
        <div className="container mx-auto max-w-7xl px-6 flex flex-col md:flex-row md:items-center md:gap-10">
          <div
            className="p-4 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 text-purple-400 rounded-full w-fit mb-6 md:mb-0 shadow-md transition-transform duration-300 hover:scale-105"
            aria-hidden="true"
          >
            {path.icon}
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
              {path.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
              {path.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              {/* Instructor */}
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-gray-600">
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
                <span className="font-semibold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
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
                      className="uppercase text-sm bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-600 hover:border-gray-500 transition"
                      role="listitem"
                      tabIndex={0}
                    >
                      <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                        {tag}
                      </span>
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
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md shadow-lg p-8 transition hover:border-gray-600 hover:shadow-xl hover:shadow-black/60">
          {path.roadmap?.length ? (
            <CourseRoadmap roadmap={path.roadmap} />
          ) : (
            <p className="text-center bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
              No roadmap available.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

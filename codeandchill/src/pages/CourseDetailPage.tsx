import React, { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { Star, Clock, BarChart, PlayCircle, CheckCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const courseData = {
  title: "Advanced React Patterns",
  description:
    "Take your React skills to the next level. Learn advanced patterns like Higher-Order Components, Render Props, and Hooks in-depth. Build complex, scalable, and maintainable applications.",
  author: "Jane Doe",
  authorImage: "https://randomuser.me/api/portraits/women/68.jpg",
  rating: 4.9,
  reviews: 1250,
  duration: "12.5 hours",
  level: "Advanced",
  price: 49.99,
  modules: [
    {
      title: "Module 1: Introduction to Advanced Patterns",
      lessons: ["Why Patterns Matter", "Thinking in Components"],
    },
    {
      title: "Module 2: Higher-Order Components (HOCs)",
      lessons: ["Creating Your First HOC", "Real-World Examples"],
    },
    {
      title: "Module 3: Render Props",
      lessons: ["Understanding Render Props", "Practical Applications"],
    },
    {
      title: "Module 4: Deep Dive into Hooks",
      lessons: ["useMemo and useCallback", "Creating Custom Hooks"],
    },
  ],
};

export function CourseDetailPage() {
  const { courseId } = useParams();
  const [isEnrolled, setIsEnrolled] = useState(false);

  const handleEnroll = () => setIsEnrolled(true);

  return (
    <div className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 w-full min-h-screen text-white">
      {/* Header Section */}
      <header className="py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
            {courseData.title}
          </h1>
          <p className="mt-4 max-w-3xl text-xl text-[#ff66cc]/70">
            {courseData.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 ring-4 ring-[#ff66cc]/50 shadow-md">
                <AvatarImage
                  src={courseData.authorImage}
                  alt={courseData.author}
                />
                <AvatarFallback>
                  {courseData.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold text-lg text-[#ff66cc]">
                {courseData.author}
              </span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-yellow-400 text-lg">
              <Star className="h-6 w-6 fill-yellow-400" />
              <span>{courseData.rating.toFixed(1)}</span>
              <span className="text-yellow-300 text-base font-normal ml-2">
                ({courseData.reviews.toLocaleString()} reviews)
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Course Content */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl shadow-xl p-8 bg-[#1a1a2e]/80 backdrop-blur-md border border-[#333366]">
              <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-red-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow">
                Course Content
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {courseData.modules.map((module, index) => (
                  <AccordionItem key={module.title} value={`item-${index}`}>
                    <AccordionTrigger className="font-semibold text-lg text-[#ff66cc] hover:text-[#ff99ff]">
                      {module.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-3 pl-6 mt-3">
                        {module.lessons.map((lesson) => (
                          <li
                            key={lesson}
                            className="flex items-center gap-3 text-[#66ffff]/80 hover:text-[#00ffff] cursor-pointer transition-colors"
                          >
                            <PlayCircle className="h-5 w-5 text-[#00ffff]" />
                            {lesson}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky top-28">
            <Card className="rounded-2xl shadow-2xl overflow-hidden bg-[#1a1a2e]/80 backdrop-blur-md border border-[#333366]">
              <div className="p-10 text-center">
                <h2 className="text-6xl font-extrabold bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow">
                  ${courseData.price}
                </h2>
              </div>
              <CardContent className="p-8 space-y-8">
                {isEnrolled ? (
                  <Button
                    asChild
                    size="lg"
                    className="w-full font-bold bg-[#00ffff] hover:bg-[#33ffff] shadow-lg rounded-xl text-[#1a1a2e]"
                  >
                    <Link to={`/learn/${courseId}`}>Go to Course</Link>
                  </Button>
                ) : (
                  <Button
                    onClick={handleEnroll}
                    size="lg"
                    className="w-full font-bold bg-[#00ffff] hover:bg-[#33ffff] shadow-lg rounded-xl text-[#1a1a2e]"
                  >
                    Enroll Now
                  </Button>
                )}
                <div className="space-y-6 pt-8 border-t border-[#333366]">
                  <p className="flex items-center gap-4 text-[#66ffff]/80 font-medium text-lg">
                    <Clock className="h-7 w-7 text-[#00ffff]" />{" "}
                    {courseData.duration} of content
                  </p>
                  <p className="flex items-center gap-4 text-[#66ffff]/80 font-medium text-lg">
                    <BarChart className="h-7 w-7 text-[#00ffff]" />{" "}
                    {courseData.level} Level
                  </p>
                  <p className="flex items-center gap-4 text-[#66ffff]/80 font-medium text-lg">
                    <CheckCircle className="h-7 w-7 text-[#00ffff]" />{" "}
                    Certificate of Completion
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

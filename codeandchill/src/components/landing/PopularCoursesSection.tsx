import React from "react";
import { CourseCard } from "./CourseCard";

type Course = {
  imgSrc: string;
  title: string;
  description: string;
  learners: number;
  rating: number;
};

const popularCourses: Course[] = [
  {
    imgSrc:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
    title: "Advanced Python",
    description:
      "Master Python with data science and machine learning projects.",
    learners: 12045,
    rating: 4.8,
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop",
    title: "React for Beginners",
    description:
      "Build modern, fast, and scalable web applications with React.",
    learners: 25870,
    rating: 4.9,
  },
  {
    imgSrc:
      "https://images.unsplash.com/photo-1517694712202-1428bc383565?q=80&w=2070&auto=format&fit=crop",
    title: "Web Development Fundamentals",
    description:
      "The complete guide to HTML, CSS, and JavaScript from scratch.",
    learners: 31050,
    rating: 4.7,
  },
];

export function PopularCoursesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-6 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-cyan-400 drop-shadow-neon">
            Explore Our Popular Courses
          </h2>
          <p className="max-w-2xl mx-auto text-cyan-300/80 md:text-xl">
            Join thousands of learners on a journey to mastery.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularCourses.map((course) => (
            <CourseCard key={course.title} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
}

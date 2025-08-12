import React from 'react';
import { CoursePageHeader } from "@/components/courses/CoursePageHeader.tsx";
import { CourseCard } from "@/components/courses/CourseCard.tsx";

const allCourses = [
  { id: "advanced-react", title: "Advanced React Patterns", author: "Jane Doe", rating: 4.9, reviews: 1250, price: 49.99, image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop" },
  { id: "python-dsa", title: "Data Structures in Python", author: "John Smith", rating: 4.8, reviews: 2100, price: 39.99, image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop" },
  { id: "devops-bootcamp", title: "The Complete DevOps Bootcamp", author: "Emily White", rating: 4.9, reviews: 3500, price: 59.99, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" },
  { id: "system-design", title: "System Design Interview Masterclass", author: "Michael Brown", rating: 5.0, reviews: 4200, price: 79.99, image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1931&auto=format&fit=crop" },
  { id: "ai-ml-foundations", title: "AI & Machine Learning Foundations", author: "Sophia Lee", rating: 4.8, reviews: 1800, price: 69.99, image: "https://images.unsplash.com/photo-1599447462453-03b12652e528?q=80&w=2070&auto=format&fit=crop" },
  { id: "full-stack-mern", title: "Full-Stack MERN Development", author: "David Chen", rating: 4.7, reviews: 2800, price: 59.99, image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop" },
];

export function CoursesPage() {
  return (
    <div className="bg-gradient-to-b from-lime-100 via-gray-100 to-cyan-100 min-h-screen w-full text-cyan-900">
      <div className="container mx-auto max-w-7xl px-6 py-12 space-y-16">
        <CoursePageHeader />
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {allCourses.map(course => (
              <div
                key={course.id}
                className="bg-white/90 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

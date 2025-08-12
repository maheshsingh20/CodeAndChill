import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

type Course = {
  id: string;
  title: string;
  author: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
};

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="group block rounded-2xl shadow-xl border border-cyan-200 bg-gradient-to-br from-lime-50 via-white to-cyan-50 hover:shadow-2xl hover:scale-[1.03] transform transition-all duration-300 ease-in-out h-full"
    >
      <Card className="flex flex-col h-full rounded-2xl bg-transparent shadow-none">
        {/* Image */}
        <CardHeader className="p-0 rounded-t-2xl overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </CardHeader>

        {/* Content */}
        <CardContent className="p-6 flex flex-col flex-grow">
          <CardTitle className="text-lg font-bold mb-2 text-cyan-900 group-hover:text-cyan-700 transition-colors">
            {course.title}
          </CardTitle>
          <CardDescription className="text-sm text-cyan-800/70 mb-4">
            by {course.author}
          </CardDescription>

          {/* Rating */}
          <div className="mt-auto flex items-center gap-2 text-yellow-500 font-semibold">
            <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-500" />
            <span>{course.rating.toFixed(1)}</span>
            <span className="text-xs text-cyan-800/60 font-normal">
              ({course.reviews.toLocaleString()})
            </span>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-6 pt-0 border-t border-cyan-200 flex justify-between items-center">
          <div className="text-xl font-extrabold text-cyan-900">
            ${course.price.toFixed(2)}
          </div>
          <button
            type="button"
            className="px-4 py-1.5 rounded-lg bg-cyan-700 text-white font-semibold text-sm shadow-md hover:bg-cyan-800 transition-colors"
            aria-label={`Enroll in ${course.title}`}
          >
            Enroll
          </button>
        </CardFooter>
      </Card>
    </Link>
  );
}

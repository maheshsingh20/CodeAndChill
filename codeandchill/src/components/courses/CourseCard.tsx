import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      className="group block rounded-2xl shadow-lg border border-[#333366] bg-[#1a1a2e]/90 hover:shadow-xl hover:scale-[1.03] transform transition-all duration-300 ease-in-out h-full"
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
          <CardTitle className="text-lg font-bold mb-2 bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent transition-colors group-hover:from-pink-500 group-hover:to-purple-500">
            {course.title}
          </CardTitle>
          <CardDescription className="text-sm text-[#ff66cc]/80 mb-4">
            by {course.author}
          </CardDescription>

          {/* Rating */}
          <div className="mt-auto flex items-center gap-2 text-yellow-400 font-semibold">
            <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
            <span>{course.rating.toFixed(1)}</span>
            <span className="text-xs text-[#ff66cc]/60 font-normal">
              ({course.reviews.toLocaleString()})
            </span>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-6 pt-0 border-t border-[#333366] flex justify-between items-center bg-[#1a1a2e]/80">
          <div className="text-xl font-extrabold text-green-400">
            ${course.price.toFixed(2)}
          </div>
          <button
            type="button"
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold text-sm shadow-md hover:opacity-90 transition-all"
            aria-label={`Enroll in ${course.title}`}
          >
            Enroll
          </button>
        </CardFooter>
      </Card>
    </Link>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      className="group block hover-lift h-full"
    >
      <Card className="card glass-card flex flex-col h-full">
        {/* Image */}
        <CardHeader className="card-header p-0 rounded-t-lg overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </CardHeader>

        {/* Content */}
        <CardContent className="card-content p-6 flex flex-col flex-grow">
          <CardTitle className="card-title text-lg font-bold mb-2 group-hover:text-primary transition-colors">
            {course.title}
          </CardTitle>
          <CardDescription className="card-description text-sm mb-4">
            by {course.author}
          </CardDescription>

          {/* Rating */}
          <div className="mt-auto flex items-center gap-2 text-primary font-semibold">
            <Star className="h-5 w-5 fill-primary stroke-primary" />
            <span>{course.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground font-normal">
              ({course.reviews.toLocaleString()})
            </span>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="card-footer p-6 pt-0 border-t border-border flex justify-between items-center">
          <div className="text-xl font-extrabold text-primary">
            ${course.price.toFixed(2)}
          </div>
          <Button
            className="btn btn-default"
            aria-label={`Enroll in ${course.title}`}
          >
            Enroll
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
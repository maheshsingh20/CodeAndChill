import {
  EnhancedCard,
  EnhancedCardContent,
  EnhancedCardDescription,
  EnhancedCardFooter,
  EnhancedCardHeader,
  EnhancedCardTitle,
} from "@/components/ui/enhanced-card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Star, BookOpen } from "lucide-react";

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
      className="group block h-full"
    >
      <EnhancedCard
        variant="gradient"
        color="blue"
        hover={true}
        glow={true}
        animated={true}
        className="flex flex-col h-full"
      >
        {/* Image */}
        <EnhancedCardHeader
          icon={BookOpen}
          iconColor="blue"
          className="p-0 rounded-t-xl overflow-hidden"
        >
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </EnhancedCardHeader>

        {/* Content */}
        <EnhancedCardContent className="flex flex-col flex-grow">
          <EnhancedCardTitle
            gradient={true}
            color="blue"
            className="text-lg mb-2 group-hover:text-blue-300 transition-colors"
          >
            {course.title}
          </EnhancedCardTitle>
          <EnhancedCardDescription className="mb-4">
            by {course.author}
          </EnhancedCardDescription>

          {/* Rating */}
          <div className="mt-auto flex items-center gap-2 text-blue-400 font-semibold">
            <Star className="h-5 w-5 fill-blue-400 stroke-blue-400" />
            <span>{course.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-400 font-normal">
              ({course.reviews.toLocaleString()})
            </span>
          </div>
        </EnhancedCardContent>

        {/* Footer */}
        <EnhancedCardFooter className="border-t border-blue-500/20 flex justify-between items-center">
          <div className="text-xl font-extrabold text-blue-400">
            ${course.price.toFixed(2)}
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-500 text-white border-0"
            aria-label={`Enroll in ${course.title}`}
          >
            Enroll
          </Button>
        </EnhancedCardFooter>
      </EnhancedCard>
    </Link>
  );
}
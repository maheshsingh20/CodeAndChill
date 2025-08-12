import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

interface CourseCardProps {
  imgSrc: string;
  title: string;
  description: string;
  learners: number;
  rating: number;
}

export function CourseCard({
  imgSrc,
  title,
  description,
  learners,
  rating,
}: CourseCardProps) {
  return (
    <Card
      className="
        flex flex-col rounded-2xl shadow-lg border-2 border-cyan-200
        bg-gradient-to-br from-cyan-100 via-lime-100 to-gray-100
        hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 ease-in-out
      "
    >
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <img
            src={imgSrc}
            alt={title}
            className="w-full h-full object-cover rounded-t-2xl"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6 space-y-2">
        <CardTitle className="text-lg font-bold text-cyan-900 drop-shadow">
          {title}
        </CardTitle>
        <p className="text-cyan-800/90 text-sm">{description}</p>
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold text-cyan-900">{rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-cyan-800/80">
            {learners.toLocaleString()} learners
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button
          asChild
          className="
            w-full bg-cyan-700 hover:bg-cyan-800
            text-white font-semibold rounded-xl shadow
          "
        >
          <Link to={`/courses/${title.toLowerCase().replace(/\s+/g, "-")}`}>
            View Course
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

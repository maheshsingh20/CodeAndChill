import { Section } from "./Section";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlayCircle } from "lucide-react";

export function ContinueLearning() {
  const ongoingCourses = [
    {
      title: "Advanced React Patterns",
      author: "Jane Doe",
      progress: 75,
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
    },
    {
      title: "Data Structures in Python",
      author: "John Smith",
      progress: 40,
      image:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
    },
    {
      title: "The Complete DevOps Bootcamp",
      author: "Emily White",
      progress: 90,
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    },
  ];

  return (
    <Section title="Continue Learning" viewAllLink="/engineering-courses">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ongoingCourses.map((course) => (
          <Card
            key={course.title}
            className="card hover-lift glass-card flex flex-col group"
            role="article"
            aria-label={`Continue learning ${course.title} by ${course.author}, progress ${course.progress} percent`}
          >
            <CardHeader className="card-header p-0">
              <img
                src={course.image}
                alt={`Cover image for ${course.title}`}
                className="w-full h-44 object-cover rounded-t-lg"
                loading="lazy"
              />
            </CardHeader>

            <CardContent className="card-content p-6 flex flex-col flex-grow">
              <CardTitle className="card-title text-xl mb-1 font-bold transition-all duration-300 group-hover:text-primary">
                {course.title}
              </CardTitle>
              <CardDescription className="card-description mb-4 truncate">
                by {course.author}
              </CardDescription>
              <div className="flex items-center gap-3 mt-auto">
                <Progress
                  value={course.progress}
                  className="flex-1 h-2 rounded-full transition-all duration-300"
                />
                <span className="text-sm font-semibold text-foreground w-12 text-right tabular-nums">
                  {course.progress}%
                </span>
              </div>
            </CardContent>

            <CardFooter className="card-footer p-6 pt-0">
              <Button
                asChild
                className="btn btn-default w-full flex items-center justify-center gap-2"
                aria-label={`Continue learning ${course.title}`}
              >
                <Link to="#">
                  <PlayCircle className="h-5 w-5" />
                  Continue
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Section>
  );
}
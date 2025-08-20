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
      gradient: "from-gray-900/80 via-gray-800/70 to-gray-900/90",
      border: "border-gray-700",
      progressBar: "bg-cyan-500/60",
      titleGradient:
        "bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500",
      descGradient:
        "bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-cyan-200 to-cyan-400",
      button: "bg-cyan-700 hover:bg-cyan-800",
    },
    {
      title: "Data Structures in Python",
      author: "John Smith",
      progress: 40,
      image:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
      gradient: "from-gray-900/80 via-gray-800/70 to-gray-900/90",
      border: "border-gray-700",
      progressBar: "bg-blue-500/60",
      titleGradient:
        "bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500",
      descGradient:
        "bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-200 to-blue-400",
      button: "bg-blue-700 hover:bg-blue-800",
    },
    {
      title: "The Complete DevOps Bootcamp",
      author: "Emily White",
      progress: 90,
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      gradient: "from-gray-900/80 via-gray-800/70 to-gray-900/90",
      border: "border-gray-700",
      progressBar: "bg-lime-500/60",
      titleGradient:
        "bg-clip-text text-transparent bg-gradient-to-r from-lime-400 via-lime-300 to-lime-500",
      descGradient:
        "bg-clip-text text-transparent bg-gradient-to-r from-lime-300 via-lime-200 to-lime-400",
      button: "bg-lime-700 hover:bg-lime-800",
    },
  ];

  return (
    <Section title="Continue Learning" viewAllLink="/engineering-courses">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ongoingCourses.map((course) => (
          <Card
            key={course.title}
            className={`
              rounded-2xl shadow-xl ${course.border}
              bg-gradient-to-br ${course.gradient}
              hover:shadow-neon hover:scale-[1.03] transition-all duration-300 ease-in-out
              flex flex-col group
            `}
            role="article"
            aria-label={`Continue learning ${course.title} by ${course.author}, progress ${course.progress} percent`}
          >
            <CardHeader className="p-0">
              <img
                src={course.image}
                alt={`Cover image for ${course.title}`}
                className="w-full h-44 object-cover rounded-t-2xl"
                loading="lazy"
              />
            </CardHeader>

            <CardContent className="p-6 flex flex-col flex-grow">
              <CardTitle
                className={`text-xl mb-1 font-bold ${course.titleGradient} drop-shadow-md transition-all duration-300 group-hover:scale-105`}
              >
                {course.title}
              </CardTitle>
              <CardDescription
                className={`${course.descGradient} opacity-90 mb-4 truncate`}
              >
                by {course.author}
              </CardDescription>
              <div className="flex items-center gap-3 mt-auto">
                <Progress
                  value={course.progress}
                  className={`flex-1 h-2 rounded-full ${course.progressBar} transition-all duration-300`}
                />
                <span
                  className={`text-sm font-semibold text-gray-100 w-12 text-right tabular-nums`}
                >
                  {course.progress}%
                </span>
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
              <Button
                asChild
                className={`w-full ${course.button} text-white font-semibold rounded-xl shadow-neon flex items-center justify-center gap-2 transition-all duration-300`}
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

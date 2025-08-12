import { Section } from "./Section";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
      gradient: "from-cyan-200 via-cyan-300 to-cyan-400",
      border: "border-cyan-400",
      progressBar: "bg-cyan-300",
      text: "text-cyan-900",
      button: "bg-cyan-700 hover:bg-cyan-800",
    },
    {
      title: "Data Structures in Python",
      author: "John Smith",
      progress: 40,
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
      gradient: "from-sky-200 via-sky-300 to-sky-400",
      border: "border-sky-400",
      progressBar: "bg-sky-300",
      text: "text-sky-900",
      button: "bg-sky-700 hover:bg-sky-800",
    },
    {
      title: "The Complete DevOps Bootcamp",
      author: "Emily White",
      progress: 90,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      gradient: "from-lime-200 via-lime-300 to-lime-400",
      border: "border-lime-400",
      progressBar: "bg-lime-300",
      text: "text-lime-900",
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
              rounded-2xl shadow-xl border-2 ${course.border}
              bg-gradient-to-br ${course.gradient}
              hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 ease-in-out
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
              <CardTitle className={`text-xl mb-1 font-bold ${course.text} group-hover:text-black transition-colors`}>
                {course.title}
              </CardTitle>
              <CardDescription className={`${course.text} opacity-80 mb-4 truncate`}>
                by {course.author}
              </CardDescription>
              <div className="flex items-center gap-3 mt-auto">
                <Progress value={course.progress} className={`flex-1 h-2 rounded-full ${course.progressBar}`} />
                <span className={`text-sm font-semibold ${course.text} w-12 text-right tabular-nums`}>
                  {course.progress}%
                </span>
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
              <Button
                asChild
                className={`w-full ${course.button} text-white font-semibold rounded-xl shadow-md flex items-center justify-center gap-2`}
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

import { Section } from "./Section";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ContestsPreview() {
  const contests = [
    {
      name: "AlgoMaster Monthly Finals",
      date: "August 30, 2025",
      participants: "1,204 Registered",
      endsIn: "3 Days",
      level: "Intermediate",
      link: "/contests/algomaster-finals",
    },
    {
      name: "CodeSprint Challenge",
      date: "September 5, 2025",
      participants: "2,010 Registered",
      endsIn: "9 Days",
      level: "Beginner",
      link: "/contests/codesprint",
    },
    {
      name: "Hackathon Blitz",
      date: "September 15, 2025",
      participants: "3,500 Registered",
      endsIn: "19 Days",
      level: "Advanced",
      link: "/contests/hackathon-blitz",
    },
    {
      name: "Frontend Fiesta",
      date: "September 20, 2025",
      participants: "1,800 Registered",
      endsIn: "24 Days",
      level: "Beginner",
      link: "/contests/frontend-fiesta",
    },
    {
      name: "Data Science Derby",
      date: "October 2, 2025",
      participants: "2,300 Registered",
      endsIn: "36 Days",
      level: "Intermediate",
      link: "/contests/data-science-derby",
    },
    {
      name: "AI Arena",
      date: "October 10, 2025",
      participants: "4,100 Registered",
      endsIn: "44 Days",
      level: "Advanced",
      link: "/contests/ai-arena",
    },
  ];

  const levelVariants: Record<string, "default" | "secondary" | "outline"> = {
    Beginner: "secondary",
    Intermediate: "default",
    Advanced: "outline",
  };

  return (
    <Section title="Upcoming Contests" viewAllLink="/contests">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {contests.map((contest) => (
          <div
            key={contest.name}
            className="card glass-card hover-lift relative flex flex-col min-h-[320px] p-6"
          >
            <div className="flex items-center mb-4 gap-3 flex-wrap">
              <Badge className="badge badge-default">
                {contest.endsIn}
              </Badge>
              <Badge className={`badge badge-${levelVariants[contest.level]}`}>
                {contest.level}
              </Badge>
            </div>

            <h3 className="text-2xl font-bold mb-2 leading-tight text-foreground">
              {contest.name}
            </h3>

            <p className="mb-6 font-medium text-muted-foreground">
              {contest.date} &bull; {contest.participants}
            </p>

            <div className="mt-auto">
              <Button
                asChild
                className="btn btn-default w-full"
              >
                <Link
                  to={contest.link}
                  aria-label={`View details for ${contest.name}`}
                >
                  View Contest
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button
          asChild
          size="lg"
          className="btn btn-default"
        >
          <Link to="/contests">
            See All Contests
          </Link>
        </Button>
      </div>
    </Section>
  );
}
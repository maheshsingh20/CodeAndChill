import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

type Contest = {
  id: string;
  name: string;
  status: "Open" | "Ended";
  endsIn: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  type: string;
};

interface ContestCardProps {
  contest: Contest;
}

const calculateTimeLeft = (endDate: string) => {
  const difference = +new Date(endDate) - +new Date();
  if (difference <= 0) return "Live Now!";
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  return `Starts in ${days}d`;
};

export function ContestCard({ contest }: ContestCardProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(contest.endsIn));

  useEffect(() => {
    if (contest.status !== "Ended") {
      const timer = setInterval(
        () => setTimeLeft(calculateTimeLeft(contest.endsIn)),
        60000
      );
      return () => clearInterval(timer);
    }
  }, [contest.endsIn, contest.status]);

  const levelVariants: Record<Contest["level"], "default" | "secondary" | "outline"> = {
    Beginner: "secondary",
    Intermediate: "default",
    Advanced: "outline",
  };

  return (
    <Card
      className={`card glass-card flex flex-col hover-lift ${
        contest.status === "Ended" ? "opacity-60" : ""
      }`}
    >
      <CardHeader className="card-header p-6">
        <div className="flex justify-between items-start">
          <Badge className="badge badge-outline">
            {contest.type}
          </Badge>
          <Badge className={`badge badge-${levelVariants[contest.level]}`}>
            {contest.level}
          </Badge>
        </div>
        <CardTitle className="card-title mt-3 text-2xl font-extrabold">
          {contest.name}
        </CardTitle>
        <CardDescription className="card-description flex items-center gap-2 pt-3 text-sm">
          <Clock className="h-5 w-5" />
          <span>
            {contest.status === "Ended" ? "Contest has ended" : timeLeft}
          </span>
        </CardDescription>
      </CardHeader>
      <CardFooter className="card-footer p-6 mt-auto">
        <Button
          asChild
          className="btn btn-default w-full"
          disabled={contest.status === "Ended"}
          aria-disabled={contest.status === "Ended"}
        >
          <Link
            to={`/contest/${contest.id}`}
            className="flex items-center justify-center py-3"
          >
            {contest.status === "Ended" ? "View Archive" : "View Details"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
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

  const levelStyles: Record<Contest["level"], string> = {
    Beginner: "bg-lime-80 text-lime-400 border-lime-200",
    Intermediate: "bg-cyan-100 text-cyan-700 border-cyan-200",
    Advanced: "bg-purple-100 text-purple-700 border-purple-200",
  };

  return (
    <Card
      className={`rounded-2xl shadow-xl bg-gradient-to-br from-cyan-100 via-lime-100 to-gray-100 flex flex-col transition-transform duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1.5 ${
        contest.status === "Ended" ? "opacity-60" : ""
      }`}
    >
      <CardHeader className="p-6">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="text-cyan-800 border-cyan-300">
            {contest.type}
          </Badge>
          <Badge
            className={`font-semibold border rounded-full px-3 py-1 text-sm ${levelStyles[contest.level]}`}
          >
            {contest.level}
          </Badge>
        </div>
        <CardTitle className="mt-3 text-2xl font-extrabold text-cyan-900 drop-shadow">
          {contest.name}
        </CardTitle>
        <CardDescription className="flex items-center gap-2 pt-3 text-cyan-800 text-sm">
          <Clock className="h-5 w-5" />
          <span>
            {contest.status === "Ended" ? "Contest has ended" : timeLeft}
          </span>
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-6 mt-auto">
        <Button
          asChild
          className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-semibold rounded-xl shadow"
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

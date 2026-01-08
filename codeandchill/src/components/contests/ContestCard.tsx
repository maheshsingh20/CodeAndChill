import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  EnhancedCard,
  EnhancedCardDescription,
  EnhancedCardFooter,
  EnhancedCardHeader,
  EnhancedCardTitle,
} from "@/components/ui/enhanced-card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Clock, Trophy } from "lucide-react";

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

  const levelColors = {
    Beginner: "green" as const,
    Intermediate: "orange" as const,
    Advanced: "red" as const,
  };

  const cardColor = levelColors[contest.level];

  return (
    <EnhancedCard
      variant="cyber"
      color={cardColor}
      hover={true}
      glow={contest.status !== "Ended"}
      animated={true}
      className={`flex flex-col ${contest.status === "Ended" ? "opacity-60" : ""
        }`}
    >
      <EnhancedCardHeader icon={Trophy} iconColor={cardColor}>
        <div className="flex justify-between items-start">
          <Badge className="bg-slate-700/50 text-slate-300 border-slate-600">
            {contest.type}
          </Badge>
          <Badge className={`bg-${cardColor}-500/20 text-${cardColor}-400 border-${cardColor}-500/30`}>
            {contest.level}
          </Badge>
        </div>
        <EnhancedCardTitle
          gradient={true}
          color={cardColor}
          className="mt-3 text-2xl font-extrabold"
        >
          {contest.name}
        </EnhancedCardTitle>
        <EnhancedCardDescription className="flex items-center gap-2 pt-3 text-sm">
          <Clock className="h-5 w-5" />
          <span>
            {contest.status === "Ended" ? "Contest has ended" : timeLeft}
          </span>
        </EnhancedCardDescription>
      </EnhancedCardHeader>

      <EnhancedCardFooter className="mt-auto">
        <Button
          asChild
          className={`w-full bg-${cardColor}-600 hover:bg-${cardColor}-500 text-white border-0`}
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
      </EnhancedCardFooter>
    </EnhancedCard>
  );
}
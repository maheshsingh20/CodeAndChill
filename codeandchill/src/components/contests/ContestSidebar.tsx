import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";

const calculateTimeLeft = (endDate: string) => {
  const difference = +new Date(endDate) - +new Date();
  if (difference <= 0) return { live: true, text: "Live Now!" };

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);

  return { live: false, text: `${days}d ${hours}h ${minutes}m left` };
};

interface ContestSidebarProps {
  contest: {
    endsIn: string;
    prizes: string[];
  };
}

export function ContestSidebar({ contest }: ContestSidebarProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(contest.endsIn));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft(contest.endsIn)), 60000);
    return () => clearInterval(timer);
  }, [contest.endsIn]);

  return (
    <Card
      className="
        rounded-2xl border border-cyan-200
        bg-gradient-to-br from-lime-50 via-white to-cyan-50
        shadow-sm
        flex flex-col
      "
    >
      <CardHeader className="text-center px-6 pt-8 pb-6">
        {timeLeft.live ? (
          <Badge variant="destructive" className="mx-auto mb-3 px-5 py-1 text-sm">
            Live
          </Badge>
        ) : (
          <Badge variant="secondary" className="mx-auto mb-3 px-5 py-1 text-sm">
            Upcoming
          </Badge>
        )}
        <CardTitle className="text-3xl font-extrabold text-cyan-900">
          {timeLeft.text}
        </CardTitle>
        <CardDescription className="mt-1 text-cyan-700 font-medium">
          {timeLeft.live ? "Contest is in progress" : "Until contest begins"}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pt-0 pb-6 space-y-6 flex-grow flex flex-col">
        <Button size="lg" className="w-full font-semibold bg-cyan-700 hover:bg-cyan-800">
          Register Now
        </Button>

        <div className="pt-4 border-t border-cyan-200">
          <h3 className="font-semibold text-cyan-900 mb-3 text-lg">Prizes</h3>
          <ul className="space-y-2 text-cyan-800 text-sm">
            {contest.prizes.map((prize, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <span>{prize}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

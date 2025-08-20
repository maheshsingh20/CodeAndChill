import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

type Story = {
  name: string;
  company: string;
  image: string;
  quote: string;
  skills: string[];
};

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <Card
      className={`
        rounded-2xl border border-gray-700
        bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800
        shadow-xl hover:shadow-cyan-500/20 hover:border-cyan-400
        hover:scale-[1.02] transition-all duration-300 ease-in-out
        flex flex-col
      `}
      role="article"
      aria-label={`Success story: ${story.name} placed at ${story.company}`}
    >
      {/* Header */}
      <CardHeader className="p-6 text-center">
        <Avatar className="h-20 w-20 mb-4 ring-2 ring-cyan-400/70 shadow-md mx-auto">
          <AvatarImage src={story.image} alt={story.name} />
          <AvatarFallback className="bg-cyan-700 text-white">
            {story.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <CardTitle className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          {story.name}
        </CardTitle>
        <CardDescription className="mt-1 text-gray-300 font-medium">
          Placed at{" "}
          <span className="text-emerald-300 font-semibold">
            {story.company}
          </span>
        </CardDescription>
      </CardHeader>

      {/* Quote */}
      <CardContent className="p-6 pt-0 flex-grow">
        <blockquote
          className="text-gray-200 italic border-l-2 border-cyan-400/60 pl-4
                     bg-gray-800/60 p-3 rounded-md shadow-inner"
        >
          “{story.quote}”
        </blockquote>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-6 pt-4 flex-col items-start gap-4">
        <div className="w-full">
          <h4 className="text-sm font-semibold text-cyan-300 mb-2">
            Skills Learned
          </h4>

          <div className="flex flex-wrap gap-2">
            {story.skills.map((skill) => (
              <Badge
                key={skill}
                className="bg-gray-800 border border-gray-600 text-gray-200 hover:border-cyan-400 hover:text-cyan-300 transition rounded-full px-3 py-1"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          asChild
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg"
        >
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${story.name}'s LinkedIn profile`}
            className="inline-flex items-center justify-center gap-2"
          >
            <Linkedin className="w-4 h-4" /> View LinkedIn
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

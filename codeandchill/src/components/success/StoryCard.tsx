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
        rounded-2xl border-2 border-cyan-200
        bg-gradient-to-br from-lime-100 via-gray-100 to-cyan-100
        shadow-xl hover:shadow-2xl hover:scale-[1.02]
        transition-all duration-300 ease-in-out
        flex flex-col
      `}
      role="article"
      aria-label={`Success story: ${story.name} placed at ${story.company}`}
    >
      <CardHeader className="p-6 text-center">
        <Avatar className="h-20 w-20 mb-4 ring-2 ring-cyan-200">
          <AvatarImage src={story.image} alt={story.name} />
          <AvatarFallback>{story.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <CardTitle className="text-xl font-bold text-cyan-900">
          {story.name}
        </CardTitle>
        <CardDescription className="mt-1 text-cyan-800 font-medium">
          Placed at <span className="text-cyan-700 font-semibold">{story.company}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 pt-0 flex-grow">
        <blockquote
          className="text-cyan-800/95 italic border-l-2 border-cyan-200 pl-4 ml-0
                     bg-white/40 dark:bg-black/10 p-3 rounded-md"
        >
          “{story.quote}”
        </blockquote>
      </CardContent>

      <CardFooter className="p-6 pt-4 flex-col items-start gap-4">
        <div className="w-full">
          <h4 className="text-sm font-semibold text-cyan-900 mb-2">Skills Learned</h4>

          <div className="flex flex-wrap gap-2">
            {story.skills.map((skill) => (
              <Badge
                key={skill}
                className="bg-lime-100 text-lime-900 border-lime-200 px-3 py-1 rounded-full"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          asChild
          className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-semibold rounded-xl shadow"
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

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

type Story = {
  name: string;
  company: string;
  image: string;
  quote: string;
  skills: string[];
  linkedinUrl?: string;
};

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <Card
      className="card glass-card hover-lift flex flex-col"
      role="article"
      aria-label={`Success story: ${story.name} placed at ${story.company}`}
    >
      <CardHeader className="card-header p-6 text-center">
        <Avatar className="h-20 w-20 mb-4 ring-2 ring-primary/70 shadow-md mx-auto">
          <AvatarImage src={story.image} alt={story.name} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {story.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <CardTitle className="card-title text-xl font-bold">
          {story.name}
        </CardTitle>
        <CardDescription className="card-description mt-1 font-medium">
          Placed at{" "}
          <span className="text-primary font-semibold">
            {story.company}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="card-content p-6 pt-0 flex-grow">
        <blockquote className="text-muted-foreground italic border-l-2 border-primary/60 pl-4 bg-muted/20 p-3 rounded-md">
          "{story.quote}"
        </blockquote>
      </CardContent>

      <CardFooter className="card-footer p-6 pt-4 flex-col items-start gap-4">
        <div className="w-full">
          <h4 className="text-sm font-semibold text-foreground mb-2">
            Skills Learned
          </h4>

          <div className="flex flex-wrap gap-2">
            {story.skills.map((skill) => (
              <Badge
                key={skill}
                className="badge badge-outline"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {story.linkedinUrl && (
          <Button
            asChild
            className="btn btn-default w-full"
          >
            <a
              href={story.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${story.name}'s LinkedIn profile`}
              className="inline-flex items-center justify-center gap-2"
            >
              <Linkedin className="w-4 h-4" /> View LinkedIn
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
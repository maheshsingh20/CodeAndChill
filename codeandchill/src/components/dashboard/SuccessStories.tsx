import { Section } from "./Section";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";

export function SuccessStories() {
  const stories = [
    {
      name: "Priya Sharma",
      company: "Google",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      quote: "The DSA course was a game-changer for my interviews.",
      gradient: "from-lime-200 via-gray-200 to-cyan-100",
    },
    {
      name: "Rohan Mehra",
      company: "Microsoft",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      quote: "The mock interviews gave me the confidence I needed.",
      gradient: "from-gray-200 via-cyan-100 to-lime-200",
    },
  ];

  return (
    <Section title="Success Stories" viewAllLink="/success">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stories.map((story) => (
          <Card
            key={story.name}
            className={`
              rounded-3xl border-2 border-cyan-200
              bg-gradient-to-br ${story.gradient}
              p-8 flex flex-col items-center
              shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-transform duration-300 ease-in-out
            `}
            role="article"
            aria-label={`Success story by ${story.name} placed at ${story.company}`}
          >
            <Avatar className="h-24 w-24 border-4 border-cyan-300 shadow-lg mb-6">
              <AvatarImage src={story.image} alt={story.name} />
              <AvatarFallback>{story.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <blockquote className="text-center text-lg font-semibold text-cyan-900 flex items-center justify-center gap-3 leading-snug mb-4">
              <Sparkles className="text-lime-500 h-6 w-6 flex-shrink-0" aria-hidden="true" />
              “{story.quote}”
            </blockquote>
            <p className="text-center text-sm text-cyan-800 font-medium">
              — <span className="text-cyan-900">{story.name}</span>,{" "}
              <span className="text-cyan-700 font-semibold">Placed at {story.company}</span>
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

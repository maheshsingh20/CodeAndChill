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
      gradient: "from-gray-950 via-gray-900 to-gray-950",
      textGradient: "text-cyan-300",
      nameColor: "text-white",
      companyColor: "text-cyan-400",
    },
    {
      name: "Rohan Mehra",
      company: "Microsoft",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      quote: "The mock interviews gave me the confidence I needed.",
      gradient: "from-gray-950 via-gray-900 to-gray-950",
      textGradient: "text-yellow-300",
      nameColor: "text-white",
      companyColor: "text-yellow-400",
    },
  ];

  return (
    <Section title="Success Stories" viewAllLink="/success">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stories.map((story) => (
          <Card
            key={story.name}
            className={`
              rounded-3xl border border-gray-800
              bg-gradient-to-br ${story.gradient}
              p-8 flex flex-col items-center
              shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out
            `}
            role="article"
            aria-label={`Success story by ${story.name} placed at ${story.company}`}
          >
            <Avatar className="h-24 w-24 border-2 border-cyan-500 shadow-lg mb-6">
              <AvatarImage src={story.image} alt={story.name} />
              <AvatarFallback>{story.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <blockquote
              className={`text-center text-lg font-semibold flex items-center justify-center gap-3 leading-snug mb-4 ${story.textGradient}`}
            >
              <Sparkles
                className="text-cyan-400 h-6 w-6 flex-shrink-0"
                aria-hidden="true"
              />
              “{story.quote}”
            </blockquote>

            <p className="text-center text-sm font-medium">
              —{" "}
              <span className={`${story.nameColor} font-semibold`}>
                {story.name}
              </span>
              ,{" "}
              <span className={`${story.companyColor} font-semibold`}>
                Placed at {story.company}
              </span>
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

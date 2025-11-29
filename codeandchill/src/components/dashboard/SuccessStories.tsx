import { Section } from "./Section";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/services/api";

interface Story {
  _id: string;
  name: string;
  company: string;
  image: string;
  quote: string;
}

export function SuccessStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await api.get<Story[]>('/stories');
        setStories(response.slice(0, 2));
      } catch (error) {
        console.error('Error fetching success stories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  if (loading) {
    return (
      <Section title="Success Stories" viewAllLink="/success-stories">
        <div className="text-center text-gray-400">Loading stories...</div>
      </Section>
    );
  }

  if (stories.length === 0) {
    return (
      <Section title="Success Stories" viewAllLink="/success-stories">
        <div className="text-center text-gray-400">
          No success stories yet. Be the first to share yours!
        </div>
      </Section>
    );
  }

  const gradients = [
    {
      gradient: "from-gray-950 via-gray-900 to-gray-950",
      textGradient: "text-cyan-300",
      companyColor: "text-cyan-400",
    },
    {
      gradient: "from-gray-950 via-gray-900 to-gray-950",
      textGradient: "text-yellow-300",
      companyColor: "text-yellow-400",
    },
  ];

  return (
    <Section title="Success Stories" viewAllLink="/success-stories">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stories.map((story, index) => {
          const style = gradients[index % gradients.length];
          return (
            <Card
              key={story._id}
              className={`
                rounded-3xl border border-gray-800
                bg-gradient-to-br ${style.gradient}
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
                className={`text-center text-lg font-semibold flex items-center justify-center gap-3 leading-snug mb-4 ${style.textGradient}`}
              >
                <Sparkles
                  className="text-cyan-400 h-6 w-6 flex-shrink-0"
                  aria-hidden="true"
                />
                "{story.quote}"
              </blockquote>

              <p className="text-center text-sm font-medium">
                —{" "}
                <span className="text-white font-semibold">{story.name}</span>,{" "}
                <span className={`${style.companyColor} font-semibold`}>
                  Placed at {story.company}
                </span>
              </p>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}

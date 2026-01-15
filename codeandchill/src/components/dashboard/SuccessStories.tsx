import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, ArrowRight, Trophy } from "lucide-react";
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
      <section className="space-y-8">
        <div className="text-center text-gray-400">Loading stories...</div>
      </section>
    );
  }

  if (stories.length === 0) {
    return (
      <section className="space-y-8">
        <div className="text-center text-gray-400">
          No success stories yet. Be the first to share yours!
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-3">
            <Trophy className="text-yellow-400" size={32} />
            Success Stories
          </h2>
          <p className="text-gray-400 mt-2">
            Get inspired by our community achievements
          </p>
        </div>
        <Link to="/success-stories">
          <div className="px-6 py-3 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md hover:border-gray-500 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-2">
              View All Stories
              <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.map((story) => (
          <div key={story._id} className="group h-full">
            <div className="h-full min-h-[280px] bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
              <div className="flex flex-col items-center h-full text-center">
                {/* Avatar */}
                <Avatar className="h-20 w-20 border-2 border-gray-600 group-hover:border-yellow-500 transition-all duration-300 mb-4">
                  <AvatarImage src={story.image} alt={story.name} />
                  <AvatarFallback className="bg-gray-800 text-gray-300 text-xl">{story.name.charAt(0)}</AvatarFallback>
                </Avatar>

                {/* Quote */}
                <div className="flex-grow flex items-center justify-center">
                  <blockquote className="text-center">
                    <div className="flex items-start gap-2 mb-3">
                      <Sparkles className="text-yellow-400 h-5 w-5 flex-shrink-0 mt-1" />
                      <p className="text-lg font-medium bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-yellow-100 group-hover:to-yellow-200 transition-all duration-300 leading-relaxed">
                        "{story.quote}"
                      </p>
                    </div>
                  </blockquote>
                </div>

                {/* Attribution */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm">
                    <span className="font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                      {story.name}
                    </span>
                  </p>
                  <p className="text-xs bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent mt-1">
                    Placed at <span className="text-yellow-400 font-medium">{story.company}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import { Section } from "./Section.jsx";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { communityService, CommunityPost } from "@/services/communityService";

export function CommunitySection() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await communityService.getLatestPosts(4);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching community posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <Section title="From the Community" viewAllLink="/community"><div className="text-center text-gray-400">Loading posts...</div></Section>;
  }

  return (
    <Section title="From the Community" viewAllLink="/forum">
      <Card
        className="
          rounded-xl border border-gray-800 
          bg-gradient-to-r from-gray-950 via-gray-900 to-black
          shadow-lg
          p-6 divide-y divide-gray-800
        "
        role="list"
      >
        {posts.map((post) => (
          <article
            key={post._id}
            className="
              group flex items-start gap-4 
              py-5 transition-all duration-300 
              cursor-pointer 
              hover:bg-gradient-to-r hover:from-purple-900/20 hover:to-pink-900/20
              rounded-lg px-3
              focus-within:ring-2 focus-within:ring-purple-500 focus-within:outline-none
            "
            tabIndex={0}
            role="listitem"
            aria-label={`${post.title} by ${post.user.name}, ${post.likes} likes, ${post.comments} comments`}
          >
            {/* Avatar */}
            <Avatar className="mt-1 border-2 border-purple-500/40 group-hover:border-pink-500/50 transition-all duration-300">
              <AvatarImage src={post.user.profilePicture} alt={`Avatar of ${post.user.name}`} />
              <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
            </Avatar>

            {/* Content */}
            <div className="flex-grow min-w-0">
              <p className="font-medium text-gray-200 leading-tight truncate group-hover:text-purple-400 transition-colors">
                {post.title}
              </p>
              <p className="text-sm text-gray-400 mt-1 truncate">
                by {post.user.name}
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-col items-end gap-3 text-sm text-gray-400 min-w-[56px]">
              <span
                className="flex items-center gap-1 group-hover:text-purple-400 transition-colors"
                aria-label={`${post.likes} likes`}
              >
                <ThumbsUp size={16} className="text-purple-400" />
                {post.likes}
              </span>
              <span
                className="flex items-center gap-1 group-hover:text-pink-400 transition-colors"
                aria-label={`${post.comments} comments`}
              >
                <MessageSquare size={16} className="text-pink-400" />
                {post.comments}
              </span>
            </div>
          </article>
        ))}
      </Card>
    </Section>
  );
}

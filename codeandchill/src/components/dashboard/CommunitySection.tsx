/* eslint-disable @typescript-eslint/no-unused-vars */
import { Section } from "./Section.jsx";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp } from "lucide-react";

export function CommunitySection() {
  const posts = [
    {
      user: "Sarah W.",
      userImg: "https://randomuser.me/api/portraits/women/68.jpg",
      title: "Can anyone explain this React hook behavior?",
      likes: 12,
      comments: 5,
    },
    {
      user: "Mike R.",
      userImg: "https://randomuser.me/api/portraits/men/32.jpg",
      title: "My solution for the 'Two Sum' problem in Python.",
      likes: 28,
      comments: 11,
    },
    {
      user: "Priya S.",
      userImg: "https://randomuser.me/api/portraits/women/65.jpg",
      title: "Tips for passing technical interviews?",
      likes: 19,
      comments: 7,
    },
    {
      user: "Alex T.",
      userImg: "https://randomuser.me/api/portraits/men/45.jpg",
      title: "Best resources for learning TypeScript?",
      likes: 15,
      comments: 4,
    },
  ];

  return (
    <Section title="From the Community" viewAllLink="/community">
      <Card
        className="
          rounded-xl border border-gray-800 
          bg-gradient-to-r from-gray-950 via-gray-900 to-black
          shadow-lg
          p-6 divide-y divide-gray-800
        "
        role="list"
      >
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        {posts.map((post, index) => (
          <article
            key={post.title}
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
            aria-label={`${post.title} by ${post.user}, ${post.likes} likes, ${post.comments} comments`}
          >
            {/* Avatar */}
            <Avatar className="mt-1 border-2 border-purple-500/40 group-hover:border-pink-500/50 transition-all duration-300">
              <AvatarImage src={post.userImg} alt={`Avatar of ${post.user}`} />
              <AvatarFallback>{post.user.charAt(0)}</AvatarFallback>
            </Avatar>

            {/* Content */}
            <div className="flex-grow min-w-0">
              <p className="font-medium text-gray-200 leading-tight truncate group-hover:text-purple-400 transition-colors">
                {post.title}
              </p>
              <p className="text-sm text-gray-400 mt-1 truncate">
                by {post.user}
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

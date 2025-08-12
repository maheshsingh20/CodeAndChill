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
          rounded-2xl shadow-xl border-2 border-cyan-200
          bg-gradient-to-br from-lime-200 via-gray-200 to-cyan-100
          p-6 space-y-4
          "
        role="list"
      >
        {posts.map((post) => (
          <article
            key={post.title}
            className="
              flex items-start gap-4
              hover:bg-cyan-50/80 p-4 -mx-6 rounded-xl transition-colors duration-300
              border-b last:border-b-0 border-cyan-100 cursor-pointer
              focus-within:ring-2 focus-within:ring-cyan-400 focus-within:outline-none
              sm:gap-6 sm:p-5 sm:-mx-5
            "
            tabIndex={0}
            role="listitem"
            aria-label={`${post.title} by ${post.user}, ${post.likes} likes, ${post.comments} comments`}
          >
            <Avatar className="mt-1 ring-2 ring-cyan-300 shrink-0 flex-none">
              <AvatarImage src={post.userImg} alt={`Avatar of ${post.user}`} />
              <AvatarFallback>{post.user.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow min-w-0">
              <p className="font-semibold text-base text-cyan-900 leading-tight truncate">
                {post.title}
              </p>
              <p className="text-xs text-gray-600 mt-1 truncate">by {post.user}</p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-end gap-3 text-xs text-cyan-800 min-w-[48px]">
              <span className="flex items-center gap-1" aria-label={`${post.likes} likes`}>
                <ThumbsUp size={16} className="text-cyan-600" />
                {post.likes}
              </span>
              <span className="flex items-center gap-1" aria-label={`${post.comments} comments`}>
                <MessageSquare size={16} className="text-cyan-600" />
                {post.comments}
              </span>
            </div>
          </article>
        ))}
      </Card>
    </Section>
  );
}

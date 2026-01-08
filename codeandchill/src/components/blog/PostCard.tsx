import React from "react";
import {
  EnhancedCard,
  EnhancedCardContent,
  EnhancedCardDescription,
  EnhancedCardFooter,
  EnhancedCardHeader,
  EnhancedCardTitle,
} from "@/components/ui/enhanced-card";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

type Post = {
  id: string;
  title: string;
  image: string;
  category: string;
  author: string;
  date: string;
};

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link to={`/blog/${post.id}`} className="block group">
      <EnhancedCard
        variant="aurora"
        color="purple"
        hover={true}
        glow={true}
        animated={true}
        className="flex flex-col h-full overflow-hidden"
      >
        {/* Image Section */}
        <EnhancedCardHeader className="p-0 relative">
          <div className="h-48 overflow-hidden relative">
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70 group-hover:opacity-50 transition-opacity pointer-events-none"></div>
          </div>
        </EnhancedCardHeader>

        {/* Content Section */}
        <EnhancedCardContent className="flex-grow">
          <Badge className="mb-3 px-3 py-1 text-xs font-semibold tracking-wide bg-purple-500/20 text-purple-300 border-purple-500/30">
            {post.category}
          </Badge>
          <EnhancedCardTitle
            gradient={true}
            color="purple"
            className="text-lg leading-tight group-hover:text-purple-300 transition-colors"
          >
            {post.title}
          </EnhancedCardTitle>
          <EnhancedCardDescription className="mt-2 text-sm line-clamp-2">
            Written by {post.author}
          </EnhancedCardDescription>
        </EnhancedCardContent>

        {/* Footer */}
        <EnhancedCardFooter className="text-xs text-purple-400 border-t border-purple-500/20">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>{post.author} • {post.date}</span>
          </div>
        </EnhancedCardFooter>
      </EnhancedCard>
    </Link>
  );
}
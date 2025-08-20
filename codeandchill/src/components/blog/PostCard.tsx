import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

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
      <Card className="rounded-2xl shadow-xl border-2 border-cyan-200 bg-gradient-to-br from-lime-50 via-gray-50 to-cyan-50 dark:from-gray-800 dark:via-gray-900 dark:to-cyan-900 dark:border-cyan-700 hover:shadow-2xl hover:-translate-y-1.5 transition-transform duration-300 ease-in-out flex flex-col h-full overflow-hidden">
        {/* Image Section */}
        <CardHeader className="p-0 relative">
          <div className="h-48 overflow-hidden relative">
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-70 group-hover:opacity-60 transition-opacity pointer-events-none"></div>
          </div>
        </CardHeader>

        {/* Content Section */}
        <CardContent className="p-5 flex-grow">
          <Badge
            variant="outline"
            className="mb-3 px-3 py-1 text-xs font-semibold tracking-wide border-cyan-300 text-cyan-900 dark:border-cyan-600 dark:text-cyan-200"
          >
            {post.category}
          </Badge>
          <CardTitle className="text-lg font-extrabold leading-tight text-cyan-900 dark:text-cyan-200 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
            {post.title}
          </CardTitle>
          <CardDescription className="mt-2 text-sm text-cyan-800/90 dark:text-cyan-300 line-clamp-2">
            Written by {post.author}
          </CardDescription>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-5 pt-0 text-xs text-cyan-700 dark:text-cyan-400 border-t border-cyan-200 dark:border-cyan-700">
          {post.author} • {post.date}
        </CardFooter>
      </Card>
    </Link>
  );
}
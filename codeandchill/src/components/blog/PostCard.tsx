import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Link to={`/blogdesc`} className="block group">
      <Card className="rounded-2xl shadow-xl border-2 border-cyan-200 bg-gradient-to-b from-lime-50 via-gray-50 to-cyan-50 hover:shadow-2xl hover:-translate-y-1.5 transition-transform duration-300 ease-in-out flex flex-col h-full overflow-hidden">
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
        <CardContent className="p-5 flex-grow">
          <Badge
            variant="secondary"
            className="mb-3 px-3 py-1 text-xs font-semibold tracking-wide bg-cyan-100 text-cyan-900 border border-cyan-300"
          >
            {post.category}
          </Badge>
          <CardTitle className="text-lg font-extrabold leading-tight group-hover:text-cyan-700 transition-colors text-cyan-900">
            {post.title}
          </CardTitle>
          <CardDescription className="mt-2 text-sm text-cyan-800/90 line-clamp-2">
            Written by {post.author}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-5 pt-0 text-xs text-cyan-700 border-t border-cyan-200">
          {post.author} • {post.date}
        </CardFooter>
      </Card>
    </Link>
  );
}

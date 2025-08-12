import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, MessageSquare } from "lucide-react";

type Comment = {
  id: number;
  author: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
  replies: Comment[];
};

const initialComments: Comment[] = [
  {
    id: 1,
    author: "Rohan Mehra",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    time: "2 hours ago",
    text: "This is a fantastic breakdown! The section on scalability was exactly what I needed for my upcoming interview.",
    likes: 12,
    replies: []
  },
  {
    id: 2,
    author: "Anjali Singh",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    time: "1 hour ago",
    text: "Great article. Could you elaborate a bit more on the trade-offs between vertical and horizontal scaling?",
    likes: 5,
    replies: [
      {
        id: 3,
        author: "John Smith",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        time: "30 minutes ago",
        text: "Good question! Horizontal scaling is generally better for web applications as it's more resilient, but can be more complex to manage.",
        likes: 8,
        replies: []
      }
    ]
  }
];

function Comment({ comment }: { comment: Comment }) {
  return (
    <div className="flex items-start gap-4">
      <Avatar className="ring-2 ring-lime-400">
        <AvatarImage src={comment.avatar} alt={comment.author} />
        <AvatarFallback className="text-cyan-900 font-bold">{comment.author.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-cyan-900">{comment.author}</p>
          <p className="text-xs text-cyan-700">{comment.time}</p>
        </div>
        <p className="text-cyan-900/90 mt-1">{comment.text}</p>
        <div className="flex items-center gap-4 mt-2 text-xs">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-cyan-400 text-cyan-700 hover:bg-cyan-100 hover:text-cyan-900 transition"
          >
            <ThumbsUp size={14} /> {comment.likes}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-cyan-400 text-cyan-700 hover:bg-cyan-100 hover:text-cyan-900 transition"
          >
            <MessageSquare size={14} /> Reply
          </Button>
        </div>

        {/* Replies */}
        <div className="mt-4 space-y-4 pl-6 border-l-2 border-lime-300">
          {comment.replies.map(reply => (
            <Comment key={reply.id} comment={reply} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CommentSection() {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  return (
    <section className="bg-gradient-to-br from-lime-100 via-gray-100 to-cyan-100 py-12 rounded-2xl shadow-xl border-2 border-cyan-200">
      <div className="container mx-auto max-w-4xl px-6 space-y-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-cyan-900">
          Discussion ({comments.length})
        </h2>
        <Card className="rounded-2xl shadow-lg border border-cyan-300 bg-white p-6">
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="ring-2 ring-lime-400">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="text-cyan-900 font-bold">YOU</AvatarFallback>
            </Avatar>
            <div className="w-full">
              <Textarea
                placeholder="Add to the discussion..."
                className="mb-3 border border-cyan-300 focus:border-cyan-500 focus:ring-cyan-300 text-cyan-900"
              />
              <Button className="bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl">
                Post Comment
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            {comments.map(comment => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

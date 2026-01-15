/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CommentSection } from "@/components/blog/CommentSection";
import { PostCard } from "@/components/blog/PostCard";

const postData = {
  id: "system-design-guide",
  title: "A Deep Dive into System Design Interviews",
  image:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
  category: "JavaScript",
  author: "John Smith",
  authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
  date: "August 11, 2025",
  readTime: "12 min read",
  content: [
    "System design interviews are a crucial part of the hiring process...",
    "### 1. The Core Principles: Scalability, Reliability, and Performance",
    "At the heart of any large-scale system are three core principles...",
    "### 2. A Framework for Success",
    "Walking into a system design interview without a plan is a recipe for disaster...",
    "### 3. Conclusion: It's About the Trade-offs",
    "Ultimately, there is no single 'correct' answer in a system design interview...",
  ],
  tags: ["System Design", "Interviews", "Scaling", "Architecture"],
};

const suggestedPosts = [
  {
    id: "react-mistakes",
    title: "10 Common Mistakes in React",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
    category: "JavaScript",
    author: "Jane Doe",
    date: "August 8, 2025",
  },
  {
    id: "async-js",
    title: "Understanding Asynchronous JavaScript",
    image:
      "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=2070&auto=format&fit=crop",
    category: "JavaScript",
    author: "Emily White",
    date: "August 5, 2025",
  },
];

export function BlogDetailPage() {
  const { postId } = useParams<{ postId: string }>();

  return (
    <div className="min-h-screen w-full bg-black py-12">
      <div className="container mx-auto max-w-4xl px-6 space-y-16">
        <article className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-md shadow-xl shadow-black/60 border border-gray-700 hover:border-gray-600 transition-all duration-300 p-10">
          {/* Post Header */}
          <header className="mb-8">
            <Badge
              variant="outline"
              className="mb-3 px-4 py-1 text-sm font-semibold tracking-wide bg-cyan-900/20 text-cyan-400 border border-cyan-500/40"
            >
              {postData.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 bg-clip-text text-transparent">
              {postData.title}
            </h1>
            <div className="mt-6 flex items-center gap-4">
              <Avatar className="ring-2 ring-cyan-400">
                <AvatarImage src={postData.authorImage} alt={postData.author} />
                <AvatarFallback className="text-cyan-400 font-bold">
                  {postData.author.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 bg-clip-text text-transparent">{postData.author}</p>
                <p className="text-sm bg-gradient-to-r from-cyan-300 via-cyan-200 to-cyan-300 bg-clip-text text-transparent">
                  {postData.date} • {postData.readTime}
                </p>
              </div>
            </div>
          </header>

          {/* Post Image */}
          <img
            src={postData.image}
            alt={postData.title}
            className="w-full rounded-2xl shadow-lg mb-10 border border-gray-700"
          />

          {/* Post Content */}
          <div className="prose prose-lg max-w-none">
            {postData.content.map((block, idx) =>
              block.startsWith("###") ? (
                <h3
                  key={idx}
                  className="font-extrabold mt-10 mb-5 bg-gradient-to-r from-cyan-300 via-cyan-200 to-cyan-300 bg-clip-text text-transparent"
                >
                  {block.replace("### ", "")}
                </h3>
              ) : (
                <p key={idx} className="leading-relaxed bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent">
                  {block}
                </p>
              )
            )}
          </div>

          {/* Tags */}
          <div className="mt-12 flex flex-wrap gap-3">
            {postData.tags.map((tag) => (
              <Badge
                key={tag}
                className="bg-cyan-900/20 text-cyan-300 border border-cyan-500 px-3 py-1 font-semibold"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </article>

        <hr className="my-16 border-cyan-700" />

        <CommentSection />

        <hr className="my-16 border-cyan-700" />

        <section>
          <h2 className="text-3xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 bg-clip-text text-transparent">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {suggestedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

import React from 'react';
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CommentSection } from "@/components/blog/CommentSection";
import { PostCard } from "@/components/blog/PostCard";

const postData = {
  id: "system-design-guide",
  title: "A Deep Dive into System Design Interviews",
  image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
  category: "Careers",
  author: "John Smith",
  authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
  date: "August 11, 2025",
  readTime: "12 min read",
  content: [
    "System design interviews are a crucial part of the hiring process for senior software engineers. Unlike algorithmic interviews that test your problem-solving skills on a micro level, system design questions evaluate your ability to think at scale. You're expected to design robust, scalable, and resilient systems that can handle millions of users. This can be daunting, but with a structured approach, you can confidently tackle any prompt.",
    "### 1. The Core Principles: Scalability, Reliability, and Performance",
    "At the heart of any large-scale system are three core principles. First, **Scalability**: how will your system handle growth? This involves understanding concepts like vertical vs. horizontal scaling, load balancing, and caching. Your goal is to design a system that can serve more users without a proportional decrease in performance.",
    "Second, **Reliability**: your system must be resilient to failures. No component is perfect; disks fail, networks lag, and servers crash. This means designing for redundancy, failover mechanisms, and graceful degradation. A reliable system might lose some non-critical functionality during an outage, but its core services remain available.",
    "Finally, **Performance**: latency is a critical metric for user experience. You need to consider how to minimize response times. This involves everything from using Content Delivery Networks (CDNs) for static assets, to implementing efficient database indexing, to optimizing network requests between microservices.",
    "### 2. A Framework for Success",
    "Walking into a system design interview without a plan is a recipe for disaster. Here’s a simple framework to guide your discussion:",
    "**- Step 1: Clarify Requirements:** Never assume. Ask your interviewer about the expected number of users, the read/write ratio, required features, and constraints. This scoping phase is critical.",
    "**- Step 2: High-Level Design:** Sketch out the main components and the relationships between them. Think about APIs, servers, databases, and caches.",
    "**- Step 3: Deep Dive:** Choose one component and design it in detail. This demonstrates your ability to go from a high-level view to a low-level implementation.",
    "**- Step 4: Identify Bottlenecks:** Discuss potential issues. Where might your system fail under heavy load? What are the single points of failure? This shows foresight.",
    "**- Step 5: Scale and Optimize:** Address the bottlenecks you identified. Introduce load balancers, database replicas, message queues, and other techniques to improve performance and reliability.",
    "### 3. Conclusion: It's About the Trade-offs",
    "Ultimately, there is no single 'correct' answer in a system design interview. The interviewer wants to see your thought process and your ability to articulate the trade-offs of your decisions (e.g., choosing a NoSQL vs. SQL database). By following a structured framework and clearly explaining your reasoning, you can demonstrate the architectural thinking that top companies are looking for. Good luck!"
  ],
  tags: ["System Design", "Interviews", "Scaling", "Architecture"],
};

const suggestedPosts = [
  { id: "react-mistakes", title: "10 Common Mistakes in React", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop", category: "JavaScript", author: "Jane Doe", date: "August 8, 2025" },
  { id: "async-js", title: "Understanding Asynchronous JavaScript", image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=2070&auto=format&fit=crop", category: "JavaScript", author: "Emily White", date: "August 5, 2025" },
];

export function BlogDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  // In a real app, you would fetch post data by postId here

  return (
    <div className="bg-gradient-to-br from-lime-100 via-gray-100 to-cyan-100 min-h-screen w-full py-12">
      <div className="container mx-auto max-w-4xl px-6 space-y-16">
        <article className="bg-white rounded-2xl shadow-xl border-2 border-cyan-200 p-10">
          {/* Post Header */}
          <header className="mb-8">
            <Badge
              variant="outline"
              className="mb-3 px-4 py-1 text-sm font-semibold tracking-wide bg-cyan-100 text-cyan-900 border border-cyan-300"
            >
              {postData.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-cyan-900">
              {postData.title}
            </h1>
            <div className="mt-6 flex items-center gap-4">
              <Avatar className="ring-2 ring-lime-400">
                <AvatarImage src={postData.authorImage} alt={postData.author} />
                <AvatarFallback className="text-cyan-900 font-bold">{postData.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-cyan-900">{postData.author}</p>
                <p className="text-sm text-cyan-700">
                  {postData.date} • {postData.readTime}
                </p>
              </div>
            </div>
          </header>

          {/* Post Image */}
          <img
            src={postData.image}
            alt={postData.title}
            className="w-full rounded-2xl shadow-lg mb-10"
          />

          {/* Post Content */}
          <div className="prose prose-lg max-w-none text-cyan-900">
            {postData.content.map((block, idx) =>
              block.startsWith("###") ? (
                <h3 key={idx} className="font-extrabold mt-10 mb-5 text-cyan-800">
                  {block.replace("### ", "")}
                </h3>
              ) : (
                <p key={idx} className="leading-relaxed opacity-90">
                  {block}
                </p>
              )
            )}
          </div>

          {/* Tags */}
          <div className="mt-12 flex flex-wrap gap-3">
            {postData.tags.map(tag => (
              <Badge
                key={tag}
                className="bg-lime-100 text-lime-700 border border-lime-300 px-3 py-1 font-semibold"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </article>

        <hr className="my-16 border-cyan-200" />

        <CommentSection />

        <hr className="my-16 border-cyan-200" />

        <section>
          <h2 className="text-3xl font-extrabold tracking-tight mb-8 text-cyan-900">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {suggestedPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

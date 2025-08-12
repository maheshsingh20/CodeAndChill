import React from 'react';
import { BlogHeader } from "@/components/blog/BlogHeader.tsx";
import { PostCard } from "@/components/blog/PostCard.tsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge.tsx";

const featuredPost = {
  id: "system-design-guide",
  title: "A Deep Dive into System Design Interviews",
  image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
  category: "Careers",
  excerpt: "Prepare for your next big interview with this step-by-step guide to tackling system design questions, from scaling databases to designing microservices.",
  author: "John Smith",
  date: "August 10, 2025",
};

const otherPosts = [
  { id: "react-mistakes", title: "10 Common Mistakes in React and How to Avoid Them", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop", category: "JavaScript", author: "Jane Doe", date: "August 8, 2025" },
  { id: "async-js", title: "Understanding Asynchronous JavaScript", image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=2070&auto=format&fit=crop", category: "JavaScript", author: "Emily White", date: "August 5, 2025" },
  { id: "devops-cicd", title: "A Beginner's Guide to CI/CD Pipelines", image: "https://images.unsplash.com/photo-1573495612057-b53b5a6b31c1?q=80&w=2070&auto=format&fit=crop", category: "DevOps", author: "Michael Brown", date: "August 2, 2025" },
];

export function BlogPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-lime-100 via-gray-100 to-cyan-100 py-12">
      <div className="container mx-auto max-w-7xl px-6 space-y-16">
        <BlogHeader />

        {/* Featured Post Section */}
        <section>
          <Link to={`/blog/${featuredPost.id}`} className="block group">
            <Card className="grid grid-cols-1 md:grid-cols-2 rounded-2xl border-2 border-cyan-200 shadow-xl bg-gradient-to-br from-lime-100 to-cyan-100 overflow-hidden transform transition duration-300 hover:shadow-2xl hover:scale-[1.03]">
              <div className="h-64 md:h-auto overflow-hidden">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <Badge
                  variant="outline"
                  className="w-fit mb-3 border-cyan-700 text-cyan-900 font-semibold"
                >
                  {featuredPost.category}
                </Badge>
                <CardTitle className="text-4xl font-extrabold tracking-tight text-cyan-900 group-hover:text-cyan-700 transition-colors">
                  {featuredPost.title}
                </CardTitle>
                <CardDescription className="mt-4 text-lg text-cyan-900/90 leading-relaxed">
                  {featuredPost.excerpt}
                </CardDescription>
                <div className="mt-6 text-sm text-cyan-900/80 font-medium">
                  {featuredPost.author} • {featuredPost.date}
                </div>
              </div>
            </Card>
          </Link>
        </section>

        {/* Post Grid */}
        <section>
          <h2 className="text-4xl font-extrabold tracking-tight mb-8 text-cyan-900">
            All Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blogdesc`}
                className="block group rounded-2xl border-2 border-cyan-200 shadow-xl bg-gradient-to-br from-lime-100 to-cyan-100 overflow-hidden transform transition duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <CardHeader className="p-0">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-5 flex-grow">
                  <Badge
                    variant="outline"
                    className="mb-2 border-cyan-700 text-cyan-900 font-semibold"
                  >
                    {post.category}
                  </Badge>
                  <CardTitle className="text-lg font-extrabold leading-tight text-cyan-900 group-hover:text-cyan-700 transition-colors">
                    {post.title}
                  </CardTitle>
                </CardContent>
                <CardFooter className="p-5 pt-0 text-sm text-cyan-900/80 font-medium">
                  {post.author} • {post.date}
                </CardFooter>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

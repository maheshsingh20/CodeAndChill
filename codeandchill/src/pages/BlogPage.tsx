import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Calendar, User, ArrowRight } from "lucide-react";

const featuredPost = {
  id: "system-design-guide",
  title: "A Deep Dive into System Design Interviews",
  image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
  category: "JavaScript",
  excerpt: "Prepare for your next big interview with this step-by-step guide to tackling system design questions, from scaling databases to designing microservices.",
  author: "John Smith",
  date: "August 10, 2025",
};

const otherPosts = [
  {
    id: "react-mistakes",
    title: "10 Common Mistakes in React and How to Avoid Them",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
    category: "JavaScript",
    author: "Jane Doe",
    date: "August 8, 2025",
  },
  {
    id: "async-js",
    title: "Understanding Asynchronous JavaScript",
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=2070&auto=format&fit=crop",
    category: "JavaScript",
    author: "Emily White",
    date: "August 5, 2025",
  },
  {
    id: "devops-cicd",
    title: "A Beginner's Guide to CI/CD Pipelines",
    image: "https://images.unsplash.com/photo-1573495612057-b53b5a6b31c1?q=80&w=2070&auto=format&fit=crop",
    category: "DevOps",
    author: "Michael Brown",
    date: "August 2, 2025",
  },
  {
    id: "python-tips",
    title: "Advanced Python Tips for Better Code",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=2070&auto=format&fit=crop",
    category: "Python",
    author: "Sarah Johnson",
    date: "July 30, 2025",
  },
  {
    id: "web-security",
    title: "Essential Web Security Best Practices",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop",
    category: "Security",
    author: "David Lee",
    date: "July 28, 2025",
  },
  {
    id: "database-optimization",
    title: "Database Optimization Techniques",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=2070&auto=format&fit=crop",
    category: "Database",
    author: "Alex Chen",
    date: "July 25, 2025",
  },
];

const getCategoryColor = (category: string) => {
  const colors = {
    'JavaScript': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'DevOps': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Python': 'bg-green-500/20 text-green-300 border-green-500/30',
    'Security': 'bg-red-500/20 text-red-300 border-red-500/30',
    'Database': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  };
  return colors[category as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
};

export function BlogPage() {
  return (
    <div className="w-full min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <BookOpen className="text-green-400" size={48} />
            Developer Blog
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Stay updated with the latest tech articles, tutorials, and industry insights
          </p>
        </header>

        {/* Featured Post */}
        <section className="mb-16">
          <div className="group">
            <Link to={`/blog/${featuredPost.id}`} className="block">
              <div className="grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md overflow-hidden hover:border-gray-600 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/60">
                {/* Image */}
                <div className="h-64 lg:h-auto overflow-hidden">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col justify-center">
                  <div className={`inline-block px-3 py-1 rounded-md text-xs font-medium mb-4 ${getCategoryColor(featuredPost.category)}`}>
                    {featuredPost.category}
                  </div>

                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-green-100 group-hover:to-green-200 transition-all duration-300 leading-tight mb-4">
                    {featuredPost.title}
                  </h2>

                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed mb-6">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{featuredPost.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Other Posts Grid */}
        <section>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-8">
            Latest Articles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.map((post) => (
              <div key={post.id} className="group h-full">
                <Link to={`/blog/${post.id}`} className="block h-full">
                  <div className="h-full min-h-[400px] bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md overflow-hidden hover:border-gray-600 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
                    <div className="flex flex-col h-full">
                      {/* Image */}
                      <div className="h-48 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        {/* Category */}
                        <div className={`inline-block px-3 py-1 rounded-md text-xs font-medium mb-3 ${getCategoryColor(post.category)}`}>
                          {post.category}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-green-100 group-hover:to-green-200 transition-all duration-300 leading-tight mb-4 flex-grow">
                          {post.title}
                        </h3>

                        {/* Footer */}
                        <div className="mt-auto pt-4 border-t border-gray-700">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4 text-gray-500">
                              <div className="flex items-center gap-1">
                                <User size={12} />
                                <span>{post.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                <span>{post.date}</span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Load More Section */}
        <section className="text-center mt-16">
          <button className="px-8 py-4 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md hover:border-gray-500 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent font-medium">
              Load More Articles
            </span>
          </button>
        </section>
      </div>
    </div>
  );
}
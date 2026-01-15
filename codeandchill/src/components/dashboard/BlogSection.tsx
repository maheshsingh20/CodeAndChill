import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { blogService, BlogPost } from "@/services/blogService";

export function BlogSection() {
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const posts = await blogService.getLatestPosts(2);
        setArticles(posts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <section className="space-y-8">
        <div className="text-center text-gray-400">Loading articles...</div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-3">
            <BookOpen className="text-green-400" size={32} />
            Latest from the Blog
          </h2>
          <p className="text-gray-400 mt-2">
            Stay updated with the latest tech articles and tutorials
          </p>
        </div>
        <Link to="/blogpage">
          <div className="px-6 py-3 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md hover:border-gray-500 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center gap-2">
              View All Articles
              <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <div key={article._id} className="group h-full">
            <Link to={`/blog/${article.slug}`} className="block h-full">
              <div className="h-full min-h-[320px] bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md overflow-hidden hover:border-gray-600 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-black/60">
                <div className="flex flex-col h-full">
                  {/* Image */}
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Category Badge */}
                    <div className="mb-3">
                      <div className="inline-block px-3 py-1 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md text-xs font-medium">
                        <span className="bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-green-100 group-hover:to-green-200 transition-all duration-300 leading-tight mb-4 flex-grow">
                      {article.title}
                    </h3>

                    {/* Footer */}
                    <div className="mt-auto pt-4 border-t border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs">
                          <Calendar size={12} className="text-gray-500" />
                          <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                            {new Date(article.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-300 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-300">
                            Read Article
                          </span>
                          <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
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
  );
}
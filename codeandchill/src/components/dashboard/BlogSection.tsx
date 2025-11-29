import { Section } from "./Section";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
    return <Section title="Latest from the Blog" viewAllLink="/blog"><div className="text-center text-gray-400">Loading articles...</div></Section>;
  }

  return (
    <Section title="Latest from the Blog" viewAllLink="/blogpage">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((article) => (
          <Card
            key={article._id}
            className="card glass-card hover-lift group overflow-hidden cursor-pointer flex flex-col"
          >
            <Link
              to={`/blog/${article.slug}`}
              aria-label={`Read article: ${article.title}`}
              className="flex flex-col h-full"
            >
              {/* Image */}
              <div className="h-52 overflow-hidden relative">
                <img
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
              </div>

              {/* Content */}
              <CardContent className="card-content p-6 flex flex-col flex-grow">
                <Badge className="badge badge-secondary mb-3 self-start">
                  {article.category}
                </Badge>
                <h3 className="font-extrabold text-xl leading-tight mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-auto flex items-center gap-2 select-none">
                  <span>{new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                </p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </Section>
  );
}
import { Section } from "./Section";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function BlogSection() {
  const articles = [
    {
      title: "Understanding Asynchronous JavaScript",
      date: "Aug 8, 2025",
      image:
        "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=2070&auto=format&fit=crop",
      category: "JavaScript",
    },
    {
      title: "A Guide to System Design Interviews",
      date: "Aug 5, 2025",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      category: "Careers",
    },
  ];

  return (
    <Section title="Latest from the Blog" viewAllLink="/blog">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((article) => (
          <Card
            key={article.title}
            className="card glass-card hover-lift group overflow-hidden cursor-pointer flex flex-col"
          >
            <Link
              to="/blog"
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
                  <span>{article.date}</span>
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
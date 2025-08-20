import { Section } from "./Section.jsx";
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
      badgeColor:
        "bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 text-yellow-300 border-yellow-500/40",
    },
    {
      title: "A Guide to System Design Interviews",
      date: "Aug 5, 2025",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      category: "Careers",
      badgeColor:
        "bg-gradient-to-r from-cyan-400/20 to-blue-600/20 text-cyan-300 border-cyan-500/40",
    },
  ];

  return (
    <Section title="Latest from the Blog" viewAllLink="/blog">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((article) => (
          <Card
            key={article.title}
            className={`
              rounded-2xl border border-gray-800 bg-gray-900/70 backdrop-blur-xl
              shadow-lg shadow-cyan-500/10
              hover:shadow-cyan-500/20 hover:scale-[1.03]
              transition-all duration-300 ease-in-out group overflow-hidden
              cursor-pointer flex flex-col
            `}
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
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent"></div>
              </div>

              {/* Content */}
              <CardContent className="p-6 flex flex-col flex-grow">
                <Badge
                  variant="outline"
                  className={`mb-3 self-start font-semibold tracking-wide backdrop-blur-md border ${article.badgeColor}`}
                >
                  {article.category}
                </Badge>
                <h3 className="font-extrabold text-xl leading-tight mb-2 text-gray-100 group-hover:text-cyan-400 transition-colors duration-300">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-400 mt-auto flex items-center gap-2 select-none">
                  <span>{article.date}</span>
                  <ArrowRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </Section>
  );
}

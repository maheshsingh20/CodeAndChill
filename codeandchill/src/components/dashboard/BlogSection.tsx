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
      gradient: "from-lime-200 via-gray-200 to-cyan-100",
      badgeColor: "bg-lime-200 text-lime-900 border-lime-300",
    },
    {
      title: "A Guide to System Design Interviews",
      date: "Aug 5, 2025",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      category: "Careers",
      gradient: "from-gray-200 via-cyan-100 to-lime-200",
      badgeColor: "bg-cyan-100 text-cyan-900 border-cyan-200",
    },
  ];

  return (
    <Section title="Latest from the Blog" viewAllLink="/blog">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((article) => (
          <Card
            key={article.title}
            className={`
              rounded-2xl shadow-lg border-2 border-cyan-200
              bg-gradient-to-br ${article.gradient}
              hover:shadow-2xl hover:scale-[1.04] transition-transform duration-300 ease-in-out group overflow-hidden
              cursor-pointer
              flex flex-col
            `}
          >
            <Link to="/blog" aria-label={`Read article: ${article.title}`} className="flex flex-col h-full">
              <div className="h-52 overflow-hidden rounded-t-2xl">
                <img
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <CardContent className="p-6 flex flex-col flex-grow">
                <Badge
                  variant="outline"
                  className={`mb-3 self-start font-semibold tracking-wide ${article.badgeColor} border`}
                >
                  {article.category}
                </Badge>
                <h3 className="font-extrabold text-xl leading-tight mb-2 text-gray-900 group-hover:text-cyan-700 transition-colors duration-300">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 mt-auto flex items-center gap-2 select-none">
                  <span>{article.date}</span>
                  <ArrowRight className="w-5 h-5 text-cyan-400" />
                </p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </Section>
  );
}

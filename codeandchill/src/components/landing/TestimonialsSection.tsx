import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

type Testimonial = {
  name: string;
  title: string;
  image: string;
  quote: string;
  rating: number;
  gradient: string;
  border: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Sarah L.",
    title: "Software Engineer",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    quote:
      "The hands-on coding playgrounds are a game-changer. I learned more here in a month than in a year of reading books. Highly recommended!",
    rating: 5,
    gradient: "from-gray-800 via-gray-900 to-gray-800",
    border: "border-cyan-500",
  },
  {
    name: "Michael B.",
    title: "Product Manager",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote:
      "The quality of the video content and the AI assistant helped me grasp complex topics easily. The certificate was a great bonus for my career.",
    rating: 5,
    gradient: "from-gray-900 via-gray-800 to-gray-900",
    border: "border-lime-500",
  },
  {
    name: "Jessica P.",
    title: "UX Designer",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "An amazing platform for anyone looking to upskill. The community is supportive, and the courses are well-structured and easy to follow.",
    rating: 5,
    gradient: "from-gray-800 via-gray-900 to-gray-800",
    border: "border-cyan-500",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-cyan-400 drop-shadow-neon">
            Trusted by Learners Worldwide
          </h2>
          <p className="max-w-2xl mx-auto text-cyan-300/80 md:text-xl">
            Hear what our students have to say about their learning experience.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className={`
                rounded-2xl shadow-lg ${testimonial.border} 
                bg-gradient-to-br ${testimonial.gradient} 
                hover:shadow-xl hover:scale-[1.03] transition-all duration-300
                flex flex-col
              `}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="ring-2 ring-cyan-400">
                    <AvatarImage src={testimonial.image} />
                    <AvatarFallback>
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-semibold text-cyan-300">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-cyan-400/70">
                      {testimonial.title}
                    </p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {Array.from({ length: testimonial.rating }, (_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow"
                    />
                  ))}
                </div>
                <blockquote className="text-cyan-300/80 border-l-2 border-cyan-500 pl-4 italic">
                  {testimonial.quote}
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

import React, { useState, useEffect } from "react";
import { PenSquare, Trophy, Star, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Story {
  _id: string;
  name: string;
  company: string;
  image: string;
  quote: string;
  skills: string[];
  linkedinUrl?: string;
}

export function SuccessStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({
    name: "",
    company: "",
    quote: "",
    skills: "",
    linkedinUrl: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3001/api/stories");
        const data = await response.json();
        // Use mock data if the database is empty
        setStories(
          data.length > 0
            ? data
            : [
              {
                _id: "1",
                name: "Priya Sharma",
                company: "Google",
                image: "https://randomuser.me/api/portraits/women/68.jpg",
                quote: "The DSA course was a complete game-changer for my career. I went from struggling with basic algorithms to confidently solving complex problems in interviews.",
                skills: ["Data Structures", "Algorithms", "C++"],
                linkedinUrl: "#",
              },
              {
                _id: "2",
                name: "Rohan Mehra",
                company: "Microsoft",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
                quote: "I went from knowing basic HTML to building a full-stack MERN application. The structured learning path made all the difference.",
                skills: ["React", "Node.js", "MongoDB"],
                linkedinUrl: "#",
              },
              {
                _id: "3",
                name: "Anjali Singh",
                company: "Amazon",
                image: "https://randomuser.me/api/portraits/women/44.jpg",
                quote: "The mock interviews and resume guidance were invaluable. I received multiple offers and chose my dream job at Amazon.",
                skills: ["AWS", "Docker", "CI/CD"],
                linkedinUrl: "#",
              },
              {
                _id: "4",
                name: "Arjun Patel",
                company: "Netflix",
                image: "https://randomuser.me/api/portraits/men/45.jpg",
                quote: "The system design course helped me understand scalable architecture. Now I'm building systems that serve millions of users.",
                skills: ["System Design", "Microservices", "Kafka"],
                linkedinUrl: "#",
              },
              {
                _id: "5",
                name: "Sneha Reddy",
                company: "Uber",
                image: "https://randomuser.me/api/portraits/women/32.jpg",
                quote: "From a non-CS background to a senior software engineer. The community support and mentorship were incredible.",
                skills: ["Python", "Machine Learning", "TensorFlow"],
                linkedinUrl: "#",
              },
              {
                _id: "6",
                name: "Vikram Kumar",
                company: "Spotify",
                image: "https://randomuser.me/api/portraits/men/67.jpg",
                quote: "The practical projects and real-world scenarios prepared me for the challenges I face daily as a full-stack developer.",
                skills: ["JavaScript", "React", "GraphQL"],
                linkedinUrl: "#",
              },
            ]
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({ ...formState, [e.target.id]: e.target.value });
  };

  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formState,
          skills: formState.skills.split(",").map(skill => skill.trim()),
        }),
      });

      if (response.ok) {
        setFormMessage("Success story submitted successfully!");
        setFormState({
          name: "",
          company: "",
          quote: "",
          skills: "",
          linkedinUrl: "",
        });
        setDialogOpen(false);
        // Refresh stories
        const updatedResponse = await fetch("http://localhost:3001/api/stories");
        const updatedData = await updatedResponse.json();
        setStories(updatedData);
      } else {
        setFormMessage("Failed to submit story. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setFormMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black">
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <Trophy className="text-yellow-400" size={48} />
            Success Stories
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Get inspired by our community's achievements and career transformations
          </p>

          {/* Share Your Story Button */}
          <button
            onClick={() => setDialogOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            <PenSquare size={20} />
            Share Your Success Story
          </button>
        </header>

        {/* Stories Grid */}
        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div key={story._id} className="group h-full">
                <div className="h-full min-h-[400px] bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-6 hover:border-gray-600 hover:from-gray-800 hover:via-gray-900 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/60">
                  <div className="flex flex-col items-center h-full text-center">
                    {/* Avatar */}
                    <Avatar className="w-20 h-20 border-2 border-gray-600 group-hover:border-yellow-500 transition-all duration-300 mb-4">
                      <AvatarImage src={story.image} alt={story.name} />
                      <AvatarFallback className="bg-gray-800 text-gray-300 text-xl">
                        {story.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Company Badge */}
                    <div className="px-4 py-2 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-md mb-4">
                      <span className="text-sm font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                        {story.company}
                      </span>
                    </div>

                    {/* Quote */}
                    <div className="flex-grow flex items-center justify-center mb-6">
                      <blockquote className="text-center">
                        <div className="flex items-start gap-2 mb-3">
                          <Star className="text-yellow-400 h-5 w-5 flex-shrink-0 mt-1" />
                          <p className="text-lg font-medium bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-yellow-100 group-hover:to-yellow-200 transition-all duration-300 leading-relaxed">
                            "{story.quote}"
                          </p>
                        </div>
                      </blockquote>
                    </div>

                    {/* Skills */}
                    <div className="mb-6">
                      <div className="flex flex-wrap justify-center gap-2">
                        {story.skills.slice(0, 3).map((skill, index) => (
                          <div key={index} className="px-2 py-1 bg-black/30 backdrop-blur-sm border border-gray-600 rounded text-xs">
                            <span className="bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
                              {skill}
                            </span>
                          </div>
                        ))}
                        {story.skills.length > 3 && (
                          <div className="px-2 py-1 bg-black/30 backdrop-blur-sm border border-gray-600 rounded text-xs">
                            <span className="bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
                              +{story.skills.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Attribution */}
                    <div className="mt-auto pt-4 border-t border-gray-700 w-full">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                          {story.name}
                        </p>
                        {story.linkedinUrl && story.linkedinUrl !== "#" && (
                          <a
                            href={story.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <ArrowRight size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Share Story Dialog */}
        {dialogOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                  Share Your Success Story
                </h2>
                <button
                  onClick={() => setDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleStorySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formState.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-white focus:border-gray-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={formState.company}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-white focus:border-gray-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Success Story
                  </label>
                  <textarea
                    id="quote"
                    value={formState.quote}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-white focus:border-gray-500 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Skills (comma-separated)
                  </label>
                  <input
                    id="skills"
                    type="text"
                    value={formState.skills}
                    onChange={handleInputChange}
                    placeholder="React, Node.js, Python"
                    className="w-full px-3 py-2 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-white focus:border-gray-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    LinkedIn URL (optional)
                  </label>
                  <input
                    id="linkedinUrl"
                    type="url"
                    value={formState.linkedinUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-white focus:border-gray-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setDialogOpen(false)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-900 via-black to-gray-800 border border-gray-600 rounded-md text-gray-300 hover:border-gray-500 hover:text-white transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-medium rounded-md transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Story"}
                  </button>
                </div>
              </form>

              {formMessage && (
                <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-md">
                  <p className="text-green-400 text-sm">{formMessage}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
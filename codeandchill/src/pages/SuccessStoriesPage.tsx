import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.tsx";
import { StoryCard } from "@/components/success/StoryCard.tsx";
import { PenSquare, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Label } from "@/components/ui/label.tsx";

export function SuccessStoriesPage() {
  const [stories, setStories] = useState([]);
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
        // Use mock data if the database is empty, to preserve the look
        setStories(
          data.length > 0
            ? data
            : [
                {
                  _id: "1",
                  name: "Priya Sharma",
                  company: "Google",
                  image: "https://randomuser.me/api/portraits/women/68.jpg",
                  quote: "The DSA course was a complete game-changer...",
                  skills: ["Data Structures", "Algorithms", "C++"],
                  linkedinUrl: "#",
                },
                {
                  _id: "2",
                  name: "Rohan Mehra",
                  company: "Microsoft",
                  image: "https://randomuser.me/api/portraits/men/32.jpg",
                  quote:
                    "I went from knowing basic HTML to building a full-stack MERN application...",
                  skills: ["React", "Node.js", "MongoDB"],
                  linkedinUrl: "#",
                },
                {
                  _id: "3",
                  name: "Anjali Singh",
                  company: "Amazon",
                  image: "https://randomuser.me/api/portraits/women/44.jpg",
                  quote:
                    "The mock interviews and resume guidance were invaluable...",
                  skills: ["AWS", "Docker", "CI/CD"],
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
          skills: formState.skills.split(",").map((s) => s.trim()),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setFormMessage(data.message);
      setTimeout(() => {
        setDialogOpen(false);
        setFormMessage("");
      }, 2000);
    } catch (err: any) {
      setFormMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && stories.length === 0) {
    return (
      <div className="container p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 border-t border-cyan-400/40">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <header className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
            Success Stories
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed">
            Read how{" "}
            <span className="font-semibold text-cyan-400">Code & Chill</span>{" "}
            has helped learners achieve their{" "}
            <span className="font-semibold text-purple-400">dream careers</span>
            .
          </p>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="mt-8 font-semibold bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-500/30 rounded-xl px-6 py-3 transition-transform hover:scale-[1.02]"
              >
                <PenSquare className="mr-2 h-5 w-5" /> Share Your Story
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800 text-gray-200">
              <DialogHeader>
                <DialogTitle>Share Your Success</DialogTitle>
                <DialogDescription>
                  Your story could inspire the next developer.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleStorySubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company You Joined</Label>
                  <Input id="company" onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
                  <Input
                    id="linkedinUrl"
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">
                    Skills Learned (comma-separated)
                  </Label>
                  <Input
                    id="skills"
                    placeholder="e.g., React, Node.js, AWS"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quote">Your Story / Quote</Label>
                  <Textarea id="quote" onChange={handleInputChange} />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Story"}
                </Button>
                {formMessage && (
                  <p className="text-sm text-green-500">{formMessage}</p>
                )}
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {stories.map((story: any) => (
            <StoryCard key={story._id} story={story} />
          ))}
        </main>
      </div>
    </div>
  );
}

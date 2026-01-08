import { Code, Github, Twitter, Linkedin, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";

export function Footer() {
  return (
    <footer className="border-0 border-t-0">
      <div className="container mx-auto px-6 py-16 border-0 border-t-0">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand & Social */}
          <div className="space-y-6 md:col-span-1">
            <Link to="/dashboard" className="flex items-center gap-3">
              <Code className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-extrabold tracking-tight text-slate-100">
                Code & Chill
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              Your partner in lifelong learning and skill development.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a
                href="#"
                className="text-slate-500 hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-800/50"
              >
                <Twitter />
              </a>
              <a
                href="#"
                className="text-slate-500 hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-800/50"
              >
                <Github />
              </a>
              <a
                href="#"
                className="text-slate-500 hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-800/50"
              >
                <Linkedin />
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider text-slate-200 text-sm">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/courses"
                  className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/problems"
                  className="text-muted-foreground hover:text-primary transition"
                >
                  Problem Sets
                </Link>
              </li>
              <li>
                <Link
                  to="/contests"
                  className="text-muted-foreground hover:text-primary transition"
                >
                  Contests
                </Link>
              </li>
            </ul>
          </div>
          {/* Resources */}
          <div className="space-y-3">
            <h4 className="font-semibold uppercase tracking-wider text-foreground">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/blog"
                  className="text-muted-foreground hover:text-primary transition"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/community"
                  className="text-muted-foreground hover:text-primary transition"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  to="/success"
                  className="text-muted-foreground hover:text-primary transition"
                >
                  Success Stories
                </Link>
              </li>
              <li>
                <FeedbackModal>
                  <button className="text-muted-foreground hover:text-primary transition flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Send Feedback
                  </button>
                </FeedbackModal>
              </li>
            </ul>
          </div>
          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="font-semibold uppercase tracking-wider text-foreground">
              Stay Connected
            </h4>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest updates.
            </p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="input"
              />
              <Button
                type="submit"
                className="btn btn-default"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Copyright section integrated without separator */}
        <div className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-0 border-t-0">
          <div className="text-sm text-muted-foreground">
            © 2025 Code and Chill, Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <FeedbackModal>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Give Feedback
              </Button>
            </FeedbackModal>
          </div>
        </div>
      </div>
    </footer>
  );
}
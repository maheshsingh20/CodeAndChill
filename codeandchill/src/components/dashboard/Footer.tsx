import { Code, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-200 border-t border-gray-700">
      <div className="container mx-auto px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand & Social */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/dashboard" className="flex items-center gap-3">
              <Code className="h-8 w-8 text-cyan-400" />
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Code & Chill
              </span>
            </Link>
            <p className="text-sm opacity-70 max-w-xs">
              Your partner in lifelong learning and skill development.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a
                href="#"
                className="opacity-70 hover:opacity-100 hover:text-cyan-400 transition"
              >
                <Twitter />
              </a>
              <a
                href="#"
                className="opacity-70 hover:opacity-100 hover:text-purple-400 transition"
              >
                <Github />
              </a>
              <a
                href="#"
                className="opacity-70 hover:opacity-100 hover:text-blue-400 transition"
              >
                <Linkedin />
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold uppercase tracking-wider text-cyan-300">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/courses"
                  className="opacity-70 hover:opacity-100 hover:text-cyan-400 transition"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/problems"
                  className="opacity-70 hover:opacity-100 hover:text-cyan-400 transition"
                >
                  Problem Sets
                </Link>
              </li>
              <li>
                <Link
                  to="/contests"
                  className="opacity-70 hover:opacity-100 hover:text-cyan-400 transition"
                >
                  Contests
                </Link>
              </li>
            </ul>
          </div>
          {/* Resources */}
          <div className="space-y-3">
            <h4 className="font-semibold uppercase tracking-wider text-purple-300">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/blog"
                  className="opacity-70 hover:opacity-100 hover:text-purple-400 transition"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/community"
                  className="opacity-70 hover:opacity-100 hover:text-purple-400 transition"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  to="/success"
                  className="opacity-70 hover:opacity-100 hover:text-purple-400 transition"
                >
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>
          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="font-semibold uppercase tracking-wider text-emerald-300">
              Stay Connected
            </h4>
            <p className="text-sm opacity-70">
              Subscribe to our newsletter for the latest updates.
            </p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800/70 border border-gray-700 text-gray-200 placeholder:text-gray-400 rounded-lg focus-visible:ring-2 focus-visible:ring-cyan-400"
              />
              <Button
                type="submit"
                variant="default"
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-gray-900/80 border-t border-gray-700">
        <div className="container mx-auto py-4 px-6 text-center text-sm text-gray-400">
          © 2025 Code and Chill, Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

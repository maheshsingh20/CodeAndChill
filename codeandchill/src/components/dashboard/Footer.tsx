import { Code, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-lime-200 via-gray-200 to-cyan-100 text-gray-900 border-t-2 border-cyan-200">
      <div className="container mx-auto px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand & Social */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/dashboard" className="flex items-center gap-3">
              <Code className="h-8 w-8 text-cyan-700" />
              <span className="text-2xl font-extrabold tracking-tight text-cyan-900">Code & Chill</span>
            </Link>
            <p className="text-sm opacity-80 max-w-xs">
              Your partner in lifelong learning and skill development.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="opacity-80 hover:opacity-100 hover:text-cyan-700 transition"><Twitter /></a>
              <a href="#" className="opacity-80 hover:opacity-100 hover:text-cyan-700 transition"><Github /></a>
              <a href="#" className="opacity-80 hover:opacity-100 hover:text-cyan-700 transition"><Linkedin /></a>
            </div>
          </div>
          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold uppercase tracking-wider text-cyan-800">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="opacity-80 hover:opacity-100 hover:text-cyan-700 transition">Courses</Link></li>
              <li><Link to="/problems" className="opacity-80 hover:opacity-100 hover:text-cyan-700 transition">Problem Sets</Link></li>
              <li><Link to="/contests" className="opacity-80 hover:opacity-100 hover:text-cyan-700 transition">Contests</Link></li>
            </ul>
          </div>
          {/* Resources */}
          <div className="space-y-3">
            <h4 className="font-semibold uppercase tracking-wider text-cyan-800">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/blog" className="opacity-80 hover:opacity-100 hover:text-cyan-700 transition">Blog</Link></li>
              <li><Link to="/community" className="opacity-80 hover:opacity-100 hover:text-cyan-700 transition">Community</Link></li>
              <li><Link to="/success" className="opacity-80 hover:opacity-100 hover:text-cyan-700 transition">Success Stories</Link></li>
            </ul>
          </div>
          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="font-semibold uppercase tracking-wider text-cyan-800">Stay Connected</h4>
            <p className="text-sm opacity-80">Subscribe to our newsletter for the latest updates.</p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white border border-cyan-200 text-gray-900 placeholder:text-gray-400 rounded-lg"
              />
              <Button
                type="submit"
                variant="default"
                className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold rounded-lg"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-cyan-100/60 border-t border-cyan-200">
        <div className="container mx-auto py-4 px-6 text-center text-sm text-cyan-900 opacity-80">
          © 2025 Code and Chill, Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
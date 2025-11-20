import { Link } from "react-router-dom";
import { Code, Menu, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NavMenu } from "./NavMenu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gradient-to-r from-gray-950 via-gray-900 to-black text-gray-100 shadow-lg">
      <div className="container flex h-18 items-center justify-between px-4 md:px-6">
        {/* Left: Enhanced Logo & Desktop Menu */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-3 group"
            aria-label="Homepage"
          >
            <Code className="h-8 w-8 text-purple-400 group-hover:rotate-12 transition-transform" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Code & Chill
            </span>
          </Link>
          
          <div className="hidden md:flex">
            <NavMenu />
          </div>
        </div>

        {/* Right: Enhanced Auth Buttons / Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="default"
              className="border border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-purple-400 hover:border-purple-500/50 font-medium rounded-xl px-6 py-2 transition-all duration-200"
              asChild
            >
              <Link to="/auth?tab=login">
                <Zap className="w-4 h-4 mr-2" />
                Log In
              </Link>
            </Button>
            <Button
              size="default"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/25 font-medium rounded-xl px-6 py-2 transition-all duration-200"
              asChild
            >
              <Link to="/auth?tab=signup">
                <Sparkles className="w-4 h-4 mr-2" />
                Sign Up
              </Link>
            </Button>
          </div>

          {/* Enhanced Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-purple-400 rounded-xl"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-200 border-l border-gray-800 p-0 w-80"
              >
                <SheetHeader className="p-6 border-b border-gray-800">
                  <SheetTitle>
                    <Link to="/" className="flex items-center gap-3">
                      <Code className="h-8 w-8 text-purple-400" />
                      <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent font-bold">
                        Code & Chill
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="p-6 space-y-6">
                  {/* Mobile Navigation */}
                  <nav className="space-y-2">
                    <Link
                      to="/courses"
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-300 hover:text-purple-400 hover:bg-gray-800 transition-all duration-200 font-medium"
                    >
                      <Code className="w-4 h-4" />
                      Courses
                    </Link>
                    <Link
                      to="/about"
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-300 hover:text-purple-400 hover:bg-gray-800 transition-all duration-200 font-medium"
                    >
                      <Sparkles className="w-4 h-4" />
                      About
                    </Link>
                    <Link
                      to="/contact"
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-300 hover:text-purple-400 hover:bg-gray-800 transition-all duration-200 font-medium"
                    >
                      <Zap className="w-4 h-4" />
                      Contact
                    </Link>
                  </nav>
                  
                  {/* Mobile Auth Buttons */}
                  <div className="space-y-3 pt-4 border-t border-gray-800">
                    <Button
                      variant="outline"
                      size="default"
                      className="w-full border border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-purple-400 font-medium rounded-xl"
                      asChild
                    >
                      <Link to="/auth?tab=login">
                        <Zap className="w-4 h-4 mr-2" />
                        Log In
                      </Link>
                    </Button>
                    <Button
                      size="default"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg font-medium rounded-xl"
                      asChild
                    >
                      <Link to="/auth?tab=signup">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
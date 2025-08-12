import { Link } from "react-router-dom";
import { Code, Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavMenu } from "./NavMenu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-br from-lime-100 via-gray-100 to-cyan-100 shadow-md rounded-b-2xl border-b border-cyan-100/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Side: Logo and Desktop Nav */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2" aria-label="Homepage">
            <Code className="h-6 w-6 text-cyan-700" />
            <span className="text-lg font-bold text-cyan-900">Code and Chill</span>
          </Link>
          <div className="hidden md:flex">
            <NavMenu />
          </div>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="hidden flex-1 items-center justify-center px-8 lg:flex">
          {/* Example search bar, uncomment if needed */}
          {/* <div className="relative w-full max-w-md">
            <Input
              type="text"
              placeholder="Search courses, topics, or users"
              className="pl-10 pr-4 py-2 bg-white border border-cyan-200 text-cyan-900 placeholder:text-cyan-400 rounded-lg shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              aria-label="Search"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-400" />
          </div> */}
        </div>

        {/* Right Side: Auth Buttons (Desktop) and Mobile Menu Trigger */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              className="min-w-[110px] font-semibold border-cyan-200 text-cyan-800 bg-white hover:bg-cyan-100 hover:text-cyan-900 hover:border-cyan-300 rounded-lg transition-colors duration-200 shadow-none"
              asChild
            >
              {/* Changed Link target here to /auth?tab=login */}
              <Link to="/auth?tab=login">Log In</Link>
            </Button>
            <Button
              size="md"
              className="min-w-[110px] font-semibold bg-cyan-600 text-white hover:bg-cyan-700 rounded-lg shadow-none transition-all duration-200"
              asChild
            >
              {/* Changed Link target here to /auth?tab=signup */}
              <Link to="/auth?tab=signup">Sign Up</Link>
            </Button>
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white border-cyan-200 hover:bg-cyan-50 rounded-lg"
                >
                  <Menu className="h-5 w-5 text-cyan-700" />
                  <span className="sr-only">Open main menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-gradient-to-br from-lime-100 via-gray-100 to-cyan-100">
                <div className="mt-auto pt-6">
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="md"
                      className="min-w-[110px] font-semibold border-cyan-200 text-cyan-800 bg-white hover:bg-cyan-100 hover:text-cyan-900 hover:border-cyan-300 rounded-lg transition-colors duration-200 shadow-none"
                      asChild
                    >
                      {/* Changed Link target here to /auth?tab=login */}
                      <Link to="/auth?tab=login">Log In</Link>
                    </Button>
                    <Button
                      size="md"
                      className="min-w-[110px] font-semibold bg-cyan-600 text-white hover:bg-cyan-700 rounded-lg shadow-none transition-all duration-200"
                      asChild
                    >
                      {/* Changed Link target here to /auth?tab=signup */}
                      <Link to="/auth?tab=signup">Sign Up</Link>
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

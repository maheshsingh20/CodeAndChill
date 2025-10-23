import { Link } from "react-router-dom";
import { Code, Menu} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavMenu } from "./NavMenu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-neon">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left: Logo & Desktop Menu */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2"
            aria-label="Homepage"
          >
            <Code className="h-6 w-6 text-cyan-400 drop-shadow-neon" />
            <span className="text-lg font-bold text-cyan-300 drop-shadow-neon">
              Code and Chill
            </span>
          </Link>
          <div className="hidden md:flex">
            <NavMenu />
          </div>
        </div>

        {/* Center: Search Bar (optional) */}
        <div className="hidden flex-1 justify-center px-8 lg:flex">
          {/* Uncomment if search needed */}
          {/* <div className="relative w-full max-w-md">
            <Input
              type="text"
              placeholder="Search courses, topics, or users"
              className="pl-10 pr-4 py-2 bg-gray-800/70 text-cyan-200 placeholder:text-cyan-400 rounded-lg border border-cyan-700 shadow-neon focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-400" />
          </div> */}
        </div>

        {/* Right: Auth Buttons / Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="default"
              className="min-w-[110px] font-semibold border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all duration-300 shadow-neon"
              asChild
            >
              <Link to="/auth?tab=login">Log In</Link>
            </Button>
            <Button
              size="default"
              className="min-w-[110px] font-semibold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white hover:shadow-neon-lg hover:scale-[1.03] transition-all duration-300"
              asChild
            >
              <Link to="/auth?tab=signup">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-gray-900/80 border border-cyan-700 hover:bg-gray-800 rounded-none shadow-neon"
                >
                  <Menu className="h-5 w-5 text-cyan-400" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6"
              >
                <div className="flex flex-col gap-4 mt-6">
                  <Button
                    variant="outline"
                    size="default"
                    className="min-w-[110px] font-semibold border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all duration-300 shadow-neon"
                    asChild
                  >
                    <Link to="/auth?tab=login">Log In</Link>
                  </Button>
                  <Button
                    size="default"
                    className="min-w-[110px] font-semibold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white hover:shadow-neon-lg hover:scale-[1.03] transition-all duration-300"
                    asChild
                  >
                    <Link to="/auth?tab=signup">Sign Up</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

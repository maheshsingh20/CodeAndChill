import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Code, Menu, User, Bell, Sparkles, Zap, Users, MessageCircle } from "lucide-react";
// Removed cn import as it's no longer needed
import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/search/SearchBox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";

// Removed paths array as we're no longer using the dropdown

export function Navbar({ logout }) {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Keep only essential navigation items
  const navLinks = [
    { href: "/problems", text: "Problems", icon: <Zap className="w-4 h-4" /> },
    { href: "/courses", text: "Courses", icon: <Code className="w-4 h-4" /> },
    { href: "/contests", text: "Contests", icon: <Sparkles className="w-4 h-4" /> },
    { href: "/chat", text: "Chat", icon: <MessageCircle className="w-4 h-4" /> },
    { href: "/careers", text: "Careers", icon: <Users className="w-4 h-4" /> },
    { href: "/about", text: "About", icon: <User className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-700/30 backdrop-blur-md bg-black/80">
      <div className="container flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link to="/dashboard" className="flex items-center gap-3 group relative">
            <div className="relative">
              <Code className="h-8 w-8 text-purple-400 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
              {/* Glow effect on hover */}
              <div className="absolute inset-0 h-8 w-8 bg-purple-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:via-pink-400 group-hover:to-purple-500 transition-all duration-300">
              Code & Chill
            </span>
          </Link>
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="flex items-center gap-2">
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.text}>
                  <Link to={link.href} className="group relative">
                    <NavigationMenuLink className="flex items-center gap-2 px-4 py-2 text-gray-300 font-medium transition-all duration-300 hover:text-white rounded-lg hover:bg-gray-800/50">
                      <span className="text-gray-400 group-hover:text-purple-400 transition-colors duration-300">
                        {link.icon}
                      </span>
                      <span className="relative">
                        {link.text}
                        {/* Animated underline - hidden by default, only shows on hover */}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
                      </span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <SearchBox />
          </div>

          {/* Enhanced Notification Button */}
          <div className="relative">
            <NotificationDropdown />
          </div>

          {/* Enhanced Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full group relative">
                <Avatar className="h-10 w-10 border-2 border-purple-500/40 group-hover:border-purple-400/60 transition-all duration-300 group-hover:scale-105">
                  <AvatarImage
                    src={user?.profilePicture || "https://github.com/shadcn.png"}
                    alt="User Avatar"
                    key={user?.profilePicture || 'default'}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-300">
                    {user ? user.name.slice(0, 2).toUpperCase() : <User className="text-gray-400" />}
                  </AvatarFallback>
                </Avatar>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-purple-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 mt-2 bg-gray-900 border border-gray-800"
            >
              <DropdownMenuLabel className="text-gray-200">
                {user ? user.name : 'My Account'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem asChild>
                <Link
                  to="/Profile"
                  className="text-gray-300 hover:text-purple-400"
                >
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/user-dashboard"
                  className="text-gray-300 hover:text-purple-400"
                >
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/Ai" className="text-gray-300 hover:text-purple-400">
                  AI Assistant
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/Playground"
                  className="text-gray-300 hover:text-purple-400"
                >
                  Playground
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/problem-solver"
                  className="text-gray-300 hover:text-purple-400"
                >
                  Problem Solver
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/quiz-system"
                  className="text-gray-300 hover:text-purple-400"
                >
                  Quiz System
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/settings"
                  className="text-gray-300 hover:text-purple-400"
                >
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-500 focus:text-red-500"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-purple-400"
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-200 border-r border-gray-800 p-0"
              >
                <SheetHeader className="p-6 border-b border-gray-800">
                  <SheetTitle>
                    <Link to="/dashboard" className="flex items-center gap-3">
                      <Code className="h-8 w-8 text-purple-400" />
                      <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent font-bold">
                        Code & Chill
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4">
                  <div className="mb-4">
                    <SearchBox />
                  </div>
                  <nav className="grid gap-2 text-lg font-medium">
                    {navLinks.map((link) => (
                      <Link
                        key={link.text}
                        to={link.href}
                        className="group flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-300 hover:bg-gray-800/80 hover:text-purple-400 relative overflow-hidden"
                      >
                        <span className="text-gray-400 group-hover:text-purple-400 transition-colors duration-300 group-hover:scale-110">
                          {link.icon}
                        </span>
                        <span className="relative">
                          {link.text}
                          {/* Mobile underline effect - hidden by default, only shows on hover */}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
                        </span>
                        {/* Background slide effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 -z-10"></div>
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

// Removed ListItem component as it's no longer needed
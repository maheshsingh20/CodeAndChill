import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Code, Menu, User, Bell, Sparkles, Zap, Users } from "lucide-react";
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
    { href: "/collaborative", text: "Live Coding", icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gradient-to-r from-gray-950 via-gray-900 to-black text-gray-100 shadow-lg">
      <div className="container flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <Code className="h-8 w-8 text-purple-400 group-hover:rotate-12 transition-transform" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Code & Chill
            </span>
          </Link>
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.text}>
                  <Link to={link.href}>
                    <NavigationMenuLink className="bg-transparent text-gray-300 font-medium opacity-80 transition hover:opacity-100 hover:text-purple-400 px-3 py-2">
                      {link.text}
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
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full relative hover:bg-purple-900/40"
          >
            <Bell className="h-5 w-5 text-gray-300" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border-2 border-gray-900"></span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-10 w-10 border-2 border-purple-500/40">
                  <AvatarImage
                    src={user?.profilePicture || "https://github.com/shadcn.png"}
                    alt="User Avatar"
                  />
                  <AvatarFallback>
                    {user ? user.name.slice(0, 2).toUpperCase() : <User className="text-gray-400" />}
                  </AvatarFallback>
                </Avatar>
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
                        className="flex items-center gap-4 rounded-lg px-3 py-3 opacity-80 transition-all hover:opacity-100 hover:bg-gray-800 hover:text-purple-400"
                      >
                        {link.text}
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
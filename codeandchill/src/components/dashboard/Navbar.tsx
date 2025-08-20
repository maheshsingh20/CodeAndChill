import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Code, Menu, Search, User, Bell, Cpu, Server, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
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

const paths = [
  {
    title: "AI & Machine Learning",
    href: "/paths",
    description:
      "Dive into the world of AI, neural networks, and data science.",
    icon: <Bot />,
    color: "bg-cyan-900/40 text-cyan-400",
  },
  {
    title: "Full-Stack Development",
    href: "/paths",
    description: "Master the MERN stack from scratch to deployment.",
    icon: <Code />,
    color: "bg-lime-900/40 text-lime-400",
  },
  {
    title: "Competitive Programming",
    href: "/paths/cp",
    description: "Hone your DSA skills for top-tier competitions.",
    icon: <Cpu />,
    color: "bg-gray-800/50 text-gray-300",
  },
  {
    title: "Cloud & DevOps",
    href: "/paths/devops",
    description: "Learn to deploy, scale, and manage modern applications.",
    icon: <Server />,
    color: "bg-indigo-900/40 text-indigo-400",
  },
];

export function Navbar({ logout }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { href: "/problems", text: "Problemset" },
    { href: "/contests", text: "Contests" },
    { href: "/courses", text: "Courses" },
    { href: "/blogpage", text: "Blog" },
    { href: "/success-stories", text: "Success Stories" },
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
              {navLinks.slice(0, 1).map((link) => (
                <NavigationMenuItem key={link.text}>
                  <Link to={link.href}>
                    <NavigationMenuLink className="bg-transparent text-gray-300 font-medium opacity-80 transition hover:opacity-100 hover:text-purple-400 px-3 py-2">
                      {link.text}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-gray-300 font-medium opacity-80 hover:opacity-100 hover:text-purple-400">
                  Learning Paths
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-gray-900 border border-gray-800 shadow-xl">
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {paths.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                        icon={component.icon}
                        color={component.color}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {navLinks.slice(1).map((link) => (
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
            <form>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  className="w-full rounded-xl bg-gray-800 pl-12 h-10 text-gray-100 placeholder:text-gray-500 border border-gray-700 focus-visible:ring-2 focus-visible:ring-purple-500"
                  placeholder="Search..."
                  type="search"
                />
              </div>
            </form>
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
                    src="https://github.com/shadcn.png"
                    alt="User Avatar"
                  />
                  <AvatarFallback>
                    <User className="text-gray-400" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 mt-2 bg-gray-900 border border-gray-800"
            >
              <DropdownMenuLabel className="text-gray-200">
                My Account
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
                <Link to="/Ai" className="text-gray-300 hover:text-purple-400">
                  Ai Assistant
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

const ListItem = React.forwardRef(
  ({ className, title, icon, color, children, ...props }, ref) => (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-800 hover:text-purple-400 focus:bg-gray-800 focus:text-purple-400",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${color}`}>{icon}</div>
            <div className="text-sm font-medium leading-none text-gray-200">
              {title}
            </div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-gray-400">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
);
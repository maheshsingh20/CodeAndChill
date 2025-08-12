import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Code, Menu, Search, User, Bell, Cpu, Server, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
    description: "Dive into the world of AI, neural networks, and data science.",
    icon: <Bot />,
    color: "bg-cyan-100 text-cyan-700",
  },
  {
    title: "Full-Stack Development",
    href: "/paths",
    description: "Master the MERN stack from scratch to deployment.",
    icon: <Code />,
    color: "bg-lime-100 text-lime-700",
  },
  {
    title: "Competitive Programming",
    href: "/paths/cp",
    description: "Hone your DSA skills for top-tier competitions.",
    icon: <Cpu />,
    color: "bg-gray-200 text-gray-700",
  },
  {
    title: "Cloud & DevOps",
    href: "/paths/devops",
    description: "Learn to deploy, scale, and manage modern applications.",
    icon: <Server />,
    color: "bg-cyan-100 text-cyan-700",
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
    <header className="sticky top-0 z-50 w-full border-b border-cyan-200 bg-gradient-to-r from-lime-200 via-gray-100 to-cyan-100 text-cyan-900 shadow-md">
      <div className="container flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link to="/dashboard" className="flex items-center gap-3">
            <Code className="h-8 w-8 text-cyan-700" />
            <span className="text-xl font-bold tracking-tight text-cyan-900">Code & Chill</span>
          </Link>
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navLinks.slice(0, 1).map((link) => (
                <NavigationMenuItem key={link.text}>
                  <Link to={link.href}>
                    <NavigationMenuLink className="bg-transparent font-medium opacity-80 transition-opacity hover:opacity-100 px-3 py-2">
                      {link.text}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent font-medium opacity-80 hover:opacity-100">
                  Learning Paths
                </NavigationMenuTrigger>
                <NavigationMenuContent>
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
                    <NavigationMenuLink className="bg-transparent font-medium opacity-80 transition-opacity hover:opacity-100 px-3 py-2">
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
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 opacity-50" />
                <Input
                  className="w-full rounded-xl bg-white pl-12 h-10 text-cyan-900 placeholder:text-cyan-400 border-0 focus-visible:ring-2 focus-visible:ring-cyan-400"
                  placeholder="Search..."
                  type="search"
                />
              </div>
            </form>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full relative">
            <Bell className="h-5 w-5 text-cyan-700" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-10 w-10 border-2 border-cyan-300">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/Profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/Ai">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-gradient-to-br from-lime-200 via-gray-100 to-cyan-100 text-cyan-900 border-r-cyan-200 p-0">
                <SheetHeader className="p-6 border-b border-cyan-200">
                  <SheetTitle>
                    <Link to="/dashboard" className="flex items-center gap-3">
                      <Code className="h-8 w-8 text-cyan-700" />
                      <span>Code & Chill</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4">
                  <nav className="grid gap-2 text-lg font-medium">
                    {navLinks.map((link) => (
                      <Link
                        key={link.text}
                        to={link.href}
                        className="flex items-center gap-4 rounded-lg px-3 py-3 opacity-80 transition-all hover:opacity-100 hover:bg-cyan-100"
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
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-cyan-50 hover:text-cyan-900 focus:bg-cyan-100 focus:text-cyan-900",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${color}`}>{icon}</div>
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-cyan-800">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  )
);
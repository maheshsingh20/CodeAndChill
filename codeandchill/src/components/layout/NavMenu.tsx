import React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function NavMenu() {
  const menuItems = [
    { label: "Home", to: "/" },
    { label: "Courses", to: "/courses" },
    { label: "Problem Sets", to: "/problems" },
    { label: "Blog", to: "/blog" },
    { label: "About Us", to: "/about" },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex gap-4">
        {menuItems.map((item) => (
          <NavigationMenuItem key={item.to}>
            <Link
              to={item.to}
              className={`${navigationMenuTriggerStyle()} 
                px-4 py-2 font-semibold text-cyan-300 drop-shadow-neon
                hover:text-cyan-100 hover:scale-[1.05] 
                transition-all duration-300
              `}
            >
              {item.label}
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

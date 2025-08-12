import React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function NavMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-2">
        {[
          { label: "Home", to: "/" },
          { label: "Courses", to: "/courses" },
          { label: "Problem Sets", to: "/problems" },
          { label: "Blog", to: "/blog" },
          { label: "About Us", to: "/about" },
        ].map((item) => (
          <NavigationMenuItem key={item.to}>
            <Link
              to={item.to}
              className={`${navigationMenuTriggerStyle()} 
                px-4 py-2 rounded-lg text-cyan-900 font-medium
                hover:bg-gradient-to-r hover:from-cyan-100 hover:to-lime-100 
                hover:text-cyan-950 transition-all duration-200
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

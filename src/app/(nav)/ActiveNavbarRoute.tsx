"use client";
import React from "react";
import { navbarLinks } from "@/lib/Navlinks";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
const ActiveNavbarRoute = () => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col items-start gap-y-6 lg:flex-row lg:items-center lg:gap-x-5">
      {navbarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            href={link.route}
            key={link.label}
            className={cn(
              "whitespace-nowrap font-medium text-muted-foreground transition-colors hover:text-foreground",
              { "text-foreground": isActive }
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
};

export default ActiveNavbarRoute;

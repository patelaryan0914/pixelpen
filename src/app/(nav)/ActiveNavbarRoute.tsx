"use client";
import React from "react";
import { navbarLinks } from "@/lib/Navlinks";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
const ActiveNavbarRoute = () => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap-y-6 lg:flex-row items-center gap-x-4 ">
      {navbarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            href={link.route}
            key={link.label}
            className={cn(
              "text-muted-foreground transition-colors hover:text-foreground",
              { "text-foreground": isActive }
            )}
          >
            <p className="font-medium ">{link.label}</p>
          </Link>
        );
      })}
    </div>
  );
};

export default ActiveNavbarRoute;

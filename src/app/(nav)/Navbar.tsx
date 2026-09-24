import { Menu, Search, Pen } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import ActiveNavbarRoute from "./ActiveNavbarRoute";
import AccountMenu from "./AccountMenu";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-5 md:px-8">
        {/* Left: mobile menu + brand + desktop nav */}
        <div className="flex items-center gap-4 lg:gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 lg:hidden"
                aria-label="navbar"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetTitle></SheetTitle>
            <SheetContent side="left" aria-describedby={undefined}>
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Pen className="h-5 w-5 text-primary" />
                <span className="font-serif text-xl font-semibold tracking-tight">
                  PixelPen
                </span>
              </Link>
              <nav className="mt-8 grid gap-6 text-lg font-medium">
                <ActiveNavbarRoute />
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <Pen className="h-5 w-5 text-primary" />
            <span className="font-serif text-xl font-semibold tracking-tight">
              PixelPen
            </span>
          </Link>

          <nav className="hidden items-center gap-5 text-sm lg:flex">
            <ActiveNavbarRoute />
          </nav>
        </div>

        {/* Right: search + write + user */}
        <div className="flex items-center gap-2 sm:gap-3">
          <form action="/" method="get" className="hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                name="q"
                placeholder="Search stories"
                className="w-[200px] rounded-xl pl-9 lg:w-[260px]"
              />
            </div>
          </form>

          <Link
            href="/publish-blog"
            className={buttonVariants({ variant: "default" })}
            aria-label="Write a story"
          >
            <Pen className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Write</span>
          </Link>

          <AccountMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;

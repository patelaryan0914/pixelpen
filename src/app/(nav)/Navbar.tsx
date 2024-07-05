import { Package2, Menu, Search, CircleUser, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { getSession, logout } from "@/app/actions";
import { redirect } from "next/navigation";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import ActiveNavbarRoute from "./ActiveNavbarRoute";

const Navbar = async () => {
  const session = await getSession();
  return (
    <header className=" flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden w-3/5 flex-col gap-6 text-lg font-medium lg:flex lg:flex-row lg:items-center lg:gap-5 lg:text-sm xl:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 className="h-6 w-6" />
          <span className="sr-only">Pixel Pen</span>
        </Link>
        <ActiveNavbarRoute />
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetTitle></SheetTitle>
        <SheetContent side="left" aria-describedby={undefined}>
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Pixel Pen</span>
            </Link>
            <ActiveNavbarRoute />
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full sm:w-2/5 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="gap-x-2">
                {session.userInfo.avatar === null ? (
                  <CircleUser className="h-6 w-6 text-white" />
                ) : (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={session.userInfo.avatar} alt="Image" />
                  </Avatar>
                )}
                <span className="sr-only">Toggle user menu</span>
                {session.userInfo.username}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/userInfo">Update Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <form
                  action={async () => {
                    "use server";
                    await logout();
                    redirect("/");
                  }}
                  className="w-full"
                >
                  <button type="submit">Logout</button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            href="/signin"
            className={buttonVariants({ variant: "default" })}
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;

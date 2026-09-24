"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleUser } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/app/actions";

type AccountUser = {
  id: string;
  username: string | null;
  avatar: string | null;
};

export default function AccountMenu() {
  const router = useRouter();
  const [user, setUser] = useState<AccountUser | null | undefined>(undefined);

  useEffect(() => {
    let ignore = false;
    fetch("/api/session")
      .then((response) => response.json())
      .then((data: { user?: AccountUser | null }) => {
        if (!ignore) setUser(data.user ?? null);
      })
      .catch(() => {
        if (!ignore) setUser(null);
      });
    return () => {
      ignore = true;
    };
  }, []);

  if (user === undefined) {
    return <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />;
  }

  if (!user) {
    return (
      <Link href="/signin" className={buttonVariants({ variant: "default" })}>
        Sign in
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-x-2" aria-label="userprofile">
          {user.avatar ? (
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.avatar} alt="" />
            </Avatar>
          ) : (
            <CircleUser className="h-5 w-5" />
          )}
          <span className="hidden max-w-[120px] truncate sm:inline">
            {user.username}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/following">Following</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/saved">Reading list</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/manage-blog">Manage Blogs</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/analytics">Analytics</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={async (event) => {
            event.preventDefault();
            await logout();
            router.push("/");
            router.refresh();
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

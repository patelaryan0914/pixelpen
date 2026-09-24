export const metadata: Metadata = {
  title: "User Information",
};

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getSession } from "@/app/actions";
import { AuthRequiredError } from "@/lib/exceptions";
import UserInfoUpdate from "./UserInfoUpdate";
import { CircleUser } from "lucide-react";
import { Metadata } from "next";

const Page = async () => {
  const session = await getSession();
  if (!session) throw new AuthRequiredError();

  const { username, email, avatar } = session.userInfo;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-accent/50 via-background to-background px-4 py-10">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-1.5">
          <CardTitle className="text-3xl">Welcome to PixelPen</CardTitle>
          <CardDescription>
            Set up your username and avatar to start publishing your stories.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-3">
            {avatar ? (
              <Avatar className="h-11 w-11">
                <AvatarImage src={avatar} alt={username ?? "Avatar"} />
              </Avatar>
            ) : (
              <CircleUser className="h-11 w-11 text-muted-foreground" />
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {username || "New writer"}
              </p>
              <p className="truncate text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
          <UserInfoUpdate />
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          If left blank, sensible default values will be applied.
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;

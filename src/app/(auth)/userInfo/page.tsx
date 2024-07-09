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
import { AuthRequired } from "@/lib/exceptions";
import UserInfoUpdate from "./UserInfoUpdate";
import { CircleUser } from "lucide-react";
import { Metadata } from "next";
const Page = async () => {
  const session = await getSession();
  if (!session) throw new AuthRequired();
  return (
    <Card className="w-[380px] sm:w-[450px] ">
      <CardHeader>
        <CardTitle>Hello, Welcome to Pixel Pen</CardTitle>
        <CardDescription>
          Update Your username and avatar and start publishing your blog.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            {session.userInfo.avatar === null ? (
              <CircleUser className="h-6 w-6 text-black " />
            ) : (
              <Avatar className="h-6 w-6">
                <AvatarImage src={session.userInfo.avatar} alt="Image" />
              </Avatar>
            )}
            <div>
              <p className="text-sm font-medium leading-none">
                {session.userInfo.username}
              </p>
              <p className="text-sm text-muted-foreground">
                {session.userInfo.email}
              </p>
            </div>
          </div>
        </div>
        <UserInfoUpdate />
      </CardContent>
      <CardFooter>
        *If Leaved blank then default values will be applied.
      </CardFooter>
    </Card>
  );
};

export default Page;

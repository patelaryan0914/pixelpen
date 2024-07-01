import React from "react";
import prisma from "@/lib/db";
import dynamic from "next/dynamic";
import { getSession } from "@/app/actions";
import { CircleUser } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
const Blog = dynamic(() => import("./Blog"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
const BlogDisplay = async ({ params }: { params: { title: string } }) => {
  const session = await getSession();
  const blogs = await prisma.blog.findFirst({ where: { title: params.title } });
  return (
    <div className="flex flex-col justify-center items-center ">
      <div className="mt-4 w-full lg:w-4/5 xl:w-2/5 h-[100px] flex items-center justify-between space-x-4 border border-slate-200 shadow-sm rounded-lg ">
        <div className="flex items-center space-x-4  px-4">
          {session.userInfo.avatar === null ? (
            <CircleUser className="h-10 w-10 text-black " />
          ) : (
            <Avatar className="h-10 w-10">
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
        <div className="px-4">
          <Button>Follow</Button>
        </div>
      </div>
      <Blog data={blogs} />
    </div>
  );
};

export default BlogDisplay;

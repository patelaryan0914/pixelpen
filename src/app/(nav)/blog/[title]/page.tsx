import React from "react";
import prisma from "@/lib/db";
import dynamic from "next/dynamic";
import { getSession, subscribe } from "@/app/actions";
import { CircleUser } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Blog } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BlogNotFound } from "@/lib/exceptions";
import { Badge } from "@/components/ui/badge";
const Blogs = dynamic(() => import("./Blog"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
const BlogDisplay = async ({ params }: { params: { title: string } }) => {
  const session = await getSession();
  const followAccess: boolean = session ? true : false;
  const blogs: Blog | null = await prisma.blog.findFirst({
    where: { title: params.title },
    include: {
      owner: true,
      tags: true,
    },
  });
  if (!blogs) throw new BlogNotFound();
  let isSubscribed = false;
  if (session) {
    isSubscribed = !!(await prisma.subscription.findFirst({
      where: {
        publisherId: blogs?.owner?.id!,
        readerId: session.userInfo.id,
      },
    }));
  }
  return (
    <div className="flex flex-col justify-center items-center ">
      <div className="mt-4 w-full lg:w-4/5 xl:w-2/5 h-[100px] flex items-center justify-between space-x-4 border border-slate-200 shadow-sm rounded-lg ">
        <div className="flex items-center space-x-4  px-4">
          {blogs?.owner?.avatar! === null ? (
            <CircleUser className="h-10 w-10 text-black " />
          ) : (
            <Avatar className="h-10 w-10">
              <AvatarImage src={blogs?.owner?.avatar!} alt="Image" />
            </Avatar>
          )}
          <div>
            <p className="text-sm font-medium leading-none">
              {blogs?.owner?.username!}
            </p>
            <p className="text-sm text-muted-foreground">
              {blogs?.owner?.email!}
            </p>
          </div>
        </div>
        <div className="px-4">
          <form
            action={async () => {
              "use server";
              await subscribe(blogs?.owner?.id!);
            }}
          >
            <Button type="submit" size="sm" aria-disabled={followAccess}>
              {isSubscribed ? "Unfollow" : "Follow"}
            </Button>
          </form>
        </div>
      </div>
      <Blogs data={blogs} />
      <div className="w-4/5 xl:w-2/5 mb-5 flex justify-start space-x-1 mt-2">
        {blogs?.tags!.map((val) => (
          <Badge variant="outline">
            <span className="p-1 text-base">{val.tag}</span>
          </Badge>
        ))}
      </div>
      <Separator className="w-4/5 xl:w-2/5 mb-5" />
      <div className="w-4/5 xl:w-2/5 flex justify-between items-center">
        <div className="flex justify-start items-center space-x-4 ">
          {blogs?.owner?.avatar! === null ? (
            <CircleUser className="h-14 w-14 text-black " />
          ) : (
            <Avatar className="h-14 w-14">
              <AvatarImage src={blogs?.owner?.avatar!} alt="Image" />
            </Avatar>
          )}
          <div>
            <p className="text-sm font-medium leading-none">
              {blogs?.owner?.username!}
            </p>
            <p className="text-sm text-muted-foreground">
              {blogs?.owner?.email!}
            </p>
          </div>
        </div>
        <form
          action={async () => {
            "use server";
            await subscribe(blogs?.owner?.id!);
          }}
          className="justify-items-end"
        >
          <Button type="submit" size="sm" aria-disabled={followAccess}>
            {isSubscribed ? "Unfollow" : "Follow"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BlogDisplay;

import { Blog } from "@/app/types";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { formatedNumber } from "@/lib/numberFormater";
import { getFirstStringFromArray } from "@/lib/utils";
import { ArrowRightIcon, CircleUser } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Like from "../../Like";
import { getSession, subscribe } from "@/app/actions";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const page = async ({ params }: { params: { userId: string } }) => {
  const session = await getSession();
  const followAccess: boolean = session ? true : false;
  const userInfo = await prisma.user.findFirst({
    where: { id: params.userId },
    select: {
      id: true,
      username: true,
      avatar: true,
      blogs: {
        select: {
          id: true,
          title: true,
          status: true,
          content: true,
          createdAt: true,
          ownerId: true,
          images: {
            select: {
              imageUrl: true,
            },
          },
          tags: {
            select: {
              tag: true,
            },
          },
          _count: {
            select: {
              likes: true,
            },
          },
        },
      },
      _count: {
        select: {
          subscriptionsAsPublisher: true,
        },
      },
    },
  });
  let isSubscribed = false;
  if (session) {
    isSubscribed = !!(await prisma.subscription.findFirst({
      where: {
        publisherId: params.userId,
        readerId: session.userInfo.id,
      },
    }));
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4 lg:px-6">
      <div className="flex flex-col items-center gap-4">
        {userInfo?.avatar! === null ? (
          <CircleUser className="h-16 w-16 text-black " />
        ) : (
          <Avatar className="h-20 w-20">
            <AvatarImage src={userInfo?.avatar!} alt="Image" />
          </Avatar>
        )}
        <div className="text-3xl font-bold">{userInfo?.username}</div>
        <div className="text-muted-foreground">
          {formatedNumber.format(userInfo?._count.subscriptionsAsPublisher!) +
            " "}
          Followers
        </div>
        <form
          action={async () => {
            "use server";
            await subscribe(params.userId);
          }}
        >
          <Button
            type="submit"
            size="sm"
            disabled={!followAccess}
            aria-label="followAccess"
          >
            {isSubscribed ? "Unfollow" : "Follow"}
          </Button>
        </form>
      </div>
      <div className="w-full max-w-2xl space-y-6">
        <h2 className="text-2xl font-semibold">Latest Blog Posts</h2>
        <div className="grid gap-4 md:grid-cols-1">
          {userInfo!.blogs.length === 0 ? (
            <span>No blogs Published</span>
          ) : (
            userInfo?.blogs.map((val: Blog) => (
              <Link
                href={`/blogs/${val.title}`}
                className="group flex flex-col md:flex-row items-center gap-4 rounded-lg bg-muted p-4 transition-colors hover:bg-muted/50"
                prefetch={false}
                key={val.id}
              >
                <Image
                  src={val.images[0].imageUrl}
                  alt="Blog Post Image"
                  width={180}
                  height={120}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="font-medium group-hover:underline">
                    {val?.title?.charAt(0).toUpperCase()! +
                      val?.title?.slice(1).replaceAll("-", " ")!}
                  </div>
                  <div className="text-muted-foreground line-clamp-3">
                    {getFirstStringFromArray(val.content, "paragraph")}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Like blogId={val.id} />
                    <div className="text-muted-foreground">
                      {formatedNumber.format(val._count?.likes!)}
                    </div>
                  </div>
                </div>
                <ArrowRightIcon className="h-6 w-6 text-muted-foreground" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default page;

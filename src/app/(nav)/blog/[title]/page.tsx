import prisma from "@/lib/db";
import dynamic from "next/dynamic";
import { getSession, subscribe } from "@/app/actions";
import { CircleUser, MessageSquareText } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Blog } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BlogNotFound } from "@/lib/exceptions";
import { Badge } from "@/components/ui/badge";
import Like from "../../Like";
import { formatedNumber } from "@/lib/numberFormater";
import { Icons } from "@/components/icons";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { HoverCard } from "@/components/ui/hover-card";
import EditorJsRenderer from "../../(protectedRoutes)/EditorJsRenderer";
const ShareButton = dynamic(() => import("../Share"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen flex justify-center items-center">
      <Icons.spinner className="mr-2 h-12 w-12 animate-spin" />
    </div>
  ),
});
const CommentForm = dynamic(() => import("../CommentForm"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen flex justify-center items-center">
      <Icons.spinner className="mr-2 h-12 w-12 animate-spin" />
    </div>
  ),
});
const Page = async ({ params }: { params: { title: string } }) => {
  const session = await getSession();
  const followAccess: boolean = session ? true : false;
  const blogs: Blog | null = await prisma.blog.findFirst({
    where: { title: params.title },
    include: {
      owner: true,
      tags: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      comments: {
        select: {
          owner: true,
          comment: true,
          id: true,
        },
      },
    },
  });
  const tags = blogs?.tags!;
  const comments = blogs?.comments!;
  const title =
    blogs?.title.charAt(0).toUpperCase()! +
    blogs?.title.slice(1).replaceAll("-", " ")!;
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
            <Button type="submit" size="sm" disabled={!followAccess}>
              {isSubscribed ? "Unfollow" : "Follow"}
            </Button>
          </form>
        </div>
      </div>
      <div className="w-4/5 xl:w-2/5 mt-2 font-serif">
        <EditorJsRenderer data={blogs?.content} title={title} />
      </div>
      <div className="w-4/5 xl:w-2/5 flex-col sm:flex justify-between">
        <div className="mb-5 flex justify-start space-x-1 mt-2">
          {tags.length > 0 ? (
            tags.map((val: { tag: string }, index: number) => (
              <Badge variant="outline" key={index}>
                <p className="p-1 text-base">{val.tag}</p>
              </Badge>
            ))
          ) : (
            <></>
          )}
        </div>
        <div className="mb-5 flex justify-between items-center mt-2">
          <div className="flex space-x-4">
            <div className="flex items-center text-sm font-medium leading-none space-x-1">
              <div>
                <Like blogId={blogs?.id} />
              </div>
              <p className="text-xs">
                {formatedNumber.format(blogs?._count?.likes!)}
              </p>
            </div>
            <div className="flex items-center text-sm font-medium leading-none space-x-1">
              <div>
                <Sheet>
                  <SheetTrigger className="flex items-center" asChild>
                    <Button variant="ghost" size="icon">
                      <MessageSquareText color="#374151" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Comments</SheetTitle>
                      <SheetDescription>Share us a feedback!</SheetDescription>
                    </SheetHeader>
                    <CommentForm disabled={followAccess} blogId={blogs?.id} />
                    <div className="flex flex-col">
                      {comments.length > 0 ? (
                        blogs?.comments?.map((val) => (
                          <div key={val.id} className="flex mt-4 items-center">
                            {val.owner.avatar! === null ? (
                              <CircleUser className="h-10 w-10 text-black " />
                            ) : (
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={val.owner.avatar}
                                  alt="Image"
                                />
                              </Avatar>
                            )}
                            <div className="ml-2">{val.comment}</div>
                          </div>
                        ))
                      ) : (
                        <></>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <p className="text-xs">
                {formatedNumber.format(blogs?._count?.comments!)}
              </p>
            </div>
          </div>
          <div className="flex justify-items-end">
            <ShareButton />
          </div>
        </div>
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
          <Button type="submit" size="sm" disabled={!followAccess}>
            <HoverCard>{isSubscribed ? "Unfollow" : "Follow"}</HoverCard>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Page;

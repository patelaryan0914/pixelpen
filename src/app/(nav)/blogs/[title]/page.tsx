import prisma from "@/lib/db";
import { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";
export async function generateStaticParams() {
  const blog = await prisma.blog.findMany({
    select: { title: true },
    cacheStrategy: { swr: 300, ttl: 300 },
  });
  return blog.slice(0, 3);
}
const getBlogDetails = cache(async (title: string) => {
  const blog: Blog | null = await prisma.blog.findFirst({
    where: { title: title },
    include: {
      owner: true,
      tags: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      images: {
        select: {
          imageUrl: true,
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
    cacheStrategy: { swr: 300, ttl: 300 },
  });
  if (!blog) throw new BlogNotFound();
  return blog;
});

export async function generateMetadata(
  { params }: { params: { title: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const title = params.title;

  // fetch data
  const blog = await getBlogDetails(title);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title:
      blog?.title.charAt(0).toUpperCase()! +
      blog?.title.slice(1).replaceAll("-", " ")!,
    openGraph: {
      images: [{ url: blog?.images[0].imageUrl! as string }, ...previousImages],
    },
  };
}
import dynamic from "next/dynamic";
import { getSession, subscribe } from "@/app/actions";
import { CircleUser, MessageSquareText } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Blog } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { notFound } from "next/navigation";
import { BlogNotFound } from "@/lib/exceptions";
import { NextRequest } from "next/server";

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
const Page = async ({
  params,
  req,
}: {
  params: { title: string };
  req: NextRequest;
}) => {
  const session = await getSession();
  const followAccess: boolean = session ? true : false;
  const blog = await getBlogDetails(params.title);
  const tags = blog?.tags!;
  const comments = blog?.comments!;
  const title =
    blog?.title.charAt(0).toUpperCase()! +
    blog?.title.slice(1).replaceAll("-", " ")!;
  if (!blog) notFound();
  let isSubscribed = false;
  const blogId = blog.id;
  const ipAddress =
    req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");
  const userAgent = req.headers.get("user-agent");
  console.log(blogId, ipAddress, userAgent);

  if (session) {
    isSubscribed = !!(await prisma.subscription.findFirst({
      where: {
        publisherId: blog?.owner?.id!,
        readerId: session.userInfo.id,
      },
    }));
  }
  return (
    <div className="flex flex-col justify-center items-center ">
      <div className="mt-4 w-full lg:w-4/5 xl:w-2/5 h-[100px] flex items-center justify-between space-x-4 border border-slate-200 shadow-sm rounded-lg ">
        <div className="flex items-center space-x-4  px-4">
          {blog?.owner?.avatar! === null ? (
            <CircleUser className="h-10 w-10 text-black " />
          ) : (
            <Avatar className="h-10 w-10">
              <AvatarImage src={blog?.owner?.avatar!} alt="Image" />
            </Avatar>
          )}
          <div>
            <p className="text-sm font-medium leading-none">
              {blog?.owner?.username!}
            </p>
            <p className="text-sm text-muted-foreground">
              {blog?.owner?.email!}
            </p>
          </div>
        </div>
        <div className="px-4">
          <form
            action={async () => {
              "use server";
              await subscribe(blog?.owner?.id!);
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
      </div>
      <div className="w-4/5 xl:w-2/5 mt-2 font-serif">
        <EditorJsRenderer data={blog?.content} title={title} />
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
                <Like blogId={blog?.id} />
              </div>
              <p className="text-xs">
                {formatedNumber.format(blog?._count?.likes!)}
              </p>
            </div>
            <div className="flex items-center text-sm font-medium leading-none space-x-1">
              <div>
                <Sheet>
                  <SheetTrigger className="flex items-center" asChild>
                    <Button variant="ghost" size="icon" aria-label="comment">
                      <MessageSquareText color="#374151" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Comments</SheetTitle>
                      <SheetDescription>Share us a feedback!</SheetDescription>
                    </SheetHeader>
                    <CommentForm disabled={followAccess} blogId={blog?.id} />
                    <div className="flex flex-col">
                      {comments.length > 0 ? (
                        blog?.comments?.map((val) => (
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
                {formatedNumber.format(blog?._count?.comments!)}
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
          {blog?.owner?.avatar! === null ? (
            <CircleUser className="h-14 w-14 text-black " />
          ) : (
            <Avatar className="h-14 w-14">
              <AvatarImage src={blog?.owner?.avatar!} alt="Image" />
            </Avatar>
          )}
          <div>
            <p className="text-sm font-medium leading-none">
              {blog?.owner?.username!}
            </p>
            <p className="text-sm text-muted-foreground">
              {blog?.owner?.email!}
            </p>
          </div>
        </div>
        <form
          action={async () => {
            "use server";
            await subscribe(blog?.owner?.id!);
          }}
          className="justify-items-end"
        >
          <Button
            type="submit"
            size="sm"
            disabled={!followAccess}
            aria-label="follow"
          >
            <HoverCard>{isSubscribed ? "Unfollow" : "Follow"}</HoverCard>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Page;

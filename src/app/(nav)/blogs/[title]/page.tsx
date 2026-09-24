import prisma from "@/lib/db";
import { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";
import { publicStoryWhere } from "@/lib/stories";

export const revalidate = 60;
export const dynamicParams = true;

const getBlogDetails = cache(async (title: string) => {
  return prisma.blog.findFirst({
    where: { OR: [{ slug: title }, { title }] },
    select: {
      id: true,
      ownerId: true,
      title: true,
      headline: true,
      slug: true,
      description: true,
      coverUrl: true,
      content: true,
      status: true,
      publishAt: true,
      createdAt: true,
      owner: { select: { id: true, username: true, avatar: true, bio: true } },
      series: { select: { id: true, title: true } },
      tags: { select: { tag: true } },
      images: { select: { imageUrl: true } },
      comments: {
        select: {
          id: true,
          comment: true,
          owner: { select: { avatar: true, username: true } },
        },
      },
      _count: { select: { likes: true, comments: true } },
    },
  });
});

export async function generateStaticParams() {
  try {
    const blogs = await prisma.blog.findMany({
      where: publicStoryWhere(),
      select: { title: true, slug: true },
    });
    return blogs.map((blog) => ({ title: blog.slug || blog.title }));
  } catch {
    return [];
  }
}
export async function generateMetadata(
  { params }: { params: { title: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const title = params.title;

  // fetch data
  const blog = await getBlogDetails(title);
  if (!blog) return { title: "Story" };

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  const label =
    blog?.headline?.trim() ||
    blog?.title.charAt(0).toUpperCase()! +
      blog?.title.slice(1).replaceAll("-", " ")!;
  const cover = blog?.coverUrl || blog?.images?.[0]?.imageUrl;

  return {
    title: label,
    description: blog?.description || undefined,
    openGraph: {
      title: label,
      description: blog?.description || undefined,
      images: cover ? [{ url: cover }, ...previousImages] : previousImages,
    },
  };
}
import dynamic from "next/dynamic";
import { CircleUser, MessageSquareText } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import LikeButton from "../../LikeButton";
import FollowButton from "../../FollowButton";
import { formatedNumber } from "@/lib/numberFormater";
import { storyPath, storyTitle } from "@/lib/utils";
import RecordVisit from "@/components/record-visit";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import TiptapRenderer from "@/components/tiptap/TiptapRenderer";
import ReadingProgress from "@/components/reading-progress";
import Link from "next/link";
import { notFound } from "next/navigation";

const ShareButton = dynamic(() => import("../Share"), {
  ssr: false,
});
const CommentForm = dynamic(() => import("../CommentForm"), {
  ssr: false,
});

const Page = async ({ params }: { params: { title: string } }) => {
  const blog = await getBlogDetails(params.title);
  if (!blog) notFound();
  const tags = blog.tags;
  const comments = blog.comments;
  const title = storyTitle(blog);
  const isLive =
    blog.status === "Published" ||
    (blog.status === "Scheduled" &&
      !!blog.publishAt &&
      new Date(blog.publishAt).getTime() <= Date.now());
  if (!isLive) notFound();

  const tagNames = tags.map((tag) => tag.tag);
  const [related, seriesStories] = await Promise.all([
    tagNames.length
      ? prisma.blog.findMany({
          where: {
            AND: [
              publicStoryWhere(),
              { id: { not: blog.id } },
              { tags: { some: { tag: { in: tagNames } } } },
            ],
          },
          take: 3,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            headline: true,
            slug: true,
            owner: { select: { username: true } },
          },
        })
      : Promise.resolve([]),
    blog.series?.id
      ? prisma.blog.findMany({
          where: {
            seriesId: blog.series.id,
            ...publicStoryWhere(),
          },
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            title: true,
            headline: true,
            slug: true,
          },
        })
      : Promise.resolve([]),
  ]);
  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-10 md:px-8">
      <ReadingProgress />
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link
          href={`/profile/${blog?.owner?.id}`}
          className="flex items-center gap-3"
        >
          {blog?.owner?.avatar ? (
            <Avatar className="h-11 w-11">
              <AvatarImage src={blog.owner.avatar} alt="" />
            </Avatar>
          ) : (
            <CircleUser className="h-11 w-11 text-muted-foreground" />
          )}
          <div>
            <p className="text-sm font-semibold">{blog?.owner?.username}</p>
            {blog?.owner?.bio && (
              <p className="line-clamp-1 max-w-xs text-xs text-muted-foreground">
                {blog.owner.bio}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {blog?.createdAt
                ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : ""}
            </p>
          </div>
        </Link>
        <FollowButton publisherId={blog.ownerId} variant="outline" />
      </div>

      <TiptapRenderer doc={blog?.content as any} title={title} />

      {tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {tags.map((val: { tag: string }, index: number) => (
            <Badge variant="outline" key={index} className="rounded-full">
              {val.tag}
            </Badge>
          ))}
        </div>
      )}

      <RecordVisit blogId={blog.id} />
      <div className="mt-6 flex items-center justify-between border-y py-3">
        <div className="flex items-center gap-3">
          <LikeButton
            blogId={blog.id}
            count={blog._count?.likes ?? 0}
            checkLiked
          />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="comment">
                <MessageSquareText className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Comments</SheetTitle>
                <SheetDescription>Share a note with the writer.</SheetDescription>
              </SheetHeader>
              <CommentForm blogId={blog.id} />
              <div className="mt-4 flex flex-col gap-4">
                {comments.length > 0
                  ? blog?.comments?.map((val) => (
                      <div key={val.id} className="flex items-start gap-3">
                        {val.owner.avatar ? (
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={val.owner.avatar} alt="" />
                          </Avatar>
                        ) : (
                          <CircleUser className="h-9 w-9 text-muted-foreground" />
                        )}
                        <p className="text-sm leading-6">{val.comment}</p>
                      </div>
                    ))
                  : (
                    <p className="text-sm text-muted-foreground">
                      No comments yet.
                    </p>
                  )}
              </div>
            </SheetContent>
          </Sheet>
          <span className="text-xs text-muted-foreground">
            {formatedNumber.format(blog?._count?.comments!)}
          </span>
        </div>
        <ShareButton />
      </div>

      <Separator className="my-8" />

      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/profile/${blog?.owner?.id}`}
          className="flex items-center gap-4"
        >
          {blog?.owner?.avatar ? (
            <Avatar className="h-14 w-14">
              <AvatarImage src={blog.owner.avatar} alt="" />
            </Avatar>
          ) : (
            <CircleUser className="h-14 w-14 text-muted-foreground" />
          )}
          <div>
            <p className="font-serif text-lg font-medium">
              {blog?.owner?.username}
            </p>
            <p className="text-sm text-muted-foreground">
              {blog.owner?.bio || "More stories from this writer"}
            </p>
          </div>
        </Link>
        <FollowButton publisherId={blog.ownerId} />
      </div>

      {seriesStories.length > 1 && (
        <section className="mt-12">
          <h2 className="font-serif text-2xl font-medium">
            Part of {blog.series?.title}
          </h2>
          <ol className="mt-4 divide-y border-t">
            {seriesStories.map((story, index) => (
              <li key={story.id}>
                <Link href={storyPath(story)} className="flex gap-4 py-4">
                  <span className="w-14 shrink-0 text-sm text-muted-foreground">
                    Part {index + 1}
                  </span>
                  <span
                    className={
                      story.id === blog.id
                        ? "font-serif text-lg text-primary"
                        : "font-serif text-lg hover:text-primary"
                    }
                  >
                    {storyTitle(story)}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-2xl font-medium">More on this topic</h2>
          <div className="mt-4 divide-y border-t">
            {related.map((story) => (
              <Link key={story.id} href={storyPath(story)} className="block py-4">
                <p className="text-xs text-muted-foreground">
                  {story.owner?.username}
                </p>
                <p className="font-serif text-lg hover:text-primary">
                  {storyTitle(story)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};

export default Page;

import prisma from "@/lib/db";
import { getSession } from "@/app/actions";
import FeedStoryCard from "../../FeedStoryCard";
import Link from "next/link";
import { publicStoryWhere, readerFlags } from "@/lib/stories";

export default async function Page() {
  const session = await getSession();
  if (!session) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 text-center">
        <h2 className="font-serif text-2xl font-medium">
          Sign in to see writers you follow
        </h2>
        <Link href="/signin" className="text-sm text-primary hover:underline">
          Sign in →
        </Link>
      </div>
    );
  }

  const subscriptions = await prisma.subscription.findMany({
    where: { readerId: session.userInfo.id },
    select: { publisherId: true },
  });
  const publisherIds = subscriptions.map((item) => item.publisherId);

  const blogs =
    publisherIds.length === 0
      ? []
      : await prisma.blog.findMany({
          where: {
            AND: [publicStoryWhere(), { ownerId: { in: publisherIds } }],
          },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            headline: true,
            slug: true,
            description: true,
            coverUrl: true,
            content: true,
            createdAt: true,
            owner: {
              select: { id: true, username: true, avatar: true, bio: true },
            },
            images: { select: { imageUrl: true } },
            tags: { select: { tag: true } },
            series: { select: { title: true } },
            _count: { select: { likes: true, comments: true } },
          },
        });

  if (blogs.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 text-center">
        <h2 className="font-serif text-2xl font-medium">
          Follow writers to fill this feed
        </h2>
        <Link href="/" className="text-sm text-primary hover:underline">
          Discover stories →
        </Link>
      </div>
    );
  }

  const flags = await readerFlags(
    session.userInfo.id,
    blogs.map((blog) => blog.id)
  );

  return (
    <div>
      <div className="border-b pb-4">
        <h1 className="font-serif text-3xl font-medium">Following</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          New stories from writers you follow.
        </p>
        <Link href="/" className="mt-3 inline-block text-sm text-primary">
          All stories
        </Link>
      </div>
      <div className="divide-y">
      {blogs.map((blog) => (
        <FeedStoryCard
          key={blog.id}
          data={{
            ...blog,
            bookmarked: flags.saved.has(blog.id),
            liked: flags.liked.has(blog.id),
          }}
        />
      ))}
      </div>
    </div>
  );
}

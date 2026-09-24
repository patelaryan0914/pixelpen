import Link from "next/link";
import prisma from "@/lib/db";
import { getSession } from "@/app/actions";
import { redirect } from "next/navigation";
import { PageHeader, PageShell } from "@/components/page-shell";
import FeedStoryCard from "../(landing)/FeedStoryCard";
import { readerFlags } from "@/lib/stories";

export const metadata = {
  title: "Reading list",
};

export default async function SavedPage() {
  const session = await getSession();
  if (!session) redirect("/signin");

  const bookmarks = await prisma.bookmark.findMany({
    where: { ownerId: session.userInfo.id },
    orderBy: { createdAt: "desc" },
    select: {
      blog: {
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
      },
    },
  });

  const flags = await readerFlags(
    session.userInfo.id,
    bookmarks.map(({ blog }) => blog.id)
  );

  return (
    <PageShell narrow>
      <PageHeader
        title="Reading list"
        description="Stories you saved to come back to."
      />
      {bookmarks.length > 0 ? (
        <div className="divide-y">
          {bookmarks.map(({ blog }) => (
            <FeedStoryCard
              key={blog.id}
              data={{
                ...blog,
                bookmarked: true,
                liked: flags.liked.has(blog.id),
              }}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Nothing saved yet. Tap the bookmark on a story to keep it here.
          </p>
          <Link href="/" className="mt-3 inline-block text-sm text-primary">
            Browse stories →
          </Link>
        </div>
      )}
    </PageShell>
  );
}

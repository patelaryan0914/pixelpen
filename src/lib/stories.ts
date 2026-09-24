import prisma from "@/lib/db";

export function publicStoryWhere(now = new Date()) {
  return {
    OR: [
      { status: "Published" as const },
      { status: "Scheduled" as const, publishAt: { lte: now } },
    ],
  };
}

export async function readerFlags(userId: string | undefined, blogIds: string[]) {
  if (!userId || blogIds.length === 0) {
    return { saved: new Set<string>(), liked: new Set<string>() };
  }
  const [bookmarks, likes] = await Promise.all([
    prisma.bookmark.findMany({
      where: { ownerId: userId, blogId: { in: blogIds } },
      select: { blogId: true },
    }),
    prisma.like.findMany({
      where: { ownerId: userId, blogId: { in: blogIds } },
      select: { blogId: true },
    }),
  ]);
  return {
    saved: new Set(bookmarks.map((item) => item.blogId)),
    liked: new Set(likes.map((item) => item.blogId)),
  };
}

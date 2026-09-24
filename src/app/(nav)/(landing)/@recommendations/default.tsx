import prisma from "@/lib/db";
import { getSession } from "@/app/actions";
import FeedClient from "../FeedClient";
import type { FeedBlog } from "../FeedStoryCard";
import { publicStoryWhere, readerFlags } from "@/lib/stories";
import { Suspense } from "react";

const feedSelect = {
  id: true,
  title: true,
  headline: true,
  slug: true,
  description: true,
  coverUrl: true,
  status: true,
  content: true,
  createdAt: true,
  ownerId: true,
  owner: {
    select: { id: true, username: true, avatar: true, bio: true },
  },
  images: { select: { imageUrl: true } },
  tags: { select: { tag: true } },
  series: { select: { title: true } },
  _count: { select: { likes: true, comments: true } },
} as const;

const page = async () => {
  const session = await getSession();
  const [blogs, tags] = await Promise.all([
    prisma.blog.findMany({
      where: publicStoryWhere(),
      orderBy: { createdAt: "desc" },
      take: 24,
      select: feedSelect,
    }),
    prisma.tag.findMany({ select: { tag: true }, take: 12 }),
  ]);

  const flags = await readerFlags(
    session?.userInfo.id,
    blogs.map((blog) => blog.id)
  );
  const feed = blogs.map((blog) => ({
    ...blog,
    bookmarked: flags.saved.has(blog.id),
    liked: flags.liked.has(blog.id),
  }));

  return (
    <Suspense>
      <FeedClient blogs={feed as FeedBlog[]} topics={tags.map((t) => t.tag)} />
    </Suspense>
  );
};

export default page;

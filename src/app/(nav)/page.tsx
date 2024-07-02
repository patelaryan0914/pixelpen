import RecommendationCard from "@/components/RecommendationCard";
import prisma from "@/lib/db";
import { Blog } from "../types";
export default async function Home() {
  const findBlogs = await prisma.blog.findMany({
    where: { status: "Published" },
    take: 4,
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
          comments: true,
        },
      },
    },
  });
  return (
    <div className="flex min-h-screen flex-col items-center justify-start">
      {findBlogs.map((blog: Blog) => (
        <RecommendationCard data={blog} key={blog.id} />
      ))}
    </div>
  );
}

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
    <div className="flex h-screen flex-col items-center justify-start">
      <div className="h-full grid w-full grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 ">
        {findBlogs.map((blog: Blog) => (
          <RecommendationCard data={blog} key={blog.id} />
        ))}
      </div>
    </div>
  );
}

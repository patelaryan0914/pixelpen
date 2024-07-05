import prisma from "@/lib/db";
import RecommendationCard from "../../RecommendationCard";
import { Blog } from "@/app/types";
export default async function Page({ params }: { params: { tag: string } }) {
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
    <>
      {findBlogs.map((blog: Blog) => (
        <RecommendationCard data={blog} key={blog.id} />
      ))}
    </>
  );
}

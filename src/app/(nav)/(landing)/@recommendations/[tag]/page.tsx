import prisma from "@/lib/db";
import RecommendationCard from "../../RecommendationCard";
import { Blog } from "@/app/types";
export default async function Page({ params }: { params: { tag: string } }) {
  const findBlogs = await prisma.tag.findMany({
    where: { tag: params.tag },
    select: {
      id: true,
      blog: {
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
      },
    },
    cacheStrategy: { swr: 60, ttl: 60 },
  });
  return (
    <>
      {findBlogs.map(({ id, blog }: { id: string; blog: Blog }) => (
        <RecommendationCard data={blog} key={id} />
      ))}
    </>
  );
}

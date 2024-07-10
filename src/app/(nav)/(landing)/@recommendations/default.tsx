import { Blog } from "@/app/types";
import RecommendationCard from "../RecommendationCard";
import prisma from "@/lib/db";
import NavigationBarForBlogs from "../NavigationBarForBlogs";
import { Separator } from "@/components/ui/separator";
const page = async () => {
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
    <div>
      <NavigationBarForBlogs />
      <Separator />
      {findBlogs.map((blog: Blog) => (
        <RecommendationCard data={blog} key={blog.id} />
      ))}
    </div>
  );
};

export default page;

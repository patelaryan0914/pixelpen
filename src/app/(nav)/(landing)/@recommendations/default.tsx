import { Blog } from "@/app/types";
import RecommendationCard from "../RecommendationCard";
import prisma from "@/lib/db";
import NavigationBarForBlogs from "../NavigationBarForBlogs";
import { Separator } from "@/components/ui/separator";

// Helper function to shuffle and get a random subset of blogs
const getRandomBlogs = (blogs: Blog[], count: number) => {
  const shuffled = blogs.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const page = async () => {
  // Fetch all published blogs
  const allBlogs = await prisma.blog.findMany({
    where: { status: "Published" },
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

  // Get a random subset of 4 blogs
  const findBlogs = getRandomBlogs(allBlogs, 4);

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

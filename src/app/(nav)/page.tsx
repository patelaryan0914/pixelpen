import RecommendationCard from "@/components/RecommendationCard";
import prisma from "@/lib/db";
import { Blog } from "../types";
import Link from "next/link";
export default async function Home() {
  const findBlogs = await prisma.blog.findMany({
    where: { status: "Published" },
    take: 4,
  });
  return (
    <div className="flex min-h-screen flex-col items-center justify-start">
      {findBlogs.map((blog: Blog) => (
        <Link key={blog.id} href={`/blog/${blog.title}`} className="w-full">
          <RecommendationCard data={blog} />
        </Link>
      ))}
    </div>
  );
}

import RecommendationCard from "@/components/RecommendationCard";
import prisma from "@/lib/db";
import { Blog } from "../types";
import Link from "next/link";
export default async function Home() {
  const findBlogs = await prisma.blog.findMany({
    take: 4,
  });
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {findBlogs.map((blog: Blog) => (
        <Link href={`/blog/${blog.title}`}>
          <RecommendationCard key={blog.id} data={blog} />
        </Link>
      ))}
    </main>
  );
}

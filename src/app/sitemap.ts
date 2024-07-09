import prisma from "@/lib/db";
import { MetadataRoute } from "next";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blog = await prisma.blog.findMany({
    select: { title: true, updatedAt: true },
    cacheStrategy: { swr: 300, ttl: 300 },
  });
  const blogPost: MetadataRoute.Sitemap = blog.map(({ title, updatedAt }) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${title}`,
    lastModified: new Date(updatedAt),
  }));

  return [
    { url: `${process.env.NEXT_PUBLIC_BASE_URL}/signin` },
    { url: `${process.env.NEXT_PUBLIC_BASE_URL}/signup` },
    { url: `${process.env.NEXT_PUBLIC_BASE_URL}/userInfo` },
    { url: `${process.env.NEXT_PUBLIC_BASE_URL}/manage-blog` },
    { url: `${process.env.NEXT_PUBLIC_BASE_URL}/publish-blog` },
    { url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings` },
    ...blogPost,
  ];
}

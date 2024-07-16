import prisma from "@/lib/db";
import { MetadataRoute } from "next";
import NodeCache from "node-cache";

const sitemapCache = new NodeCache({ stdTTL: 600 });

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cacheKey = "sitemap";
  const cachedSitemap = sitemapCache.get<MetadataRoute.Sitemap>(cacheKey);

  if (cachedSitemap) {
    return cachedSitemap;
  }

  try {
    const blog = await prisma.blog.findMany({
      select: { title: true, updatedAt: true },
    });
    const users = await prisma.user.findMany({
      select: { id: true, createdAt: true },
    });
    const blogPost: MetadataRoute.Sitemap = blog.map(
      ({ title, updatedAt }) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${title}`,
        lastModified: new Date(updatedAt),
      })
    );
    const userProfile: MetadataRoute.Sitemap = users.map(
      ({ id, createdAt }) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile/${id}`,
        lastModified: new Date(createdAt),
      })
    );

    const sitemap: MetadataRoute.Sitemap = [
      { url: `${process.env.NEXT_PUBLIC_BASE_URL}/signin` },
      { url: `${process.env.NEXT_PUBLIC_BASE_URL}/signup` },
      { url: `${process.env.NEXT_PUBLIC_BASE_URL}/userInfo` },
      { url: `${process.env.NEXT_PUBLIC_BASE_URL}/manage-blog` },
      { url: `${process.env.NEXT_PUBLIC_BASE_URL}/publish-blog` },
      { url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings` },
      ...blogPost,
      ...userProfile,
    ];

    sitemapCache.set(cacheKey, sitemap);

    return sitemap;
  } catch (error) {
    console.error("Failed to generate sitemap:", error);
    throw new Error("Failed to generate sitemap");
  }
}

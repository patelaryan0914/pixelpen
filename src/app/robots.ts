import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/posgres",
        "/settings",
        "/settings/account",
        "/settings/appearance",
        "/settings/notifications",
        "/settings/display",
        "/api",
        "/_next",
      ],
    },
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  };
}

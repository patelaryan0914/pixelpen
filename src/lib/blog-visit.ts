import { headers } from "next/headers";
import prisma from "@/lib/db";

export async function recordBlogVisit(blogId: string) {
  try {
    const headerStore = headers();
    let ipAddress =
      headerStore.get("x-forwarded-for") ||
      headerStore.get("x-real-ip") ||
      "unknown";
    if (ipAddress.includes(",")) {
      ipAddress =
        ipAddress.split(",").find((ip) => ip.includes(".")) || ipAddress;
    }

    await prisma.blogVisit.create({
      data: {
        blogId,
        ipAddress,
        userAgent: headerStore.get("user-agent") || "unknown",
      },
    });
  } catch (error) {
    console.error("Error recording blog visit:", error);
  }
}

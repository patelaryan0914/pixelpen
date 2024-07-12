import { NextRequest } from "next/server";
import { getSession, updateSession } from "./app/actions";
import { AuthRequiredError } from "./lib/exceptions";
import prisma from "./lib/db";

export async function middleware(request: NextRequest) {
  const session = getSession();
  if (!session) throw new AuthRequiredError("Session Experied Login Again");

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/blogs/")) {
    const title = pathname.split("/blogs/")[1];
    let ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      request.ip;

    if (ipAddress && ipAddress.includes(",")) {
      ipAddress = ipAddress.split(",").find((ip) => ip.includes("."));
    }

    const userAgent = request.headers.get("user-agent");

    if (process.env.NEXT_ENV === "production") {
      const blogId = await prisma.blog.findFirst({
        where: { title },
        select: { id: true },
      });
      await prisma.blogVisit.create({
        data: {
          blogId: blogId?.id!,
          ipAddress: ipAddress as string,
          userAgent: userAgent as string,
        },
      });
    }
  }
  return await updateSession(request);
}

export const config = {
  matcher: ["/blogs/:path*", "/:path*"], // Specify routes where middleware should be applied
};

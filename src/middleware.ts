import { NextRequest } from "next/server";
import { getSession, updateSession } from "./app/actions";
import { AuthRequiredError } from "./lib/exceptions";
import prisma from "./lib/db";

export async function middleware(request: NextRequest) {
  const session = getSession();
  if (!session) {
    throw new AuthRequiredError("Session Expired. Login Again");
  }

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
    if (process.env.NEXT_ENV == "production") {
      try {
        const blog = await prisma.blog.findFirst({
          where: { title },
          select: { id: true },
        });
        if (blog) {
          await prisma.blogVisit.create({
            data: {
              blogId: blog.id,
              ipAddress: ipAddress || "unknown",
              userAgent: userAgent || "unknown",
            },
          });
        }
      } catch (error) {
        console.error("Error recording blog visit:", error);
      }
    } else {
      console.log("Not running in production environment");
    }
  }

  try {
    return await updateSession(request);
  } catch (error) {
    console.error("Error updating session:", error);
    throw error;
  }
}

export const config = {
  matcher: ["/blogs/:path*", "/:path*"], // Specify routes where middleware should be applied
};

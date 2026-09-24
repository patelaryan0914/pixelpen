import { NextRequest } from "next/server";
import { updateSession } from "./lib/session";

export async function middleware(request: NextRequest) {
  try {
    return await updateSession(request);
  } catch (error) {
    console.error("Error updating session:", error);
    throw error;
  }
}

export const config = {
  matcher: ["/blogs/:path*", "/:path*"],
};

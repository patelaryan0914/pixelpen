import { publishTechPosts } from "@/lib/publish-tech-posts";
import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!secret || token.length !== secret.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(secret));
}

function easternHour() {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      hourCycle: "h23",
    }).format(new Date())
  );
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const hour = easternHour();
  if (hour !== 6 && hour !== 18) {
    return NextResponse.json({ skipped: true, hour });
  }
  try {
    const result = await publishTechPosts(1);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Could not publish stories.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

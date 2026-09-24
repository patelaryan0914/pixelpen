import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { blogId } = await req.json();
    if (!blogId || typeof blogId !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    let ipAddress = req.headers.get("x-forwarded-for") || "unknown";
    if (ipAddress.includes(",")) {
      ipAddress =
        ipAddress.split(",").find((ip) => ip.includes(".")) || ipAddress;
    }

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existing = await prisma.blogVisit.findFirst({
      where: { blogId, ipAddress, visitedAt: { gte: since } },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ ok: true, counted: false });
    }

    await prisma.blogVisit.create({
      data: {
        blogId,
        ipAddress,
        userAgent: req.headers.get("user-agent") || "unknown",
      },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

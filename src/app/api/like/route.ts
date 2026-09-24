import { getSession } from "@/app/actions";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getSession();
  const blogId = req.nextUrl.searchParams.get("blogId");
  if (!session || !blogId) {
    return NextResponse.json({ liked: false });
  }
  const existing = await prisma.like.findFirst({
    where: { blogId, ownerId: session.userInfo.id },
    select: { id: true },
  });
  return NextResponse.json({ liked: Boolean(existing) });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ liked: false }, { status: 401 });
    }
    const { blogId } = await req.json();
    if (!blogId || typeof blogId !== "string") {
      return NextResponse.json({ liked: false }, { status: 400 });
    }

    const existing = await prisma.like.findFirst({
      where: { blogId, ownerId: session.userInfo.id },
      select: { id: true },
    });
    if (!existing) {
      await prisma.like.create({
        data: { blogId, ownerId: session.userInfo.id },
      });
      return NextResponse.json({ liked: true });
    }
    await prisma.like.delete({ where: { id: existing.id } });
    return NextResponse.json({ liked: false });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ liked: false }, { status: 500 });
  }
}

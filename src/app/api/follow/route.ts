import { getSession } from "@/app/actions";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getSession();
  const publisherId = req.nextUrl.searchParams.get("publisherId");
  if (!session || !publisherId) {
    return NextResponse.json({
      following: false,
      signedIn: Boolean(session),
    });
  }
  const row = await prisma.subscription.findFirst({
    where: { publisherId, readerId: session.userInfo.id },
    select: { id: true },
  });
  return NextResponse.json({ following: Boolean(row), signedIn: true });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ following: false }, { status: 401 });
    }
    const { publisherId } = await req.json();
    if (!publisherId || typeof publisherId !== "string") {
      return NextResponse.json({ following: false }, { status: 400 });
    }
    const existing = await prisma.subscription.findFirst({
      where: { publisherId, readerId: session.userInfo.id },
      select: { id: true },
    });
    if (!existing) {
      await prisma.subscription.create({
        data: { publisherId, readerId: session.userInfo.id },
      });
      return NextResponse.json({ following: true });
    }
    await prisma.subscription.delete({ where: { id: existing.id } });
    return NextResponse.json({ following: false });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ following: false }, { status: 500 });
  }
}

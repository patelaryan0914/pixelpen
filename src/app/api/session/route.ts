import { getSession } from "@/app/actions";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session?.userInfo) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: {
      id: session.userInfo.id,
      username: session.userInfo.username,
      avatar: session.userInfo.avatar,
    },
  });
}

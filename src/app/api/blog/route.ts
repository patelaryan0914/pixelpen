import { getSession } from "@/app/actions";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    // const session = await getSession();
    const { content, title, status } = await req.json();

    const publish = await prisma.blog.create({
      data: {
        ownerId: "240e8624-0af9-4b36-8c3a-2d29acc52f83",
        content,
        title,
        status,
      },
    });
    return NextResponse.json({ message: "Publised", publish }, { status: 200 });
  } catch (error: any) {
    console.error(`Error during compilation: ${error.message}`);
    return NextResponse.json(
      { message: "Something Went Wrong While Compiling", error: error.message },
      { status: 500 }
    );
  }
}

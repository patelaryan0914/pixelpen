import { getSession } from "@/app/actions";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "edge";
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const { content, status } = await req.json();
    const title = content.blocks
      .filter((val: any) => val.type === "header")[0]
      .data.text.toLowerCase()
      .replaceAll(" ", "-");
    const image = content.blocks.filter((val: any) => val.type === "image")[0]
      .data.file.url;
    const publish = await prisma.blog.create({
      data: {
        ownerId: session.userInfo.id,
        content,
        title,
        status,
        images: {
          create: {
            imageUrl: image,
            ownerId: session.userInfo.id,
          },
        },
      },
    });

    return NextResponse.json({ message: "Publised" }, { status: 200 });
  } catch (error: any) {
    console.error(`Error during compilation: ${error.message}`);
    return NextResponse.json(
      { message: "Something Went Wrong While Compiling", error: error.message },
      { status: 500 }
    );
  }
}

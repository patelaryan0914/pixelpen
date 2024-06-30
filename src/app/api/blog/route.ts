import { getSession } from "@/app/actions";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const { content, status } = await req.json();
    const title = content.filter((val: any) => val.type === "heading")[0]
      .content[0].text;
    const image = content.filter((val: any) => val.type === "image")[0].props
      .url;
    const publish = await prisma.blog.create({
      data: {
        ownerId: session.userInfo.id,
        content,
        title,
        status,
      },
    });
    if (publish)
      await prisma.image.create({
        data: {
          imageUrl: image,
          ownerId: session.userInfo.id,
          blogId: publish.id,
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

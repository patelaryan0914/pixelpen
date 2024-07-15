import { getSession } from "@/app/actions";
import prisma from "@/lib/db";
import { OutputBlockData } from "@editorjs/editorjs";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const { result } = await req.json();
    const title = result.title.toLowerCase().replaceAll(" ", "-");
    const images = result.data.blocks.filter(
      (val: OutputBlockData) => val.type === "image"
    );
    const publish = await prisma.blog.create({
      data: {
        ownerId: session.userInfo.id,
        content: result.data,
        title,
        status: result.status,
      },
    });
    if (publish)
      images.forEach(
        async (val: any) =>
          await prisma.image.create({
            data: {
              imageUrl: val.data.file.url as string,
              ownerId: session.userInfo.id,
              blogId: publish.id,
            },
          })
      );
    return NextResponse.json({ message: "Publised" }, { status: 200 });
  } catch (error: any) {
    console.error(`Error during compilation: ${error.message}`);
    return NextResponse.json(
      { message: "Something Went Wrong While Compiling", error: error.message },
      { status: 500 }
    );
  }
}

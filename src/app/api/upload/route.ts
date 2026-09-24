import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { putObject } from "@/lib/s3";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("file");
    const object = (form.get("object") as string) || "blog-images";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.size === 0) {
      return NextResponse.json({ error: "Empty file" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size must not exceed 2MB" },
        { status: 413 }
      );
    }

    const body = Buffer.from(await file.arrayBuffer());
    const url = await putObject({
      fileName: file.name,
      body,
      object,
      contentType: file.type,
    });

    return NextResponse.json({ url }, { status: 200 });
  } catch (error: any) {
    console.error("Upload failed:", error?.message);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

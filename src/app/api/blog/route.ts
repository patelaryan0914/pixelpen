import { getSession } from "@/app/actions";
import prisma from "@/lib/db";
import { getAllImageUrls, slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

async function claimSlug(
  requested: string,
  ignoreId?: string,
  allowSuffix = true
) {
  const base = slugify(requested);
  const taken = (slug: string) =>
    prisma.blog.findFirst({
      where: {
        AND: [
          { OR: [{ slug }, { title: slug }] },
          ...(ignoreId ? [{ NOT: { id: ignoreId } }] : []),
        ],
      },
      select: { id: true },
    });

  if (!(await taken(base))) return base;
  if (!allowSuffix) return null;
  for (let n = 2; n < 50; n++) {
    const next = `${base}-${n}`.slice(0, 80);
    if (!(await taken(next))) return next;
  }
  return null;
}

async function resolveSeries(ownerId: string, title?: string | null) {
  const name = title?.trim();
  if (!name) return null;
  const existing = await prisma.series.findFirst({
    where: { ownerId, title: name },
    select: { id: true },
  });
  if (existing) return existing.id;
  const created = await prisma.series.create({
    data: { ownerId, title: name },
    select: { id: true },
  });
  return created.id;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { result } = await req.json();
    const ownerId = session.userInfo.id;
    const headline = String(result.title ?? "").trim();
    const slug = await claimSlug(
      result.slug || headline,
      result.id,
      !result.customSlug
    );
    if (!slug) {
      return NextResponse.json(
        { message: "That URL is already taken." },
        { status: 409 }
      );
    }

    const status = result.status as "Draft" | "Published" | "Scheduled";
    const publishAt =
      status === "Scheduled" && result.publishAt
        ? new Date(result.publishAt)
        : null;
    const seriesId = await resolveSeries(ownerId, result.seriesTitle);
    const description = String(result.description ?? "").trim() || null;
    const coverUrl = result.coverUrl || null;
    const imageUrls = getAllImageUrls(result.data);

    const data = {
      content: result.data,
      title: slug,
      headline,
      slug,
      description,
      coverUrl,
      publishAt,
      seriesId,
      status,
    };

    let blogId = result.id as string | undefined;
    let previousSlug: string | null = null;
    if (blogId) {
      const existing = await prisma.blog.findFirst({
        where: { id: blogId, ownerId },
        select: { id: true, slug: true, title: true },
      });
      previousSlug = existing?.slug || existing?.title || null;
      if (!existing) {
        return NextResponse.json({ message: "Story not found." }, { status: 404 });
      }
      await prisma.blog.update({ where: { id: blogId }, data });
      await prisma.image.deleteMany({ where: { blogId } });
    } else {
      const created = await prisma.blog.create({
        data: { ...data, ownerId },
        select: { id: true },
      });
      blogId = created.id;
    }

    if (imageUrls.length > 0) {
      await prisma.image.createMany({
        data: imageUrls.map((imageUrl) => ({
          imageUrl,
          ownerId,
          blogId: blogId!,
        })),
      });
    }

    if (Array.isArray(result.tags)) {
      const tags = Array.from(
        new Set(
          (result.tags as unknown[])
            .map((tag) => String(tag).trim())
            .filter((tag) => tag.length > 0)
        )
      ).slice(0, 5);
      await prisma.tag.deleteMany({ where: { blogId } });
      if (tags.length > 0) {
        await prisma.tag.createMany({
          data: tags.map((tag) => ({ blogId: blogId!, tag })),
        });
      }
    }

    revalidatePath(`/blogs/${slug}`);
    if (previousSlug && previousSlug !== slug) {
      revalidatePath(`/blogs/${previousSlug}`);
    }
    revalidatePath("/");

    return NextResponse.json({ message: "Saved", slug }, { status: 200 });
  } catch (error: any) {
    console.error(`Error during compilation: ${error.message}`);
    return NextResponse.json(
      { message: "Something Went Wrong While Compiling", error: error.message },
      { status: 500 }
    );
  }
}

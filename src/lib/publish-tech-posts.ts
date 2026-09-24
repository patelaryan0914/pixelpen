import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { groqComplete } from "@/lib/groq";
import { slugify } from "@/lib/utils";

const AUTHOR_EMAIL = "patelaryan0914@gmail.com";

type Headline = {
  id: number;
  title: string;
  url: string;
};

function tiptapDoc(
  body: string,
  sourceTitle: string,
  sourceUrl: string,
  coverUrl: string
) {
  const paragraphs = body
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 8);

  return {
    type: "doc",
    content: [
      {
        type: "image",
        attrs: { src: coverUrl, alt: sourceTitle },
      },
      ...paragraphs.map((text) => ({
        type: "paragraph",
        content: [{ type: "text", text }],
      })),
      {
        type: "paragraph",
        content: [
          { type: "text", text: "Source: " },
          {
            type: "text",
            text: sourceTitle,
            marks: [
              {
                type: "link",
                attrs: { href: sourceUrl, target: "_blank" },
              },
            ],
          },
        ],
      },
    ],
  };
}

function metaContent(html: string, key: string) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const name = tag
      .match(/(?:property|name)=["']([^"']+)["']/i)?.[1]
      ?.toLowerCase();
    if (name !== key) continue;
    const content = tag.match(/content=["']([^"']+)["']/i)?.[1];
    if (content) return content.replace(/&amp;/g, "&");
  }
  return null;
}

async function uploadCover(id: number, bytes: Buffer, contentType: string) {
  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_S3_REGION;
  if (!bucket || !region) return null;
  const ext = contentType.includes("png")
    ? "png"
    : contentType.includes("webp")
      ? "webp"
      : "jpg";
  const key = `pixelpen/blog-images/cover-${id}.${ext}`;
  const client = new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: bytes,
      ContentType: contentType.startsWith("image/") ? contentType : "image/jpeg",
    })
  );
  return `https://${bucket}.s3.amazonaws.com/${key}`;
}

async function downloadImage(imageUrl: string) {
  const image = await fetch(imageUrl, {
    headers: { "User-Agent": "PixelPen/1.0" },
    redirect: "follow",
    signal: AbortSignal.timeout(12_000),
  });
  const contentType = (image.headers.get("content-type") ?? "").split(";")[0];
  if (!contentType.startsWith("image/") || contentType.includes("svg")) return null;
  const bytes = Buffer.from(await image.arrayBuffer());
  if (bytes.length < 1_000 || bytes.length > 3_000_000) return null;
  return { bytes, contentType };
}

async function fetchCover(pageUrl: string, id: number) {
  let imageUrl: string | null = null;
  try {
    const page = await fetch(pageUrl, {
      headers: { "User-Agent": "PixelPen/1.0" },
      redirect: "follow",
      signal: AbortSignal.timeout(12_000),
    });
    const html = await page.text();
    const raw =
      metaContent(html, "og:image") ||
      metaContent(html, "twitter:image") ||
      metaContent(html, "twitter:image:src");
    const imgSrc = html.match(/<img\b[^>]*src=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/i)?.[1];
    const chosen = raw || imgSrc;
    if (chosen) imageUrl = new URL(chosen, page.url || pageUrl).href;
  } catch {
    imageUrl = null;
  }

  const downloaded = imageUrl ? await downloadImage(imageUrl).catch(() => null) : null;
  const file =
    downloaded ??
    (await downloadImage(`https://picsum.photos/seed/pixelpen-${id}/1200/800`));
  if (!file) return null;
  return uploadCover(id, file.bytes, file.contentType);
}

async function techHeadlines(): Promise<Headline[]> {
  const ids = (await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json",
    { cache: "no-store" }
  ).then((response) => response.json())) as number[];

  const items = await Promise.all(
    ids.slice(0, 25).map((id) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
        cache: "no-store",
      }).then((response) => response.json())
    )
  );

  return items
    .filter(
      (item) =>
        item &&
        item.type === "story" &&
        typeof item.title === "string" &&
        typeof item.url === "string" &&
        !item.dead
    )
    .map((item) => ({
      id: item.id as number,
      title: item.title as string,
      url: item.url as string,
    }));
}

async function writePost(headline: Headline) {
  const body = await groqComplete(
    "You write original posts for PixelPen, a coding magazine. Use only the headline you are given. Do not copy or invent quotations from an article. Write 4 short paragraphs separated by blank lines, for people who code. No title, no markdown, no hashtags.",
    `Headline: ${headline.title}`,
    false,
    900
  );
  return body.replace(/^["']|["']$/g, "").trim();
}

function sourceUrlFromDoc(content: unknown) {
  const nodes = (content as { content?: { content?: { text?: string; marks?: { type: string; attrs?: { href?: string } }[] }[] }[] })
    ?.content;
  if (!Array.isArray(nodes)) return null;
  for (const node of nodes) {
    for (const child of node.content ?? []) {
      const href = child.marks?.find((mark) => mark.type === "link")?.attrs?.href;
      if (href) return href;
    }
  }
  return null;
}

export async function publishTechPosts(limit = 1) {
  const author = await prisma.user.findUnique({
    where: { email: AUTHOR_EMAIL },
    select: { id: true },
  });
  if (!author) {
    throw new Error(`No PixelPen account for ${AUTHOR_EMAIL}`);
  }

  const headlines = await techHeadlines();
  const published: { title: string; slug: string; coverUrl: string }[] = [];

  for (const headline of headlines) {
    if (published.length >= limit) break;
    const marker = `hn-${headline.id}`;
    const already = await prisma.blog.findFirst({
      where: { slug: { endsWith: marker } },
      select: { id: true },
    });
    if (already) continue;

    let coverUrl: string | null = null;
    try {
      coverUrl = await fetchCover(headline.url, headline.id);
    } catch (error) {
      console.error("Skip cover", headline.id, error);
      continue;
    }
    if (!coverUrl) continue;

    let body = "";
    try {
      body = await writePost(headline);
    } catch (error) {
      console.error("Skip headline", headline.id, error);
      continue;
    }
    const headlineText = headline.title.replace(/\s+/g, " ").trim().slice(0, 60);
    const slug = `${slugify(headlineText).slice(0, 60)}-${marker}`;
    const description =
      body.split(/\n+/)[0]?.replace(/\s+/g, " ").trim().slice(0, 160) ||
      headlineText;
    const doc = tiptapDoc(body, headline.title, headline.url, coverUrl);

    await prisma.blog.create({
      data: {
        ownerId: author.id,
        title: slug,
        headline: headlineText,
        slug,
        description,
        coverUrl,
        content: doc,
        status: "Published",
        tags: {
          create: ["Technology", "Coding"].map((tag) => ({ tag })),
        },
        images: {
          create: { imageUrl: coverUrl, ownerId: author.id },
        },
      },
    });

    published.push({ title: headlineText, slug, coverUrl });
    try {
      revalidatePath(`/blogs/${slug}`);
      revalidatePath("/");
    } catch {
      // Outside a Next.js request this is a no-op.
    }
  }

  return { published };
}

export async function backfillCovers() {
  const blogs = await prisma.blog.findMany({
    where: { coverUrl: null, slug: { contains: "-hn-" } },
    select: { id: true, slug: true, content: true, ownerId: true },
  });
  const updated: string[] = [];

  for (const blog of blogs) {
    const pageUrl = sourceUrlFromDoc(blog.content);
    const idMatch = blog.slug?.match(/hn-(\d+)$/);
    if (!pageUrl || !idMatch) continue;
    let coverUrl: string | null = null;
    try {
      coverUrl = await fetchCover(pageUrl, Number(idMatch[1]));
    } catch (error) {
      console.error("Cover failed", blog.slug, error);
      continue;
    }
    if (!coverUrl) continue;

    const content = blog.content as { type?: string; content?: unknown[] };
    const nodes = Array.isArray(content?.content) ? content.content : [];
    const hasImage = nodes.some(
      (node) => (node as { type?: string }).type === "image"
    );
    const nextContent = hasImage
      ? content
      : {
          ...content,
          content: [
            { type: "image", attrs: { src: coverUrl, alt: "" } },
            ...nodes,
          ],
        };

    await prisma.blog.update({
      where: { id: blog.id },
      data: { coverUrl, content: nextContent },
    });
    await prisma.image.create({
      data: { imageUrl: coverUrl, ownerId: blog.ownerId, blogId: blog.id },
    });
    updated.push(blog.slug ?? blog.id);
    try {
      if (blog.slug) revalidatePath(`/blogs/${blog.slug}`);
      revalidatePath("/");
    } catch {
      // Outside a Next.js request this is a no-op.
    }
  }

  return { updated };
}

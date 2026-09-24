import { getSession } from "@/app/actions";
import prisma from "@/lib/db";
import { AuthRequiredError } from "@/lib/exceptions";
import { Icons } from "@/components/icons";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit story",
};

const BlogEditor = dynamic(
  () => import("../../publish-blog/Editor"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <Icons.spinner className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);

export default async function EditBlogPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) throw new AuthRequiredError();

  const blog = await prisma.blog.findFirst({
    where: { id: params.id, ownerId: session.userInfo.id },
    include: {
      series: { select: { title: true } },
      tags: { select: { tag: true } },
    },
  });
  if (!blog) notFound();

  return (
    <div className="min-h-screen">
      <BlogEditor
        initial={{
          id: blog.id,
          headline: blog.headline || blog.title.replaceAll("-", " "),
          slug: blog.slug || blog.title,
          description: blog.description ?? "",
          coverUrl: blog.coverUrl,
          seriesTitle: blog.series?.title ?? "",
          publishAt: blog.publishAt ? blog.publishAt.toISOString() : null,
          content: blog.content,
          tags: blog.tags.map((tag) => tag.tag),
        }}
      />
    </div>
  );
}

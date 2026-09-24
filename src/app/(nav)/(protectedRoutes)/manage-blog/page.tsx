import { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/db";
import { getSession } from "@/app/actions";
import ManageBlog from "./ManageBlog";
import { AuthRequiredError } from "@/lib/exceptions";
import { Blog } from "@/app/types";
import { PageHeader, PageShell } from "@/components/page-shell";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Manage Blog",
  description: "Manage all Your written Blogs at one place.",
};

export default async function Page() {
  const session = await getSession();
  if (!session) throw new AuthRequiredError();
  const blogs: Blog[] = await prisma.blog.findMany({
    where: { ownerId: session.userInfo.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      headline: true,
      slug: true,
      status: true,
      publishAt: true,
      createdAt: true,
      images: {
        select: {
          imageUrl: true,
        },
      },
      tags: { select: { tag: true } },
    },
  });
  const tags: { tag: string }[] = await prisma.tag.findMany({
    select: { tag: true },
  });
  return (
    <PageShell>
      <PageHeader
        title="Your stories"
        description={`Welcome back, ${session.userInfo.username}. Finish drafts, edit live stories, and schedule what comes next.`}
        action={
          <Link href="/publish-blog" className={buttonVariants()}>
            Write
          </Link>
        }
      />
      <ManageBlog data={blogs} options={tags} />
    </PageShell>
  );
}

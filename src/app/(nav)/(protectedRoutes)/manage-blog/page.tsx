import { Metadata } from "next";
import prisma from "@/lib/db";
import { getSession } from "@/app/actions";
import ManageBlog from "./ManageBlog";
import { AuthRequired } from "@/lib/exceptions";

export const metadata: Metadata = {
  title: "Manage Blog",
  description: "Manage all Your written Blogs at one place.",
};

export default async function Page() {
  const session = await getSession();
  if (!session) throw new AuthRequired();
  const blogs = await prisma.blog.findMany({
    where: { ownerId: session.userInfo.id },
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      images: {
        select: {
          imageUrl: true,
        },
      },
      tags: {
        select: {
          tag: true,
        },
      },
    },
  });
  return (
    <>
      <div className=" h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome {session.userInfo.username}!
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your Blogs Written.
            </p>
          </div>
          <div className="flex items-center space-x-2"></div>
        </div>
        <ManageBlog data={blogs} />
      </div>
    </>
  );
}

import prisma from "@/lib/db";
import RecommendationCard from "../../RecommendationCard";
import { Blog } from "@/app/types";
import { getSession } from "@/app/actions";
import { AuthRequiredError } from "@/lib/exceptions";
export default async function Page() {
  const session = await getSession();
  if (!session) throw new AuthRequiredError();
  const Blogs = await prisma.subscription.findMany({
    where: { readerId: session.userInfo.id },
    select: {
      publisher: {
        select: {
          blogs: {
            select: {
              id: true,
              title: true,
              status: true,
              content: true,
              createdAt: true,
              ownerId: true,
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
              _count: {
                select: {
                  likes: true,
                  comments: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const followedBlogs = Blogs.flatMap((val) => val.publisher.blogs);

  return (
    <>
      {followedBlogs.length == 0 ? (
        <div className="h-screen flex justify-center items-center">
          <h2 className="">
            Start Following to show up the content in this section.
          </h2>
        </div>
      ) : (
        followedBlogs.map((val: Blog) => (
          <RecommendationCard data={val} key={val.id} />
        ))
      )}
    </>
  );
}

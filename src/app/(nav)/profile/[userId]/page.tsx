import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { formatedNumber } from "@/lib/numberFormater";
import { CircleUser } from "lucide-react";
import { getSession, subscribe } from "@/app/actions";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import FeedStoryCard, { type FeedBlog } from "../../(landing)/FeedStoryCard";
import { PageShell } from "@/components/page-shell";
import { publicStoryWhere, readerFlags } from "@/lib/stories";

const page = async ({ params }: { params: { userId: string } }) => {
  const session = await getSession();
  const followAccess = Boolean(session);
  const userInfo = await prisma.user.findFirst({
    where: { id: params.userId },
    select: {
      id: true,
      username: true,
      avatar: true,
      bio: true,
      blogs: {
        where: publicStoryWhere(),
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          headline: true,
          slug: true,
          description: true,
          coverUrl: true,
          content: true,
          createdAt: true,
          seriesId: true,
          series: { select: { id: true, title: true } },
          owner: {
            select: { id: true, username: true, avatar: true, bio: true },
          },
          images: { select: { imageUrl: true } },
          tags: { select: { tag: true } },
          _count: { select: { likes: true, comments: true } },
        },
      },
      _count: {
        select: {
          subscriptionsAsPublisher: true,
        },
      },
    },
  });
  const flags = await readerFlags(
    session?.userInfo.id,
    userInfo?.blogs.map((blog) => blog.id) ?? []
  );
  let isSubscribed = false;
  if (session) {
    isSubscribed = !!(await prisma.subscription.findFirst({
      where: {
        publisherId: params.userId,
        readerId: session.userInfo.id,
      },
    }));
  }

  const seriesGroups: {
    id: string;
    title: string;
    blogs: FeedBlog[];
  }[] = [];
  const loose: FeedBlog[] = [];
  for (const blog of userInfo?.blogs ?? []) {
    const card: FeedBlog = {
      ...blog,
      bookmarked: flags.saved.has(blog.id),
      liked: flags.liked.has(blog.id),
    };
    if (blog.series) {
      const group = seriesGroups.find((item) => item.id === blog.series!.id);
      if (group) group.blogs.push(card);
      else
        seriesGroups.push({
          id: blog.series.id,
          title: blog.series.title,
          blogs: [card],
        });
    } else {
      loose.push(card);
    }
  }
  for (const group of seriesGroups) {
    group.blogs.sort(
      (a, b) =>
        new Date(a.createdAt ?? 0).getTime() -
        new Date(b.createdAt ?? 0).getTime()
    );
  }

  return (
    <PageShell narrow>
      <div className="mb-10 flex flex-col items-center text-center">
        {userInfo?.avatar ? (
          <Avatar className="h-24 w-24">
            <AvatarImage src={userInfo.avatar} alt={userInfo.username ?? ""} />
          </Avatar>
        ) : (
          <CircleUser className="h-24 w-24 text-muted-foreground" />
        )}
        <h1 className="mt-4 font-serif text-3xl font-medium">
          {userInfo?.username}
        </h1>
        {userInfo?.bio && (
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            {userInfo.bio}
          </p>
        )}
        <p className="mt-1 text-sm text-muted-foreground">
          {formatedNumber.format(userInfo?._count.subscriptionsAsPublisher ?? 0)}{" "}
          followers
        </p>
        <form
          className="mt-4"
          action={async () => {
            "use server";
            await subscribe(params.userId);
          }}
        >
          <Button
            type="submit"
            size="sm"
            variant={isSubscribed ? "outline" : "default"}
            disabled={!followAccess}
            aria-label="followAccess"
          >
            {isSubscribed ? "Following" : "Follow"}
          </Button>
        </form>
      </div>

      {seriesGroups.map((group) => (
        <section key={group.id} className="mb-10">
          <h2 className="mb-2 font-serif text-xl font-medium">{group.title}</h2>
          <div className="divide-y">
            {group.blogs.map((blog, index) => (
              <div key={blog.id}>
                <p className="pt-6 text-xs font-medium uppercase tracking-wide text-primary">
                  Part {index + 1}
                </p>
                <FeedStoryCard data={blog} />
              </div>
            ))}
          </div>
        </section>
      ))}

      <h2 className="mb-2 font-serif text-xl font-medium">Stories</h2>
      {loose.length ? (
        <div className="divide-y">
          {loose.map((blog) => (
            <FeedStoryCard key={blog.id} data={blog} />
          ))}
        </div>
      ) : (
        seriesGroups.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No published stories yet.
          </p>
        )
      )}
    </PageShell>
  );
};

export default page;

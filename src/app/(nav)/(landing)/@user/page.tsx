import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import prisma from "@/lib/db";
import { storyPath, storyTitle } from "@/lib/utils";
import { publicStoryWhere } from "@/lib/stories";

export default async function page() {
  const [staffPicks, topics] = await Promise.all([
    prisma.blog.findMany({
      where: publicStoryWhere(),
      orderBy: { likes: { _count: "desc" } },
      take: 3,
      select: {
        id: true,
        title: true,
        headline: true,
        slug: true,
        owner: { select: { id: true, username: true, avatar: true } },
      },
    }),
    prisma.tag.findMany({
      take: 8,
      select: { tag: true },
    }),
  ]);

  return (
    <>
      <div className="rounded-xl border bg-card p-4">
        <div className="mb-4 flex items-center gap-2 border-b pb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold">Staff Picks</h3>
        </div>
        {staffPicks.length > 0 ? (
          <div className="space-y-4">
            {staffPicks.map((blog) => (
              <Link
                key={blog.id}
                href={storyPath(blog)}
                className="group block"
              >
                <div className="mb-1 flex items-center gap-2">
                  {blog.owner?.avatar ? (
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={blog.owner.avatar} alt="" />
                    </Avatar>
                  ) : (
                    <Avatar className="h-4 w-4">
                      <AvatarFallback className="text-[9px]">
                        {blog.owner?.username?.[0] ?? "P"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <span className="text-[13px] text-muted-foreground">
                    {blog.owner?.username}
                  </span>
                </div>
                <h4 className="font-serif text-[16px] font-medium leading-[22px] text-foreground transition-colors group-hover:text-primary">
                  {storyTitle(blog)}
                </h4>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Staff picks will appear as stories are published.
          </p>
        )}
        <Link
          href="/"
          className="mt-4 inline-block text-[13px] text-primary hover:underline"
        >
          View full reading list →
        </Link>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <h3 className="mb-4 text-sm font-semibold">Recommended Topics</h3>
        <div className="flex flex-wrap gap-2">
          {(topics.length
            ? topics.map((t) => t.tag)
            : [
                "DataVisualization",
                "CreativeCode",
                "ProductDesign",
                "MachineLearning",
                "Typography",
                "Philosophy",
              ]
          ).map((tag) => (
            <span
              key={tag}
              className="rounded-full border bg-muted/60 px-3 py-1.5 text-[13px] text-muted-foreground"
            >
              #{tag.replace(/\s+/g, "")}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import {
  cn,
  getFirstStringFromArray,
  storyTitle,
} from "@/lib/utils";
import FeedStoryCard, { type FeedBlog } from "./FeedStoryCard";

const FALLBACK_TOPICS = [
  "Technology",
  "Design",
  "Programming",
  "Startups",
  "AI",
  "Life",
  "Writing",
];

type Tab = "trending" | "latest" | "staff";

export default function FeedClient({
  blogs,
  topics,
}: {
  blogs: FeedBlog[];
  topics: string[];
}) {
  const [activeTopic, setActiveTopic] = useState("For You");
  const [tab, setTab] = useState<Tab>("trending");
  const query = (useSearchParams().get("q") ?? "").trim().toLowerCase();

  const chips = useMemo(() => {
    const unique = Array.from(new Set(topics.filter(Boolean)));
    return ["For You", ...(unique.length ? unique : FALLBACK_TOPICS)];
  }, [topics]);

  const stories = useMemo(() => {
    let list = [...blogs];
    if (query) {
      list = list.filter((blog) => {
        const haystack = [
          storyTitle(blog),
          blog.description ?? "",
          getFirstStringFromArray(blog.content, "paragraph"),
          blog.owner?.username ?? "",
          blog.owner?.bio ?? "",
          blog.series?.title ?? "",
          ...(blog.tags?.map((tag) => tag.tag) ?? []),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      });
    }
    if (activeTopic !== "For You") {
      list = list.filter((blog) =>
        blog.tags?.some(
          (t) => t.tag.toLowerCase() === activeTopic.toLowerCase()
        )
      );
    }
    if (tab === "latest") {
      list.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime()
      );
    } else {
      list.sort((a, b) => (b._count?.likes ?? 0) - (a._count?.likes ?? 0));
    }
    return list;
  }, [blogs, activeTopic, tab, query]);

  return (
    <section className="flex flex-col">
      <div className="sticky top-16 z-40 -mx-4 border-b bg-background/80 px-4 py-2.5 backdrop-blur md:-mx-0 md:px-0">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto py-0.5">
          {chips.map((topic) => {
            const active = topic === activeTopic;
            return (
              <button
                key={topic}
                type="button"
                onClick={() => setActiveTopic(topic)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-wide transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "border bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </div>

      {query && (
        <p className="mt-4 text-sm text-muted-foreground">
          Results for “{query}”
        </p>
      )}

      <div className="mt-6 flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-6">
          {(
            [
              ["trending", "Trending"],
              ["latest", "Latest"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "-mb-[13px] pb-3 text-sm font-semibold transition-colors",
                tab === id
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
          <Link
            href="/following"
            className="-mb-[13px] pb-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Following
          </Link>
          <button
            type="button"
            onClick={() => setTab("staff")}
            className={cn(
              "-mb-[13px] pb-3 text-sm font-semibold transition-colors",
              tab === "staff"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Staff Picks
          </button>
        </div>
        <span className="hidden items-center gap-1 text-[13px] text-muted-foreground md:flex">
          <SlidersHorizontal className="h-4 w-4" />
          Refine Feed
        </span>
      </div>

      {stories.length > 0 ? (
        <div className="divide-y">
          {stories.map((blog) => (
            <FeedStoryCard key={blog.id} data={blog} />
          ))}
        </div>
      ) : (
        <div className="mx-auto my-16 flex max-w-md flex-col items-center gap-2 text-center">
          <h2 className="font-serif text-2xl font-medium">No stories yet</h2>
          <p className="text-sm text-muted-foreground">
            Be the first to publish. Your stories will show up here.
          </p>
          <Link href="/publish-blog" className="mt-2 text-sm text-primary">
            Write a story →
          </Link>
        </div>
      )}
    </section>
  );
}

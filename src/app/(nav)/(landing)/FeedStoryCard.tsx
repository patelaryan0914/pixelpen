import Link from "next/link";
import Image from "next/image";
import { CircleUser, MessageSquareText, Share2 } from "lucide-react";
import BookmarkButton from "../BookmarkButton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import LikeButton from "../LikeButton";
import { formatedNumber } from "@/lib/numberFormater";
import {
  getFirstImageUrl,
  getFirstStringFromArray,
  getReadingMinutes,
  storyPath,
  storyTitle,
} from "@/lib/utils";

export type FeedBlog = {
  id: string;
  title: string;
  headline?: string | null;
  slug?: string | null;
  description?: string | null;
  coverUrl?: string | null;
  content: any;
  createdAt?: Date | string | null;
  owner?: {
    id: string;
    username?: string | null;
    avatar?: string | null;
    bio?: string | null;
  } | null;
  tags?: { tag: string }[];
  images?: { imageUrl: string }[];
  series?: { id?: string; title: string } | null;
  _count?: { likes?: number; comments?: number };
  bookmarked?: boolean;
  liked?: boolean;
};

function formatDate(value?: Date | string | null) {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function FeedStoryCard({ data }: { data: FeedBlog }) {
  const title = storyTitle(data);
  const href = storyPath(data);
  const excerpt =
    data.description?.trim() || getFirstStringFromArray(data.content, "paragraph");
  const imageUrl =
    data.coverUrl || data.images?.[0]?.imageUrl || getFirstImageUrl(data.content);
  const topic = data.tags?.[0]?.tag;
  const minutes = getReadingMinutes(data.content);

  return (
    <article className="group py-8">
      <div className="flex flex-col-reverse items-start justify-between gap-6 md:flex-row">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="mb-2.5 flex flex-wrap items-center gap-2 text-[13px]">
            <Link
              href={`/profile/${data.owner?.id ?? ""}`}
              className="flex items-center gap-2"
            >
              {data.owner?.avatar ? (
                <Avatar className="h-6 w-6">
                  <AvatarImage src={data.owner.avatar} alt="" />
                </Avatar>
              ) : (
                <CircleUser className="h-6 w-6 text-muted-foreground" />
              )}
              <span className="font-semibold text-foreground">
                {data.owner?.username ?? "Unknown"}
              </span>
            </Link>
            {topic && (
              <>
                <span className="text-muted-foreground">in</span>
                <span className="font-medium text-foreground/80">{topic}</span>
              </>
            )}
            {data.createdAt && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {formatDate(data.createdAt)}
                </span>
              </>
            )}
          </div>
          {data.owner?.bio && (
            <p className="mb-2 line-clamp-1 pl-8 text-xs text-muted-foreground">
              {data.owner.bio}
            </p>
          )}

          <Link href={href} className="block">
            <h2 className="mb-2 font-serif text-2xl font-medium leading-8 tracking-tight text-foreground transition-colors group-hover:text-primary">
              {title}
            </h2>
            {excerpt && (
              <p className="mb-4 line-clamp-2 text-[15px] leading-6 text-muted-foreground">
                {excerpt}
              </p>
            )}
          </Link>

          <div className="flex items-center justify-between pt-1 text-muted-foreground">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border bg-muted/60 px-2.5 py-1 text-[11px] font-medium">
                {minutes} min read
              </span>
              {data.series?.title && (
                <span className="rounded-full border bg-muted/60 px-2.5 py-1 text-[11px] font-medium">
                  {data.series.title}
                </span>
              )}
              {topic && (
                <span className="rounded-full border bg-muted/60 px-2.5 py-1 text-[11px] font-medium">
                  {topic}
                </span>
              )}
            </div>
            <div className="flex h-8 items-center gap-3">
              <LikeButton
                blogId={data.id}
                liked={data.liked}
                count={data._count?.likes ?? 0}
              />
              <Link
                href={href}
                className="flex items-center gap-1 hover:text-primary"
                aria-label="Comments"
              >
                <MessageSquareText className="h-[18px] w-[18px]" />
                <span className="text-[13px]">
                  {formatedNumber.format(data._count?.comments ?? 0)}
                </span>
              </Link>
              <span className="hidden items-center sm:inline-flex">
                <BookmarkButton blogId={data.id} bookmarked={data.bookmarked} />
              </span>
              <Link
                href={href}
                className="hidden items-center hover:text-primary sm:inline-flex"
                aria-label="Share"
              >
                <Share2 className="h-[18px] w-[18px]" />
              </Link>
            </div>
          </div>
        </div>

        <Link
          href={href}
          className="h-40 w-full shrink-0 overflow-hidden rounded-xl border bg-muted md:h-32 md:w-44"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              width={352}
              height={256}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </Link>
      </div>
    </article>
  );
}

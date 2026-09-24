"use client";

import { Bookmark } from "lucide-react";
import { toggleBookmark } from "@/app/actions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function BookmarkButton({
  blogId,
  bookmarked = false,
}: {
  blogId: string;
  bookmarked?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={bookmarked ? "Remove bookmark" : "Save story"}
      className="inline-flex h-[18px] w-[18px] items-center justify-center leading-none text-muted-foreground transition-colors hover:text-primary"
      onClick={async () => {
        const result = await toggleBookmark(blogId);
        if (result?.status !== 200) {
          toast.error("Sign in to save stories");
          return;
        }
        toast.success(
          result.bookmarked ? "Saved to reading list" : "Removed from reading list"
        );
      }}
    >
      <Bookmark
        className={cn("block h-[18px] w-[18px]", bookmarked && "fill-primary text-primary")}
      />
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatedNumber } from "@/lib/numberFormater";
import { cn } from "@/lib/utils";

export default function LikeButton({
  blogId,
  liked = false,
  count = 0,
  checkLiked = false,
}: {
  blogId: string;
  liked?: boolean;
  count?: number;
  checkLiked?: boolean;
}) {
  const [state, setState] = useState({ liked, count });
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!checkLiked) return;
    let ignore = false;
    fetch(`/api/like?blogId=${encodeURIComponent(blogId)}`)
      .then((response) => response.json())
      .then((data: { liked?: boolean }) => {
        if (!ignore) {
          setState((current) => ({ ...current, liked: Boolean(data.liked) }));
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [blogId, checkLiked]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (pending) return;
    const previous = state;
    const nextLiked = !state.liked;
    setState({
      liked: nextLiked,
      count: Math.max(0, state.count + (nextLiked ? 1 : -1)),
    });
    setPending(true);
    try {
      const response = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId }),
      });
      const result = (await response.json()) as { liked?: boolean };
      if (!response.ok) {
        setState(previous);
        toast.error(
          response.status === 401
            ? "Sign in to like a story."
            : "Could not update that like."
        );
        return;
      }
      setState((current) => ({ ...current, liked: Boolean(result.liked) }));
    } catch {
      setState(previous);
      toast.error("Could not update that like.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="h-8 w-auto gap-1 px-1.5"
        aria-label={state.liked ? "Unlike story" : "Like story"}
        aria-pressed={state.liked}
      >
        <Heart
          className={cn(
            "h-[18px] w-[18px]",
            state.liked ? "fill-primary text-primary" : "text-current"
          )}
        />
        <span className="text-[13px] font-normal">
          {formatedNumber.format(state.count)}
        </span>
      </Button>
    </form>
  );
}

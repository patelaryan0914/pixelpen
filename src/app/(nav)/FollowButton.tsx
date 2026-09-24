"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function FollowButton({
  publisherId,
  variant = "default",
}: {
  publisherId: string;
  variant?: "default" | "outline";
}) {
  const [following, setFollowing] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/follow?publisherId=${encodeURIComponent(publisherId)}`)
      .then((response) => response.json())
      .then((data: { following?: boolean; signedIn?: boolean }) => {
        if (ignore) return;
        setFollowing(Boolean(data.following));
        setSignedIn(Boolean(data.signedIn));
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [publisherId]);

  async function onClick() {
    if (!signedIn) {
      toast.error("Sign in to follow a writer.");
      return;
    }
    if (pending) return;
    const previous = following;
    setFollowing(!following);
    setPending(true);
    try {
      const response = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publisherId }),
      });
      const data = (await response.json()) as { following?: boolean };
      if (!response.ok) {
        setFollowing(previous);
        toast.error(
          response.status === 401
            ? "Sign in to follow a writer."
            : "Could not update that follow."
        );
        return;
      }
      setFollowing(Boolean(data.following));
    } catch {
      setFollowing(previous);
      toast.error("Could not update that follow.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      variant={variant}
      disabled={pending}
      onClick={onClick}
      aria-label="follow"
    >
      {following ? "Following" : "Follow"}
    </Button>
  );
}

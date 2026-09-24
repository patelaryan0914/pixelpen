"use client";

import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

const ShareButton = () => {
  const pathname = usePathname();

  const copyLink = async () => {
    const base = (process.env.NEXT_PUBLIC_BASE_URL ?? window.location.origin)
      .replace(/\/$/, "");
    const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
    const url = `${base}${path}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy the link");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="share"
      onClick={copyLink}
    >
      <Share className="h-5 w-5" />
    </Button>
  );
};

export default ShareButton;

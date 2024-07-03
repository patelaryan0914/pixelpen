"use client";
import React from "react";
import { Button } from "./ui/button";
import { Share } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "./ui/use-toast";

const ShareButton = () => {
  const pathname = usePathname();
  return (
    <Button variant="ghost" size="icon">
      <Share
        color="#374151"
        onClick={(e) => {
          navigator.clipboard.writeText(
            `${process.env.NEXT_PUBLIC_BASE_URL}/${pathname}`
          );
          return toast({ title: "Copied to Clipboard" });
        }}
      />
    </Button>
  );
};

export default ShareButton;

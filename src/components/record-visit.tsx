"use client";

import { useEffect } from "react";

export default function RecordVisit({ blogId }: { blogId: string }) {
  useEffect(() => {
    fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blogId }),
    }).catch(() => {});
  }, [blogId]);

  return null;
}

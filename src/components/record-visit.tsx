"use client";

import { useEffect } from "react";

const READ_MS = 30_000;

export default function RecordVisit({ blogId }: { blogId: string }) {
  useEffect(() => {
    let visibleMs = 0;
    let lastTick = document.visibilityState === "visible" ? Date.now() : null;
    let sent = false;

    const send = () => {
      if (sent || visibleMs < READ_MS) return;
      sent = true;
      fetch("/api/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId }),
      }).catch(() => {});
    };

    const interval = window.setInterval(() => {
      if (lastTick != null && document.visibilityState === "visible") {
        visibleMs += Date.now() - lastTick;
        lastTick = Date.now();
      }
      send();
    }, 1000);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        lastTick = Date.now();
        return;
      }
      if (lastTick != null) visibleMs += Date.now() - lastTick;
      lastTick = null;
      send();
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [blogId]);

  return null;
}

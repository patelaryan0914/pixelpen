"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import axios from "axios";
import { BlogDataSchema } from "@/lib/zod-schema";
import { useRouter } from "next/navigation";
import { ErrorMessages } from "@/components/error-message";
import { findErrors, getPlainText, slugify, storyPath } from "@/lib/utils";
import { uploadFile } from "@/lib/uploadFile";
import TiptapEditor from "./TiptapEditor";
import TiptapRenderer from "@/components/tiptap/TiptapRenderer";
import { Eye, EyeOff, ImagePlus, Sparkles, X } from "lucide-react";

export type EditorStory = {
  id: string;
  headline: string;
  slug: string;
  description: string;
  coverUrl: string | null;
  seriesTitle: string;
  publishAt: string | null;
  content: any;
  tags?: string[];
};

function toDatetimeLocal(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const Editor = ({ initial }: { initial?: EditorStory }) => {
  const router = useRouter();
  const coverInput = useRef<HTMLInputElement>(null);
  const slugLocked = useRef(Boolean(initial?.slug));
  const [loading, setLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<any>([]);
  const [data, setData] = useState<any>(initial?.content);
  const [title, setTitle] = useState(initial?.headline ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [seriesTitle, setSeriesTitle] = useState(initial?.seriesTitle ?? "");
  const [coverUrl, setCoverUrl] = useState(initial?.coverUrl ?? "");
  const [publishAt, setPublishAt] = useState(toDatetimeLocal(initial?.publishAt ?? null));
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [suggesting, setSuggesting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const saveBlogToDb = async (nextStatus: string) => {
    setStatus(nextStatus);
    setLoading(true);
    try {
      const payload = {
        id: initial?.id,
        title,
        slug,
        description,
        coverUrl: coverUrl || null,
        seriesTitle,
        publishAt:
          nextStatus === "Scheduled" && publishAt
            ? new Date(publishAt).toISOString()
            : null,
        customSlug: slugLocked.current,
        tags,
        data,
        status: nextStatus,
      };
      const result = await BlogDataSchema.safeParseAsync(payload);
      if (!result.success) {
        setStatus("");
        setLoading(false);
        return setError(result.error.issues);
      }
      setError([]);
      const save = await axios.post(
        `/api/blog`,
        { result: result.data },
        { withCredentials: true }
      );
      setLoading(false);
      const savedSlug = save.data?.slug || slugify(title);
      toast.success(
        nextStatus === "Draft"
          ? "Saved as draft — continue it anytime in Manage."
          : nextStatus === "Scheduled"
            ? "Scheduled. It will go live at the time you picked."
            : initial
              ? "Story updated."
              : "Published. Readers can view it now."
      );
      router.push(
        nextStatus === "Published" ? storyPath({ slug: savedSlug, title: savedSlug }) : "/manage-blog"
      );
      router.refresh();
    } catch (err) {
      setLoading(false);
      setStatus("");
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : null;
      toast.error(message || "Something went wrong. Please try again.");
    }
  };

  const suggestDetails = async () => {
    const text = getPlainText(data);
    if (text.length < 40) {
      toast("Write a bit more, then suggest details.");
      return;
    }
    setSuggesting(true);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "details",
          text: text.slice(0, 8000),
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        toast.error(payload.message || "Could not suggest details.");
        return;
      }
      if (payload.title) {
        setTitle(String(payload.title).slice(0, 60));
        if (!slugLocked.current) {
          setSlug(payload.slug || slugify(payload.title));
        }
      }
      if (typeof payload.description === "string") {
        setDescription(payload.description.slice(0, 160));
      }
      if (Array.isArray(payload.tags)) {
        setTags(payload.tags.map((tag: unknown) => String(tag)).slice(0, 5));
      }
      toast.success("Suggestions are in. Change anything before you publish.");
    } catch {
      toast.error("Could not suggest details.");
    } finally {
      setSuggesting(false);
    }
  };

  const onCover = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Cover must be 2MB or smaller.");
      return;
    }
    setUploadingCover(true);
    try {
      const url = await uploadFile({
        fileName: file.name,
        file,
        object: "blog-images",
      });
      if (url) setCoverUrl(url);
      else toast.error("Cover upload failed.");
    } finally {
      setUploadingCover(false);
    }
  };

  const titleErrors = findErrors("title", error);
  const dataErrors = findErrors("data", error);
  const imageErrors = findErrors("image", error);
  const publishErrors = findErrors("publishAt", error);
  const descriptionErrors = findErrors("description", error);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-4 pb-16 pt-6">
      <div className="mb-6 flex flex-wrap items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPreview((open) => !open)}
          aria-label="toggle-preview"
        >
          {showPreview ? (
            <EyeOff className="mr-2 h-4 w-4" />
          ) : (
            <Eye className="mr-2 h-4 w-4" />
          )}
          {showPreview ? "Edit" : "Preview"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => saveBlogToDb("Draft")}
          disabled={loading}
          aria-label="saveblog"
        >
          {loading && status === "Draft" ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Save draft"
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => saveBlogToDb("Scheduled")}
          disabled={loading}
          aria-label="scheduleblog"
        >
          {loading && status === "Scheduled" ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Schedule"
          )}
        </Button>
        <Button
          size="sm"
          onClick={() => saveBlogToDb("Published")}
          disabled={loading}
          aria-label="publishblog"
        >
          {loading && status === "Published" ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : initial ? (
            "Update"
          ) : (
            "Publish"
          )}
        </Button>
      </div>

      {(titleErrors.length > 0 ||
        dataErrors.length > 0 ||
        imageErrors.length > 0 ||
        publishErrors.length > 0 ||
        descriptionErrors.length > 0) && (
        <div className="mb-4 space-y-1">
          <ErrorMessages errors={titleErrors} />
          <ErrorMessages errors={dataErrors} />
          <ErrorMessages errors={imageErrors} />
          <ErrorMessages errors={publishErrors} />
          <ErrorMessages errors={descriptionErrors} />
        </div>
      )}

      {showPreview ? (
        <TiptapRenderer doc={data} title={title || "Untitled story"} />
      ) : (
        <>
          <div className="mb-8 space-y-4 rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Title, link, description, and tags can be filled from the story.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={suggesting}
                onClick={suggestDetails}
              >
                {suggesting ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4 text-primary" />
                )}
                Suggest
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1.5 block text-muted-foreground">URL</span>
                <span className="flex items-center gap-1 rounded-md border bg-background px-3">
                  <span className="shrink-0 text-xs text-muted-foreground">/blogs/</span>
                  <input
                    value={slug}
                    maxLength={80}
                    placeholder="your-story"
                    onChange={(e) => {
                      slugLocked.current = true;
                      setSlug(slugify(e.target.value));
                    }}
                    className="h-9 w-full bg-transparent text-sm focus:outline-none"
                  />
                </span>
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-muted-foreground">Series</span>
                <input
                  value={seriesTitle}
                  maxLength={60}
                  placeholder="Optional, like Part 1 of a set"
                  onChange={(e) => setSeriesTitle(e.target.value)}
                  className="h-9 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>
            <label className="block text-sm">
              <span className="mb-1.5 flex justify-between text-muted-foreground">
                Description
                <span>{description.length}/160</span>
              </span>
              <textarea
                value={description}
                maxLength={160}
                rows={2}
                placeholder="A sentence for search and social previews"
                onChange={(e) => setDescription(e.target.value)}
                className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <div>
              <span className="mb-1.5 block text-sm text-muted-foreground">Tags</span>
              <div className="flex flex-wrap gap-2">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setTags((current) => current.filter((item) => item !== tag))
                      }
                      className="inline-flex items-center gap-1 rounded-full border bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground"
                    >
                      {tag}
                      <X className="h-3 w-3" />
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">
                    None yet. Suggest some from the story, or add them later in Manage.
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <label className="block flex-1 text-sm">
                <span className="mb-1.5 block text-muted-foreground">
                  Goes live
                </span>
                <input
                  type="datetime-local"
                  value={publishAt}
                  onChange={(e) => setPublishAt(e.target.value)}
                  className="h-9 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <div className="flex items-center gap-3">
                <div className="h-16 w-24 overflow-hidden rounded-lg border bg-muted">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt="Cover"
                      width={96}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                      Cover
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadingCover}
                    onClick={() => coverInput.current?.click()}
                  >
                    {uploadingCover ? (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ImagePlus className="mr-2 h-4 w-4" />
                    )}
                    Cover
                  </Button>
                  {coverUrl && (
                    <button
                      type="button"
                      className="text-left text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => setCoverUrl("")}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  ref={coverInput}
                  type="file"
                  accept="image/png,image/jpeg,image/gif,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onCover(file);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>
          </div>

          <h1 className="sr-only">Story title</h1>
          <input
            id="title"
            type="text"
            value={title}
            maxLength={60}
            placeholder="Title"
            onChange={(e) => {
              const next = e.target.value;
              setTitle(next);
              if (!slugLocked.current) setSlug(slugify(next));
            }}
            className="mb-2 w-full border-0 bg-transparent font-serif text-4xl font-medium leading-tight tracking-tight text-foreground placeholder:text-muted-foreground/50 focus:outline-none sm:text-5xl"
          />
          <TiptapEditor content={initial?.content} onChange={setData} />
        </>
      )}
    </div>
  );
};

export default Editor;

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ZodIssue } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const findErrors = (fieldName: string, errors: ZodIssue[]) => {
  return errors
    .filter((item) => {
      return item.path.includes(fieldName);
    })
    .map((item) => item.message);
};

/**
 * TipTap / ProseMirror JSON document node.
 */
export type TiptapNode = {
  type?: string;
  attrs?: Record<string, any>;
  content?: TiptapNode[];
  text?: string;
};

// Depth-first search for the first node matching `predicate`.
const findNode = (
  doc: TiptapNode | null | undefined,
  predicate: (node: TiptapNode) => boolean
): TiptapNode | undefined => {
  if (!doc || typeof doc !== "object") return undefined;
  if (predicate(doc)) return doc;
  if (Array.isArray(doc.content)) {
    for (const child of doc.content) {
      const found = findNode(child, predicate);
      if (found) return found;
    }
  }
  return undefined;
};

// Concatenate all descendant text nodes into a single string.
const getNodeText = (node: TiptapNode | undefined): string => {
  if (!node) return "";
  if (typeof node.text === "string") return node.text;
  if (!Array.isArray(node.content)) return "";
  return node.content.map(getNodeText).join("");
};

/**
 * Returns the text of the first block of the given TipTap `type`
 * ("header" -> first heading, "paragraph" -> first paragraph).
 * Kept for backwards compatibility with existing callers.
 */
export const getFirstStringFromArray = (
  doc: TiptapNode,
  type: string
): string => {
  const nodeType = type === "header" ? "heading" : type;
  const match = findNode(doc, (n) => n.type === nodeType);
  const text = getNodeText(match);
  if (!text) return "";
  if (type === "header") {
    return text.charAt(0).toUpperCase() + text.slice(1).replaceAll("-", " ");
  }
  return text;
};

/** Returns the src of the first image node in a TipTap document. */
export const getFirstImageUrl = (doc: TiptapNode): string => {
  const image = findNode(doc, (n) => n.type === "image");
  return image?.attrs?.src ?? "";
};

/** Collect every image src in a TipTap document (in order). */
export const getAllImageUrls = (doc: TiptapNode): string[] => {
  const urls: string[] = [];
  const walk = (node: TiptapNode | undefined) => {
    if (!node || typeof node !== "object") return;
    if (node.type === "image" && node.attrs?.src) urls.push(node.attrs.src);
    node.content?.forEach(walk);
  };
  walk(doc);
  return urls;
};

export const displayTitle = (title: string) => {
  return title.charAt(0).toUpperCase() + title.slice(1).replaceAll("-", " ");
};

export const storyTitle = (story: {
  headline?: string | null;
  title: string;
}) => {
  const headline = story.headline?.trim();
  if (headline) return headline;
  return displayTitle(story.title);
};

export const storyPath = (story: { slug?: string | null; title: string }) => {
  return `/blogs/${story.slug || story.title}`;
};

export const slugify = (value: string) => {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || "story";
};

export const getPlainText = (doc: TiptapNode | null | undefined): string => {
  return getNodeText(doc ?? undefined).replace(/\s+/g, " ").trim();
};

export const getReadingMinutes = (doc: TiptapNode | null | undefined): number => {
  const words = getPlainText(doc).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

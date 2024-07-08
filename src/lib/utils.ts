import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ZodIssue } from "zod";
import { OutputData } from "@editorjs/editorjs";
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

export const getFirstStringFromArray = (array: OutputData, type: string) => {
  let string = array.blocks.filter(
    (val: { type: string }) => val.type === type
  )[0].data.text;
  if (type === "header")
    return (
      string.charAt(0).toUpperCase() + string.slice(1).replaceAll("-", " ")
    );
  return string;
};

export const getFirstImageUrl = (array: OutputData) => {
  const url = array.blocks.filter(
    (val: { type: string }) => val.type === "image"
  )[0].data.file.url;
  return url;
};

export const displayTitle = (title: string) => {
  return title.charAt(0).toUpperCase() + title.slice(1).replaceAll("-", " ");
};

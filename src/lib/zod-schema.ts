import { number, string, z } from "zod";
import { getAllImageUrls } from "@/lib/utils";

export const userSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is reqiured")
      .email({ message: "Must be an email" }),
    password: z.string().min(1, { message: "Password is reqiured" }),
    cpassword: z.string().nullish(),
  })
  .superRefine((data, ctx) => {
    if (
      data.cpassword &&
      data.password !== data.cpassword &&
      data.cpassword !== undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match ",
        path: ["cpassword"],
      });
    }
  });

export const userInfoSchema = z
  .object({
    username: z.nullable(
      string()
        .min(3, { message: "Username must be of minimum 3 characters." })
        .max(30, { message: "username can not exceed 30 characters." })
    ),
    avatarUrl: z.nullable(string().url({ message: "Must be an Url" })),
    fileSize: z.nullable(number()),
    bio: z
      .string()
      .max(160, { message: "Bio can not exceed 160 characters." })
      .nullable()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.fileSize !== null && data.fileSize > 2 * 1024 * 1024) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File size must not exceed 2MB",
        path: ["fileSize"],
      });
    }
  });

export const commentSchema = z.object({
  comment: z.nullable(
    string().max(200, { message: "username can not exceed 200 characters." })
  ),
});

const STATUS = ["Draft", "Published", "Scheduled"] as const;
export const BlogDataSchema = z
  .object({
    id: z.string().optional(),
    title: z
      .string({ required_error: "Title is Must" })
      .max(60, "Must no exceed 60 characters"),
    slug: z.string().max(80).optional(),
    description: z
      .string()
      .max(160, "Keep the description under 160 characters.")
      .optional(),
    coverUrl: z.string().optional().nullable(),
    seriesTitle: z.string().max(60).optional(),
    publishAt: z.string().optional().nullable(),
    customSlug: z.boolean().optional(),
    tags: z.array(z.string().max(24)).max(5).optional(),
    data: z.any(),
    status: z.enum(STATUS),
  })
  .superRefine((data, ctx) => {
    const doc = data.data;
    const hasContent =
      doc && Array.isArray(doc.content) && doc.content.length > 0;
    if (!hasContent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "There must be some content.",
        path: ["data"],
      });
      return;
    }
    if (data.status !== "Draft" && getAllImageUrls(doc).length === 0 && !data.coverUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Add at least one image before publishing.",
        path: ["image"],
      });
    }
    if (data.status === "Scheduled") {
      const when = data.publishAt ? new Date(data.publishAt) : null;
      if (!when || Number.isNaN(when.getTime()) || when.getTime() <= Date.now()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Pick a future date and time to schedule.",
          path: ["publishAt"],
        });
      }
    }
  });

// const accountFormSchema = z.object({
//   email: z
//     .string()
//     .min(2, {
//       message: "Name must be at least 2 characters.",
//     })
//     .max(30, {
//       message: "Name must not be longer than 30 characters.",
//     }),
// });

export const notificationsFormSchema = z.object({
  publisherEmails: z.boolean().default(true).optional(),
  socialEmails: z.boolean().default(false).optional(),
  marketingEmails: z.boolean().default(true).optional(),
  securityEmails: z.boolean().default(false),
});

export const appearanceFormSchema = z.object({
  theme: z
    .enum(["light", "dark"], {
      required_error: "Please select a theme.",
    })
    .default("light"),
});

export const contactFormScehma = z.object({
  email: z
    .string()
    .min(1, "Email is reqiured")
    .email({ message: "Must be an email" }),
  message: z.string().min(30, { message: "Minimum 30 characters are must." }),
});

import { OutputBlockData } from "@editorjs/editorjs";
import { number, string, z } from "zod";

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

const STATUS = ["Draft", "Published"] as const;
export const BlogDataSchema = z
  .object({
    title: z
      .string({ required_error: "Title is Must" })
      .max(40, "Must no exceed 40 characters"),
    data: z.any(),
    status: z.enum(STATUS),
  })
  .superRefine((data, ctx) => {
    const images = data.data?.blocks?.filter(
      (val: OutputBlockData) => val.type === "image"
    );
    if (
      data.data === null ||
      data.data === undefined ||
      data.data.blocks.length === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "There Must be some data.",
        path: ["data"],
      });
    } else if (images.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "There Must be a image even Random",
        path: ["image"],
      });
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

import { z } from "zod";

export const userSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is reqiured")
      .email({ message: "Must be an email" }),
    password: z.string().min(1, { message: "Password is reqiured" }),
    cpassword: z.optional(z.string()),
  })
  .superRefine((data, ctx) => {
    if (data.cpassword && data.password === data.cpassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match ",
        path: ["cpassword"],
      });
    }
  });

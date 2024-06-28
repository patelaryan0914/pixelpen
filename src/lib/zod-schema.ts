import { string, z } from "zod";

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

export const userInfoSchema = z.object({
  username: z.nullable(
    string()
      .min(3, { message: "Username must be of minimum 3 characters." })
      .max(30, { message: "username can not exceed 30 characters." })
  ),
  avatarUrl: z.nullable(string().url({ message: "Must be an Url" })),
});

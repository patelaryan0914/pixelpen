"use client";
import { userInfo } from "@/app/actions";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadFile } from "@/lib/uploadFile";
import { findErrors } from "@/lib/utils";
import { userInfoSchema } from "@/lib/zod-schema";
import { UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { ErrorMessages } from "@/components/error-message";
const Submit = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full mt-4"
      disabled={pending}
      aria-label="saveuserinfo"
    >
      {!pending ? (
        "Save"
      ) : (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
    </Button>
  );
};

const UserInfoUpdate = () => {
  const [error, setError] = useState<any>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const router = useRouter();
  const validateData = async (formdata: FormData) => {
    const file = formdata.get("file-upload") as File | null;
    const usernameRaw = formdata.get("username")?.toString() ?? "";
    const username = usernameRaw.length === 0 ? null : usernameRaw;
    const fileSize = file && file.size > 0 ? file.size : null;
    try {
      const result = await userInfoSchema.safeParseAsync({
        username,
        avatarUrl: null,
        fileSize,
      });
      if (!result.success) {
        return setError(result.error.issues);
      }

      let avatarUrl: string | null = result.data.avatarUrl;
      if (file && file.size > 0) {
        const uploaded = await uploadFile({
          fileName: file.name,
          file,
          object: "avatar",
        });
        if (!uploaded) {
          return setError([
            {
              path: ["fileSize"],
              message: "Upload failed. Use an image up to 2MB and try again.",
            },
          ]);
        }
        avatarUrl = uploaded;
      }

      await userInfo({ username: result.data.username, avatarUrl });
      setError([]);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Failed to save profile:", err);
      setError([
        {
          path: ["username"],
          message: "Something went wrong. Please try again.",
        },
      ]);
    }
  };
  const usernameErrors = findErrors("username", error);
  const fileSizeErrors = findErrors("fileSize", error);
  return (
    <div>
      <form action={validateData}>
        <div className="grid gap-y-2">
          <Label htmlFor="username" className="flex justify-between">
            Username
            <ErrorMessages errors={usernameErrors} />
          </Label>
          <Input name="username" type="string" placeholder="John Doe" />
        </div>
        <div className="mt-1">
          <label
            htmlFor="file-upload"
            className="mb-2 block text-sm font-medium leading-6 text-foreground"
          >
            Avatar photo
          </label>
          <label
            htmlFor="file-upload"
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-input bg-muted/30 px-6 py-8 text-center transition-colors hover:border-primary hover:bg-accent/40"
          >
            <UserCircle2
              className="mx-auto h-11 w-11 text-muted-foreground"
              aria-hidden="true"
            />
            <div className="mt-3 text-sm leading-6 text-muted-foreground">
              <span className="font-semibold text-primary">Upload a file</span>{" "}
              or drag and drop
            </div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              PNG, JPG, GIF up to 10MB
            </p>
            {fileName && (
              <p className="mt-2 max-w-[220px] truncate text-xs font-medium text-foreground">
                {fileName}
              </p>
            )}
            <Input
              id="file-upload"
              name="file-upload"
              type="file"
              accept="image/png,image/jpeg,image/gif"
              className="sr-only"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
          </label>
          <div className="mt-1">
            <ErrorMessages errors={fileSizeErrors} />
          </div>
        </div>
        <Submit />
      </form>
    </div>
  );
};

export default UserInfoUpdate;

"use client";
import { findErrors } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormStatus } from "react-dom";
import { Icons } from "@/components/icons";
import { useState } from "react";
import { userInfoSchema } from "@/lib/zod-schema";
import { uploadFile } from "@/lib/uploadFile";
import { userInfo } from "@/app/actions";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserCircle2 } from "lucide-react";
import { Session } from "@/app/types";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { redirect } from "next/navigation";

const Submit = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full mt-4"
      disabled={pending}
      aria-label="saveinfo"
    >
      {!pending ? (
        "Update Profile"
      ) : (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
    </Button>
  );
};

export function ProfileForm({
  session,
  bio,
}: {
  session: Session;
  bio: string;
}) {
  const [error, setError] = useState<any>([]);
  const [url, setUrl] = useState<string>("");
  const validateData = async (formdata: FormData) => {
    const file: any = formdata.get("file-upload");
    const username =
      formdata.get("username")?.toString().length === 0
        ? null
        : formdata.get("username")?.toString();
    const nextBio = formdata.get("bio")?.toString().trim() || null;
    try {
      const result = await userInfoSchema.safeParseAsync({
        username,
        avatarUrl: formdata.get("fileUrl"),
        fileSize: file.size,
        bio: nextBio,
      });
      if (!result.success) {
        return setError(result.error.issues);
      }
      if (file && file.size > 0) {
        const fileUrl = await uploadFile({
          fileName: file.name,
          file,
          object: "avatar",
        });
        if (fileUrl) {
          setUrl(fileUrl);
          await userInfo({
            username: result.data.username,
            avatarUrl: fileUrl,
            bio: result.data.bio ?? null,
          });
          return;
        }
      }
      await userInfo({
        username: result.data.username,
        avatarUrl: result.data.avatarUrl,
        bio: result.data.bio ?? null,
      });
    } catch (err) {
      console.error("Error in handleFileChange:", err);
    }
  };
  const usernameErrors = findErrors("username", error);
  const fileSizeErrors = findErrors("fileSize", error);
  const bioErrors = findErrors("bio", error);
  return (
    <form action={validateData} className="space-y-8">
      <div className="flex gap-x-4 ">
        <Avatar className="h-20 w-20">
          <AvatarImage src={session.userInfo.avatar} alt="Image" />
        </Avatar>
        <div className="w-full  grid gap-y-2">
          <Label htmlFor="username" className="flex justify-between">
            Username
            <ErrorMessages errors={usernameErrors} />
          </Label>
          <Input
            name="username"
            type="string"
            placeholder="John Doe"
            defaultValue={session.userInfo.username}
          />
        </div>
      </div>
      <div className="grid gap-y-2">
        <Label htmlFor="bio" className="flex justify-between">
          Bio
          <ErrorMessages errors={bioErrors} />
        </Label>
        <Textarea
          id="bio"
          name="bio"
          maxLength={160}
          placeholder="A line about what you write."
          defaultValue={bio}
          className="min-h-[96px]"
        />
        <p className="text-xs text-muted-foreground">
          Shown under your name on stories and your profile. 160 characters.
        </p>
      </div>
      <div className="col-span-full mt-1">
        <label
          htmlFor="file-upload"
          className="mb-2 block text-sm font-medium leading-6 text-foreground"
        >
          Avatar photo
        </label>
        <label
          htmlFor="file-upload"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 px-6 py-10 text-center transition-colors hover:border-primary hover:bg-accent/40"
        >
          {url !== "" ? (
            <Avatar className="h-20 w-20">
              <AvatarImage src={url} alt="Image" />
            </Avatar>
          ) : (
            <UserCircle2
              className="mx-auto h-12 w-12 text-muted-foreground"
              aria-hidden="true"
            />
          )}
          <p className="mt-4 text-sm leading-6 text-foreground">
            <span className="font-semibold text-primary">Upload a file</span>{" "}
            or drag and drop
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            PNG, JPG, GIF up to 2MB
          </p>
          <Input
            id="file-upload"
            name="file-upload"
            type="file"
            accept="image/png,image/jpeg,image/gif"
            className="sr-only"
          />
        </label>
        <div className="mt-1">
          <ErrorMessages errors={fileSizeErrors} />
        </div>
        <Submit />
      </div>
    </form>
  );
}
const ErrorMessages = ({ errors }: { errors: string[] }) => {
  if (errors.length === 0) return null;
  const text = errors[0];
  return <div className="text-red-600 peer">{text}</div>;
};

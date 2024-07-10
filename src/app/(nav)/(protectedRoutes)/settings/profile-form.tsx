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
        "Save"
      ) : (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
    </Button>
  );
};

export function ProfileForm({ session }: { session: Session }) {
  const [error, setError] = useState<any>([]);
  const [url, setUrl] = useState<string>("");
  const validateData = async (formdata: FormData) => {
    const file: any = formdata.get("file-upload");
    const username =
      formdata.get("username")?.toString().length === 0
        ? null
        : formdata.get("username")?.toString();
    try {
      const result = await userInfoSchema.safeParseAsync({
        username,
        avatarUrl: formdata.get("fileUrl"),
        fileSize: file.size,
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
          formdata.append("fileUrl", fileUrl);
        }
      }
      await userInfo(result.data);
    } catch (err) {
      console.error("Error in handleFileChange:", err);
    }
  };
  const usernameErrors = findErrors("username", error);
  const fileSizeErrors = findErrors("fileSize", error);
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
      <div className="col-span-full mt-1">
        <label
          htmlFor="cover-photo"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Avatar photo
        </label>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
          <div className="text-center">
            {url !== "" ? (
              <Avatar className="h-20 w-20">
                <AvatarImage src={url} alt="Image" />
              </Avatar>
            ) : (
              <UserCircle2
                className="mx-auto h-12 w-12 text-gray-300"
                aria-hidden="true"
              />
            )}

            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semiboldfocus-within:outline-none focus-within:ring-2"
              >
                <span className="font-bold">Upload a file</span>
                <Input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">
              PNG, JPG, GIF up to 10MB
            </p>
            <ErrorMessages errors={fileSizeErrors} />
          </div>
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

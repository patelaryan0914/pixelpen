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
    <Button type="submit" className="w-full mt-4" disabled={pending}>
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
  const router = useRouter();
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
        if (fileUrl) formdata.append("fileUrl", fileUrl);
      }
      await userInfo(result.data);
      router.push("/");
    } catch (err) {
      console.error("Error in handleFileChange:", err);
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
        <div className="col-span-full mt-1">
          <label
            htmlFor="cover-photo"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Avatar photo
          </label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
              <UserCircle2
                className="mx-auto h-12 w-12 text-gray-300"
                aria-hidden="true"
              />
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
        </div>
        <Submit />
      </form>
    </div>
  );
};

export default UserInfoUpdate;

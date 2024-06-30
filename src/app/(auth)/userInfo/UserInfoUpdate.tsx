"use client";
import { userInfo } from "@/app/actions";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadFile } from "@/lib/uploadFile";
import { userInfoSchema } from "@/lib/zod-schema";
import { UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
const Submit = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full mt-4" aria-disabled={pending}>
      {!pending ? (
        "Save"
      ) : (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
    </Button>
  );
};

const UserInfoUpdate = () => {
  const router = useRouter();
  const validateData = async (formdata: FormData) => {
    const file: any = formdata.get("file-upload");
    const username =
      formdata.get("username")?.toString().length === 0
        ? null
        : formdata.get("username")?.toString();
    try {
      if (file && file.size > 0) {
        if (file.size > 2 * 1024 * 1024) {
          throw new Error("File size must not exceed 2MB");
        }
        const fileUrl = await uploadFile({
          fileName: file.name,
          file,
          object: "avatar",
        });
        if (fileUrl) formdata.append("fileUrl", fileUrl);
      }
      const result = await userInfoSchema.safeParseAsync({
        username,
        avatarUrl: formdata.get("fileUrl"),
      });
      if (result.success == true) await userInfo(result.data);
      router.push("/");
    } catch (err) {
      console.error("Error in handleFileChange:", err);
    }
  };
  return (
    <div>
      <form action={validateData}>
        <div className="grid gap-y-2">
          <Label htmlFor="username" className="flex justify-between">
            Username
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
            </div>
          </div>
        </div>
        <Submit />
      </form>
    </div>
  );
};

export default UserInfoUpdate;

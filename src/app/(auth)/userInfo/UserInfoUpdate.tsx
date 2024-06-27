import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle2 } from "lucide-react";
import React from "react";
const UserInfoUpdate = () => {
  return (
    <div>
      <div className="grid gap-y-2">
        <Label htmlFor="email" className="flex justify-between">
          Username
        </Label>
        <Input name="email" type="string" placeholder="John Doe" />
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
                <input
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
      <Button className="w-full mt-4">Save</Button>
    </div>
  );
};

export default UserInfoUpdate;

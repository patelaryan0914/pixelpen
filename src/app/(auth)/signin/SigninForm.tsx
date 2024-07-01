"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { findErrors } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import { signIn } from "@/app/actions";
import { userSchema } from "@/lib/zod-schema";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
const Submit = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {!pending ? (
        "Sign In"
      ) : (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
    </Button>
  );
};

const SigninForm = () => {
  const [error, setError] = useState<any>([]);
  const { toast } = useToast();
  const router = useRouter();
  const validateData = async (formdata: FormData) => {
    const result = await userSchema.safeParseAsync({
      email: formdata.get("email"),
      password: formdata.get("password"),
    });
    if (!result.success) {
      return setError(result.error.issues);
    }
    const serverResult = await signIn(formdata);
    if (serverResult?.error)
      return toast({
        variant: "destructive",
        title: serverResult?.error,
      });
    toast({ title: "User Logged in Successfully" });
    setError([]);
    router.push("/");
  };
  const emailErrors = findErrors("email", error);
  const passwordErrors = findErrors("password", error);
  return (
    <>
      <div className="grid gap-4">
        <form action={validateData}>
          <div className="grid gap-y-2">
            <Label htmlFor="email" className="flex justify-between">
              Email <ErrorMessages errors={emailErrors} />
            </Label>
            <Input name="email" type="string" placeholder="m@example.com" />
          </div>
          <div className="grid gap-y-2 my-4">
            <Label htmlFor="password" className="flex justify-between">
              Password
              <ErrorMessages errors={passwordErrors} />
            </Label>
            <Input name="password" type="password" />
          </div>
          <Submit />
        </form>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Dont have an Account?{" "}
        <Link href="/signup" className="underline">
          Sign Up
        </Link>
      </div>
    </>
  );
};

export default SigninForm;

const ErrorMessages = ({ errors }: { errors: string[] }) => {
  if (errors.length === 0) return null;
  const text = errors[0];
  return <div className="text-red-600 peer">{text}</div>;
};

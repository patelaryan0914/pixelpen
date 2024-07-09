"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { findErrors } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import signUp from "@/app/actions";
import { userSchema } from "@/lib/zod-schema";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { ErrorMessages } from "@/components/error-message";
const Submit = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {!pending ? (
        "Sign Up"
      ) : (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
    </Button>
  );
};

const SignupForm = () => {
  const [error, setError] = useState<any>([]);
  const { toast } = useToast();
  const router = useRouter();
  const validateData = async (formdata: FormData) => {
    const result = await userSchema.safeParseAsync({
      email: formdata.get("email"),
      password: formdata.get("password"),
      cpassword: formdata.get("cpassword"),
    });
    if (!result.success) return setError(result.error.issues);
    const serverResult = await signUp(formdata);
    if (serverResult?.error)
      toast({
        variant: "destructive",
        title: serverResult?.error,
      });
    toast({ title: "User Registered Successfully" });
    setError([]);
    router.push("/userInfo");
  };
  const emailErrors = findErrors("email", error);
  const passwordErrors = findErrors("password", error);
  const cpassword = findErrors("cpassword", error);
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
          <div className="grid gap-y-2 my-4">
            <Label htmlFor="cpassword" className="flex justify-between">
              Confirm Password
              <ErrorMessages errors={cpassword} />
            </Label>
            <Input name="cpassword" type="password" />
          </div>
          <Submit />
        </form>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Already have an Account?{" "}
        <Link href="/signin" className="underline">
          Sign In
        </Link>
      </div>
    </>
  );
};

export default SignupForm;

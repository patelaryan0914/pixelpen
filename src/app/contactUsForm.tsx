"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { findErrors } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import { contactUs, signIn } from "@/app/actions";
import { contactFormScehma } from "@/lib/zod-schema";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { ErrorMessages } from "@/components/error-message";
import { Textarea } from "@/components/ui/textarea";
const Submit = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      variant="default"
      type="submit"
      className="w-full"
      disabled={pending}
      aria-label="signin"
    >
      {!pending ? (
        "Sign In"
      ) : (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
    </Button>
  );
};

const ContactUsForm = () => {
  const [error, setError] = useState<any>([]);
  const { toast } = useToast();
  const router = useRouter();
  const validateData = async (formdata: FormData) => {
    const result = await contactFormScehma.safeParseAsync({
      email: formdata.get("email"),
      message: formdata.get("message"),
    });
    if (!result.success) {
      return setError(result.error.issues);
    }
    const serverResult = await contactUs(formdata);
    if (serverResult?.status === 200)
      toast({ title: "Thank You For Your Feedback" });
    setError([]);
    router.push("/");
  };
  const emailErrors = findErrors("email", error);
  const messageErrors = findErrors("message", error);
  return (
    <>
      <div className="grid gap-4">
        <form action={validateData}>
          <div className="grid gap-y-2">
            <Label htmlFor="email" className="flex justify-between">
              Email <ErrorMessages errors={emailErrors} />
            </Label>
            <Input
              name="email"
              type="string"
              placeholder="m@example.com"
              className="text-foreground"
            />
          </div>
          <div className="grid gap-y-2 my-4">
            <Label htmlFor="message" className="flex justify-between">
              Message
            </Label>
            <Textarea name="message" className="text-foreground" />
            <ErrorMessages errors={messageErrors} />
          </div>
          <Submit />
        </form>
      </div>
    </>
  );
};

export default ContactUsForm;

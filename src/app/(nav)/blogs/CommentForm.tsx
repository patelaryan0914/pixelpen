"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { comment } from "@/app/actions";
import { commentSchema } from "@/lib/zod-schema";
import { useState } from "react";
import { findErrors } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import { Icons } from "@/components/icons";
const CommentButton = ({ disabled }: { disabled: boolean }) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="mt-2 w-full"
      disabled={!disabled || pending}
      aria-label="comment"
    >
      {!pending ? (
        "Comment"
      ) : (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
    </Button>
  );
};

const CommentForm = ({
  disabled,
  blogId,
}: {
  disabled: boolean;
  blogId: string;
}) => {
  const [error, setError] = useState<any>([]);
  const validateData = async (formData: FormData) => {
    const result = await commentSchema.safeParseAsync({
      comment: formData.get("comment"),
    });
    if (!result.success) return setError(result.error.issues);
    formData.append("blogId", blogId);
    if (result.data.comment == null) return;
    await comment(formData);
    setError([]);
  };
  const commentErrors = findErrors("comment", error);
  return (
    <>
      <form action={validateData}>
        <div className="flex justify-start">
          <ErrorMessages errors={commentErrors} />
          <Textarea className="mt-2" name="comment" disabled={!disabled} />
        </div>
        <CommentButton disabled={disabled} />
      </form>
    </>
  );
};

export default CommentForm;

const ErrorMessages = ({ errors }: { errors: string[] }) => {
  if (errors.length === 0) return null;
  const text = errors[0];
  return <div className="text-red-600 peer">{text}</div>;
};

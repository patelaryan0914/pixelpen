"use client";
import * as z from "zod";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { Icons } from "@/components/icons";
import { findErrors } from "@/lib/utils";
import { addFavoriteTopics } from "@/app/actions";

const Submit = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {!pending ? (
        "Add"
      ) : (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
    </Button>
  );
};

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  id: z.string(),
  disable: z.boolean().optional(),
});

const FormSchema = z.object({
  tags: z.array(optionSchema).min(1),
});

const AddInterestedTopics = ({
  topics,
}: {
  topics: { id: string; tag: string }[];
}) => {
  const defaultvalues: Option[] = [];
  topics.forEach((vals: { id: string; tag: string }) =>
    defaultvalues.push({
      label: vals.tag.charAt(0).toUpperCase() + vals.tag.slice(1),
      value: vals.tag,
      id: vals.id,
    })
  );
  const [error, setError] = useState<any>([]);
  const [tags, setTags] = useState<Option[] | null>([]);
  async function onSubmit() {
    const result = await FormSchema.safeParseAsync({
      tags,
    });
    if (!result.success) {
      return setError(result.error.issues);
    }
    if (result.success) {
      const response = await addFavoriteTopics(tags);
      if (response?.status === 200) toast({ title: "Topics Added" });
    }
  }
  const tagsError = findErrors("tags", error);

  return (
    <>
      <form action={onSubmit} className="w-full space-y-6">
        <ErrorMessages errors={tagsError} />
        <Submit />
        <MultipleSelector
          defaultOptions={defaultvalues}
          onChange={(val: Option[]) => setTags(val)}
          placeholder="Select the blog related tags."
          hidePlaceholderWhenSelected
          triggerSearchOnFocus={true}
          emptyIndicator={
            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
              No results found.
            </p>
          }
        />
      </form>
    </>
  );
};
export default AddInterestedTopics;

const ErrorMessages = ({ errors }: { errors: string[] }) => {
  if (errors.length === 0) return null;
  const text = errors[0];
  return <div className="text-red-600 peer">{text}</div>;
};

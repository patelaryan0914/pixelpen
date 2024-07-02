"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

const Delete = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="destructive"
      size="sm"
      className="w-full"
      aria-disabled={pending}
    >
      {!pending ? (
        "Delete"
      ) : (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
    </Button>
  );
};

export default Delete;

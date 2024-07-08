import { Icons } from "@/components/icons";
import React from "react";
const loading = () => {
  return (
    <div className="absolute top-1/2 left-1/2">
      <Icons.spinner className="mr-2 h-12 w-12 animate-spin" />
    </div>
  );
};

export default loading;

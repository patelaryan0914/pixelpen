import { Icons } from "@/components/icons";
import React from "react";
const loading = () => {
  return (
    <div className="h-screen w-screen">
      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
    </div>
  );
};

export default loading;

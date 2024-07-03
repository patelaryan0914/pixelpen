import { Icons } from "@/components/icons";
import React from "react";
const loading = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Icons.spinner className="mr-2 h-12 w-12 animate-spin" />
    </div>
  );
};

export default loading;

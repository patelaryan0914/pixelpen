import { getSession } from "@/app/actions";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { Icons } from "@/components/icons";
import { redirect } from "next/navigation";
import { AuthRequiredError } from "@/lib/exceptions";
export const metadata: Metadata = {
  title: "Publish Blog",
  description: "Publish Your own blog.",
};
const EditorJs = dynamic(() => import("./Editor"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen flex justify-center items-center">
      <Icons.spinner className="mr-2 h-12 w-12 animate-spin" />
    </div>
  ),
});
const Page = async () => {
  const session = await getSession();
  if (!session) throw new AuthRequiredError();
  return (
    <>
      <div className=" w-screen h-screen  lg:hidden">
        <h1 className="h-screen w-full flex justify-center items-center px-4 text-red-700">
          *Access This page using Laptop or screen size greater than 1024px.
        </h1>
      </div>
      <div className="hidden lg:block">
        <div className="h-screen flex flex-col justify-center items-center ">
          <EditorJs />
        </div>
      </div>
    </>
  );
};

export default Page;

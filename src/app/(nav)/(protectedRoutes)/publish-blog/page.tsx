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
const BlogEditor = dynamic(() => import("./Editor"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <Icons.spinner className="h-10 w-10 animate-spin text-muted-foreground" />
    </div>
  ),
});
const Page = async () => {
  const session = await getSession();
  if (!session) throw new AuthRequiredError();
  return (
    <div className="min-h-screen">
      <BlogEditor />
    </div>
  );
};

export default Page;

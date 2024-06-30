import { getSession } from "@/app/actions";
import { AuthRequired } from "@/lib/exceptions";
import dynamic from "next/dynamic";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publish Blog",
  description: "Publish Your own blog.",
};

const BlogEditor = dynamic(() => import("./BlogEditor"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
const Editor = async () => {
  const session = await getSession();
  if (!session) throw new AuthRequired();
  return (
    <div className="flex flex-col justify-center items-center mt-4">
      <BlogEditor />
    </div>
  );
};

export default Editor;

import { getSession } from "@/app/actions";
import { AuthRequired } from "@/lib/exceptions";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { Icons } from "@/components/icons";
export const metadata: Metadata = {
  title: "Publish Blog",
  description: "Publish Your own blog.",
};

// const BlogEditor = dynamic(() => import("./BlogEditor"), {
//   ssr: false,
//   loading: () => (
//     <div className="h-screen w-screen flex justify-center items-center">
//       <Icons.spinner className="mr-2 h-12 w-12 animate-spin" />
//     </div>
//   ),
// });
const EditorJs = dynamic(() => import("./Editor"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen flex justify-center items-center">
      <Icons.spinner className="mr-2 h-12 w-12 animate-spin" />
    </div>
  ),
});
const Editor = async () => {
  const session = await getSession();
  if (!session) throw new AuthRequired();
  return (
    <div className="flex flex-col justify-center items-center mt-4">
      <EditorJs />
    </div>
  );
};

export default Editor;

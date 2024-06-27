"use client";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { Button } from "@/components/ui/button";
const BlogEditor = () => {
  const editor = useCreateBlockNote();
  const saveBlogToDb = (status: string) => {
    console.log(status);
  };
  return (
    <>
      <div className="w-2/5 flex justify-between ">
        <h1 className="text-slate-500 text-sm mb-5">
          *The Text written in the first block will be considered as Title.
        </h1>
        <div className="flex gap-2">
          <Button size={"sm"} onClick={() => saveBlogToDb("Draft")}>
            Save
          </Button>
          <Button size={"sm"} onClick={() => saveBlogToDb("Publish")}>
            Publish
          </Button>
        </div>
      </div>
      <BlockNoteView
        theme={"light"}
        editor={editor}
        className="w-full lg:w-4/5 xl:w-2/5"
        data-changing-font-demo
      />
    </>
  );
};

export default BlogEditor;

"use client";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
const BlogEditor = () => {
  const editor = useCreateBlockNote();
  return (
    <>
      <BlockNoteView
        theme={"light"}
        editor={editor}
        className="w-full sm:w-2/5"
        data-changing-font-demo
      />
    </>
  );
};

export default BlogEditor;

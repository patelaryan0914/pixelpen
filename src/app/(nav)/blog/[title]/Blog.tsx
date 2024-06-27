"use client";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
const Blog = ({ data }: any) => {
  const editor = useCreateBlockNote(data.content);
  return (
    <BlockNoteView
      theme={"light"}
      editor={editor}
      editable={false}
      className="w-full lg:w-4/5 xl:w-2/5"
    />
  );
};

export default Blog;

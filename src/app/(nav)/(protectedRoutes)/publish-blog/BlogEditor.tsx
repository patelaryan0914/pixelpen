"use client";
import { useState } from "react";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/lib/uploadFile";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
const BlogEditor = () => {
  const [loading, setLoading] = useState<Boolean>(false);
  async function uploadFileForBlog(
    file: File
  ): Promise<string | Record<string, any>> {
    if (file && file.size > 0) {
      if (file.size > 2 * 1024 * 1024) {
        throw new Error("File size must not exceed 2MB");
      }
      const fileUrl = await uploadFile({
        fileName: file.name as string,
        file,
        object: "blog-images",
      });
      return fileUrl as string;
    } else {
      return { error: "File is Invalid" };
    }
  }
  const editor = useCreateBlockNote({ uploadFile: uploadFileForBlog });
  const saveBlogToDb = async (status: string) => {
    setLoading(true);
    const save = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`,
      { content: editor.document, status },
      { withCredentials: true }
    );
    if (save.status == 200) setLoading(false);
    if (status === "Draft")
      return toast({
        title: "Blog is saved as Draft you can edit it in Manage Blog Section",
      });
    return toast({
      title: "Your Blog is Published Viewers can View your blog",
    });
  };
  return (
    <>
      <div className="w-4/5 xl:w-2/5 flex flex-col sm:flex-row justify-evenly sm:justify-between ">
        <h1 className="text-slate-500 text-sm mb-5">
          *The Text written in the first block will be considered as Title.
        </h1>
        <div className="flex justify-between sm:justify-center gap-2">
          <Button size={"sm"} onClick={() => saveBlogToDb("Draft")}>
            {!loading ? (
              "Save"
            ) : (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
          </Button>
          <Button size={"sm"} onClick={() => saveBlogToDb("Published")}>
            {!loading ? (
              "Published"
            ) : (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
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

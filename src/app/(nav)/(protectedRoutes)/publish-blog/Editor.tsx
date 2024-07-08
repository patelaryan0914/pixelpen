"use client";
import React, { useState } from "react";
import { OutputData } from "@editorjs/editorjs";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import EditorJsRenderer from "../EditorJsRenderer";
import EditorBlock from "./EditorBlock";
const Editor = () => {
  const [loading, setLoading] = useState<Boolean>(false);
  const [data, setData] = useState<OutputData>();
  const saveBlogToDb = async (status: string) => {
    setLoading(true);
    const save = await axios.post(
      `/api/blog`,
      { content: data, status },
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
      <div className="w-4/5 xl:w-2/5 my-2 flex flex-col sm:flex-row justify-evenly sm:justify-between items-center">
        <h1 className="text-slate-500 text-sm ">
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
      <div className="h-screen w-full grid grid-cols-2">
        <div className="w-full flex flex-col items-center border rounded-lg ">
          <p className="text-xl font-bold my-2 ">Editor</p>
          <EditorBlock
            data={data}
            onChange={setData}
            holder="editorjs-container"
          />
        </div>
        <div className="w-full flex flex-col items-center border rounded-lg">
          <p className="text-xl font-bold my-2 ">Preview</p>

          {data && (
            <div className="w-full px-4">
              <EditorJsRenderer data={data} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Editor;

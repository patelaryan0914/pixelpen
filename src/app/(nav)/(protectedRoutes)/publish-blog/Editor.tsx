"use client";
import React, { memo, useState, useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { editorConfig } from "@/lib/editorJsPlugins";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
const Editor = () => {
  const [loading, setLoading] = useState<Boolean>(false);
  const [data, setData] = useState<OutputData>();
  const ref = useRef<EditorJS>();
  useEffect(() => {
    if (!ref.current) {
      try {
        const editor = new EditorJS({
          holder: "editor-js",
          tools: editorConfig,
          async onChange(api, event) {
            const data = await api.saver.save();
            setData(data);
          },
          hideToolbar: false,
        });
        ref.current = editor;
      } catch (error) {
        console.log(error);
      }
    }
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);
  const saveBlogToDb = async (status: string) => {
    console.log(status, data);
    // setLoading(true);
    // const save = await axios.post(
    //   "http://localhost:3000/api/blog",
    //   { content: data?.blocks, status },
    //   { withCredentials: true }
    // );
    // if (save.status == 200) setLoading(false);
    // if (status === "Draft")
    //   return toast({
    //     title: "Blog is saved as Draft you can edit it in Manage Blog Section",
    //   });
    // return toast({
    //   title: "Your Blog is Published Viewers can View your blog",
    // });
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
      <div id="editor-js" className="prose w-4/5 xl:w-2/5 " />
    </>
  );
};

export default memo(Editor);

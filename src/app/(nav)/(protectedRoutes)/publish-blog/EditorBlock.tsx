import React, { memo, useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { editorConfig } from "@/lib/editorJsPlugins";
import { EditorProps } from "@/app/types";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { findErrors } from "@/lib/utils";
import { ErrorMessages } from "@/components/error-message";

const Editor = ({ data, onChange, holder, setTitle, error }: EditorProps) => {
  const ref = useRef<EditorJS>();
  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        tools: editorConfig,
        data,
        async onChange(api, event) {
          const data = await api.saver.save();
          onChange(data);
        },
        hideToolbar: false,
      });
      ref.current = editor;
    }
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const titleErrors = findErrors("title", error);
  const dataErrors = findErrors("data", error);
  const imageErrors = findErrors("image", error);
  return (
    <>
      <div className="w-4/5">
        <Label
          htmlFor="title"
          className="justify-self-start flex justify-between font-serif"
        >
          Title
          <ErrorMessages errors={titleErrors} />
        </Label>
        <Textarea
          id="title"
          className="w-full text-4xl font-serif font-bold h-auto focus-visible:ring-transparent"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <ErrorMessages errors={dataErrors} />
      <ErrorMessages errors={imageErrors} />
      <div id={holder} className="mt-4 w-full prose font-serif" />
    </>
  );
};

export default memo(Editor);

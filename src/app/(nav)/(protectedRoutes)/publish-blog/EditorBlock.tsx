import React, { memo, useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { editorConfig } from "@/lib/editorJsPlugins";
import { EditorProps } from "@/app/types";

const Editor = ({ data, onChange, holder }: EditorProps) => {
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
  }, []);
  return <div id={holder} className="w-full prose " />;
};

export default memo(Editor);

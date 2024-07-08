import { BlockToolData, OutputBlockData, OutputData } from "@editorjs/editorjs";
import React from "react";
import editorJsHtml from "editorjs-html";
const EditorJsToHtml = editorJsHtml({
  delimiter: (block: OutputBlockData<string>) => {
    return <p className="flex justify-center text-xl">* * *</p>;
  },
});

type Props = {
  data: OutputData;
};
type ParsedContent = string | JSX.Element;

const EditorJsRenderer = ({ data }: Props) => {
  const html = EditorJsToHtml.parse(data) as ParsedContent[];
  return (
    <div className="prose max-w-full text-primary">
      {html.map((item, index) => {
        if (typeof item === "string") {
          return (
            <div dangerouslySetInnerHTML={{ __html: item }} key={index}></div>
          );
        }
        return item;
      })}
    </div>
  );
};

export default EditorJsRenderer;

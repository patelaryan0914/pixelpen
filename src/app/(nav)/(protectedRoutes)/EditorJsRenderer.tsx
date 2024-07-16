import { OutputBlockData, OutputData } from "@editorjs/editorjs";
import React from "react";
import editorJsHtml from "editorjs-html";
import DynamicImage from "@/components/dynamic-image";
const EditorJsToHtml = editorJsHtml({
  delimiter: () => {
    return <p className="flex justify-center text-xl">* * *</p>;
  },
  image: (block: OutputBlockData<string>) => {
    return <DynamicImage url={block.data.file.url} />;
  },
});

type Props = {
  data: OutputData;
  title: string;
};
type ParsedContent = string | JSX.Element;

const EditorJsRenderer = ({ data, title }: Props) => {
  const html = EditorJsToHtml.parse(data) as ParsedContent[];
  return (
    <div className="prose max-w-full text-primary font-serif ">
      <h1 className="text-4xl">{title}</h1>
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

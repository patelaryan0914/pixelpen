import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Warning from "@editorjs/warning";
import Delimiter from "@editorjs/delimiter";
import NestedList from "@editorjs/nested-list";
import Checklist from "@editorjs/checklist";
import Image from "@editorjs/image";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import Code from "@editorjs/code";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import Underline from "@editorjs/underline";
import AlignmentTuneTool from "editorjs-text-alignment-blocktune";
import { uploadFile } from "./uploadFile";

export const editorConfig = {
  header: {
    class: Header,
    // tunes: ["anyTuneName"],
    config: {
      placeholder: "Enter a header",
      levels: [2, 3, 4, 5, 6],
      defaultLevel: 2,
    },
  },
  paragraph: {
    class: Paragraph,
    // tunes: ["anyTuneName"],
    config: { placeholder: "Enter a Paragraph" },
    inlineToolbar: true,
  },
  quote: {
    class: Quote,
    config: {
      quotePlaceholder: "Enter a quote",
      captionPlaceholder: "Quote's author",
    },
  },
  warning: {
    class: Warning,
    config: {
      titlePlaceholder: "Title",
      messagePlaceholder: "Message",
    },
  },
  delimiter: Delimiter,
  list: {
    class: NestedList,
    inlineToolbar: true,
    config: {
      defaultStyle: "unordered",
    },
  },
  checklist: {
    class: Checklist,
    inlineToolbar: true,
  },
  image: {
    class: Image,
    config: {
      uploader: { uploadByFile: uploadFileForBlog },
    },
  },
  embed: Embed,
  table: {
    class: Table,
    config: {
      rows: 2,
      cols: 3,
    },
  },
  code: Code,
  Marker: Marker,
  inlineCode: InlineCode,
  underline: Underline,
  // anyTuneName: {
  //   class: AlignmentTuneTool,
  //   config: {
  //     default: "left",
  //     blocks: {
  //       header: "left",
  //       list: "left",
  //     },
  //   },
  // },
};

async function uploadFileForBlog(file: File) {
  if (file && file.size > 0) {
    if (file.size > 2 * 1024 * 1024) {
      return {
        success: 0,
      };
    }
    const fileUrl = await uploadFile({
      fileName: file.name as string,
      file,
      object: "blog-images",
    });
    console.log(fileUrl);
    return {
      success: 1,
      file: {
        url: fileUrl,
      },
    };
  } else {
    return {
      success: 0,
    };
  }
}

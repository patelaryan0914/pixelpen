"use client";

import { useRef, useCallback } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  FileCode,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  ImagePlus,
  Link2,
  Undo2,
  Redo2,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/lib/uploadFile";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles } from "lucide-react";

type Props = {
  content?: any;
  onChange: (json: any) => void;
};

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40",
        active && "bg-primary/10 text-primary hover:bg-primary/15"
      )}
    >
      {children}
    </button>
  );
}

function WritingHelp({ editor }: { editor: Editor }) {
  const [busy, setBusy] = useState(false);
  const range = useRef<{ from: number; to: number } | null>(null);

  const run = async (mode: "shorter" | "clearer" | "warmer" | "continue") => {
    const saved = range.current ?? {
      from: editor.state.selection.from,
      to: editor.state.selection.to,
    };
    const selected = editor.state.doc.textBetween(saved.from, saved.to, "\n").trim();
    const source =
      mode === "continue" && !selected
        ? editor.state.doc.textBetween(0, saved.from, "\n").trim().slice(-2000)
        : selected;
    if (!source || (mode !== "continue" && saved.from === saved.to)) {
      toast(
        mode === "continue"
          ? "Write a few sentences first."
          : "Select a passage to rewrite."
      );
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rewrite", mode, text: source }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "Writing help failed.");
        return;
      }
      const next = String(data.text ?? "").trim();
      if (!next) return;
      if (mode === "continue") {
        editor
          .chain()
          .focus()
          .insertContentAt(saved.to, {
            type: "paragraph",
            content: [{ type: "text", text: next }],
          })
          .run();
      } else {
        editor
          .chain()
          .focus()
          .insertContentAt(
            { from: saved.from, to: saved.to },
            { type: "text", text: next.replace(/\s+/g, " ") }
          )
          .run();
      }
    } catch {
      toast.error("Writing help failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={busy}
          aria-label="Writing help"
          title="Writing help"
          onPointerDown={() => {
            range.current = {
              from: editor.state.selection.from,
              to: editor.state.selection.to,
            };
          }}
          className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 text-primary" />
          )}
          <span className="text-xs font-semibold">AI</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onSelect={() => run("continue")}>
          Continue
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => run("shorter")}>
          Make shorter
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => run("clearer")}>
          Make clearer
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => run("warmer")}>
          Warmer tone
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Toolbar({
  editor,
  onPickImage,
  uploading,
}: {
  editor: Editor | null;
  onPickImage: () => void;
  uploading: boolean;
}) {
  if (!editor) return null;

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  return (
    <div className="sticky top-16 z-10 flex flex-wrap items-center gap-1 border-y bg-background/90 px-1 py-2 backdrop-blur">
      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Inline code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="h-4 w-4" />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton
        label="Heading 1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Code block"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <FileCode className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Divider"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="h-4 w-4" />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton label="Link" active={editor.isActive("link")} onClick={setLink}>
        <Link2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Insert image" onClick={onPickImage} disabled={uploading}>
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ImagePlus className="h-4 w-4" />
        )}
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton
        label="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 className="h-4 w-4" />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-border" />
      <WritingHelp editor={editor} />
    </div>
  );
}

export default function TiptapEditor({ content, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({
        placeholder: "Tell your story…",
      }),
    ],
    content: content ?? "",
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none min-h-[50vh] px-0 py-4 font-serif focus:outline-none prose-h1:text-4xl prose-h1:font-medium dark:prose-invert dark:text-foreground dark:prose-headings:text-foreground dark:prose-p:text-foreground dark:prose-li:text-foreground dark:prose-strong:text-foreground",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
  });

  const handleFile = useCallback(
    async (file: File) => {
      if (!editor) return;
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be 2MB or smaller.");
        return;
      }
      setUploading(true);
      try {
        const url = await uploadFile({
          fileName: file.name,
          file,
          object: "blog-images",
        });
        if (url) {
          editor.chain().focus().setImage({ src: url, alt: file.name }).run();
        } else {
          toast.error("Image upload failed.");
        }
      } finally {
        setUploading(false);
      }
    },
    [editor]
  );

  return (
    <div className="flex w-full flex-col">
      <Toolbar
        editor={editor}
        uploading={uploading}
        onPickImage={() => fileInputRef.current?.click()}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <EditorContent editor={editor} />
    </div>
  );
}

import React from "react";
import { cn } from "@/lib/utils";
import type { TiptapNode } from "@/lib/utils";

type Mark = { type: string; attrs?: Record<string, any> };

function renderText(node: TiptapNode, key: React.Key) {
  let element: React.ReactNode = node.text ?? "";
  const marks = ((node as any).marks as Mark[]) ?? [];

  for (const mark of marks) {
    switch (mark.type) {
      case "bold":
        element = <strong>{element}</strong>;
        break;
      case "italic":
        element = <em>{element}</em>;
        break;
      case "underline":
        element = <u>{element}</u>;
        break;
      case "strike":
        element = <s>{element}</s>;
        break;
      case "code":
        element = <code>{element}</code>;
        break;
      case "link":
        element = (
          <a
            href={mark.attrs?.href}
            target={mark.attrs?.target ?? "_blank"}
            rel="noopener noreferrer nofollow"
            className="text-primary underline underline-offset-2"
          >
            {element}
          </a>
        );
        break;
      default:
        break;
    }
  }

  return <React.Fragment key={key}>{element}</React.Fragment>;
}

function renderChildren(nodes?: TiptapNode[]) {
  if (!Array.isArray(nodes)) return null;
  return nodes.map((child, index) => renderNode(child, index));
}

function renderNode(node: TiptapNode, key: React.Key): React.ReactNode {
  switch (node.type) {
    case "text":
      return renderText(node, key);
    case "paragraph":
      return <p key={key}>{renderChildren(node.content)}</p>;
    case "heading": {
      const level = Math.min(Math.max(node.attrs?.level ?? 2, 1), 6);
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      return <Tag key={key}>{renderChildren(node.content)}</Tag>;
    }
    case "bulletList":
      return <ul key={key}>{renderChildren(node.content)}</ul>;
    case "orderedList":
      return (
        <ol key={key} start={node.attrs?.start ?? 1}>
          {renderChildren(node.content)}
        </ol>
      );
    case "listItem":
      return <li key={key}>{renderChildren(node.content)}</li>;
    case "blockquote":
      return <blockquote key={key}>{renderChildren(node.content)}</blockquote>;
    case "codeBlock":
      return (
        <pre key={key}>
          <code>{renderChildren(node.content)}</code>
        </pre>
      );
    case "horizontalRule":
      return <hr key={key} />;
    case "hardBreak":
      return <br key={key} />;
    case "image":
      // eslint-disable-next-line @next/next/no-img-element
      return (
        <img
          key={key}
          src={node.attrs?.src}
          alt={node.attrs?.alt ?? ""}
          title={node.attrs?.title ?? undefined}
          className="mx-auto rounded-xl"
        />
      );
    case "doc":
      return <React.Fragment key={key}>{renderChildren(node.content)}</React.Fragment>;
    default:
      return node.content ? (
        <React.Fragment key={key}>
          {renderChildren(node.content)}
        </React.Fragment>
      ) : null;
  }
}

export default function TiptapRenderer({
  doc,
  title,
  className,
}: {
  doc: TiptapNode | null | undefined;
  title?: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "prose prose-neutral max-w-full font-serif prose-headings:font-serif prose-a:text-primary prose-img:rounded-xl dark:prose-invert dark:text-foreground dark:prose-headings:text-foreground dark:prose-p:text-foreground dark:prose-li:text-foreground dark:prose-strong:text-foreground dark:prose-blockquote:text-foreground",
        className
      )}
    >
      {title ? <h1 className="mb-6 text-4xl">{title}</h1> : null}
      {doc ? renderChildren(doc.content) : null}
    </article>
  );
}

import { getSession } from "@/app/actions";
import { groqComplete } from "@/lib/groq";
import { slugify } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

const MODES = {
  shorter:
    "Rewrite the passage so it is about half as long. Keep the meaning and the writer's voice. Return only the rewritten passage.",
  clearer:
    "Rewrite the passage in plainer sentences. Keep the meaning and the writer's voice. Return only the rewritten passage.",
  warmer:
    "Rewrite the passage with a warmer, more personal editorial tone. Keep the facts. Return only the rewritten passage.",
  continue:
    "Write the next two to four sentences that follow this passage. Match the voice. Do not repeat the passage. Return only the new sentences.",
} as const;

function stripFences(value: string) {
  return value
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
}

function extractJson(value: string) {
  try {
    JSON.parse(value);
    return value;
  } catch {
    const start = value.indexOf("{");
    const end = value.lastIndexOf("}");
    if (start >= 0 && end > start) return value.slice(start, end + 1);
    throw new Error("bad json");
  }
}

function cleanTitle(value: string) {
  return value.replace(/^["']|["']$/g, "").replace(/\s+/g, " ").trim().slice(0, 60);
}

function cleanDescription(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 160);
}

function cleanTag(value: string) {
  return value.replace(/[#"]/g, "").replace(/\s+/g, " ").trim().slice(0, 24);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Sign in to use writing help." }, { status: 401 });
    }

    const body = await req.json();
    const text = String(body.text ?? "").trim().slice(0, 8000);
    if (text.length < 20) {
      return NextResponse.json(
        { message: "Write a bit more first." },
        { status: 400 }
      );
    }

    if (body.action === "rewrite") {
      const mode = body.mode as keyof typeof MODES;
      if (!MODES[mode]) {
        return NextResponse.json({ message: "Unknown rewrite." }, { status: 400 });
      }
      const passage = await groqComplete(
        "You are an editor for PixelPen, a literary magazine. Never add a title, notes, or quotation marks around the whole answer.",
        `${MODES[mode]}\n\nPassage:\n${text}`
      );
      return NextResponse.json({
        text: stripFences(passage).replace(/^["']|["']$/g, "").trim(),
      });
    }

    if (body.action === "details") {
      const raw = await groqComplete(
        "You write metadata for a blog. Reply with JSON only: {\"title\":\"\",\"description\":\"\",\"tags\":[]}. Title under 60 characters. Description under 160 characters, one sentence, no hashtags. Tags are 3 to 5 short topic names.",
        text,
        true
      );
    const parsed = JSON.parse(extractJson(stripFences(raw))) as {
        title?: string;
        description?: string;
        tags?: unknown;
      };
      const title = cleanTitle(String(parsed.title ?? ""));
      const description = cleanDescription(String(parsed.description ?? ""));
      const tags = Array.isArray(parsed.tags)
        ? Array.from(
            new Set(
              parsed.tags
                .map((tag) => cleanTag(String(tag)))
                .filter((tag) => tag.length > 1)
            )
          ).slice(0, 5)
        : [];
      if (!title) {
        return NextResponse.json(
          { message: "Could not suggest a title. Try again." },
          { status: 502 }
        );
      }
      return NextResponse.json({
        title,
        slug: slugify(title),
        description,
        tags,
      });
    }

    return NextResponse.json({ message: "Unknown action." }, { status: 400 });
  } catch (error) {
    const message =
      error instanceof Error && error.message === "GROQ_API_KEY is not set"
        ? "Add GROQ_API_KEY to .env and restart the dev server."
        : "Writing help is unavailable right now.";
    console.error(error);
    return NextResponse.json({ message }, { status: 500 });
  }
}

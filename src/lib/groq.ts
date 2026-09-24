const MODEL = "openai/gpt-oss-120b";

export async function groqComplete(
  system: string,
  user: string,
  json = false,
  maxTokens?: number
) {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error("GROQ_API_KEY is not set");
  }

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: json ? 0.4 : 0.7,
        max_tokens: maxTokens ?? (json ? 400 : 700),
        reasoning_effort: "low",
        response_format: json ? { type: "json_object" } : undefined,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    console.error("Groq error", response.status, detail.slice(0, 500));
    throw new Error("Groq request failed");
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("Empty model response");
  }
  return text.trim();
}

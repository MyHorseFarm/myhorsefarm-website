const GEMINI_API_KEY = process.env.GOOGLE_AI_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export async function generateText(options: {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  maxTokens?: number;
}): Promise<string> {
  const model = options.model || "gemini-2.5-flash";
  const url = `${BASE_URL}/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const body: Record<string, unknown> = {
    contents: [{ role: "user", parts: [{ text: options.prompt }] }],
    generationConfig: { maxOutputTokens: options.maxTokens || 2048 },
  };

  if (options.systemPrompt) {
    body.systemInstruction = { parts: [{ text: options.systemPrompt }] };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

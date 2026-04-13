const GEMINI_API_KEY = process.env.GOOGLE_AI_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

// --- Types ---

export interface ToolDeclaration {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface FunctionCall {
  name: string;
  args: Record<string, unknown>;
}

export interface GeminiPart {
  text?: string;
  functionCall?: FunctionCall;
  functionResponse?: { name: string; response: Record<string, unknown> };
  inlineData?: { mimeType: string; data: string };
}

export interface GeminiMessage {
  role: "user" | "model";
  parts: GeminiPart[];
}

// --- Simple text generation ---

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

// --- Tool-use generation (non-streaming) ---

export async function generateWithTools(options: {
  messages: GeminiMessage[];
  tools: ToolDeclaration[];
  systemPrompt?: string;
  forceTool?: string;
  model?: string;
  maxTokens?: number;
}): Promise<{
  text: string;
  functionCalls: FunctionCall[];
  rawParts: GeminiPart[];
}> {
  const model = options.model || "gemini-2.5-flash";
  const url = `${BASE_URL}/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const body: Record<string, unknown> = {
    contents: options.messages,
    tools: [{ functionDeclarations: options.tools }],
    generationConfig: { maxOutputTokens: options.maxTokens || 2048 },
  };

  if (options.systemPrompt) {
    body.systemInstruction = { parts: [{ text: options.systemPrompt }] };
  }

  if (options.forceTool) {
    body.toolConfig = {
      functionCallingConfig: {
        mode: "ANY",
        allowedFunctionNames: [options.forceTool],
      },
    };
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
  const parts: GeminiPart[] = data.candidates?.[0]?.content?.parts || [];

  let text = "";
  const functionCalls: FunctionCall[] = [];

  for (const part of parts) {
    if (part.text) text += part.text;
    if (part.functionCall) {
      functionCalls.push({
        name: part.functionCall.name,
        args: part.functionCall.args || {},
      });
    }
  }

  return { text, functionCalls, rawParts: parts };
}

// --- Streaming generation with tools ---

export async function streamWithTools(options: {
  messages: GeminiMessage[];
  tools: ToolDeclaration[];
  systemPrompt?: string;
  model?: string;
  maxTokens?: number;
}): Promise<{
  stream: ReadableStream<Uint8Array>;
  getResult: () => Promise<{ text: string; functionCalls: FunctionCall[]; rawParts: GeminiPart[] }>;
}> {
  const model = options.model || "gemini-2.5-flash";
  const url = `${BASE_URL}/models/${model}:streamGenerateContent?key=${GEMINI_API_KEY}&alt=sse`;

  const body: Record<string, unknown> = {
    contents: options.messages,
    tools: [{ functionDeclarations: options.tools }],
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

  let fullText = "";
  const allFunctionCalls: FunctionCall[] = [];
  const allParts: GeminiPart[] = [];
  let resolveResult: (val: { text: string; functionCalls: FunctionCall[]; rawParts: GeminiPart[] }) => void;
  const resultPromise = new Promise<{ text: string; functionCalls: FunctionCall[]; rawParts: GeminiPart[] }>((r) => {
    resolveResult = r;
  });

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const outputStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (!jsonStr || jsonStr === "[DONE]") continue;

            try {
              const event = JSON.parse(jsonStr);
              const parts = event.candidates?.[0]?.content?.parts || [];

              for (const part of parts) {
                if (part.text) {
                  fullText += part.text;
                  allParts.push({ text: part.text });
                  controller.enqueue(encoder.encode(part.text));
                }
                if (part.functionCall) {
                  const fc: FunctionCall = {
                    name: part.functionCall.name,
                    args: part.functionCall.args || {},
                  };
                  allFunctionCalls.push(fc);
                  allParts.push({ functionCall: fc });
                }
              }
            } catch {
              // skip unparseable SSE lines
            }
          }
        }
      } finally {
        resolveResult!({ text: fullText, functionCalls: allFunctionCalls, rawParts: allParts });
        controller.close();
      }
    },
  });

  return { stream: outputStream, getResult: () => resultPromise };
}

// --- Helper functions ---

export function buildModelMessage(parts: GeminiPart[]): GeminiMessage {
  return { role: "model", parts };
}

export function buildFunctionResponseMessage(
  results: { name: string; response: Record<string, unknown> }[],
): GeminiMessage {
  return {
    role: "user",
    parts: results.map((r) => ({
      functionResponse: { name: r.name, response: r.response },
    })),
  };
}

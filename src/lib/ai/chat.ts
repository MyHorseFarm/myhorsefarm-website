import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "@/lib/supabase";
import { getActiveServices } from "@/lib/pricing";
import { buildSystemPrompt } from "./system-prompt";
import { toolDefinitions, executeTool } from "./tools";
import type { ChatMessage } from "@/lib/types";

const MODEL = "claude-haiku-4-5-20251001";

let _anthropic: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _anthropic;
}

/**
 * Process a chat message and return a ReadableStream of the response.
 * @param image Optional base64-encoded image data (data URI format: data:image/jpeg;base64,...)
 */
export async function processChat(
  sessionId: string,
  userMessage: string,
  image?: string,
): Promise<ReadableStream<Uint8Array>> {
  // Load session
  const { data: session, error: sessionError } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    throw new Error("Chat session not found");
  }

  // Load current messages
  const messages: ChatMessage[] = session.messages || [];

  // Add user message (don't store base64 image in DB — just flag it)
  messages.push({
    role: "user",
    content: image ? `${userMessage}\n[Photo attached]` : userMessage,
    timestamp: new Date().toISOString(),
    has_photo: !!image,
  });

  // Save immediately with user message
  await supabase
    .from("chat_sessions")
    .update({ messages })
    .eq("id", sessionId);

  // Build system prompt with current pricing and schedule settings
  const [services, settingsData] = await Promise.all([
    getActiveServices(),
    supabase.from("schedule_settings").select("*").limit(1).single(),
  ]);
  const settings = settingsData.data as { max_jobs_per_day: number; work_days: number[]; blocked_dates: string[] } | null;
  const systemPrompt = buildSystemPrompt(services, settings);

  // Convert to Claude message format
  const claudeMessages: Anthropic.MessageParam[] = messages.map((m, i) => {
    // For the latest user message with an image, send as multimodal content
    if (m.role === "user" && i === messages.length - 1 && image) {
      // Parse data URI: data:image/jpeg;base64,/9j/4AAQ...
      const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match) {
        const mediaType = match[1] as "image/jpeg" | "image/png" | "image/gif" | "image/webp";
        const data = match[2];
        return {
          role: m.role as "user",
          content: [
            { type: "image" as const, source: { type: "base64" as const, media_type: mediaType, data } },
            { type: "text" as const, text: userMessage },
          ],
        };
      }
    }
    return { role: m.role as "user" | "assistant", content: m.content };
  });

  // Create streaming response
  const encoder = new TextEncoder();
  const MAX_RETRIES = 2;

  return new ReadableStream({
    async start(controller) {
      let lastError: unknown;

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          let fullAssistantText = "";
          let continueLoop = true;
          let currentMessages = [...claudeMessages];
          let toolLoopCount = 0;

          while (continueLoop) {
            // Safety: prevent infinite tool loops
            toolLoopCount++;
            if (toolLoopCount > 5) {
              fullAssistantText += "\n\nLet me have Jose follow up with you directly to finish getting this set up. You can also reach him at (561) 576-7667.";
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "text", text: "\n\nLet me have Jose follow up with you directly to finish getting this set up. You can also reach him at (561) 576-7667." })}\n\n`),
              );
              continueLoop = false;
              break;
            }

            const stream = getClient().messages.stream({
              model: MODEL,
              max_tokens: 1024,
              system: systemPrompt,
              tools: toolDefinitions,
              messages: currentMessages,
            });

            let hasToolUse = false;
            const toolUseBlocks: { id: string; name: string; input: Record<string, unknown> }[] = [];
            let currentText = "";

            for await (const event of stream) {
              if (event.type === "content_block_delta") {
                if (event.delta.type === "text_delta") {
                  currentText += event.delta.text;
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ type: "text", text: event.delta.text })}\n\n`),
                  );
                }
              } else if (event.type === "content_block_start") {
                if (event.content_block.type === "tool_use") {
                  hasToolUse = true;
                }
              }
            }

            const finalMessage = await stream.finalMessage();

            for (const block of finalMessage.content) {
              if (block.type === "tool_use") {
                toolUseBlocks.push({
                  id: block.id,
                  name: block.name,
                  input: block.input as Record<string, unknown>,
                });
              }
            }

            if (hasToolUse && toolUseBlocks.length > 0) {
              currentMessages.push({
                role: "assistant",
                content: finalMessage.content,
              });

              const toolResults: Anthropic.ToolResultBlockParam[] = [];
              for (const tool of toolUseBlocks) {
                try {
                  const result = await executeTool(tool.name, tool.input, sessionId);
                  toolResults.push({
                    type: "tool_result",
                    tool_use_id: tool.id,
                    content: result,
                  });
                } catch (toolErr) {
                  console.error(`Tool ${tool.name} failed:`, toolErr);
                  toolResults.push({
                    type: "tool_result",
                    tool_use_id: tool.id,
                    content: JSON.stringify({ error: "Tool execution failed. Please continue the conversation without this tool." }),
                    is_error: true,
                  });
                }
              }

              currentMessages.push({
                role: "user",
                content: toolResults,
              });
            } else {
              fullAssistantText += currentText;
              continueLoop = false;
            }
          }

          // Save assistant message
          messages.push({
            role: "assistant",
            content: fullAssistantText,
            timestamp: new Date().toISOString(),
          });

          await supabase
            .from("chat_sessions")
            .update({ messages })
            .eq("id", sessionId);

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`),
          );
          controller.close();
          return; // Success — exit retry loop
        } catch (err) {
          lastError = err;
          const errMsg = err instanceof Error ? err.message : String(err);
          console.error(`Chat stream error (attempt ${attempt + 1}/${MAX_RETRIES + 1}):`, errMsg);

          // Only retry on transient errors (rate limit, overloaded, network)
          const isRetryable =
            errMsg.includes("529") ||
            errMsg.includes("overloaded") ||
            errMsg.includes("rate") ||
            errMsg.includes("ECONNRESET") ||
            errMsg.includes("ETIMEDOUT") ||
            errMsg.includes("500");

          if (isRetryable && attempt < MAX_RETRIES) {
            // Wait before retry (exponential backoff: 1s, 2s)
            await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
            continue;
          }

          // Final failure — send friendly message and close
          const friendlyError = "Hey, I ran into a hiccup on my end. Can you try sending that again? Or if you prefer, text Jose directly at (561) 576-7667 and he'll get you sorted.";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "error", text: friendlyError })}\n\n`),
          );
          controller.close();

          // Save a note so the conversation can continue
          messages.push({
            role: "assistant",
            content: friendlyError,
            timestamp: new Date().toISOString(),
          });
          await supabase
            .from("chat_sessions")
            .update({ messages })
            .eq("id", sessionId)
            .then(() => {});

          return;
        }
      }
    },
  });
}

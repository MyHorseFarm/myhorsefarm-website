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
 */
export async function processChat(
  sessionId: string,
  userMessage: string,
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

  // Add user message
  messages.push({
    role: "user",
    content: userMessage,
    timestamp: new Date().toISOString(),
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
  const claudeMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // Create streaming response
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        let fullAssistantText = "";
        let continueLoop = true;
        let currentMessages = [...claudeMessages];

        while (continueLoop) {
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
                // Stream text to client
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

          // Collect tool use blocks from final message
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
            // Execute tools
            currentMessages.push({
              role: "assistant",
              content: finalMessage.content,
            });

            const toolResults: Anthropic.ToolResultBlockParam[] = [];
            for (const tool of toolUseBlocks) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "status", text: `Processing ${tool.name}...` })}\n\n`,
                ),
              );

              const result = await executeTool(tool.name, tool.input, sessionId);
              toolResults.push({
                type: "tool_result",
                tool_use_id: tool.id,
                content: result,
              });
            }

            currentMessages.push({
              role: "user",
              content: toolResults,
            });

            // Continue the loop to get Claude's response to tool results
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
      } catch (err) {
        console.error("Chat stream error:", err);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", text: "Something went wrong. Please try again or call us at (561) 576-7667." })}\n\n`,
          ),
        );
        controller.close();
      }
    },
  });
}

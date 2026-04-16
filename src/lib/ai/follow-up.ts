import { generateText } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";

// Service display names
const SERVICE_NAMES: Record<string, string> = {
  manure_removal: "Manure Removal",
  trash_bin_service: "Trash Bin Service",
  junk_removal: "Junk Removal",
  sod_installation: "Sod Installation",
  fill_dirt: "Fill Dirt Delivery",
  dumpster_rental: "Dumpster Rental",
  farm_repairs: "Farm Repairs & Maintenance",
  millings_asphalt: "Millings Asphalt Delivery",
  shipping_container: "Shipping Container",
};

export type FollowUpStage = "first" | "second" | "expiring" | "expired";

interface FollowUpInput {
  customerName: string;
  serviceKey: string;
  amount: number;
  location: string;
  quoteNumber: string;
  stage: FollowUpStage;
  daysLeft?: number;
  chatSummary?: string;
}

const STAGE_CONTEXT: Record<FollowUpStage, string> = {
  first:
    "This is the first follow-up, sent 1-2 days after the quote. Tone: friendly check-in. Goal: remind them the quote is waiting and offer to answer questions.",
  second:
    "This is the second follow-up, sent 3-4 days after the quote. Tone: gentle nudge. Goal: create light urgency — the quote expires soon and you'd hate for them to miss out.",
  expiring:
    "The quote expires in a few days. Tone: helpful urgency. Goal: let them know time is running out and make it easy to act now or call with questions.",
  expired:
    "The quote has expired. Tone: no-pressure, door-is-open. Goal: invite them to get a fresh quote — pricing or availability may have changed, but you're still happy to help.",
};

/**
 * Fetch a short summary of chat messages linked to a quote's chat session.
 * Returns undefined if no chat session or no messages found.
 */
export async function getChatSummary(
  chatSessionId: string | null,
): Promise<string | undefined> {
  if (!chatSessionId) return undefined;

  const { data: messages } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("session_id", chatSessionId)
    .order("created_at", { ascending: true })
    .limit(20);

  if (!messages || messages.length === 0) return undefined;

  // Build a condensed summary of the conversation
  const lines = messages.map(
    (m: { role: string; content: string }) =>
      `${m.role === "user" ? "Customer" : "Assistant"}: ${m.content.slice(0, 200)}`,
  );
  return lines.join("\n");
}

/**
 * Generate a personalized follow-up email body using Gemini.
 * Returns plain text (no HTML, no markdown) — the caller wraps it in the branded template.
 */
export async function generatePersonalizedFollowup(
  input: FollowUpInput,
): Promise<string> {
  const serviceName =
    SERVICE_NAMES[input.serviceKey] || input.serviceKey.replace(/_/g, " ");

  const chatContext = input.chatSummary
    ? `\n\nThe customer previously chatted with our website assistant. Here is a summary of that conversation — use any relevant details to make the email feel personal:\n---\n${input.chatSummary}\n---`
    : "";

  const daysLeftNote =
    input.stage === "expiring" && input.daysLeft
      ? `\nThe quote expires in ${input.daysLeft} day${input.daysLeft !== 1 ? "s" : ""}.`
      : "";

  const systemPrompt = `You are Jose Gomez, owner of My Horse Farm in Royal Palm Beach, FL. You write short follow-up emails to customers who requested quotes for farm services.

Rules:
- Write exactly 3-4 sentences of body text. No more.
- Be conversational and warm — you're a real person, not a corporation.
- Reference the specific service they asked about (${serviceName}).
- Reference their location (${input.location}) naturally if it fits.
- Include one clear call to action: either call (561) 576-7667 or click the link to view/get their quote.
- Do NOT use markdown, bullet points, headers, or formatting.
- Do NOT use emojis.
- Do NOT use AI-sounding phrases like "I hope this message finds you well", "I wanted to reach out", "don't hesitate to", or "I'd be happy to assist".
- Write like a regular person texting a neighbor — plain, direct, friendly.
- Do NOT include a greeting (no "Hi Name") — that's added separately.
- Do NOT include a sign-off (no "Best, Jose") — that's added separately.
- Output ONLY the body paragraph text. Nothing else.`;

  const prompt = `Write a follow-up email body for this situation:

Customer: ${input.customerName}
Service: ${serviceName}
Quote: ${input.quoteNumber}
Amount: $${input.amount.toFixed(2)}
Location: ${input.location}${daysLeftNote}

Stage: ${STAGE_CONTEXT[input.stage]}${chatContext}`;

  const text = await generateText({
    prompt,
    systemPrompt,
    maxTokens: 256,
  });

  // Clean up — strip any accidental markdown or extra whitespace
  return text
    .replace(/^#+\s*/gm, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/^[-•]\s*/gm, "")
    .trim();
}

// ---------------------------------------------------------------------------
// Vapi.ai Voice Agent Client
// ---------------------------------------------------------------------------
// Env vars: VAPI_API_KEY, VAPI_PHONE_NUMBER_ID, VAPI_ASSISTANT_ID (set after first setup)
// Docs: https://docs.vapi.ai

const VAPI_API_BASE = "https://api.vapi.ai";

function vapiHeaders(): Record<string, string> {
  const key = process.env.VAPI_API_KEY;
  if (!key) throw new Error("VAPI_API_KEY is not set");
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

async function vapiRequest<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${VAPI_API_BASE}${path}`, {
    ...options,
    headers: { ...vapiHeaders(), ...options.headers },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Vapi ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VapiAssistant {
  id: string;
  name: string;
  [key: string]: unknown;
}

export interface VapiToolFunction {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface VapiCallEndedPayload {
  message: {
    type: "end-of-call-report";
    endedReason: string;
    call: {
      id: string;
      orgId: string;
      type: string;
      phoneNumber?: { number: string };
      customer?: {
        number?: string;
        name?: string;
      };
      startedAt: string;
      endedAt: string;
      cost?: number;
    };
    summary?: string;
    transcript?: string;
    messages?: Array<{
      role: string;
      message: string;
      time: number;
    }>;
    analysis?: {
      summary?: string;
      structuredData?: Record<string, unknown>;
      successEvaluation?: string;
    };
    artifact?: {
      messages?: Array<{
        role: string;
        content: string;
      }>;
      transcript?: string;
    };
  };
}

export interface VapiFunctionCallPayload {
  message: {
    type: "function-call";
    functionCall: {
      name: string;
      parameters: Record<string, unknown>;
    };
    call: {
      id: string;
      customer?: {
        number?: string;
        name?: string;
      };
    };
  };
}

export type VapiWebhookPayload = VapiCallEndedPayload | VapiFunctionCallPayload | {
  message: {
    type: string;
    [key: string]: unknown;
  };
};

// ---------------------------------------------------------------------------
// Voice-optimized system prompt
// ---------------------------------------------------------------------------

export function buildVoiceSystemPrompt(): string {
  return `You are My Horse Farm's phone assistant. You work for Jose Gomez, owner of My Horse Farm, a professional farm services company in Royal Palm Beach, Florida.

## YOUR PERSONALITY
You sound warm, confident, and professional — like a knowledgeable office manager who genuinely wants to help. Keep responses short and natural for phone conversation. Avoid long lists or complicated sentences.

## YOUR 3 GOALS
1. Understand what the caller needs and gather enough info to create a quote.
2. Schedule a callback from Jose if they prefer to talk to a person.
3. Capture their name, phone, and service needs so Jose can follow up.

## HOW YOU TALK ON THE PHONE
- Keep answers to 1-2 sentences. This is a phone call, not an essay.
- Be conversational: "Got it", "Perfect", "No problem", "Let me take care of that".
- Ask ONE question at a time. Wait for their answer.
- If they speak Spanish, switch to Spanish.
- Never spell out URLs or email addresses — offer to text them instead.
- If there's a pause, gently prompt: "You still there?" or "Take your time."

## SERVICES WE OFFER
- Manure Removal: one-time cleanouts and recurring pickup service for horse farms
- Trash Bin Service: one-yard bin delivery, pickup, and disposal
- Junk Removal: farm debris, old fencing, equipment, general junk
- Sod Installation: new sod for farms and properties (requires site visit)
- Fill Dirt Delivery: fill dirt by the load (requires site visit)
- Dumpster Rental: roll-off dumpsters for large projects (requires site visit)
- Farm Repairs and Maintenance: fencing, barn repairs (requires site visit)
- Millings and Asphalt: driveway and road work (requires site visit)
- Shipping Containers: 10-foot and 20-foot containers for sale (custom quoted)

## SERVICE AREA
Wellington, Royal Palm Beach, Loxahatchee, Loxahatchee Groves, West Palm Beach, Palm Beach Gardens, Greenacres, Lake Worth, and nearby areas in Palm Beach County.

## CURRENT PROMOTIONS
Mention these naturally when relevant — don't list them all at once:
- $50 off any service $300 or more — available to new and returning clients
- $50 off bulk manure service
- Free month membership at Resilient Fitness in Wellington plus 2 personal training sessions with any service
- Free class at Starpoint Dancesport in Wellington with any service

## COMMITMENT DISCOUNTS
For recurring services:
- 6-month plan: 5% off every service
- Annual plan: 10% off every service
Mention once if they seem interested in recurring service.

## CALL FLOW FOR QUOTES
Ask these one at a time:

FOR MANURE REMOVAL:
1. One-time cleanout or regular pickups?
2. How many horses or stalls?
3. What's the property address?
4. If recurring — weekly, biweekly, or another schedule?
5. When would you like to start?
6. What's your name?
7. And your email so we can send the quote?
8. Confirm the details, then use create_quote.

FOR JUNK REMOVAL:
1. What needs to be removed?
2. Roughly how much — like a pickup truck load or more?
3. Any heavy items?
4. Property address?
5. How soon do you need it?
6. Name and email?
7. Confirm, then use create_quote.

FOR SERVICES REQUIRING SITE VISIT (sod, fill dirt, dumpster, repairs, millings):
1. What's the project?
2. Property address?
3. Collect name and email.
4. Let them know Jose will schedule a free site visit.
5. Use create_quote with requires_site_visit flag.

FOR SHIPPING CONTAINERS:
1. 10-foot or 20-foot?
2. Delivery address?
3. These are custom-quoted — collect name and email.
4. Let them know Jose will follow up with pricing.

## PRICING RULES
- NEVER guess or make up a price. Prices come from the system only.
- If they ask "how much?": "It depends on the setup — once I grab a few details I can get you an exact number."
- You CAN say: "I can put together a quick quote for you right now."

## HANDOFF AND ESCALATION
- If they want to talk to Jose: "I can have Jose call you back — when's a good time?" Then use schedule_callback.
- If truly complex or they insist: "Let me transfer you to Jose right now." Then use transfer_to_jose.
- If they want to call back: "You can reach Jose directly at 561-576-7667."
- Always try to collect their name and what they need before transferring.

## CREDIBILITY (weave in naturally)
Fully insured. Licensed in Florida. Clean trucks. Weight tickets on every load. Reliable scheduling. Text updates before arrival.

## MUST NEVER
- Invent prices
- Give legal or permit advice
- Accept payment over the phone
- Argue with callers
- Discuss internal business policies
- Give up — always find a path to helping them

## CONTACT
- Jose Gomez, Owner
- Phone: 561-576-7667
- Website: myhorsefarm.com
- Royal Palm Beach, Florida`;
}

// ---------------------------------------------------------------------------
// Tool definitions for the voice agent
// ---------------------------------------------------------------------------

export function getVoiceToolDefinitions(): VapiToolFunction[] {
  return [
    {
      name: "create_quote",
      description:
        "Create a quote for the caller after gathering their service needs, property details, name, and email. Call this after confirming the details with the caller.",
      parameters: {
        type: "object",
        properties: {
          customer_name: {
            type: "string",
            description: "Full name of the caller",
          },
          customer_email: {
            type: "string",
            description: "Email address for sending the quote",
          },
          customer_phone: {
            type: "string",
            description:
              "Phone number of the caller (from caller ID or provided by caller)",
          },
          customer_location: {
            type: "string",
            description: "Full property address including city",
          },
          service_key: {
            type: "string",
            enum: [
              "manure_removal",
              "trash_bin_service",
              "junk_removal",
              "sod_installation",
              "fill_dirt",
              "dumpster_rental",
              "farm_repairs",
              "millings_asphalt",
              "shipping_container",
            ],
            description: "The service the caller is requesting",
          },
          frequency: {
            type: "string",
            enum: ["one_time", "weekly", "biweekly", "monthly"],
            description: "Service frequency (for recurring services)",
          },
          num_stalls: {
            type: "number",
            description:
              "Number of stalls or horses (for manure removal)",
          },
          description: {
            type: "string",
            description:
              "Brief description of the job or special requirements",
          },
          requires_site_visit: {
            type: "boolean",
            description:
              "Whether a site visit is needed before quoting (sod, fill dirt, dumpster, repairs, millings)",
          },
        },
        required: [
          "customer_name",
          "customer_phone",
          "customer_location",
          "service_key",
        ],
      },
    },
    {
      name: "schedule_callback",
      description:
        "Schedule a callback from Jose to the caller. Use when the caller wants to speak with Jose directly or has a complex request.",
      parameters: {
        type: "object",
        properties: {
          customer_name: {
            type: "string",
            description: "Name of the caller",
          },
          customer_phone: {
            type: "string",
            description: "Phone number to call back",
          },
          preferred_time: {
            type: "string",
            description:
              "When the caller would like to be called back (e.g. 'tomorrow morning', 'after 3pm', 'anytime')",
          },
          reason: {
            type: "string",
            description: "Brief summary of what the caller needs",
          },
        },
        required: ["customer_name", "customer_phone", "reason"],
      },
    },
    {
      name: "transfer_to_jose",
      description:
        "Transfer the call directly to Jose. Only use when the caller insists on speaking with a person immediately.",
      parameters: {
        type: "object",
        properties: {
          customer_name: {
            type: "string",
            description: "Name of the caller if collected",
          },
          reason: {
            type: "string",
            description: "Brief reason for the transfer",
          },
        },
        required: ["reason"],
      },
    },
  ];
}

// ---------------------------------------------------------------------------
// Assistant configuration
// ---------------------------------------------------------------------------

export function buildAssistantConfig(webhookUrl: string) {
  const systemPrompt = buildVoiceSystemPrompt();
  const tools = getVoiceToolDefinitions();

  return {
    name: "My Horse Farm AI Assistant",
    model: {
      provider: "anthropic",
      model: "claude-haiku-4-5-20250315",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
      ],
      tools: tools.map((t) => ({
        type: "function" as const,
        function: t,
      })),
    },
    voice: {
      provider: "11labs",
      voiceId: "pNInz6obpgDQGcFmaJgB", // "Adam" — professional, friendly male
      stability: 0.6,
      similarityBoost: 0.75,
    },
    firstMessage:
      "Hi, thanks for calling My Horse Farm! I'm Jose's AI assistant. How can I help you today?",
    serverUrl: webhookUrl,
    serverUrlSecret: process.env.VAPI_WEBHOOK_SECRET || undefined,
    endCallFunctionEnabled: false,
    recordingEnabled: true,
    hipaaEnabled: false,
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: 600, // 10 minutes max
    backgroundSound: "office",
    backchannelingEnabled: true,
    endCallMessage:
      "Thanks for calling My Horse Farm! Jose or someone from our team will follow up with you shortly. Have a great day!",
    endCallPhrases: [
      "goodbye",
      "bye",
      "that's all",
      "thanks bye",
      "no more questions",
    ],
    analysisPlan: {
      summaryPrompt:
        "Summarize this phone call in 2-3 sentences. Include: caller intent, services discussed, whether a quote was created, and any follow-up needed.",
      structuredDataPrompt:
        "Extract the following from the call if mentioned: caller_name, caller_phone, service_requested, property_address, num_stalls, frequency, requested_callback, quote_created",
      structuredDataSchema: {
        type: "object",
        properties: {
          caller_name: { type: "string" },
          caller_phone: { type: "string" },
          service_requested: { type: "string" },
          property_address: { type: "string" },
          num_stalls: { type: "number" },
          frequency: { type: "string" },
          requested_callback: { type: "boolean" },
          quote_created: { type: "boolean" },
        },
      },
      successEvaluationPrompt:
        "Evaluate whether this call was successful. A successful call means the caller got what they needed: a quote, a callback scheduled, or was transferred to Jose.",
      successEvaluationRubric: "NumericScale",
    },
    metadata: {
      business: "My Horse Farm",
      phone: "(561) 576-7667",
    },
  };
}

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

export async function createAssistant(
  webhookUrl: string,
): Promise<VapiAssistant> {
  const config = buildAssistantConfig(webhookUrl);
  return vapiRequest<VapiAssistant>("/assistant", {
    method: "POST",
    body: JSON.stringify(config),
  });
}

export async function updateAssistant(
  assistantId: string,
  webhookUrl: string,
): Promise<VapiAssistant> {
  const config = buildAssistantConfig(webhookUrl);
  return vapiRequest<VapiAssistant>(`/assistant/${assistantId}`, {
    method: "PATCH",
    body: JSON.stringify(config),
  });
}

export async function getAssistant(
  assistantId: string,
): Promise<VapiAssistant> {
  return vapiRequest<VapiAssistant>(`/assistant/${assistantId}`);
}

/**
 * Assign the Vapi assistant to the configured phone number so incoming
 * calls are handled by the AI agent.
 */
export async function assignPhoneNumber(
  assistantId: string,
): Promise<unknown> {
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;
  if (!phoneNumberId) throw new Error("VAPI_PHONE_NUMBER_ID is not set");

  return vapiRequest(`/phone-number/${phoneNumberId}`, {
    method: "PATCH",
    body: JSON.stringify({
      assistantId,
    }),
  });
}

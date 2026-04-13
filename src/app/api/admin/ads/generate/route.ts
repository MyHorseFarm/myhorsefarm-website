import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";

export const runtime = "nodejs";
export const maxDuration = 60;

const ADMIN_SECRET = process.env.ADMIN_SECRET;

const SYSTEM_PROMPT = `You are an expert advertising copywriter for My Horse Farm, a junk removal and farm services company in Royal Palm Beach, Florida.

BUSINESS INFO:
- Company: My Horse Farm
- Phone: (561) 576-7667
- Website: myhorsefarm.com
- Service Area: Royal Palm Beach, Wellington, Loxahatchee, West Palm Beach, Palm Beach Gardens, Loxahatchee Groves (Palm Beach County FL)
- Equipment: 40-yard dump trailer, skid steer, front-end loader, experienced crew
- Services: Junk removal, green waste pickup, construction debris, property cleanouts, farm/barn cleanup, furniture & appliance removal, bulk material hauling, manure removal, dumpster rental

BRAND VOICE:
- Direct, confident, no-nonsense
- Local and personal — owner-operated by Jose Gomez
- Emphasize equipment capabilities (40-yard dump trailer is a differentiator)
- Not corporate — real people, real work
- Use urgency and social proof when appropriate

IMPORTANT RULES:
- Never use emojis in Google Ads copy
- Facebook ads can use 1-2 emojis max, tastefully
- All copy must be factual — don't make up statistics
- Include specific equipment mentions (40-yard dump trailer, skid steer, loader)
- Target homeowners, property managers, contractors, and farm/equestrian owners
- Emphasize same-day service, licensed & insured, eco-friendly disposal
- Google Ads headlines must be 30 characters max each
- Google Ads descriptions must be 90 characters max each

Return your response as valid JSON with this exact structure:
{
  "google_ads": [
    {
      "headline1": "string (max 30 chars)",
      "headline2": "string (max 30 chars)",
      "headline3": "string (max 30 chars)",
      "description1": "string (max 90 chars)",
      "description2": "string (max 90 chars)"
    }
  ],
  "facebook_ads": [
    {
      "primary_text": "string (the main ad copy, 2-4 sentences)",
      "headline": "string (short headline for the ad)",
      "description": "string (link description)",
      "cta": "string (call to action button text)"
    }
  ],
  "video_script": {
    "duration": "string (e.g. '30 seconds')",
    "scenes": [
      {
        "timestamp": "string (e.g. '0-5s')",
        "visual": "string (what's shown)",
        "voiceover": "string (what's said)",
        "text_overlay": "string (on-screen text)"
      }
    ]
  },
  "video_render": {
    "headline": "string (short punchy headline for the video, max 60 chars — shown on scene 1)",
    "description": "string (supporting benefit statement, max 80 chars — shown on scene 2)",
    "cta_text": "string (call to action, max 30 chars — shown on scene 3 and outro, e.g. 'Call Now!', 'Book Today!')"
  }
}`;

export async function POST(request: NextRequest) {
  // Auth check
  const auth = request.headers.get("authorization");
  if (!ADMIN_SECRET || auth !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      serviceType = "junk_removal",
      targetArea = "Palm Beach County",
      platform = "both",
      additionalContext = "",
      images = [],
    } = body;

    const serviceLabels: Record<string, string> = {
      junk_removal: "Junk Removal & Hauling",
      manure_removal: "Manure Removal",
      green_waste: "Green Waste Pickup",
      construction_debris: "Construction Debris Removal",
      property_cleanout: "Property Cleanout",
      dumpster_rental: "Dumpster Rental",
      farm_cleanup: "Farm & Barn Cleanup",
    };

    const serviceLabel = serviceLabels[serviceType] || serviceType;

    let userPrompt = `Generate advertising copy for our ${serviceLabel} service targeting customers in ${targetArea}.

Platform: ${platform === "both" ? "Google Ads AND Facebook" : platform}
Service Focus: ${serviceLabel}
Target Area: ${targetArea}

Generate:
- 3 Google Ads variations (if platform includes Google)
- 3 Facebook ad variations (if platform includes Facebook)
- 1 video commercial script (30 seconds)`;

    if (additionalContext) {
      userPrompt += `\n\nAdditional context from the business owner: ${additionalContext}`;
    }

    if (images.length > 0) {
      userPrompt +=
        "\n\nNote: The business owner has photos of their work/equipment. Reference typical junk removal equipment (40-yard dump trailer, skid steer, front-end loader) to make the ad copy specific and authentic.";
    }

    const text = await generateText({
      prompt: userPrompt,
      systemPrompt: SYSTEM_PROMPT,
      maxTokens: 4000,
    });

    // Parse JSON from response (handle markdown code blocks)
    let parsed;
    try {
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[1].trim() : text.trim());
    } catch {
      // If JSON parsing fails, return raw text
      return NextResponse.json({ raw: text, parsed: null });
    }

    return NextResponse.json({ ads: parsed });
  } catch (err) {
    console.error("Ad generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate ads" },
      { status: 500 },
    );
  }
}

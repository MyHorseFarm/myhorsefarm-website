import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "@/lib/supabase";

const TOPICS = [
  {
    category: "Farm Tips",
    prompt:
      "Equestrian property maintenance tips for horse farm owners in Palm Beach County, Florida. Cover practical advice for keeping farms in top shape.",
  },
  {
    category: "Local Events",
    prompt:
      "Wellington and Palm Beach County local equestrian news, events, or seasonal happenings. Reference WEF, polo season, horse shows, or community events relevant to horse farm owners.",
  },
  {
    category: "Manure Management",
    prompt:
      "Manure management best practices for horse farms. Cover composting, removal schedules, environmental compliance, odor control, or bin placement strategies for Florida equestrian properties.",
  },
  {
    category: "Property Cleanout",
    prompt:
      "Farm cleanup, junk removal, and property cleanout guides for horse farm owners. Cover when to schedule cleanouts, what to expect from a professional service, and how to declutter barns and paddock areas.",
  },
  {
    category: "Paddock Care",
    prompt:
      "Sod installation, paddock turf care, and pasture management in Florida. Cover grass varieties, seasonal care schedules, reseeding, irrigation, and maintaining healthy turnout areas for horses.",
  },
  {
    category: "Dumpster Rental",
    prompt:
      "Dumpster rental tips for farm projects, barn cleanouts, construction debris, and renovation waste on horse properties. Cover sizing, placement, scheduling, and cost-saving strategies.",
  },
  {
    category: "Seasonal Prep",
    prompt:
      "Seasonal farm preparation for Wellington and Loxahatchee horse farms. Cover getting ready for WEF season, polo season, hurricane season, or summer storm prep with practical checklists and timelines.",
  },
  {
    category: "Regulations",
    prompt:
      "Palm Beach County regulations, permits, and compliance requirements for horse farm owners. Cover manure hauling permits, zoning rules, environmental regulations, and how to stay compliant.",
  },
  {
    category: "Fill Dirt & Grading",
    prompt:
      "Fill dirt delivery, land grading, and drainage improvement for horse farms in Florida. Cover when grading is needed, types of fill material, drainage solutions, and how proper grading protects horses and property.",
  },
  {
    category: "Farm Repairs",
    prompt:
      "Farm repair and fence maintenance for equestrian properties. Cover fence types, common repair needs, gate maintenance, barn repairs, and when to call professionals vs. DIY for horse farm infrastructure.",
  },
];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function GET(request: NextRequest) {
  if (
    request.headers.get("authorization") !==
    `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Check if we already generated a post this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);

    const { data: recentPosts } = await supabase
      .from("blog_posts")
      .select("id")
      .gte("created_at", oneWeekAgo.toISOString())
      .limit(1);

    if (recentPosts && recentPosts.length > 0) {
      return Response.json({
        success: false,
        reason: "Already generated a blog post this week",
      });
    }

    // Pick a random topic
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];

    // Fetch recent post titles to avoid duplicates
    const { data: existingPosts } = await supabase
      .from("blog_posts")
      .select("title")
      .order("created_at", { ascending: false })
      .limit(20);

    const existingTitles = (existingPosts || [])
      .map((p: { title: string }) => p.title)
      .join("\n- ");

    const anthropic = new Anthropic();

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8000,
      messages: [
        {
          role: "user",
          content: `You are a content writer for My Horse Farm, a professional equestrian property services company based in Royal Palm Beach, Florida. They serve horse farms throughout Palm Beach County including Wellington, Loxahatchee, and West Palm Beach.

Services offered: manure removal, junk hauling, sod installation, fill dirt delivery, dumpster rental, farm repairs, fence maintenance, property cleanouts, and grading.

Phone: (561) 576-7667 | Website: myhorsefarm.com

Write a blog post about the following topic:
${topic.prompt}

Requirements:
1. Generate a compelling, SEO-optimized title (under 70 characters)
2. Generate a meta description (exactly 150-160 characters)
3. Write the full article body as HTML content (2000-3000 words)
4. Include H2 and H3 subheadings for SEO structure
5. Mention Palm Beach County, Wellington, Loxahatchee, or Royal Palm Beach naturally throughout
6. Reference My Horse Farm naturally 2-3 times (not too salesy)
7. Write in a professional but approachable tone — knowledgeable and helpful
8. Include practical, actionable advice
9. Generate 3-5 relevant tags as a comma-separated list
10. End with a brief call-to-action mentioning My Horse Farm's services

${existingTitles ? `IMPORTANT: Do NOT use any of these titles or cover the same exact angle:\n- ${existingTitles}` : ""}

Respond in this exact JSON format (no markdown code blocks, just raw JSON):
{
  "title": "The Blog Post Title",
  "description": "The 150-160 character meta description.",
  "tags": ["tag1", "tag2", "tag3"],
  "content": "<p>Full HTML content here...</p>"
}

For the HTML content:
- Use <h2> and <h3> tags for headings
- Use <p> tags for paragraphs
- Use <ul>/<li> for lists
- Use <strong> for emphasis
- Do NOT include the title as an H1 — that's handled by the page template
- Do NOT include any wrapper divs or article tags`,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse the JSON response
    let parsed: {
      title: string;
      description: string;
      tags: string[];
      content: string;
    };
    try {
      parsed = JSON.parse(responseText);
    } catch {
      // Try extracting JSON from markdown code blocks
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Failed to parse AI response as JSON");
      }
      parsed = JSON.parse(jsonMatch[0]);
    }

    const slug = slugify(parsed.title);

    // Insert into Supabase
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        slug,
        title: parsed.title,
        description: parsed.description,
        content: parsed.content,
        author: "My Horse Farm Team",
        category: topic.category,
        tags: parsed.tags,
        published: true,
        published_at: new Date().toISOString(),
      })
      .select("id, slug, title")
      .single();

    if (error) {
      throw new Error(`Supabase insert error: ${error.message}`);
    }

    return Response.json({
      success: true,
      post: data,
    });
  } catch (err) {
    console.error("Blog generation error:", err);
    return Response.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

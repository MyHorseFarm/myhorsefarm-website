import { NextRequest } from "next/server";
import { generateText } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";
import { sendEmail } from "@/lib/emails";
import { withCronMonitor } from "@/lib/cron-monitor";

export const runtime = "nodejs";
export const maxDuration = 180; // Extended for AI generation with retries

const ADMIN_EMAIL = process.env.EMAIL_ADMIN_NOTIFICATION || "manureservice@gmail.com";

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

async function alertAdmin(subject: string, body: string) {
  try {
    await sendEmail(
      ADMIN_EMAIL,
      `[MHF Blog] ${subject}`,
      `<div style="font-family:sans-serif;max-width:600px;">
        <h2 style="color:#2d6a30;">${subject}</h2>
        <p>${body}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
        <p style="color:#999;font-size:12px;">Auto-Blog System — My Horse Farm</p>
      </div>`,
    );
  } catch (emailErr) {
    console.error("Failed to send blog alert email:", emailErr);
  }
}

async function generateWithRetry(
  topic: (typeof TOPICS)[number],
  existingTitles: string,
  attempt: number = 1,
): Promise<{ title: string; description: string; tags: string[]; content: string }> {
  const maxAttempts = 3;

  try {
    const responseText = await generateText({
      prompt: `Write a blog post about the following topic:
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
      systemPrompt: `You are a content writer for My Horse Farm, a professional equestrian property services company based in Royal Palm Beach, Florida. They serve horse farms throughout Palm Beach County including Wellington, Loxahatchee, and West Palm Beach.

Services offered: manure removal, junk hauling, sod installation, fill dirt delivery, dumpster rental, farm repairs, fence maintenance, property cleanouts, and grading.

Phone: (561) 576-7667 | Website: myhorsefarm.com`,
      maxTokens: 8000,
    });

    // Parse JSON — try direct first, then extract from markdown
    try {
      return JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in AI response");
      return JSON.parse(jsonMatch[0]);
    }
  } catch (err) {
    if (attempt < maxAttempts) {
      console.warn(`Blog generation attempt ${attempt} failed, retrying...`, err);
      // Wait 5 seconds before retry
      await new Promise((r) => setTimeout(r, 5000));
      return generateWithRetry(topic, existingTitles, attempt + 1);
    }
    throw err;
  }
}

export async function GET(request: NextRequest) {
  if (
    request.headers.get("authorization") !==
    `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  return withCronMonitor("blog-generate", async () => {
    // Check for recent posts — but use 5 days instead of 7 so a Monday
    // failure can be retried on Tuesday/Wednesday without being blocked
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const { data: recentPosts } = await supabase
      .from("blog_posts")
      .select("id")
      .gte("created_at", fiveDaysAgo.toISOString())
      .limit(1);

    if (recentPosts && recentPosts.length > 0) {
      return {
        processed: 0,
        reason: "Already generated a blog post this week",
      };
    }

    // Pick a topic — weighted towards categories we haven't covered recently
    const { data: recentCategories } = await supabase
      .from("blog_posts")
      .select("category")
      .order("created_at", { ascending: false })
      .limit(5);

    const recentCats = (recentCategories || []).map(
      (p: { category: string }) => p.category,
    );
    const availableTopics = TOPICS.filter((t) => !recentCats.includes(t.category));
    const topic =
      availableTopics.length > 0
        ? availableTopics[Math.floor(Math.random() * availableTopics.length)]
        : TOPICS[Math.floor(Math.random() * TOPICS.length)];

    // Get existing titles to avoid duplicates
    const { data: existingPosts } = await supabase
      .from("blog_posts")
      .select("title")
      .order("created_at", { ascending: false })
      .limit(20);

    const existingTitles = (existingPosts || [])
      .map((p: { title: string }) => p.title)
      .join("\n- ");

    // Generate with up to 3 retries
    const parsed = await generateWithRetry(topic, existingTitles);

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

    // Success — notify Jose
    await alertAdmin(
      "New Blog Post Published",
      `<strong>"${data.title}"</strong> was automatically published.<br><br>
      <a href="https://www.myhorsefarm.com/blog/${data.slug}" style="color:#2d6a30;">
        View the post →
      </a><br><br>
      Category: ${topic.category}<br>
      Tags: ${parsed.tags.join(", ")}`,
    );

    return { processed: 1, post: data };
  });
}

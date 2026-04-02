import { createHmac, timingSafeEqual } from "crypto";
import { Resend } from "resend";

// Canonical Google review URL — use this everywhere
export const GOOGLE_REVIEW_URL = "https://g.page/r/CUtJdTADtIsyEBM/review";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export function createUnsubscribeUrl(email: string): string {
  const sig = createHmac("sha256", process.env.UNSUBSCRIBE_SECRET!)
    .update(email)
    .digest("hex");
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.myhorsefarm.com";
  return `${base}/api/unsubscribe?email=${encodeURIComponent(email)}&sig=${sig}`;
}

export function verifyUnsubscribeSignature(
  email: string,
  sig: string,
): boolean {
  const expected = createHmac("sha256", process.env.UNSUBSCRIBE_SECRET!)
    .update(email)
    .digest("hex");
  const expectedBuf = Buffer.from(expected);
  const sigBuf = Buffer.from(sig);
  if (expectedBuf.length !== sigBuf.length) return false;
  return timingSafeEqual(expectedBuf, sigBuf);
}

// ---------------------------------------------------------------------------
// Send
// ---------------------------------------------------------------------------

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<string | undefined> {
  const from =
    process.env.RESEND_FROM_EMAIL ||
    "My Horse Farm <onboarding@resend.dev>";

  // BCC Jose on all outgoing emails so he can monitor
  const bcc = process.env.EMAIL_BCC_ADDRESS || undefined;

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
    ...(bcc ? { bcc } : {}),
  });

  if (error) throw new Error(`Resend: ${JSON.stringify(error)}`);
  return data?.id;
}

// ---------------------------------------------------------------------------
// Email document wrapper
// ---------------------------------------------------------------------------

function emailDoc(bodyHtml: string, unsubscribeUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;">
<tr><td align="center" style="padding:20px 0;">
${bodyHtml}
<div style="max-width:600px;margin:0 auto;text-align:center;padding:20px;font-size:12px;color:#999;">
<p style="margin:5px 0;">My Horse Farm &middot; Royal Palm Beach, FL 33411 &middot; (561) 576-7667</p>
<p style="margin:5px 0;"><a href="${escapeHtml(unsubscribeUrl)}" style="color:#999;">Unsubscribe</a> | <a href="https://www.myhorsefarm.com/privacy-policy" style="color:#999;">Privacy Policy</a></p>
</div>
</td></tr></table>
</body></html>`;
}

// ---------------------------------------------------------------------------
// Shared header block
// ---------------------------------------------------------------------------

function header(title: string, subtitle?: string): string {
  return `<div style="text-align:center;padding:25px;background-color:#2d5016;">
<img src="https://www.myhorsefarm.com/logo.png" alt="My Horse Farm" style="width:80px;margin-bottom:10px;" />
<h1 style="color:#ffffff;font-size:22px;margin:0;">${title}</h1>
${subtitle ? `<p style="color:#d4a843;font-size:16px;margin:8px 0 0;">${subtitle}</p>` : ""}
</div>`;
}

function signoff(name: string = "Jose Gomez"): string {
  return `<p style="font-size:16px;line-height:1.6;">Talk soon,<br/><strong>${name}</strong><br/>Owner, My Horse Farm<br/><a href="tel:+15615767667" style="color:#2d5016;">(561) 576-7667</a></p>`;
}

// ---------------------------------------------------------------------------
// Template return type
// ---------------------------------------------------------------------------

export interface EmailTemplate {
  subject: string;
  html: string;
}

// ---------------------------------------------------------------------------
// Welcome Email 1 – Services overview
// ---------------------------------------------------------------------------

export function welcomeEmail1(
  firstname: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  return {
    subject: "Welcome to My Horse Farm \u2013 Here\u2019s What We Can Do for You",
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Welcome to My Horse Farm")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">Thank you for reaching out to My Horse Farm! I\u2019m Jose Gomez, and my team and I have been serving Palm Beach County\u2019s equestrian community for over a decade.</p>
<p style="font-size:16px;line-height:1.6;">Whether you need a dumpster for a cleanout, scheduled waste removal, or help getting your property in shape, we\u2019ve got you covered:</p>
<ul style="font-size:15px;line-height:1.8;color:#555;">
<li><strong>Dumpster Rental</strong> \u2013 40-yard dump trailer for cleanouts, construction debris, and big jobs</li>
<li><strong>Waste Removal</strong> \u2013 Leak-proof bins, scheduled pickups, weight tickets on every load</li>
<li><strong>Junk Removal</strong> \u2013 Old fencing, debris, equipment \u2013 we haul it all starting at $75/ton</li>
<li><strong>Sod Installation</strong> \u2013 Professional paddock sod for safe, lush footing</li>
<li><strong>Fill Dirt Delivery</strong> \u2013 Screened fill for leveling paddocks and improving drainage</li>
<li><strong>Farm Repairs</strong> \u2013 Fencing, gates, stalls, driveways, and more</li>
</ul>
<p style="font-size:16px;line-height:1.6;">We serve Wellington, Loxahatchee, Royal Palm Beach, West Palm Beach, and surrounding areas.</p>
<div style="text-align:center;margin:30px 0;">
<a href="https://www.myhorsefarm.com/quote" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">Get a Free Quote</a>
</div>
<p style="font-size:16px;line-height:1.6;">Or call us directly at <a href="tel:+15615767667" style="color:#2d5016;font-weight:bold;">(561) 576-7667</a> \u2013 we typically respond within one business hour.</p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Welcome Email 2 – Testimonials & tips
// ---------------------------------------------------------------------------

export function welcomeEmail2(
  firstname: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  return {
    subject: "What Palm Beach County Farm Owners Say About Us",
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("What Our Clients Say")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">A few days ago we introduced ourselves. Today, we\u2019d like to share what some of our long-time clients have to say:</p>
<div style="background-color:#f9f7f2;border-left:4px solid #d4a843;padding:20px;margin:20px 0;border-radius:4px;">
<p style="font-style:italic;font-size:15px;line-height:1.6;margin:0;">\u201cWe\u2019ve worked with My Horse Farm Services for over a year now and they are hands down the most dependable farm service company in the area. They show up on schedule, the property stays clean, and the communication is excellent.\u201d</p>
<p style="font-size:14px;color:#888;margin:10px 0 0 0;"><strong>\u2014 Sarah M., Wellington, FL</strong></p>
</div>
<div style="background-color:#f9f7f2;border-left:4px solid #d4a843;padding:20px;margin:20px 0;border-radius:4px;">
<p style="font-style:italic;font-size:15px;line-height:1.6;margin:0;">\u201cManaging 40+ stalls means waste piles build up fast. These guys handle our 60-yard loads without issues and always provide weight tickets when needed. Professional, organized, and priced fairly.\u201d</p>
<p style="font-size:14px;color:#888;margin:10px 0 0 0;"><strong>\u2014 Carlos R., Loxahatchee, FL</strong></p>
</div>
<h2 style="color:#2d5016;font-size:18px;margin-top:30px;">Quick Tip: Waste Storage in Florida</h2>
<p style="font-size:15px;line-height:1.6;color:#555;">With Florida\u2019s heat and humidity, open waste piles attract flies within hours and create runoff issues when it rains. Two things every farm should do:</p>
<ul style="font-size:15px;line-height:1.8;color:#555;">
<li><strong>Use covered, leak-proof bins</strong> \u2013 we provide these free with our waste removal service</li>
<li><strong>Position bins 100+ feet from canals</strong> \u2013 Wellington ordinances require this, and it\u2019s good practice everywhere in PBC</li>
</ul>
<p style="font-size:15px;line-height:1.6;color:#555;">Want to learn more? Check out our <a href="https://www.myhorsefarm.com/blog/wellington-manure-hauler-permits" style="color:#2d5016;font-weight:bold;">Complete Guide to Wellington Manure Hauler Permits</a>.</p>
<div style="text-align:center;margin:30px 0;">
<a href="https://www.myhorsefarm.com/quote" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">Get Your Free Quote</a>
</div>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Welcome Email 3 – CTA to book
// ---------------------------------------------------------------------------

export function welcomeEmail3(
  firstname: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  return {
    subject: "10% Off Your First Service \u2013 This Week Only",
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Your 10% New Client Discount", "Limited time \u2013 book this week")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">Over the past week, we\u2019ve shared what My Horse Farm offers and what our clients think of our work. Now we\u2019d love to help <em>you</em> \u2013 and we\u2019re making it easy to get started.</p>
<div style="background-color:#2d5016;color:#fff;padding:25px;border-radius:8px;margin:20px 0;text-align:center;">
<p style="font-size:14px;letter-spacing:2px;margin:0 0 8px;text-transform:uppercase;">New Client Offer</p>
<p style="font-size:32px;font-weight:bold;margin:0;">10% OFF</p>
<p style="font-size:16px;margin:8px 0 0;color:#d4a843;">your first service when you book this week</p>
<p style="font-size:13px;margin:12px 0 0;color:#ffffffaa;">Mention code <strong style="color:#fff;">WELCOME10</strong> when you request your quote</p>
</div>
<p style="font-size:16px;line-height:1.6;">Here\u2019s how easy it is:</p>
<div style="background-color:#f9f7f2;padding:25px;border-radius:8px;margin:20px 0;">
<table style="width:100%;border-collapse:collapse;">
<tr>
<td style="padding:12px 0;vertical-align:top;width:50px;"><span style="display:inline-block;width:36px;height:36px;background-color:#2d5016;color:#fff;border-radius:50%;text-align:center;line-height:36px;font-weight:bold;font-size:16px;">1</span></td>
<td style="padding:12px 0;"><strong style="font-size:15px;">Tell us what you need</strong><br/><span style="font-size:14px;color:#666;">Call (561) 576-7667 or get a quote online \u2013 takes 2 minutes.</span></td>
</tr>
<tr>
<td style="padding:12px 0;vertical-align:top;"><span style="display:inline-block;width:36px;height:36px;background-color:#2d5016;color:#fff;border-radius:50%;text-align:center;line-height:36px;font-weight:bold;font-size:16px;">2</span></td>
<td style="padding:12px 0;"><strong style="font-size:15px;">Get your estimate instantly</strong><br/><span style="font-size:14px;color:#666;">Transparent pricing, no hidden fees. We\u2019ll apply your 10% discount.</span></td>
</tr>
<tr>
<td style="padding:12px 0;vertical-align:top;"><span style="display:inline-block;width:36px;height:36px;background-color:#2d5016;color:#fff;border-radius:50%;text-align:center;line-height:36px;font-weight:bold;font-size:16px;">3</span></td>
<td style="padding:12px 0;"><strong style="font-size:15px;">We handle the rest</strong><br/><span style="font-size:14px;color:#666;">Bins delivered, pickups scheduled, repairs done. One provider for everything.</span></td>
</tr>
</table>
</div>
<div style="text-align:center;margin:30px 0;">
<a href="https://www.myhorsefarm.com/quote" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:16px 40px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:18px;">Claim Your 10% Discount</a>
</div>
<p style="text-align:center;font-size:14px;color:#888;">Or call directly: <a href="tel:+15615767667" style="color:#2d5016;font-weight:bold;">(561) 576-7667</a> and mention WELCOME10</p>
<p style="font-size:16px;line-height:1.6;margin-top:30px;">Looking forward to working with you,<br/><strong>Jose Gomez</strong><br/>Owner, My Horse Farm<br/>(561) 576-7667</p>
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Review Request
// ---------------------------------------------------------------------------

export function reviewRequestEmail(
  firstname: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  return {
    subject: "How did we do? Leave us a quick review",
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Thank You for Choosing Us!")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">Thank you for trusting My Horse Farm with your recent service. We hope everything met your expectations.</p>
<p style="font-size:16px;line-height:1.6;">If you have a moment, we\u2019d really appreciate a quick Google review. It takes less than a minute and helps other horse farm owners in the area find reliable service.</p>
<div style="text-align:center;margin:30px 0;">
<a href="${GOOGLE_REVIEW_URL}" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:16px 40px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:18px;">Leave a Google Review</a>
</div>
<p style="font-size:15px;line-height:1.6;color:#555;">Your feedback helps us improve and lets others know what to expect. Even a short review makes a big difference.</p>
<div style="background-color:#f9f7f2;border-left:4px solid #d4a843;padding:20px;margin:25px 0;border-radius:4px;">
<p style="font-size:14px;color:#666;margin:0 0 10px;"><strong>Not sure what to write? Here are some ideas:</strong></p>
<ul style="font-size:14px;color:#666;margin:0;padding-left:20px;">
<li>How was the scheduling process?</li>
<li>Did we arrive on time?</li>
<li>Was the work done to your satisfaction?</li>
<li>Would you recommend us to other farm owners?</li>
</ul>
</div>
<p style="font-size:16px;line-height:1.6;">Thank you again for your business. If you ever need anything \u2013 waste removal, dumpster rental, junk hauling, sod, repairs \u2013 just give us a call.</p>
<p style="font-size:16px;line-height:1.6;">Warm regards,<br/><strong>Jose Gomez</strong><br/>Owner, My Horse Farm<br/><a href="tel:+15615767667" style="color:#2d5016;">(561) 576-7667</a></p>
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Payment Received / Receipt
// ---------------------------------------------------------------------------

export function paymentReceivedEmail(
  firstname: string,
  amount: string,
  services: string[],
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  const serviceList =
    services.length > 0
      ? services.map((s) => `<li>${escapeHtml(s)}</li>`).join("")
      : "<li>Farm services</li>";

  return {
    subject: `Payment Received \u2013 $${escapeHtml(amount)} \u2013 Thank You!`,
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Payment Received", "Thank you for your payment!")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">We\u2019ve received your payment of <strong>$${escapeHtml(amount)}</strong>. Thank you for choosing My Horse Farm!</p>
<div style="background-color:#f9f7f2;padding:20px;border-radius:8px;margin:20px 0;">
<p style="font-size:14px;color:#666;margin:0 0 10px;"><strong>Services:</strong></p>
<ul style="font-size:15px;line-height:1.8;color:#555;margin:0;padding-left:20px;">${serviceList}</ul>
<p style="font-size:16px;margin:15px 0 0;"><strong>Total: $${escapeHtml(amount)}</strong></p>
</div>
<p style="font-size:16px;line-height:1.6;">If you have any questions about your service or payment, don\u2019t hesitate to reach out.</p>
<div style="text-align:center;margin:30px 0;">
<a href="tel:+15615767667" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">Call (561) 576-7667</a>
</div>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Job Complete Summary
// ---------------------------------------------------------------------------

export function jobCompleteSummaryEmail(
  firstname: string,
  services: string[],
  amount: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  const serviceRows = services
    .map((s) => `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-size:15px;">${escapeHtml(s)}</td></tr>`)
    .join("");

  return {
    subject: "Your Service Is Complete \u2013 Here\u2019s a Summary",
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Service Complete", "Here\u2019s what we did")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">Great news \u2013 your service with My Horse Farm is complete! Here\u2019s a summary of what was done:</p>
<div style="background-color:#f9f7f2;padding:20px;border-radius:8px;margin:20px 0;">
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:8px 0;border-bottom:2px solid #d4a843;font-weight:bold;font-size:14px;color:#666;">Services Performed</td></tr>
${serviceRows || '<tr><td style="padding:8px 0;font-size:15px;">Farm services</td></tr>'}
</table>
<p style="font-size:16px;margin:15px 0 0;text-align:right;"><strong>Total Paid: $${escapeHtml(amount)}</strong></p>
</div>
<p style="font-size:16px;line-height:1.6;">We hope everything meets your expectations. If anything needs attention, please let us know right away \u2013 your satisfaction is our top priority.</p>
<p style="font-size:16px;line-height:1.6;">If you have a moment, we\u2019d love to hear how we did:</p>
<div style="text-align:center;margin:30px 0;">
<a href="${GOOGLE_REVIEW_URL}" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">Leave a Google Review</a>
</div>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Pre-Season Campaign
// ---------------------------------------------------------------------------

export function preSeasonEmail(
  firstname: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  return {
    subject:
      "Get Your Farm Season-Ready Before WEF \u2013 One Call Handles It All",
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Get Your Farm Season-Ready", "One Call Handles It All")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">WEF is around the corner. If your farm still needs work before horses arrive, now is the time to act \u2013 haulers, contractors, and service providers book up fast once November hits.</p>
<p style="font-size:16px;line-height:1.6;">Instead of coordinating three or four different vendors, let us handle everything in one shot:</p>
<div style="margin:25px 0;">
<table style="width:100%;border-collapse:collapse;">
<tr>
<td style="padding:15px;background-color:#f9f7f2;border-bottom:2px solid #fff;width:50%;vertical-align:top;"><strong style="color:#2d5016;">Waste Removal</strong><br/><span style="font-size:14px;color:#666;">Bins delivered, scheduled pickups, weight tickets</span></td>
<td style="padding:15px;background-color:#f9f7f2;border-bottom:2px solid #fff;vertical-align:top;"><strong style="color:#2d5016;">Sod Installation</strong><br/><span style="font-size:14px;color:#666;">Professional paddock sod for safe footing</span></td>
</tr>
<tr>
<td style="padding:15px;background-color:#f9f7f2;border-bottom:2px solid #fff;vertical-align:top;"><strong style="color:#2d5016;">Fill Dirt Delivery</strong><br/><span style="font-size:14px;color:#666;">Level paddocks, fix drainage, build up low spots</span></td>
<td style="padding:15px;background-color:#f9f7f2;border-bottom:2px solid #fff;vertical-align:top;"><strong style="color:#2d5016;">Farm Repairs</strong><br/><span style="font-size:14px;color:#666;">Fencing, gates, stalls, driveways</span></td>
</tr>
<tr>
<td style="padding:15px;background-color:#f9f7f2;vertical-align:top;"><strong style="color:#2d5016;">Property Cleanout</strong><br/><span style="font-size:14px;color:#666;">Old fencing, debris, junk \u2013 cleared in one visit</span></td>
<td style="padding:15px;background-color:#f9f7f2;vertical-align:top;"><strong style="color:#2d5016;">Dumpster Rental</strong><br/><span style="font-size:14px;color:#666;">20-yard containers for barn cleanouts</span></td>
</tr>
</table>
</div>
<div style="background-color:#2d5016;color:#ffffff;padding:25px;border-radius:8px;margin:25px 0;text-align:center;">
<p style="font-size:18px;font-weight:bold;margin:0 0 10px;">Season-Ready Bundle</p>
<p style="font-size:15px;margin:0 0 15px;color:#ccc;">Combine multiple services into one coordinated project.</p>
<a href="https://www.myhorsefarm.com/season-ready" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">See the Full Bundle</a>
</div>
<div style="text-align:center;margin:30px 0;">
<a href="tel:+15615767667" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:16px 40px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:18px;">Call (561) 576-7667</a>
</div>
<p style="font-size:16px;line-height:1.6;margin-top:30px;">Let\u2019s get your farm ready,<br/><strong>Jose Gomez</strong><br/>Owner, My Horse Farm<br/>(561) 576-7667</p>
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// First Payment Welcome Email (replaces paymentReceivedEmail in webhook flow)
// ---------------------------------------------------------------------------

export function firstPaymentWelcomeEmail(
  firstname: string,
  amount: string,
  services: string[],
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  const serviceList =
    services.length > 0
      ? services.map((s) => `<li>${escapeHtml(s)}</li>`).join("")
      : "<li>Farm services</li>";

  return {
    subject: `Welcome to My Horse Farm – Payment of $${escapeHtml(amount)} Received`,
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Welcome to My Horse Farm", "Thank you for your first payment!")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">Thank you for choosing My Horse Farm! We\u2019ve received your payment of <strong>$${escapeHtml(amount)}</strong>.</p>
<div style="background-color:#f9f7f2;padding:20px;border-radius:8px;margin:20px 0;">
<p style="font-size:14px;color:#666;margin:0 0 10px;"><strong>Services:</strong></p>
<ul style="font-size:15px;line-height:1.8;color:#555;margin:0;padding-left:20px;">${serviceList}</ul>
<p style="font-size:16px;margin:15px 0 0;"><strong>Total: $${escapeHtml(amount)}</strong></p>
</div>
<p style="font-size:16px;line-height:1.6;">I\u2019m Jose Gomez, and my team and I have been serving Palm Beach County\u2019s equestrian community for over a decade. Now that you\u2019re part of the family, here\u2019s a quick look at everything we can help with:</p>
<ul style="font-size:15px;line-height:1.8;color:#555;">
<li><strong>Dumpster Rental</strong> \u2013 40-yard dump trailer for cleanouts and big jobs</li>
<li><strong>Waste Removal</strong> \u2013 Leak-proof bins, scheduled pickups, weight tickets on every load</li>
<li><strong>Junk Removal</strong> \u2013 Old fencing, debris, equipment \u2013 starting at $75/ton</li>
<li><strong>Sod Installation</strong> \u2013 Professional paddock sod for safe, lush footing</li>
<li><strong>Fill Dirt Delivery</strong> \u2013 Screened fill for leveling paddocks and drainage</li>
<li><strong>Farm Repairs</strong> \u2013 Fencing, gates, stalls, driveways, and more</li>
</ul>
<p style="font-size:16px;line-height:1.6;">Need anything else? Just call us directly \u2013 we typically respond within one business hour.</p>
<div style="text-align:center;margin:30px 0;">
<a href="tel:+15615767667" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">Call (561) 576-7667</a>
</div>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Loyalty Milestone Email
// ---------------------------------------------------------------------------

export function loyaltyMilestoneEmail(
  firstname: string,
  monthCount: number,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  const monthLabel = monthCount === 6 ? "six months" : "a full year";

  return {
    subject: `It\u2019s Been ${monthCount} Months \u2013 Thank You for Trusting My Horse Farm`,
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Thank You!", `Celebrating ${monthLabel} together`)}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">It\u2019s been ${monthLabel} since you first trusted us with your farm \u2013 and I wanted to take a moment to personally say <strong>thank you</strong>.</p>
<p style="font-size:16px;line-height:1.6;">Loyal clients like you are the reason we do what we do. We know you have options, and the fact that you keep choosing My Horse Farm means the world to our team.</p>
<div style="background-color:#f9f7f2;border-left:4px solid #d4a843;padding:20px;margin:20px 0;border-radius:4px;">
<p style="font-size:16px;line-height:1.6;margin:0;"><strong>As a valued client, you always get:</strong></p>
<ul style="font-size:15px;line-height:1.8;color:#555;margin:10px 0 0;">
<li>Priority scheduling \u2013 you go to the front of the line</li>
<li>Direct line to me personally for any questions</li>
<li>First access to new services and seasonal availability</li>
</ul>
</div>
<p style="font-size:16px;line-height:1.6;">If there\u2019s anything we can do better, I\u2019d love to hear it. Just reply to this email or call me directly.</p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Referral Request Email
// ---------------------------------------------------------------------------

export function referralRequestEmail(
  firstname: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");

  return {
    subject: "Know Another Farm Owner Who Could Use a Hand?",
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("A Quick Favor")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">You\u2019ve been a great client and I really appreciate your trust. I have a small favor to ask.</p>
<p style="font-size:16px;line-height:1.6;">If you know another farm owner in the area who could use reliable farm services \u2013 waste removal, dumpster rental, junk hauling, or anything else we offer \u2013 would you mind passing along my number?</p>
<div style="background-color:#f9f7f2;padding:25px;border-radius:8px;margin:20px 0;text-align:center;">
<p style="font-size:18px;font-weight:bold;color:#2d5016;margin:0 0 5px;">Jose Gomez \u2013 My Horse Farm</p>
<p style="font-size:20px;margin:0;"><a href="tel:+15615767667" style="color:#2d5016;text-decoration:none;font-weight:bold;">(561) 576-7667</a></p>
<p style="font-size:14px;color:#888;margin:10px 0 0;">Or share: <a href="https://www.myhorsefarm.com" style="color:#2d5016;">myhorsefarm.com</a></p>
</div>
<p style="font-size:16px;line-height:1.6;">Most of our business comes from word of mouth, and a recommendation from someone like you means more than any ad we could run.</p>
<p style="font-size:16px;line-height:1.6;">Thank you \u2013 it really does make a difference.</p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Service Upsell Email
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Quote Confirmation Email
// ---------------------------------------------------------------------------

export function quoteConfirmationEmail(
  firstname: string,
  quoteNumber: string,
  serviceName: string,
  breakdown: { base: number; adjustments: { label: string; amount: number }[]; total: number },
  acceptUrl: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  const adjustmentRows = breakdown.adjustments
    .map(
      (a) =>
        `<tr><td style="padding:6px 0;font-size:14px;color:#666;">${escapeHtml(a.label)}</td><td style="padding:6px 0;font-size:14px;color:#666;text-align:right;">${a.amount >= 0 ? "+" : ""}$${Math.abs(a.amount).toFixed(2)}</td></tr>`,
    )
    .join("");

  return {
    subject: `Your Quote ${escapeHtml(quoteNumber)} – $${breakdown.total.toFixed(2)}`,
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Your Quote Is Ready")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">Thanks for requesting a quote from My Horse Farm! Here are the details:</p>
<div style="background-color:#f9f7f2;padding:20px;border-radius:8px;margin:20px 0;">
<p style="font-size:12px;color:#999;margin:0 0 5px;">Quote #</p>
<p style="font-size:16px;font-weight:bold;margin:0 0 15px;color:#2d5016;">${escapeHtml(quoteNumber)}</p>
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:8px 0;border-bottom:2px solid #d4a843;font-weight:bold;font-size:14px;color:#666;">Service</td><td style="padding:8px 0;border-bottom:2px solid #d4a843;font-weight:bold;font-size:14px;color:#666;text-align:right;">Amount</td></tr>
<tr><td style="padding:8px 0;font-size:15px;">${escapeHtml(serviceName)}</td><td style="padding:8px 0;font-size:15px;text-align:right;">$${breakdown.base.toFixed(2)}</td></tr>
${adjustmentRows}
<tr><td style="padding:12px 0;border-top:2px solid #2d5016;font-size:16px;font-weight:bold;">Total</td><td style="padding:12px 0;border-top:2px solid #2d5016;font-size:16px;font-weight:bold;text-align:right;">$${breakdown.total.toFixed(2)}</td></tr>
</table>
</div>
<p style="font-size:14px;color:#888;">This quote is valid for 7 days.</p>
<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:15px;margin:15px 0;">
<p style="font-size:14px;font-weight:bold;color:#1e40af;margin:0 0 8px;">Save with a commitment plan:</p>
<table style="width:100%;border-collapse:collapse;text-align:center;font-size:13px;">
<tr>
<td style="padding:8px;background:#fff;border-radius:4px;border:1px solid #e5e7eb;">Monthly<br/><strong>$${breakdown.total.toFixed(2)}</strong></td>
<td style="padding:8px;background:#fff;border-radius:4px;border:1px solid #bfdbfe;">6-Mo (5% off)<br/><strong style="color:#1e40af;">$${(breakdown.total * 0.95).toFixed(2)}</strong></td>
<td style="padding:8px;background:#f0fdf4;border-radius:4px;border:1px solid #bbf7d0;">Annual (10% off)<br/><strong style="color:#166534;">$${(breakdown.total * 0.90).toFixed(2)}</strong></td>
</tr>
</table>
</div>
<div style="text-align:center;margin:30px 0;">
<a href="${escapeHtml(acceptUrl)}" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:16px 40px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:18px;">Accept &amp; Schedule</a>
</div>
<p style="font-size:16px;line-height:1.6;">Questions? Call us at <a href="tel:+15615767667" style="color:#2d5016;font-weight:bold;">(561) 576-7667</a>.</p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Booking Confirmation Email
// ---------------------------------------------------------------------------

export function bookingConfirmationEmail(
  firstname: string,
  bookingNumber: string,
  serviceName: string,
  date: string,
  timeSlot: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  const slotLabel = timeSlot === "morning" ? "Morning (8 AM – 12 PM)" : "Afternoon (12 PM – 5 PM)";

  return {
    subject: `Booking Confirmed – ${escapeHtml(bookingNumber)}`,
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Booking Confirmed!", "You\u2019re all set")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">Your service has been scheduled. Here are the details:</p>
<div style="background-color:#f9f7f2;padding:20px;border-radius:8px;margin:20px 0;">
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:10px 0;font-size:14px;color:#666;width:120px;">Booking #</td><td style="padding:10px 0;font-size:15px;font-weight:bold;color:#2d5016;">${escapeHtml(bookingNumber)}</td></tr>
<tr><td style="padding:10px 0;font-size:14px;color:#666;">Service</td><td style="padding:10px 0;font-size:15px;">${escapeHtml(serviceName)}</td></tr>
<tr><td style="padding:10px 0;font-size:14px;color:#666;">Date</td><td style="padding:10px 0;font-size:15px;font-weight:bold;">${escapeHtml(date)}</td></tr>
<tr><td style="padding:10px 0;font-size:14px;color:#666;">Time</td><td style="padding:10px 0;font-size:15px;">${escapeHtml(slotLabel)}</td></tr>
</table>
</div>
<p style="font-size:16px;line-height:1.6;">We\u2019ll be at your property during the scheduled window. If anything changes, give us a call and we\u2019ll work it out.</p>
<div style="text-align:center;margin:30px 0;">
<a href="tel:+15615767667" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">Call (561) 576-7667</a>
</div>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Site Visit Request Email
// ---------------------------------------------------------------------------

export function siteVisitRequestEmail(
  firstname: string,
  serviceName: string,
  quoteNumber: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");

  return {
    subject: `Quote Request Received – ${escapeHtml(quoteNumber)}`,
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("We\u2019ll Be in Touch")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">Thanks for your interest in <strong>${escapeHtml(serviceName)}</strong>. This service requires a quick site visit so we can give you an accurate quote.</p>
<div style="background-color:#f9f7f2;padding:20px;border-radius:8px;margin:20px 0;">
<p style="font-size:14px;color:#666;margin:0 0 5px;">Quote Reference</p>
<p style="font-size:16px;font-weight:bold;margin:0;color:#2d5016;">${escapeHtml(quoteNumber)}</p>
</div>
<p style="font-size:16px;line-height:1.6;">Here\u2019s what happens next:</p>
<ol style="font-size:15px;line-height:2.0;color:#555;">
<li>We\u2019ll call you within one business day to schedule a site visit</li>
<li>We\u2019ll visit your property and assess the job</li>
<li>You\u2019ll receive a detailed quote within 24 hours of the visit</li>
</ol>
<p style="font-size:16px;line-height:1.6;">Want to speed things up? Call us directly at <a href="tel:+15615767667" style="color:#2d5016;font-weight:bold;">(561) 576-7667</a>.</p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Chat Handoff Email (internal – to Jose)
// ---------------------------------------------------------------------------

export function chatHandoffEmail(
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  summary: string,
  chatSessionId: string,
): EmailTemplate {
  return {
    subject: `[Chat Handoff] ${escapeHtml(customerName || "Unknown")} needs help`,
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Chat Handoff", "A customer needs personal attention")}
<div style="padding:30px 20px;">
<div style="background-color:#f9f7f2;padding:20px;border-radius:8px;margin:0 0 20px;">
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:8px 0;font-size:14px;color:#666;width:100px;">Name</td><td style="padding:8px 0;font-size:15px;font-weight:bold;">${escapeHtml(customerName || "Not provided")}</td></tr>
<tr><td style="padding:8px 0;font-size:14px;color:#666;">Email</td><td style="padding:8px 0;font-size:15px;">${escapeHtml(customerEmail || "Not provided")}</td></tr>
<tr><td style="padding:8px 0;font-size:14px;color:#666;">Phone</td><td style="padding:8px 0;font-size:15px;">${escapeHtml(customerPhone || "Not provided")}</td></tr>
<tr><td style="padding:8px 0;font-size:14px;color:#666;">Session</td><td style="padding:8px 0;font-size:13px;color:#999;">${escapeHtml(chatSessionId)}</td></tr>
</table>
</div>
<h3 style="color:#2d5016;margin:20px 0 10px;">Conversation Summary</h3>
<div style="background-color:#fff;border:1px solid #e0e0e0;padding:15px;border-radius:8px;">
<p style="font-size:14px;line-height:1.6;color:#555;margin:0;white-space:pre-wrap;">${escapeHtml(summary)}</p>
</div>
</div></div>`,
      "#",
    ),
  };
}

// ---------------------------------------------------------------------------
// Enrollment Confirmation Email (to customer)
// ---------------------------------------------------------------------------

export function enrollmentConfirmationEmail(
  firstname: string,
  cardBrand: string,
  last4: string,
  address: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");

  return {
    subject: "Welcome to My Horse Farm — You're Enrolled!",
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Welcome to My Horse Farm", "You're enrolled!")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">You're all set! Your enrollment with My Horse Farm is complete. Here's a summary:</p>
<div style="background-color:#f9f7f2;padding:20px;border-radius:8px;margin:20px 0;">
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:10px 0;font-size:14px;color:#666;width:140px;">Card on File</td><td style="padding:10px 0;font-size:15px;font-weight:bold;">${escapeHtml(cardBrand)} ending in ${escapeHtml(last4)}</td></tr>
${address ? `<tr><td style="padding:10px 0;font-size:14px;color:#666;">Service Address</td><td style="padding:10px 0;font-size:15px;">${escapeHtml(address)}</td></tr>` : ""}
</table>
</div>
<h3 style="color:#2d5016;margin:25px 0 10px;">What Happens Next</h3>
<ol style="font-size:15px;line-height:2.0;color:#555;">
<li>We'll schedule your first service and confirm the details with you</li>
<li>Our crew will arrive at your property on the scheduled day</li>
<li>Your card on file will be charged after each service is completed</li>
</ol>
<p style="font-size:16px;line-height:1.6;">No surprises — you'll always know the amount before we charge your card.</p>
<p style="font-size:16px;line-height:1.6;">Questions? Call us anytime at <a href="tel:+15615767667" style="color:#2d5016;font-weight:bold;">(561) 576-7667</a>.</p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Enrollment Notification Email (internal – to Jose)
// ---------------------------------------------------------------------------

export function enrollmentNotificationEmail(
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  address: string,
  billingAddress: string,
  cardBrand: string,
  last4: string,
): EmailTemplate {
  return {
    subject: `New Customer Enrolled: ${escapeHtml(customerName)}`,
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("New Customer Enrolled")}
<div style="padding:30px 20px;">
<div style="background-color:#f9f7f2;padding:20px;border-radius:8px;margin:0 0 20px;">
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:8px 0;font-size:14px;color:#666;width:130px;">Name</td><td style="padding:8px 0;font-size:15px;font-weight:bold;">${escapeHtml(customerName)}</td></tr>
<tr><td style="padding:8px 0;font-size:14px;color:#666;">Email</td><td style="padding:8px 0;font-size:15px;">${escapeHtml(customerEmail || "Not provided")}</td></tr>
<tr><td style="padding:8px 0;font-size:14px;color:#666;">Phone</td><td style="padding:8px 0;font-size:15px;">${escapeHtml(customerPhone || "Not provided")}</td></tr>
<tr><td style="padding:8px 0;font-size:14px;color:#666;">Service Address</td><td style="padding:8px 0;font-size:15px;">${escapeHtml(address || "Not provided")}</td></tr>
${billingAddress ? `<tr><td style="padding:8px 0;font-size:14px;color:#666;">Billing Address</td><td style="padding:8px 0;font-size:15px;">${escapeHtml(billingAddress)}</td></tr>` : ""}
<tr><td style="padding:8px 0;font-size:14px;color:#666;">Card on File</td><td style="padding:8px 0;font-size:15px;">${escapeHtml(cardBrand)} ending in ${escapeHtml(last4)}</td></tr>
</table>
</div>
</div></div>`,
      "#",
    ),
  };
}

// ---------------------------------------------------------------------------
// After-Service Email – sent after charge with review CTA
// ---------------------------------------------------------------------------

export function afterServiceEmail(
  firstname: string,
  binsCollected: number,
  serviceDate: string,
  amount: string,
  invoiceUrl: string | null,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  const binLabel = binsCollected === 1 ? "1 bin" : `${binsCollected} bins`;

  return {
    subject: "Service Complete — Here's Your Summary",
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Service Complete", "Thank you!")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">Your service has been completed and your card has been charged. Here's a quick summary:</p>
<div style="background-color:#f9f7f2;padding:20px;border-radius:8px;margin:20px 0;">
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:10px 0;font-size:14px;color:#666;width:140px;">Service Date</td><td style="padding:10px 0;font-size:15px;font-weight:bold;">${escapeHtml(serviceDate)}</td></tr>
<tr><td style="padding:10px 0;font-size:14px;color:#666;">Bins Collected</td><td style="padding:10px 0;font-size:15px;font-weight:bold;">${binLabel}</td></tr>
<tr><td style="padding:10px 0;font-size:14px;color:#666;">Amount Charged</td><td style="padding:10px 0;font-size:15px;font-weight:bold;color:#2d5016;">$${escapeHtml(amount)}</td></tr>
</table>
</div>
${invoiceUrl ? `<div style="text-align:center;margin:20px 0;"><a href="${escapeHtml(invoiceUrl)}" style="color:#2d5016;font-size:14px;text-decoration:underline;">View Invoice</a></div>` : ""}
<h3 style="color:#2d5016;margin:30px 0 10px;">How Did We Do?</h3>
<p style="font-size:16px;line-height:1.6;">We'd love to hear your feedback! If you have a moment, a quick Google review means the world to us:</p>
<div style="text-align:center;margin:25px 0;">
<a href="${GOOGLE_REVIEW_URL}" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">Leave a Review</a>
</div>
<p style="font-size:16px;line-height:1.6;">See you next time! If you ever need anything, call us at <a href="tel:+15615767667" style="color:#2d5016;font-weight:bold;">(561) 576-7667</a>.</p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Service-specific urgency hooks for follow-ups
// ---------------------------------------------------------------------------

const SERVICE_HOOKS: Record<string, { followup1: string; followup2: string }> = {
  manure_removal: {
    followup1: "Waste piles only get worse with time \u2014 let\u2019s get it handled before it becomes a bigger problem.",
    followup2: "Lock in your rate before peak season pricing kicks in. Our crews are booking up fast.",
  },
  junk_removal: {
    followup1: "That debris isn\u2019t going anywhere on its own. Let\u2019s clear it out before the rains make access harder.",
    followup2: "We have a truck in your area this week — perfect time to knock this out while we\u2019re close by.",
  },
  sod_installation: {
    followup1: "The best time to lay sod in South Florida is right now — your new paddock turf will establish quickly in this weather.",
    followup2: "Sod projects book out 2\u20133 weeks. If you want it done this month, now\u2019s the time to lock in your spot.",
  },
  trash_bin_service: {
    followup1: "Overflowing bins attract pests and create health issues for your horses. Let\u2019s get you on a regular schedule.",
    followup2: "Our recurring bin service keeps your farm clean without you lifting a finger. Most clients start with weekly pickup.",
  },
  fill_dirt: {
    followup1: "Low spots and drainage issues only get worse with rain. Fill dirt now means a dry, safe paddock all season.",
    followup2: "We have fill dirt loads ready to go this week. Lock in your quote before material prices go up.",
  },
  dumpster_rental: {
    followup1: "A dumpster on-site makes barn cleanouts 10x faster. Our 20-yard containers handle even the biggest jobs.",
    followup2: "Dumpster availability is limited — we only have a few containers, and they go fast during season.",
  },
};

function getServiceHook(serviceKey: string, type: "followup1" | "followup2"): string {
  return SERVICE_HOOKS[serviceKey]?.[type] || (
    type === "followup1"
      ? "We put together the details based on your property needs, and I wanted to make sure you had everything you need to move forward."
      : "Our schedule fills up fast, especially during season \u2014 locking in your spot now guarantees we can get to your property on your preferred timeline."
  );
}

// ---------------------------------------------------------------------------
// Quote Follow-Up Email 1 – "Just checking in" (service-specific)
// ---------------------------------------------------------------------------

export function quoteFollowup1Email(
  firstname: string,
  quoteNumber: string,
  acceptUrl: string,
  unsubscribeUrl: string,
  serviceKey?: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  const hook = getServiceHook(serviceKey || "", "followup1");

  return {
    subject: `Just Checking In — Your Quote ${escapeHtml(quoteNumber)} Is Waiting`,
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Your Quote Is Ready")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">I wanted to follow up on your recent quote (<strong>${escapeHtml(quoteNumber)}</strong>). ${hook}</p>
<p style="font-size:16px;line-height:1.6;">If you have any questions about the pricing or what's included, I'm happy to chat — just reply to this email or give me a call.</p>
<div style="text-align:center;margin:30px 0;">
<a href="${escapeHtml(acceptUrl)}" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">View Your Quote</a>
</div>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Quote Follow-Up Email 2 – "Last reminder" (service-specific)
// ---------------------------------------------------------------------------

export function quoteFollowup2Email(
  firstname: string,
  quoteNumber: string,
  acceptUrl: string,
  unsubscribeUrl: string,
  serviceKey?: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  const hook = getServiceHook(serviceKey || "", "followup2");

  return {
    subject: `Last Reminder — Your Quote ${escapeHtml(quoteNumber)} Expires Soon`,
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Don't Miss Out")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">This is a friendly last reminder that your quote <strong>${escapeHtml(quoteNumber)}</strong> is still open. ${hook}</p>
<div style="text-align:center;margin:30px 0;">
<a href="${escapeHtml(acceptUrl)}" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">View Your Quote</a>
</div>
<p style="font-size:16px;line-height:1.6;">Questions? Just call <a href="tel:+15615767667" style="color:#2d5016;font-weight:bold;">(561) 576-7667</a> — I'm happy to help.</p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Expired Quote Recovery Email – "Your quote expired — get a fresh one"
// ---------------------------------------------------------------------------

export function quoteExpiredRecoveryEmail(
  firstname: string,
  serviceName: string,
  newQuoteUrl: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");

  return {
    subject: "Your Quote Expired — Get a Fresh One in 30 Seconds",
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Let's Try Again")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">Your quote for <strong>${escapeHtml(serviceName)}</strong> has expired, but don't worry — getting a new one takes less than a minute.</p>
<p style="font-size:16px;line-height:1.6;">If you're still interested, click below and we'll have a fresh quote ready for you right away. Same great service, same team you can count on.</p>
<div style="text-align:center;margin:30px 0;">
<a href="${escapeHtml(newQuoteUrl)}" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">Get a New Quote</a>
</div>
<p style="font-size:16px;line-height:1.6;">Or call me directly — I'll take care of everything over the phone.</p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Referral Request Email (with personalized link)
// ---------------------------------------------------------------------------

export function referralRequestWithLinkEmail(
  firstname: string,
  referralUrl: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");

  return {
    subject: "Give $25, Get $50 — Share My Horse Farm",
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Refer a Friend, Get Rewarded")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">Thanks for being a valued My Horse Farm client! We\u2019d love your help spreading the word.</p>
<div style="background-color:#f9f7f2;padding:25px;border-radius:8px;margin:20px 0;text-align:center;">
<p style="font-size:18px;font-weight:bold;color:#2d5016;margin:0 0 10px;">Your Referral Link</p>
<p style="font-size:14px;color:#666;margin:0 0 15px;">Share this with any farm owner who could use our services:</p>
<a href="${escapeHtml(referralUrl)}" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:12px 28px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:15px;">Share My Link</a>
<p style="font-size:13px;color:#999;margin:15px 0 0;">Or copy: ${escapeHtml(referralUrl)}</p>
</div>
<div style="margin:20px 0;">
<p style="font-size:15px;line-height:1.8;"><strong>How it works:</strong></p>
<ol style="font-size:15px;line-height:2.0;color:#555;">
<li>Share your link with a fellow farm owner</li>
<li>They get <strong>$25 off</strong> their first service</li>
<li>You get <strong>$50 credit</strong> after their first job is done</li>
</ol>
</div>
<p style="font-size:16px;line-height:1.6;">No limit on referrals. The more friends you send, the more you earn!</p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Quote Expiring Email – "Your quote expires in X days"
// ---------------------------------------------------------------------------

export function quoteExpiringEmail(
  firstname: string,
  quoteNumber: string,
  daysLeft: number,
  acceptUrl: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");

  return {
    subject: `Your Quote ${escapeHtml(quoteNumber)} Expires in ${daysLeft} Days`,
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Quote Expiring Soon")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">Just a heads up — your quote <strong>${escapeHtml(quoteNumber)}</strong> expires in <strong>${daysLeft} day${daysLeft !== 1 ? "s" : ""}</strong>.</p>
<p style="font-size:16px;line-height:1.6;">If you'd still like to move forward, now's a great time to lock in your pricing and get on our schedule.</p>
<div style="text-align:center;margin:30px 0;">
<a href="${escapeHtml(acceptUrl)}" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">Accept Quote Before It Expires</a>
</div>
<p style="font-size:16px;line-height:1.6;">Need more time or have questions? Call me at <a href="tel:+15615767667" style="color:#2d5016;font-weight:bold;">(561) 576-7667</a>.</p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Payment Failed Email (to customer)
// ---------------------------------------------------------------------------

export function paymentFailedEmail(
  firstName: string,
  amount: string,
  unsubscribeUrl: string,
): { subject: string; html: string } {
  return {
    subject: "Action Needed: Payment Issue – My Horse Farm",
    html: emailDoc(`
      ${header("Payment Issue")}
      <p>Hi ${escapeHtml(firstName)},</p>
      <p>We tried to process your scheduled payment of <strong>$${escapeHtml(amount)}</strong> for your My Horse Farm service, but the charge didn't go through.</p>
      <p>This can happen if your card expired, the bank declined the charge, or your payment details changed.</p>
      <p><strong>What to do next:</strong></p>
      <ul>
        <li>Call us at <a href="tel:+15615767667">(561) 576-7667</a> to update your payment method</li>
        <li>Or reply to this email and we'll get it sorted out</li>
      </ul>
      <p>We'll try again in a few days, but please reach out so your service isn't interrupted.</p>
      ${signoff()}
    `, unsubscribeUrl),
  };
}

// ---------------------------------------------------------------------------
// Auto-Charge Summary Email (internal – to Jose)
// ---------------------------------------------------------------------------

export function autoChargeSummaryEmail(
  date: string,
  results: { name: string; amount: string; status: string }[],
): EmailTemplate {
  const rows = results
    .map(
      (r) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;">${escapeHtml(r.name)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;text-align:right;">$${escapeHtml(r.amount)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;text-align:center;color:${r.status === "charged" ? "#2d5016" : "#c00"};">${escapeHtml(r.status)}</td></tr>`,
    )
    .join("");

  const charged = results.filter((r) => r.status === "charged");
  const failed = results.filter((r) => r.status === "failed");
  const totalCharged = charged.reduce((s, r) => s + parseFloat(r.amount), 0);

  return {
    subject: `Auto-Charge Summary — ${escapeHtml(date)}`,
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Auto-Charge Summary")}
<div style="padding:30px 20px;">
<div style="background-color:#f9f7f2;padding:15px;border-radius:8px;margin:0 0 20px;">
<p style="margin:5px 0;font-size:15px;"><strong>Date:</strong> ${escapeHtml(date)}</p>
<p style="margin:5px 0;font-size:15px;"><strong>Charged:</strong> ${charged.length} ($${totalCharged.toFixed(2)})</p>
<p style="margin:5px 0;font-size:15px;color:${failed.length > 0 ? "#c00" : "#333"};"><strong>Failed:</strong> ${failed.length}</p>
</div>
<table style="width:100%;border-collapse:collapse;">
<thead><tr style="background:#f0f0f0;"><th style="padding:8px 12px;text-align:left;font-size:13px;">Customer</th><th style="padding:8px 12px;text-align:right;font-size:13px;">Amount</th><th style="padding:8px 12px;text-align:center;font-size:13px;">Status</th></tr></thead>
<tbody>${rows}</tbody>
</table>
</div></div>`,
      "#",
    ),
  };
}

// ---------------------------------------------------------------------------
// Crew Dispatch Email – daily job list for crew members
// ---------------------------------------------------------------------------

export function crewDispatchEmail(
  crewName: string,
  date: string,
  jobs: { customerName: string; address: string; notes: string | null }[],
): EmailTemplate {
  const name = escapeHtml(crewName || "Team");
  const jobRows = jobs
    .map(
      (j, i) =>
        `<tr><td style="padding:10px 12px;border-bottom:1px solid #eee;font-size:14px;font-weight:bold;">${i + 1}. ${escapeHtml(j.customerName)}</td></tr>
<tr><td style="padding:0 12px 10px;font-size:13px;color:#666;">${escapeHtml(j.address || "No address on file")}${j.notes ? `<br/><em>${escapeHtml(j.notes)}</em>` : ""}</td></tr>`,
    )
    .join("");

  return {
    subject: `Your Jobs for Today — ${escapeHtml(date)}`,
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Today's Job List", date)}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">Here are your assigned jobs for today. Please log each service when complete.</p>
<table style="width:100%;border-collapse:collapse;margin:20px 0;">
${jobRows}
</table>
<p style="font-size:15px;line-height:1.6;color:#666;">Total jobs: <strong>${jobs.length}</strong></p>
<p style="font-size:16px;line-height:1.6;">Questions? Call Jose at <a href="tel:+15615767667" style="color:#2d5016;font-weight:bold;">(561) 576-7667</a>.</p>
</div></div>`,
      "#",
    ),
  };
}

// ---------------------------------------------------------------------------
// Service Upsell Email
// ---------------------------------------------------------------------------

export function serviceUpsellEmail(
  firstname: string,
  suggestedServices: string[],
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  const serviceItems = suggestedServices
    .map((s) => `<li>${escapeHtml(s)}</li>`)
    .join("");

  return {
    subject: "Did You Know We Also Offer These Services?",
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("More Ways We Can Help")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">Thanks for being a loyal My Horse Farm client. I wanted to make sure you knew about a few other services we offer that might be useful for your property:</p>
<div style="background-color:#f9f7f2;padding:20px;border-radius:8px;margin:20px 0;">
<ul style="font-size:15px;line-height:2.0;color:#555;margin:0;padding-left:20px;">${serviceItems}</ul>
</div>
<p style="font-size:16px;line-height:1.6;">Since we already know your property and your needs, bundling services is easy \u2013 one call, one provider, and everything gets handled together.</p>
<p style="font-size:16px;line-height:1.6;">If any of these sound useful, just give me a call and I\u2019ll put together a quick quote.</p>
<div style="text-align:center;margin:30px 0;">
<a href="tel:+15615767667" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">Call (561) 576-7667</a>
</div>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Charge Failed Alert (to admin)
// ---------------------------------------------------------------------------

export function chargeFailedAlertEmail(
  customerName: string,
  serviceDate: string,
  amount: string,
  errorMessage: string,
): EmailTemplate {
  return {
    subject: `Charge Failed — ${customerName} (${serviceDate})`,
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Charge Failed")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">A charge attempt has failed:</p>
<div style="background-color:#fef2f2;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #dc2626;">
<p style="margin:0 0 8px 0;font-size:15px;"><strong>Customer:</strong> ${escapeHtml(customerName)}</p>
<p style="margin:0 0 8px 0;font-size:15px;"><strong>Service Date:</strong> ${escapeHtml(serviceDate)}</p>
<p style="margin:0 0 8px 0;font-size:15px;"><strong>Amount:</strong> $${escapeHtml(amount)}</p>
<p style="margin:0;font-size:15px;color:#dc2626;"><strong>Error:</strong> ${escapeHtml(errorMessage)}</p>
</div>
<p style="font-size:16px;line-height:1.6;">You can retry this charge from the <a href="https://www.myhorsefarm.com/admin/daily" style="color:#2563eb;">Daily Dashboard</a>.</p>
</div></div>`,
      "", // no unsubscribe link for admin alerts
    ),
  };
}

// ---------------------------------------------------------------------------
// Portal Login
// ---------------------------------------------------------------------------

export function portalLoginEmail(
  firstname: string,
  portalUrl: string,
  unsubscribeUrl: string,
): EmailTemplate {
  return {
    subject: "Your My Horse Farm Portal Link",
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Customer Portal")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${escapeHtml(firstname)},</p>
<p style="font-size:16px;line-height:1.6;">Click the button below to access your My Horse Farm portal. You can view your service history, upcoming services, and invoices.</p>
<div style="text-align:center;margin:30px 0;">
<a href="${escapeHtml(portalUrl)}" style="display:inline-block;padding:14px 32px;background-color:#2d5016;color:#fff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:600;">Open My Portal</a>
</div>
<p style="font-size:14px;color:#666;">This link is valid for 7 days. If you didn&rsquo;t request this, you can safely ignore this email.</p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

export function chatRecoveryEmail(
  firstname: string,
  serviceName: string,
  quoteUrl: string,
  unsubscribeUrl: string,
): EmailTemplate {
  return {
    subject: `Still thinking about ${serviceName}? Let's get you a quote`,
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("We Saved Your Spot")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${escapeHtml(firstname)},</p>
<p style="font-size:16px;line-height:1.6;">We noticed you were chatting with us about ${escapeHtml(serviceName)} but didn&rsquo;t get a chance to finish. No worries — we saved your details.</p>
<p style="font-size:16px;line-height:1.6;">Click below to pick up where you left off and get your free quote in under 60 seconds:</p>
<div style="text-align:center;margin:30px 0;">
<a href="${escapeHtml(quoteUrl)}" style="display:inline-block;padding:14px 32px;background-color:#2d5016;color:#fff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:600;">Get My Free Quote</a>
</div>
<p style="font-size:14px;color:#666;">Or just reply to this email — we&rsquo;ll take it from there.</p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Lost Deal Re-Engagement Email
// ---------------------------------------------------------------------------

export function lostDealReengageEmail(
  firstname: string,
  dealName: string,
  quoteUrl: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");

  return {
    subject: `Still need help with ${escapeHtml(dealName)}?`,
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("We'd Love Another Chance")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">A while back, we talked about <strong>${escapeHtml(dealName)}</strong> for your property. I know timing doesn&rsquo;t always work out, and that&rsquo;s okay.</p>
<p style="font-size:16px;line-height:1.6;">If your situation has changed or you&rsquo;re ready to move forward, we&rsquo;re here and happy to help. Our team is available and we can get you a fresh quote in under a minute.</p>
<div style="text-align:center;margin:30px 0;">
<a href="${escapeHtml(quoteUrl)}" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">Get a New Quote</a>
</div>
<p style="font-size:16px;line-height:1.6;">Or just call me directly at <a href="tel:+15615767667" style="color:#2d5016;font-weight:bold;">(561) 576-7667</a> &mdash; no pressure, just here to help.</p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Lapsed Customer Re-Engagement Email
// ---------------------------------------------------------------------------

export function lapsedCustomerReengageEmail(
  firstname: string,
  quoteUrl: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");

  return {
    subject: `${escapeHtml(firstname || "Hey")} — it's been a while! Let's catch up`,
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("It's Been a While")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">It&rsquo;s been a few months since your last service with My Horse Farm, and I wanted to check in. Whether you need a dumpster rental, waste removal, junk hauling, sod, or farm repairs &mdash; we&rsquo;re still here and ready to help.</p>
<p style="font-size:16px;line-height:1.6;">A lot of our returning clients are surprised at how much we&rsquo;ve grown. We&rsquo;ve added new services and our scheduling is faster than ever.</p>
<div style="background-color:#f9f7f2;padding:25px;border-radius:8px;margin:20px 0;text-align:center;">
<p style="font-size:18px;font-weight:bold;color:#2d5016;margin:0 0 5px;">One call handles everything</p>
<p style="font-size:14px;color:#666;margin:0;">Dumpsters &middot; Waste Removal &middot; Junk &middot; Sod &middot; Fill Dirt &middot; Repairs</p>
</div>
<div style="text-align:center;margin:30px 0;">
<a href="${escapeHtml(quoteUrl)}" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">Get a Free Quote</a>
</div>
<p style="font-size:16px;line-height:1.6;">Or call me directly &mdash; <a href="tel:+15615767667" style="color:#2d5016;font-weight:bold;">(561) 576-7667</a>. I&rsquo;d love to hear how your farm is doing.</p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Cold Lead Re-Engagement Email
// ---------------------------------------------------------------------------

export function coldLeadReengageEmail(
  firstname: string,
  quoteUrl: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");

  return {
    subject: "Still looking for farm services in Palm Beach County?",
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Still Looking for Help?")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">You reached out to My Horse Farm a while back, and I wanted to follow up in case you&rsquo;re still looking for reliable farm services in the Wellington, Loxahatchee, or Royal Palm Beach area.</p>
<p style="font-size:16px;line-height:1.6;">We handle everything from dumpster rentals and waste removal to junk hauling, sod, fill dirt, and farm repairs &mdash; all with one phone call.</p>
<div style="background-color:#f9f7f2;border-left:4px solid #d4a843;padding:20px;margin:20px 0;border-radius:4px;">
<p style="font-style:italic;font-size:15px;line-height:1.6;margin:0;">&ldquo;We&rsquo;ve worked with My Horse Farm for over a year now and they are hands down the most dependable farm service company in the area.&rdquo;</p>
<p style="font-size:14px;color:#888;margin:10px 0 0 0;"><strong>&mdash; Sarah M., Wellington, FL</strong></p>
</div>
<div style="text-align:center;margin:30px 0;">
<a href="${escapeHtml(quoteUrl)}" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">Get a Free Quote</a>
</div>
<p style="font-size:16px;line-height:1.6;">Or give me a call at <a href="tel:+15615767667" style="color:#2d5016;font-weight:bold;">(561) 576-7667</a> &mdash; happy to answer any questions.</p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

export function winbackEmail(
  firstname: string,
  serviceName: string,
  enrollUrl: string,
  unsubscribeUrl: string,
): EmailTemplate {
  return {
    subject: `We miss you, ${firstname}! Come back and save 10%`,
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("We'd Love to Have You Back")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${escapeHtml(firstname)},</p>
<p style="font-size:16px;line-height:1.6;">It&rsquo;s been a little while since your last ${escapeHtml(serviceName)} service with us. We&rsquo;d love to have you back.</p>
<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;text-align:center;margin:20px 0;">
<p style="font-size:20px;font-weight:bold;color:#2d5016;margin:0;">Save 10% when you sign up for an annual plan</p>
</div>
<div style="text-align:center;margin:30px 0;">
<a href="${escapeHtml(enrollUrl)}" style="display:inline-block;padding:14px 32px;background-color:#2d5016;color:#fff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:600;">Re-Enroll Now</a>
</div>
<p style="font-size:14px;color:#666;">Or call us at (561) 576-7667 — we&rsquo;ll get you set up in minutes.</p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ===========================================================================
// LEAD NURTURE CAMPAIGN — 3 segments x 5 emails
// ===========================================================================

// ---------------------------------------------------------------------------
// EQUESTRIAN SEGMENT (Nona Garson list + farm leads)
// ---------------------------------------------------------------------------

export function nurtureEquestrian1(
  firstname: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  return {
    subject: "Palm Beach County's Most Trusted Farm Service — $50 Off Your First Job",
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("My Horse Farm", "Serving Palm Beach County Since 2005")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">I'm Jose Gomez. For over 20 years my team has been keeping farms clean and running in Wellington, Loxahatchee, and the surrounding equestrian corridor.</p>
<p style="font-size:16px;line-height:1.6;">If you need a property cleanout, scheduled waste removal, or want a reliable service that shows up on time — we should talk.</p>
<div style="background:#f0fdf4;border:2px solid #2d5016;border-radius:8px;padding:25px;text-align:center;margin:25px 0;">
<p style="font-size:22px;font-weight:bold;color:#2d5016;margin:0;">$50 OFF</p>
<p style="font-size:16px;color:#555;margin:8px 0 0;">Any service $300 or more — first-time or returning clients</p>
</div>
<p style="font-size:16px;line-height:1.6;">Our services:</p>
<ul style="font-size:15px;line-height:1.8;color:#555;">
<li><strong>Dumpster Rental</strong> — 40-yard dump trailer for cleanouts and big jobs</li>
<li><strong>Waste Removal</strong> — leak-proof bins, scheduled pickups, weight tickets</li>
<li><strong>Junk &amp; Debris Removal</strong> — old fencing, equipment, trash starting at $75/ton</li>
<li><strong>Sod Installation</strong> — professional paddock sod</li>
<li><strong>Fill Dirt</strong> — screened fill for leveling and drainage</li>
<li><strong>Farm Repairs</strong> — fencing, gates, stalls, driveways</li>
</ul>
<div style="text-align:center;margin:30px 0;">
<a href="https://www.myhorsefarm.com/offers" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">Get Your $50 Off Quote</a>
</div>
<p style="font-size:16px;line-height:1.6;">Or call <a href="tel:+15615767667" style="color:#2d5016;font-weight:bold;">(561) 576-7667</a> — mention this email for the discount.</p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

export function nurtureEquestrian2(
  firstname: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  return {
    subject: "Why 275+ Farms Trust My Horse Farm",
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Real Results from Real Farms")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">A few days ago I reached out about our farm services. Today I want to show you what our clients say:</p>
<div style="background:#f9f7f2;border-left:4px solid #d4a843;padding:20px;margin:20px 0;border-radius:4px;">
<p style="font-size:15px;line-height:1.6;margin:0;font-style:italic;">"Jose and his team are the most reliable service we've used in Wellington. They show up on time, every time, and the property looks great after every visit."</p>
<p style="font-size:13px;color:#888;margin:10px 0 0;">— Farm Owner, Wellington FL</p>
</div>
<div style="background:#f9f7f2;border-left:4px solid #d4a843;padding:20px;margin:20px 0;border-radius:4px;">
<p style="font-size:15px;line-height:1.6;margin:0;font-style:italic;">"We switched from our previous hauler two years ago and haven't looked back. Fair pricing, professional crew, weight tickets on every load."</p>
<p style="font-size:13px;color:#888;margin:10px 0 0;">— Barn Manager, Loxahatchee FL</p>
</div>
<p style="font-size:16px;line-height:1.6;">We've served <strong>275+ farms</strong> across Palm Beach County. That's 20 years of showing up and doing the job right.</p>
<div style="text-align:center;margin:30px 0;">
<a href="https://www.myhorsefarm.com/offers" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">Get a Free Quote</a>
</div>
<p style="font-size:14px;color:#666;">Don't forget — $50 off any service $300+ for first-time or returning clients.</p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

export function nurtureEquestrian3(
  firstname: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  return {
    subject: `${name === "there" ? "A" : firstname + ", a"} free month at Resilient Fitness — on us`,
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Book a Service, Get a Bonus")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">We partnered with <strong>Resilient Fitness in Wellington</strong> to offer something special to new and returning clients:</p>
<div style="background:#2d5016;color:#fff;padding:25px;border-radius:8px;margin:25px 0;">
<p style="font-size:18px;font-weight:bold;margin:0 0 15px;text-align:center;">Book Any MHF Service &amp; Get:</p>
<table style="width:100%;color:#fff;">
<tr><td style="padding:8px 0;font-size:15px;">&#10003; <strong>1 FREE month</strong> at Resilient Fitness</td></tr>
<tr><td style="padding:8px 0;font-size:15px;">&#10003; <strong>2 FREE personal training sessions</strong></td></tr>
<tr><td style="padding:8px 0;font-size:15px;">&#10003; <strong>$50 OFF</strong> your service ($300+ jobs)</td></tr>
</table>
</div>
<p style="font-size:16px;line-height:1.6;">That's over <strong>$200 in value</strong> just for booking a service you already need. Whether it's a dumpster rental, waste removal, or farm repairs — the bonus is yours.</p>
<div style="text-align:center;margin:30px 0;">
<a href="https://www.myhorsefarm.com/offers" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:16px 40px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:18px;">Claim Your Bonus — Get a Quote</a>
</div>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

export function nurtureEquestrian4(
  firstname: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  return {
    subject: "Free dance class + farm service savings — limited time",
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Even More Perks This Month")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">We keep adding more reasons to work with My Horse Farm. On top of the $50 discount and Resilient Fitness perk, we just added:</p>
<div style="background:#f9f7f2;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
<p style="font-size:20px;font-weight:bold;color:#2d5016;margin:0;">1 FREE Class at Starpoint Dancesport</p>
<p style="font-size:14px;color:#666;margin:8px 0 0;">Wellington's premier dance studio — salsa, bachata, ballroom &amp; more</p>
</div>
<p style="font-size:16px;line-height:1.6;">Here's everything you get when you book:</p>
<table style="width:100%;border-collapse:collapse;margin:20px 0;">
<tr><td style="padding:12px;background:#f0fdf4;border-bottom:2px solid #fff;">&#127919; <strong>$50 off</strong> any service $300+</td></tr>
<tr><td style="padding:12px;background:#f0fdf4;border-bottom:2px solid #fff;">&#128170; <strong>Free month</strong> at Resilient Fitness + 2 PT sessions</td></tr>
<tr><td style="padding:12px;background:#f0fdf4;">&#128131; <strong>Free class</strong> at Starpoint Dancesport</td></tr>
</table>
<p style="font-size:16px;line-height:1.6;">These partner perks are limited and available while supplies last.</p>
<div style="text-align:center;margin:30px 0;">
<a href="https://www.myhorsefarm.com/offers" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">Lock In Your Perks — Get a Quote</a>
</div>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

export function nurtureEquestrian5(
  firstname: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  return {
    subject: "Last chance — $50 off + $200 in bonuses expires soon",
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Last Chance")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">This is my last email about our new client offer. I don't like to spam, but I want to make sure you didn't miss this:</p>
<div style="background:#2d5016;color:#fff;padding:25px;border-radius:8px;margin:25px 0;text-align:center;">
<p style="font-size:22px;font-weight:bold;margin:0;">$50 OFF + $200 in Perks</p>
<p style="font-size:15px;margin:10px 0 0;color:#d4a843;">For first-time or returning My Horse Farm clients</p>
</div>
<p style="font-size:16px;line-height:1.6;"><strong>What you get:</strong></p>
<ul style="font-size:15px;line-height:2;color:#555;">
<li>$50 off any service $300+ (waste removal, dumpster rental, and more)</li>
<li>Free month membership at Resilient Fitness in Wellington</li>
<li>2 free personal training sessions</li>
<li>Free class at Starpoint Dancesport</li>
</ul>
<p style="font-size:16px;line-height:1.6;">Over 275 farms trust us. Let us earn yours.</p>
<div style="text-align:center;margin:30px 0;">
<a href="https://www.myhorsefarm.com/offers" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:16px 40px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:18px;">Get Your Quote Now</a>
</div>
<p style="font-size:16px;line-height:1.6;">Or call <a href="tel:+15615767667" style="color:#2d5016;font-weight:bold;">(561) 576-7667</a> anytime.</p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// RESILIENT FITNESS SEGMENT
// ---------------------------------------------------------------------------

export function nurtureFitness1(
  firstname: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  return {
    subject: "From the gym to the farm — a Wellington partnership",
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Resilient Fitness x My Horse Farm")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">You know Resilient Fitness keeps you in shape. Now meet <strong>My Horse Farm</strong> — we keep Wellington's farms in shape.</p>
<p style="font-size:16px;line-height:1.6;">As a Resilient Fitness member, we're offering you an exclusive deal:</p>
<div style="background:#f0fdf4;border:2px solid #2d5016;border-radius:8px;padding:25px;text-align:center;margin:25px 0;">
<p style="font-size:22px;font-weight:bold;color:#2d5016;margin:0;">$50 OFF</p>
<p style="font-size:16px;color:#555;margin:8px 0 0;">Any farm service $300 or more</p>
<p style="font-size:14px;color:#888;margin:5px 0 0;">Dumpster rental, waste removal, cleanouts, sod, fill dirt, farm repairs &amp; more</p>
</div>
<p style="font-size:16px;line-height:1.6;">Whether you own a farm, know someone who does, or your property needs work — we handle it all in Wellington, Loxahatchee, Royal Palm Beach, and surrounding areas.</p>
<div style="text-align:center;margin:30px 0;">
<a href="https://www.myhorsefarm.com/offers" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">Get a Free Quote</a>
</div>
<p style="font-size:16px;line-height:1.6;">Or call <a href="tel:+15615767667" style="color:#2d5016;font-weight:bold;">(561) 576-7667</a> — we respond within one hour.</p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

export function nurtureFitness2(
  firstname: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  return {
    subject: "Farm services most Wellington residents don't know about",
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("More Than You Think")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">My Horse Farm handles a lot more than waste removal — and it's not just for horse farms:</p>
<div style="margin:25px 0;">
<table style="width:100%;border-collapse:collapse;">
<tr>
<td style="padding:15px;background:#f9f7f2;border-bottom:2px solid #fff;width:50%;vertical-align:top;"><strong style="color:#2d5016;">Property Cleanouts</strong><br/><span style="font-size:14px;color:#666;">Old junk, fencing, debris — gone in one visit</span></td>
<td style="padding:15px;background:#f9f7f2;border-bottom:2px solid #fff;vertical-align:top;"><strong style="color:#2d5016;">Sod &amp; Fill Dirt</strong><br/><span style="font-size:14px;color:#666;">Level your yard, fix drainage, fresh sod</span></td>
</tr>
<tr>
<td style="padding:15px;background:#f9f7f2;border-bottom:2px solid #fff;vertical-align:top;"><strong style="color:#2d5016;">Dumpster Rental</strong><br/><span style="font-size:14px;color:#666;">20-yard containers for any project</span></td>
<td style="padding:15px;background:#f9f7f2;border-bottom:2px solid #fff;vertical-align:top;"><strong style="color:#2d5016;">Fence &amp; Gate Repair</strong><br/><span style="font-size:14px;color:#666;">Residential &amp; equestrian fencing</span></td>
</tr>
<tr>
<td style="padding:15px;background:#f9f7f2;vertical-align:top;"><strong style="color:#2d5016;">Hauling Services</strong><br/><span style="font-size:14px;color:#666;">We haul anything — farm or residential</span></td>
<td style="padding:15px;background:#f9f7f2;vertical-align:top;"><strong style="color:#2d5016;">Farm Repairs</strong><br/><span style="font-size:14px;color:#666;">Stalls, driveways, shelters, and more</span></td>
</tr>
</table>
</div>
<p style="font-size:16px;line-height:1.6;">Know someone who needs any of this? Share this email — they'll get $50 off and you'll help a local business.</p>
<div style="text-align:center;margin:30px 0;">
<a href="https://www.myhorsefarm.com/offers" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">Get a Free Quote</a>
</div>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

export function nurtureFitness3(
  firstname: string,
  unsubscribeUrl: string,
): EmailTemplate {
  return nurtureEquestrian3(firstname, unsubscribeUrl);
}

export function nurtureFitness4(
  firstname: string,
  unsubscribeUrl: string,
): EmailTemplate {
  return nurtureEquestrian4(firstname, unsubscribeUrl);
}

export function nurtureFitness5(
  firstname: string,
  unsubscribeUrl: string,
): EmailTemplate {
  return nurtureEquestrian5(firstname, unsubscribeUrl);
}

// ---------------------------------------------------------------------------
// MHF EXISTING CLIENTS SEGMENT (active + inactive)
// ---------------------------------------------------------------------------

export function nurtureMHF1(
  firstname: string,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  return {
    subject: `${name === "there" ? "Welcome" : firstname + ", welcome"} back — $50 off your next service`,
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Good to See You Again")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">It's Jose from My Horse Farm. It's been a while, and I wanted to reach out personally.</p>
<p style="font-size:16px;line-height:1.6;">Whether you're still at the same property or have moved, we'd love to work with you again. To make it easy to reconnect:</p>
<div style="background:#f0fdf4;border:2px solid #2d5016;border-radius:8px;padding:25px;text-align:center;margin:25px 0;">
<p style="font-size:22px;font-weight:bold;color:#2d5016;margin:0;">$50 OFF</p>
<p style="font-size:16px;color:#555;margin:8px 0 0;">Any service $300+ — waste removal, dumpster rental, and more</p>
<p style="font-size:14px;color:#888;margin:5px 0 0;">For returning clients like you</p>
</div>
<p style="font-size:16px;line-height:1.6;">Everything you remember about us is still true — reliable crews, fair pricing, weight tickets on every load. Plus we've added AI-powered quoting on our website so you can get a price in minutes.</p>
<div style="text-align:center;margin:30px 0;">
<a href="https://www.myhorsefarm.com/offers" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">Get Your $50 Off Quote</a>
</div>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

export function nurtureMHF2(
  firstname: string,
  unsubscribeUrl: string,
): EmailTemplate {
  return nurtureEquestrian2(firstname, unsubscribeUrl);
}

export function nurtureMHF3(
  firstname: string,
  unsubscribeUrl: string,
): EmailTemplate {
  return nurtureEquestrian3(firstname, unsubscribeUrl);
}

export function nurtureMHF4(
  firstname: string,
  unsubscribeUrl: string,
): EmailTemplate {
  return nurtureEquestrian4(firstname, unsubscribeUrl);
}

export function nurtureMHF5(
  firstname: string,
  unsubscribeUrl: string,
): EmailTemplate {
  return nurtureEquestrian5(firstname, unsubscribeUrl);
}

// ---------------------------------------------------------------------------
// Monthly Newsletter
// ---------------------------------------------------------------------------

interface NewsletterContent {
  greeting: string;
  tip: string;
  spotlight: { title: string; description: string };
}

function getNewsletterContent(month: number): NewsletterContent {
  // Service spotlight rotates by month (0-indexed): waste removal, sod, fill dirt, junk removal, farm repairs, dumpster rental
  const spotlights = [
    { title: "Waste Removal", description: "Keep your paddocks clean and fly-free with our scheduled waste pickup. Leak-proof bins provided at no extra cost, weight tickets on every load." },
    { title: "Sod Installation", description: "Professional paddock sod for safe, lush footing. We handle grading, installation, and follow-up care instructions so your pastures look their best." },
    { title: "Fill Dirt Delivery", description: "Screened fill dirt for leveling paddocks, improving drainage, and building up low spots. Delivered and spread on your schedule." },
    { title: "Junk Removal", description: "Old fencing, broken equipment, storm debris \u2014 we haul it all starting at $75/ton. Fast turnaround, clean results." },
    { title: "Farm Repairs", description: "Fencing, gates, stalls, driveways, and more. We handle the repairs so you can focus on your horses." },
    { title: "Dumpster Rental", description: "20-yard containers perfect for barn cleanouts, renovations, and large-scale property cleanup." },
  ];

  const spotlight = spotlights[month % spotlights.length];

  // Seasonal greeting
  let greeting: string;
  if (month >= 0 && month <= 2) {
    greeting = "WEF season is in full swing! With Wellington buzzing and barns at full capacity, now\u2019s the time to make sure your farm operations are running smoothly.";
  } else if (month >= 3 && month <= 4) {
    greeting = "Spring is here in South Florida! As the show season winds down, it\u2019s the perfect time to catch up on maintenance and get your property in top shape.";
  } else if (month >= 5 && month <= 9) {
    greeting = "Summer in South Florida means heat, humidity, and hurricane season. Stay ahead of the weather with proper farm maintenance and storm prep.";
  } else {
    greeting = "Fall is a great time to prep your farm for the upcoming season. Whether you\u2019re getting ready for WEF or just want to tighten things up, we\u2019re here to help.";
  }

  // Seasonal tip
  let tip: string;
  if (month >= 0 && month <= 2) {
    tip = "During peak season, waste builds up faster with more horses on site. Consider bumping your pickup schedule to twice a week to stay compliant with Wellington ordinances and keep flies under control.";
  } else if (month >= 3 && month <= 4) {
    tip = "Spring is the best time to resod worn paddocks. Warm-season grass establishes fast in April and May, and you\u2019ll have lush footing before summer rains hit.";
  } else if (month >= 5 && month <= 7) {
    tip = "Hurricane prep starts now. Clear loose debris, secure fencing, and make sure drainage ditches are clean. Need a dumpster for a pre-storm cleanout? We can have one to you within 24 hours.";
  } else if (month >= 8 && month <= 9) {
    tip = "Late hurricane season is no time to relax. Keep emergency supplies stocked, have a debris removal plan in place, and check that all gates and latches are secure.";
  } else {
    tip = "Pre-season is the time to fix fencing, grade driveways, and address any drainage issues before the winter rains and WEF traffic arrive. Book early \u2014 our schedule fills up fast in November.";
  }

  return { greeting, tip, spotlight };
}

export function monthlyNewsletterEmail(
  firstname: string,
  month: number,
  year: number,
  unsubscribeUrl: string,
): EmailTemplate {
  const name = escapeHtml(firstname || "there");
  const { greeting, tip, spotlight } = getNewsletterContent(month);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthName = monthNames[month] ?? "This Month";

  return {
    subject: `My Horse Farm \u2013 ${monthName} ${year} Newsletter`,
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("My Horse Farm", `${monthName} ${year} Newsletter`)}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
<p style="font-size:16px;line-height:1.6;">${greeting}</p>

<h2 style="color:#2d5016;font-size:18px;margin-top:30px;border-bottom:2px solid #d4a843;padding-bottom:8px;">Current Offers</h2>
<ul style="font-size:15px;line-height:1.8;color:#555;">
<li><strong>$50 Off Your First Service</strong> \u2013 New customers save $50 on any service over $200. Mention this newsletter when you book.</li>
<li><strong>Resilient Fitness Program</strong> \u2013 Comprehensive farm maintenance packages to keep your property in peak condition year-round.</li>
<li><strong>Starpoint Partnership</strong> \u2013 Premium equestrian property services with our trusted partners for large-scale projects.</li>
</ul>
<div style="text-align:center;margin:25px 0;">
<a href="https://www.myhorsefarm.com/offers" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">View All Offers</a>
</div>

<h2 style="color:#2d5016;font-size:18px;margin-top:30px;border-bottom:2px solid #d4a843;padding-bottom:8px;">Service Spotlight: ${spotlight.title}</h2>
<p style="font-size:15px;line-height:1.6;color:#555;">${spotlight.description}</p>
<div style="text-align:center;margin:25px 0;">
<a href="https://www.myhorsefarm.com/quote" style="display:inline-block;background-color:#2d5016;color:#ffffff;padding:12px 28px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:15px;">Get a Free Quote</a>
</div>

<h2 style="color:#2d5016;font-size:18px;margin-top:30px;border-bottom:2px solid #d4a843;padding-bottom:8px;">Farm Tip of the Month</h2>
<div style="background-color:#f9f7f2;border-left:4px solid #d4a843;padding:20px;margin:15px 0;border-radius:4px;">
<p style="font-size:15px;line-height:1.6;margin:0;color:#555;">${tip}</p>
</div>

<p style="font-size:16px;line-height:1.6;margin-top:30px;">Questions or ready to schedule? Call us at <a href="tel:+15615767667" style="color:#2d5016;font-weight:bold;">(561) 576-7667</a> or reply to this email.</p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// ---------------------------------------------------------------------------
// Cron Monitoring Alerts
// ---------------------------------------------------------------------------

export function cronFailureAlertEmail(
  cronName: string,
  errorMessage: string,
  timestamp: string,
  stackTrace?: string,
): { subject: string; html: string } {
  return {
    subject: `\u26a0\ufe0f Cron Failed: ${cronName}`,
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;padding:20px;">
<div style="background:#dc2626;color:#fff;padding:20px;border-radius:8px 8px 0 0;">
<h1 style="margin:0;font-size:20px;">Cron Job Failed</h1>
<p style="margin:8px 0 0;color:#fecaca;font-size:14px;">${escapeHtml(cronName)}</p>
</div>
<div style="background:#fff;border:1px solid #e5e7eb;padding:25px;border-radius:0 0 8px 8px;">
<table style="width:100%;margin-bottom:20px;">
<tr><td style="padding:8px 0;font-weight:bold;color:#666;width:100px;">Cron:</td><td style="padding:8px 0;">${escapeHtml(cronName)}</td></tr>
<tr><td style="padding:8px 0;font-weight:bold;color:#666;">Time:</td><td style="padding:8px 0;">${escapeHtml(timestamp)}</td></tr>
</table>
<h2 style="font-size:14px;color:#dc2626;margin-top:20px;">Error</h2>
<pre style="background:#fef2f2;border:1px solid #fecaca;border-radius:4px;padding:15px;font-size:13px;overflow-x:auto;white-space:pre-wrap;word-break:break-word;">${escapeHtml(errorMessage)}</pre>
${stackTrace ? `<h2 style="font-size:14px;color:#666;margin-top:20px;">Stack Trace</h2>
<pre style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:4px;padding:15px;font-size:11px;overflow-x:auto;white-space:pre-wrap;word-break:break-word;color:#666;">${escapeHtml(stackTrace)}</pre>` : ""}
<div style="margin-top:25px;padding-top:15px;border-top:1px solid #eee;">
<p style="font-size:13px;color:#999;">Check <a href="https://vercel.com/dashboard" style="color:#2d5016;">Vercel Logs</a> for more details.</p>
</div>
</div>
</body></html>`,
  };
}

// ---------------------------------------------------------------------------
// Spring Special Campaign
// ---------------------------------------------------------------------------

export function springSpecialEmail(
  firstName: string,
  unsubscribeUrl: string,
): { subject: string; html: string } {
  const name = escapeHtml(firstName || "there");
  return {
    subject: "15% Off All Farm Services \u2014 Spring Special \ud83c\udf3f",
    html: emailDoc(
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
${header("Spring Special: 15% Off")}
<div style="padding:30px 20px;">
<p style="font-size:16px;line-height:1.6;">Hey ${name},</p>
<p style="font-size:16px;line-height:1.6;">Season's over and it's time to get your farm in shape for summer. We're offering <strong>15% off all services</strong> through April 30th.</p>
<p style="font-size:16px;line-height:1.6;">Here's what we can help with:</p>
<ul style="font-size:15px;line-height:1.8;color:#555;">
<li><strong>Waste Removal</strong> \u2013 Scheduled pickups with leak-proof bins</li>
<li><strong>Farm Repairs</strong> \u2013 Fencing, gates, stalls, driveways</li>
<li><strong>Junk Removal</strong> \u2013 Old debris, equipment, cleanouts</li>
<li><strong>Sod Installation</strong> \u2013 Professional paddock sod</li>
<li><strong>Fill Dirt</strong> \u2013 Screened fill for leveling and drainage</li>
<li><strong>Pressure Washing</strong> \u2013 Barns, patios, driveways</li>
</ul>
<div style="text-align:center;margin:30px 0;">
<a href="https://www.myhorsefarm.com/spring-special" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">Get Your Free Quote</a>
</div>
<p style="font-size:16px;line-height:1.6;">Or call us: <a href="tel:+15615767667" style="color:#2d5016;font-weight:bold;">(561) 576-7667</a> | WhatsApp: <a href="https://wa.me/15615767667" style="color:#2d5016;font-weight:bold;">wa.me/15615767667</a></p>
${signoff()}
</div></div>`,
      unsubscribeUrl,
    ),
  };
}

// TODO: Implement daily cron health digest that summarizes all cron runs
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function cronHealthDigestEmail(
  _runs: Array<{ cronName: string; ok: boolean; durationMs: number; error?: string; timestamp: string }>,
): { subject: string; html: string } {
  // TODO: Build an HTML table summarizing all cron runs for the day
  return {
    subject: "MHF Cron Health Digest",
    html: "<p>TODO: implement cron health digest</p>",
  };
}

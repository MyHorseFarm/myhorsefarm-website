import { createHmac } from "crypto";
import { Resend } from "resend";

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
  return sig === expected;
}

// ---------------------------------------------------------------------------
// Send
// ---------------------------------------------------------------------------

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  const from =
    process.env.RESEND_FROM_EMAIL ||
    "My Horse Farm <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (error) throw new Error(`Resend: ${JSON.stringify(error)}`);
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
<p style="font-size:16px;line-height:1.6;">Whether you need regular manure removal, a one-time property cleanout, or help getting your farm season-ready, we\u2019ve got you covered:</p>
<ul style="font-size:15px;line-height:1.8;color:#555;">
<li><strong>Manure Removal</strong> \u2013 Leak-proof bins, scheduled pickups, weight tickets on every load</li>
<li><strong>Junk Removal</strong> \u2013 Old fencing, debris, equipment \u2013 we haul it all starting at $75/ton</li>
<li><strong>Sod Installation</strong> \u2013 Professional paddock sod for safe, lush footing</li>
<li><strong>Fill Dirt Delivery</strong> \u2013 Screened fill for leveling paddocks and improving drainage</li>
<li><strong>Dumpster Rental</strong> \u2013 20-yard containers for barn cleanouts and renovations</li>
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
<p style="font-style:italic;font-size:15px;line-height:1.6;margin:0;">\u201cWe\u2019ve worked with My Horse Farm Services for over a year now and they are hands down the most dependable manure removal company in the area. They show up on schedule, the property stays clean, and the communication is excellent.\u201d</p>
<p style="font-size:14px;color:#888;margin:10px 0 0 0;"><strong>\u2014 Sarah M., Wellington, FL</strong></p>
</div>
<div style="background-color:#f9f7f2;border-left:4px solid #d4a843;padding:20px;margin:20px 0;border-radius:4px;">
<p style="font-style:italic;font-size:15px;line-height:1.6;margin:0;">\u201cManaging 40+ stalls means manure piles build up fast. These guys handle our 60-yard loads without issues and always provide weight tickets when needed. Professional, organized, and priced fairly.\u201d</p>
<p style="font-size:14px;color:#888;margin:10px 0 0 0;"><strong>\u2014 Carlos R., Loxahatchee, FL</strong></p>
</div>
<h2 style="color:#2d5016;font-size:18px;margin-top:30px;">Quick Tip: Manure Storage in Florida</h2>
<p style="font-size:15px;line-height:1.6;color:#555;">With Florida\u2019s heat and humidity, open manure piles attract flies within hours and create runoff issues when it rains. Two things every farm should do:</p>
<ul style="font-size:15px;line-height:1.8;color:#555;">
<li><strong>Use covered, leak-proof bins</strong> \u2013 we provide these free with our manure removal service</li>
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
<a href="https://g.page/r/CUtJdTADtIsyEBM/review" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:16px 40px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:18px;">Leave a Google Review</a>
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
<p style="font-size:16px;line-height:1.6;">Thank you again for your business. If you ever need anything \u2013 manure removal, junk hauling, sod, repairs \u2013 just give us a call.</p>
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
<a href="https://g.page/r/CUtJdTADtIsyEBM/review" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">Leave a Google Review</a>
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
<td style="padding:15px;background-color:#f9f7f2;border-bottom:2px solid #fff;width:50%;vertical-align:top;"><strong style="color:#2d5016;">Manure Removal</strong><br/><span style="font-size:14px;color:#666;">Bins delivered, scheduled pickups, weight tickets</span></td>
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
<li><strong>Manure Removal</strong> \u2013 Leak-proof bins, scheduled pickups, weight tickets on every load</li>
<li><strong>Junk Removal</strong> \u2013 Old fencing, debris, equipment \u2013 starting at $75/ton</li>
<li><strong>Sod Installation</strong> \u2013 Professional paddock sod for safe, lush footing</li>
<li><strong>Fill Dirt Delivery</strong> \u2013 Screened fill for leveling paddocks and drainage</li>
<li><strong>Dumpster Rental</strong> \u2013 20-yard containers for barn cleanouts</li>
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
<p style="font-size:16px;line-height:1.6;">If you know another farm owner in the area who could use reliable manure removal, junk hauling, or any of our services \u2013 would you mind passing along my number?</p>
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
<a href="https://g.page/r/Ccxk3fVm-TL-EBM/review" style="display:inline-block;background-color:#d4a843;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">Leave a Review</a>
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
    followup1: "Manure piles only get worse with time — let\u2019s get it handled before it becomes a bigger (and smellier) problem.",
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

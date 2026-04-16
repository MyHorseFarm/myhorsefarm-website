// ---------------------------------------------------------------------------
// Social Media Post Content Generator
// ---------------------------------------------------------------------------

export interface SocialPost {
  id: string;
  theme: string;
  service: "junk" | "waste" | "manure" | "dumpster" | "cleanout" | "general";
  text: string;
  image: string;
  platforms: ("facebook" | "instagram")[];
  cta: string;
  link: string;
}

const PHONE = "(561) 576-7667";
const SITE = "https://www.myhorsefarm.com";
const QUOTE_URL = `${SITE}/quote`;
const PRICING_URL = `${SITE}/pricing`;

// ---------------------------------------------------------------------------
// 32 Post Templates
// ---------------------------------------------------------------------------

export const POST_TEMPLATES: SocialPost[] = [
  // --- Junk Removal (5) ---
  {
    id: "junk-before-after-1",
    theme: "before-after",
    service: "junk",
    text: `Another garage transformation! Swipe to see the before & after. Our crew cleared out years of accumulated junk in just a few hours.

If it's taking up space, we'll haul it away. Call us today at ${PHONE} for a free estimate.

#junkremoval #palmbeach #southflorida #garageCleanout #beforeandafter #myhorsefarm #wellington #cleanup #royalpalmbeach #declutter`,
    image: "before-1.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Get a free estimate today!",
    link: QUOTE_URL,
  },
  {
    id: "junk-pricing-urgency",
    theme: "pricing",
    service: "junk",
    text: `Got junk? We've got the truck. Starting at just $150 for small loads.

Same-day and next-day pickups available throughout Palm Beach County. No hidden fees, no surprises — just honest pricing and a clean property.

Call ${PHONE} or visit our site to get your free quote.

#junkremoval #palmbeach #sameday #affordableservice #southflorida #myhorsefarm #wellington #loxahatchee #wasteRemoval #cleanup`,
    image: "truck-farm.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Book your junk removal now!",
    link: PRICING_URL,
  },
  {
    id: "junk-what-we-take",
    theme: "educational",
    service: "junk",
    text: `Not sure if we can take it? Here's a quick list of what we haul:

- Old furniture & appliances
- Yard debris & landscaping waste
- Construction leftovers
- Mattresses & box springs
- Hot tubs & sheds
- Pretty much anything non-hazardous!

Give us a call at ${PHONE} and we'll give you an honest quote.

#junkremoval #palmbeach #whatwetake #hauling #southflorida #myhorsefarm #wellington #royalpalmbeach #loxahatchee #cleanup`,
    image: "trailer-side-loaded.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Call for a free quote!",
    link: QUOTE_URL,
  },
  {
    id: "junk-after-shot",
    theme: "before-after",
    service: "junk",
    text: `This is what "done right" looks like. Clean property, happy customer, zero stress.

We handle everything — loading, hauling, disposal. You just point and we do the rest.

Ready for a fresh start? Call ${PHONE}.

#junkremoval #palmbeach #cleanproperty #doneright #myhorsefarm #southflorida #wellington #aftershot #cleanup #propertyservice`,
    image: "after-1.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Schedule your cleanout!",
    link: QUOTE_URL,
  },
  {
    id: "junk-weekend-special",
    theme: "special-offer",
    service: "junk",
    text: `WEEKEND SPECIAL: Book your junk removal this week and get 10% off loads over $300!

We're filling up the schedule fast for this month. Don't wait until the last minute — spots go quick in South Florida.

Call ${PHONE} to lock in your discount.

#junkremoval #palmbeach #weekendspecial #discount #southflorida #myhorsefarm #wellington #savemoney #loxahatchee #deal`,
    image: "trailer-loaded-manure.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Claim your discount!",
    link: QUOTE_URL,
  },

  // --- Waste / Manure Removal (5) ---
  {
    id: "manure-horse-farm",
    theme: "service-spotlight",
    service: "manure",
    text: `Horse farms produce a LOT of manure — and it doesn't remove itself. That's where we come in.

My Horse Farm provides scheduled manure removal for equestrian properties across Wellington, Loxahatchee, and Palm Beach County. Weekly, biweekly, or on-demand.

Keep your barn clean and your horses happy. Call ${PHONE}.

#manureremoval #horsefarm #wellington #equestrian #palmbeach #myhorsefarm #loxahatchee #horsestable #barnlife #southflorida`,
    image: "service-manure.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Schedule your manure removal!",
    link: PRICING_URL,
  },
  {
    id: "manure-bulk-pickup",
    theme: "service-spotlight",
    service: "manure",
    text: `Big pile? No problem. We handle bulk manure removal for farms of all sizes — from 2-stall barns to 30+ horse operations.

Our crews are fast, reliable, and we leave your property spotless every time.

${PHONE} | myhorsefarm.com

#manureremoval #horsefarm #wellington #bulkremoval #equestrian #palmbeach #myhorsefarm #wasteRemoval #loxahatchee #farmlife`,
    image: "service-bulk-manure.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Get a bulk removal quote!",
    link: QUOTE_URL,
  },
  {
    id: "waste-why-regular",
    theme: "educational",
    service: "waste",
    text: `Did you know? A single horse produces 50 lbs of manure PER DAY. That's nearly 9 tons a year.

Without regular removal, you're looking at fly problems, odor complaints, and potential health risks for your horses.

Set up a regular pickup schedule and never worry about it again. Call ${PHONE}.

#wasteRemoval #horsefarm #manure #equestrian #palmbeach #wellington #myhorsefarm #horsecare #barnmanagement #southflorida`,
    image: "horses-paddock.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Set up your schedule today!",
    link: PRICING_URL,
  },
  {
    id: "manure-trailer-action",
    theme: "behind-the-scenes",
    service: "manure",
    text: `Early morning on the farm. Our crew loading up another trailer of manure — this is what we do, day in and day out.

Serving Wellington, Loxahatchee, Royal Palm Beach, and all of Palm Beach County.

${PHONE} | myhorsefarm.com

#manureremoval #behindthescenes #horsefarm #wellington #loxahatchee #palmbeach #myhorsefarm #hardwork #equestrian #farmservice`,
    image: "dumping-action.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Book your removal!",
    link: QUOTE_URL,
  },
  {
    id: "waste-composting-tip",
    theme: "educational",
    service: "waste",
    text: `Did you know horse manure makes excellent compost when handled properly? But storing it incorrectly can attract pests and create runoff issues.

We remove your manure responsibly and recycle what we can. Better for your farm, better for the environment.

Questions? Call ${PHONE}.

#composting #wasteRemoval #horsefarm #ecofriendly #palmbeach #myhorsefarm #wellington #greenservice #recycling #horsemanure`,
    image: "mhf-trailer-at-farm.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Ask about our eco-friendly disposal!",
    link: QUOTE_URL,
  },

  // --- Dumpster Rental (4) ---
  {
    id: "dumpster-construction",
    theme: "service-spotlight",
    service: "dumpster",
    text: `Construction project? Renovation? We've got the dumpster for you.

Available in multiple sizes for residential and commercial jobs. Drop-off and pickup on YOUR schedule.

Serving Wellington, West Palm Beach, Boca Raton, Delray Beach, and more.

Call ${PHONE} for availability and pricing.

#dumpsterrental #construction #renovation #palmbeach #wellington #myhorsefarm #southflorida #homeimprovement #westpalmbeach #bocaraton`,
    image: "service-dumpster.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Reserve your dumpster!",
    link: PRICING_URL,
  },
  {
    id: "dumpster-cleanout",
    theme: "service-spotlight",
    service: "dumpster",
    text: `Doing a big cleanout? A dumpster rental makes it easy. Load it up at your own pace — we pick it up when you're done.

Perfect for:
- Home renovations
- Estate cleanouts
- Garage purges
- Roof tear-offs

Call ${PHONE} to get your dumpster delivered.

#dumpsterrental #cleanout #palmbeach #renovation #myhorsefarm #southflorida #wellington #homeproject #wastemanagement #propertyservice`,
    image: "container-open.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Order your dumpster today!",
    link: PRICING_URL,
  },
  {
    id: "dumpster-bins-at-barn",
    theme: "behind-the-scenes",
    service: "dumpster",
    text: `Our bins stationed right at the barn, ready for easy loading. We make dumpster rental simple for horse farms and equestrian facilities.

Flexible scheduling. Fair pricing. No hassle.

${PHONE} | myhorsefarm.com

#dumpsterrental #horsefarm #equestrian #wellington #palmbeach #myhorsefarm #barnlife #wastemanagement #loxahatchee #southflorida`,
    image: "bins-at-barn.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Get a dumpster at your barn!",
    link: PRICING_URL,
  },
  {
    id: "dumpster-size-guide",
    theme: "educational",
    service: "dumpster",
    text: `Not sure what size dumpster you need? Here's a quick guide:

- Small cleanout or single room: 10-yard
- Full garage or small renovation: 20-yard
- Major construction or whole-house cleanout: 30-yard

Still not sure? Call us at ${PHONE} and we'll help you figure it out. No pressure, just honest advice.

#dumpsterrental #sizeguide #palmbeach #wellington #myhorsefarm #southflorida #construction #renovation #wastemanagement #homeproject`,
    image: "service-dumpster.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Call for dumpster sizing help!",
    link: PRICING_URL,
  },

  // --- Property Cleanouts (3) ---
  {
    id: "cleanout-foreclosure",
    theme: "service-spotlight",
    service: "cleanout",
    text: `Foreclosure cleanout? Estate cleanout? We handle it all.

Banks, property managers, and realtors trust us to get properties cleaned out fast and ready for market. We remove everything — furniture, appliances, debris, you name it.

Call ${PHONE} for a walkthrough and quote.

#propertycleanout #foreclosure #estatesale #palmbeach #wellington #myhorsefarm #realestate #southflorida #propertymgmt #cleanout`,
    image: "before-1.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Schedule a walkthrough!",
    link: QUOTE_URL,
  },
  {
    id: "cleanout-estate",
    theme: "service-spotlight",
    service: "cleanout",
    text: `Dealing with an estate cleanout? We understand it can be overwhelming. Let us handle the heavy lifting so you don't have to.

Compassionate service. Thorough cleanup. Fair pricing.

Serving all of Palm Beach County. Call ${PHONE}.

#estatecleanout #propertycleanout #palmbeach #myhorsefarm #wellington #southflorida #compassionateservice #cleanup #royalpalmbeach #bocaraton`,
    image: "after-1.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Let us help — call today!",
    link: QUOTE_URL,
  },
  {
    id: "cleanout-commercial",
    theme: "service-spotlight",
    service: "cleanout",
    text: `Commercial property cleanout? Office, warehouse, retail space — we clear it all.

Fast turnaround so you can get your property leased, sold, or renovated without delays.

${PHONE} | myhorsefarm.com

#commercialcleanout #propertycleanout #palmbeach #myhorsefarm #commercial #southflorida #wellington #wasteRemoval #propertyservice #businesscleanup`,
    image: "truck-farm.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Get your property cleared!",
    link: QUOTE_URL,
  },

  // --- Seasonal Tips (3) ---
  {
    id: "seasonal-hurricane-prep",
    theme: "seasonal",
    service: "general",
    text: `Hurricane season is around the corner. Is your property ready?

Now is the time to clear out yard debris, remove old structures, and get rid of anything that could become a projectile in high winds.

We can help you prep. Call ${PHONE} for a property assessment.

#hurricaneprep #southflorida #palmbeach #hurricaneseason #myhorsefarm #wellington #staysafe #propertymaintenance #yardcleanup #floridaweather`,
    image: "hero-farm.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Prep your property now!",
    link: QUOTE_URL,
  },
  {
    id: "seasonal-spring-cleaning",
    theme: "seasonal",
    service: "general",
    text: `Spring cleaning isn't just for inside the house! Your yard, barn, and property need attention too.

Let us handle the heavy stuff — junk removal, debris hauling, manure cleanup, you name it.

Fresh season, fresh property. Call ${PHONE}.

#springcleaning #palmbeach #myhorsefarm #southflorida #wellington #yardcleanup #freshstart #horsefarm #propertymaintenance #cleanup`,
    image: "drone-farm.mp4",
    platforms: ["facebook", "instagram"],
    cta: "Start your spring cleanup!",
    link: QUOTE_URL,
  },
  {
    id: "seasonal-summer-heat",
    theme: "seasonal",
    service: "general",
    text: `South Florida summer = hot, humid, and things start to smell FAST.

Don't let manure or waste pile up in this heat. Regular removal keeps your property clean, your neighbors happy, and your horses healthy.

Set up a summer schedule with us. Call ${PHONE}.

#summerheat #southflorida #palmbeach #myhorsefarm #wellington #manureremoval #horsefarm #propertymaintenance #floridaheat #wasteRemoval`,
    image: "horses-paddock.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Set up your summer schedule!",
    link: PRICING_URL,
  },

  // --- Testimonials (3) ---
  {
    id: "testimonial-wellington-farm",
    theme: "testimonial",
    service: "manure",
    text: `"We've been using My Horse Farm for our manure removal for over a year now. Always on time, always thorough. Best service in Wellington!" — Sarah M., Wellington

We're proud to serve the equestrian community. Thank you for trusting us with your farm.

Want the same reliable service? Call ${PHONE}.

#testimonial #customerreview #wellington #horsefarm #manureremoval #myhorsefarm #palmbeach #equestrian #fivestar #trustedservice`,
    image: "mhf-trailer-at-farm.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Join our happy customers!",
    link: QUOTE_URL,
  },
  {
    id: "testimonial-junk-removal",
    theme: "testimonial",
    service: "junk",
    text: `"Called at 9 AM, they were here by noon. Took everything from the garage — old furniture, boxes, broken equipment. Place looks brand new!" — Carlos R., Royal Palm Beach

Same-day service when you need it. That's the My Horse Farm difference.

${PHONE} | myhorsefarm.com

#testimonial #customerreview #junkremoval #royalpalmbeach #myhorsefarm #palmbeach #sameday #fastservice #cleanup #southflorida`,
    image: "after-1.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Experience the difference!",
    link: QUOTE_URL,
  },
  {
    id: "testimonial-property-manager",
    theme: "testimonial",
    service: "cleanout",
    text: `"I manage 15 rental properties and My Horse Farm is my go-to for cleanouts. Fast, affordable, and they always leave the place spotless." — David L., West Palm Beach

Property managers: we've got you covered. Volume discounts available.

Call ${PHONE}.

#testimonial #propertymanagement #cleanout #westpalmbeach #myhorsefarm #palmbeach #rental #realestate #southflorida #trustedservice`,
    image: "truck-farm.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Ask about volume pricing!",
    link: QUOTE_URL,
  },

  // --- Behind the Scenes (3) ---
  {
    id: "bts-crew-morning",
    theme: "behind-the-scenes",
    service: "general",
    text: `5:30 AM and the crew is already loading up. Early starts, hard work, and getting the job done right — that's how we roll at My Horse Farm.

Grateful for this team every single day.

${PHONE} | myhorsefarm.com

#behindthescenes #hardwork #earlymorning #crew #myhorsefarm #palmbeach #wellington #southflorida #smallbusiness #teamwork`,
    image: "jose-founder.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Work with a team that cares!",
    link: SITE,
  },
  {
    id: "bts-truck-loaded",
    theme: "behind-the-scenes",
    service: "junk",
    text: `Another full load heading out. This is what a productive day looks like at My Horse Farm.

From horse manure to household junk — we haul it all across Palm Beach County.

Need something removed? Call ${PHONE}.

#behindthescenes #trucklife #hauling #myhorsefarm #palmbeach #wellington #junkremoval #manureremoval #southflorida #workday`,
    image: "trailer-loaded-manure.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Let us haul it for you!",
    link: QUOTE_URL,
  },
  {
    id: "bts-farm-delivery",
    theme: "behind-the-scenes",
    service: "general",
    text: `Delivering fill dirt and sod to a farm in Loxahatchee. We don't just remove — we also deliver what your property needs.

Fill dirt, sod, and more. One call does it all: ${PHONE}.

#delivery #filldirt #sod #loxahatchee #myhorsefarm #palmbeach #horsefarm #southflorida #farmlife #landscaping`,
    image: "sod-delivery.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Order your delivery!",
    link: PRICING_URL,
  },

  // --- Service Area Shoutouts (3) ---
  {
    id: "area-wellington",
    theme: "area-shoutout",
    service: "manure",
    text: `Wellington, we've got you covered! As the equestrian capital of the world, we know your farms need reliable manure and waste removal.

My Horse Farm has been proudly serving Wellington's horse community for years.

Call ${PHONE} for Wellington-area service.

#wellington #equestrian #horsefarm #manureremoval #myhorsefarm #palmbeach #southflorida #wellingtonfl #equestrianlife #farmservice`,
    image: "horses-paddock.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Wellington's trusted farm service!",
    link: QUOTE_URL,
  },
  {
    id: "area-loxahatchee",
    theme: "area-shoutout",
    service: "general",
    text: `Loxahatchee residents — we're your neighbors and your go-to for farm services, junk removal, and property cleanouts.

From the Acreage to Loxahatchee Groves, we serve your area with pride.

${PHONE} | myhorsefarm.com

#loxahatchee #theacreage #palmbeach #myhorsefarm #junkremoval #farmservice #southflorida #loxahatcheegroves #wasteRemoval #localservice`,
    image: "drone-farm.mp4",
    platforms: ["facebook", "instagram"],
    cta: "Your local farm service!",
    link: QUOTE_URL,
  },
  {
    id: "area-boca-delray",
    theme: "area-shoutout",
    service: "junk",
    text: `Boca Raton & Delray Beach — yes, we service your area too!

Junk removal, dumpster rentals, property cleanouts, and more. Professional service with fair pricing, every time.

Book today: ${PHONE}

#bocaraton #delraybeach #junkremoval #dumpsterrental #myhorsefarm #palmbeach #southflorida #cleanup #propertyservice #localservice`,
    image: "service-junk.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Book Boca/Delray service!",
    link: QUOTE_URL,
  },

  // --- Special Offers (2) ---
  {
    id: "offer-free-estimate",
    theme: "special-offer",
    service: "general",
    text: `FREE ESTIMATES — always. No pressure, no obligation.

Tell us what you need removed and we'll give you an honest price. If you like it, we'll get it done fast. If not, no hard feelings.

That's the My Horse Farm promise. Call ${PHONE}.

#freeestimate #nopressure #myhorsefarm #palmbeach #wellington #southflorida #junkremoval #manureremoval #honestpricing #localservice`,
    image: "jose-founder.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Get your free estimate!",
    link: QUOTE_URL,
  },
  {
    id: "offer-referral",
    theme: "special-offer",
    service: "general",
    text: `Know someone who needs our services? Refer a friend and you BOTH save!

When your referral books a service, you both get $25 off your next job. It's our way of saying thanks.

Spread the word! ${PHONE} | myhorsefarm.com

#referral #savemoney #myhorsefarm #palmbeach #wellington #southflorida #referafriend #discount #junkremoval #manureremoval`,
    image: "hero-farm.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Refer a friend and save!",
    link: SITE,
  },

  // --- Summer 2026 (6) ---
  {
    id: "summer-fly-control",
    theme: "seasonal",
    service: "manure",
    text: `Summer in South Florida means one thing for horse farms: FLIES. And the #1 cause? Manure buildup.

Regular removal is your best defense against fly infestations. We offer weekly and biweekly schedules that keep your barn clean and your horses comfortable all summer long.

Don't wait until it's a problem. Call ${PHONE} to set up your summer schedule.

#flycontrol #horsefarm #wellington #manureremoval #summertips #myhorsefarm #palmbeach #equestrian #barnlife #southflorida`,
    image: "horses-paddock.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Set up your summer schedule!",
    link: PRICING_URL,
  },
  {
    id: "summer-heat-warning",
    theme: "seasonal",
    service: "waste",
    text: `90+ degrees and rising. In this heat, waste breaks down FAST — and the smell travels even faster.

Your neighbors will thank you for staying on top of removal. Your horses will thank you even more.

My Horse Farm keeps your property clean through the hottest months. Call ${PHONE}.

#summerheat #floridaheat #horsefarm #manureremoval #wellington #palmbeach #myhorsefarm #southflorida #propertymaintenance #barnmanagement`,
    image: "service-manure.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Beat the heat — schedule now!",
    link: PRICING_URL,
  },
  {
    id: "summer-barn-deep-clean",
    theme: "service-spotlight",
    service: "cleanout",
    text: `Summer is the perfect time for a deep barn cleanout. Old hay, broken equipment, accumulated junk — let's clear it ALL out.

We'll haul everything away so you start the season fresh. One call, one crew, one clean barn.

${PHONE} | myhorsefarm.com

#barncleanout #horsefarm #deepclean #wellington #palmbeach #myhorsefarm #equestrian #barnlife #summercleaning #southflorida`,
    image: "before-1.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Book your barn cleanout!",
    link: QUOTE_URL,
  },
  {
    id: "summer-pool-junk",
    theme: "seasonal",
    service: "junk",
    text: `Pool season is here! But first — you need to clear out all that stuff piled up on the patio and around the pool deck.

Old furniture, broken grills, random junk — we'll haul it all so you can actually enjoy your backyard this summer.

Call ${PHONE} for same-day pickup.

#poolseason #junkremoval #palmbeach #summercleaning #myhorsefarm #southflorida #wellington #backyardcleanup #patioseason #royalpalmbeach`,
    image: "after-1.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Clear your yard for summer!",
    link: QUOTE_URL,
  },
  {
    id: "summer-storm-prep",
    theme: "seasonal",
    service: "general",
    text: `Storm season starts June 1st. Is your property ready?

Loose debris, old fencing, and junk piles become DANGEROUS in high winds. Let us clear your property BEFORE the first storm hits.

We've helped hundreds of properties across Palm Beach County prep for hurricane season. Call ${PHONE}.

#stormprep #hurricaneseason #palmbeach #wellington #myhorsefarm #southflorida #propertymaintenance #horsefarm #safetyfirst #floridaweather`,
    image: "hero-farm.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Prep your property now!",
    link: QUOTE_URL,
  },
  {
    id: "summer-schedule-discount",
    theme: "special-offer",
    service: "manure",
    text: `SUMMER SPECIAL: Sign up for a weekly or biweekly removal plan this month and get your first pickup FREE.

Lock in your summer schedule now before we're fully booked. Slots are filling up fast in Wellington and Loxahatchee.

Call ${PHONE} to claim your free first pickup.

#summerdeal #manureremoval #horsefarm #wellington #loxahatchee #myhorsefarm #palmbeach #specialoffer #equestrian #southflorida`,
    image: "mhf-trailer-at-farm.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Claim your free first pickup!",
    link: PRICING_URL,
  },

  // --- Lead-Gen: Summer Push (12 posts using fresh assets) ---
  {
    id: "lead-summer-junk-1",
    theme: "lead-gen",
    service: "junk",
    text: `Summer project? We haul everything. Furniture, appliances, yard debris, construction waste — if you can point at it, we can remove it.

Serving Wellington, Royal Palm Beach, Loxahatchee, and all of Palm Beach County. Same-day and next-day available.

Call ${PHONE} or tap the link for your free quote.

#junkremoval #wellington #palmbeachcounty #cleanup #hauling #myhorsefarm #southflorida #summercleanup`,
    image: "social/junk-loaded-trailer.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Get your free quote today!",
    link: QUOTE_URL,
  },
  {
    id: "lead-summer-dumpster-1",
    theme: "lead-gen",
    service: "dumpster",
    text: `Need a dumpster? We deliver. Starting at $75/ton with no hidden fees.

Perfect for renovations, farm cleanouts, construction projects, or just finally clearing out the barn. 20-yard roll-off dumpsters delivered fast across Palm Beach County.

${PHONE} — call or text for availability.

#dumpsterrental #wellington #construction #renovation #farmlife #myhorsefarm #palmbeach #cleanup`,
    image: "social/dumpster-covered.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Reserve your dumpster now!",
    link: QUOTE_URL,
  },
  {
    id: "lead-summer-manure-bins",
    theme: "lead-gen",
    service: "manure",
    text: `A single horse produces 50 lbs of waste per day. That adds up fast.

We provide leak-proof bins and handle all pickups on a schedule that works for your barn. Weekly, biweekly, or custom — we've got you covered.

Trusted by Wellington's top equestrian facilities.

${PHONE} or visit myhorsefarm.com for pricing.

#manureremoval #horsefarm #wellington #equestrian #barnlife #myhorsefarm #palmbeach #stablemanagement`,
    image: "social/bins-at-farm.jpg",
    platforms: ["facebook", "instagram"],
    cta: "See our manure removal plans",
    link: PRICING_URL,
  },
  {
    id: "lead-summer-capacity",
    theme: "lead-gen",
    service: "manure",
    text: `This is what a full load looks like. We haul this so you don't have to.

Our trailers handle massive volumes — whether it's a single-horse hobby farm or a 30-stall facility, we scale to your needs.

Serving Wellington, Loxahatchee, Royal Palm Beach, and beyond.

#manureremoval #wellington #horsefarm #equestrian #myhorsefarm #palmbeachcounty #farmservices`,
    image: "social/trailer-loaded-closeup.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Get a free estimate!",
    link: QUOTE_URL,
  },
  {
    id: "lead-summer-delivery",
    theme: "lead-gen",
    service: "general",
    text: `From sod pallets to dumpster drops — we deliver what your property needs.

One call handles it all: sod installation, fill dirt, mulch, rock delivery, dumpster rental, and hauling. No middlemen, no subcontractors. Just our crew and our equipment.

${PHONE} — serving all of Palm Beach County.

#delivery #sodinstallation #filldirt #dumpster #myhorsefarm #wellington #palmbeach #propertyservices`,
    image: "social/sod-delivery-truck.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Call for a free quote!",
    link: QUOTE_URL,
  },
  {
    id: "lead-summer-special",
    theme: "promo",
    service: "general",
    text: `SUMMER SPECIAL: $50 OFF your first service with My Horse Farm.

Whether it's manure removal, junk hauling, dumpster rental, or property maintenance — now's the time to get it done.

Trusted by Wellington's equestrian community. Clean. Reliable. Local.

Call ${PHONE} or visit myhorsefarm.com to claim your discount.

#summerspecial #discount #myhorsefarm #wellington #palmbeach #equestrian #farmservices #deal`,
    image: "social/summer-special-flyer.png",
    platforms: ["facebook", "instagram"],
    cta: "Claim $50 off your first service!",
    link: QUOTE_URL,
  },
  {
    id: "lead-summer-dumpster-2",
    theme: "lead-gen",
    service: "dumpster",
    text: `Big project? Bigger dumpster. We've got you covered.

Our roll-off dumpsters handle everything from barn cleanouts to full property renovations. Drop-off, fill it up, we haul it away. Simple.

No rental games, no surprise fees. Just honest pricing from a local company.

${PHONE} — call today for same-week delivery.

#dumpsterrental #wellington #palmbeach #cleanup #renovation #myhorsefarm #hauling #localservice`,
    image: "social/dumpster-loaded.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Book your dumpster now!",
    link: QUOTE_URL,
  },
  {
    id: "lead-summer-bins-closeup",
    theme: "educational",
    service: "manure",
    text: `Our manure bins are purpose-built: leak-proof, heavy-duty, and sized right for equestrian facilities.

We deliver them, pick them up on schedule, and handle all disposal. Your barn stays clean, your pastures stay healthy, and you never have to think about it.

That's the My Horse Farm difference.

#manureremoval #equestrian #horsefarm #wellington #barnmanagement #myhorsefarm #palmbeach`,
    image: "social/manure-bins-closeup.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Learn about our plans",
    link: PRICING_URL,
  },
  {
    id: "lead-summer-sunset",
    theme: "brand",
    service: "general",
    text: `Another day, another clean farm. That's what we do.

My Horse Farm has been serving Wellington and Palm Beach County's equestrian community for years. Manure removal, junk hauling, dumpsters, sod, fill dirt, and farm repairs — all from one team you can trust.

Your property. Taken care of.

${PHONE} | myhorsefarm.com

#myhorsefarm #wellington #palmbeach #equestrian #farmlife #propertyservices #trusted #local`,
    image: "social/trailer-at-farm-sunset.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Visit myhorsefarm.com",
    link: SITE,
  },
  {
    id: "lead-summer-storage",
    theme: "lead-gen",
    service: "general",
    text: `Need storage? We sell and deliver containers for farms, job sites, and residential properties.

Secure, weather-tight, and built to last. Perfect for tack rooms, feed storage, equipment, or seasonal overflow.

Delivery available throughout Palm Beach County. Call for sizes and pricing.

${PHONE}

#storage #containers #farmlife #wellington #palmbeach #myhorsefarm #equestrian #propertymanagement`,
    image: "social/container-closed.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Call for container pricing!",
    link: QUOTE_URL,
  },
  {
    id: "lead-summer-container-open",
    theme: "lead-gen",
    service: "general",
    text: `Containers delivered. Walk-in ready.

We provide 20ft and 40ft shipping containers for any use — barn storage, equipment lockup, job site security, or long-term inventory. Doors open wide, floor is clean, and it's yours to use.

Delivered to your property on our schedule.

${PHONE} | myhorsefarm.com

#shippingcontainer #storage #delivery #wellington #palmbeach #myhorsefarm #farmservices`,
    image: "social/container-open-angle.jpg",
    platforms: ["facebook", "instagram"],
    cta: "Get container delivery pricing",
    link: QUOTE_URL,
  },
  {
    id: "lead-summer-logo-brand",
    theme: "brand",
    service: "general",
    text: `My Horse Farm — Agricultural Service Company

Serving Wellington, Royal Palm Beach, Loxahatchee, West Palm Beach, and all of Palm Beach County.

What we do:
\u2713 Manure removal (weekly/biweekly)
\u2713 Junk removal & hauling
\u2713 Dumpster rental
\u2713 Sod installation
\u2713 Fill dirt & mulch delivery
\u2713 Farm repairs & maintenance

One call. Every service. ${PHONE}

#myhorsefarm #wellington #palmbeach #equestrian #farmservices #manureremoval #junkremoval #sodinstallation`,
    image: "social/mhf-logo.jpg",
    platforms: ["facebook", "instagram"],
    cta: "See all our services",
    link: PRICING_URL,
  },
];

// ---------------------------------------------------------------------------
// Post Selection Functions
// ---------------------------------------------------------------------------

/**
 * Get the next post in sequence. Cycles through all templates in order.
 * If lastPostId is provided, returns the post after it in the array.
 */
export function getNextPost(lastPostId?: string): SocialPost {
  if (!lastPostId) {
    return POST_TEMPLATES[0];
  }

  const lastIndex = POST_TEMPLATES.findIndex((p) => p.id === lastPostId);
  if (lastIndex === -1) {
    return POST_TEMPLATES[0];
  }

  const nextIndex = (lastIndex + 1) % POST_TEMPLATES.length;
  return POST_TEMPLATES[nextIndex];
}

/**
 * Deterministically pick a post based on the date.
 * Same date always returns the same post. Cycles through all templates.
 */
export function getPostForDate(date: Date): SocialPost {
  // Use days since epoch to get a stable index
  const daysSinceEpoch = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  const index = daysSinceEpoch % POST_TEMPLATES.length;
  return POST_TEMPLATES[index];
}

/**
 * Get upcoming posts starting from a given date.
 * Returns the next N posts that would be scheduled.
 */
export function getUpcomingPosts(
  startDate: Date,
  count: number,
): (SocialPost & { scheduledDate: string })[] {
  const posts: (SocialPost & { scheduledDate: string })[] = [];
  const current = new Date(startDate);

  // Look forward day by day, picking only Mon/Wed/Fri (posting days)
  while (posts.length < count) {
    const dayOfWeek = current.getDay();
    // 1 = Monday, 3 = Wednesday, 5 = Friday
    if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
      const post = getPostForDate(current);
      posts.push({
        ...post,
        scheduledDate: current.toISOString().split("T")[0],
      });
    }
    current.setDate(current.getDate() + 1);
  }

  return posts;
}

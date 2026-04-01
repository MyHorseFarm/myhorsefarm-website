export const SITE_NAME = "Aaron's Dog Grooming";
export const PHONE_OFFICE = "(555) DOG-WASH";
export const PHONE_OFFICE_TEL = "+15553649274";
export const PHONE_CELL = "(555) 364-9275";
export const PHONE_CELL_TEL = "+15553649275";
export const EMAIL_SALES = "info@aaronsdoggrooming.com";
export const EMAIL_FORM = "info@aaronsdoggrooming.com";
export const ADDRESS = "123 Pawsome Lane, Austin, TX 78701";

export const SOCIAL = {
  facebook: "https://www.facebook.com/aaronsdoggrooming",
  instagram: "https://www.instagram.com/aaronsdoggrooming/",
  youtube: "https://www.youtube.com/@aaronsdoggrooming",
  google:
    "https://www.google.com/maps/place/Aaron's+Dog+Grooming",
};

export const NAV_LINKS: { label: string; anchor?: string; href?: string }[] = [
  { label: "About", anchor: "about" },
  { label: "Testimonials", anchor: "testimonials" },
  { label: "FAQ", anchor: "faq" },
  { label: "Contact", anchor: "contact" },
];

export const SERVICE_DROPDOWN = [
  { label: "Full Grooming", href: "/full-grooming" },
  { label: "Bath & Brush", href: "/bath-and-brush" },
  { label: "Puppy's First Groom", href: "/puppy-first-groom" },
  { label: "Nail Trim & Ear Clean", href: "/nail-trim" },
  { label: "De-Shedding Treatment", href: "/de-shedding" },
  { label: "Teeth Brushing", href: "/teeth-brushing" },
  { label: "Spa Package", href: "/spa-package" },
];

export const TESTIMONIALS = [
  {
    body: "Aaron is absolutely amazing with our golden retriever. She used to hate grooming but now she gets excited when we pull into the parking lot. The attention to detail is incredible and our dog always comes out looking and smelling fantastic.",
    author: "Emily R.",
    location: "Austin, TX",
  },
  {
    body: "We have two poodles that need regular grooming and Aaron's team always does an outstanding job. The cuts are perfect every time, the staff is friendly, and the pricing is very fair. Highly recommend to any dog owner in Austin!",
    author: "Marcus T.",
    location: "Round Rock, TX",
  },
  {
    body: "Found Aaron's after a bad experience at another groomer. What a difference! They took the time to understand our anxious rescue dog's needs and were so patient with him. He actually enjoyed his grooming session. We're customers for life.",
    author: "Sarah K.",
    location: "Cedar Park, TX",
  },
];

export const LP_TESTIMONIALS = [
  {
    body: "\u201cAaron and his team are fantastic! Our dog always comes out looking and feeling great. Best groomer in Austin!\u201d",
    author: "Emily R.",
    location: "Austin, TX",
  },
  {
    body: "\u201cReliable, affordable, and so gentle with our pups. Aaron's Dog Grooming is the only place we trust with our dogs.\u201d",
    author: "Marcus T.",
    location: "Round Rock, TX",
  },
  {
    body: "\u201cWe\u2019ve tried other groomers but Aaron's is by far the best. Fair pricing, great communication, and they truly care about the dogs.\u201d",
    author: "Sarah K.",
    location: "Cedar Park, TX",
  },
];

export const FAQ_ITEMS = [
  {
    question: "What areas do you serve?",
    answer:
      "We're located in Austin, TX and serve the greater Austin area including Round Rock, Cedar Park, Pflugerville, Georgetown, and Lakeway. Drop-offs welcome at our shop!",
  },
  {
    question: "How is pricing determined?",
    answer:
      "Pricing depends on your dog's breed, size, coat condition, and the services requested. A full grooming starts at $45 for small dogs. We provide transparent pricing before every appointment — no surprises.",
  },
  {
    question: "Do you offer same-day appointments?",
    answer:
      "Yes, we keep a few slots open each day for same-day appointments, subject to availability. Call us or book online to check today's availability.",
  },
  {
    question: "Is Aaron's Dog Grooming licensed and insured?",
    answer:
      "Absolutely. We are fully licensed and insured. All of our groomers are professionally certified and trained in breed-specific grooming techniques and pet first aid.",
  },
  {
    question: "How do I book an appointment?",
    answer:
      "You can book online using our scheduling system, call us directly, or fill out the contact form on our website. We'll confirm your appointment and send you a reminder the day before.",
  },
  {
    question: "What if my dog is anxious or aggressive?",
    answer:
      "We specialize in handling anxious and nervous dogs. Aaron and our team use gentle, fear-free grooming techniques. We'll work at your dog's pace and take breaks as needed. Just let us know about any concerns when you book.",
  },
  {
    question: "What products do you use?",
    answer:
      "We use premium, all-natural, hypoallergenic shampoos and conditioners that are safe for sensitive skin. We also offer medicated bath options for dogs with skin conditions. All products are cruelty-free and eco-friendly.",
  },
];

export const SERVICE_AREAS = [
  { value: "austin", label: "Austin" },
  { value: "round_rock", label: "Round Rock" },
  { value: "cedar_park", label: "Cedar Park" },
  { value: "pflugerville", label: "Pflugerville" },
  { value: "georgetown", label: "Georgetown" },
  { value: "lakeway", label: "Lakeway" },
];

export const SERVICE_KEYS = [
  "full_grooming",
  "bath_and_brush",
  "puppy_first_groom",
  "nail_trim",
  "de_shedding",
  "teeth_brushing",
  "spa_package",
] as const;

export type ServiceKey = (typeof SERVICE_KEYS)[number];

export const TRUST_BADGES = [
  { icon: "fas fa-shield-halved", label: "Fully Insured" },
  { icon: "fas fa-certificate", label: "Certified Groomers" },
  { icon: "fas fa-leaf", label: "Natural Products" },
  { icon: "fas fa-map-pin", label: "Locally Owned" },
  { icon: "fas fa-star", label: "5-Star Rated" },
  { icon: "fas fa-dog", label: "Dog Lovers" },
];

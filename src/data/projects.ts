import { CloudinaryImage } from "@/lib/types/portfolio";

export type ProjectImage = string | CloudinaryImage;

export interface Project {
  id: number;
  slug: string;
  name: string;
  client: string;
  industry: string;
  year: number;
  stage: "foundation" | "clarity" | "scale" | "enterprise";
  coverImage: ProjectImage;
  services: string[];

  context: string;
  problem: string;
  strategy: string;
  strategyImages?: ProjectImage[];
  creativeDirection: string;
  creativeDirectionImages?: ProjectImage[];
  identitySystem: string;
  identitySystemImages?: ProjectImage[];
  outcome: string;

  website?: string;
  behance?: string;

  testimonial?: {
    author: string;
    role: string;
    content: string;
  };
}

export const projects: Project[] = [
  {
    id: 1,
    slug: "nexova",
    name: "Nexova",
    client: "Nexova Technologies",
    industry: "SaaS / Cloud Technology",
    year: 2024,
    stage: "scale",
    coverImage: "/images/nexova/2.png",
    services: ["Brand Strategy", "Identity System", "Digital Assets"],

    context:
      "Nexova was preparing to expand into global markets. While the product was strong, the brand identity did not reflect the scale or credibility required for enterprise growth.",

    problem:
      "The existing brand felt fragmented and visually inconsistent. It lacked authority in comparison to modern SaaS competitors, creating friction in investor and enterprise conversations.",

    strategy:
      "We repositioned Nexova around structured innovation. The strategy clarified audience positioning, refined the messaging tone, and defined a competitive identity anchored in reliability and forward-thinking technology.",

    creativeDirection:
      "We explored modular, grid-based visual systems to reflect scalability. The selected direction focused on structured typography, high-contrast palettes, and a visual rhythm that communicated precision.",
    creativeDirectionImages: [
      "/images/nexova/2.png",
      "/images/nexova/3.png"
    ],

    identitySystem:
      "The identity system included a bespoke type-driven logo, sub-marks, scalable color hierarchy, structured layout grid, and digital asset toolkit for consistent cross-platform application.",
    identitySystemImages: [
      "/images/nexova/4.png",
      "/images/nexova/5.png"
    ],

    outcome:
      "The restructured brand system positioned Nexova confidently in investor discussions and enterprise onboarding. Perception shifted from early-stage startup to scalable technology platform.",

    website: "https://nexova.io",
    behance: "https://behance.net/nexova",

    testimonial: {
      author: "Sarah Chen",
      role: "CTO, Nexova",
      content:
        "The transformation changed how we are perceived in high-level conversations. The structure behind the brand made all the difference."
    }
  },

  {
    id: 2,
    slug: "purespace",
    name: "PureSpace",
    client: "PureSpace Interiors",
    industry: "Interior Design",
    year: 2023,
    stage: "clarity",
    coverImage: "/images/PureSpace/cover.png",
    services: ["Brand Strategy", "Identity System", "Website"],

    context:
      "PureSpace Interiors had established a loyal client base but struggled with a brand identity that felt visually crowded and inconsistent across touchpoints.",

    problem:
      "The existing branding did not reflect the calm, premium aesthetic of their interior work. This disconnect created friction between brand perception and actual service quality.",

    strategy:
      "We repositioned PureSpace around clarity and minimalism. The strategy refined their audience positioning and anchored the brand around simplicity, space, and sustainability.",

    creativeDirection:
      "We selected a restrained, whitespace-driven visual direction with neutral tones and refined typography to mirror their clean-room philosophy.",
    creativeDirectionImages: [
      "/images/PureSpace/cover.png",
      "/images/PureSpace/2.png"
    ],

    identitySystem:
      "The identity system included a simplified wordmark, a soft monochromatic palette, structured layout rules, and a content-focused website designed to highlight project photography.",
    identitySystemImages: [
      "/images/PureSpace/3.png",
      "/images/PureSpace/4.png"
    ],

    outcome:
      "The restructured brand brought visual alignment between PureSpace's services and their public presence, strengthening client trust and perceived value.",

    website: "https://purespace.co",
    behance: "https://behance.net/purespace",

    testimonial: {
      author: "Michael Aris",
      role: "Founder, PureSpace",
      content:
        "The new branding finally reflects the calm and clarity our interiors represent. Clients immediately noticed the shift."
    }
  },

  {
    id: 3,
    slug: "glow",
    name: "Glow",
    client: "Glow Skincare",
    industry: "Beauty & Wellness",
    year: 2024,
    stage: "clarity",
    coverImage: "/images/Glow/cover.png",
    services: ["Brand Strategy", "Identity System", "Ecommerce Website"],

    context:
      "Glow Skincare needed a brand refresh to support its shift toward a more premium, ecommerce-focused model.",

    problem:
      "The previous identity lacked cohesion and did not communicate the softness and credibility expected in the skincare market.",

    strategy:
      "We clarified Glow's positioning around softness, care, and premium accessibility. Messaging was refined to build emotional trust with its core audience.",

    creativeDirection:
      "We developed a feminine yet structured direction using soft gradients, elegant typography, and balanced visual rhythm.",
    creativeDirectionImages: [
      "/images/Glow/cover.png",
      "/images/Glow/2.png"
    ],

    identitySystem:
      "The system included a refined logo suite, a cohesive palette, product-focused layout structure, and a mobile-optimized ecommerce experience.",
    identitySystemImages: [
      "/images/Glow/3.png",
      "/images/Glow/4.png"
    ],

    outcome:
      "Glow's updated identity increased product trust perception and strengthened brand consistency across social and ecommerce platforms.",

    website: "https://glowskincare.co",
    behance: "https://behance.net/glow",

    testimonial: {
      author: "Founder, Glow Skincare",
      role: "Founder",
      content:
        "The rebrand gave us confidence in how we present our products. It feels intentional and premium."
    }
  },

  {
    id: 4,
    slug: "nexera",
    name: "Nexera",
    client: "Nexera Cloud Systems",
    industry: "Cloud Infrastructure",
    year: 2023,
    stage: "scale",
    coverImage: "/images/Nexera/cover.png",
    services: ["Brand Strategy", "Identity System", "Marketing Website"],

    context:
      "Nexera was scaling its SaaS infrastructure and required a brand identity capable of competing in global cloud markets.",

    problem:
      "The brand lacked a cohesive system and did not visually align with enterprise-grade technology platforms.",

    strategy:
      "We repositioned Nexera around performance and reliability, clarifying messaging and refining audience segmentation.",

    creativeDirection:
      "A bold, grid-driven visual system was selected to communicate precision and technical strength.",
    creativeDirectionImages: [
      "/images/Nexera/cover.png",
      "/images/Nexera/2.png"
    ],

    identitySystem:
      "The identity system included a structured logo suite, scalable typography, modular digital assets, and a performance-optimized website.",
    identitySystemImages: [
      "/images/Nexera/3.png",
      "/images/Nexera/4.png"
    ],

    outcome:
      "Nexera launched into new markets with a cohesive brand presence that reinforced enterprise trust and scalability.",

    website: "https://nexera.dev",
    behance: "https://behance.net/nexera",

    testimonial: {
      author: "Sarah Chen",
      role: "CTO, Nexera Cloud Systems",
      content:
        "The structured approach behind the rebrand gave us clarity and confidence in enterprise conversations."
    }
  },

  {
    id: 5,
    slug: "linkerpay",
    name: "LinkerPay",
    client: "LinkerPay Inc.",
    industry: "Fintech",
    year: 2022,
    stage: "foundation",
    coverImage: "/images/Linkerpay/cover.png",
    services: ["Brand Strategy", "Identity System"],

    context:
      "LinkerPay was launching its fintech platform and required a professional identity to establish early credibility.",

    problem:
      "Without a structured brand foundation, the platform risked appearing untrustworthy in a highly regulated industry.",

    strategy:
      "We defined a positioning centered on security, clarity, and technological reliability to build trust from launch.",

    creativeDirection:
      "A clean fintech-forward aesthetic was selected, focusing on modern typography and structured layout principles.",
    creativeDirectionImages: [
      "/images/Linkerpay/cover.png",
      "/images/Linkerpay/2.png"
    ],

    identitySystem:
      "The identity included a precise logo suite, controlled color system, and scalable assets for onboarding, pitch decks, and product visuals.",
    identitySystemImages: [
      "/images/Linkerpay/3.png",
      "/images/Linkerpay/4.png"
    ],

    outcome:
      "LinkerPay entered the market with a confident and professional presence, reinforcing credibility among early adopters.",

    website: "https://linkerpay.com",
    behance: "https://behance.net/linkerpay",

    testimonial: {
      author: "Sarah Chen",
      role: "CTO, LinkerPay Inc.",
      content:
        "The clarity of the brand helped us communicate security and professionalism from day one."
    }
  },

  {
    id: 6,
    slug: "ecocycle",
    name: "Ecocycle",
    client: "Ecocycle Solutions",
    industry: "Green Technology",
    year: 2023,
    stage: "clarity",
    coverImage: "/images/Ecocycle/cover.png",
    services: ["Brand Strategy", "Identity System", "Packaging Design"],

    context:
      "Ecocycle, a green-tech startup, needed a cohesive brand identity that balanced innovation with sustainability.",

    problem:
      "The brand lacked clarity in communicating both environmental responsibility and technical innovation.",

    strategy:
      "We clarified positioning around eco-conscious technology and defined messaging to connect with environmentally aware consumers.",

    creativeDirection:
      "A structured yet organic visual direction was selected, blending clean typography with sustainable visual cues.",
    creativeDirectionImages: [
      "/images/Ecocycle/cover.png",
      "/images/Ecocycle/2.png"
    ],

    identitySystem:
      "The identity system included a scalable logo suite, eco-forward palette, packaging layouts, and structured visual hierarchy.",
    identitySystemImages: [
      "/images/Ecocycle/3.png",
      "/images/Ecocycle/4.png"
    ],

    outcome:
      "Ecocycle launched with a clear and cohesive brand system that strengthened perception in sustainability-focused markets.",

    website: "https://ecocycle.tech",
    behance: "https://behance.net/ecocycle",

    testimonial: {
      author: "Founder, Ecocycle Solutions",
      role: "Founder",
      content:
        "The rebrand clarified our mission and gave our sustainability message the structure it needed."
    }
  }
];
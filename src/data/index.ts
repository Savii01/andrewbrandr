export { projects } from "./projects";
export type { Project } from "./projects";

// Testimonials
export interface Testimonial {
    id: number;
    name: string;
    businessName: string;
    review: string;
}

export const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Leslie Alexander",
        businessName: "Leslie's Creations",
        review:
            "Saviour really took time to understand what I wanted. My new website feels exactly like my brand — fresh, simple, and professional. It's the first time I've actually enjoyed a design process from start to finish.",
    },
    {
        id: 2,
        name: "Lindsay Walton",
        businessName: "Lindsay's Innovations",
        review:
            "Working with Saviour was smooth and surprisingly fun. He just *gets it* — design, communication, timing, everything. I've already recommended him to two friends.",
    },
    {
        id: 3,
        name: "Whitney Francis",
        businessName: "Whitney Designs",
        review:
            "I wasn't sure how to express my brand visually, but Saviour guided me through every step. The final outcome felt like my ideas, only clearer and more beautiful. Absolutely loved the process.",
    },
    {
        id: 4,
        name: "Michael Foster",
        businessName: "Foster's Tech Solutions",
        review:
            "What impressed me most was how strategic Saviour is. It wasn't just about making things look good — every design decision had a reason behind it. That's rare.",
    },
    {
        id: 5,
        name: "Courtney Henry",
        businessName: "Courtney's Creative Studio",
        review:
            "Saviour has that perfect mix of creativity and professionalism. He turned my rough ideas into something that feels high-end but still very *me*. Couldn't have asked for better.",
    },
    {
        id: 6,
        name: "Leonard Krasner",
        businessName: "Krasner Digital",
        review:
            "We've worked with a few designers before, but Saviour stood out immediately. Clear communication, fast delivery, and a strong sense of design direction. The results speak for themselves.",
    },
    {
        id: 7,
        name: "Dries Vincent",
        businessName: "Vincent Creative Agency",
        review:
            "Every time I collaborate with Saviour, I walk away inspired. He doesn't just execute — he elevates. The brand work he did for us still gets compliments months later.",
    },
    {
        id: 8,
        name: "Tom Cook",
        businessName: "Cook Media Solutions",
        review:
            "Saviour made the entire process stress-free. He handled revisions like a pro and kept everything on track. I appreciated how honest and collaborative he was throughout.",
    },
    {
        id: 9,
        name: "Floyd Miles",
        businessName: "Miles Design Studio",
        review:
            "Saviour is my go-to for branding projects now. He's consistent, creative, and genuinely cares about helping your business stand out — not just making things pretty.",
    },
];

// Pricing Plans
export interface PricingPlan {
    id: number;
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    priceNGN: string;
    priceUSD: string;
    highlights: string[];
    sections: {
        title: string;
        items: string[];
    }[];
    retainer: {
        title: string;
        priceNGN: string;
        priceUSD: string;
        items: string[];
    };
    buttonText: string;
    buttonLink: string;
    footerText: string;
}

export const pricingPlans: PricingPlan[] = [
    {
        id: 1,
        slug: "foundation",
        title: "Stage 01 — Starting out",
        subtitle: "Brand Foundation Pack",
        description: "For businesses just launching. You have a product or service but no identity. Customers can't tell who you are or why you're different.",
        priceNGN: "₦80,000",
        priceUSD: "$100",
        highlights: [
            "Brand strategy lite — positioning, persona & tagline",
            "Primary logo + sub mark with 2 concept directions",
            "Brand colour palette & typography system",
            "Mini brand guidelines + business card & letterhead",
            "Final logo files in all formats"
        ],
        sections: [
            {
                title: "Strategy (lite)",
                items: [
                    "Brand purpose and positioning — one clear sentence that separates you from competitors",
                    "Brand persona and tonality — how you sound and feel to your audience",
                    "Tagline"
                ]
            },
            {
                title: "Design",
                items: [
                    "2 concept directions with logo exploration and mockups",
                    "Primary logo and one sub mark",
                    "Brand colour palette — primary and secondary",
                    "Brand typography system",
                    "Mini brand guidelines — logo usage, colours, fonts",
                    "Business card and letterhead",
                    "Final logo files in all formats"
                ]
            },
            {
                title: "What you walk away with",
                items: [
                    "A complete, professional brand identity ready to show up consistently on Instagram, WhatsApp, and print from day one."
                ]
            }
        ],
        retainer: {
            title: "Social Media Retainer",
            priceNGN: "₦25,000/month",
            priceUSD: "$50/month",
            items: [
                "8 branded posts per month",
                "Story templates",
                "Feed consistency"
            ]
        },
        buttonText: "Start a Project",
        buttonLink: "/work-with-me?plan=foundation",
        footerText: "Design Strategy lite",
    },
    {
        id: 2,
        slug: "clarity",
        title: "Stage 02 — Running but stuck",
        subtitle: "Brand Clarity Pack",
        description: "For businesses that have been operating 1–3 years. You have a logo somewhere but your brand looks inconsistent, customers don't fully trust you yet, and growth has plateaued.",
        priceNGN: "₦300,000",
        priceUSD: "$400",
        highlights: [
            "Full strategy — competitor research, persona & archetype",
            "3 logo concept directions with full exploration",
            "Full brand guidelines & corporate collaterals",
            "Social media template system — 4 recurring formats",
            "Layout and grid rules for all brand touchpoints"
        ],
        sections: [
            {
                title: "Strategy",
                items: [
                    "Competitor research and market positioning",
                    "User persona — who your actual buyer is",
                    "Brand purpose, positioning, persona, tonality, and archetype",
                    "Communication strategy and tagline"
                ]
            },
            {
                title: "Design",
                items: [
                    "Visual audit of existing brand assets",
                    "3 concept directions with full logo exploration and mockups",
                    "Primary logo, sub marks, and icon or pattern",
                    "Full colour palette and typography system",
                    "Full brand guidelines",
                    "Corporate collaterals — business card, letterhead, envelope, signage"
                ]
            },
            {
                title: "Systems",
                items: [
                    "Social media post template system — 4 recurring formats",
                    "Layout and grid rules for all brand touchpoints",
                    "Simplified usage guidelines for internal use"
                ]
            },
            {
                title: "What you walk away with",
                items: [
                    "A brand that looks and feels the same everywhere. Customers start recognising you. Trust builds. Growth becomes possible."
                ]
            }
        ],
        retainer: {
            title: "Brand Management Retainer",
            priceNGN: "₦40,000/month",
            priceUSD: "$80/month",
            items: [
                "12 posts per month",
                "Carousel designs",
                "Highlight covers",
                "Monthly brand consistency check"
            ]
        },
        buttonText: "Let's Collaborate",
        buttonLink: "/work-with-me?plan=clarity",
        footerText: "Strategy Design Systems",
    },
    {
        id: 3,
        slug: "scale",
        title: "Stage 03 — Growing, needs to scale",
        subtitle: "Brand Scale Pack",
        description: "For businesses that are growing but the brand hasn't kept up. You need to rebrand, enter new markets, or expand your product range. The old identity no longer reflects where you're headed.",
        priceNGN: "₦900,000",
        priceUSD: "$1,000",
        highlights: [
            "Full market research, persona & content framework",
            "Full logo system — primary, sub marks, monogram, symbols",
            "Comprehensive brand guidelines & collateral suite",
            "Packaging design — print-ready files",
            "Website design — structure, user flow, responsive handover"
        ],
        sections: [
            {
                title: "Full strategy",
                items: [
                    "Full market and competitor research",
                    "User persona and community triggers",
                    "Brand purpose, positioning, persona, tonality, archetype, and brand enemy",
                    "Communication strategy and hero, hub, hygiene content framework",
                    "Direction with execution plan"
                ]
            },
            {
                title: "Design",
                items: [
                    "Competitor and visual benchmarking",
                    "Mood boards and 3–4 concept directions",
                    "Full logo system — primary, sub marks, monogram, symbols",
                    "Full colour palette, typography, icon and pattern design",
                    "Comprehensive brand guidelines",
                    "Full corporate collateral suite"
                ]
            },
            {
                title: "Systems + Execution",
                items: [
                    "Full visual design system — grid, spacing, hierarchy, layout rules",
                    "Social media template system — all recurring formats including carousels, stories, highlights",
                    "Packaging design — master layout, SKU adaptations, print-ready files",
                    "Website design — structure, user flow, visual design, responsive, handover files"
                ]
            },
            {
                title: "What you walk away with",
                items: [
                    "A brand built for the next stage of growth — consistent, scalable, and ready to compete in bigger markets."
                ]
            }
        ],
        retainer: {
            title: "Full Brand Execution Retainer",
            priceNGN: "₦75,000/month",
            priceUSD: "$120/month",
            items: [
                "Full social media design",
                "Packaging updates",
                "Website content updates",
                "Monthly brand audit"
            ]
        },
        buttonText: "Scale Your Brand",
        buttonLink: "/work-with-me?plan=scale",
        footerText: "Full strategy Design Systems Execution",
    },
    {
        id: 4,
        slug: "enterprise",
        title: "Stage 04 — Enterprise",
        subtitle: "Brand Enterprise Pack",
        description: "For established organisations that need a full brand overhaul, a new sub-brand, or a complete design system built for teams. Everything is custom scoped.",
        priceNGN: "Custom quoted",
        priceUSD: "Custom quoted",
        highlights: [
            "Everything in the Scale Pack, plus",
            "Full illustration & motion design systems",
            "Editorial design — brochures, reports, catalogs",
            "Design system for internal and external teams",
            "Sub-brand development & ongoing brand governance"
        ],
        sections: [
            {
                title: "Everything in Scale Pack, plus",
                items: [
                    "Full illustration design system — style direction, custom library, character or mascot development",
                    "Editorial design — grid system, template suite for brochures, reports, catalogs, lookbooks",
                    "Motion design — logo animation, intro/outro, social motion graphics, micro-interactions",
                    "Full design system for internal and external teams with usage documentation",
                    "Sub-brand or product brand development if required",
                    "Ongoing brand governance and consultation"
                ]
            },
            {
                title: "What you walk away with",
                items: [
                    "A complete brand operating system — built to be executed by any team, at any scale, across every platform and format."
                ]
            }
        ],
        retainer: {
            title: "Brand Governance Retainer",
            priceNGN: "Custom quoted",
            priceUSD: "$300+/month",
            items: [
                "Ongoing design system management",
                "Team support",
                "New asset creation",
                "Quarterly brand review"
            ]
        },
        buttonText: "Discuss Enterprise",
        buttonLink: "/work-with-me?plan=enterprise",
        footerText: "Strategy Design Systems Execution Expression",
    }
];

// Brands
export interface Brand {
    alt: string;
    src: string;
}

export const brands: Brand[] = [
    { alt: "Transistor", src: "https://tailwindcss.com/plus-assets/img/logos/158x48/transistor-logo-gray-900.svg" },
    { alt: "Reform", src: "https://tailwindcss.com/plus-assets/img/logos/158x48/reform-logo-gray-900.svg" },
    { alt: "Tuple", src: "https://tailwindcss.com/plus-assets/img/logos/158x48/tuple-logo-gray-900.svg" },
    { alt: "SavvyCal", src: "https://tailwindcss.com/plus-assets/img/logos/158x48/savvycal-logo-gray-900.svg" },
    { alt: "Statamic", src: "https://tailwindcss.com/plus-assets/img/logos/158x48/statamic-logo-gray-900.svg" },
];

// Social Links
export interface SocialLink {
    name: string;
    icon: string;
    url: string;
}

export const socialLinks: SocialLink[] = [
    { name: "Facebook", icon: "FaFacebook", url: "https://web.facebook.com/saviiandrewbrandr/" },
    { name: "LinkedIn", icon: "FaLinkedin", url: "https://www.linkedin.com/in/saviour-andrew1/" },
    { name: "Twitter", icon: "FaTwitter", url: "https://twitter.com/saviourandrew" },
    { name: "Instagram", icon: "FaInstagram", url: "https://www.instagram.com/andrewbrandr/" },
    { name: "Behance", icon: "FaBehance", url: "https://www.behance.net/saviouranthony" },
];

// Experience
export interface Experience {
    role: string;
    company: string;
    year: string;
}

export const experience: Experience[] = [
    { role: "Brand Designer", company: "Kobowork", year: "2023" },
    { role: "Visual Designer", company: "Agency Muse", year: "2023" },
    { role: "Web Designer", company: "Abilfat Aviation", year: "2024" },
    { role: "Brand Identity Designer", company: "Nsentip Twins Foundation", year: "2021" },
];

// FAQs
export interface FAQ {
    question: string;
    answer: string;
}

export const faqs: FAQ[] = [
    {
        question: "How long does a typical project take?",
        answer:
            "Project timelines vary based on scope, but branding and logo projects usually take 1-2 weeks, while full website designs take 3-6 weeks.",
    },
    {
        question: "What kind of services do you offer?",
        answer: "I provide branding, website design, and graphic design services tailored for businesses of all sizes.",
    },
    {
        question: "Can you work with my existing brand and designs?",
        answer:
            "Absolutely! I can work with your current brand identity to create new materials that stay consistent and elevate your existing style.",
    },
    {
        question: "Do you offer revisions?",
        answer: "Yes! I include a set number of revisions depending on the project scope or package chosen.",
    },
    {
        question: "What makes your design process unique?",
        answer:
            "My process is deeply collaborative — I involve you at each stage to ensure the final design reflects your vision while benefiting from my expertise.",
    },
    {
        question: "Do you offer ongoing maintenance and support for completed projects?",
        answer:
            "Yes, I provide post-project support for 30 days after delivery, including updates, fixes, and guidance. Longer-term retainers are also available for continuous support.",
    },
    {
        question: "How do you handle confidentiality and intellectual property rights?",
        answer:
            "Confidentiality is taken seriously — your information and project details remain private. Upon completion, you own full intellectual property rights to all final designs.",
    },
];

export interface PricingSection {
    title: string;
    description?: string;
    items: string[];
}

export interface PricingPlan {
    id: number;
    slug: string;
    stage: string;
    title: string;
    subtitle: string;
    headerDescription: string;
    whoThisIsFor: string[];
    sections: PricingSection[];
    timeline: string;
    investment: {
        priceNGN: string;
        priceUSD: string;
        details: string;
    };
    retainer: {
        title: string;
        priceNGN: string;
        priceUSD: string;
    };
    whatYouWalkAwayWith: string[];
    discoveryIntro: string;
    ctaText: string;
    slugText: string; // Strategy • Identity • Systems etc
}

export const pricingPlans: PricingPlan[] = [
    {
        id: 1,
        slug: "foundation",
        stage: "Stage 01",
        title: "Starting Out",
        subtitle: "Brand Foundation",
        headerDescription: "You have a product. You have a service. But the brand foundation isn't clear yet. Customers can't tell who you are or why you're different. This stage builds clarity from the start.",
        whoThisIsFor: [
            "Businesses just launching.",
            "Founders preparing to enter the market.",
            "Anyone who needs a strong, professional starting point."
        ],
        slugText: "Strategy Lite • Identity Core",
        sections: [
            {
                title: "Strategy (Lite)",
                description: "We define the core message before visuals begin.",
                items: [
                    "Brand purpose and positioning",
                    "Brand persona and tone",
                    "Tagline direction"
                ]
            },
            {
                title: "Identity",
                description: "Everything designed to work together from day one.",
                items: [
                    "Two concept directions",
                    "Primary logo and sub mark",
                    "Colour system",
                    "Typography system",
                    "Mini brand guidelines",
                    "Business card and letterhead",
                    "Final logo files in all formats"
                ]
            }
        ],
        timeline: "2 to 3 weeks",
        investment: {
            priceNGN: "₦80,000",
            priceUSD: "$100",
            details: "50% deposit to begin. Remaining 50% before final delivery. Payment is made only after proposal alignment."
        },
        retainer: {
            title: "Foundation Support",
            priceNGN: "₦150,000",
            priceUSD: "$200"
        },
        whatYouWalkAwayWith: [
            "A complete, professional brand identity ready to show up consistently across Instagram, WhatsApp, and print.",
            "Clear.",
            "Aligned.",
            "Ready for market."
        ],
        discoveryIntro: "This stage begins with a discovery call. It is a focused conversation to understand your business, your goals, and what your brand needs to communicate clearly.",
        ctaText: "Book Discovery Call"
    },
    {
        id: 2,
        slug: "clarity",
        stage: "Stage 02",
        title: "Running, but Stuck",
        subtitle: "Brand Clarity",
        headerDescription: "You have been operating for a while. The business works. But the brand feels disconnected. It looks different everywhere. Trust isn't where it should be. Growth has slowed. This stage rebuilds clarity, alignment, and consistency.",
        whoThisIsFor: [
            "Businesses operating 1 to 3 years.",
            "Brands that look inconsistent across platforms.",
            "Founders who feel their brand no longer reflects their business."
        ],
        slugText: "Strategy • Identity • Systems",
        sections: [
            {
                title: "Strategy",
                items: [
                    "Competitor research and positioning",
                    "User persona to define your actual buyer",
                    "Brand purpose, tone, and archetype",
                    "Communication strategy and tagline"
                ]
            },
            {
                title: "Identity",
                items: [
                    "Visual audit of existing brand assets",
                    "3 concept directions with full logo exploration",
                    "Primary logo, sub marks, and icon or pattern",
                    "Full colour palette and typography system",
                    "Full brand guidelines",
                    "Corporate collaterals including business card, letterhead, envelope, and signage"
                ]
            },
            {
                title: "Systems",
                items: [
                    "Social media template system with 4 recurring formats",
                    "Layout and grid rules for all brand touchpoints",
                    "Simplified internal usage guidelines"
                ]
            }
        ],
        timeline: "4 to 6 weeks",
        investment: {
            priceNGN: "₦300,000",
            priceUSD: "$400",
            details: "50% deposit to begin. Remaining 50% before final delivery."
        },
        retainer: {
            title: "Growth Strategy Retainer",
            priceNGN: "₦150,000",
            priceUSD: "$200"
        },
        whatYouWalkAwayWith: [
            "A brand that looks and feels consistent everywhere.",
            "Customers begin recognising you.",
            "Trust increases.",
            "Growth gains a real foundation."
        ],
        discoveryIntro: "This stage begins with a discovery call. We use it to understand where the brand currently stands, what feels disconnected, and what needs to be rebuilt for clarity and consistency.",
        ctaText: "Book Discovery Call"
    },
    {
        id: 3,
        slug: "scale",
        stage: "Stage 03",
        title: "Growing & Scaling",
        subtitle: "Brand Scale",
        headerDescription: "The business has evolved. The brand hasn't kept up. You are entering new markets. Launching new products. Competing at a higher level. The identity must carry more weight.",
        whoThisIsFor: [
            "Businesses scaling beyond their current identity.",
            "Brands preparing to enter new markets.",
            "Companies launching new product lines or expanding nationally or internationally."
        ],
        slugText: "Strategy • Identity • Systems • Execution",
        sections: [
            {
                title: "Full Strategy",
                items: [
                    "Full market and competitor research",
                    "User persona and community triggers",
                    "Brand purpose, positioning, persona, tonality, archetype, and brand enemy",
                    "Communication strategy and hero, hub, and hygiene framework",
                    "Direction with execution plan"
                ]
            },
            {
                title: "Identity",
                items: [
                    "Competitor and visual benchmarking",
                    "Mood boards and 3 to 4 concept directions",
                    "Full logo system including primary, sub marks, monogram, and symbols",
                    "Full colour palette, typography, icon, and pattern design",
                    "Comprehensive brand guidelines",
                    "Full corporate collateral suite"
                ]
            },
            {
                title: "Systems & Execution",
                items: [
                    "Full visual design system with grid, spacing, hierarchy, and layout rules",
                    "Social media template system for all recurring formats",
                    "Packaging design with master layout, SKU adaptations, and print-ready files",
                    "Website design covering structure, user flow, visual design, and handover files"
                ]
            }
        ],
        timeline: "6 to 10 weeks",
        investment: {
            priceNGN: "₦900,000",
            priceUSD: "$1,200",
            details: "50% deposit to begin. Remaining 50% before final delivery."
        },
        retainer: {
            title: "Scale & Systems Retainer",
            priceNGN: "₦250,000",
            priceUSD: "$350"
        },
        whatYouWalkAwayWith: [
            "A brand built for the next stage of growth.",
            "Consistent.",
            "Scalable.",
            "Ready to compete in bigger markets."
        ],
        discoveryIntro: "Every Scale project begins with a discovery call. It is a deeper conversation about your growth direction, your market, and the systems your brand needs to support the next stage of expansion.",
        ctaText: "Book Discovery Call"
    },
    {
        id: 4,
        slug: "enterprise",
        stage: "Stage 04",
        title: "Enterprise",
        subtitle: "Brand Enterprise",
        headerDescription: "You are not starting out. You are rebuilding at scale. Multiple stakeholders. Multiple platforms. Long-term governance required. This stage is fully custom.",
        whoThisIsFor: [
            "Established organisations.",
            "Companies needing a full brand overhaul.",
            "Brands developing sub-brands or internal design systems.",
            "Teams requiring long-term brand governance."
        ],
        slugText: "Strategy • Design • Systems • Execution • Expression",
        sections: [
            {
                title: "Everything in Stage 03, plus",
                items: [
                    "Full illustration design system with style direction, custom library, and character development",
                    "Editorial design with grid system and template suite for brochures, reports, and catalogs",
                    "Motion design covering logo animation, social motion graphics, and micro-interactions",
                    "Full design system for internal and external teams with usage documentation",
                    "Sub-brand or product brand development if required",
                    "Ongoing brand governance and consultation"
                ]
            }
        ],
        timeline: "Custom scoped per engagement.",
        investment: {
            priceNGN: "Custom scoped",
            priceUSD: "Custom scoped",
            details: "Custom scoped based on requirements. Deposit structure confirmed during proposal."
        },
        retainer: {
            title: "Enterprise Governance",
            priceNGN: "Custom scoped",
            priceUSD: "Custom scoped"
        },
        whatYouWalkAwayWith: [
            "A complete brand operating system.",
            "Built to be executed by any team, at any scale, across every platform and format."
        ],
        discoveryIntro: "Enterprise engagements require deep alignment. This begins with a preliminary conversation to understand your organisational structure, your stakeholders, and the long-term objectives behind the brand.",
        ctaText: "Start the Conversation"
    }
];

import { EngagementTier } from "@/lib/types/dashboard";

export interface TierInfo {
    name: string;
    stageLabel: string;
    defaultPriceNGN: number; // 0 means custom input required (e.g. Enterprise)
    defaultPriceUSD: number;
    description: string;
    scope: string[];
}

export const TIER_CONFIG: Record<EngagementTier, TierInfo> = {
    Foundation: {
        name: "Brand Foundation",
        stageLabel: "Stage 01 — Starting Out",
        defaultPriceNGN: 80000,
        defaultPriceUSD: 100,
        description: "Building a clear, professional brand foundation for new market launches.",
        scope: [
            "Brand Strategy (Lite) — Purpose, Positioning & Tonality",
            "Primary Logo & Sub Mark (2 Concept Directions)",
            "Brand Colour Palette & Typography System",
            "Mini Brand Guidelines",
            "Business Card & Letterhead Suite",
            "Final Logo Files in All Standard Formats"
        ]
    },
    Clarity: {
        name: "Brand Clarity",
        stageLabel: "Stage 02 — Running, but Stuck",
        defaultPriceNGN: 300000,
        defaultPriceUSD: 400,
        description: "Rebuilding clarity, alignment, and consistency across all touchpoints for operating businesses.",
        scope: [
            "Competitor Research & Market Positioning Strategy",
            "User Persona & Tonality Framework",
            "Visual Audit & 3 Concept Directions with Logo Exploration",
            "Primary Logo, Sub Marks, Icon & Pattern Design",
            "Full Brand Guidelines & Corporate Collateral Suite",
            "Social Media Template System (4 Recurring Formats)",
            "Layout & Grid Rules for Brand Touchpoints"
        ]
    },
    Scale: {
        name: "Brand Scale",
        stageLabel: "Stage 03 — Growing & Scaling",
        defaultPriceNGN: 900000,
        defaultPriceUSD: 1200,
        description: "Comprehensive rebrand, packaging, systems, and digital design for scaling businesses.",
        scope: [
            "Full Market Research, Persona & Content Framework",
            "Comprehensive Logo Suite (Primary, Monogram, Symbols)",
            "Full Visual Design System & Guidelines",
            "Social Media Template Suite",
            "Packaging Design & Print-Ready Asset Handover",
            "Digital Website Structure & Interface Handover"
        ]
    },
    Enterprise: {
        name: "Brand Enterprise",
        stageLabel: "Stage 04 — Enterprise",
        defaultPriceNGN: 0, // Custom input required
        defaultPriceUSD: 0,
        description: "Custom brand operating system, long-term governance, and multi-platform design architecture.",
        scope: [
            "Custom Brand Operating System Development",
            "Custom Illustration & Motion Design Systems",
            "Editorial & Document Layout Template Suite",
            "Design System Documentation for Internal/External Teams",
            "Sub-Brand Architecture & Ongoing Governance"
        ]
    }
};

export function getTierDefaultPrice(tier: EngagementTier, customPrice?: number | null): number {
    if (customPrice !== undefined && customPrice !== null && customPrice > 0) {
        return customPrice;
    }
    const config = TIER_CONFIG[tier];
    return config ? config.defaultPriceNGN : 0;
}

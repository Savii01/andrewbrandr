import {
    FiSearch,
    FiFileText,
    FiTarget,
    FiCompass,
    FiPenTool,
    FiMonitor,
    FiPackage,
    FiCheckCircle,
    FiPhoneCall,
} from "react-icons/fi";
import { EngagementStage } from "@/lib/types/dashboard";
import { IconType } from "react-icons";

// ─── Stage Configuration ───
// Central source of truth for stage metadata, ordering, groups, milestones, and dependencies.

export interface StageConfig {
    label: string;
    group: "commercial" | "creative" | "delivery";
    icon: IconType;
    defaultMilestones: string[];
    /** Stages that should ideally be completed before this one begins. Warn but never block. */
    softDependencies: EngagementStage[];
    description: string;
}

export const STAGE_CONFIG: Record<EngagementStage, StageConfig> = {
    discovery: {
        label: "Discovery",
        group: "commercial",
        icon: FiSearch,
        description: "Initial conversation about business, positioning, and what needs to change.",
        defaultMilestones: [
            "Discovery call scheduled",
            "Discovery call completed",
            "Business context documented",
            "Positioning gaps identified",
        ],
        softDependencies: [],
    },
    proposal: {
        label: "Proposal",
        group: "commercial",
        icon: FiFileText,
        description: "Formal proposal outlining scope, deliverables, timeline, and pricing.",
        defaultMilestones: [
            "Proposal drafted",
            "Proposal reviewed internally",
            "Proposal sent to client",
            "Proposal accepted",
        ],
        softDependencies: ["discovery"],
    },
    strategy: {
        label: "Strategy",
        group: "creative",
        icon: FiTarget,
        description: "Define the foundation — mission, vision, audience, positioning.",
        defaultMilestones: [
            "Brand audit completed",
            "Competitor analysis done",
            "Audience personas defined",
            "Positioning statement finalized",
            "Strategy document delivered",
        ],
        softDependencies: ["discovery", "proposal"],
    },
    creativeDirection: {
        label: "Creative Direction",
        group: "creative",
        icon: FiCompass,
        description: "Visual direction, mood boards, and design intent.",
        defaultMilestones: [
            "Mood boards created",
            "Visual direction presented",
            "Creative direction approved",
        ],
        softDependencies: ["strategy"],
    },
    identity: {
        label: "Identity",
        group: "creative",
        icon: FiPenTool,
        description: "Full visual system — logo suite, typography, colour, assets.",
        defaultMilestones: [
            "Logo concepts designed",
            "Logo direction selected",
            "Typography system defined",
            "Colour palette finalized",
            "Asset library created",
            "Identity system approved",
        ],
        softDependencies: ["strategy", "creativeDirection"],
    },
    presentation: {
        label: "Presentation",
        group: "creative",
        icon: FiMonitor,
        description: "Brand book, guidelines, and formal presentation to client.",
        defaultMilestones: [
            "Brand book compiled",
            "Presentation prepared",
            "Presentation delivered",
            "Client feedback received",
            "Revisions completed",
        ],
        softDependencies: ["identity"],
    },
    delivery: {
        label: "Delivery",
        group: "delivery",
        icon: FiPackage,
        description: "Final files, guidelines, and documentation delivered.",
        defaultMilestones: [
            "Final files exported",
            "Brand guidelines document finalized",
            "File handoff completed",
            "Final invoice sent",
        ],
        softDependencies: ["presentation"],
    },
    offboarding: {
        label: "Offboarding",
        group: "delivery",
        icon: FiCheckCircle,
        description: "Post-delivery check-in, feedback collection, and closure.",
        defaultMilestones: [
            "Post-launch check-in scheduled",
            "Post-launch check-in completed",
            "Feedback form sent",
            "Feedback received",
            "Case study drafted",
        ],
        softDependencies: ["delivery"],
    },
    followUp: {
        label: "Follow-Up",
        group: "delivery",
        icon: FiPhoneCall,
        description: "Ongoing relationship — retainer, future projects, referrals.",
        defaultMilestones: [
            "Retainer discussion had",
            "Follow-up touchpoint scheduled",
            "Referral request sent",
        ],
        softDependencies: ["offboarding"],
    },
};

// ─── Grouped stage lists for navigation rendering ───

export const STAGE_GROUPS = {
    commercial: {
        label: "Commercial",
        stages: ["discovery", "proposal"] as EngagementStage[],
    },
    creative: {
        label: "Creative",
        stages: ["strategy", "creativeDirection", "identity", "presentation"] as EngagementStage[],
    },
    delivery: {
        label: "Delivery",
        stages: ["delivery", "offboarding", "followUp"] as EngagementStage[],
    },
};

export const GROUPS = [
    { key: "commercial", label: "Commercial" },
    { key: "creative", label: "Creative" },
    { key: "delivery", label: "Delivery" },
];

// ─── Utility: build default stages map for a new engagement ───

import { StageState, ENGAGEMENT_STAGES } from "@/lib/types/dashboard";

export function buildDefaultStages(): Record<EngagementStage, StageState> {
    const stages = {} as Record<EngagementStage, StageState>;
    for (const stage of ENGAGEMENT_STAGES) {
        stages[stage] = { status: "not_started", startedAt: null, completedAt: null };
    }
    return stages;
}

export function buildDefaultMilestones(): Record<EngagementStage, Record<string, boolean>> {
    const milestones = {} as Record<EngagementStage, Record<string, boolean>>;
    for (const stage of ENGAGEMENT_STAGES) {
        const config = STAGE_CONFIG[stage];
        milestones[stage] = {};
        for (const m of config.defaultMilestones) {
            milestones[stage][m] = false;
        }
    }
    return milestones;
}

/**
 * Check if activating a stage has incomplete soft dependencies.
 * Returns array of incomplete dependency labels (empty = no warnings).
 */
export function checkSoftDependencies(
    targetStage: EngagementStage,
    stages: Record<EngagementStage, StageState>
): string[] {
    const config = STAGE_CONFIG[targetStage];
    const warnings: string[] = [];

    for (const dep of config.softDependencies) {
        if (stages[dep]?.status !== "completed") {
            warnings.push(STAGE_CONFIG[dep].label);
        }
    }

    return warnings;
}

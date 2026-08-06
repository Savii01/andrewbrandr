import { db } from "./config";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { 
    testimonials as defaultTestimonials, 
    pricingPlans as defaultPricingPlans, 
    experience as defaultExperience, 
    socialLinks as defaultSocialLinks, 
    faqs as defaultFaqs 
} from "@/data";

const CMS_COLLECTION = "site_content";
const PUBLIC_DOC = "public_pages";

export interface CustomPage {
    slug: string;
    title: string;
    content: string;
    seoDescription?: string;
    createdAt?: any;
}

export interface SiteContent {
    hero?: {
        name: string;
        role: string;
        headline: string;
        description: string;
        ctaText: string;
        ctaLink: string;
    };
    theShift?: {
        heading: string;
        description: string;
        metrics: { label: string; value: string }[];
    };
    processes?: {
        heading: string;
        description: string;
        steps: { title: string; description: string }[];
    };
    pricing?: {
        heading: string;
        investmentHeading: string;
        investmentText: string;
        plans: any[];
    };
    faq?: {
        heading: string;
        description: string;
        questions: { question: string; answer: string }[];
    };
    about?: {
        badge: string;
        name: string;
        roleLine: string;
        description: string;
        skills: string[];
        experience: { role: string; company: string; year: string }[];
    };
    testimonialsContent?: {
        heading: string;
        subheading: string;
        list: { id: number; name: string; businessName: string; review: string }[];
    };
    footer?: {
        tagline: string;
        links: { label: string; href: string }[];
        policyLinks: { label: string; href: string }[];
    };
    layout?: {
        order: string[];
        visible: Record<string, boolean>;
        customSections?: { id: string; heading: string; description: string; ctaText?: string; ctaLink?: string; bgClass?: string }[];
    };
    socialLinks?: { name: string; icon: string; url: string }[];
    [key: string]: any;
}

const DEFAULT_SEEDS: SiteContent = {
    hero: {
        name: "Saviour Andrew",
        role: "Brand Strategist & Designer",
        headline: "Your brand is the first conversation \nyour business has with a stranger, and if it’s unclear, they move on.",
        description: "I build structured brand systems for businesses that need more than\ngood visuals. They need clarity, consistency, and a foundation that\ncan grow.\n\nStrategy. Identity. Web.",
        ctaText: "Start the Process",
        ctaLink: "/work-with-me"
    },
    theShift: {
        heading: "The Shift",
        description: "Design that drives real performance. Simple shifts, giant leaps.",
        metrics: [
            { value: "4.8x", label: "Average client ROI increase post-rebrand" },
            { value: "92%", label: "Clients reporting elevated market perceived value" },
            { value: "100%", label: "Timely delivery and strategic alignment guarantee" }
        ]
    },
    processes: {
        heading: "A design system built for speed, clarity and execution",
        description: "We don't do endless meetings or messy email chains. We work in structured weekly sprints so you always know what we're building, why we're building it, and when it'll be done.",
        steps: [
            { title: "Commercial Discovery", description: "First, we unpack your business. We look at who you are, what you sell, who your actual competitors are, and how you want to be positioned in the market. We don't design a single pixel until we have a strategy." },
            { title: "Creative Direction", description: "Next, we set the visual mood. We create mood boards to align on the creative direction — the fonts, colors, and design style that will define your brand. We agree on the direction before deep diving." },
            { title: "Design Sprint", description: "Once the direction is locked, we build. We design your logo system, typography, color palette, and corporate collaterals. You receive visual mockups showing how your brand lives in the real world." },
            { title: "Web System Implementation", description: "Finally, we build your digital home. We design and develop a responsive, high-performance website that feels premium and matches your brand system. We deliver clean, hand-off files ready to convert." }
        ]
    },
    pricing: {
        heading: "Growth happens in phases.\nYour brand should reflect the one you're in.",
        investmentHeading: "A strong brand is not an expense.",
        investmentText: "It's the foundation your growth depends on. Each stage is designed around what your business actually needs.",
        plans: defaultPricingPlans
    },
    faq: {
        heading: "Frequently Asked Questions",
        description: "Got questions? We have answers. Learn more about our process, pricing, and how we work together.",
        questions: defaultFaqs
    },
    about: {
        badge: "Expert Designer",
        name: "Saviour Andrew",
        roleLine: "Visual & Brand Designer • Web Designer & Developer • Digital Designer",
        description: "I’m Saviour Andrew, a Visual & Web Designer passionate about crafting bold brand identities and digital experiences that feel thoughtful and timeless. I blend creativity with technical precision to create seamless brand ecosystems.",
        skills: ["Visual Identity", "Branding", "Web Design", "Development", "UI Design", "Digital Design"],
        experience: defaultExperience
    },
    testimonialsContent: {
        heading: "Why Clients Love Us",
        subheading: "Trusted by creators and businesses worldwide. Here is what they have to say.",
        list: defaultTestimonials
    },
    footer: {
        tagline: "I design systems that connect clarity with Creativity.",
        links: [
            { label: "About", href: "/about" },
            { label: "Process", href: "/#process" },
            { label: "Projects", href: "/projects" },
            { label: "Contact", href: "/send-message" }
        ],
        policyLinks: [
            { label: "Terms", href: "/terms" },
            { label: "Policy", href: "/policy" },
            { label: "Refund", href: "/refund" },
            { label: "Stages", href: "/#stages" }
        ]
    },
    layout: {
        order: ["hero", "socialProofs", "theShift", "processes", "projectSlider", "pricing", "about", "testimonials", "faq"],
        visible: {
            hero: true,
            socialProofs: true,
            theShift: true,
            processes: true,
            projectSlider: true,
            pricing: true,
            about: true,
            testimonials: true,
            faq: true
        }
    },
    socialLinks: defaultSocialLinks
};

/**
 * Fetch all CMS content for the public site, auto-seeding if missing.
 */
export async function getSiteContent(): Promise<SiteContent | null> {
    if (!db) return null;
    
    try {
        const docRef = doc(db, CMS_COLLECTION, PUBLIC_DOC);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data() as SiteContent;
            let hasMissing = false;
            const updatedData = { ...data };
            
            for (const key of Object.keys(DEFAULT_SEEDS)) {
                if (!updatedData[key]) {
                    updatedData[key] = DEFAULT_SEEDS[key];
                    hasMissing = true;
                }
            }
            
            if (hasMissing) {
                await setDoc(docRef, updatedData);
            }
            return updatedData;
        } else {
            // Seed the entire document with default values
            await setDoc(docRef, DEFAULT_SEEDS);
            return DEFAULT_SEEDS;
        }
    } catch (error) {
        console.error("Error fetching site content:", error);
        return null;
    }
}

/**
 * Update a specific section of the CMS content.
 */
export async function updateSiteSection(sectionKey: string, data: any): Promise<void> {
    if (!db) throw new Error("Database not initialized");
    
    try {
        const docRef = doc(db, CMS_COLLECTION, PUBLIC_DOC);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            await updateDoc(docRef, {
                [sectionKey]: data
            });
        } else {
            await setDoc(docRef, {
                [sectionKey]: data
            });
        }
    } catch (error) {
        console.error(`Error updating section ${sectionKey}:`, error);
        throw error;
    }
}

/**
 * Custom Dynamic Pages CRUD Functions
 */
export async function getCustomPages(): Promise<CustomPage[]> {
    if (!db) return [];
    try {
        const querySnapshot = await getDocs(collection(db, "pages"));
        const pages: CustomPage[] = [];
        querySnapshot.forEach(doc => {
            pages.push({ slug: doc.id, ...doc.data() } as CustomPage);
        });
        return pages;
    } catch (error) {
        console.error("Error fetching custom pages:", error);
        return [];
    }
}

export async function getCustomPage(slug: string): Promise<CustomPage | null> {
    if (!db) return null;
    try {
        const docRef = doc(db, "pages", slug);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { slug: docSnap.id, ...docSnap.data() } as CustomPage;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching custom page ${slug}:`, error);
        return null;
    }
}

export async function saveCustomPage(slug: string, data: Omit<CustomPage, 'slug'>): Promise<void> {
    if (!db) throw new Error("Database not initialized");
    try {
        const docRef = doc(db, "pages", slug);
        await setDoc(docRef, data, { merge: true });
    } catch (error) {
        console.error(`Error saving custom page ${slug}:`, error);
        throw error;
    }
}

export async function deleteCustomPage(slug: string): Promise<void> {
    if (!db) throw new Error("Database not initialized");
    try {
        const docRef = doc(db, "pages", slug);
        await deleteDoc(docRef);
    } catch (error) {
        console.error(`Error deleting custom page ${slug}:`, error);
        throw error;
    }
}

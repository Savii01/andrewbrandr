export interface Project {
    id: number;
    name: string;
    client: string;
    image: string;
    images: string[];
    category: string[];
    description: string;
    website: string;
    behance: string;
    year: number;
    challenge?: string;
    solution?: string;
    testimonial?: {
        author: string;
        role: string;
        content: string;
    };
}

export const projects: Project[] = [
    {
        id: 1,
        name: "Nexova",
        client: "Nexova Technologies",
        image: "/images/nexova/2.png",
        images: ["/images/nexova/2.png", "/images/nexova/2.png", "/images/nexova/2.png", "/images/nexova/2.png", "/images/nexova/2.png"],
        category: ["Brand Identity", "Social media"],
        description:
            "Nexova needed a bold new identity that could scale across digital and print platforms. We developed a modern, tech-inspired logo, a flexible brand system, and a vibrant social media design toolkit that elevated their presence and made them stand out in a competitive landscape.",
        website: "https://nexova.io",
        behance: "https://behance.net/nexova",
        year: 2024,
        challenge: "Nexova was expanding rapidly into global markets but struggled with a fragmented identity that felt outdated next to modern tech competitors. They needed a cohesive, high-performance brand system that communicated reliability and cutting-edge innovation.",
        solution: "We redefined Nexova's visual language with a modular grid-based identity system. This included a bespoke type-driven logo, a high-contrast color palette, and a comprehensive set of digital assets designed for maximum scalability and impact across all touchpoints.",
        testimonial: {
            author: "Sarah Chen",
            role: "CTO, Nexova",
            content: "The transformation was immediate. Our new identity doesn't just look better; it has fundamentally changed how investors and enterprise clients perceive us. The level of detail and strategy behind the design is exceptional."
        }
    },
    {
        id: 2,
        name: "PureSpace",
        client: "PureSpace Interiors",
        image: "/images/PureSpace/cover.png",
        images: ["/images/PureSpace/cover.png", "/images/PureSpace/cover.png", "/images/PureSpace/cover.png", "/images/PureSpace/cover.png", "/images/PureSpace/cover.png"],
        category: ["Brand Identity", "Social media", "Web Development"],
        description:
            "PureSpace, a clean living and eco-interior brand, came to us needing a full-stack brand solution. We created a calming, minimal identity, consistent social content, and a clean, responsive website that reflects their core values of simplicity and sustainability.",
        website: "https://purespace.co",
        behance: "https://behance.net/purespace",
        year: 2023,
        challenge: "PureSpace Interiors had beautiful projects but a brand that felt inconsistent and crowded. They needed to pivot towards a premium, minimal aesthetic that mirrored their clean-room and sustainable design philosophy.",
        solution: "We stripped away the clutter, focusing on whitespace and a refined monochromatic palette. The result is a minimal yet warm identity that allows their interior work to take center stage, supported by a functional, content-heavy website.",
        testimonial: {
            author: "Michael Aris",
            role: "Founder, PureSpace",
            content: "They understood our vision of 'clean living' perfectly. The new branding has brought a sense of calm and clarity to our marketing that our clients genuinely appreciate."
        }
    },
    {
        id: 3,
        name: "Glow",
        client: "Glow Skincare",
        image: "/images/Glow/cover.png",
        images: ["/images/Glow/cover.png", "/images/Glow/cover.png", "/images/Glow/cover.png", "/images/Glow/cover.png", "/images/Glow/cover.png"],
        category: ["Brand Identity", "Social media", "Web Development"],
        description:
            "Glow Skincare sought a complete brand refresh and ecommerce-ready website. We crafted a soft, feminine identity, built engaging content visuals, and developed a fast, mobile-optimized web experience with seamless shopping functionality.",
        website: "https://glowskincare.co",
        behance: "https://behance.net/glow",
        year: 2024,
        challenge: "Glow Skincare needed a complete brand refresh and ecommerce-ready website. We crafted a soft, feminine identity, built engaging content visuals, and developed a fast, mobile-optimized web experience with seamless shopping functionality.",
        solution: "We stripped away the clutter, focusing on whitespace and a refined monochromatic palette. The result is a minimal yet warm identity that allows their interior work to take center stage, supported by a functional, content-heavy website.",
        testimonial: {
            author: "Michael Aris",
            role: "Founder, Glow Skincare",
            content: "They understood our vision of 'clean living' perfectly. The new branding has brought a sense of calm and clarity to our marketing that our clients genuinely appreciate."
        }
    },
    {
        id: 4,
        name: "Nexera",
        client: "Nexera Cloud Systems",
        image: "/images/Nexera/cover.png",
        images: ["/images/Nexera/cover.png", "/images/Nexera/cover.png", "/images/Nexera/cover.png", "/images/Nexera/cover.png", "/images/Nexera/cover.png"],
        category: ["Brand Identity", "Web Development"],
        description:
            "For Nexera's SaaS product, we built a bold, scalable identity system and a powerful marketing website. The site is optimized for performance, conversion, and scalability, with custom CMS integration and conversion-optimized UX across devices.",
        website: "https://nexera.dev",
        behance: "https://behance.net/nexera",
        year: 2023,
        challenge: "Nexera was expanding rapidly into global markets but struggled with a fragmented identity that felt outdated next to modern tech competitors. They needed a cohesive, high-performance brand system that communicated reliability and cutting-edge innovation.",
        solution: "We redefined Nexera's visual language with a modular grid-based identity system. This included a bespoke type-driven logo, a high-contrast color palette, and a comprehensive set of digital assets designed for maximum scalability and impact across all touchpoints.",
        testimonial: {
            author: "Sarah Chen",
            role: "CTO, Nexera Cloud Systems",
            content: "The transformation was immediate. Our new identity doesn't just look better; it has fundamentally changed how investors and enterprise clients perceive us. The level of detail and strategy behind the design is exceptional."
        }
    },
    {
        id: 5,
        name: "LinkerPay",
        client: "LinkerPay Inc.",
        image: "/images/Linkerpay/cover.png",
        images: ["/images/Linkerpay/cover.png", "/images/Linkerpay/cover.png", "/images/Linkerpay/cover.png", "/images/Linkerpay/cover.png", "/images/Linkerpay/cover.png"],
        category: ["Brand Identity"],
        description:
            "LinkerPay needed a professional and secure brand identity for their digital payments platform. We created a clean, fintech-forward visual system, complete with a modern logo, color palette, and modular design assets suitable for onboarding, investor decks, and product visuals.",
        website: "https://linkerpay.com",
        behance: "https://behance.net/linkerpay",
        year: 2022,
        challenge: "Nexera was expanding rapidly into global markets but struggled with a fragmented identity that felt outdated next to modern tech competitors. They needed a cohesive, high-performance brand system that communicated reliability and cutting-edge innovation.",
        solution: "We redefined Nexera's visual language with a modular grid-based identity system. This included a bespoke type-driven logo, a high-contrast color palette, and a comprehensive set of digital assets designed for maximum scalability and impact across all touchpoints.",
        testimonial: {
            author: "Sarah Chen",
            role: "CTO, LinkerPay Inc.",
            content: "The transformation was immediate. Our new identity doesn't just look better; it has fundamentally changed how investors and enterprise clients perceive us. The level of detail and strategy behind the design is exceptional."
        }
    },
    {
        id: 6,
        name: "Ecocycle",
        client: "Ecocycle Solutions",
        image: "/images/Ecocycle/cover.png",
        images: ["/images/Ecocycle/cover.png", "/images/Ecocycle/cover.png", "/images/Ecocycle/cover.png", "/images/Ecocycle/cover.png", "/images/Ecocycle/cover.png"],
        category: ["Brand Identity", "Product Design"],
        description:
            "Ecocycle, a green-tech startup, challenged us with crafting a unique identity that speaks to both innovation and sustainability. We developed an eco-conscious brand system and detailed product packaging designs that communicate their mission at every customer touchpoint.",
        website: "https://ecocycle.tech",
        behance: "https://behance.net/ecocycle",
        year: 2023,
        challenge: "Nexera was expanding rapidly into global markets but struggled with a fragmented identity that felt outdated next to modern tech competitors. They needed a cohesive, high-performance brand system that communicated reliability and cutting-edge innovation.",
        solution: "We redefined Nexera's visual language with a modular grid-based identity system. This included a bespoke type-driven logo, a high-contrast color palette, and a comprehensive set of digital assets designed for maximum scalability and impact across all touchpoints.",
        testimonial: {
            author: "Sarah Chen",
            role: "CTO, Ecocycle Solutions",
            content: "The transformation was immediate. Our new identity doesn't just look better; it has fundamentally changed how investors and enterprise clients perceive us. The level of detail and strategy behind the design is exceptional."
        }
    },
];

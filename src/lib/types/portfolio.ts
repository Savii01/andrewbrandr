export interface CloudinaryImage {
    url: string;
    publicId: string;
}

export interface Project {
    id: string; // Firestore document ID or static ID string
    slug: string;
    name: string;
    client: string;
    industry: string;
    year: number;
    stage: "foundation" | "clarity" | "scale" | "enterprise";
    coverImage: string | CloudinaryImage;
    services: string[];

    context: string;
    problem: string;
    strategy: string;
    strategyImages?: (string | CloudinaryImage)[];
    creativeDirection: string;
    creativeDirectionImages?: (string | CloudinaryImage)[];
    identitySystem: string;
    identitySystemImages?: (string | CloudinaryImage)[];
    outcome: string;

    website?: string;
    behance?: string;

    testimonial?: {
        author: string;
        role: string;
        content: string;
    };
    isPublic: boolean;
    order: number;
    createdAt?: any;
}

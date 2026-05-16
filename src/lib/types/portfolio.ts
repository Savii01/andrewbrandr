export interface Project {
    id: string;
    name: string;
    client: string;
    image: string; // Cover image
    images: string[]; // Gallery images
    category: string[];
    description: string;
    website?: string;
    behance?: string;
    year: number;
    challenge?: string;
    solution?: string;
    testimonial?: {
        author: string;
        role: string;
        content: string;
    };
    isPublic: boolean;
    order: number;
    createdAt: any;
}

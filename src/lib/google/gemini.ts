import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface BriefData {
    clientName: string;
    businessName: string;
    package: string;
    primaryGoal: string;
    targetAudience: string;
    brandPersonality: string[];
    colorPreferences: string;
    deliverables: string[];
    deadline: string;
    additionalNotes: string;
}

/**
 * Parses messy client intake notes into a structured creative brief JSON.
 * Falls back gracefully if Gemini fails, returning sensible defaults.
 */
export async function generateCreativeBrief(
    rawNotes: string,
    clientName: string,
    packageName: string
): Promise<BriefData> {
    const prompt = `
You are an expert brand design director working for AndrewBrandr, a premium design studio.

A new client has just submitted their intake form. Parse the following raw notes into a structured JSON object.
Return ONLY valid JSON with no markdown fences, no commentary — just the raw JSON object.

Client: ${clientName}
Package: ${packageName}
Raw Notes:
"""
${rawNotes}
"""

Return a JSON object with exactly these fields:
{
  "clientName": "string",
  "businessName": "string (extract from notes or use clientName)",
  "package": "string",
  "primaryGoal": "string (what is the main business goal?)",
  "targetAudience": "string (who are their customers?)",
  "brandPersonality": ["array", "of", "adjectives"],
  "colorPreferences": "string (any color mentions or 'Not specified')",
  "deliverables": ["array", "of", "expected", "outputs"],
  "deadline": "string (any timeline mentions or 'To be confirmed')",
  "additionalNotes": "string (anything important not covered above)"
}
`.trim();

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        const text = response.text?.trim() ?? "";
        // Strip any accidental markdown fences
        const cleaned = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
        return JSON.parse(cleaned) as BriefData;
    } catch (err) {
        console.error("[Gemini] Brief generation failed:", err);
        // Return a sensible fallback so the workflow doesn't break
        return {
            clientName,
            businessName: clientName,
            package: packageName,
            primaryGoal: "Not specified",
            targetAudience: "Not specified",
            brandPersonality: [],
            colorPreferences: "Not specified",
            deliverables: [],
            deadline: "To be confirmed",
            additionalNotes: rawNotes,
        };
    }
}

/**
 * Expands a short client mood description into a detailed mood board prompt.
 */
export async function expandMoodBoardPrompt(
    shortDescription: string
): Promise<string> {
    const prompt = `
You are a creative director. Expand this short client mood description into a rich, 
detailed, 80-word mood board description for a designer. 
Include: lighting style, color palette, texture, typography feel, spatial composition, and emotional tone.
Return only the expanded description text, no labels.

Client description: "${shortDescription}"
`.trim();

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
        return response.text?.trim() ?? shortDescription;
    } catch {
        return shortDescription;
    }
}

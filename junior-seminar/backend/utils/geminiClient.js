const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
async function generatePrompt({ title, authors, description }) {
    const defaultDescription = description?.trim() || null;
    const prompt = `
    Create 50short, friendly, and open-ended reflection prompts for a reader who has just finished a book titled "${title}" by ${authors?.join(", ")}.
    ${defaultDescription
            ? `The book description is: "${defaultDescription}".`
            : "No description is available, so focus on general themes or possible emotional experiences from reading the book."}
    Keep the tone personal and introspective, but easy to understand.`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
            temperature: 0.7,
            maxOutputTokens: 256,
        });
        const text = response.text || "No prompt generated";
        const splitPrompts = text.split(/\n?\s*\d+\.\s*/).filter(Boolean).slice(1).map(p => p.replace(/\n/g, ' ').trim());
        return splitPrompts.length ? splitPrompts : [text];
    } catch (error) {
        console.error("Gemini API error:", error);
        throw new Error("Failed to generate prompt");
    }
}
module.exports = { generatePrompt };

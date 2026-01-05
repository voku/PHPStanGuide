import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize Gemini only if API key is present.
// We do not throw here to allow the app to run in "offline" mode if key is missing,
// gracefully disabling AI features.
const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateExplanation = async (topic: string, codeSnippet?: string): Promise<string> => {
  if (!ai) return "AI features are unavailable. Please check your API Key configuration.";

  try {
    const prompt = `
      You are an expert PHP developer and PHPStan tutor.
      Explain the concept of "${topic}" in the context of PHPStan and PHPDocs.
      ${codeSnippet ? `Analyze this code snippet:\n${codeSnippet}` : ''}
      Keep the explanation concise, practical, and under 150 words.
      Use Markdown for formatting.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No explanation generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to contact the AI tutor.";
  }
};

export const generateQuizQuestion = async (topic: string): Promise<any> => {
  if (!ai) return null;

  try {
    const prompt = `
      Generate a single multiple-choice quiz question about PHPStan type: "${topic}".
      Return ONLY a JSON object with this schema:
      {
        "question": "The question text",
        "codeSnippet": "Optional code snippet if needed, else null",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0, // Index 0-3
        "explanation": "Why this is correct"
      }
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};
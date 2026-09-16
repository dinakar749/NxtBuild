import { GoogleGenAI } from "@google/genai";

const MODELS = ["gemini-2.0-flash", "gemini-1.5-flash"];

const generateContent = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing from environment variables!");
    throw new Error("GEMINI_API_KEY environment variable is missing on server.");
  }

  const ai = new GoogleGenAI({ apiKey });

  let lastError = null;
  for (const model of MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (error) {
      console.error(`Gemini API error with model ${model}:`, error.message);
      lastError = error;
    }
  }

  throw new Error(`Gemini API error: ${lastError ? lastError.message : "No response"}`);
};

export { generateContent };
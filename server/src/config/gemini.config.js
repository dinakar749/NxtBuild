import { GoogleGenAI } from "@google/genai";

const MODELS = [
  "gemini-2.5-flash",
  "gemini-flash-latest",
  "gemini-3.7-flash",
  "gemini-2.5-pro"
];

const generateContent = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing from environment variables!");
    throw new Error("GEMINI_API_KEY environment variable is missing in server/.env.");
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
      
      // If permission denied or invalid key, no need to keep trying all fallback models
      if (error.message?.includes("PERMISSION_DENIED") || error.message?.includes("API_KEY_INVALID")) {
        break;
      }
    }
  }

  let errorMessage = lastError?.message || "No response received from Gemini API.";
  if (errorMessage.includes("PERMISSION_DENIED") || errorMessage.includes("denied access")) {
    errorMessage = "Your GEMINI_API_KEY project was denied access or disabled. Please generate a new API key at https://aistudio.google.com/app/apikey and update it in server/.env.";
  }

  throw new Error(errorMessage);
};

export { generateContent };
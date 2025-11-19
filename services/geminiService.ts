import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { InsightRequest } from '../types';

// Initialize the client using the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDataInsight = async (request: InsightRequest): Promise<string> => {
  try {
    // We use gemini-2.5-flash for speed and efficiency in analyzing data patterns
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      You are a senior data analyst for LISTIC. 
      Analyze the following data context and sample. 
      Provide a concise, 3-sentence strategic insight highlighting anomalies, trends, or key performance indicators.
      Do not use markdown formatting like **bold** or lists. Keep it raw text.
      
      Context: ${request.context}
      Data Sample: ${JSON.stringify(request.dataSample).substring(0, 2000)}
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "No insight generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate insights at this time. Please check your API connection.";
  }
};

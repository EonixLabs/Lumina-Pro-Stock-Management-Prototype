
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: "AIzaSyA0ekLVgTC1rlsMMjq-sxnHNOSWWyjNQbw" });

export async function askInventoryAssistant(prompt: string, products: Product[]): Promise<string> {
  const context = `
    You are an expert inventory analyst for "Lumina Gadgets", a high-end electronics store.
    Current Inventory Data in JSON:
    ${JSON.stringify(products, null, 2)}
    
    Instructions:
    - Answer user questions based ONLY on the provided stock data.
    - Be concise and professional.
    - If asked for recommendations, suggest restocks for items below their minimum threshold.
    - If asked for sales analysis, highlight the best performing categories.
    - Always provide numbers and specific product names when relevant.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: context,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't analyze the inventory at this moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error communicating with the AI Assistant. Please check your connection.";
  }
}

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getClient = (): GoogleGenAI => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeRegion = async (
  regionName: string,
  context: string,
  question: string
): Promise<string> => {
  try {
    const ai = getClient();
    
    // Using flash model for speed, with search grounding to get up-to-date conflict/resource info
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      Context: The user is looking at a map of the Democratic Republic of Congo focusing on mineral resources and conflict zones.
      Selected Region/Point: ${regionName}
      Details: ${context}
      
      User Question: ${question}
      
      Task: Provide a concise, factual situation report. If the query relates to conflict or recent events, use Google Search to find the latest information. 
      Focus on the relationship between mineral wealth and instability if applicable.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Enable grounding
        systemInstruction: "You are an expert analyst on the DRC, specializing in the geopolitics of mining and conflict.",
      }
    });

    // Check for grounding metadata to append sources if available (optional for UI, but good practice)
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    let text = response.text || "No analysis available.";

    if (groundingMetadata?.groundingChunks) {
      const sources = groundingMetadata.groundingChunks
        .map((chunk: any) => chunk.web?.uri)
        .filter((uri: string) => uri)
        .slice(0, 3);
      
      if (sources.length > 0) {
        text += `\n\nSources:\n${sources.map((s: string) => `- ${s}`).join('\n')}`;
      }
    }

    return text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate analysis at this time. Please ensure your API key is configured correctly.";
  }
};

import { GoogleGenerativeAI } from "@google/generative-ai";

export const summarizeTranscription = async (transcription: string) => {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Analyze this video transcription and create a hierarchical summary suitable for a mind map.
    Format the response as a JSON object with this structure:
    {
      "text": "Main Topic",
      "children": [
        {
          "text": "Subtopic 1",
          "children": [
            { "text": "Point 1" },
            { "text": "Point 2" }
          ]
        }
      ]
    }
    
    Here's the transcription:
    ${transcription}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate summary");
  }
};
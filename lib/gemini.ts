import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

export function getGemini(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is missing. AI features will fail.");
    }
    // Initialize anyway with whatever we have, if not set it will throw on use.
    ai = new GoogleGenAI({ apiKey: apiKey || '' });
  }
  return ai;
}

export async function analyzeLeadConversation(messages: string[]) {
  const gemini = getGemini();
  const prompt = `
You are an expert sales assistant analyzing an inbound conversation from a WhatsApp lead.
Here is the conversation text / message(s) from the lead:
---
${messages.join('\n')}
---

Analyze this conversation and return a JSON object ONLY. Make sure it adheres exactly to this structure:
{
  "leadScore": "Hot" | "Warm" | "Cold", // "Hot" if ready to buy/meet, "Warm" if asking questions/interested, "Cold" if unengaged/wrong number
  "summary": "Short 1-2 sentence summary of what the lead wants",
  "intent": "The primary intent (e.g., 'Pricing inquiry', 'Support issue', 'Booking request')",
  "suggestedFollowUp": "A drafted response message to send back to the lead",
  "nextAction": "Short instruction for the human rep (e.g., 'Call them', 'Send pricing PDF', 'Wait for response')"
}`;

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
}

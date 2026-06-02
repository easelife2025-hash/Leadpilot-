import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, industry, context } = await req.json();
    
    // Explicit error check for Gemini API key
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
      return NextResponse.json({ 
        text: `Hey ${name}, we saw your interest in the ${industry} space! This is a placeholder AI message because the Gemini API key is not configured in settings. Let's connect soon.`
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `You are a high-performing sales assistant for LeadPilot AI.
Write a concise, engaging, and professional WhatsApp outreach message to a new lead.
Their name is: ${name}.
Their industry is: ${industry}.
Notes/Context about them: ${context}.

Rules:
1. Short and punchy (WhatsApp style).
2. Professional but warm.
3. Don't sound like a generic robot.
4. Keep it under 50 words.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });
    
    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate message" }, { status: 500 });
  }
}

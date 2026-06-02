import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy' });

export async function POST(req: NextRequest) {
  try {
    const { context, name } = await req.json();
    
    const prompt = `You are an expert sales representative writing a highly engaging, concise WhatsApp message.
    The recipient's name is: ${name}.
    Context/Reason: ${context}.
    Task: Draft a short, friendly, and professional WhatsApp follow-up message. Do not include placeholders, just the text. Keep it under 60 words.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return NextResponse.json({ text: response.text });
  } catch (err: any) {
    console.error(err);
    // fallback for preview environment when api key is 'dummy'
    return NextResponse.json({ 
      text: `Hey ${name}, are you getting the value you need? I saw your recent interest and I'd love to help you get set up. Let me know if you want to hop on a quick 5 min call! 🚀`
    });
  }
}

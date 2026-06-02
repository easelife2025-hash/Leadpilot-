import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { phone, message } = await req.json();
    
    // In a real app, you would integrate with the Whatsapp Cloud API here using environment variables
    
    console.log(`[WhatsApp Delivery Log] To: ${phone} | Msg length: ${message.length}`);
    
    return NextResponse.json({ success: true, messageId: "wamid.HBgL" + Math.random().toString(36).substring(7) });
  } catch (err: any) {
    console.error("WhatsApp Send Error:", err);
    return NextResponse.json({ error: 'Failed to send WhatsApp message' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const { to, text } = await req.json();

    if (!to || !text) {
      return NextResponse.json({ error: "Missing 'to' or 'text' fields" }, { status: 400 });
    }

    const res = await sendWhatsAppMessage(to, text, "Manual Agent");

    return NextResponse.json({ success: true, messageId: res.messages?.[0]?.id });

  } catch (error: any) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { phone, message } = await req.json();
    
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    // If environment variables are set and not dummy, execute real API call to Meta
    if (accessToken && phoneNumberId && accessToken !== 'dummy') {
      const graphApiUrl = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;
      
      const response = await fetch(graphApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: phone,
          type: "text",
          text: { body: message }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Meta API Error");

      console.log(`[WhatsApp Production Log] Real message sent to: ${phone}`);
      return NextResponse.json({ success: true, data });
    }
    
    // Otherwise mock execution for AI Studio local preview
    console.log(`[WhatsApp Preview Log] Mock message sent to ${phone} | Content: ${message.substring(0, 30)}...`);
    return NextResponse.json({ success: true, messageId: "wamid.HBgL" + Math.random().toString(36).substring(7) });
    
  } catch (err: any) {
    console.error("WhatsApp Send Error:", err);
    return NextResponse.json({ error: err.message || 'Failed to send WhatsApp message' }, { status: 500 });
  }
}

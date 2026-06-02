import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { phone, message } = await req.json();
    
    // In a real application, you would invoke the Facebook Graph API for WhatsApp:
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    console.log(`[WHATSAPP-STUB] Would send WhatsApp message to ${phone}:`);
    console.log(message);

    if (token && phoneId && token !== 'YOUR_WHATSAPP_ACCESS_TOKEN') {
        // Only trigger real API if keys are actually customized
        const response = await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: phone,
                type: "text",
                text: { body: message }
            })
        });
        const data = await response.json();
        return NextResponse.json(data);
    }
    
    // Fallback stub response for preview
    return NextResponse.json({ success: true, previewMode: true, message: "Simulated WhatsApp delivery. Fill env variables for real delivery." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send WhatsApp message" }, { status: 500 });
  }
}

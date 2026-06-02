import { NextRequest, NextResponse } from 'next/server';

// 1. Webhook Verification Endpoint
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "my_secure_verify_token";

    if (mode === "subscribe" && token === verifyToken) {
      console.log("Webhook Verified via Meta!");
      return new NextResponse(challenge, { status: 200 });
    } else {
      console.error("Webhook Verification Failed!");
      return new NextResponse("Forbidden", { status: 403 });
    }
}

// 2. Incoming Messages Processing
export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      
      // Meta groups events in this object wrapper
      if (body.object === "whatsapp_business_account") {
        for (const entry of body.entry) {
          for (const change of entry.changes) {
            const changeValue = change.value;
            
            // Process incoming messages
            if (changeValue && changeValue.messages) {
              for (const message of changeValue.messages) {
                  const from = message.from; // Phone number
                  const text = message.text?.body;
                  const name = changeValue.contacts?.[0]?.profile?.name || "User";
                  
                  console.log(`[Incoming WhatsApp] From: ${name} (${from}) - Msg: ${text}`);
                  
                  // In the full setup, pass 'text' to Gemini AI here, and then call the send messaging API to auto-reply
              }
            } 
            // Process message statuses (delivered, read, failed)
            else if (changeValue && changeValue.statuses) {
              for (const status of changeValue.statuses) {
                  console.log(`[WhatsApp Status] Message ${status.id} is now ${status.status}`);
              }
            }
          }
        }
      }
      
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error("Webhook Processing Error:", err);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

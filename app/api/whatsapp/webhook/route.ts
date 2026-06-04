import { NextRequest, NextResponse } from 'next/server';
import { analyzeLeadConversation } from '@/lib/gemini';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // This is the token you will enter in the Meta Dashboard
  // We added 'leadpilot_verify_token' as a fallback so it works immediately for you!
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'leadpilot_verify_token';

  if (mode === 'subscribe' && token === verifyToken) {
    // Meta requires us to return the challenge string as a plain text response
    return new NextResponse(challenge, { status: 200 });
  } else {
    // If tokens don't match, return a 403 Forbidden error
    return NextResponse.json({ error: 'Invalid verification token' }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Log incoming messages for debugging
    console.log('Incoming WhatsApp Webhook Payload:', JSON.stringify(body, null, 2));

    // Handle messages
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;
      const contacts = value?.contacts;
      
      if (messages && messages.length > 0) {
        const message = messages[0];
        const contact = contacts?.[0];
        
        if (message.type === 'text') {
          const phoneNumber = message.from;
          const messageText = message.text.body;
          const contactName = contact?.profile?.name || 'Unknown Contact';
          
          console.log(`💬 Received message from ${contactName} (${phoneNumber}): ${messageText}`);
          
          // 1. Analyze conversation with Gemini API
          const aiInsight = await analyzeLeadConversation([messageText]);
          
          // 2. Store insights and the raw message in Firestore
          if (aiInsight) {
            const leadRef = doc(db, 'leads', phoneNumber);
            
            // Upsert the Lead Document with AI insights
            await setDoc(leadRef, {
              phoneNumber,
              name: contactName,
              lastMessage: messageText,
              lastMessageAt: serverTimestamp(),
              leadScore: aiInsight.leadScore,
              status: 'New', 
              summary: aiInsight.summary,
              intent: aiInsight.intent,
              suggestedFollowUp: aiInsight.suggestedFollowUp,
              nextAction: aiInsight.nextAction,
              updatedAt: serverTimestamp()
            }, { merge: true });

            // Store message in the thread subcollection
            const messageRef = collection(db, 'leads', phoneNumber, 'messages');
            await addDoc(messageRef, {
              text: messageText,
              from: phoneNumber,
              type: 'inbound',
              timestamp: serverTimestamp()
            });
            
            console.log(`✅ Stored AI insights for lead ${phoneNumber}: Score = ${aiInsight.leadScore}`);
          }
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error handling webhook POST:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

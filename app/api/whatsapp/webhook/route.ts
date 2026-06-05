import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, collection, addDoc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if it's a WhatsApp API webhook
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      if (value?.messages && value.messages.length > 0) {
        const message = value.messages[0];
        const contact = value.contacts?.[0];
        
        const fromNumber = message.from; // Phone number
        const textBody = message.text?.body;
        const contactName = contact?.profile?.name || "Unknown Contact";
        
        if (fromNumber && textBody) {
          // Check if lead exists
          const leadRef = doc(db, 'leads', fromNumber);
          const leadDoc = await getDoc(leadRef);

          if (!leadDoc.exists()) {
            await setDoc(leadRef, {
              name: contactName,
              phone: fromNumber,
              status: 'New',
              score: 0,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              lastMessageAt: serverTimestamp()
            });
          } else {
            await setDoc(leadRef, {
              updatedAt: serverTimestamp(),
              lastMessageAt: serverTimestamp()
            }, { merge: true });
          }

          // Save the message
          await addDoc(collection(db, 'leads', fromNumber, 'messages'), {
            from: contactName,
            phoneNumber: fromNumber,
            text: textBody,
            type: 'inbound',
            timestamp: serverTimestamp(),
            messageId: message.id
          });
        }
      }
    }

    return new NextResponse('EVENT_RECEIVED', { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

import { db } from '@/lib/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function sendWhatsAppMessage(to: string, text: string, fromAgent = "AI Agent", automationRule?: string) {
  // Fetch config from Firebase
  const configDoc = await getDoc(doc(db, 'settings', 'whatsapp'));
  if (!configDoc.exists()) {
    throw new Error("WhatsApp API is not configured");
  }

  const { accessToken, phoneNumberId } = configDoc.data();

  // Call actual Meta Graph API
  const response = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "text",
      text: {
        preview_url: false,
        body: text
      }
    })
  });

  const data = await response.json();

  if (data.error) {
    console.error("Meta API Error:", data.error);
    throw new Error(data.error.message || "Failed to send message via Meta API");
  }

  // Save outbound message to Firebase
  await addDoc(collection(db, 'leads', to, 'messages'), {
    from: fromAgent,
    to: to,
    text: text,
    type: 'outbound',
    timestamp: serverTimestamp(),
    messageId: data.messages?.[0]?.id, // Message ID from Meta
    ...(automationRule && { automationRule })
  });

  return data;
}

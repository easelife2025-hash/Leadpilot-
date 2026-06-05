import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const configDoc = await getDoc(doc(db, 'settings', 'whatsapp'));
    if (!configDoc.exists()) {
      return NextResponse.json({ connected: false });
    }
    const data = configDoc.data();
    return NextResponse.json({
      connected: true,
      wabaId: data.wabaId,
      phoneNumberId: data.phoneNumberId,
    });
  } catch (error) {
    console.error("Failed to get WhatsApp config:", error);
    return NextResponse.json({ error: "Failed to get config" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await setDoc(doc(db, 'settings', 'whatsapp'), { connected: false });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to clear WhatsApp config:", error);
    return NextResponse.json({ error: "Failed to clear config" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { accessToken, wabaId, phoneNumberId } = await req.json();
    
    if (!accessToken || !wabaId || !phoneNumberId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await setDoc(doc(db, 'settings', 'whatsapp'), {
      accessToken,
      wabaId,
      phoneNumberId,
      updatedAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save WhatsApp config:", error);
    return NextResponse.json({ error: "Failed to save config" }, { status: 500 });
  }
}

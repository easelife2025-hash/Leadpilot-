import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json({ error: "Access token is required" }, { status: 400 });
    }

    // 1. Fetch user debugging info to verify token and get Business accounts
    // Using standard Graph API points to get WABA and phone numbers
    // Note: For Embedded Signup, the user grants permissions and we can fetch WABA directly
    
    const clientAccountsRes = await fetch(`https://graph.facebook.com/v19.0/me/client_whatsapp_business_accounts?access_token=${accessToken}`);
    const clientAccounts = await clientAccountsRes.json();
    
    if (clientAccounts.error || !clientAccounts.data || clientAccounts.data.length === 0) {
      console.error("No WABA found:", clientAccounts.error);
      return NextResponse.json({ error: "No WhatsApp Business Accounts found for this user." }, { status: 400 });
    }

    const wabaId = clientAccounts.data[0].id;

    // 2. Fetch Phone Numbers for this WABA
    const phoneRes = await fetch(`https://graph.facebook.com/v19.0/${wabaId}/phone_numbers?access_token=${accessToken}`);
    const phoneData = await phoneRes.json();

    if (phoneData.error || !phoneData.data || phoneData.data.length === 0) {
      console.error("No Phone Numbers found:", phoneData.error);
      return NextResponse.json({ error: "No Phone Numbers associated with this WABA." }, { status: 400 });
    }

    const phoneNumberId = phoneData.data[0].id;

    // 3. Save to Firebase 
    await setDoc(doc(db, 'settings', 'whatsapp'), {
      accessToken, // Warning: Short-lived token, usually we should exchange for a system user token in production.
      wabaId,
      phoneNumberId,
      updatedAt: new Date()
    });

    return NextResponse.json({ success: true, wabaId, phoneNumberId });

  } catch (error) {
    console.error("Exchange error:", error);
    return NextResponse.json({ error: "Server error during token exchange" }, { status: 500 });
  }
}

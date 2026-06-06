import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { accessToken, code } = await req.json();

    if (!accessToken && !code) {
      return NextResponse.json({ error: "Access token or code is required" }, { status: 400 });
    }

    let activeToken = accessToken;

    // Optional: Exchange code for token if Embedded Signup with Config ID is used
    if (code) {
      const appId = process.env.NEXT_PUBLIC_META_APP_ID || process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
      const appSecret = process.env.META_APP_SECRET;
      if (!appSecret) {
        return NextResponse.json({ error: "Server is missing META_APP_SECRET for code exchange" }, { status: 500 });
      }

      // Exchange code for token
      const tokenExchangeRes = await fetch(
        `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&code=${code}`,
      );
      const tokenExchangeData = await tokenExchangeRes.json();
      
      if (tokenExchangeData.error) {
        console.error("Token exchange failed:", tokenExchangeData.error);
        return NextResponse.json({ error: "Failed to exchange code for token" }, { status: 400 });
      }
      activeToken = tokenExchangeData.access_token;
    }

    // 1. Fetch user debugging info to verify token and get Business accounts
    const clientAccountsRes = await fetch(`https://graph.facebook.com/v19.0/me/client_whatsapp_business_accounts?access_token=${activeToken}`);
    const clientAccounts = await clientAccountsRes.json();
    
    if (clientAccounts.error || !clientAccounts.data || clientAccounts.data.length === 0) {
      console.error("No WABA found:", clientAccounts.error);
      return NextResponse.json({ error: "No WhatsApp Business Accounts found for this user." }, { status: 400 });
    }

    const wabaId = clientAccounts.data[0].id;

    // 2. Fetch Phone Numbers for this WABA
    const phoneRes = await fetch(`https://graph.facebook.com/v19.0/${wabaId}/phone_numbers?access_token=${activeToken}`);
    const phoneData = await phoneRes.json();

    if (phoneData.error || !phoneData.data || phoneData.data.length === 0) {
      console.error("No Phone Numbers found:", phoneData.error);
      return NextResponse.json({ error: "No Phone Numbers associated with this WABA." }, { status: 400 });
    }

    const phoneNumberId = phoneData.data[0].id;

    return NextResponse.json({ success: true, wabaId, phoneNumberId, accessToken: activeToken });

  } catch (error) {
    console.error("Exchange error:", error);
    return NextResponse.json({ error: "Server error during token exchange" }, { status: 500 });
  }
}

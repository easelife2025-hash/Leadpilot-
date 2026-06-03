import { NextRequest, NextResponse } from 'next/server';

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

    // Handle messages here later

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error handling webhook POST:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

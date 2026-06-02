import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL('/dashboard/settings?error=missing_code', req.url));
  }

  // In a production environment, you would:
  // 1. Exchange 'code' for a system user access token using the Facebook Graph API
  // 2. Fetch the WhatsApp Business Account ID and Phone Number ID
  // 3. Store these tokens securely in your database associated with the user
  // 4. Register the Webhook programmatically

  // Mock completion for the preview environments
  console.log(`[Meta Auth Callback] Received auth code: ${code}. Tokens would be provisioned here.`);
  
  return NextResponse.redirect(new URL('/dashboard/settings?success=true', req.url));
}

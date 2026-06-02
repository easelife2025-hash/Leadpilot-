import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // In a real application, read from environment variables
  const clientId = process.env.NEXT_PUBLIC_META_APP_ID || "dummy";
  
  const redirectUri = `${req.nextUrl.origin}/api/whatsapp/callback`;
  const configId = process.env.META_CONFIG_ID || "dummy";

  if (clientId === "dummy") {
      // Simulate successful redirect from Meta for local testing visually
      return NextResponse.redirect(new URL(`/api/whatsapp/callback?code=mock_oauth_code_from_meta_preview`, req.url));
  }

  // Meta Standard OAuth or Embedded Signup URL constructor
  const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&config_id=${configId}&override_custom_parameters=${encodeURIComponent(JSON.stringify({setup:{}}))}`;
  
  return NextResponse.redirect(authUrl);
}

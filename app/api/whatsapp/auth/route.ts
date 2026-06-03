import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // In a real application, you would redirect to Facebook's OAuth URL here using your META_APP_ID.
  // Example: https://www.facebook.com/v19.0/dialog/oauth?client_id=YOUR_ID&redirect_uri=...

  // For this setup, we will simulate a successful connection 
  // and redirect you back to the onboarding flow!
  const searchParams = req.nextUrl.searchParams;
  const redirectParam = searchParams.get('redirect') || '/onboarding?step=3';
  
  // Create an absolute URL for the redirect to work properly
  const url = new URL(redirectParam, req.url);
  
  return NextResponse.redirect(url);
}

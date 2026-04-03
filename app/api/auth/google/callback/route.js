import { NextResponse } from 'next/server';
import { handleOAuthUser } from '@/lib/oauth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error || !code) {
      return NextResponse.redirect(new URL('/login?error=google_denied', request.url));
    }

    const origin = new URL(request.url).origin;

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${origin}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenRes.json();

    if (!tokens.access_token) {
      console.error('Google token exchange failed:', tokens);
      return NextResponse.redirect(new URL('/login?error=google_failed', request.url));
    }

    // Fetch user profile
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const profile = await profileRes.json();

    if (!profile.email) {
      return NextResponse.redirect(new URL('/login?error=google_no_email', request.url));
    }

    // Find or create user, get JWT token
    const { token } = await handleOAuthUser({
      email: profile.email,
      name: profile.name || profile.email.split('@')[0],
      avatar: profile.picture || null,
      provider: 'google',
      providerId: profile.id,
    });

    const redirectTo = searchParams.get('state') || '/';
    const response = NextResponse.redirect(new URL(redirectTo, request.url));
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 604800,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return response;
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(new URL('/login?error=google_error', request.url));
  }
}

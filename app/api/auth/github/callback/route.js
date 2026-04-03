import { NextResponse } from 'next/server';
import { handleOAuthUser } from '@/lib/oauth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error || !code) {
      return NextResponse.redirect(new URL('/login?error=github_denied', request.url));
    }

    const origin = new URL(request.url).origin;

    // Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${origin}/api/auth/github/callback`,
      }),
    });

    const tokens = await tokenRes.json();

    if (!tokens.access_token) {
      console.error('GitHub token exchange failed:', tokens);
      return NextResponse.redirect(new URL('/login?error=github_failed', request.url));
    }

    // Fetch user profile
    const profileRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const profile = await profileRes.json();

    // GitHub may not expose email publicly — fetch from emails API
    let email = profile.email;
    if (!email) {
      const emailsRes = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      const emails = await emailsRes.json();
      const primary = emails.find((e) => e.primary && e.verified);
      email = primary?.email || emails[0]?.email;
    }

    if (!email) {
      return NextResponse.redirect(new URL('/login?error=github_no_email', request.url));
    }

    // Find or create user, get JWT token
    const { token } = await handleOAuthUser({
      email,
      name: profile.name || profile.login,
      avatar: profile.avatar_url || null,
      provider: 'github',
      providerId: String(profile.id),
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
    console.error('GitHub OAuth error:', error);
    return NextResponse.redirect(new URL('/login?error=github_error', request.url));
  }
}

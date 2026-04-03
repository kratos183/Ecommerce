import { NextResponse } from 'next/server';

export async function GET(request) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/github/callback`;

  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get('redirect') || '/';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'read:user user:email',
    state: redirectTo,
  });

  return NextResponse.redirect(`https://github.com/login/oauth/authorize?${params}`);
}

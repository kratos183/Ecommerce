export async function POST(request) {
  const isProd = process.env.NODE_ENV === 'production';
  const response = Response.json({ message: 'Logout successful' });
  response.headers.set('Set-Cookie', `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${isProd ? '; Secure' : ''}`);
  return response;
}

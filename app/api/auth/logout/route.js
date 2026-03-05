export async function POST(request) {
  const response = Response.json({ message: 'Logout successful' });
  response.headers.set('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict');
  return response;
}

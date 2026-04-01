import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyPassword, generateToken } from '@/lib/auth';
import { validateEmail, validateRequired, sanitizeInput } from '@/lib/validations';

export async function POST(request) {
  try {
    const body = await request.json();
    const email = sanitizeInput(body.email);
    const password = body.password;

    if (!validateRequired({ email, password })) {
      return Response.json({ error: 'All fields required' }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return Response.json({ error: 'Invalid email' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // OAuth user trying to log in with password
    if (!user.password && user.provider !== 'local') {
      return Response.json({ 
        error: `This account uses ${user.provider === 'google' ? 'Google' : 'GitHub'} sign-in. Please use the ${user.provider === 'google' ? 'Google' : 'GitHub'} button.` 
      }, { status: 400 });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await generateToken({
      userId: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
    });

    const isProd = process.env.NODE_ENV === 'production';
    const cookieFlags = `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax${isProd ? '; Secure' : ''}`;

    const response = Response.json({ 
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

    response.headers.set('Set-Cookie', cookieFlags);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ error: 'Login failed' }, { status: 500 });
  }
}


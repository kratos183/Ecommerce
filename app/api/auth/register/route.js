import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword, generateToken } from '@/lib/auth';
import { validateEmail, validatePassword, validateRequired, sanitizeInput } from '@/lib/validations';

export async function POST(request) {
  try {
    const body = await request.json();
    const name = sanitizeInput(body.name);
    const email = sanitizeInput(body.email);
    const password = body.password;

    if (!validateRequired({ name, email, password })) {
      return Response.json({ error: 'All fields required' }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return Response.json({ error: 'Invalid email' }, { status: 400 });
    }

    if (!validatePassword(password)) {
      return Response.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    await connectDB();

    const exists = await User.findOne({ email });
    if (exists) {
      return Response.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = generateToken({ userId: user._id, role: user.role });

    const response = Response.json({ 
      message: 'Registration successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    }, { status: 201 });

    response.headers.set('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`);

    return response;
  } catch (error) {
    return Response.json({ error: 'Registration failed' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
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
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    if (!validatePassword(password)) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    await connectDB();

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = await generateToken({
      userId: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
    });

    const response = NextResponse.json({ 
      message: 'Registration successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    }, { status: 201 });

    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 604800,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed', details: error.message }, { status: 500 });
  }
}

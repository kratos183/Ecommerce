import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();
    const hashedPassword = await hashPassword('admin123');
    const admin = await User.create({ 
      name: 'Admin User', 
      email: 'admin@test.com', 
      password: hashedPassword,
      role: 'admin'
    });
    return Response.json({ message: 'Admin created', email: 'admin@test.com', password: 'admin123' });
  } catch (error) {
    return Response.json({ error: 'Failed to create admin' }, { status: 500 });
  }
}

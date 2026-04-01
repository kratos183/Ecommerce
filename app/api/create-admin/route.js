import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword, getAuthUser } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();

    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      // If admins exist, only allow other admins to create new ones
      const currentUser = await getAuthUser();
      if (!currentUser || currentUser.role !== 'admin') {
        return Response.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Prevent duplicate
    const exists = await User.findOne({ email: 'admin@test.com' });
    if (exists) {
      return Response.json({ error: 'Admin already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword('admin123');
    const admin = await User.create({ 
      name: 'Admin User', 
      email: 'admin@test.com', 
      password: hashedPassword,
      role: 'admin'
    });
    return Response.json({ message: 'Admin created', email: 'admin@test.com', password: 'admin123' });
  } catch (error) {
    console.error('Create admin error:', error);
    return Response.json({ error: 'Failed to create admin' }, { status: 500 });
  }
}

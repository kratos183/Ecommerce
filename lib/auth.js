import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { generateToken, verifyToken } from './jwt';

// Re-export JWT functions so existing imports still work
export { generateToken, verifyToken };

export const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

export const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const getAuthUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  return await verifyToken(token);
};

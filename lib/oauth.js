import connectDB from './db';
import User from '@/models/User';
import { generateToken } from './jwt';

/**
 * Find or create a user from OAuth profile, generate JWT, return cookie header.
 */
export async function handleOAuthUser({ email, name, avatar, provider, providerId }) {
  await connectDB();

  let user = await User.findOne({ email });

  if (user) {
    // Existing user — update OAuth fields if not already set
    if (!user.provider || user.provider === 'local') {
      user.provider = provider;
      user.providerId = providerId;
      if (avatar && !user.avatar) user.avatar = avatar;
      await user.save();
    }
  } else {
    // New user — create without password
    user = await User.create({
      name,
      email,
      provider,
      providerId,
      avatar,
      role: 'user',
    });
  }

  const token = await generateToken({
    userId: user._id,
    role: user.role,
    name: user.name,
    email: user.email,
  });

  const isProd = process.env.NODE_ENV === 'production';
  const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax${isProd ? '; Secure' : ''}`;

  return { user, token, cookie };
}

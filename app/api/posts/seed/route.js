import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';

export async function POST() {
  try {
    await connectDB();

    const existingPosts = await Post.countDocuments();
    if (existingPosts >= 100) {
      return NextResponse.json({ message: 'Posts already seeded' });
    }

    const posts = [];
    for (let i = 1; i <= 120; i++) {
      posts.push({
        title: `Blog Post ${i}`,
        content: `This is the content for blog post number ${i}. It contains interesting information about various topics.`,
      });
    }

    await Post.insertMany(posts);

    return NextResponse.json({ message: '120 posts created successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to seed posts' }, { status: 500 });
  }
}

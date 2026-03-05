import connectDB from '@/lib/db';
import Post from '@/models/Post';
import Link from 'next/link';

const POSTS_PER_PAGE = 10;

export default async function BlogPage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params.page) || 1;

  if (page < 1) {
    return (
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif' }}>Invalid Page</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Page number must be positive.</p>
        <Link href="/blog?page=1" style={{ color: 'var(--accent)', marginTop: 16, display: 'inline-block' }}>Go to page 1</Link>
      </div>
    );
  }

  await connectDB();

  const totalPosts = await Post.countDocuments();
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  if (page > totalPages && totalPages > 0) {
    return (
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif' }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>This page does not exist.</p>
        <Link href={`/blog?page=${totalPages}`} style={{ color: 'var(--accent)', marginTop: 16, display: 'inline-block' }}>Go to last page</Link>
      </div>
    );
  }

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * POSTS_PER_PAGE)
    .limit(POSTS_PER_PAGE)
    .lean();

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>

      <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 32, color: 'var(--text-primary)', marginBottom: 8 }}>Blog Posts</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>Total Posts: {totalPosts}</p>

      <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {posts.map((post) => (
          <div
            key={post._id.toString()}
            style={{
              padding: '20px 24px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 16,
            }}
          >
            <h2 style={{ color: 'var(--text-primary)', fontSize: 18, fontWeight: 700, fontFamily: 'Syne, sans-serif', marginBottom: 8 }}>{post.title}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>{post.content}</p>
            <small style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 10, display: 'block' }}>
              Posted: {new Date(post.createdAt).toLocaleDateString()}
            </small>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: '36px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        {page > 1 && (
          <Link
            href={`/blog?page=${page - 1}`}
            style={{
              padding: '8px 16px',
              border: '1px solid var(--border-card)',
              borderRadius: 10,
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontFamily: 'Syne, sans-serif',
              fontSize: 13,
              fontWeight: 700,
              background: 'var(--bg-input)',
            }}
          >
            ← Previous
          </Link>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <Link
            key={pageNum}
            href={`/blog?page=${pageNum}`}
            style={{
              padding: '8px 14px',
              border: pageNum === page ? 'none' : '1px solid var(--border-card)',
              borderRadius: 10,
              background: pageNum === page ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'var(--bg-input)',
              color: pageNum === page ? '#fff' : 'var(--text-secondary)',
              textDecoration: 'none',
              fontFamily: 'Syne, sans-serif',
              fontSize: 13,
              fontWeight: 700,
              boxShadow: pageNum === page ? '0 4px 12px rgba(99,102,241,0.35)' : 'none',
            }}
          >
            {pageNum}
          </Link>
        ))}

        {page < totalPages && (
          <Link
            href={`/blog?page=${page + 1}`}
            style={{
              padding: '8px 16px',
              border: '1px solid var(--border-card)',
              borderRadius: 10,
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontFamily: 'Syne, sans-serif',
              fontSize: 13,
              fontWeight: 700,
              background: 'var(--bg-input)',
            }}
          >
            Next →
          </Link>
        )}
      </div>

      <div style={{ marginTop: '32px' }}>
        <Link
          href="/dashboard"
          style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: 'Syne, sans-serif' }}
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

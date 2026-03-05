'use client';

import { useRouter } from 'next/navigation';
import { useT } from '../themeTokens';

export default function DashboardPage() {
  const t = useT();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', background: t.bgPage, minHeight: '100vh', transition: 'background 0.35s, color 0.35s' }}>
      <h1 style={{ color: t.textPrimary, fontSize: 28, fontWeight: 900, fontFamily: 'Syne,sans-serif', marginBottom: 8, transition: 'color 0.35s' }}>Dashboard</h1>
      <p style={{ color: t.textSecondary, fontSize: 14, marginBottom: 24, transition: 'color 0.35s' }}>Welcome to your dashboard. You are logged in!</p>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <a href="/blog" style={{ color: t.textLink, fontSize: 14, fontWeight: 600, transition: 'color 0.35s' }}>View Blog</a>
        <a href="/admin" style={{ color: t.textLink, fontSize: 14, fontWeight: 600, transition: 'color 0.35s' }}>Admin Panel</a>
        <button onClick={handleLogout} style={{
          padding: '8px 16px', cursor: 'pointer',
          background: t.bgInput, border: `1px solid ${t.borderInput}`,
          color: t.textSecondary, borderRadius: 10, fontSize: 13, fontWeight: 600,
          transition: 'background 0.35s, border-color 0.35s, color 0.35s',
        }}>
          Logout
        </button>
      </div>
    </div>
  );
}

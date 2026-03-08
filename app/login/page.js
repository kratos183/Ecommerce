'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useT } from '../themeTokens';

export default function LoginPage() {
  const router = useRouter();
  const t = useT();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setToast({ message: 'Login successful!', type: 'success' });
        setTimeout(() => window.location.href = '/', 1000);
      } else {
        setToast({ message: data.error || 'Login failed', type: 'error' });
      }
    } catch {
      setToast({ message: 'Login failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: t.bgPage,
        padding: '48px 16px',
        transition: 'background 0.35s ease',
      }}>
        <div style={{ maxWidth: 440, width: '100%' }}>
          {/* Card */}
          <div style={{
            background: t.bgCard,
            border: `1px solid ${t.borderCard}`,
            borderRadius: 24,
            padding: '48px 40px',
            boxShadow: `0 20px 40px rgba(0,0,0,0.15)`,
            transition: 'background 0.35s ease, border-color 0.35s ease',
          }}>
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <Link href="/" style={{
                fontFamily: 'sans-serif',
                fontWeight: 900,
                fontSize: 24,
                color: t.textPrimary,
                textDecoration: 'none',
                letterSpacing: '-0.02em',
              }}>
                <span style={{ color: '#6366F1' }}>Tech</span>Store
              </Link>
            </div>
            <h2 style={{
              fontSize: 28,
              fontWeight: 900,
              color: t.textPrimary,
              textAlign: 'center',
              marginBottom: 8,
              fontFamily: 'sans-serif',
              letterSpacing: '-0.02em',
              transition: 'color 0.35s ease',
            }}>Welcome Back</h2>
            <p style={{
              color: t.textFaint,
              fontSize: 14,
              textAlign: 'center',
              marginBottom: 36,
              transition: 'color 0.35s ease',
            }}>Sign in to your TechStore account</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 700,
                  color: t.textSecondary,
                  marginBottom: 8,
                  fontFamily: 'sans-serif',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  transition: 'color 0.35s ease',
                }}>Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: t.bgInput,
                    border: `1px solid ${t.borderInput}`,
                    borderRadius: 12,
                    color: t.textPrimary,
                    fontSize: 14,
                    outline: 'none',
                    fontFamily: 'sans-serif',
                    transition: 'border-color 0.2s, box-shadow 0.2s, background 0.35s, color 0.35s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = t.borderInput; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 700,
                  color: t.textSecondary,
                  marginBottom: 8,
                  fontFamily: 'sans-serif',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  transition: 'color 0.35s ease',
                }}>Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: t.bgInput,
                    border: `1px solid ${t.borderInput}`,
                    borderRadius: 12,
                    color: t.textPrimary,
                    fontSize: 14,
                    outline: 'none',
                    fontFamily: 'sans-serif',
                    transition: 'border-color 0.2s, box-shadow 0.2s, background 0.35s, color 0.35s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = t.borderInput; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  color: '#fff',
                  padding: '15px',
                  borderRadius: 12,
                  border: 'none',
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'sans-serif',
                  boxShadow: loading ? 'none' : '0 8px 24px rgba(99,102,241,0.35)',
                  transition: 'opacity 0.2s, transform 0.15s',
                  marginTop: 8,
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            <p style={{
              marginTop: 28,
              textAlign: 'center',
              fontSize: 14,
              color: t.textFaint,
              transition: 'color 0.35s ease',
            }}>
              Don't have an account?{' '}
              <Link href="/register" style={{
                color: '#6366F1',
                fontWeight: 700,
                textDecoration: 'none',
                fontFamily: 'sans-serif',
              }}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {toast && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          padding: '14px 20px',
          borderRadius: 14,
          background: toast.type === 'error'
            ? 'linear-gradient(135deg, #EF4444, #DC2626)'
            : 'linear-gradient(135deg, #10B981, #059669)',
          color: '#fff',
          fontSize: 14,
          fontWeight: 700,
          fontFamily: 'sans-serif',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          zIndex: 999,
          animation: 'fadeSlideUp 0.3s ease',
        }}>
          {toast.message}
          <button onClick={() => setToast(null)} style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: 6,
            color: '#fff',
            cursor: 'pointer',
            fontSize: 14,
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>×</button>
        </div>
      )}
    </>
  );
}

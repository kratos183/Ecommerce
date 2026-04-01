'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useT } from '../themeTokens';

export default function LoginPage() {
  const router = useRouter();
  const t = useT();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      const messages = {
        google_denied: 'Google sign-in was cancelled',
        google_failed: 'Google sign-in failed. Please try again.',
        google_no_email: 'Could not get email from Google',
        google_error: 'Google sign-in error. Please try again.',
        github_denied: 'GitHub sign-in was cancelled',
        github_failed: 'GitHub sign-in failed. Please try again.',
        github_no_email: 'Could not get email from GitHub. Make sure your email is public.',
        github_error: 'GitHub sign-in error. Please try again.',
      };
      setToast({ message: messages[error] || 'Sign-in failed', type: 'error' });
    }
  }, [searchParams]);

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

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '28px 0 24px' }}>
              <div style={{ flex: 1, height: 1, background: t.borderInput }} />
              <span style={{ color: t.textFaint, fontSize: 12, fontWeight: 600, fontFamily: 'sans-serif' }}>Or continue with</span>
              <div style={{ flex: 1, height: 1, background: t.borderInput }} />
            </div>

            {/* OAuth Buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <a
                href="/api/auth/google"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  padding: '13px 16px',
                  background: t.bgInput,
                  border: `1px solid ${t.borderInput}`,
                  borderRadius: 12,
                  color: t.textPrimary,
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: 'sans-serif',
                  textDecoration: 'none',
                  transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = t.borderInput; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = t.bgInput; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </a>
              <a
                href="/api/auth/github"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  padding: '13px 16px',
                  background: t.bgInput,
                  border: `1px solid ${t.borderInput}`,
                  borderRadius: 12,
                  color: t.textPrimary,
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: 'sans-serif',
                  textDecoration: 'none',
                  transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = t.borderInput; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = t.bgInput; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>

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

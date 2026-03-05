'use client';
import { useState } from 'react';
import { useT } from './themeTokens';
import { useTheme } from './ThemeProvider';

// ─── DATA ─────────────────────────────────────────────────────────────────────
const FOOTER_COLS = [
  {
    heading: 'Shop',
    links: [
      { label: 'All Products', href: '/products' },
      { label: 'Laptops', href: '/products?category=Laptops' },
      { label: 'Mobiles', href: '/products?category=Mobiles' },
      { label: 'Audio & Headphones', href: '/products?category=Accessories' },
      { label: 'Tablets', href: '/products?category=Tablets' },
      { label: 'Gaming', href: '/products?category=Gaming' },
      { label: 'Smart Home', href: '/products?category=SmartHome' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Track My Order', href: '/track' },
      { label: '24/7 Tech Support', href: '/support' },
      { label: 'Hassle-Free 30-Day Returns', href: '/returns' },
      { label: 'Manufacturer Warranty', href: '/warranty' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Spare Parts & Repairs', href: '/parts' },
      { label: 'Help Center', href: '/help' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Login', href: '/login' },
      { label: 'Register', href: '/register' },
      { label: 'My Orders', href: '/dashboard/user' },
      { label: 'Cart', href: '/cart' },
      { label: 'Wishlist', href: '/wishlist' },
      { label: 'Compare Devices', href: '/compare' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About TechStore', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'Press & Media', href: '/press' },
      { label: 'Affiliate Program', href: '/affiliates' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

const PAYMENT_ICONS = [
  { label: 'Visa', icon: '💳', color: '#1A1F71' },
  { label: 'Mastercard', icon: '🔴', color: '#EB001B' },
  { label: 'PayPal', icon: '🅿', color: '#003087' },
  { label: 'Apple Pay', icon: '🍎', color: '#000' },
  { label: 'Google Pay', icon: '🟢', color: '#4285F4' },
  { label: 'Klarna', icon: 'K', color: '#FFB3C7' },
  { label: 'Affirm', icon: 'A', color: '#0FA0EA' },
  { label: 'Amex', icon: '💠', color: '#2E77BC' },
];

const SOCIAL = [
  { label: 'Twitter / X', icon: '𝕏', href: '#', color: '#F9FAFB' },
  { label: 'Instagram', icon: '◈', href: '#', color: '#E1306C' },
  { label: 'YouTube', icon: '▶', href: '#', color: '#FF0000' },
  { label: 'TikTok', icon: '♪', href: '#', color: '#69C9D0' },
  { label: 'LinkedIn', icon: 'in', href: '#', color: '#0A66C2' },
];

const TRUST_BADGES = [
  { icon: '🔒', label: 'SSL Secured', sub: '256-bit encryption' },
  { icon: '✓', label: 'Verified Store', sub: 'BBB Accredited' },
  { icon: '🛡️', label: 'Buyer Protection', sub: '100% guaranteed' },
  { icon: '↩️', label: '30-Day Returns', sub: 'No questions asked' },
];

// ─── ACCORDION (mobile) ───────────────────────────────────────────────────────
function AccordionCol({ col }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${t.borderMuted}` }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer',
        color: t.textPrimary, fontWeight: 700, fontSize: 13, fontFamily: 'Syne, sans-serif',
        letterSpacing: '0.04em', textTransform: 'uppercase',
        transition: 'color 0.35s',
      }}>
        {col.heading}
        <span style={{ fontSize: 18, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>⌃</span>
      </button>
      {open && (
        <ul style={{ padding: '0 0 14px', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {col.links.map(l => (
            <li key={l.label}>
              <a href={l.href} style={{ color: t.textFaint, fontSize: 13, textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = t.textPrimary}
                onMouseLeave={e => e.currentTarget.style.color = t.textFaint}
              >{l.label}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── NEWSLETTER ───────────────────────────────────────────────────────────────
function Newsletter() {
  const t = useT();
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | loading | success

  const handleSubmit = () => {
    if (!email.includes('@')) return;
    setState('loading');
    setTimeout(() => setState('success'), 1200);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)',
      border: '1px solid rgba(99,102,241,0.2)',
      borderRadius: 20,
      padding: '36px 40px',
      marginBottom: 60,
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: 40,
      alignItems: 'center',
    }} className="newsletter-grid">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{
            background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.35)',
            color: '#818CF8', fontSize: 10, fontWeight: 800, padding: '3px 10px',
            borderRadius: 20, letterSpacing: '0.1em', textTransform: 'uppercase',
            fontFamily: 'Syne, sans-serif',
          }}>Insider Access</span>
        </div>
        <h3 style={{ color: t.textPrimary, fontSize: 22, fontWeight: 900, fontFamily: 'Syne, sans-serif', marginBottom: 6, transition: 'color 0.35s' }}>
          Get Early Access to Future Drops
        </h3>
        <p style={{ color: t.textFaint, fontSize: 13, lineHeight: 1.6, transition: 'color 0.35s' }}>
          Exclusive tech deals, pre-launch pricing, and member-only restocks — straight to your inbox.
        </p>
      </div>

      <div style={{ minWidth: 320 }}>
        {state === 'success' ? (
          <div style={{
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 14, padding: '16px 24px', textAlign: 'center',
            color: '#10B981', fontSize: 14, fontWeight: 700, fontFamily: 'Syne, sans-serif',
          }}>
            ✓ You're on the list! Welcome to the inner circle.
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="your@email.com"
              style={{
                flex: 1,
                background: t.bgInput,
                border: `1px solid ${t.borderInput}`,
                borderRadius: 12,
                padding: '14px 16px',
                color: t.textPrimary,
                fontSize: 13,
                outline: 'none',
                fontFamily: 'DM Sans, sans-serif',
                transition: 'border-color 0.2s, box-shadow 0.2s, background 0.35s, color 0.35s',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = t.borderInput; e.target.style.boxShadow = 'none'; }}
            />
            <button onClick={handleSubmit} style={{
              background: state === 'loading'
                ? 'rgba(99,102,241,0.4)'
                : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '14px 22px',
              fontWeight: 800,
              fontSize: 13,
              cursor: state === 'loading' ? 'not-allowed' : 'pointer',
              fontFamily: 'Syne, sans-serif',
              whiteSpace: 'nowrap',
              boxShadow: state === 'loading' ? 'none' : '0 4px 16px rgba(99,102,241,0.35)',
              transition: 'opacity 0.2s, transform 0.15s, box-shadow 0.2s',
              animation: state === 'idle' ? 'pulse-glow 2.5s ease-in-out infinite' : 'none',
            }}
              onMouseEnter={e => { if (state === 'idle') { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {state === 'loading' ? '...' : 'Unlock Deals →'}
            </button>
          </div>
        )}
        <p style={{ color: t.textVeryFaint, fontSize: 11, marginTop: 8, transition: 'color 0.35s' }}>No spam. Unsubscribe anytime. 50,000+ subscribers.</p>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
export default function Footer() {
  const t = useT();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer style={{
      background: t.bgPage,
      borderTop: `1px solid ${t.borderNav}`,
      fontFamily: 'DM Sans, sans-serif',
      marginTop: 0,
      transition: 'background 0.35s ease, border-color 0.35s ease',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 4px 16px rgba(99,102,241,0.35); }
          50% { box-shadow: 0 4px 28px rgba(99,102,241,0.65); }
        }

        @media (max-width: 768px) {
          .footer-cols-desktop { display: none !important; }
          .footer-cols-mobile { display: block !important; }
          .newsletter-grid { grid-template-columns: 1fr !important; gap: 20px !important; padding: 28px 24px !important; }
          .footer-top { flex-direction: column !important; gap: 32px !important; }
          .footer-bottom-inner { flex-direction: column !important; gap: 20px !important; align-items: flex-start !important; }
        }
        @media (min-width: 769px) {
          .footer-cols-mobile { display: none !important; }
        }
      `}</style>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px 0' }}>

        {/* Newsletter */}
        <Newsletter />

        {/* Top: Brand + Cols */}
        <div className="footer-top" style={{ display: 'flex', gap: 60, marginBottom: 56 }}>

          {/* Brand column */}
          <div style={{ flexShrink: 0, width: 240 }}>
            <a href="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 22, color: t.textPrimary, textDecoration: 'none', letterSpacing: '-0.02em', display: 'block', marginBottom: 12, transition: 'color 0.35s' }}>
              <span style={{ color: '#6366F1' }}>Tech</span>Store
            </a>
            <p style={{ color: t.textFaint, fontSize: 13, lineHeight: 1.7, marginBottom: 20, transition: 'color 0.35s' }}>
              Your trusted marketplace for premium electronics — certified refurbished, factory fresh, and everything in between.
            </p>

            {/* Contact hub */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              <a href="tel:+18005551234" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                color: '#10B981', fontSize: 13, fontWeight: 600, textDecoration: 'none',
                fontFamily: 'Syne, sans-serif',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = '#34D399'}
                onMouseLeave={e => e.currentTarget.style.color = '#10B981'}
              >
                <span>📞</span> +1 (800) 555-1234
              </a>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                color: t.textFaint, fontSize: 12, textDecoration: 'none',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = t.textSecondary}
                onMouseLeave={e => e.currentTarget.style.color = t.textFaint}
              >
                <span>📍</span> 123 Tech Ave, San Francisco, CA
              </a>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 8,
                color: '#6366F1', fontSize: 12, fontWeight: 600,
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 0, fontFamily: 'Syne, sans-serif',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = '#818CF8'}
                onMouseLeave={e => e.currentTarget.style.color = '#6366F1'}
              >
                <span style={{ width: 8, height: 8, background: '#10B981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 6px #10B981' }} />
                Live Chat — Avg. 2 min response
              </button>
            </div>

            {/* Socials */}
            <div style={{ display: 'flex', gap: 8 }}>
              {SOCIAL.map(s => (
                <a key={s.label} href={s.href} title={s.label} style={{
                  width: 40, height: 40,
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 800,
                  textDecoration: 'none',
                  background: t.bgSubtle,
                  border: `1px solid ${t.borderSubtle}`,
                  color: t.textSecondary,
                  transition: 'background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.15s, border-color 0.2s',
                  fontFamily: 'Syne, sans-serif',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = s.color + '22';
                    e.currentTarget.style.borderColor = s.color + '55';
                    e.currentTarget.style.color = s.color;
                    e.currentTarget.style.boxShadow = `0 8px 20px ${s.color}33`;
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = t.bgSubtle;
                    e.currentTarget.style.borderColor = t.borderSubtle;
                    e.currentTarget.style.color = t.textSecondary;
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Desktop link columns */}
          <div className="footer-cols-desktop" style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {FOOTER_COLS.map(col => (
              <div key={col.heading}>
                <h4 style={{ color: t.textPrimary, fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16, fontFamily: 'Syne, sans-serif', transition: 'color 0.35s' }}>
                  {col.heading}
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {col.links.map(l => (
                    <li key={l.label}>
                      <a href={l.href} style={{
                        color: t.textFaint,
                        fontSize: 13,
                        textDecoration: 'none',
                        transition: 'color 0.15s',
                        lineHeight: 1.8,
                        display: 'block',
                      }}
                        onMouseEnter={e => e.currentTarget.style.color = t.textPrimary}
                        onMouseLeave={e => e.currentTarget.style.color = t.textFaint}
                      >{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile accordion columns */}
          <div className="footer-cols-mobile" style={{ flex: 1 }}>
            {FOOTER_COLS.map(col => <AccordionCol key={col.heading} col={col} />)}
          </div>
        </div>

        {/* Trust badges */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 10,
          marginBottom: 32,
          paddingTop: 32,
          borderTop: `1px solid ${t.borderNav}`,
        }}>
          {TRUST_BADGES.map(b => (
            <div key={b.label} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px',
              background: t.bgSubtle,
              border: `1px solid ${t.borderSubtle}`,
              borderRadius: 12,
              transition: 'background 0.2s, border-color 0.2s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = t.bgHover;
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = t.bgSubtle;
                e.currentTarget.style.borderColor = t.borderSubtle;
              }}
            >
              <span style={{ fontSize: 20 }}>{b.icon}</span>
              <div>
                <p style={{ color: t.textPrimary, fontSize: 12, fontWeight: 700, margin: 0, fontFamily: 'Syne, sans-serif', transition: 'color 0.35s' }}>{b.label}</p>
                <p style={{ color: t.textFaint, fontSize: 11, margin: 0, transition: 'color 0.35s' }}>{b.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ color: t.textVeryFaint, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10, fontFamily: 'Syne, sans-serif', transition: 'color 0.35s' }}>
            Secure Payments
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {PAYMENT_ICONS.map(p => (
              <div key={p.label} title={p.label} style={{
                background: t.bgSubtle,
                border: `1px solid ${t.borderSubtle}`,
                borderRadius: 8,
                padding: '6px 10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
                color: t.textFaint,
                fontFamily: 'Syne, sans-serif',
                transition: 'background 0.15s, border-color 0.15s, color 0.15s',
                minWidth: 52,
                height: 34,
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = t.bgHover;
                  e.currentTarget.style.borderColor = t.borderCard;
                  e.currentTarget.style.color = t.textPrimary;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = t.bgSubtle;
                  e.currentTarget.style.borderColor = t.borderSubtle;
                  e.currentTarget.style.color = t.textFaint;
                }}
              >
                <span style={{ marginRight: 4 }}>{p.icon}</span>
                {p.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ──────────────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${t.borderNav}`, padding: '20px 32px', transition: 'border-color 0.35s' }}>
        <div className="footer-bottom-inner" style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ color: t.textVeryFaint, fontSize: 12, transition: 'color 0.35s' }}>
            © 2025 TechStore, Inc. All rights reserved. Built with Next.js
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings', 'Sitemap'].map(l => (
              <a key={l} href={`/${l.toLowerCase().replace(/ /g, '-')}`} style={{
                color: t.textVeryFaint, fontSize: 12, textDecoration: 'none', transition: 'color 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = t.textSecondary}
                onMouseLeave={e => e.currentTarget.style.color = t.textVeryFaint}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
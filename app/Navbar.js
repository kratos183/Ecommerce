'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from './ThemeProvider';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  {
    label: 'Products',
    href: '/products',
    mega: true,
    categories: [
      {
        name: 'Laptops',
        icon: '💻',
        color: '#00D4FF',
        items: ['Gaming Laptops', 'Ultrabooks', 'MacBooks', 'Workstations'],
        badge: 'New Arrivals',
      },
      {
        name: 'Mobiles',
        icon: '📱',
        color: '#FF6B35',
        items: ['Flagship Phones', 'Mid-Range', 'Foldables', 'Accessories'],
        badge: 'Hot',
      },
      {
        name: 'Audio',
        icon: '🎧',
        color: '#A855F7',
        items: ['Headphones', 'Earbuds', 'Speakers', 'DACs & Amps'],
        badge: null,
      },
      {
        name: 'Tablets',
        icon: '📟',
        color: '#10B981',
        items: ['iPad Series', 'Android Tabs', 'Drawing Tablets', 'Kids Tablets'],
        badge: null,
      },
      {
        name: 'Gaming',
        icon: '🎮',
        color: '#F59E0B',
        items: ['Controllers', 'Monitors', 'Keyboards', 'Gaming Chairs'],
        badge: '🔥 Trending',
      },
      {
        name: 'Smart Home',
        icon: '🏠',
        color: '#EC4899',
        items: ['Smart Displays', 'Security Cams', 'Smart Lighting', 'Hubs'],
        badge: null,
      },
    ],
    featured: {
      title: 'Tech Finder Quiz',
      sub: 'Not sure what to buy? Answer 3 quick questions.',
      cta: 'Find My Device →',
      href: '/quiz',
      color: '#6366F1',
    },
  },
  { label: 'Deals', href: '/products?sale=true', mega: false },
  { label: 'Trade-In', href: '/trade-in', mega: false },
  { label: 'Support', href: '/support', mega: false },
];

const MOCK_SEARCH_RESULTS = [
  { name: 'MacBook Pro 16" M3 Max', price: '$2,499', category: 'Laptops', icon: '💻' },
  { name: 'iPhone 15 Pro Max 256GB', price: '$1,199', category: 'Mobiles', icon: '📱' },
  { name: 'Sony WH-1000XM5', price: '$349', category: 'Audio', icon: '🎧' },
  { name: 'Samsung Galaxy S24 Ultra', price: '$1,099', category: 'Mobiles', icon: '📱' },
  { name: 'iPad Pro 12.9" M2', price: '$1,099', category: 'Tablets', icon: '📟' },
  { name: 'ASUS ROG Swift 27" 360Hz', price: '$599', category: 'Gaming', icon: '🖥️' },
  { name: 'Dell XPS 15 OLED', price: '$1,799', category: 'Laptops', icon: '💻' },
  { name: 'AirPods Pro 2nd Gen', price: '$249', category: 'Audio', icon: '🎧' },
];

// ─── THEME TOGGLE BUTTON ──────────────────────────────────────────────────────
function ThemeToggleBtn({ compact = false }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      onClick={toggle}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: compact ? 8 : 0,
        background: isDark
          ? 'rgba(255,255,255,0.07)'
          : 'rgba(99,102,241,0.1)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(99,102,241,0.3)'}`,
        borderRadius: compact ? 12 : 20,
        padding: compact ? '10px 14px' : '5px',
        cursor: 'pointer',
        width: compact ? 'auto' : 68,
        height: compact ? 'auto' : 32,
        transition: 'background 0.3s, border-color 0.3s',
        flexShrink: 0,
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = isDark
          ? 'rgba(255,255,255,0.13)'
          : 'rgba(99,102,241,0.18)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = isDark
          ? 'rgba(255,255,255,0.07)'
          : 'rgba(99,102,241,0.1)';
      }}
    >
      {compact ? (
        // Mobile: show label + icon
        <>
          <span style={{ fontSize: 16 }}>{isDark ? '☀️' : '🌙'}</span>
          <span style={{
            color: isDark ? '#CBD5E1' : '#4338CA',
            fontSize: 13, fontWeight: 600, fontFamily: 'Syne, sans-serif',
          }}>
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </span>
        </>
      ) : (
        // Desktop: animated pill toggle
        <>
          {/* Track */}
          <span style={{
            position: 'absolute',
            left: 4, top: 4, bottom: 4,
            width: 24,
            borderRadius: 16,
            background: isDark ? '#334155' : '#6366F1',
            transform: isDark ? 'translateX(0)' : 'translateX(32px)',
            transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11,
          }}
          >
            {isDark ? '🌙' : '☀️'}
          </span>
          {/* Labels */}
          <span style={{
            position: 'absolute', left: 8,
            fontSize: 9, fontWeight: 800, color: isDark ? '#64748B' : '#F9FAFB',
            fontFamily: 'Syne, sans-serif', letterSpacing: '0.05em',
            transition: 'color 0.3s', userSelect: 'none',
            opacity: isDark ? 0.5 : 1,
          }}>☀</span>
          <span style={{
            position: 'absolute', right: 8,
            fontSize: 9, fontWeight: 800, color: isDark ? '#F9FAFB' : '#64748B',
            fontFamily: 'Syne, sans-serif', letterSpacing: '0.05em',
            transition: 'color 0.3s', userSelect: 'none',
            opacity: isDark ? 1 : 0.5,
          }}>🌙</span>
        </>
      )}
    </button>
  );
}

// ─── SEARCH BAR ───────────────────────────────────────────────────────────────
function SearchBar({ compact = false, onClose, isDark = true }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  const bgInput = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.06)';
  const borderDefault = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.15)';
  const textColor = isDark ? '#F9FAFB' : '#1E1B4B';
  const dropBg = isDark ? '#111827' : '#FFFFFF';
  const dropBorder = isDark ? '#1F2937' : '#E0E7FF';
  const dropHover = isDark ? '#1F2937' : '#EEF2FF';
  const subText = isDark ? '#6B7280' : '#6B7280';
  const iconBg = isDark ? '#1F2937' : '#EEF2FF';

  useEffect(() => {
    if (compact && inputRef.current) inputRef.current.focus();
  }, [compact]);

  const handleChange = (val) => {
    setQuery(val);
    if (val.trim().length > 1) {
      const filtered = MOCK_SEARCH_RESULTS.filter(r =>
        r.name.toLowerCase().includes(val.toLowerCase()) ||
        r.category.toLowerCase().includes(val.toLowerCase())
      );
      setResults(filtered.slice(0, 5));
    } else {
      setResults([]);
    }
  };

  const showDropdown = focused && (results.length > 0 || query.length > 1);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: bgInput,
        border: `1px solid ${focused ? 'rgba(99,102,241,0.6)' : borderDefault}`,
        borderRadius: 12,
        padding: '0 14px',
        gap: 10,
        transition: 'border-color 0.2s, box-shadow 0.2s, background 0.35s',
        boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none',
        width: compact ? '100%' : 280,
      }}>
        <span style={{ fontSize: 14, opacity: 0.6 }}>🔍</span>
        <input
          ref={inputRef}
          value={query}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              router.push(`/products?q=${encodeURIComponent(query.trim())}`);
              setQuery('');
              setResults([]);
              if (onClose) onClose();
              e.currentTarget.blur();
            }
          }}
          placeholder={compact ? 'Search products, models, specs…' : 'Search…'}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: textColor,
            fontSize: 13,
            padding: '10px 0',
            width: '100%',
            fontFamily: 'DM Sans, sans-serif',
            transition: 'color 0.35s',
          }}
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); }}
            style={{ background: 'none', border: 'none', color: subText, cursor: 'pointer', fontSize: 16, padding: 0 }}>×</button>
        )}
        <button title="Voice search" style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 14, opacity: 0.5, padding: 0, transition: 'opacity 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
        >🎙️</button>
      </div>

      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 200,
          background: dropBg,
          border: `1px solid ${dropBorder}`,
          borderRadius: 14,
          marginTop: 6,
          overflow: 'hidden',
          boxShadow: isDark ? '0 24px 48px rgba(0,0,0,0.5)' : '0 24px 48px rgba(99,102,241,0.12)',
          minWidth: 340,
        }}>
          {results.length > 0 ? (
            <>
              <div style={{ padding: '8px 14px 4px', borderBottom: `1px solid ${dropBorder}` }}>
                <span style={{ color: subText, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Syne, sans-serif' }}>
                  Top Results
                </span>
              </div>
              {results.map((r, i) => (
                <Link key={i} href={`/products?q=${encodeURIComponent(r.name)}`}
                  onClick={() => { setQuery(''); setResults([]); if (onClose) onClose(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    transition: 'background 0.15s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = dropHover}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: 36, height: 36,
                    background: iconBg,
                    borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, flexShrink: 0,
                  }}>{r.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: textColor, fontSize: 13, fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Syne, sans-serif' }}>{r.name}</p>
                    <p style={{ color: subText, fontSize: 11, margin: 0 }}>{r.category}</p>
                  </div>
                  <span style={{ color: '#10B981', fontSize: 13, fontWeight: 700, fontFamily: 'Syne, sans-serif', flexShrink: 0 }}>{r.price}</span>
                </Link>
              ))}
              <div style={{ padding: '10px 14px', borderTop: `1px solid ${dropBorder}` }}>
                <Link href={`/products?q=${encodeURIComponent(query)}`}
                  style={{ color: '#6366F1', fontSize: 12, fontWeight: 700, fontFamily: 'Syne, sans-serif', textDecoration: 'none' }}>
                  View all results for "{query}" →
                </Link>
              </div>
            </>
          ) : (
            <div style={{ padding: '20px 14px', color: subText, fontSize: 13, textAlign: 'center' }}>
              No results for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MEGA MENU ────────────────────────────────────────────────────────────────
function MegaMenu({ navItem, onClose, isDark = true }) {
  const megaBg = isDark ? '#0F172A' : '#FFFFFF';
  const megaBorder = isDark ? '#1E293B' : '#E0E7FF';
  const megaShadow = isDark ? '0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)' : '0 32px 64px rgba(99,102,241,0.12), 0 0 0 1px rgba(99,102,241,0.08)';
  const catText = isDark ? '#F9FAFB' : '#1E1B4B';
  const subText = isDark ? '#64748B' : '#6B7280';
  const featText = isDark ? '#94A3B8' : '#6B7280';

  return (
    <div style={{
      position: 'absolute',
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 100,
      width: 780,
      background: megaBg,
      border: `1px solid ${megaBorder}`,
      borderRadius: 20,
      boxShadow: megaShadow,
      padding: 24,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr) 220px',
      gap: 0,
      marginTop: 8,
      animation: 'megaIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
      transition: 'background 0.35s, border-color 0.35s',
    }}>
      <style>{`
        @keyframes megaIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* Category grid */}
      <div style={{ gridColumn: '1 / 4', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, paddingRight: 20, borderRight: `1px solid ${megaBorder}` }}>
        {navItem.categories.map(cat => (
          <Link key={cat.name} href={`/products?category=${cat.name}`} onClick={onClose}
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              transition: 'background 0.15s',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              position: 'relative',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `${cat.color}12`;
              e.currentTarget.querySelector('.cat-icon').style.boxShadow = `0 0 16px ${cat.color}44`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.querySelector('.cat-icon').style.boxShadow = 'none';
            }}
          >
            <div className="cat-icon" style={{
              width: 40, height: 40,
              background: `${cat.color}18`,
              border: `1px solid ${cat.color}33`,
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, flexShrink: 0,
              transition: 'box-shadow 0.2s',
            }}>{cat.icon}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ color: catText, fontSize: 13, fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>{cat.name}</span>
                {cat.badge && (
                  <span style={{
                    background: cat.color + '22',
                    color: cat.color,
                    fontSize: 9,
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 4,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    fontFamily: 'Syne, sans-serif',
                  }}>{cat.badge}</span>
                )}
              </div>
              {cat.items.slice(0, 2).map(item => (
                <p key={item} style={{ color: subText, fontSize: 11, margin: '1px 0' }}>{item}</p>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Featured / CTA panel */}
      <div style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          background: `linear-gradient(135deg, ${navItem.featured.color}22, ${navItem.featured.color}08)`,
          border: `1px solid ${navItem.featured.color}33`,
          borderRadius: 14,
          padding: 20,
        }}>
          <span style={{ fontSize: 28 }}>🔬</span>
          <h4 style={{ color: catText, fontSize: 14, fontWeight: 800, marginTop: 10, marginBottom: 6, fontFamily: 'Syne, sans-serif' }}>
            {navItem.featured.title}
          </h4>
          <p style={{ color: featText, fontSize: 12, lineHeight: 1.5, marginBottom: 16 }}>
            {navItem.featured.sub}
          </p>
          <Link href={navItem.featured.href} onClick={onClose} style={{
            display: 'inline-block',
            background: navItem.featured.color,
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            padding: '8px 16px',
            borderRadius: 8,
            textDecoration: 'none',
            fontFamily: 'Syne, sans-serif',
          }}>{navItem.featured.cta}</Link>
        </div>

        <div style={{ marginTop: 12 }}>
          <Link href="/products?sale=true" onClick={onClose} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 14px',
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: 10,
            textDecoration: 'none',
          }}>
            <span>⚡</span>
            <div>
              <p style={{ color: '#F59E0B', fontSize: 12, fontWeight: 700, margin: 0, fontFamily: 'Syne, sans-serif' }}>Today's Deals</p>
              <p style={{ color: '#78716C', fontSize: 11, margin: 0 }}>Up to 40% off</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN NAVBAR ──────────────────────────────────────────────────────────────
export default function Navbar({ user }) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount] = useState(3);
  const megaRef = useRef(null);
  const megaTimeout = useRef(null);

  // Theme-aware colors
  const navBg = isDark
    ? (scrolled ? 'rgba(9,9,20,0.92)' : 'rgba(9,9,20,0.98)')
    : (scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.98)');
  const navBorder = isDark
    ? (scrolled ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.08)')
    : (scrolled ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.15)');
  const logoColor = isDark ? '#F9FAFB' : '#1E1B4B';
  const linkColor = isDark ? '#CBD5E1' : '#4B5563';
  const linkActive = isDark ? '#818CF8' : '#6366F1';
  const iconBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.08)';
  const iconBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.2)';
  const iconColor = isDark ? '#9CA3AF' : '#6366F1';
  const mobileBg = isDark ? '#0A0F1E' : '#FFFFFF';
  const mobileDivider = isDark ? '#1E293B' : '#E0E7FF';
  const mobileLinkColor = isDark ? '#CBD5E1' : '#1E1B4B';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mega on outside click
  useEffect(() => {
    const handler = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) {
        setActiveMega(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.reload();
  };

  const openMega = (label) => {
    clearTimeout(megaTimeout.current);
    setActiveMega(label);
  };
  const closeMega = () => {
    megaTimeout.current = setTimeout(() => setActiveMega(null), 120);
  };
  const stayMega = () => clearTimeout(megaTimeout.current);

  const isActive = (href) => pathname === href || pathname?.startsWith(href + '?');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>

      {/* ── DESKTOP NAVBAR ─────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 99,
        background: navBg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${navBorder}`,
        transition: 'all 0.3s ease',
        fontFamily: 'DM Sans, sans-serif',
        boxShadow: scrolled ? (isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(99,102,241,0.12)') : 'none',
      }}>
        <div ref={megaRef} style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: `0 24px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: scrolled ? 56 : 68,
          transition: 'height 0.3s ease',
          gap: 8,
        }}>

          {/* Logo */}
          <Link href="/" style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: scrolled ? 18 : 20,
            color: logoColor,
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            flexShrink: 0,
            transition: 'font-size 0.3s, color 0.3s',
          }}>
            <span style={{ color: '#6366F1' }}>Tech</span>Store
          </Link>

          {/* Desktop nav links */}
          <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {NAV_LINKS.map(link => (
              <div key={link.label} style={{ position: 'relative' }}
                onMouseEnter={() => link.mega && openMega(link.label)}
                onMouseLeave={() => link.mega && closeMega()}
              >
                <Link href={link.href} style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '8px 14px',
                  borderRadius: 10,
                  color: isActive(link.href) ? linkActive : linkColor,
                  fontWeight: 600, fontSize: 13,
                  textDecoration: 'none',
                  transition: 'color 0.15s, background 0.15s',
                  background: activeMega === link.label ? 'rgba(99,102,241,0.1)' : 'transparent',
                  fontFamily: 'Syne, sans-serif',
                }}
                  onMouseEnter={e => { if (!link.mega) e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.07)'; }}
                  onMouseLeave={e => { if (!link.mega) e.currentTarget.style.background = 'transparent'; }}
                >
                  {link.label}
                  {link.label === 'Deals' && (
                    <span style={{
                      background: '#EF4444',
                      color: '#fff',
                      fontSize: 9,
                      fontWeight: 800,
                      padding: '1px 5px',
                      borderRadius: 4,
                      letterSpacing: '0.04em',
                    }}>HOT</span>
                  )}
                  {link.mega && (
                    <svg width="12" height="12" viewBox="0 0 12 12" style={{ opacity: 0.5, transform: activeMega === link.label ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    </svg>
                  )}
                </Link>

                {link.mega && activeMega === link.label && (
                  <div onMouseEnter={stayMega} onMouseLeave={closeMega}>
                    <MegaMenu navItem={link} onClose={() => setActiveMega(null)} isDark={isDark} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side: Search + Cart + Auth */}
          <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>

            {/* Search — compact when scrolled */}
            {searchOpen ? (
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
                <SearchBar compact onClose={() => setSearchOpen(false)} isDark={isDark} />
                <button onClick={() => setSearchOpen(false)} style={{
                  background: iconBg, border: `1px solid ${iconBorder}`,
                  color: iconColor, borderRadius: 8, width: 32, height: 32,
                  cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>×</button>
              </div>
            ) : scrolled ? (
              <button onClick={() => setSearchOpen(true)} style={{
                background: iconBg, border: `1px solid ${iconBorder}`,
                color: iconColor, borderRadius: 10, width: 36, height: 36,
                cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = iconBg}
              >🔍</button>
            ) : (
              <SearchBar isDark={isDark} />
            )}

            {/* Cart */}
            {user && (
              <Link href="/cart" style={{
                position: 'relative',
                background: iconBg,
                border: `1px solid ${iconBorder}`,
                borderRadius: 10,
                width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, textDecoration: 'none',
                transition: 'background 0.2s, border-color 0.2s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.15)';
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = iconBg;
                  e.currentTarget.style.borderColor = iconBorder;
                }}>
                🛒
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -4,
                    background: '#6366F1',
                    color: '#fff',
                    fontSize: 9,
                    fontWeight: 800,
                    width: 16, height: 16,
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Syne, sans-serif',
                  }}>{cartCount}</span>
                )}
              </Link>
            )}

            {/* Theme toggle */}
            <ThemeToggleBtn />

            {/* Special Deals CTA */}
            <Link href="/products?sale=true" style={{
              background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: 10,
              fontWeight: 800,
              fontSize: 12,
              textDecoration: 'none',
              fontFamily: 'Syne, sans-serif',
              letterSpacing: '0.02em',
              boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
              transition: 'opacity 0.2s, transform 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >⚡ Deals</Link>

            {/* Auth */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link href={user.role === 'admin' ? '/admin' : '/dashboard/user'} style={{
                  background: iconBg,
                  border: `1px solid ${iconBorder}`,
                  color: linkColor,
                  padding: '7px 14px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontFamily: 'Syne, sans-serif',
                  transition: 'background 0.2s, color 0.35s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.14)'}
                  onMouseLeave={e => e.currentTarget.style.background = iconBg}
                >{user.role === 'admin' ? '⚙️ Admin' : '👤 Account'}</Link>
                <button onClick={handleLogout} style={{
                  background: 'transparent',
                  border: `1px solid ${iconBorder}`,
                  color: isDark ? '#64748B' : '#6B7280',
                  padding: '7px 12px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = isDark ? '#F9FAFB' : '#1E1B4B'; e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(99,102,241,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = isDark ? '#64748B' : '#6B7280'; e.currentTarget.style.borderColor = iconBorder; }}
                >Logout</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link href="/login" style={{
                  color: linkColor, fontSize: 13, fontWeight: 600,
                  textDecoration: 'none', padding: '7px 12px',
                  fontFamily: 'Syne, sans-serif',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = logoColor}
                  onMouseLeave={e => e.currentTarget.style.color = linkColor}
                >Login</Link>
                <Link href="/register" style={{
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  color: '#fff',
                  padding: '8px 18px',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: 'none',
                  fontFamily: 'Syne, sans-serif',
                  boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
                  transition: 'opacity 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="show-mobile">
            {user && (
              <Link href="/cart" style={{ position: 'relative', fontSize: 20, textDecoration: 'none' }}>
                🛒
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -4,
                    background: '#6366F1', color: '#fff',
                    fontSize: 9, fontWeight: 800,
                    width: 15, height: 15, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Syne, sans-serif',
                  }}>{cartCount}</span>
                )}
              </Link>
            )}
            <button onClick={() => setMobileMenuOpen(o => !o)} style={{
              background: iconBg, border: `1px solid ${iconBorder}`,
              borderRadius: 10, width: 38, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: logoColor,
              transition: 'background 0.35s, border-color 0.35s, color 0.35s',
            }}>
              {mobileMenuOpen ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div style={{
            background: mobileBg,
            borderTop: `1px solid ${mobileDivider}`,
            padding: '16px 20px 20px',
            animation: 'slideDown 0.2s ease',
          }}>
            <style>{`@keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }`}</style>
            <SearchBar compact onClose={() => setMobileMenuOpen(false)} isDark={isDark} />
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {NAV_LINKS.map(link => (
                <Link key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} style={{
                  color: isActive(link.href) ? '#818CF8' : mobileLinkColor,
                  padding: '11px 14px', borderRadius: 10,
                  fontWeight: 600, fontSize: 14, textDecoration: 'none',
                  fontFamily: 'Syne, sans-serif',
                  background: isActive(link.href) ? 'rgba(99,102,241,0.1)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  {link.label}
                  {link.label === 'Deals' && <span style={{ background: '#EF4444', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>HOT</span>}
                </Link>
              ))}
              {user && <Link href="/cart" onClick={() => setMobileMenuOpen(false)} style={{ color: mobileLinkColor, padding: '11px 14px', borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: 'none', fontFamily: 'Syne, sans-serif' }}>🛒 Cart ({cartCount})</Link>}
              <div style={{ height: 1, background: mobileDivider, margin: '8px 0' }} />
              {/* Theme toggle in mobile menu */}
              <ThemeToggleBtn compact />
              <div style={{ height: 1, background: mobileDivider, margin: '8px 0' }} />
              {user ? (
                <>
                  <Link href={user.role === 'admin' ? '/admin' : '/dashboard/user'} onClick={() => setMobileMenuOpen(false)} style={{ color: mobileLinkColor, padding: '11px 14px', borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: 'none', fontFamily: 'Syne, sans-serif' }}>
                    {user.role === 'admin' ? '⚙️ Admin Panel' : '👤 My Account'}
                  </Link>
                  <button onClick={handleLogout} style={{ color: '#94A3B8', padding: '11px 14px', borderRadius: 10, fontWeight: 600, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'Syne, sans-serif' }}>Logout</button>
                </>
              ) : (
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} style={{ flex: 1, textAlign: 'center', background: iconBg, border: `1px solid ${iconBorder}`, color: mobileLinkColor, padding: '11px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', fontFamily: 'Syne, sans-serif' }}>Login</Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: '#fff', padding: '11px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', fontFamily: 'Syne, sans-serif' }}>Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ── MOBILE BOTTOM NAV ──────────────────────────────────────────────── */}
      <nav style={{
        display: 'none',
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        zIndex: 98,
        background: isDark ? 'rgba(9,9,20,0.95)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.12)'}`,
        padding: '8px 8px 12px',
        transition: 'background 0.35s, border-color 0.35s',
      }} className="bottom-nav">
        {[
          { icon: '🏠', label: 'Home', href: '/' },
          { icon: '🔍', label: 'Search', href: '/products' },
          { icon: '🛒', label: 'Cart', href: '/cart', badge: cartCount },
          { icon: user ? '👤' : '🔑', label: user ? 'Account' : 'Login', href: user ? (user.role === 'admin' ? '/admin' : '/dashboard/user') : '/login' },
        ].map(item => {
          const active = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 3, padding: '6px 0',
              textDecoration: 'none', position: 'relative',
              borderRadius: 12,
              background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
            }}>
              <span style={{ fontSize: 20, position: 'relative' }}>
                {item.icon}
                {item.badge > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -4,
                    background: '#6366F1', color: '#fff',
                    fontSize: 8, fontWeight: 800, width: 13, height: 13,
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Syne, sans-serif',
                  }}>{item.badge}</span>
                )}
              </span>
              <span style={{ color: active ? '#818CF8' : (isDark ? '#64748B' : '#6B7280'), fontSize: 10, fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── FLOATING ACTION BUTTON (FAB) ──────────────────────────────────── */}
      <FAB />

      {/* ── RESPONSIVE STYLES ─────────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          .bottom-nav { display: flex !important; }
          body { padding-bottom: 72px; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .bottom-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}

// ─── FLOATING ACTION BUTTON ───────────────────────────────────────────────────
function FAB() {
  const [open, setOpen] = useState(false);
  const [comparing] = useState(2); // Replace with real compare state

  return (
    <>
      {/* Compare tray */}
      {comparing > 0 && (
        <Link href="/compare" style={{
          position: 'fixed',
          bottom: 90,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 97,
          background: 'linear-gradient(135deg, #1E3A5F, #1E1B4B)',
          border: '1px solid rgba(99,102,241,0.4)',
          color: '#A5B4FC',
          borderRadius: 20,
          padding: '10px 20px',
          fontSize: 12,
          fontWeight: 700,
          textDecoration: 'none',
          fontFamily: 'Syne, sans-serif',
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          whiteSpace: 'nowrap',
        }} className="bottom-nav">
          ⚖️ Compare ({comparing}) →
        </Link>
      )}

      {/* FAB */}
      <div style={{
        position: 'fixed',
        bottom: 88,
        right: 20,
        zIndex: 99,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 10,
      }} className="bottom-nav">
        {open && (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 8,
            animation: 'fabIn 0.2s ease',
          }}>
            <style>{`@keyframes fabIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
            {[
              { icon: '🤖', label: 'AI Support', color: '#6366F1', href: '/support' },
              { icon: '🔬', label: 'Tech Finder', color: '#10B981', href: '/quiz' },
              { icon: '⚖️', label: 'Compare', color: '#F59E0B', href: '/compare' },
            ].map(action => (
              <Link key={action.label} href={action.href} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#0F172A',
                border: `1px solid ${action.color}44`,
                borderRadius: 12,
                padding: '10px 14px',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              }}>
                <span style={{ fontSize: 16 }}>{action.icon}</span>
                <span style={{ color: '#F9FAFB', fontSize: 12, fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>{action.label}</span>
              </Link>
            ))}
          </div>
        )}

        <button onClick={() => setOpen(o => !o)} style={{
          width: 48, height: 48,
          background: open ? '#1E293B' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          border: open ? '1px solid #374151' : 'none',
          borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: open ? 'none' : '0 8px 24px rgba(99,102,241,0.4)',
          fontSize: 20,
          transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
          transform: open ? 'rotate(45deg)' : 'rotate(0)',
        }}>
          {open ? '×' : '✦'}
        </button>
      </div>
    </>
  );
}
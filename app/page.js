'use client';
// NOTE: This is the client-side interactive version.

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useT } from './themeTokens';

// ─── HERO SLIDES (static marketing data) ─────────────────────────────────────
const HERO_SLIDES = [
  {
    tag: 'Just Launched',
    headline: 'Latest Tech Deals',
    sub: 'Discover amazing products at unbeatable prices. Free shipping on all orders.',
    cta: 'Shop Now',
    href: '/products',
    accent: '#FF6B35',
    specs: ['Top Brands', 'Free Shipping', 'Best Prices', '2-Year Warranty'],
  },
  {
    tag: "Editor's Pick",
    headline: 'Premium Laptops',
    sub: 'Powerful machines for work and play. Built for professionals and creators.',
    cta: 'Explore',
    href: '/products?category=Laptops',
    accent: '#00D4FF',
    specs: ['Latest Processors', 'All-Day Battery', 'High-Res Displays', 'Fast RAM'],
  },
  {
    tag: 'Flash Deal',
    headline: 'Audio Excellence',
    sub: 'Industry-leading sound quality. Noise cancellation and crystal-clear audio.',
    cta: 'Grab Deal',
    href: '/products?category=Audio',
    accent: '#A855F7',
    specs: ['Long Battery', 'Premium Sound', 'Hi-Res Audio', 'Wireless'],
  },
];

const CATEGORIES = [
  { name: 'Laptops', count: 'Browse all', color: '#00D4FF' },
  { name: 'Mobiles', count: 'Browse all', color: '#FF6B35' },
  { name: 'Accessories', count: 'Browse all', color: '#A855F7' },
  { name: 'Tablets', count: 'Browse all', color: '#10B981' },
];

const TRUST = [
  { title: 'Free 2-Year Warranty', sub: 'On all products' },
  { title: 'Next-Day Delivery', sub: 'Order before 3pm' },
  { title: '24/7 Tech Support', sub: 'Expert assistance' },
  { title: '30-Day Returns', sub: 'Hassle-free' },
];

// ─── COUNTDOWN TIMER ─────────────────────────────────────────────────────────
function useCountdown(hours = 4, mins = 20) {
  const [time, setTime] = useState(hours * 3600 + mins * 60);
  useEffect(() => {
    const t = setInterval(() => setTime(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(time / 3600)).padStart(2, '0');
  const m = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
  const s = String(time % 60).padStart(2, '0');
  return { h, m, s };
}

// ─── STAR RATING ─────────────────────────────────────────────────────────────
function Stars({ rating }) {
  const t = useT();
  return (
    <span style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#FBBF24' : t.borderStrong, fontSize: 11 }}>&#9733;</span>
      ))}
    </span>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────
function ProductCard({ product }) {
  const t = useT();
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div style={{
      background: t.bgCard,
      border: `1px solid ${t.borderCard}`,
      borderRadius: 16,
      overflow: 'hidden',
      transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s, background 0.35s',
      position: 'relative',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = t.borderStrong;
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = t.borderCard;
        e.currentTarget.style.boxShadow = 'none';
      }}>
      {/* Badges */}
      <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {product.badge && (
          <span style={{
            background: product.badge === 'Best Seller' ? '#F59E0B' : product.badge === 'New' ? '#10B981' : '#EF4444',
            color: '#000', fontSize: 10, fontWeight: 800, padding: '3px 8px',
            borderRadius: 6, letterSpacing: '0.05em', textTransform: 'uppercase',
            fontFamily: 'sans-serif',
          }}>{product.badge}</span>
        )}
        {discount > 0 && (
          <span style={{
            background: 'rgba(239,68,68,0.9)', color: '#fff',
            fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
          }}>-{discount}%</span>
        )}
      </div>

      {/* Wishlist */}
      <button onClick={() => setWished(w => !w)} style={{
        position: 'absolute', top: 12, right: 12, zIndex: 2,
        background: t.bgGlass, border: `1px solid ${wished ? 'rgba(239,68,68,0.45)' : t.borderCard}`,
        borderRadius: 8, width: 32, height: 32,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', fontSize: 15, backdropFilter: 'blur(4px)',
        transform: wished ? 'scale(1.2)' : 'scale(1)', transition: 'transform 0.15s, border-color 0.2s',
        color: wished ? '#EF4444' : t.textFaint,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </button>

      <div style={{
        background: `linear-gradient(135deg, ${t.borderCard} 0%, ${t.bgCard} 100%)`,
        height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 64, position: 'relative',
      }}>
        {product.image ? (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ) : (
          <span style={{ color: t.textFaint, opacity: 0.3 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <p style={{ color: t.textFaint, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontFamily: 'sans-serif' }}>
          {product.category}
        </p>
        <h3 style={{ color: t.textPrimary, fontSize: 15, fontWeight: 700, marginBottom: 8, lineHeight: 1.3, fontFamily: 'sans-serif' }}>
          {product.name || product.title}
        </h3>

        {product.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Stars rating={product.rating} />
            <span style={{ color: t.textFaint, fontSize: 11 }}>{product.rating} ({product.reviews?.toLocaleString()})</span>
          </div>
        )}

        {/* Stock warning */}
        {product.stock <= 5 && product.stock > 0 && (
          <p style={{ color: '#F59E0B', fontSize: 11, fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
            Only {product.stock} left in stock!
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          <div>
            <span style={{ color: t.textPrimary, fontSize: 20, fontWeight: 800, fontFamily: 'sans-serif' }}>
              ₹{product.price?.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span style={{ color: t.textFaint, fontSize: 12, textDecoration: 'line-through', marginLeft: 6 }}>
                ₹{product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>
          <button onClick={handleAdd} style={{
            background: added ? '#10B981' : '#2563EB', color: '#fff',
            border: 'none', borderRadius: 8, padding: '8px 16px',
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            transition: 'background 0.2s, transform 0.1s', fontFamily: 'sans-serif',
            transform: added ? 'scale(0.95)' : 'scale(1)',
          }}>
            {added ? 'Added' : '+ Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SEARCH SUGGESTIONS DROPDOWN ─────────────────────────────────────────────
function SuggestionDropdown({ suggestions, onSelect }) {
  const t = useT();
  return (
    <div style={{
      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
      background: t.bgDropdown,
      border: `1px solid ${t.borderCard}`,
      borderRadius: 12, marginTop: 4, overflow: 'hidden',
      boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
    }}>
      {suggestions.map(s => (
        <button key={s} onClick={() => onSelect(s)}
          style={{
            width: '100%', padding: '12px 20px',
            background: 'transparent', border: 'none',
            color: t.textPrimary, textAlign: 'left',
            cursor: 'pointer', fontSize: 14,
            fontFamily: 'inherit',
            borderBottom: `1px solid ${t.borderCard}`,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = t.bgHover}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >{s}</button>
      ))}
    </div>
  );
}

// ─── PROMO BANNER ─────────────────────────────────────────────────────────────
function PromoBanner({ t }) {
  const isDark = t.bgPage === '#030712' || t.bgPage.startsWith('#03');
  return (
    <div style={{
      background: isDark
        ? 'linear-gradient(135deg, #1E1B4B 0%, #1E3A5F 50%, #0F2027 100%)'
        : 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #C7D2FE 100%)',
      border: isDark ? '1px solid #312E81' : '1px solid #C7D2FE',
      borderRadius: 24, padding: '64px 48px',
      textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -80, right: -80,
        width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -60, left: -60,
        width: 240, height: 240,
        background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <span style={{
        background: 'linear-gradient(90deg, #818CF8, #A78BFA)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        fontSize: 13, fontWeight: 700, letterSpacing: '0.15em',
        textTransform: 'uppercase', fontFamily: 'sans-serif',
        display: 'block', marginBottom: 16,
      }}>Limited Time Offer</span>

      <h2 style={{
        color: isDark ? '#F9FAFB' : '#1E1B4B',
        fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900,
        fontFamily: 'sans-serif', marginBottom: 16, position: 'relative',
      }}>Get 20% Off Your First Order</h2>

      <p style={{
        color: isDark ? '#94A3B8' : '#4338CA',
        fontSize: 17, marginBottom: 36, maxWidth: 500, margin: '0 auto 36px', lineHeight: 1.6,
      }}>
        Join 50,000+ tech enthusiasts. Free 2-year warranty included on every purchase.
      </p>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/register" style={{
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: '#fff',
          padding: '16px 36px', borderRadius: 12, fontWeight: 800, fontSize: 15,
          textDecoration: 'none', fontFamily: 'sans-serif', display: 'inline-block',
          boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
        }}>Create Free Account &rarr;</Link>
        <Link href="/products" style={{
          background: isDark ? 'transparent' : 'rgba(255,255,255,0.7)',
          color: isDark ? '#A5B4FC' : '#4338CA',
          padding: '16px 36px', borderRadius: 12, fontWeight: 700, fontSize: 15,
          border: isDark ? '1px solid rgba(165,180,252,0.3)' : '1px solid #C7D2FE',
          textDecoration: 'none', fontFamily: 'sans-serif', display: 'inline-block',
        }}>Browse First</Link>
      </div>
    </div>
  );
}

// ─── HERO SLIDER ──────────────────────────────────────────────────────────────
function HeroSlider() {
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { h, m, s } = useCountdown(4, 20);
  const timerRef = useRef(null);
  const router = useRouter();
  const [allProductNames, setAllProductNames] = useState([]);

  useEffect(() => {
    // Fetch product names for search suggestions
    fetch('/api/products?limit=50')
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setAllProductNames(data.products.map(p => p.name || p.title).filter(Boolean));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => setActive(a => (a + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (i) => {
    clearInterval(timerRef.current);
    setActive(i);
    timerRef.current = setInterval(() => setActive(a => (a + 1) % HERO_SLIDES.length), 6000);
  };

  const handleSearch = (val) => {
    setQuery(val);
    if (val.length > 1 && allProductNames.length > 0) {
      setSuggestions(allProductNames.filter(n => n.toLowerCase().includes(val.toLowerCase())).slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const slide = HERO_SLIDES[active];

  return (
    <section style={{
      background: `linear-gradient(135deg, #0a0a0f, #111827, #1a1035)`,
      minHeight: '92vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '60px 24px 80px',
    }}>

      {/* Animated background grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Glow orb */}
      <div style={{
        position: 'absolute',
        width: 600, height: 600,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${slide.accent}22 0%, transparent 70%)`,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      {/* Flash sale bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        background: `linear-gradient(90deg, ${slide.accent}cc, ${slide.accent}88)`,
        padding: '10px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
        fontSize: 13, fontWeight: 700, color: '#fff',
        fontFamily: 'sans-serif',
        zIndex: 10,
      }}>
        <span>FLASH SALE -- Ends in:</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {[h, m, s].map((unit, i) => (
            <span key={i} style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: 6,
              padding: '2px 8px',
              fontFamily: 'monospace',
              fontSize: 15,
              letterSpacing: 2,
            }}>{unit}</span>
          ))}
        </div>
        <span style={{ color: 'rgba(255,255,255,0.8)' }}>Up to 40% off selected items</span>
      </div>

      {/* Slide content */}
      <div style={{ maxWidth: 900, width: '100%', textAlign: 'center', position: 'relative', zIndex: 2, marginTop: 20 }}>
        <div style={{
          display: 'inline-block',
          background: `${slide.accent}22`,
          border: `1px solid ${slide.accent}55`,
          color: slide.accent,
          borderRadius: 20,
          padding: '4px 16px',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 20,
          fontFamily: 'sans-serif',
        }}>{slide.tag}</div>

        <h1 style={{
          color: '#FFFFFF',
          fontSize: 'clamp(36px, 6vw, 72px)',
          fontWeight: 900,
          marginBottom: 16,
          lineHeight: 1.05,
          fontFamily: 'sans-serif',
          letterSpacing: '-0.02em',
        }}>{slide.headline}</h1>

        <p style={{
          color: '#9CA3AF',
          fontSize: 18,
          marginBottom: 32,
          maxWidth: 560,
          margin: '0 auto 32px',
          lineHeight: 1.6,
        }}>{slide.sub}</p>

        {/* Spec pills */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
          {slide.specs.map(spec => (
            <span key={spec} style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#D1D5DB',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'sans-serif',
            }}>{spec}</span>
          ))}
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto 36px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            gap: 12,
            backdropFilter: 'blur(12px)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={query}
              onChange={e => handleSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) {
                  router.push(`/products?q=${encodeURIComponent(query.trim())}`);
                }
              }}
              placeholder="Search by product, model number, brand..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#F9FAFB',
                fontSize: 15,
                padding: '18px 0',
                fontFamily: 'inherit',
              }}
            />
            <button
              onClick={() => {
                if (query.trim()) {
                  router.push(`/products?q=${encodeURIComponent(query.trim())}`);
                }
              }}
              style={{
                background: slide.accent,
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '10px 20px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: 13,
                fontFamily: 'sans-serif',
                flexShrink: 0,
              }}>Search</button>
          </div>

          {suggestions.length > 0 && (
            <SuggestionDropdown suggestions={suggestions} onSelect={(s) => {
              setQuery(s);
              setSuggestions([]);
              router.push(`/products?q=${encodeURIComponent(s)}`);
            }} />
          )}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={slide.href} style={{
            background: slide.accent,
            color: '#fff',
            padding: '14px 32px',
            borderRadius: 12,
            fontWeight: 800,
            fontSize: 15,
            textDecoration: 'none',
            fontFamily: 'sans-serif',
            letterSpacing: '0.02em',
            transition: 'opacity 0.2s, transform 0.2s',
            display: 'inline-block',
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >{slide.cta} &rarr;</Link>
          <Link href="/products" style={{
            background: 'rgba(255,255,255,0.08)',
            color: '#F9FAFB',
            padding: '14px 32px',
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 15,
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.15)',
            fontFamily: 'sans-serif',
            display: 'inline-block',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >Browse All</Link>
        </div>
      </div>

      {/* Slide dots */}
      <div style={{ display: 'flex', gap: 8, marginTop: 48, position: 'relative', zIndex: 2 }}>
        {HERO_SLIDES.map((sl, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: active === i ? 28 : 8,
            height: 8,
            borderRadius: 4,
            background: active === i ? slide.accent : 'rgba(255,255,255,0.2)',
            border: 'none',
            cursor: 'pointer',
            transition: 'width 0.3s, background 0.3s',
            padding: 0,
          }} />
        ))}
      </div>
    </section>
  );
}

// ─── TRUST ICONS (SVG) ───────────────────────────────────────────────────────
const TrustIcons = [
  <svg key="warranty" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  <svg key="delivery" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  <svg key="support" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
  <svg key="returns" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,
];

// ─── CATEGORY ICONS (SVG) ────────────────────────────────────────────────────
const CatIcons = {
  Laptops: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  Mobiles: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  Accessories: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>,
  Tablets: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
};

// ─── MAIN HOME PAGE ───────────────────────────────────────────────────────────
export default function Home() {
  const t = useT();
  const { h, m, s } = useCountdown(4, 20);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?limit=8')
      .then(res => res.json())
      .then(data => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        * { scrollbar-width: thin; scrollbar-color: #374151 transparent; }
        a { text-decoration: none; }
      `}</style>

      {/* HERO */}
      <HeroSlider />

      {/* TRUST BAR */}
      <section style={{
        background: t.bgSection,
        borderTop: `1px solid ${t.borderMuted}`,
        borderBottom: `1px solid ${t.borderMuted}`,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {TRUST.map((tr, idx) => (
            <div key={tr.title} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '22px 24px',
              borderRight: `1px solid ${t.borderMuted}`,
            }}>
              <span>{TrustIcons[idx]}</span>
              <div>
                <p style={{ color: t.textPrimary, fontWeight: 700, fontSize: 14, fontFamily: 'sans-serif' }}>{tr.title}</p>
                <p style={{ color: t.textFaint, fontSize: 12 }}>{tr.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 36 }}>
          <div>
            <p style={{ color: '#6366F1', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'sans-serif', marginBottom: 6 }}>Explore</p>
            <h2 style={{ color: t.textPrimary, fontSize: 32, fontWeight: 900, fontFamily: 'sans-serif' }}>Shop by Category</h2>
          </div>
          <Link href="/products" style={{ color: '#6366F1', fontSize: 14, fontWeight: 600, fontFamily: 'sans-serif' }}>View all &rarr;</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {CATEGORIES.map(cat => (
            <Link key={cat.name} href={`/products?category=${cat.name}`} style={{
              background: t.bgCard,
              border: `1px solid ${t.borderCard}`,
              borderRadius: 20, padding: '32px 24px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
              transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s, background 0.35s',
              position: 'relative', overflow: 'hidden',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = cat.color + '60';
                e.currentTarget.style.boxShadow = `0 20px 40px ${cat.color}18`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = t.borderCard;
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <div style={{
                width: 72, height: 72,
                background: `${cat.color}18`, border: `1px solid ${cat.color}33`,
                borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16, color: cat.color,
              }}>{CatIcons[cat.name]}</div>
              <h3 style={{ color: t.textPrimary, fontWeight: 800, fontSize: 16, fontFamily: 'sans-serif', marginBottom: 4 }}>{cat.name}</h3>
              <p style={{ color: t.textFaint, fontSize: 12 }}>{cat.count}</p>
              <div style={{ position: 'absolute', bottom: -20, right: -20, width: 80, height: 80, background: `${cat.color}08`, borderRadius: '50%' }} />
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={{ background: t.bgSection, padding: '72px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 36 }}>
            <div>
              <p style={{ color: '#F59E0B', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'sans-serif', marginBottom: 6 }}>Flash Sale ends in {h}:{m}:{s}</p>
              <h2 style={{ color: t.textPrimary, fontSize: 32, fontWeight: 900, fontFamily: 'sans-serif' }}>Featured Products</h2>
            </div>
            <Link href="/products" style={{ color: '#6366F1', fontSize: 14, fontWeight: 600, fontFamily: 'sans-serif' }}>View all &rarr;</Link>
          </div>

          {products.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {products.slice(0, 8).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px', background: t.bgCard, borderRadius: 16, color: t.textFaint }}>
              {loading ? 'Loading products...' : 'No products available yet. Add products from the admin dashboard.'}
            </div>
          )}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px' }}>
        <PromoBanner t={t} />
      </section>

      {/* FOOTER NOTE */}
      <div style={{ borderTop: `1px solid ${t.borderMuted}`, padding: '24px', textAlign: 'center', color: t.textFaint, fontSize: 12 }}>
        &copy; 2025 TechStore. Certified Refurbished Options - Next-Day Tech Support - Free Returns
      </div>
    </>
  );
}
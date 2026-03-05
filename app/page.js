'use client';
// NOTE: This is the client-side interactive version.

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useT } from './themeTokens';

// ─── MOCK DATA (replace with props from your server component) ───────────────
const SAMPLE_PRODUCTS = [
  { _id: '1', name: 'MacBook Pro 16"', price: 2499, originalPrice: 2999, rating: 4.9, reviews: 1284, badge: 'Best Seller', image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1671304673202', category: 'Laptops', stock: 3 },
  { _id: '2', name: 'iPhone 15 Pro Max', price: 1199, originalPrice: 1299, rating: 4.8, reviews: 3210, badge: 'New', image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-bluetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845702654', category: 'Mobiles', stock: 7 },
  { _id: '3', name: 'Sony WH-1000XM5', price: 349, originalPrice: 399, rating: 4.7, reviews: 892, badge: 'Hot Deal', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop&q=60', category: 'Accessories', stock: 12 },
  { _id: '4', name: 'iPad Pro 12.9"', price: 1099, originalPrice: 1199, rating: 4.8, reviews: 654, badge: null, image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-13-in-hero-position1-wifi-space-gray-2024?wid=2420&hei=2500&fmt=p-jpg&qlt=95&.v=1713396875041', category: 'Tablets', stock: 5 },
  { _id: '5', name: 'Samsung Galaxy S24', price: 899, originalPrice: 999, rating: 4.6, reviews: 1876, badge: 'Popular', image: 'https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-s928-sm-s928bztqins-thumb-539573272', category: 'Mobiles', stock: 9 },
  { _id: '6', name: 'Dell XPS 15', price: 1799, originalPrice: 2099, rating: 4.7, reviews: 432, badge: null, image: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/notebook-xps-15-9530-nt-blue-gallery-4.psd?fmt=png-alpha&pscan=auto&scl=1&hei=804&wid=1284&qlt=100,1&resMode=sharp2&size=1284,804&chrss=full', category: 'Laptops', stock: 4 },
  { _id: '7', name: 'AirPods Pro 2', price: 249, originalPrice: 279, rating: 4.8, reviews: 5621, badge: 'Best Seller', image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361', category: 'Accessories', stock: 20 },
  { _id: '8', name: 'Samsung Tab S9', price: 799, originalPrice: 899, rating: 4.5, reviews: 341, badge: null, image: 'https://images.samsung.com/is/image/samsung/p6pim/in/sm-x710nzaeinu/gallery/in-galaxy-tab-s9-5g-x710-sm-x710nzaeinu-537046181', category: 'Tablets', stock: 6 },
];

const HERO_SLIDES = [
  {
    tag: 'Just Launched',
    headline: 'iPhone 15 Pro Max',
    sub: 'Titanium build. A17 Pro chip. The most powerful iPhone ever.',
    cta: 'Shop Now',
    href: '/products?category=Mobiles',
    accent: '#FF6B35',
    bg: 'from-[#0a0a0f] via-[#111827] to-[#1a1035]',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-bluetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845702654',
    specs: ['A17 Pro Chip', '48MP Camera', 'USB-C', '5G Ready'],
  },
  {
    tag: 'Editor\'s Pick',
    headline: 'MacBook Pro 16"',
    sub: 'M3 Max chip. Up to 128GB unified memory. Built for pros.',
    cta: 'Explore',
    href: '/products?category=Laptops',
    accent: '#00D4FF',
    bg: 'from-[#020817] via-[#0f172a] to-[#0a1628]',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1671304673202',
    specs: ['M3 Max Chip', '22hr Battery', 'Liquid Retina XDR', '16GB RAM'],
  },
  {
    tag: 'Flash Deal',
    headline: 'Sony WH-1000XM5',
    sub: 'Industry-leading noise cancellation. 30-hour battery life.',
    cta: 'Grab Deal',
    href: '/products?category=Accessories',
    accent: '#A855F7',
    bg: 'from-[#0d0a1e] via-[#130d2e] to-[#1a0a28]',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop&q=60',
    specs: ['30hr Battery', 'ANC Pro', 'Hi-Res Audio', 'Multipoint'],
  },
];

const CATEGORIES = [
  { name: 'Laptops', icon: 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png', count: '240+ items', color: '#00D4FF' },
  { name: 'Mobiles', icon: 'https://cdn-icons-png.flaticon.com/512/3659/3659909.png', count: '180+ items', color: '#FF6B35' },
  { name: 'Accessories', icon: 'https://cdn-icons-png.flaticon.com/512/3659/3659899.png', count: '420+ items', color: '#A855F7' },
  { name: 'Tablets', icon: 'https://cdn-icons-png.flaticon.com/512/3659/3659896.png', count: '95+ items', color: '#10B981' },
];

const TRUST = [
  { icon: '🛡️', title: 'Free 2-Year Warranty', sub: 'On all products' },
  { icon: '🚀', title: 'Next-Day Delivery', sub: 'Order before 3pm' },
  { icon: '🔧', title: '24/7 Tech Support', sub: 'Expert assistance' },
  { icon: '↩️', title: '30-Day Returns', sub: 'Hassle-free' },
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
        <span key={i} style={{ color: i <= Math.round(rating) ? '#FBBF24' : t.borderStrong, fontSize: 11 }}>★</span>
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
            fontFamily: 'Syne, sans-serif',
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
      }}>
        {wished ? '❤️' : '🤍'}
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
          <span style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))' }}>
            {product.category === 'Laptops' ? '💻' : product.category === 'Mobiles' ? '📱' : product.category === 'Accessories' ? '🎧' : '📠'}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <p style={{ color: t.textFaint, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontFamily: 'Syne, sans-serif' }}>
          {product.category}
        </p>
        <h3 style={{ color: t.textPrimary, fontSize: 15, fontWeight: 700, marginBottom: 8, lineHeight: 1.3, fontFamily: 'Syne, sans-serif' }}>
          {product.name}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Stars rating={product.rating} />
          <span style={{ color: t.textFaint, fontSize: 11 }}>{product.rating} ({product.reviews?.toLocaleString()})</span>
        </div>

        {/* Stock warning */}
        {product.stock <= 5 && (
          <p style={{ color: '#F59E0B', fontSize: 11, fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>⚡</span> Only {product.stock} left in stock!
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          <div>
            <span style={{ color: t.textPrimary, fontSize: 20, fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>
              ${product.price?.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span style={{ color: t.textFaint, fontSize: 12, textDecoration: 'line-through', marginLeft: 6 }}>
                ${product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>
          <button onClick={handleAdd} style={{
            background: added ? '#10B981' : '#2563EB', color: '#fff',
            border: 'none', borderRadius: 8, padding: '8px 16px',
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            transition: 'background 0.2s, transform 0.1s', fontFamily: 'Syne, sans-serif',
            transform: added ? 'scale(0.95)' : 'scale(1)',
          }}>
            {added ? '✓ Added' : '+ Cart'}
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
        textTransform: 'uppercase', fontFamily: 'Syne, sans-serif',
        display: 'block', marginBottom: 16,
      }}>Limited Time Offer</span>

      <h2 style={{
        color: isDark ? '#F9FAFB' : '#1E1B4B',
        fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900,
        fontFamily: 'Syne, sans-serif', marginBottom: 16, position: 'relative',
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
          textDecoration: 'none', fontFamily: 'Syne, sans-serif', display: 'inline-block',
          boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
        }}>Create Free Account →</Link>
        <Link href="/products" style={{
          background: isDark ? 'transparent' : 'rgba(255,255,255,0.7)',
          color: isDark ? '#A5B4FC' : '#4338CA',
          padding: '16px 36px', borderRadius: 12, fontWeight: 700, fontSize: 15,
          border: isDark ? '1px solid rgba(165,180,252,0.3)' : '1px solid #C7D2FE',
          textDecoration: 'none', fontFamily: 'Syne, sans-serif', display: 'inline-block',
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

  const allNames = SAMPLE_PRODUCTS.map(p => p.name);

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
    if (val.length > 1) {
      setSuggestions(allNames.filter(n => n.toLowerCase().includes(val.toLowerCase())).slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const slide = HERO_SLIDES[active];

  return (
    <section style={{
      background: `linear-gradient(135deg, ${slide.bg.replace('from-', '').split(' ')[0].replace('[', '').replace(']', '')}, #000)`,
      minHeight: '92vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '60px 24px 80px',
    }}
      className={`bg-gradient-to-br ${slide.bg}`}>

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
        fontFamily: 'Syne, sans-serif',
        zIndex: 10,
      }}>
        <span>⚡ FLASH SALE — Ends in:</span>
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
          fontFamily: 'Syne, sans-serif',
        }}>{slide.tag}</div>

        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={slide.image} alt={slide.headline} style={{ maxWidth: 320, maxHeight: 320, objectFit: 'contain', filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.6))', display: 'block', margin: '0 auto' }} />
        </div>

        <h1 style={{
          color: '#FFFFFF',
          fontSize: 'clamp(36px, 6vw, 72px)',
          fontWeight: 900,
          marginBottom: 16,
          lineHeight: 1.05,
          fontFamily: 'Syne, sans-serif',
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
              fontFamily: 'Syne, sans-serif',
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
            <span style={{ fontSize: 18, flexShrink: 0 }}>🔍</span>
            <input
              value={query}
              onChange={e => handleSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) {
                  router.push(`/products?q=${encodeURIComponent(query.trim())}`);
                }
              }}
              placeholder="Search by product, model number, brand…"
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
                fontFamily: 'Syne, sans-serif',
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
            fontFamily: 'Syne, sans-serif',
            letterSpacing: '0.02em',
            transition: 'opacity 0.2s, transform 0.2s',
            display: 'inline-block',
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >{slide.cta} →</Link>
          <Link href="/products" style={{
            background: 'rgba(255,255,255,0.08)',
            color: '#F9FAFB',
            padding: '14px 32px',
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 15,
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.15)',
            fontFamily: 'Syne, sans-serif',
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
          setProducts(SAMPLE_PRODUCTS);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setProducts(SAMPLE_PRODUCTS);
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
          {TRUST.map(tr => (
            <div key={tr.title} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '22px 24px',
              borderRight: `1px solid ${t.borderMuted}`,
            }}>
              <span style={{ fontSize: 28 }}>{tr.icon}</span>
              <div>
                <p style={{ color: t.textPrimary, fontWeight: 700, fontSize: 14, fontFamily: 'Syne, sans-serif' }}>{tr.title}</p>
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
            <p style={{ color: '#6366F1', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Syne, sans-serif', marginBottom: 6 }}>Explore</p>
            <h2 style={{ color: t.textPrimary, fontSize: 32, fontWeight: 900, fontFamily: 'Syne, sans-serif' }}>Shop by Category</h2>
          </div>
          <Link href="/products" style={{ color: '#6366F1', fontSize: 14, fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>View all →</Link>
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
                marginBottom: 16,
              }}><img src={cat.icon} alt={cat.name} style={{ width: 40, height: 40, objectFit: 'contain', filter: `drop-shadow(0 2px 8px ${cat.color}44)` }} /></div>
              <h3 style={{ color: t.textPrimary, fontWeight: 800, fontSize: 16, fontFamily: 'Syne, sans-serif', marginBottom: 4 }}>{cat.name}</h3>
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
              <p style={{ color: '#F59E0B', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Syne, sans-serif', marginBottom: 6 }}>⚡ Flash Sale ends in {h}:{m}:{s}</p>
              <h2 style={{ color: t.textPrimary, fontSize: 32, fontWeight: 900, fontFamily: 'Syne, sans-serif' }}>Featured Products</h2>
            </div>
            <Link href="/products" style={{ color: '#6366F1', fontSize: 14, fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>View all →</Link>
          </div>

          {products.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {products.slice(0, 8).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px', background: t.bgCard, borderRadius: 16, color: t.textFaint }}>
              No products available
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
        © 2025 TechStore. Certified Refurbished Options · Next-Day Tech Support · Free Returns
      </div>
    </>
  );
}
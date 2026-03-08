'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import { Eye, Scale, ShoppingCart, Zap, Check } from 'lucide-react';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getSpecPills(product) {
  if (product.specs && Array.isArray(product.specs)) return product.specs.slice(0, 3);
  const map = {
    Mobiles: ['5G', 'OLED', '120Hz'],
    Laptops: ['M3 Chip', 'Retina', 'Wi-Fi 6E'],
    Accessories: ['ANC', 'Hi-Res', 'BT 5.3'],
    Tablets: ['OLED', 'Pencil', '120Hz'],
    Gaming: ['144Hz', 'RGB', 'USB-C'],
    Audio: ['Lossless', 'ANC', '30hr'],
  };
  return map[product.category] ?? ['Pro', 'Premium', 'Next-Gen'];
}

function getReliability(product) {
  if (product.rating) return Math.min(5, Math.round(product.rating));
  return 3 + ((product._id?.length ?? 0) % 3);
}

function getDiscount(product) {
  if (!product.originalPrice || product.originalPrice <= product.price) return 0;
  return Math.round((1 - product.price / product.originalPrice) * 100);
}

function getCategoryEmoji(cat) {
  return null; // No longer uses emojis
}

// ─── MICRO-COMPONENTS ────────────────────────────────────────────────────────

function ReliabilityDots({ score }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }} title={`Reliability ${score}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{
          display: 'block',
          borderRadius: '50%',
          width: i < score ? 7 : 5,
          height: i < score ? 7 : 5,
          background: i < score ? `hsl(${214 + i * 12}, 92%, ${54 + i * 4}%)` : 'rgba(148,163,184,0.2)',
          boxShadow: i < score ? `0 0 6px hsl(${214 + i * 12}, 92%, 60%)` : 'none',
          transition: 'all 0.2s',
        }} />
      ))}
    </div>
  );
}

function StockPulse({ inStock }) {
  const color = inStock ? '#10B981' : '#EF4444';
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ position: 'relative', width: 8, height: 8, display: 'flex' }}>
        <span style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: color, opacity: 0.7,
          animation: 'stock-ping 1.4s cubic-bezier(0,0,0.2,1) infinite',
        }} />
        <span style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: color }} />
      </span>
      <span style={{
        fontFamily: 'var(--pc-mono)',
        fontSize: 10, fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color,
      }}>{inStock ? 'In Stock' : 'Sold Out'}</span>
    </span>
  );
}

function FlashBadge({ discount }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '3px 8px', borderRadius: 4,
      background: 'linear-gradient(135deg, #FF6B35, #EF4444)',
      color: '#fff',
      fontFamily: 'var(--pc-mono)',
      fontSize: 9, fontWeight: 900,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      animation: 'flash-pulse 2s ease-in-out infinite',
    }}>
      <Zap size={8} strokeWidth={3} />
      {discount}% OFF
    </span>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [cartState, setCartState] = useState('idle'); // idle | adding | added
  const [wished, setWished] = useState(false);

  const discount = getDiscount(product);
  const specs = getSpecPills(product);
  const reliability = getReliability(product);
  const inStock = product.stock > 0;
  const title = product.title ?? product.name ?? 'Unnamed Product';

  const handleCart = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    if (cartState !== 'idle' || !inStock) return;

    setCartState('adding');

    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    const existing = guestCart.find(item => item.productId === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      guestCart.push({ productId: product._id, quantity: 1 });
    }
    localStorage.setItem('guestCart', JSON.stringify(guestCart));

    setCartState('added');
    setTimeout(() => setCartState('idle'), 2400);
  }, [cartState, inStock, product._id]);

  const handleWish = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    setWished(w => !w);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800;900&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');

        :root {
          --pc-display: 'Syne', sans-serif;
          --pc-mono:    'DM Mono', monospace;
          --pc-body:    'DM Sans', sans-serif;
        }

        @keyframes stock-ping {
          0%        { transform: scale(1);   opacity: 0.7; }
          70%, 100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes flash-pulse {
          0%, 100% { box-shadow: 0 0 6px rgba(239,68,68,0.35), 0 0 18px rgba(239,68,68,0.1); }
          50%       { box-shadow: 0 0 12px rgba(239,68,68,0.65), 0 0 28px rgba(239,68,68,0.25); }
        }
        @keyframes overlay-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes btn-pop {
          from { opacity: 0; transform: translateY(10px) scale(0.88); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes cart-ripple {
          from { transform: scale(1); opacity: 0.5; }
          to   { transform: scale(2.4); opacity: 0; }
        }

        .pc-overlay-action {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          text-decoration: none;
          animation: btn-pop 0.22s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .pc-overlay-action:nth-child(2) { animation-delay: 0.07s; }

        .pc-overlay-icon {
          width: 50px; height: 50px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 14px;
          background: rgba(9,9,20,0.82);
          border: 1px solid rgba(99,102,241,0.35);
          backdrop-filter: blur(6px);
          transition: background 0.18s, border-color 0.18s, box-shadow 0.18s, transform 0.18s;
        }
        .pc-overlay-icon:hover {
          background: rgba(99,102,241,0.22);
          border-color: rgba(99,102,241,0.7);
          box-shadow: 0 0 20px rgba(99,102,241,0.35);
          transform: scale(1.1);
        }

        .pc-spec-pill {
          display: inline-block;
          font-family: var(--pc-mono);
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.06em;
          padding: 3px 9px; border-radius: 4px;
          border: 1px solid rgba(99,102,241,0.28);
          background: rgba(99,102,241,0.07);
          color: #a5b4fc;
          transition: background 0.2s, border-color 0.2s;
        }
        .pc-spec-pill:hover {
          background: rgba(99,102,241,0.16);
          border-color: rgba(99,102,241,0.55);
        }
      `}</style>

      <div
        style={{ fontFamily: 'var(--pc-body)', position: 'relative' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link href={`/products/${product._id}`} style={{ display: 'block', textDecoration: 'none' }}>

          {/* ── Card shell ─────────────────────────────────────────────────── */}
          <div style={{
            position: 'relative',
            borderRadius: 20,
            overflow: 'hidden',
            background: 'linear-gradient(150deg, rgba(15,23,42,0.97) 0%, rgba(6,9,18,0.99) 100%)',
            border: `1px solid ${hovered ? 'rgba(99,102,241,0.38)' : 'rgba(30,41,59,0.75)'}`,
            boxShadow: hovered
              ? '0 -1px 0 rgba(99,102,241,0.25) inset, 0 28px 56px rgba(0,0,0,0.55), 0 6px 20px rgba(99,102,241,0.1)'
              : '0 1px 0 rgba(255,255,255,0.03) inset, 0 4px 16px rgba(0,0,0,0.35)',
            transform: `translateY(${hovered ? -8 : 0}px)`,
            transition: 'transform 0.38s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.38s ease, border-color 0.3s ease',
            backdropFilter: 'blur(16px)',
          }}>

            {/* Top shimmer line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: hovered
                ? 'linear-gradient(90deg, transparent, rgba(99,102,241,0.85), rgba(139,92,246,0.5), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(99,102,241,0.18), transparent)',
              transition: 'background 0.4s',
            }} />

            {/* ── Image zone ───────────────────────────────────────────────── */}
            <div style={{
              position: 'relative',
              aspectRatio: '1 / 1',
              background: '#050A14',
              backgroundImage: `
                radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.07) 0%, transparent 68%),
                linear-gradient(rgba(99,102,241,0.035) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99,102,241,0.035) 1px, transparent 1px)
              `,
              backgroundSize: '100% 100%, 26px 26px, 26px 26px',
              overflow: 'hidden',
            }}>
              {/* Corner crosshairs */}
              {[
                { top: 8, left: 8, borderTop: '1px solid rgba(99,102,241,0.35)', borderLeft: '1px solid rgba(99,102,241,0.35)' },
                { top: 8, right: 8, borderTop: '1px solid rgba(99,102,241,0.35)', borderRight: '1px solid rgba(99,102,241,0.35)' },
                { bottom: 8, left: 8, borderBottom: '1px solid rgba(99,102,241,0.35)', borderLeft: '1px solid rgba(99,102,241,0.35)' },
                { bottom: 8, right: 8, borderBottom: '1px solid rgba(99,102,241,0.35)', borderRight: '1px solid rgba(99,102,241,0.35)' },
              ].map((s, i) => (
                <span key={i} style={{ position: 'absolute', width: 12, height: 12, ...s }} />
              ))}

              {/* Product image / emoji placeholder */}
              {product.image ? (
                <img
                  src={product.image}
                  alt={title}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    transform: hovered ? 'scale(1.07)' : 'scale(1)',
                    transition: 'transform 0.5s cubic-bezier(0.34,1.3,0.64,1)',
                  }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{
                    filter: hovered ? 'drop-shadow(0 0 28px rgba(99,102,241,0.55))' : 'drop-shadow(0 8px 20px rgba(0,0,0,0.7))',
                    transform: hovered ? 'scale(1.12) translateY(-5px)' : 'scale(1) translateY(0)',
                    transition: 'transform 0.42s cubic-bezier(0.34,1.4,0.64,1), filter 0.42s ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(99,102,241,0.4)',
                  }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </span>
                </div>
              )}

              {/* Hover overlay */}
              {hovered && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
                  background: 'rgba(5,9,18,0.72)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  animation: 'overlay-fade 0.18s ease both',
                }}>
                  {[
                    { Icon: Eye, label: 'Quick View', href: `/products/${product._id}?qv=1` },
                    { Icon: Scale, label: 'Compare', href: `/compare?add=${product._id}` },
                  ].map(({ Icon, label, href }) => (
                    <a key={label} href={href}
                      onClick={e => e.stopPropagation()}
                      className="pc-overlay-action"
                    >
                      <span className="pc-overlay-icon">
                        <Icon size={19} strokeWidth={1.6} style={{ color: '#a5b4fc' }} />
                      </span>
                      <span style={{
                        fontFamily: 'var(--pc-mono)',
                        fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: 'rgba(165,180,252,0.75)',
                      }}>{label}</span>
                    </a>
                  ))}
                </div>
              )}

              {/* Flash badge */}
              <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {discount > 0 && <FlashBadge discount={discount} />}
                {product.isNew && (
                  <span style={{
                    fontFamily: 'var(--pc-mono)',
                    fontSize: 9, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase',
                    padding: '3px 8px', borderRadius: 4,
                    background: 'rgba(16,185,129,0.12)',
                    border: '1px solid rgba(16,185,129,0.4)',
                    color: '#34D399',
                  }}>NEW</span>
                )}
              </div>

              {/* Wishlist */}
              <button onClick={handleWish} style={{
                position: 'absolute', top: 10, right: 10,
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 10,
                background: 'rgba(6,9,18,0.72)',
                border: `1px solid ${wished ? 'rgba(239,68,68,0.45)' : 'rgba(30,41,59,0.75)'}`,
                backdropFilter: 'blur(4px)',
                cursor: 'pointer',
                boxShadow: wished ? '0 0 12px rgba(239,68,68,0.28)' : 'none',
                transform: wished ? 'scale(1.15)' : 'scale(1)',
                transition: 'transform 0.15s, border-color 0.2s, box-shadow 0.2s',
              }}>
                <span style={{ color: wished ? '#EF4444' : 'rgba(148,163,184,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                </span>
              </button>
            </div>

            {/* ── Body ─────────────────────────────────────────────────────── */}
            <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 9 }}>

              {/* Category + Reliability */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontFamily: 'var(--pc-mono)',
                  fontSize: 9, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'rgba(99,102,241,0.75)',
                }}>{product.category ?? 'Electronics'}</span>
                <ReliabilityDots score={reliability} />
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: 'var(--pc-display)',
                fontSize: 14, fontWeight: 800, lineHeight: 1.35,
                color: hovered ? '#E0E7FF' : '#CBD5E1',
                letterSpacing: '-0.01em',
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                transition: 'color 0.2s',
              }}>{title}</h3>

              {/* Spec pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {specs.map(s => <span key={s} className="pc-spec-pill">{s}</span>)}
              </div>

              {/* Description */}
              {product.description && (
                <p style={{
                  fontFamily: 'var(--pc-body)',
                  fontSize: 11, lineHeight: 1.65,
                  color: 'rgba(100,116,139,0.85)',
                  margin: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>{product.description}</p>
              )}

              {/* Divider */}
              <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(30,41,59,0.9), transparent)' }} />

              {/* Price + Cart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {discount > 0 && product.originalPrice && (
                    <span style={{
                      fontFamily: 'var(--pc-mono)',
                      fontSize: 11, textDecoration: 'line-through',
                      color: 'rgba(100,116,139,0.55)',
                      letterSpacing: '0.02em',
                    }}>₹{product.originalPrice?.toLocaleString()}</span>
                  )}
                  <span style={{
                    fontFamily: 'var(--pc-display)',
                    fontSize: 22, fontWeight: 900, lineHeight: 1,
                    letterSpacing: '-0.02em',
                    color: discount > 0 ? '#34D399' : '#F1F5F9',
                  }}>₹{product.price?.toLocaleString()}</span>
                  <div style={{ marginTop: 4 }}>
                    <StockPulse inStock={inStock} />
                  </div>
                </div>

                {/* Add to Cart — magnetic icon button */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={handleCart}
                    disabled={!inStock || cartState !== 'idle'}
                    title={inStock ? 'Add to Cart' : 'Out of Stock'}
                    style={{
                      position: 'relative',
                      width: 46, height: 46,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: 14, cursor: inStock ? 'pointer' : 'not-allowed',
                      opacity: inStock ? 1 : 0.35,
                      background: cartState === 'added'
                        ? 'rgba(16,185,129,0.18)'
                        : 'rgba(99,102,241,0.1)',
                      border: `1px solid ${cartState === 'added' ? 'rgba(16,185,129,0.5)' : 'rgba(99,102,241,0.3)'}`,
                      boxShadow: cartState === 'added'
                        ? '0 0 18px rgba(16,185,129,0.25)'
                        : 'none',
                      transform: cartState === 'adding' ? 'scale(0.9)' : 'scale(1)',
                      transition: 'all 0.22s cubic-bezier(0.34,1.4,0.64,1)',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={e => {
                      if (!inStock || cartState !== 'idle') return;
                      e.currentTarget.style.background = 'rgba(99,102,241,0.24)';
                      e.currentTarget.style.borderColor = 'rgba(99,102,241,0.65)';
                      e.currentTarget.style.boxShadow = '0 0 22px rgba(99,102,241,0.38)';
                      e.currentTarget.style.transform = 'scale(1.13)';
                    }}
                    onMouseLeave={e => {
                      if (!inStock || cartState !== 'idle') return;
                      e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
                      e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {/* Ripple ring */}
                    {cartState === 'adding' && (
                      <span style={{
                        position: 'absolute', inset: 0, borderRadius: 14,
                        background: 'rgba(99,102,241,0.28)',
                        animation: 'cart-ripple 0.6s cubic-bezier(0,0,0.2,1) forwards',
                      }} />
                    )}

                    {cartState === 'added'
                      ? <Check size={17} strokeWidth={2.5} style={{ color: '#34D399', position: 'relative' }} />
                      : <ShoppingCart size={17} strokeWidth={1.7} style={{ color: '#818CF8', position: 'relative' }} />
                    }
                  </button>
                </div>
              </div>

              {/* Low stock nudge */}
              {inStock && product.stock > 0 && product.stock <= 5 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontFamily: 'var(--pc-mono)',
                  fontSize: 10, color: '#F59E0B',
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>
                  <Zap size={9} strokeWidth={2.5} />
                  Only {product.stock} remaining
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
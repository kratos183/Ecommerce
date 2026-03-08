'use client';
import { useT } from '../../themeTokens';

import { redirect } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

async function getProduct(id) {
  try {
    const res = await fetch(`/api/products?limit=100`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    const product = data.products?.find(p => String(p._id) === String(id));
    return product || null;
  } catch {
    return null;
  }
}

async function getRelatedProducts(category) {
  try {
    const res = await fetch(`/api/products?category=${category}&limit=4`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const CAT_COLORS = {
  Laptops: '#00D4FF', Mobiles: '#FF6B35', Audio: '#A855F7',
  Tablets: '#10B981', Gaming: '#F59E0B', 'Smart Home': '#EC4899',
  Accessories: '#6366F1',
};
const getCatIcon = (cat) =>
  ({ Laptops: 'L', Mobiles: 'M', Audio: 'A', Tablets: 'T', Gaming: 'G', 'Smart Home': 'S', Accessories: 'X' }[cat] || 'P');

// Build gallery from product.images[] (with product.image as first fallback)
function buildGallery(product) {
  const imgs = Array.isArray(product.images) && product.images.length > 0 ? product.images : [];
  if (product.image && !imgs.includes(product.image)) imgs.unshift(product.image);
  return imgs;
}

// Mock reviews
const MOCK_REVIEWS = [
  { id: 1, author: 'Alex M.', rating: 5, date: 'Feb 12, 2025', title: 'Absolutely worth it', body: 'Performance is insane. Battery lasts all day and the display is gorgeous. Zero regrets.' },
  { id: 2, author: 'Priya S.', rating: 4, date: 'Jan 28, 2025', title: 'Great but pricey', body: 'Build quality is top-tier. A little expensive but you can feel the premium material in every detail.' },
  { id: 3, author: 'Jordan K.', rating: 5, date: 'Dec 5, 2024', title: 'Best purchase of the year', body: 'Replaced my 4-year-old device with this and the difference is night and day. Highly recommend.' },
  { id: 4, author: 'Sam T.', rating: 4, date: 'Nov 14, 2024', title: 'Solid performer', body: "Fast, reliable, great camera. Software updates are smooth. Customer support was also very helpful." },
];

function Stars({ rating, size = 14 }) {
  const t = useT();
  return (
    <span style={{ display: 'flex', gap: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= rating ? '#FBBF24' : t.borderStrong, fontSize: size }}>★</span>
      ))}
    </span>
  );
}

function RelatedCard({ product }) {
  const t = useT();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const color = CAT_COLORS[product.category] || '#6366F1';
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: t.bgCard,
        border: `1px solid ${hovered ? color + '44' : t.borderCard}`,
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'transform 0.25s, border-color 0.25s, box-shadow 0.25s',
        transform: hovered ? 'translateY(-5px)' : 'none',
        boxShadow: hovered ? `0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px ${color}18` : 'none',
      }}>
      <Link href={`/products/${product._id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ height: 160, background: `linear-gradient(135deg, ${color}12, ${t.bgCard})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, transition: 'transform 0.3s', transform: hovered ? 'scale(1.08)' : 'scale(1)', overflow: 'hidden', position: 'relative' }}>
          {(product.image || (product.images && product.images[0])) ? (
            <img src={product.image || product.images[0]} alt={product.name || product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s', transform: hovered ? 'scale(1.08)' : 'scale(1)' }} />
          ) : (
            <span style={{ color: t.textFaint, opacity: 0.3 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </span>
          )}
        </div>
        <div style={{ padding: 16 }}>
          {discount > 0 && <span style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 4, fontFamily: 'sans-serif', marginBottom: 6, display: 'inline-block' }}>-{discount}%</span>}
          <h4 style={{ color: t.textPrimary, fontSize: 13, fontWeight: 700, fontFamily: 'sans-serif', marginBottom: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
            {product.name || product.title}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: t.textPrimary, fontSize: 18, fontWeight: 900, fontFamily: 'sans-serif' }}>₹{product.price?.toLocaleString()}</span>
            <button onClick={(e) => { e.preventDefault(); setAdded(true); setTimeout(() => setAdded(false), 1500); }} style={{
              background: added ? '#10B981' : '#1D4ED8',
              color: '#fff', border: 'none', borderRadius: 8,
              padding: '7px 12px', fontSize: 11, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'sans-serif',
              transition: 'background 0.2s',
            }}>{added ? 'Added' : '+ Cart'}</button>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── MAIN CLIENT ──────────────────────────────────────────────────────────────
function ProductDetailClient({ product, relatedProducts = [] }) {
  const t = useT();
  const catColor = CAT_COLORS[product.category] || '#6366F1';
  const catIcon = getCatIcon(product.category);
  const name = product.name || product.title || 'Unknown Product';
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  // Build real gallery from product.images / product.image
  const gallery = buildGallery(product);
  const hasGallery = gallery.length > 0;

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [expandedSpec, setExpandedSpec] = useState(null);
  const heroRef = useRef(null);

  // Show sticky bar when hero CTA scrolls out
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (heroRef.current) obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  const handleAddToCart = async () => {
    setAdded(true);
    const cart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    const existing = cart.find(item => item.productId === product._id);
    if (existing) existing.quantity += qty;
    else cart.push({ productId: product._id, quantity: qty });
    localStorage.setItem('guestCart', JSON.stringify(cart));

    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id, quantity: qty }),
      });
    } catch { }

    setTimeout(() => setAdded(false), 2000);
  };
  const avgRating = (MOCK_REVIEWS.reduce((s, r) => s + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1);

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'specs', label: 'Specifications' },
    { id: 'reviews', label: `Reviews (${MOCK_REVIEWS.length})` },
    { id: 'shipping', label: 'Shipping & Returns' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { background:${t.bgPage}; font-family: sans-serif; color:${t.textPrimary}; }

        @keyframes fadeIn   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes scaleIn  { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        @keyframes slideDown{ from{opacity:0;transform:translateY(-100%)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.5} }

        .thumb-btn { transition: border-color 0.15s, opacity 0.15s; }
        .thumb-btn:hover { opacity:1 !important; border-color: rgba(255,255,255,0.35) !important; }
        .tab-btn { transition: color 0.15s, border-color 0.15s; }
        .spec-row:hover { background: ${t.bgOverlay}; }
        .trust-item { transition: color 0.15s; }
        .trust-item:hover span:first-child { filter: brightness(1.3); }

        @media(max-width:900px){
          .product-grid { grid-template-columns:1fr !important; gap: 32px !important; }
          .gallery-container { flex-direction:column-reverse !important; }
          .gallery-thumbs { flex-direction:row !important; overflow-x:auto; }
          .gallery-main { height:400px !important; }
          .overview-grid, .reviews-grid, .shipping-grid { grid-template-columns:1fr !important; gap: 24px !important; }
        }
        @media(max-width:640px){
          .gallery-main { height:300px !important; }
          .related-grid { grid-template-columns:repeat(2,1fr) !important; gap: 12px !important; }
          .related-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .tab-row { overflow-x:auto; margin-bottom: 24px !important; padding-bottom: 4px; }
          .trust-row { flex-wrap: wrap; gap: 12px !important; }
          .spec-preview-grid { grid-template-columns: 1fr !important; }
          .action-buttons-wrap { flex-wrap: wrap; }
          .add-to-cart-btn { min-width: 100% !important; }
          .icon-btn { flex: 1 !important; }
          .sticky-bar { padding: 12px 16px !important; }
          .page-padding { padding-left: 16px !important; padding-right: 16px !important; }
          .sticky-icon { display: none !important; }
          .specs-fallback-grid { grid-template-columns: repeat(auto-fill,minmax(140px,1fr)) !important; }
        }
      `}</style>

      <div style={{ background: t.bgPage, minHeight: '100vh' }}>

        {/* ── STICKY BAR ──────────────────────────────────────────────────── */}
        {stickyVisible && (
          <div className="sticky-bar" style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 150,
            background: t.bgBottomNav, backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${t.borderMuted}`,
            padding: '12px 32px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            animation: 'slideDown 0.25s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="sticky-icon" style={{ fontSize: 28 }}>{catIcon}</span>
              <div>
                <p style={{ color: t.textPrimary, fontSize: 14, fontWeight: 700, fontFamily: 'sans-serif', lineHeight: 1.2 }}>{name}</p>
                <p style={{ color: t.textMuted, fontSize: 12 }}>{product.category}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ color: t.textPrimary, fontSize: 20, fontWeight: 900, fontFamily: 'sans-serif' }}>₹{product.price?.toLocaleString()}</span>
              <button onClick={handleAddToCart} style={{
                background: added ? '#10B981' : `linear-gradient(135deg, ${catColor}, ${catColor}cc)`,
                color: '#fff', border: 'none', borderRadius: 10,
                padding: '10px 22px', fontSize: 13, fontWeight: 800, cursor: 'pointer',
                fontFamily: 'sans-serif',
                boxShadow: added ? 'none' : `0 4px 16px ${catColor}55`,
                transition: 'background 0.2s',
              }}>{added ? 'Added' : '+ Cart'}</button>
            </div>
          </div>
        )}

        {/* ── BREADCRUMB ───────────────────────────────────────────────────── */}
        <div className="page-padding" style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 32px 0', animation: 'fadeIn 0.4s ease' }}>
          <p style={{ color: t.textVeryFaint, fontSize: 12, fontWeight: 600, fontFamily: 'sans-serif' }}>
            <Link href="/" style={{ color: t.textVeryFaint, textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = t.textSecondary}
              onMouseLeave={e => e.currentTarget.style.color = t.textVeryFaint}>Home</Link>
            <span style={{ margin: '0 6px', color: t.borderMuted }}>›</span>
            <Link href="/products" style={{ color: t.textVeryFaint, textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = t.textSecondary}
              onMouseLeave={e => e.currentTarget.style.color = t.textVeryFaint}>Products</Link>
            {product.category && <>
              <span style={{ margin: '0 6px', color: t.borderMuted }}>›</span>
              <Link href={`/products?category=${product.category}`} style={{ color: catColor, textDecoration: 'none' }}>{product.category}</Link>
            </>}
            <span style={{ margin: '0 6px', color: t.borderMuted }}>›</span>
            <span style={{ color: t.textSecondary }}>{name.split(' ').slice(0, 4).join(' ')}</span>
          </p>
        </div>

        {/* ── HERO GRID ────────────────────────────────────────────────────── */}
        <div className="page-padding" style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 32px' }}>
          <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start', animation: 'fadeIn 0.5s ease' }}>

            {/* ── GALLERY ──────────────────────────────────────────────────── */}
            <div className="gallery-container" style={{ display: 'flex', gap: 12, flexDirection: 'row' }}>
              {/* Thumbs — only shown when we have multiple images */}
              {hasGallery && gallery.length > 1 && (
                <div className="gallery-thumbs" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {gallery.map((imgUrl, i) => (
                    <button key={i} onClick={() => setActiveImg(i)} className="thumb-btn" style={{
                      width: 64, height: 64, borderRadius: 12, flexShrink: 0,
                      background: `linear-gradient(135deg, ${catColor}18, ${t.borderCard})`,
                      border: `2px solid ${activeImg === i ? catColor : t.borderSubtle}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 24, cursor: 'pointer',
                      opacity: activeImg === i ? 1 : 0.55,
                      boxShadow: activeImg === i ? `0 0 12px ${catColor}44` : 'none',
                      transition: 'all 0.15s',
                      overflow: 'hidden', padding: 0,
                    }}>
                      <img src={imgUrl} alt={`View ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div style={{ flex: 1 }}>
                <div className="gallery-main" style={{
                  height: 480,
                  background: `radial-gradient(circle at 40% 40%, ${catColor}14 0%, ${t.bgHero} 70%)`,
                  border: `1px solid ${catColor}22`,
                  borderRadius: 24,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden',
                  animation: 'scaleIn 0.4s ease',
                }}>
                  {/* Background grid */}
                  <div style={{
                    position: 'absolute', inset: 0, opacity: 0.03,
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',
                    backgroundSize: '40px 40px', pointerEvents: 'none'
                  }} />

                  {/* Glow */}
                  <div style={{
                    position: 'absolute', width: 320, height: 320, borderRadius: '50%',
                    background: `radial-gradient(circle, ${catColor}28 0%, transparent 70%)`,
                    pointerEvents: 'none'
                  }} />

                  {/* Main image or fallback icon */}
                  {hasGallery ? (
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                      <img
                        key={activeImg}
                        src={gallery[activeImg]}
                        alt={`${name} - view ${activeImg + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: `drop-shadow(0 24px 48px ${catColor}66)`, animation: 'scaleIn 0.2s ease' }}
                      />
                    </div>
                  ) : (
                    <span style={{ fontSize: 14, fontWeight: 900, position: 'relative', color: catColor, fontFamily: 'sans-serif', userSelect: 'none', lineHeight: 1, background: `${catColor}18`, width: 120, height: 120, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </span>
                  )}

                  {/* Badges */}
                  <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {product.badge && (
                      <span style={{ background: product.badge === 'Best Seller' ? '#F59E0B' : product.badge === 'New' ? '#10B981' : '#EF4444', color: '#000', fontSize: 10, fontWeight: 900, padding: '4px 10px', borderRadius: 6, fontFamily: 'sans-serif', textTransform: 'uppercase' }}>{product.badge}</span>
                    )}
                    {discount > 0 && (
                      <span style={{ background: 'rgba(239,68,68,0.9)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 6, fontFamily: 'sans-serif' }}>-{discount}%</span>
                    )}
                  </div>

                  {/* Zoom hint */}
                  <div style={{ position: 'absolute', bottom: 14, right: 14, background: 'rgba(0,0,0,0.5)', border: `1px solid ${t.borderSubtle}`, borderRadius: 8, padding: '4px 10px', color: '#64748B', fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                    Hover to zoom
                  </div>
                </div>

                {/* Image nav dots — only when multiple images exist */}
                {hasGallery && gallery.length > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
                    {gallery.map((_, i) => (
                      <button key={i} onClick={() => setActiveImg(i)} style={{
                        width: activeImg === i ? 20 : 6, height: 6,
                        borderRadius: 3, border: 'none', cursor: 'pointer',
                        background: activeImg === i ? catColor : t.borderStrong,
                        transition: 'width 0.2s, background 0.2s', padding: 0,
                      }} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── PRODUCT INFO ─────────────────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.6s ease 0.1s both' }} ref={heroRef}>

              {/* Category + rating row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link href={`/products?category=${product.category}`} style={{
                  background: `${catColor}18`, border: `1px solid ${catColor}44`,
                  color: catColor, borderRadius: 20, padding: '5px 14px',
                  fontSize: 12, fontWeight: 700, textDecoration: 'none', fontFamily: 'sans-serif',
                }}>{product.category}</Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Stars rating={Math.round(parseFloat(avgRating))} size={13} />
                  <span style={{ color: t.textSecondary, fontSize: 12 }}>{avgRating} · {MOCK_REVIEWS.length} reviews</span>
                </div>
              </div>

              {/* Name */}
              <h1 style={{ color: t.textPrimary, fontSize: 'clamp(22px,3vw,36px)', fontWeight: 900, fontFamily: 'sans-serif', lineHeight: 1.15, letterSpacing: '-0.02em' }}>{name}</h1>

              {/* Price */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 14, padding: '16px 20px', background: t.bgOverlay, border: `1px solid ${t.borderSubtle}`, borderRadius: 16 }}>
                <span style={{ color: t.textPrimary, fontSize: 40, fontWeight: 900, fontFamily: 'sans-serif', lineHeight: 1 }}>
                  ₹{product.price?.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span style={{ color: t.borderStrong, fontSize: 18, textDecoration: 'line-through' }}>
                    ₹{product.originalPrice?.toLocaleString()}
                  </span>
                )}
                {discount > 0 && (
                  <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', fontSize: 13, fontWeight: 700, padding: '3px 10px', borderRadius: 6, fontFamily: 'sans-serif' }}>
                    Save ₹{(product.originalPrice - product.price)?.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {product.stock > 0 ? (
                  <>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981', display: 'inline-block' }} />
                    <span style={{ color: '#10B981', fontSize: 13, fontWeight: 600 }}>
                      In Stock{product.stock <= 5 ? ` — Only ${product.stock} remaining!` : ` (${product.stock} units)`}
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
                    <span style={{ color: '#EF4444', fontSize: 13, fontWeight: 600 }}>Out of Stock</span>
                  </>
                )}
                {product.stock > 0 && product.stock <= 5 && (
                  <span style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, fontFamily: 'sans-serif', animation: 'pulse 2s infinite' }}>Almost gone!</span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p style={{ color: t.textSecondary, fontSize: 14, lineHeight: 1.75 }}>{product.description}</p>
              )}

              {/* Key specs preview */}
              {product.specifications && (
                <div className="spec-preview-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {Object.entries(product.specifications).slice(0, 4).map(([k, v]) => (
                    <div key={k} style={{ background: t.bgOverlay, border: `1px solid ${t.borderSubtle}`, borderRadius: 10, padding: '10px 14px' }}>
                      <p style={{ color: t.textFaint, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2, fontFamily: 'sans-serif' }}>{k}</p>
                      <p style={{ color: t.textPrimary, fontSize: 13, fontWeight: 600, fontFamily: 'sans-serif' }}>{v}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity selector */}
              {product.stock > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ color: '#64748B', fontSize: 13, fontWeight: 600, fontFamily: 'sans-serif' }}>Qty:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'rgba(255,255,255,0.05)', border: `1px solid ${t.borderSubtle}`, borderRadius: 12, overflow: 'hidden' }}>
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 40, height: 40, background: 'none', border: 'none', color: t.textSecondary, fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>−</button>
                    <span style={{ width: 40, textAlign: 'center', color: t.textPrimary, fontSize: 15, fontWeight: 700, fontFamily: 'sans-serif' }}>{qty}</span>
                    <button onClick={() => setQty(q => Math.min(product.stock || 10, q + 1))} style={{ width: 40, height: 40, background: 'none', border: 'none', color: t.textSecondary, fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>+</button>
                  </div>
                  <span style={{ color: t.textVeryFaint, fontSize: 12 }}>Max: {product.stock}</span>
                </div>
              )}

              {/* CTA buttons */}
              <div className="action-buttons-wrap" style={{ display: 'flex', gap: 12 }}>
                {product.stock > 0 ? (
                  <>
                    <button className="add-to-cart-btn" onClick={handleAddToCart} style={{
                      flex: 1,
                      background: added ? '#10B981' : `linear-gradient(135deg, ${catColor}, ${catColor}bb)`,
                      color: '#fff', border: 'none', borderRadius: 14,
                      padding: '16px', fontSize: 15, fontWeight: 800,
                      cursor: 'pointer', fontFamily: 'sans-serif',
                      boxShadow: added ? 'none' : `0 8px 24px ${catColor}44`,
                      transition: 'background 0.25s, transform 0.15s, box-shadow 0.25s',
                      transform: added ? 'scale(0.98)' : 'scale(1)',
                      letterSpacing: '0.01em',
                    }}
                      onMouseEnter={e => { if (!added) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${catColor}66`; } }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = added ? 'none' : `0 8px 24px ${catColor}44`; }}>
                      {added ? 'Added to Cart!' : `Add ${qty > 1 ? `${qty}x` : ''} to Cart`}
                    </button>
                    <button className="icon-btn" onClick={() => setWished(w => !w)} style={{
                      width: 52, borderRadius: 14, border: `1px solid ${wished ? '#EF4444' : t.borderSubtle}`,
                      background: wished ? 'rgba(239,68,68,0.15)' : t.bgInput,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s',
                      transform: wished ? 'scale(1.1)' : 'scale(1)',
                      color: wished ? '#EF4444' : t.textFaint,
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                      </svg>
                    </button>
                    <button className="icon-btn" style={{
                      width: 52, borderRadius: 14,
                      border: `1px solid ${t.borderSubtle}`,
                      background: t.bgInput,
                      fontSize: 18, cursor: 'pointer', color: '#64748B',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.15s',
                    }}
                      title="Share"
                      onMouseEnter={e => e.currentTarget.style.background = t.borderInput}
                      onMouseLeave={e => e.currentTarget.style.background = t.bgInput}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                    </button>
                  </>
                ) : (
                  <button style={{
                    flex: 1, background: t.bgInput, border: `1px solid ${t.borderSubtle}`,
                    color: '#64748B', borderRadius: 14, padding: '16px', fontSize: 15, fontWeight: 700, cursor: 'not-allowed',
                    fontFamily: 'sans-serif',
                  }}>Out of Stock</button>
                )}
              </div>

              {/* Trust row */}
              <div className="trust-row" style={{ display: 'flex', gap: 16, paddingTop: 12, borderTop: `1px solid ${t.borderNav}` }}>
                {[['Delivery', 'Free Next-Day Delivery'], ['Warranty', '2-Year Warranty'], ['Returns', '30-Day Returns'], ['Secure', 'Secure Checkout']].map(([icon, label]) => (
                  <div key={label} className="trust-item" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: catColor, fontFamily: 'sans-serif' }}>{icon.charAt(0)}</span>
                    <span style={{ color: t.textFaint, fontSize: 10, fontWeight: 600, fontFamily: 'sans-serif', lineHeight: 1.3 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── TABS SECTION ─────────────────────────────────────────────────── */}
        <div className="page-padding" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px 32px' }}>

          {/* Tab nav */}
          <div className="tab-row" style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${t.borderNav}`, marginBottom: 36 }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="tab-btn" style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '14px 22px', fontSize: 13, fontWeight: 700,
                fontFamily: 'sans-serif',
                color: activeTab === tab.id ? catColor : t.textFaint,
                borderBottom: `2px solid ${activeTab === tab.id ? catColor : 'transparent'}`,
                whiteSpace: 'nowrap',
                transition: 'color 0.15s, border-color 0.15s',
              }}>{tab.label}</button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="overview-grid" style={{ animation: 'fadeIn 0.3s ease', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <h3 style={{ color: t.textPrimary, fontSize: 18, fontWeight: 800, fontFamily: 'sans-serif', marginBottom: 14 }}>About this product</h3>
                <p style={{ color: t.textSecondary, fontSize: 14, lineHeight: 1.8 }}>
                  {product.description || 'Experience premium quality and performance engineered for those who demand the best. Crafted with precision and designed for real-world use, this product redefines what you can expect from cutting-edge technology.'}
                </p>
                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[['Performance', 'Blazing Fast Performance', 'Powered by the latest generation hardware for instant responsiveness.'],
                  ['Quality', 'Premium Build Quality', 'Aircraft-grade materials with precision craftsmanship throughout.'],
                  ['Battery', 'All-Day Battery', 'Engineered for longevity - keep going without searching for an outlet.'],
                  ].map(([icon, title, desc]) => (
                    <div key={title} style={{ display: 'flex', gap: 14, padding: '14px 16px', background: t.bgSubtle, border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 900, color: catColor, fontFamily: 'sans-serif', flexShrink: 0, width: 22, textAlign: 'center' }}>{icon.charAt(0)}</span>
                      <div>
                        <p style={{ color: t.textPrimary, fontSize: 13, fontWeight: 700, fontFamily: 'sans-serif', marginBottom: 3 }}>{title}</p>
                        <p style={{ color: '#64748B', fontSize: 12, lineHeight: 1.5 }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ color: t.textPrimary, fontSize: 18, fontWeight: 800, fontFamily: 'sans-serif', marginBottom: 14 }}>In the Box</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['Device unit × 1', 'Power adapter & cable', 'Quick start guide', 'Warranty card', 'Protective case'].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: t.bgSubtle, border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10 }}>
                      <span style={{ color: catColor, fontSize: 12 }}>✓</span>
                      <span style={{ color: t.textSecondary, fontSize: 13 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Specifications */}
          {activeTab === 'specs' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              {product.specifications ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {Object.entries(product.specifications).map(([key, value], i) => (
                    <div key={key} className="spec-row" style={{
                      display: 'flex', alignItems: 'center',
                      padding: '14px 18px',
                      background: i % 2 === 0 ? t.bgSubtle : 'transparent',
                      borderRadius: 10,
                      cursor: 'pointer',
                    }} onClick={() => setExpandedSpec(expandedSpec === key ? null : key)}>
                      <span style={{ width: '40%', color: '#64748B', fontSize: 13, fontWeight: 600, fontFamily: 'sans-serif' }}>{key}</span>
                      <span style={{ flex: 1, color: t.textPrimary, fontSize: 13, fontWeight: 600 }}>{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="specs-fallback-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
                  {[['Processor', 'Latest Gen Chip'], ['RAM', '16 GB'], ['Storage', '512 GB SSD'], ['Display', 'Retina XDR'], ['Battery', '22 hours'], ['Weight', '1.6 kg'], ['OS', 'Latest Version'], ['Connectivity', 'Wi-Fi 6E, Bluetooth 5.3']].map(([k, v]) => (
                    <div key={k} style={{ background: t.bgOverlay, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px' }}>
                      <p style={{ color: t.textFaint, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontFamily: 'sans-serif' }}>{k}</p>
                      <p style={{ color: t.textPrimary, fontSize: 14, fontWeight: 700, fontFamily: 'sans-serif' }}>{v}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reviews */}
          {activeTab === 'reviews' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 40 }}>
                {/* Summary */}
                <div style={{ background: t.bgSubtle, border: `1px solid ${t.borderSubtle}`, borderRadius: 20, padding: 28, textAlign: 'center', alignSelf: 'start' }}>
                  <p style={{ color: t.textPrimary, fontSize: 64, fontWeight: 900, fontFamily: 'sans-serif', lineHeight: 1 }}>{avgRating}</p>
                  <Stars rating={Math.round(parseFloat(avgRating))} size={18} />
                  <p style={{ color: t.textFaint, fontSize: 13, marginTop: 8 }}>{MOCK_REVIEWS.length} verified reviews</p>
                  <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[5, 4, 3, 2, 1].map(r => {
                      const count = MOCK_REVIEWS.filter(rv => rv.rating === r).length;
                      const pct = Math.round((count / MOCK_REVIEWS.length) * 100);
                      return (
                        <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: '#FBBF24', fontSize: 11, width: 12 }}>{r}</span>
                          <div style={{ flex: 1, height: 4, background: t.borderMuted, borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: catColor, borderRadius: 2, transition: 'width 0.6s ease' }} />
                          </div>
                          <span style={{ color: t.textFaint, fontSize: 11, width: 28 }}>{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Review list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {MOCK_REVIEWS.map((review, i) => (
                    <div key={review.id} style={{ background: t.bgSubtle, border: `1px solid ${t.borderSubtle}`, borderRadius: 16, padding: 22, animation: `fadeIn 0.4s ease ${i * 0.08}s both` }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div>
                          <p style={{ color: t.textPrimary, fontSize: 14, fontWeight: 700, fontFamily: 'sans-serif', marginBottom: 4 }}>{review.title}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Stars rating={review.rating} size={12} />
                            <span style={{ color: t.textFaint, fontSize: 11 }}>{review.author} · {review.date}</span>
                            <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, fontFamily: 'sans-serif' }}>✓ Verified</span>
                          </div>
                        </div>
                      </div>
                      <p style={{ color: t.textSecondary, fontSize: 13, lineHeight: 1.7 }}>{review.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Shipping */}
          {activeTab === 'shipping' && (
            <div className="shipping-grid" style={{ animation: 'fadeIn 0.3s ease', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {[
                ['Delivery', 'Next-Day Delivery', 'Order before 3pm for guaranteed next-business-day delivery. Free on orders over ₹50.'],
                ['Returns', '30-Day Returns', 'Changed your mind? Return any item in original condition within 30 days, no questions asked.'],
                ['Warranty', '2-Year Warranty', 'All products come with a comprehensive 2-year manufacturer warranty covering defects.'],
                ['Support', 'Tech Support', '24/7 expert tech support via chat, phone, or email. Real humans, not bots.'],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ background: t.bgSubtle, border: `1px solid ${t.borderSubtle}`, borderRadius: 16, padding: 24 }}>
                  <span style={{ fontSize: 16, fontWeight: 900, fontFamily: 'sans-serif', display: 'block', marginBottom: 12, color: catColor }}>{icon}</span>
                  <h4 style={{ color: t.textPrimary, fontSize: 15, fontWeight: 800, fontFamily: 'sans-serif', marginBottom: 8 }}>{title}</h4>
                  <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.7 }}>{desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RELATED PRODUCTS ─────────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="page-padding" style={{ background: t.bgAlt, borderTop: `1px solid ${t.borderNav}`, padding: '56px 32px' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
              <div className="related-header" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}>
                <div>
                  <p style={{ color: catColor, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'sans-serif', marginBottom: 4 }}>More like this</p>
                  <h2 style={{ color: t.textPrimary, fontSize: 28, fontWeight: 900, fontFamily: 'sans-serif' }}>Related Products</h2>
                </div>
                <Link href={`/products?category=${product.category}`} style={{ color: catColor, fontSize: 13, fontWeight: 700, textDecoration: 'none', fontFamily: 'sans-serif' }}>View all {product.category} →</Link>
              </div>
              <div className="related-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
                {relatedProducts.map(p => <RelatedCard key={p._id} product={p} />)}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function ProductPage({ params }) {
  const t = useT();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { id } = await params;
      const prod = await getProduct(id);
      if (!prod) {
        setLoading(false);
        return;
      }
      setProduct(prod);
      const related = await getRelatedProducts(prod.category);
      setRelatedProducts(related.filter(p => p._id !== prod._id).slice(0, 4));
      setLoading(false);
    };
    fetchData();
  }, [params]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.textPrimary, background: t.bgPage, fontSize: 24, fontWeight: 'bold' }}>Product Not Found</div>;
  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
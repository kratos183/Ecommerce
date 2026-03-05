// app/cart/CartClient.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useT } from '../themeTokens';

const getCatIcon = (cat) =>
  ({ Laptops: '💻', Mobiles: '📱', Audio: '🎧', Tablets: '📟', Gaming: '🎮', 'Smart Home': '🏠', Accessories: '🔌' }[cat] || '📦');

const CAT_COLORS = {
  Laptops: '#00D4FF', Mobiles: '#FF6B35', Audio: '#A855F7',
  Tablets: '#10B981', Gaming: '#F59E0B', 'Smart Home': '#EC4899', Accessories: '#6366F1',
};

function SkeletonRow({ t }) {
  return (
    <div style={{ background: t.bgCard, border: `1px solid ${t.borderCard}`, borderRadius: 18, padding: 24, display: 'flex', gap: 20, transition: 'background 0.35s, border-color 0.35s' }}>
      <div style={{ width: 96, height: 96, borderRadius: 14, background: `linear-gradient(90deg, ${t.shimmer1} 25%, ${t.shimmer2} 50%, ${t.shimmer1} 75%)`, backgroundSize: '400% 100%', animation: 'shimmer 1.4s infinite', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[70, 45, 30].map((w, i) => (
          <div key={i} style={{ height: 12, borderRadius: 6, background: `linear-gradient(90deg, ${t.shimmer1} 25%, ${t.shimmer2} 50%, ${t.shimmer1} 75%)`, backgroundSize: '400% 100%', animation: 'shimmer 1.4s infinite', width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

function CartItem({ item, onUpdate, onRemove, t }) {
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [hovered, setHovered] = useState(false);

  const product = item.product;
  const total = ((product?.price || 0) * item.quantity).toFixed(2);
  const catColor = CAT_COLORS[product?.category] || '#6366F1';
  const discount = product?.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const handleQty = async (newQty) => {
    if (newQty < 1) return;
    setUpdating(true);
    await onUpdate(product._id, newQty);
    setUpdating(false);
  };

  const handleRemove = async () => {
    setRemoving(true);
    await onRemove(product._id);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rsp-cart-item"
      style={{
        background: t.bgCard,
        border: `1px solid ${hovered ? catColor + '44' : t.borderCard}`,
        borderRadius: 18,
        padding: 24,
        transition: 'border-color 0.25s, box-shadow 0.25s, opacity 0.3s, transform 0.3s, background 0.35s',
        boxShadow: hovered ? `0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px ${catColor}18` : 'none',
        opacity: removing ? 0 : 1,
        transform: removing ? 'translateX(30px)' : 'none',
        animation: 'fadeSlideUp 0.4s ease both',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left accent */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: catColor, borderRadius: '18px 0 0 18px', opacity: hovered ? 1 : 0, transition: 'opacity 0.25s' }} />

      {/* Product image */}
      <Link href={`/products/${product?._id}`} className="rsp-cart-img" style={{
        borderRadius: 14, overflow: 'hidden',
        background: `linear-gradient(135deg, ${catColor}18, ${t.borderCard})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 46, textDecoration: 'none',
        border: `1px solid ${catColor}22`,
        transition: 'transform 0.25s',
        transform: hovered ? 'scale(1.04)' : 'scale(1)',
      }}>
        {product?.image
          ? <img src={product.image} alt={product.title || product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          : <span style={{ filter: `drop-shadow(0 4px 12px ${catColor}55)` }}>{getCatIcon(product?.category)}</span>
        }
      </Link>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ background: `${catColor}18`, border: `1px solid ${catColor}33`, color: catColor, fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 20, fontFamily: 'Syne,sans-serif', letterSpacing: '0.06em' }}>
            {product?.category}
          </span>
          {discount > 0 && <span style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, fontFamily: 'Syne,sans-serif' }}>-{discount}%</span>}
        </div>

        <Link href={`/products/${product?._id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            color: t.textPrimary, fontSize: 15, fontWeight: 700, fontFamily: 'Syne,sans-serif', marginBottom: 4, lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            transition: 'color 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = catColor}
            onMouseLeave={e => e.currentTarget.style.color = t.textPrimary}
          >{product?.name || product?.title}</h3>
        </Link>

        {product?.originalPrice && (
          <p style={{ color: t.textFaint, fontSize: 12, marginBottom: 8, transition: 'color 0.35s' }}>
            <span style={{ textDecoration: 'line-through' }}>${product.originalPrice?.toLocaleString()}</span>
            <span style={{ color: '#10B981', marginLeft: 6, fontWeight: 600 }}>Save ${(product.originalPrice - product.price)?.toLocaleString()}</span>
          </p>
        )}

        {/* Quantity stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', background: t.bgSubtle, border: `1px solid ${t.borderInput}`, borderRadius: 12, overflow: 'hidden', transition: 'background 0.35s, border-color 0.35s' }}>
            <button onClick={() => handleQty(item.quantity - 1)} disabled={updating || item.quantity <= 1} style={{
              width: 36, height: 36, background: 'none', border: 'none', color: item.quantity <= 1 ? t.textVeryFaint : t.textSecondary,
              fontSize: 18, cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s, color 0.15s',
            }}
              onMouseEnter={e => { if (item.quantity > 1) e.currentTarget.style.background = t.bgHover; }}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >−</button>
            <span style={{
              width: 36, textAlign: 'center', color: t.textPrimary, fontSize: 14, fontWeight: 700, fontFamily: 'Syne,sans-serif',
              opacity: updating ? 0.5 : 1, transition: 'opacity 0.15s, color 0.35s',
            }}>{updating ? '…' : item.quantity}</span>
            <button onClick={() => handleQty(item.quantity + 1)} disabled={updating} style={{
              width: 36, height: 36, background: 'none', border: 'none', color: t.textSecondary,
              fontSize: 18, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = t.bgHover}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >+</button>
          </div>

          <button onClick={handleRemove} disabled={removing} style={{
            background: 'none', border: 'none', color: '#EF4444', fontSize: 12, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Syne,sans-serif', opacity: removing ? 0.5 : 1,
            display: 'flex', alignItems: 'center', gap: 4, padding: '4px 0',
            transition: 'opacity 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={e => e.currentTarget.style.opacity = removing ? '0.5' : '1'}
          >
            🗑 Remove
          </button>

          <Link href={`/products/${product?._id}`} style={{
            color: t.textFaint, fontSize: 12, fontWeight: 600,
            textDecoration: 'none', fontFamily: 'Syne,sans-serif',
            transition: 'color 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = t.textSecondary}
            onMouseLeave={e => e.currentTarget.style.color = t.textFaint}
          >View details →</Link>
        </div>
      </div>

      {/* Price */}
      <div className="rsp-cart-price" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: t.textPrimary, fontSize: 22, fontWeight: 900, fontFamily: 'Syne,sans-serif', lineHeight: 1, transition: 'color 0.35s' }}>${total}</p>
          <p style={{ color: t.textFaint, fontSize: 11, marginTop: 3, transition: 'color 0.35s' }}>${product?.price?.toLocaleString()} each</p>
        </div>
        {item.quantity > 1 && (
          <span style={{ background: 'rgba(99,102,241,0.1)', color: '#818CF8', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, fontFamily: 'Syne,sans-serif' }}>
            ×{item.quantity}
          </span>
        )}
      </div>
    </div>
  );
}

export default function CartClient() {
  const t = useT();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const router = useRouter();

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      // Always check localStorage first
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      if (guestCart.length > 0) {
        const res2 = await fetch(`/api/products?limit=100`);
        const data = await res2.json();
        const items = guestCart.map(item => ({
          product: data.products.find(p => String(p._id) === String(item.productId)),
          quantity: item.quantity
        })).filter(i => i.product);
        setCart({ items });
        setLoading(false);
        return;
      }

      // Try API cart if no localStorage cart
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart);
      } else {
        setCart({ items: [] });
      }
    } catch {
      console.error('Failed to fetch cart');
      setCart({ items: [] });
    }
    finally { setLoading(false); }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    const item = guestCart.find(i => i.productId === productId);
    if (item) item.quantity = quantity;
    localStorage.setItem('guestCart', JSON.stringify(guestCart));
    fetchCart();
  };

  const removeItem = async (productId) => {
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    const filtered = guestCart.filter(i => i.productId !== productId);
    localStorage.setItem('guestCart', JSON.stringify(filtered));
    fetchCart();
  };

  const handlePromo = () => {
    if (promoCode.toUpperCase() === 'TECH20') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
      setPromoApplied(false);
    }
  };

  const subtotal = cart?.items?.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0) || 0;
  const discount = promoApplied ? subtotal * 0.2 : 0;
  const total = subtotal - discount;
  const itemCount = cart?.items?.reduce((s, i) => s + i.quantity, 0) || 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes shimmer{0%{background-position:-400% 0}100%{background-position:400% 0}}
        @keyframes fadeSlideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        input::placeholder{color:inherit; opacity:0.4;}
        input:focus{outline:none;}
      `}</style>

      <div style={{ background: t.bgPage, minHeight: '100vh', padding: '0 0 80px', fontFamily: 'DM Sans, sans-serif', color: t.textPrimary, transition: 'background 0.35s, color 0.35s' }}>

        {/* Header */}
        <div className="rsp-section-pad" style={{ background: `linear-gradient(180deg, ${t.bgSection} 0%, ${t.bgPage} 100%)`, borderBottom: `1px solid ${t.borderNav}`, transition: 'background 0.35s, border-color 0.35s' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <p style={{ color: t.textVeryFaint, fontSize: 12, fontWeight: 600, fontFamily: 'Syne,sans-serif', marginBottom: 6, transition: 'color 0.35s' }}>
              <Link href="/" style={{ color: t.textVeryFaint, textDecoration: 'none' }}>Home</Link>
              <span style={{ margin: '0 6px', color: t.textTiny }}>›</span>
              <span style={{ color: t.textSecondary }}>Shopping Cart</span>
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h1 style={{ color: t.textPrimary, fontSize: 32, fontWeight: 900, fontFamily: 'Syne,sans-serif', letterSpacing: '-0.02em', transition: 'color 0.35s' }}>
                  Shopping Cart
                </h1>
                {!loading && itemCount > 0 && (
                  <p style={{ color: t.textFaint, fontSize: 13, marginTop: 4, transition: 'color 0.35s' }}>{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>
                )}
              </div>
              <Link href="/products" style={{
                background: t.bgSubtle, border: `1px solid ${t.borderInput}`,
                color: t.textSecondary, borderRadius: 12, padding: '10px 18px',
                fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: 'Syne,sans-serif',
                transition: 'background 0.15s, color 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = t.bgHover; e.currentTarget.style.color = t.textPrimary; }}
                onMouseLeave={e => { e.currentTarget.style.background = t.bgSubtle; e.currentTarget.style.color = t.textSecondary; }}
              >← Continue Shopping</Link>
            </div>
          </div>
        </div>

        <div className="rsp-page-pad" style={{ maxWidth: 1280, margin: '0 auto' }}>

          {loading ? (
            <div className="rsp-grid-sidebar">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1, 2, 3].map(i => <SkeletonRow key={i} t={t} />)}
              </div>
              <div style={{ height: 400, background: t.bgCard, borderRadius: 20, border: `1px solid ${t.borderCard}`, animation: 'fadeIn 0.4s ease', transition: 'background 0.35s, border-color 0.35s' }} />
            </div>
          ) : (!cart || cart.items?.length === 0) ? (
            /* Empty state */
            <div style={{ textAlign: 'center', padding: '80px 32px', background: t.bgCard, border: `1px solid ${t.borderCard}`, borderRadius: 24, animation: 'fadeIn 0.4s ease', transition: 'background 0.35s, border-color 0.35s' }}>
              <div style={{ fontSize: 80, marginBottom: 20, filter: 'grayscale(0.3)' }}>🛒</div>
              <h2 style={{ color: t.textPrimary, fontSize: 24, fontWeight: 900, fontFamily: 'Syne,sans-serif', marginBottom: 10, transition: 'color 0.35s' }}>Your cart is empty</h2>
              <p style={{ color: t.textFaint, fontSize: 14, marginBottom: 32, maxWidth: 360, margin: '0 auto 32px', transition: 'color 0.35s' }}>
                Looks like you haven't added anything yet. Discover our latest tech drops.
              </p>
              <Link href="/products" style={{
                background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                color: '#fff', padding: '14px 32px', borderRadius: 12,
                fontWeight: 800, fontSize: 14, textDecoration: 'none',
                fontFamily: 'Syne,sans-serif',
                boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
              }}>Browse Products</Link>
            </div>
          ) : (
            <div className="rsp-grid-sidebar">

              {/* Cart items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {cart.items.map((item, i) => (
                  <div key={item.product?._id} style={{ animationDelay: `${i * 0.07}s` }}>
                    <CartItem item={item} onUpdate={updateQuantity} onRemove={removeItem} t={t} />
                  </div>
                ))}
              </div>

              {/* Order summary */}
              <div style={{ position: 'sticky', top: 88, background: t.bgSection, border: `1px solid ${t.borderMuted}`, borderRadius: 22, overflow: 'hidden', animation: 'fadeIn 0.5s ease', transition: 'background 0.35s, border-color 0.35s' }}>
                <div style={{ padding: '24px 24px 0', borderBottom: `1px solid ${t.borderMuted}`, paddingBottom: 20 }}>
                  <h2 style={{ color: t.textPrimary, fontSize: 18, fontWeight: 800, fontFamily: 'Syne,sans-serif', transition: 'color 0.35s' }}>Order Summary</h2>
                </div>

                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: `1px solid ${t.borderMuted}`, paddingTop: 20, marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: t.textFaint, fontSize: 13, transition: 'color 0.35s' }}>Subtotal ({itemCount} items)</span>
                      <span style={{ color: t.textSecondary, fontSize: 13, fontWeight: 600, transition: 'color 0.35s' }}>${subtotal.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${t.borderMuted}`, paddingTop: 14, marginTop: 4 }}>
                      <span style={{ color: t.textPrimary, fontSize: 16, fontWeight: 800, fontFamily: 'Syne,sans-serif', transition: 'color 0.35s' }}>Total</span>
                      <span style={{ color: t.textPrimary, fontSize: 22, fontWeight: 900, fontFamily: 'Syne,sans-serif', transition: 'color 0.35s' }}>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link href="/checkout" style={{
                    display: 'block', width: '100%', textAlign: 'center',
                    background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                    color: '#fff', padding: '15px', borderRadius: 14,
                    fontWeight: 800, fontSize: 15, textDecoration: 'none',
                    fontFamily: 'Syne,sans-serif',
                    boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
                    transition: 'opacity 0.2s, transform 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
                  >Proceed to Checkout →</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

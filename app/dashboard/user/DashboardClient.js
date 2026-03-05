'use client';

import Link from 'next/link';
import { useT } from '../../themeTokens';

export default function DashboardClient({ user, orders, justOrdered }) {
  const t = useT();

  function getStatusMeta(status) {
    const map = {
      delivered: { color: '#10B981', bg: 'rgba(16,185,129,0.12)', icon: '✓', label: 'Delivered' },
      shipped: { color: '#00D4FF', bg: 'rgba(0,212,255,0.1)', icon: '🚚', label: 'Shipped' },
      processing: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', icon: '⚙', label: 'Processing' },
      pending: { color: '#A855F7', bg: 'rgba(168,85,247,0.1)', icon: '⏳', label: 'Pending' },
      cancelled: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', icon: '✕', label: 'Cancelled' },
    };
    return map[status] || map.pending;
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  const totalSpend = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const pending = orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { background:${t.bgPage}; font-family:'DM Sans',sans-serif; color:${t.textPrimary}; }
        a { text-decoration:none; }
      `}</style>

      <div style={{ background: t.bgPage, minHeight: '100vh', paddingBottom: 80, transition: 'background 0.35s, color 0.35s' }}>
        {justOrdered && (
          <div style={{
            position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
            zIndex: 300,
            background: t.bgCard, border: '1px solid rgba(16,185,129,0.4)',
            borderRadius: 16, padding: '16px 24px',
            display: 'flex', alignItems: 'center', gap: 14,
            transition: 'background 0.35s',
          }}>
            <div style={{ fontSize: 20 }}>🎉</div>
            <div>
              <p style={{ color: '#10B981', fontWeight: 800, fontSize: 14, fontFamily: 'Syne,sans-serif' }}>Order Placed!</p>
              <p style={{ color: t.textFaint, fontSize: 12, transition: 'color 0.35s' }}>Track progress below.</p>
            </div>
          </div>
        )}

        <div style={{ background: `linear-gradient(180deg, ${t.bgHero} 0%, ${t.bgPage} 100%)`, borderBottom: `1px solid ${t.borderNav}`, padding: '36px 48px 32px', transition: 'background 0.35s, border-color 0.35s' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{
                  width: 60, height: 60,
                  background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                  borderRadius: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, fontWeight: 900, color: '#fff',
                  fontFamily: 'Syne,sans-serif',
                  flexShrink: 0,
                }}>
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 style={{ color: t.textPrimary, fontSize: 26, fontWeight: 900, fontFamily: 'Syne,sans-serif', transition: 'color 0.35s' }}>
                    Welcome back{user.name ? `, ${user.name.split(' ')[0]}` : ''}
                  </h1>
                  <p style={{ color: t.textFaint, fontSize: 13, marginTop: 4, transition: 'color 0.35s' }}>{user.email}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <Link href="/products" style={{
                  background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                  color: '#fff', borderRadius: 12, padding: '11px 20px',
                  fontSize: 13, fontWeight: 800, fontFamily: 'Syne,sans-serif',
                }}>🛍 Shop Now</Link>
                <Link href="/cart" style={{
                  background: t.bgInput, border: `1px solid ${t.borderInput}`,
                  color: t.textSecondary, borderRadius: 12, padding: '11px 18px',
                  fontSize: 13, fontWeight: 600, fontFamily: 'Syne,sans-serif',
                  transition: 'background 0.35s, border-color 0.35s, color 0.35s',
                }}>🛒 View Cart</Link>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginBottom: 40 }}>
            <div style={{ background: t.bgNav, border: `1px solid ${t.borderMuted}`, borderRadius: 20, padding: 24, transition: 'background 0.35s, border-color 0.35s' }}>
              <p style={{ color: t.textFaint, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Syne,sans-serif', marginBottom: 4, transition: 'color 0.35s' }}>Total Orders</p>
              <p style={{ color: t.textPrimary, fontSize: 32, fontWeight: 900, fontFamily: 'Syne,sans-serif', transition: 'color 0.35s' }}>{orders.length}</p>
            </div>
            <div style={{ background: t.bgNav, border: `1px solid ${t.borderMuted}`, borderRadius: 20, padding: 24, transition: 'background 0.35s, border-color 0.35s' }}>
              <p style={{ color: t.textFaint, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Syne,sans-serif', marginBottom: 4, transition: 'color 0.35s' }}>Total Spent</p>
              <p style={{ color: t.textPrimary, fontSize: 32, fontWeight: 900, fontFamily: 'Syne,sans-serif', transition: 'color 0.35s' }}>${totalSpend.toFixed(0)}</p>
            </div>
            <div style={{ background: t.bgNav, border: `1px solid ${t.borderMuted}`, borderRadius: 20, padding: 24, transition: 'background 0.35s, border-color 0.35s' }}>
              <p style={{ color: t.textFaint, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Syne,sans-serif', marginBottom: 4, transition: 'color 0.35s' }}>Active Orders</p>
              <p style={{ color: t.textPrimary, fontSize: 32, fontWeight: 900, fontFamily: 'Syne,sans-serif', transition: 'color 0.35s' }}>{pending}</p>
            </div>
          </div>

          {orders.length > 0 ? (
            <div style={{ background: t.bgNav, border: `1px solid ${t.borderMuted}`, borderRadius: 20, padding: 24, transition: 'background 0.35s, border-color 0.35s' }}>
              <h2 style={{ color: t.textPrimary, fontSize: 20, fontWeight: 900, fontFamily: 'Syne,sans-serif', marginBottom: 20, transition: 'color 0.35s' }}>Recent Orders</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {orders.slice(0, 5).map(order => {
                  const meta = getStatusMeta(order.status);
                  return (
                    <div key={order._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: t.bgSubtle, borderRadius: 12, transition: 'background 0.35s' }}>
                      <div>
                        <p style={{ color: t.textPrimary, fontSize: 14, fontWeight: 700, transition: 'color 0.35s' }}>Order #{order._id.slice(-8).toUpperCase()}</p>
                        <p style={{ color: t.textFaint, fontSize: 12, transition: 'color 0.35s' }}>{formatDate(order.createdAt)}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ color: t.textPrimary, fontSize: 16, fontWeight: 700, transition: 'color 0.35s' }}>${order.totalAmount?.toFixed(2)}</p>
                        <span style={{ background: meta.bg, color: meta.color, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>
                          {meta.icon} {meta.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '64px 32px', background: t.bgNav, border: `1px solid ${t.borderMuted}`, borderRadius: 20, transition: 'background 0.35s, border-color 0.35s' }}>
              <div style={{ fontSize: 72, marginBottom: 16 }}>📦</div>
              <h3 style={{ color: t.textPrimary, fontSize: 18, fontWeight: 800, fontFamily: 'Syne,sans-serif', marginBottom: 8, transition: 'color 0.35s' }}>No orders yet</h3>
              <Link href="/products" style={{
                background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                color: '#fff', padding: '13px 28px', borderRadius: 12,
                fontWeight: 800, fontSize: 13, fontFamily: 'Syne,sans-serif',
                display: 'inline-block',
              }}>Browse Products →</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
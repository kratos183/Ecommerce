'use client';
import { useT } from '../themeTokens';
import Link from 'next/link';
import { useState as useAdminState } from 'react';

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getStatusMeta(status) {
    const map = {
        delivered: { color: '#10B981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', label: 'Delivered' },
        shipped: { color: '#00D4FF', bg: 'rgba(0,212,255,0.1)', border: 'rgba(0,212,255,0.25)', label: 'Shipped' },
        processing: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', label: 'Processing' },
        pending: { color: '#A855F7', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.25)', label: 'Pending' },
        cancelled: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', label: 'Cancelled' },
    };
    return map[status] || map.pending;
}

function getCatIcon(cat) {
    const icons = { Laptops: '💻', Mobiles: '📱', Audio: '🎧', Tablets: '📟', Gaming: '🎮', 'Smart Home': '🏠', Accessories: '🔌' };
    return icons[cat] || '📦';
}

function getCatColor(cat) {
    const colors = { Laptops: '#00D4FF', Mobiles: '#FF6B35', Audio: '#A855F7', Tablets: '#10B981', Gaming: '#F59E0B', 'Smart Home': '#EC4899', Accessories: '#6366F1' };
    return colors[cat] || '#6366F1';
}

function formatDate(dateStr) {
    try { return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
    catch { return 'N/A'; }
}

// ─── SUB-COMPONENTS ────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color, trend }) {
    const t = useT();
    return (
        <div style={{ background: t.bgNav, border: `1px solid ${color}22`, borderRadius: 20, padding: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -24, right: -24, width: 100, height: 100, borderRadius: '50%', background: `${color}08`, pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, background: `${color}18`, border: `1px solid ${color}33`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                    {icon}
                </div>
                {trend != null && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: trend >= 0 ? '#10B981' : '#EF4444', background: trend >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${trend >= 0 ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`, borderRadius: 6, padding: '2px 8px', fontFamily: 'Syne,sans-serif' }}>
                        {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <p style={{ color: t.textFaint, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6, fontFamily: 'Syne,sans-serif' }}>{label}</p>
            <p style={{ color: t.textPrimary, fontSize: 28, fontWeight: 900, fontFamily: 'Syne,sans-serif', lineHeight: 1, marginBottom: 4 }}>{value}</p>
            {sub && <p style={{ color: t.textVeryFaint, fontSize: 12 }}>{sub}</p>}
        </div>
    );
}

function SectionHeading({ id, icon, title, sub, action }) {
    const t = useT();
    return (
        <div id={id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{icon}</div>
                <div>
                    <h2 style={{ color: t.textPrimary, fontSize: 20, fontWeight: 900, fontFamily: 'Syne,sans-serif' }}>{title}</h2>
                    {sub && <p style={{ color: t.textVeryFaint, fontSize: 12, marginTop: 2 }}>{sub}</p>}
                </div>
            </div>
            {action}
        </div>
    );
}

function Field({ label, name, type = 'text', placeholder, required }) {
    const t = useT();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor={name} style={{ color: '#64748B', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Syne,sans-serif' }}>
                {label}{required && <span style={{ color: '#EF4444', marginLeft: 3 }}>*</span>}
            </label>
            <input
                id={name} type={type} name={name} placeholder={placeholder} required={required}
                style={{ background: t.bgInput, border: `1px solid ${t.borderInput}`, borderRadius: 12, padding: '13px 16px', color: t.textPrimary, fontSize: 14 }}
            />
        </div>
    );
}

// ─── MAIN CLIENT COMPONENT ────────────────────────────────────────────────────
// ─── MULTI-IMAGE INPUT COMPONENT ─────────────────────────────────────────────
function MultiImageInput({ images, onChange }) {
    const t = useT();
    const MAX_IMAGES = 5;
    const addSlot = () => {
        if (images.length < MAX_IMAGES) onChange([...images, '']);
    };
    const removeSlot = (i) => onChange(images.filter((_, idx) => idx !== i));
    const updateSlot = (i, val) => {
        const next = [...images];
        next[i] = val;
        onChange(next);
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ color: '#64748B', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Syne,sans-serif' }}>
                    Product Images <span style={{ color: t.textFaint, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>({images.length}/{MAX_IMAGES})</span>
                </label>
                {images.length < MAX_IMAGES && (
                    <button type="button" onClick={addSlot} style={{
                        background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                        color: '#818CF8', borderRadius: 8, padding: '4px 12px',
                        fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne,sans-serif',
                    }}>＋ Add Image</button>
                )}
            </div>
            {images.length === 0 && (
                <p style={{ color: t.textVeryFaint, fontSize: 12, padding: '12px 0' }}>No images added yet. Click "＋ Add Image" to upload product photos.</p>
            )}
            {images.map((url, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {/* Preview thumbnail */}
                    <div style={{
                        width: 52, height: 52, borderRadius: 10, flexShrink: 0,
                        background: t.bgInput, border: `1px solid ${t.borderInput}`,
                        overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {url ? (
                            <img src={url} alt={`img-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                            />
                        ) : null}
                        <span style={{ color: t.textVeryFaint, fontSize: 20, display: url ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>🖼</span>
                    </div>
                    <input
                        type="url"
                        value={url}
                        onChange={e => updateSlot(i, e.target.value)}
                        placeholder={i === 0 ? 'Main image URL (required)' : `Extra image ${i + 1} URL`}
                        style={{
                            flex: 1, background: t.bgInput,
                            border: `1px solid ${i === 0 ? 'rgba(99,102,241,0.3)' : t.borderInput}`,
                            borderRadius: 12, padding: '13px 16px', color: t.textPrimary, fontSize: 14,
                        }}
                    />
                    <button type="button" onClick={() => removeSlot(i)} style={{
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                        color: '#EF4444', borderRadius: 8, width: 34, height: 34, flexShrink: 0,
                        cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>✕</button>
                </div>
            ))}
            {images.length > 0 && (
                <p style={{ color: t.textVeryFaint, fontSize: 11 }}>💡 First image is used as the main display photo. Add up to {MAX_IMAGES} images to create a gallery.</p>
            )}
        </div>
    );
}

export default function AdminClient({ user, stats, products, orders }) {
    const t = useT();
    const [productImages, setProductImages] = useAdminState([]);
    const [productList, setProductList] = useAdminState(products);  // local copy for optimistic UI

    const totalRevenue = stats?.totalRevenue ?? orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const totalUsers = stats?.totalUsers ?? 0;
    const totalOrders = stats?.totalOrders ?? orders.length;
    const totalProducts = stats?.totalProducts ?? products.length;
    const lowStock = products.filter(p => (p.stock || 0) <= 5).length;
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;

    const catCounts = products.reduce((acc, p) => {
        const cat = p.category || 'Other';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});

    const NAV_LINKS = [
        { href: '#overview', icon: '⊞', label: 'Overview' },
        { href: '#products', icon: '📦', label: 'Products' },
        { href: '#orders', icon: '🛍', label: 'Orders' },
        { href: '#add-product', icon: '＋', label: 'Add Product' },
    ];

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const form = e.target;
        const validImages = productImages.filter(url => url.trim() !== '');
        const data = {
            name: form.name.value,
            title: form.name.value,
            category: form.category.value,
            description: form.description.value,
            price: Number(form.price.value),
            originalPrice: form.originalPrice.value ? Number(form.originalPrice.value) : undefined,
            stock: Number(form.stock.value),
            image: validImages[0] || undefined,       // first image = main image
            images: validImages,                       // all images as gallery
        };
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                form.reset();
                setProductImages([]);   // reset image slots
                alert('✅ Product added successfully!');
                window.location.reload();
            } else {
                const err = await res.json();
                alert('❌ Failed: ' + (err.error || 'Unknown error') + (err.details ? ' – ' + err.details : ''));
            }
        } catch {
            alert('❌ Network error — please try again.');
        }
    };

    const handleDeleteProduct = async (id, name) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        try {
            const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                // Optimistically remove from local list — no full reload needed
                setProductList(prev => prev.filter(p => p._id !== id));
            } else {
                const err = await res.json();
                alert('❌ Delete failed: ' + (err.error || 'Unknown error'));
            }
        } catch {
            alert('❌ Network error — please try again.');
        }
    };

    return (

        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { background:${t.bgPage}; font-family:'DM Sans',sans-serif; color:${t.textPrimary}; }
        a { text-decoration:none; }
        input, select, textarea { font-family:'DM Sans',sans-serif; }
        input:focus, select:focus, textarea:focus { outline:none; border-color:rgba(99,102,241,0.5) !important; box-shadow:0 0 0 3px rgba(99,102,241,0.1) !important; }
        input::placeholder, textarea::placeholder { color:${t.textVeryFaint}; }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes fadeIn      { from{opacity:0} to{opacity:1} }
        .nav-link  { transition:background 0.15s, color 0.15s, border-color 0.15s; }
        .nav-link:hover { background:rgba(99,102,241,0.08) !important; color:#A5B4FC !important; border-color:rgba(99,102,241,0.2) !important; }
        .trow { transition:background 0.15s; }
        .trow:hover { background:${t.bgSubtle} !important; }
        .del-btn:hover { color:#EF4444 !important; }
        .edit-btn:hover { color:#818CF8 !important; }
        @media(max-width:900px){ .admin-layout{flex-direction:column!important;} .admin-sidebar{width:100%!important;min-height:auto!important;} }
      `}</style>

            <div style={{ background: t.bgPage, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <div className="admin-layout" style={{ display: 'flex', flex: 1 }}>

                    {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
                    <aside className="admin-sidebar" style={{ width: 240, background: t.bgSection, borderRight: `1px solid ${t.borderNav}`, minHeight: '100vh', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
                        <div style={{ padding: '28px 20px' }}>
                            <div style={{ marginBottom: 32 }}>
                                <p style={{ color: t.textVeryFaint, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'Syne,sans-serif', marginBottom: 6 }}>Admin Panel</p>
                                <h2 style={{ color: t.textPrimary, fontSize: 20, fontWeight: 900, fontFamily: 'Syne,sans-serif', letterSpacing: '-0.02em' }}>
                                    <span style={{ color: '#6366F1' }}>Tech</span>Store
                                </h2>
                            </div>

                            <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 14, padding: '12px 14px', marginBottom: 28 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#fff', fontFamily: 'Syne,sans-serif', flexShrink: 0 }}>
                                        {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ color: t.textPrimary, fontSize: 13, fontWeight: 700, fontFamily: 'Syne,sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || user?.email || 'Admin'}</p>
                                        <p style={{ color: '#6366F1', fontSize: 10, fontWeight: 700, fontFamily: 'Syne,sans-serif' }}>● Super Admin</p>
                                    </div>
                                </div>
                            </div>

                            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {NAV_LINKS.map(({ href, icon, label }) => (
                                    <a key={href} href={href} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, border: '1px solid transparent', color: t.textFaint, fontSize: 13, fontWeight: 600, fontFamily: 'Syne,sans-serif' }}>
                                        <span style={{ fontSize: 16 }}>{icon}</span> {label}
                                    </a>
                                ))}
                            </nav>

                            <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${t.borderNav}` }}>
                                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: t.textVeryFaint, fontSize: 12, fontWeight: 600, fontFamily: 'Syne,sans-serif' }}>
                                    ← Back to Store
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* ── MAIN ─────────────────────────────────────────────────────── */}
                    <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>

                        {/* Top bar */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                            <div>
                                <h1 style={{ color: t.textPrimary, fontSize: 26, fontWeight: 900, fontFamily: 'Syne,sans-serif' }}>Dashboard</h1>
                                <p style={{ color: t.textVeryFaint, fontSize: 13 }}>Welcome back, {user?.name || 'Admin'}</p>
                            </div>
                            <a href="#add-product" style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: '#fff', borderRadius: 12, padding: '10px 20px', fontSize: 13, fontWeight: 800, fontFamily: 'Syne,sans-serif', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}>
                                ＋ Add Product
                            </a>
                        </div>

                        {/* ── OVERVIEW ─────────────────────────────────────────────── */}
                        <div id="overview" style={{ marginBottom: 48, animation: 'fadeSlideUp 0.4s ease both' }}>
                            <SectionHeading icon="⊞" title="Overview" sub="Live snapshot of your store" />
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 24 }}>
                                <StatCard icon="💰" label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} color="#10B981" trend={12} />
                                <StatCard icon="📦" label="Products" value={totalProducts} color="#6366F1" sub={`${lowStock} low stock`} />
                                <StatCard icon="🛍" label="Total Orders" value={totalOrders} color="#F59E0B" sub={`${pendingOrders} pending`} />
                                <StatCard icon="👥" label="Customers" value={totalUsers} color="#00D4FF" trend={8} />
                            </div>

                            {/* Category breakdown */}
                            {Object.keys(catCounts).length > 0 && (
                                <div style={{ background: t.bgNav, border: `1px solid ${t.borderMuted}`, borderRadius: 16, padding: 20 }}>
                                    <p style={{ color: t.textFaint, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Syne,sans-serif', marginBottom: 16 }}>Inventory by Category</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                        {Object.entries(catCounts).map(([cat, count]) => {
                                            const color = getCatColor(cat);
                                            return (
                                                <div key={cat} style={{ background: `${color}12`, border: `1px solid ${color}30`, borderRadius: 10, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <span>{getCatIcon(cat)}</span>
                                                    <span style={{ color: t.textSecondary, fontSize: 12, fontFamily: 'Syne,sans-serif', fontWeight: 600 }}>{cat}</span>
                                                    <span style={{ color, fontSize: 12, fontWeight: 800, fontFamily: 'Syne,sans-serif' }}>{count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── PRODUCTS ─────────────────────────────────────────────── */}
                        <div id="products" style={{ marginBottom: 48, animation: 'fadeSlideUp 0.4s ease 0.1s both' }}>
                            <SectionHeading icon="📦" title="Products" sub={`${productList.length} total products`} />
                            <div style={{ background: t.bgNav, border: `1px solid ${t.borderMuted}`, borderRadius: 20, overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: t.bgAlt, borderBottom: `1px solid ${t.borderMuted}` }}>
                                            {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                                                <th key={h} style={{ padding: '14px 18px', textAlign: 'left', color: t.textVeryFaint, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Syne,sans-serif' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productList.length === 0 ? (
                                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px 20px', color: t.textVeryFaint }}>No products yet. Add one below!</td></tr>
                                        ) : productList.map((p, i) => {
                                            const catColor = getCatColor(p.category);
                                            const isLow = (p.stock || 0) <= 5;
                                            return (
                                                <tr key={p._id} className="trow" style={{ borderBottom: `1px solid ${t.borderNav}`, animation: `fadeSlideUp 0.3s ease ${i * 0.04}s both` }}>
                                                    <td style={{ padding: '14px 18px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                            <div style={{ width: 40, height: 40, background: `${catColor}15`, border: `1px solid ${catColor}30`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                                                                {p.image ? <img src={p.image} alt="" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 8 }} /> : getCatIcon(p.category)}
                                                            </div>
                                                            <div>
                                                                <p style={{ color: t.textPrimary, fontSize: 13, fontWeight: 700, fontFamily: 'Syne,sans-serif' }}>{p.name || p.title}</p>
                                                                <p style={{ color: t.textVeryFaint, fontSize: 11 }}>#{p._id?.toString().slice(-6)}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '14px 18px' }}>
                                                        <span style={{ background: `${catColor}15`, border: `1px solid ${catColor}40`, color: catColor, borderRadius: 8, padding: '3px 10px', fontSize: 11, fontWeight: 700, fontFamily: 'Syne,sans-serif' }}>
                                                            {getCatIcon(p.category)} {p.category}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '14px 18px' }}>
                                                        <p style={{ color: t.textPrimary, fontSize: 14, fontWeight: 800, fontFamily: 'Syne,sans-serif' }}>${(p.price || 0).toLocaleString()}</p>
                                                        {p.originalPrice && <p style={{ color: t.textVeryFaint, fontSize: 11, textDecoration: 'line-through' }}>${p.originalPrice.toLocaleString()}</p>}
                                                    </td>
                                                    <td style={{ padding: '14px 18px' }}>
                                                        <span style={{ color: isLow ? '#F59E0B' : '#10B981', fontSize: 13, fontWeight: 700, fontFamily: 'Syne,sans-serif' }}>
                                                            {isLow ? '⚡ ' : ''}{p.stock ?? 0}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '14px 18px' }}>
                                                        <span style={{ background: isLow ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)', border: `1px solid ${isLow ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`, color: isLow ? '#F59E0B' : '#10B981', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
                                                            {isLow ? 'Low Stock' : 'In Stock'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '14px 18px' }}>
                                                        <div style={{ display: 'flex', gap: 8 }}>
                                                            <Link href={`/products/${p._id}`} className="edit-btn" style={{ color: t.textFaint, fontSize: 14, fontWeight: 700, padding: '5px 10px', background: t.bgInput, border: `1px solid ${t.borderInput}`, borderRadius: 8, transition: 'color 0.15s' }}>👁</Link>
                                                            <button
                                                                className="del-btn"
                                                                onClick={() => handleDeleteProduct(p._id, p.name || p.title)}
                                                                style={{ color: t.textFaint, fontSize: 14, background: t.bgInput, border: `1px solid ${t.borderInput}`, borderRadius: 8, padding: '5px 10px', cursor: 'pointer', transition: 'color 0.15s, background 0.15s' }}
                                                            >🗑</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ── ORDERS ─────────────────────────────────────────────────── */}
                        <div id="orders" style={{ marginBottom: 48, animation: 'fadeSlideUp 0.4s ease 0.2s both' }}>
                            <SectionHeading icon="🛍" title="Orders" sub={`${orders.length} total orders`} />
                            <div style={{ background: t.bgNav, border: `1px solid ${t.borderMuted}`, borderRadius: 20, overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: t.bgAlt, borderBottom: `1px solid ${t.borderMuted}` }}>
                                            {['Order', 'Customer', 'Date', 'Amount', 'Status'].map(h => (
                                                <th key={h} style={{ padding: '14px 18px', textAlign: 'left', color: t.textVeryFaint, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Syne,sans-serif' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.length === 0 ? (
                                            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px 20px', color: t.textVeryFaint }}>No orders yet.</td></tr>
                                        ) : orders.slice(0, 20).map((o, i) => {
                                            const meta = getStatusMeta(o.status);
                                            return (
                                                <tr key={o._id} className="trow" style={{ borderBottom: `1px solid ${t.borderNav}`, animation: `fadeSlideUp 0.3s ease ${i * 0.04}s both` }}>
                                                    <td style={{ padding: '14px 18px', color: t.textSecondary, fontSize: 12, fontFamily: 'Syne,sans-serif' }}>#{o._id?.toString().slice(-8).toUpperCase()}</td>
                                                    <td style={{ padding: '14px 18px', color: t.textSecondary, fontSize: 13 }}>{o.user?.name || o.user?.email || 'Guest'}</td>
                                                    <td style={{ padding: '14px 18px', color: t.textFaint, fontSize: 12 }}>{formatDate(o.createdAt)}</td>
                                                    <td style={{ padding: '14px 18px', color: t.textPrimary, fontSize: 14, fontWeight: 800, fontFamily: 'Syne,sans-serif' }}>${(o.totalAmount || 0).toLocaleString()}</td>
                                                    <td style={{ padding: '14px 18px' }}>
                                                        <span style={{ background: meta.bg, border: `1px solid ${meta.border}`, color: meta.color, borderRadius: 8, padding: '4px 12px', fontSize: 11, fontWeight: 700, fontFamily: 'Syne,sans-serif' }}>
                                                            {meta.label}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ── ADD PRODUCT ─────────────────────────────────────────────── */}
                        <div id="add-product" style={{ marginBottom: 48, animation: 'fadeSlideUp 0.4s ease 0.25s both' }}>
                            <SectionHeading icon="＋" title="Add New Product" sub="Fill in the details to add a product to the store" />
                            <div style={{ background: t.bgNav, border: `1px solid ${t.borderMuted}`, borderRadius: 20, padding: 32 }}>
                                <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                                        <Field label="Product Name" name="name" type="text" placeholder='e.g. MacBook Pro 16" M3' required />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            <label style={{ color: '#64748B', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Syne,sans-serif' }}>
                                                Category <span style={{ color: '#EF4444' }}>*</span>
                                            </label>
                                            <select name="category" required style={{ background: t.bgInput, border: `1px solid ${t.borderInput}`, borderRadius: 12, padding: '13px 16px', color: t.textPrimary, fontSize: 14, cursor: 'pointer' }}>
                                                {['Laptops', 'Mobiles', 'Tablets', 'Audio', 'Gaming', 'Smart Home', 'Accessories'].map(c => (
                                                    <option key={c} value={c} style={{ background: t.bgCard }}>{getCatIcon(c)} {c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{ color: '#64748B', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Syne,sans-serif' }}>
                                            Description <span style={{ color: '#EF4444' }}>*</span>
                                        </label>
                                        <textarea name="description" rows={4} required placeholder="Describe the product features, specs, and benefits..." style={{ background: t.bgInput, border: `1px solid ${t.borderInput}`, borderRadius: 12, padding: '13px 16px', color: t.textPrimary, fontSize: 14, resize: 'vertical' }} />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
                                        <Field label="Price ($)" name="price" type="number" placeholder="e.g. 1299" required />
                                        <Field label="Original Price ($)" name="originalPrice" type="number" placeholder="e.g. 1499 (optional)" />
                                        <Field label="Stock" name="stock" type="number" placeholder="e.g. 25" required />
                                    </div>

                                    <MultiImageInput images={productImages} onChange={setProductImages} />

                                    <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                                        <button type="submit" style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px 32px', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'Syne,sans-serif', boxShadow: '0 6px 20px rgba(99,102,241,0.35)' }}>
                                            ＋ Add Product
                                        </button>
                                        <button type="reset" style={{ background: t.bgInput, border: `1px solid ${t.borderInput}`, color: '#64748B', borderRadius: 14, padding: '14px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne,sans-serif' }}>
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </main>
                </div>
            </div>
        </>
    );
}

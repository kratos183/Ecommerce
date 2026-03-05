'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useT } from '../themeTokens';

// ─── MOCK DATA (used as fallback when API returns nothing) ────────────────────
const MOCK = Array.from({ length: 12 }, (_, i) => ({
  _id: String(i + 1),
  name: ['MacBook Pro 16" M3 Max', 'iPhone 15 Pro Max', 'Sony WH-1000XM5', 'iPad Pro M2', 'Samsung Galaxy S24 Ultra', 'Dell XPS 15 OLED', 'AirPods Pro 2', 'ASUS ROG Swift 360Hz', 'Lenovo ThinkPad X1', 'Google Pixel 8 Pro', 'Bose QuietComfort 45', 'Surface Pro 9'][i],
  price: [2499, 1199, 349, 1099, 1099, 1799, 249, 599, 1399, 899, 279, 1299][i],
  originalPrice: [2999, 1299, 399, 1199, 1199, 2099, 279, 699, 1599, 999, 329, 1499][i],
  rating: [4.9, 4.8, 4.7, 4.8, 4.6, 4.7, 4.8, 4.5, 4.6, 4.7, 4.5, 4.8][i],
  reviews: [1284, 3210, 892, 654, 1876, 432, 5621, 341, 723, 1120, 448, 892][i],
  category: ['Laptops', 'Mobiles', 'Audio', 'Tablets', 'Mobiles', 'Laptops', 'Audio', 'Gaming', 'Laptops', 'Mobiles', 'Audio', 'Tablets'][i],
  badge: ['Best Seller', null, 'Hot Deal', null, 'Popular', null, 'Best Seller', null, null, 'New', null, 'Editor\'s Pick'][i],
  stock: [3, 7, 12, 5, 9, 4, 20, 6, 2, 15, 8, 3][i],
  image: null,
}));

const CATEGORIES = ['All', 'Laptops', 'Mobiles', 'Audio', 'Tablets', 'Gaming', 'Smart Home', 'Accessories'];

const SORT_OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating_desc', label: 'Top Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
];

const PRICE_RANGES = [
  { label: 'Under $300', min: 0, max: 300 },
  { label: '$300 – $700', min: 300, max: 700 },
  { label: '$700 – $1,200', min: 700, max: 1200 },
  { label: '$1,200+', min: 1200, max: 99999 },
];

const CAT_COLORS = {
  Laptops: '#00D4FF', Mobiles: '#FF6B35', Audio: '#A855F7',
  Tablets: '#10B981', Gaming: '#F59E0B', 'Smart Home': '#EC4899',
  Accessories: '#6366F1', All: '#94A3B8',
};

// ─── SKELETON CARD ────────────────────────────────────────────────────────────
function SkeletonCard({ t }) {
  return (
    <div style={{ background: t.bgCard, border: `1px solid ${t.borderCard}`, borderRadius: 18, overflow: 'hidden', transition: 'background 0.35s, border-color 0.35s' }}>
      <div style={{ height: 200, background: `linear-gradient(90deg, ${t.shimmer1} 25%, ${t.shimmer2} 50%, ${t.shimmer1} 75%)`, backgroundSize: '400% 100%', animation: 'shimmer 1.4s infinite' }} />
      <div style={{ padding: 18 }}>
        {[80, 60, 40].map((w, i) => (
          <div key={i} style={{ height: 12, borderRadius: 6, background: `linear-gradient(90deg, ${t.shimmer1} 25%, ${t.shimmer2} 50%, ${t.shimmer1} 75%)`, backgroundSize: '400% 100%', animation: 'shimmer 1.4s infinite', marginBottom: 10, width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

// ─── PRODUCT CARD (GRID) ──────────────────────────────────────────────────────
function ProductCard({ product, onCompare, isComparing, viewMode }) {
  const t = useT();
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const catColor = CAT_COLORS[product.category] || '#6366F1';

  const handleAdd = (e) => {
    e.preventDefault();
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  if (viewMode === 'list') {
    return (
      <div style={{
        background: t.bgCard,
        border: `1px solid ${hovered ? t.borderMuted : t.borderCard}`,
        borderRadius: 16, padding: 20,
        display: 'flex', alignItems: 'center', gap: 20,
        transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s, background 0.35s',
        transform: hovered ? 'translateX(4px)' : 'translateX(0)',
        boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.2)' : 'none',
        position: 'relative', animation: 'fadeSlideUp 0.4s ease both',
      }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>
        {/* Image */}
        <div style={{ width: 90, height: 90, background: `${catColor}15`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, flexShrink: 0 }}>
          {getCatIcon(product.category)}
        </div>
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            {product.badge && <span style={{ background: getBadgeColor(product.badge), color: '#000', fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 4, textTransform: 'uppercase', fontFamily: 'Syne, sans-serif' }}>{product.badge}</span>}
            <span style={{ color: catColor, fontSize: 11, fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>{product.category}</span>
          </div>
          <h3 style={{ color: t.textPrimary, fontSize: 15, fontWeight: 700, fontFamily: 'Syne, sans-serif', margin: '0 0 6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Stars rating={product.rating} />
            <span style={{ color: t.textFaint, fontSize: 11 }}>{product.rating} ({product.reviews?.toLocaleString()})</span>
          </div>
          {product.stock <= 5 && <p style={{ color: '#F59E0B', fontSize: 11, fontWeight: 600, marginTop: 4 }}>⚡ Only {product.stock} left</p>}
        </div>
        {/* Price + Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: t.textPrimary, fontSize: 20, fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>${product.price?.toLocaleString()}</div>
            {product.originalPrice && <div style={{ color: t.textFaint, fontSize: 12, textDecoration: 'line-through' }}>${product.originalPrice?.toLocaleString()}</div>}
            {discount > 0 && <div style={{ color: '#10B981', fontSize: 11, fontWeight: 700 }}>Save {discount}%</div>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button onClick={handleAdd} style={{
              background: added ? '#10B981' : '#2563EB',
              color: '#fff', border: 'none', borderRadius: 10,
              padding: '10px 18px', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Syne, sans-serif',
              transition: 'background 0.2s', whiteSpace: 'nowrap',
            }}>{added ? '✓ Added' : '+ Cart'}</button>
            <button onClick={() => onCompare(product)} style={{
              background: isComparing ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
              color: isComparing ? '#818CF8' : '#64748B',
              border: `1px solid ${isComparing ? '#6366F1' : '#374151'}`,
              borderRadius: 10, padding: '7px 14px', fontSize: 11, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Syne, sans-serif', whiteSpace: 'nowrap',
            }}>{isComparing ? '✓ Comparing' : '⚖ Compare'}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/products/${product._id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: t.bgCard,
        border: `1px solid ${hovered ? catColor + '44' : t.borderCard}`,
        borderRadius: 18, overflow: 'hidden',
        transition: 'transform 0.25s, border-color 0.25s, box-shadow 0.25s, background 0.35s',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? `0 24px 48px rgba(0,0,0,0.3), 0 0 0 1px ${catColor}22` : 'none',
        position: 'relative', cursor: 'pointer', animation: 'fadeSlideUp 0.4s ease both',
      }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>

        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {product.badge && <span style={{ background: getBadgeColor(product.badge), color: '#000', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 5, textTransform: 'uppercase', fontFamily: 'Syne, sans-serif' }}>{product.badge}</span>}
          {discount > 0 && <span style={{ background: 'rgba(239,68,68,0.9)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 5 }}>-{discount}%</span>}
        </div>

        <button onClick={(e) => { e.stopPropagation(); setWished(w => !w); }} style={{
          position: 'absolute', top: 12, right: 12, zIndex: 2,
          background: wished ? 'rgba(239,68,68,0.15)' : 'rgba(17,24,39,0.8)',
          border: `1px solid ${wished ? '#EF4444' : '#374151'}`,
          borderRadius: 8, width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: 14,
          transform: wished ? 'scale(1.15)' : 'scale(1)',
          transition: 'transform 0.15s, background 0.15s',
        }}>{wished ? '❤️' : '🤍'}</button>

        <button onClick={(e) => { e.stopPropagation(); onCompare(product); }} style={{
          position: 'absolute', top: 52, right: 12, zIndex: 2,
          background: isComparing ? 'rgba(99,102,241,0.2)' : 'rgba(17,24,39,0.8)',
          border: `1px solid ${isComparing ? '#6366F1' : '#374151'}`,
          borderRadius: 8, width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: 13,
          transition: 'background 0.15s, border-color 0.15s',
        }} title="Compare">⚖</button>

        <div style={{
          height: 190,
          background: `linear-gradient(135deg, ${catColor}10 0%, #111827 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 72,
          transition: 'transform 0.3s',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          position: 'relative'
        }}>
          {product.image ? (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <span style={{ filter: `drop-shadow(0 8px 24px ${catColor}44)` }}>{getCatIcon(product.category)}</span>
          )}
        </div>

        <div style={{ padding: 18 }}>
          <p style={{ color: catColor, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4, fontFamily: 'Syne, sans-serif' }}>{product.category}</p>
          <h3 style={{ color: t.textPrimary, fontSize: 14, fontWeight: 700, marginBottom: 8, lineHeight: 1.4, fontFamily: 'Syne, sans-serif', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
            <Stars rating={product.rating} small />
            <span style={{ color: t.textFaint, fontSize: 10 }}>{product.rating} ({(product.reviews || 0).toLocaleString()})</span>
          </div>

          {product.stock <= 5 && (
            <p style={{ color: '#F59E0B', fontSize: 10, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>⚡</span> Only {product.stock} left in stock!
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: t.textPrimary, fontSize: 20, fontWeight: 900, fontFamily: 'Syne, sans-serif', lineHeight: 1 }}>
                ${product.price?.toLocaleString()}
              </div>
              {product.originalPrice && (
                <div style={{ color: t.textFaint, fontSize: 11, textDecoration: 'line-through' }}>
                  ${product.originalPrice?.toLocaleString()}
                </div>
              )}
            </div>
            <button onClick={handleAdd} style={{
              background: added ? '#10B981' : `linear-gradient(135deg, #1D4ED8, #2563EB)`,
              color: '#fff', border: 'none', borderRadius: 10,
              padding: '9px 16px', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Syne, sans-serif',
              transition: 'background 0.2s, transform 0.1s',
              transform: added ? 'scale(0.95)' : 'scale(1)',
              boxShadow: added ? 'none' : '0 4px 12px rgba(37,99,235,0.4)',
            }}>{added ? '✓ Added' : '+ Cart'}</button>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── STARS ────────────────────────────────────────────────────────────────────
function Stars({ rating, small }) {
  return (
    <span style={{ display: 'flex', gap: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#FBBF24' : '#374151', fontSize: small ? 10 : 12 }}>★</span>
      ))}
    </span>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getCatIcon(cat) {
  const m = { Laptops: '💻', Mobiles: '📱', Audio: '🎧', Tablets: '📟', Gaming: '🎮', 'Smart Home': '🏠', Accessories: '🔌' };
  return m[cat] || '📦';
}
function getBadgeColor(badge) {
  if (badge === 'Best Seller') return '#F59E0B';
  if (badge === 'New') return '#10B981';
  if (badge === "Editor's Pick") return '#A855F7';
  return '#EF4444';
}

// ─── COMPARE TRAY ─────────────────────────────────────────────────────────────
function CompareTray({ items, onRemove, onClear }) {
  const t = useT();
  if (items.length === 0) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      zIndex: 200,
      background: t.bgNav,
      border: '1px solid rgba(99,102,241,0.4)',
      borderRadius: 20,
      padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: '0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.1)',
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      backdropFilter: 'blur(16px)',
    }}>
      <span style={{ color: '#818CF8', fontSize: 12, fontWeight: 700, fontFamily: 'Syne, sans-serif', whiteSpace: 'nowrap' }}>
        ⚖ Comparing ({items.length}/3)
      </span>
      <div style={{ display: 'flex', gap: 8 }}>
        {items.map(p => (
          <div key={p._id} style={{
            background: t.bgSubtle, border: `1px solid ${t.borderMuted}`, borderRadius: 10, padding: '6px 10px',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ color: t.textPrimary, fontSize: 11, fontWeight: 600, fontFamily: 'Syne, sans-serif', maxWidth: 100, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name.split(' ').slice(0, 2).join(' ')}</span>
            <button onClick={() => onRemove(p._id)} style={{ background: 'none', border: 'none', color: t.textFaint, cursor: 'pointer', fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
          </div>
        ))}
      </div>
      {items.length >= 2 && (
        <Link href={`/compare?ids=${items.map(p => p._id).join(',')}`} style={{
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          color: '#fff', borderRadius: 10, padding: '9px 18px',
          fontSize: 12, fontWeight: 800, textDecoration: 'none',
          fontFamily: 'Syne, sans-serif', whiteSpace: 'nowrap',
        }}>Compare Now →</Link>
      )}
      <button onClick={onClear} style={{ background: 'none', border: 'none', color: t.textFaint, cursor: 'pointer', fontSize: 12, fontFamily: 'Syne, sans-serif' }}>Clear</button>
    </div>
  );
}

// ─── ACTIVE FILTER PILLS ──────────────────────────────────────────────────────
function FilterPill({ label, onRemove }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: 'rgba(99,102,241,0.1)',
      border: '1px solid rgba(99,102,241,0.3)',
      borderRadius: 20, padding: '4px 12px',
      color: '#A5B4FC', fontSize: 12, fontWeight: 600, fontFamily: 'Syne, sans-serif',
    }}>
      {label}
      <button onClick={onRemove} style={{ background: 'none', border: 'none', color: '#818CF8', cursor: 'pointer', fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
    </div>
  );
}

// ─── MAIN CLIENT ──────────────────────────────────────────────────────────────
export default function ProductsClient({ initialProducts = [], initialPagination, initialFilters = {} }) {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState(initialProducts.length ? initialProducts : MOCK);
  const [pagination, setPagination] = useState(initialPagination || { currentPage: 1, totalPages: 3, total: 36 });
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const [compareItems, setCompareItems] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter state
  const [search, setSearch] = useState(initialFilters.search || '');
  const [category, setCategory] = useState(initialFilters.category || '');
  const [sort, setSort] = useState(initialFilters.sort || '');
  const [priceRange, setPriceRange] = useState({ min: initialFilters.minPrice || '', max: initialFilters.maxPrice || '' });
  const [minRating, setMinRating] = useState(initialFilters.rating || '');
  const [page, setPage] = useState(initialFilters.page || 1);

  const searchDebounceRef = useRef(null);

  // Build URL and push from explicit values (avoids stale closure bugs)
  const updateURL = useCallback((overrides = {}) => {
    const current = { search, category, sort, page, minPrice: priceRange.min, maxPrice: priceRange.max, rating: minRating };
    const merged = { ...current, ...overrides };
    const p = new URLSearchParams();
    if (merged.search) p.set('search', merged.search);
    if (merged.category) p.set('category', merged.category);
    if (merged.sort) p.set('sort', merged.sort);
    if (merged.page > 1) p.set('page', String(merged.page));
    if (merged.minPrice) p.set('minPrice', String(merged.minPrice));
    if (merged.maxPrice) p.set('maxPrice', String(merged.maxPrice));
    if (merged.rating) p.set('rating', String(merged.rating));
    router.push(`${pathname}?${p.toString()}`);
  }, [search, category, sort, page, priceRange, minRating, pathname, router]);

  const handleSearchChange = (val) => {
    setSearch(val);
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setPage(1);
      updateURL({ search: val, page: 1 });
    }, 400);
  };

  const handleCategory = (cat) => {
    const val = cat === 'All' ? '' : cat;
    setCategory(val);
    setPage(1);
    updateURL({ category: val, page: 1 });
  };

  const handleSort = (val) => {
    setSort(val);
    updateURL({ sort: val });
  };

  const handlePriceRange = (range) => {
    const min = range.min === 0 ? '0' : String(range.min);
    const max = range.max === 99999 ? '' : String(range.max);
    setPriceRange({ min, max });
    setPage(1);
    // Pass explicitly to avoid stale closure
    const p = new URLSearchParams();
    if (search) p.set('search', search);
    if (category) p.set('category', category);
    if (sort) p.set('sort', sort);
    if (min) p.set('minPrice', min);
    if (max) p.set('maxPrice', max);
    if (minRating) p.set('rating', minRating);
    router.push(`${pathname}?${p.toString()}`);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    updateURL({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync products + pagination whenever the URL searchParams change (handles
  // browser back/forward and any router.push navigation including pagination)
  useEffect(() => {
    const sp = searchParams;
    const currentPage = parseInt(sp.get('page')) || 1;
    const currentSearch = sp.get('search') || '';
    const currentCategory = sp.get('category') || '';
    const currentSort = sp.get('sort') || '';
    const currentMinPrice = sp.get('minPrice') || '';
    const currentMaxPrice = sp.get('maxPrice') || '';
    const currentRating = sp.get('rating') || '';

    // Sync local state to URL
    setPage(currentPage);
    setSearch(currentSearch);
    setCategory(currentCategory);
    setSort(currentSort);
    setPriceRange({ min: currentMinPrice, max: currentMaxPrice });
    setMinRating(currentRating);

    // Fetch fresh products
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('limit', '12');
    if (currentSearch) params.set('search', currentSearch);
    if (currentCategory) params.set('category', currentCategory);
    if (currentSort) params.set('sort', currentSort);
    if (currentMinPrice) params.set('minPrice', currentMinPrice);
    if (currentMaxPrice) params.set('maxPrice', currentMaxPrice);
    if (currentRating) params.set('rating', currentRating);

    fetch(`/api/products?${params.toString()}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        const hasFilters = currentSearch || currentCategory || currentMinPrice || currentMaxPrice || currentRating;
        if (data?.products?.length) {
          setProducts(data.products);
          setPagination(data.pagination);
        } else if (currentPage === 1 && !hasFilters) {
          // Only fall back to mock when there are truly no filters at all
          setProducts(MOCK);
          setPagination({ currentPage: 1, totalPages: 1, total: MOCK.length });
        } else {
          // Filters active but no matching products
          setProducts([]);
          if (data?.pagination) setPagination(data.pagination);
        }
      })
      .catch(() => {
        if (currentPage === 1) setProducts(MOCK);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleCompare = (product) => {
    setCompareItems(prev => {
      if (prev.find(p => p._id === product._id)) return prev.filter(p => p._id !== product._id);
      if (prev.length >= 3) return prev;
      return [...prev, product];
    });
  };

  // Count active filters
  const activeFilterCount = [category, priceRange.min, priceRange.max, minRating].filter(Boolean).length;

  // Derived active filter pills
  const filterPills = [];
  if (category) filterPills.push({ key: 'category', label: category, clear: () => handleCategory('All') });
  if (priceRange.min || priceRange.max) filterPills.push({ key: 'price', label: `$${priceRange.min || 0}–$${priceRange.max || '∞'}`, clear: () => { setPriceRange({ min: '', max: '' }); updateURL({ page: 1 }); } });
  if (minRating) filterPills.push({ key: 'rating', label: `${minRating}★+`, clear: () => { setMinRating(''); updateURL({ page: 1 }); } });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes shimmer {
          0% { background-position: -400% 0; }
          100% { background-position: 400% 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes overlayIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes sidebarIn {
          from { transform: translateX(-100%); } to { transform: translateX(0); }
        }

        .cat-pill { transition: background 0.15s, color 0.15s, border-color 0.15s; }
        .cat-pill:hover { border-color: rgba(255,255,255,0.2) !important; color: #F9FAFB !important; }

        @media (max-width: 900px) {
          .layout-inner { flex-direction: column !important; }
          .sidebar-desktop { display: none !important; }
        }
      `}</style>

      <div style={{ background: t.bgPage, minHeight: '100vh' }}>

        {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
        <div style={{
          background: `linear-gradient(180deg, ${t.bgSection} 0%, ${t.bgPage} 100%)`,
          borderBottom: `1px solid ${t.borderNav}`,
          padding: '40px 32px 32px',
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
              <div>
                <p style={{ color: t.textFaint, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Syne, sans-serif', marginBottom: 4 }}>
                  <Link href="/" style={{ color: t.textFaint, textDecoration: 'none' }}>Home</Link>
                  <span style={{ margin: '0 6px' }}>›</span>
                  <span style={{ color: t.textSecondary }}>Products</span>
                  {category && <><span style={{ margin: '0 6px' }}>›</span><span style={{ color: CAT_COLORS[category] || '#818CF8' }}>{category}</span></>}
                </p>
                <h1 style={{ color: t.textPrimary, fontSize: 32, fontWeight: 900, fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}>
                  {category || 'All Products'}
                </h1>
                <p style={{ color: t.textFaint, fontSize: 14, marginTop: 4 }}>
                  {loading ? 'Loading…' : `${pagination?.total || products.length} products found`}
                </p>
              </div>

              {/* Search bar */}
              <div style={{ position: 'relative', width: 320 }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, opacity: 0.5 }}>🔍</span>
                <input
                  value={search}
                  onChange={e => handleSearchChange(e.target.value)}
                  placeholder="Search products, brands, model numbers…"
                  style={{
                    width: '100%', background: t.bgInput,
                    border: `1px solid ${t.borderInput}`,
                    borderRadius: 12, padding: '12px 40px 12px 40px',
                    color: t.textPrimary, fontSize: 13, outline: 'none',
                    fontFamily: 'DM Sans, sans-serif', transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = t.borderInput; e.target.style.boxShadow = 'none'; }}
                />
                {search && <button onClick={() => handleSearchChange('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: t.textFaint, cursor: 'pointer', fontSize: 16 }}>×</button>}
              </div>
            </div>

            {/* Category pills */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => {
                const active = (cat === 'All' && !category) || cat === category;
                const color = CAT_COLORS[cat];
                return (
                  <button key={cat} onClick={() => handleCategory(cat)} className="cat-pill" style={{
                    background: active ? `${color}22` : t.bgInput,
                    border: `1px solid ${active ? color + '55' : t.borderInput}`,
                    color: active ? color : t.textFaint,
                    borderRadius: 20, padding: '6px 16px',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'Syne, sans-serif',
                    boxShadow: active ? `0 0 12px ${color}22` : 'none',
                    transition: 'all 0.2s',
                  }}>{cat}</button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── TOOLBAR ─────────────────────────────────────────────────────── */}
        <div style={{ background: t.bgToolbar, borderBottom: `1px solid ${t.borderNav}`, padding: '12px 32px', transition: 'background 0.35s, border-color 0.35s' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Mobile filter button */}
              <button onClick={() => setSidebarOpen(true)} className="sidebar-desktop" style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: activeFilterCount > 0 ? 'rgba(99,102,241,0.15)' : t.bgSubtle,
                border: `1px solid ${activeFilterCount > 0 ? 'rgba(99,102,241,0.4)' : t.borderInput}`,
                color: activeFilterCount > 0 ? '#818CF8' : t.textSecondary,
                borderRadius: 10, padding: '8px 14px',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Syne, sans-serif',
                transition: 'background 0.35s, border-color 0.35s, color 0.35s',
              }}>
                ⚙ Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>

              {/* Active filter pills */}
              {filterPills.map(p => <FilterPill key={p.key} label={p.label} onRemove={p.clear} />)}
              {filterPills.length > 0 && (
                <button onClick={() => { setCategory(''); setPriceRange({ min: '', max: '' }); setMinRating(''); setSearch(''); setSort(''); router.push(pathname); }}
                  style={{ color: '#EF4444', fontSize: 12, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>
                  Clear all
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Sort */}
              <select value={sort} onChange={e => handleSort(e.target.value)} style={{
                background: t.bgInput,
                border: `1px solid ${t.borderInput}`,
                color: t.textSecondary, borderRadius: 10, padding: '8px 14px',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Syne, sans-serif', outline: 'none',
              }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} style={{ background: '#111827' }}>{o.label}</option>)}
              </select>

              {/* View toggle */}
              <div style={{ display: 'flex', background: t.bgSubtle, border: `1px solid ${t.borderInput}`, borderRadius: 10, overflow: 'hidden', transition: 'background 0.35s, border-color 0.35s' }}>
                {[['grid', '⊞'], ['list', '≡']].map(([mode, icon]) => (
                  <button key={mode} onClick={() => setViewMode(mode)} style={{
                    background: viewMode === mode ? 'rgba(99,102,241,0.2)' : 'transparent',
                    border: 'none', color: viewMode === mode ? '#818CF8' : t.textFaint,
                    padding: '8px 14px', cursor: 'pointer', fontSize: 16,
                    transition: 'background 0.15s, color 0.15s',
                  }}>{icon}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN LAYOUT ─────────────────────────────────────────────────── */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px' }}>
          <div className="layout-inner" style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>

            {/* Sidebar filters (desktop) */}
            <aside className="sidebar-desktop" style={{ width: 240, flexShrink: 0, position: 'sticky', top: 80 }}>
              <FilterSidebar
                priceRange={priceRange}
                onPriceRange={handlePriceRange}
                minRating={minRating}
                onRating={(r) => { setMinRating(r); updateURL({ page: 1 }); }}
              />
            </aside>

            {/* Product grid */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'list' ? '1fr' : 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} t={t} />)}
                </div>
              ) : products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 24px', background: t.bgCard, borderRadius: 20, border: `1px solid ${t.borderCard}`, transition: 'background 0.35s, border-color 0.35s' }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
                  <h3 style={{ color: t.textPrimary, fontSize: 20, fontWeight: 800, fontFamily: 'Syne, sans-serif', marginBottom: 8, transition: 'color 0.35s' }}>No products found</h3>
                  <p style={{ color: t.textFaint, fontSize: 14, marginBottom: 24, transition: 'color 0.35s' }}>Try adjusting your filters or search terms</p>
                  <button onClick={() => { setSearch(''); setCategory(''); setSort(''); setPriceRange({ min: '', max: '' }); setMinRating(''); router.push(pathname); }}
                    style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'list' ? '1fr' : 'repeat(auto-fill, minmax(240px, 1fr))', gap: viewMode === 'list' ? 10 : 16 }}>
                  {products.map((p, i) => (
                    <div key={p._id} style={{ animationDelay: `${i * 0.05}s` }}>
                      <ProductCard
                        product={p}
                        viewMode={viewMode}
                        onCompare={handleCompare}
                        isComparing={!!compareItems.find(c => c._id === p._id)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 48 }}>
                  <button onClick={() => handlePageChange(Math.max(1, page - 1))} disabled={page <= 1} style={paginationBtnStyle(false, page <= 1, t)}>← Prev</button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
                    .reduce((acc, p, i, arr) => {
                      if (i > 0 && p - arr[i - 1] > 1) acc.push('…');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) => p === '…'
                      ? <span key={`ellipsis-${i}`} style={{ color: t.textFaint, padding: '0 4px' }}>…</span>
                      : <button key={p} onClick={() => handlePageChange(p)} style={paginationBtnStyle(p === page, false, t)}>{p}</button>
                    )
                  }
                  <button onClick={() => handlePageChange(Math.min(pagination.totalPages, page + 1))} disabled={page >= pagination.totalPages} style={paginationBtnStyle(false, page >= pagination.totalPages, t)}>Next →</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Compare Tray */}
      <CompareTray
        items={compareItems}
        onRemove={(id) => setCompareItems(prev => prev.filter(p => p._id !== id))}
        onClear={() => setCompareItems([])}
      />

      {/* Mobile filter overlay */}
      {sidebarOpen && (
        <>
          <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 299, animation: 'overlayIn 0.2s ease' }} />
          <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 300, background: t.bgSection, border: `1px solid ${t.borderMuted}`, zIndex: 300, padding: 24, overflowY: 'auto', animation: 'sidebarIn 0.25s cubic-bezier(0.16,1,0.3,1)', transition: 'background 0.35s, border-color 0.35s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ color: t.textPrimary, fontWeight: 800, fontSize: 16, fontFamily: 'Syne, sans-serif', transition: 'color 0.35s' }}>Filters</h3>
              <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: t.textSecondary, cursor: 'pointer', fontSize: 20 }}>×</button>
            </div>
            <FilterSidebar
              priceRange={priceRange}
              onPriceRange={(r) => { handlePriceRange(r); setSidebarOpen(false); }}
              minRating={minRating}
              onRating={(r) => { setMinRating(r); updateURL({ page: 1 }); setSidebarOpen(false); }}
            />
          </div>
        </>
      )}
    </>
  );
}

// ─── FILTER SIDEBAR ───────────────────────────────────────────────────────────
function FilterSidebar({ priceRange, onPriceRange, minRating, onRating }) {
  const t = useT();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Price */}
      <div>
        <h4 style={{ color: t.textPrimary, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14, fontFamily: 'Syne, sans-serif' }}>Price Range</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {PRICE_RANGES.map(r => {
            const active = String(r.min) === String(priceRange.min) && (r.max === 99999 ? !priceRange.max : String(r.max) === String(priceRange.max));
            return (
              <button key={r.label} onClick={() => onPriceRange(r)} style={{
                background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                border: `1px solid ${active ? 'rgba(99,102,241,0.4)' : t.borderSubtle}`,
                color: active ? '#818CF8' : t.textFaint,
                borderRadius: 10, padding: '9px 14px',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'left',
                fontFamily: 'Syne, sans-serif', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = t.bgHover; e.currentTarget.style.color = t.textSecondary; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.textFaint; } }}
              >{r.label}</button>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 style={{ color: t.textPrimary, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14, fontFamily: 'Syne, sans-serif', transition: 'color 0.35s' }}>Min. Rating</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[4.5, 4, 3.5, 3].map(r => (
            <button key={r} onClick={() => onRating(minRating === String(r) ? '' : String(r))} style={{
              background: minRating === String(r) ? 'rgba(251,191,36,0.1)' : 'transparent',
              border: `1px solid ${minRating === String(r) ? 'rgba(251,191,36,0.35)' : t.borderSubtle}`,
              color: minRating === String(r) ? '#FBBF24' : t.textFaint,
              borderRadius: 10, padding: '9px 14px',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'left',
              fontFamily: 'Syne, sans-serif', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ color: '#FBBF24' }}>{'★'.repeat(Math.floor(r))}</span>
              {r}+ stars
            </button>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div>
        <h4 style={{ color: t.textPrimary, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14, fontFamily: 'Syne, sans-serif', transition: 'color 0.35s' }}>Availability</h4>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <input type="checkbox" style={{ accentColor: '#6366F1', width: 14, height: 14 }} />
          <span style={{ color: t.textSecondary, fontSize: 13, fontFamily: 'DM Sans, sans-serif', transition: 'color 0.35s' }}>In Stock Only</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginTop: 8 }}>
          <input type="checkbox" style={{ accentColor: '#6366F1', width: 14, height: 14 }} />
          <span style={{ color: t.textSecondary, fontSize: 13, fontFamily: 'DM Sans, sans-serif', transition: 'color 0.35s' }}>On Sale</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginTop: 8 }}>
          <input type="checkbox" style={{ accentColor: '#6366F1', width: 14, height: 14 }} />
          <span style={{ color: t.textSecondary, fontSize: 13, fontFamily: 'DM Sans, sans-serif', transition: 'color 0.35s' }}>Certified Refurbished</span>
        </label>
      </div>
    </div>
  );
}

// ─── PAGINATION BUTTON STYLE ──────────────────────────────────────────────────
function paginationBtnStyle(active, disabled, t) {
  return {
    background: active ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : t.bgSubtle,
    border: `1px solid ${active ? 'transparent' : t.borderInput}`,
    color: active ? '#fff' : disabled ? t.textVeryFaint : t.textSecondary,
    borderRadius: 10, padding: '9px 16px',
    fontSize: 13, fontWeight: 700, cursor: disabled ? 'default' : 'pointer',
    fontFamily: 'Syne, sans-serif',
    boxShadow: active ? '0 4px 12px rgba(99,102,241,0.4)' : 'none',
    transition: 'all 0.15s, background 0.35s, color 0.35s, border-color 0.35s',
    opacity: disabled ? 0.4 : 1,
  };
}
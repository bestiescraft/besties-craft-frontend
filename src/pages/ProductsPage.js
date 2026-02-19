import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL?.replace(/\/$/, '') ||
  'https://besties-craft-backend-1.onrender.com';

const CATEGORIES = [
  { label: 'All Products',      value: '',           emoji: '✨' },
  { label: 'Bracelets',         value: 'bracelets',  emoji: '📿' },
  { label: 'Handmade Flowers',  value: 'scarves',    emoji: '🌸' },
  { label: 'Keychains',         value: 'blankets',   emoji: '🔑' },
  { label: 'Hair Accessories',  value: 'bags',       emoji: '🎀' },
  { label: 'Gifting Items',     value: 'wool',       emoji: '🎁' },
  { label: 'Crafts',            value: 'crafts',     emoji: '🎨' },
];

const SORT_OPTIONS = [
  { label: 'Newest First',       value: 'newest'     },
  { label: 'Price: Low → High',  value: 'price_low'  },
  { label: 'Price: High → Low',  value: 'price_high' },
  { label: 'Top Rated',          value: 'rating'     },
];

const COLOR_MAP = {
  Red:'#EF4444', Pink:'#EC4899', Purple:'#A855F7', Blue:'#3B82F6',
  'Sky Blue':'#38BDF8', Green:'#22C55E', Yellow:'#EAB308', Orange:'#F97316',
  White:'#F5F5F5', Black:'#1E293B', Brown:'#92400E', Beige:'#D4C5A9',
  Grey:'#94A3B8', Cream:'#FFF9E6', Maroon:'#7F1D1D', Navy:'#1E3A5F'
};

const PLACEHOLDER = 'https://placehold.co/400x400/e8e0d5/a09080?text=Craft';

export default function ProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('');
  const [sort,     setSort]     = useState('newest');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setCategory(params.get('category') || '');
  }, [location.search]);

  useEffect(() => { fetchProducts(); }, [category, sort]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ sort });
      if (category) params.append('category', category);
      const res = await axios.get(`${BACKEND_URL}/api/products?${params}`);
      setProducts(res.data.products || []);
    } catch {
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(p =>
    !search.trim() ||
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const hasFilters = search || category || sort !== 'newest';
  const clearFilters = () => { setSearch(''); setCategory(''); setSort('newest'); navigate('/products'); };

  const activeCatLabel = CATEGORIES.find(c => c.value === category)?.label || 'All Products';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');
        :root {
          --cream: #faf7f2; --warm: #f2ede4; --sand: #e8dfd0;
          --terracotta: #c2602a; --brown: #5c3d2e;
          --dark: #2c1810; --text: #4a3728; --muted: #9a8070;
        }
        .pp-page { background: var(--cream); min-height: 100vh; font-family: 'Lato', sans-serif; }

        .pp-header { background: var(--warm); border-bottom: 1px solid var(--sand); padding: 2.5rem 2rem 1.75rem; }
        .pp-header-inner { max-width: 1180px; margin: 0 auto; }
        .pp-breadcrumb { display: flex; align-items: center; gap: 0.4rem; margin-bottom: 1rem; }
        .pp-bc-link { background: none; border: none; cursor: pointer; padding: 0; font-size: 0.78rem; color: var(--muted); font-family: 'Lato', sans-serif; transition: color 0.15s; }
        .pp-bc-link:hover { color: var(--dark); }
        .pp-bc-sep { color: var(--sand); font-size: 0.78rem; }
        .pp-title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; color: var(--dark); margin: 0 0 0.3rem; }
        .pp-count { font-size: 0.85rem; color: var(--muted); font-family: 'Lato', sans-serif; }

        /* Toolbar */
        .pp-toolbar { background: #fff; border-bottom: 1px solid var(--sand); padding: 0.9rem 2rem; position: sticky; top: 0; z-index: 40; box-shadow: 0 2px 10px rgba(44,24,16,0.05); }
        .pp-toolbar-inner { max-width: 1180px; margin: 0 auto; display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
        .pp-search-wrap { position: relative; flex: 1; min-width: 180px; }
        .pp-search-icon { position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
        .pp-search { width: 100%; padding: 0.6rem 0.9rem 0.6rem 2.4rem; border: 1.5px solid var(--sand); border-radius: 50px; font-size: 0.87rem; font-family: 'Lato', sans-serif; background: var(--cream); color: var(--dark); outline: none; transition: border-color 0.15s; box-sizing: border-box; }
        .pp-search:focus { border-color: var(--terracotta); }
        .pp-sort-wrap { position: relative; }
        .pp-sort { appearance: none; -webkit-appearance: none; padding: 0.6rem 2.4rem 0.6rem 1rem; border: 1.5px solid var(--sand); border-radius: 50px; font-size: 0.85rem; font-family: 'Lato', sans-serif; background: var(--cream); color: var(--dark); cursor: pointer; outline: none; transition: border-color 0.15s; }
        .pp-sort:focus { border-color: var(--terracotta); }
        .pp-sort-icon { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--muted); }
        .pp-clear-btn { display: flex; align-items: center; gap: 0.3rem; padding: 0.58rem 1rem; border-radius: 50px; border: 1.5px solid #fecdd3; background: #fff1f2; font-size: 0.8rem; font-family: 'Lato', sans-serif; color: #be123c; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
        .pp-clear-btn:hover { background: #ffe4e6; }

        /* Category pills */
        .pp-cat-bar { padding: 0.85rem 2rem; background: var(--warm); border-bottom: 1px solid var(--sand); overflow-x: auto; scrollbar-width: none; }
        .pp-cat-bar::-webkit-scrollbar { display: none; }
        .pp-cat-inner { max-width: 1180px; margin: 0 auto; display: flex; gap: 0.5rem; align-items: center; }
        .pp-cat-pill { display: flex; align-items: center; gap: 0.35rem; padding: 0.45rem 1.1rem; border-radius: 50px; white-space: nowrap; border: 1.5px solid var(--sand); background: transparent; font-size: 0.82rem; font-family: 'Lato', sans-serif; color: var(--text); cursor: pointer; transition: all 0.15s; font-weight: 600; }
        .pp-cat-pill:hover { border-color: var(--terracotta); color: var(--terracotta); }
        .pp-cat-pill.active { background: var(--dark); border-color: var(--dark); color: #fff; }

        /* Grid */
        .pp-body { max-width: 1180px; margin: 0 auto; padding: 2.5rem 2rem 5rem; }
        .pp-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }

        /* Card */
        .pp-card { background: #fff; border-radius: 18px; overflow: hidden; border: 1px solid var(--sand); cursor: pointer; transition: transform 0.22s, box-shadow 0.22s; font-family: 'Lato', sans-serif; }
        .pp-card:hover { transform: translateY(-6px); box-shadow: 0 18px 44px rgba(44,24,16,0.13); }
        .pp-card-img { height: 220px; overflow: hidden; background: var(--warm); position: relative; }
        .pp-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .pp-card:hover .pp-card-img img { transform: scale(1.07); }
        .pp-card-img-ph { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; background: var(--warm); }
        .pp-card-body { padding: 1.1rem 1.2rem 1.3rem; }
        .pp-card-cat { font-size: 0.63rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--terracotta); margin-bottom: 0.3rem; }
        .pp-card-name { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 600; color: var(--dark); margin: 0 0 0.55rem; line-height: 1.3; }
        .pp-card-colors { display: flex; gap: 4px; margin-bottom: 0.6rem; flex-wrap: wrap; }
        .pp-color-dot { width: 12px; height: 12px; border-radius: 50%; border: 1.5px solid rgba(0,0,0,0.12); }
        .pp-card-footer { display: flex; align-items: center; justify-content: space-between; }
        .pp-card-price { font-size: 1.05rem; font-weight: 700; color: var(--brown); }
        .pp-badge { font-size: 0.66rem; font-weight: 700; padding: 0.22rem 0.6rem; border-radius: 20px; }
        .pp-badge-in  { background: #d1fae5; color: #065f46; }
        .pp-badge-out { background: #fee2e2; color: #991b1b; }

        /* Empty / skeleton */
        .pp-empty { grid-column: 1 / -1; text-align: center; padding: 5rem 2rem; }
        .pp-empty-icon { font-size: 3.5rem; margin-bottom: 1rem; display: block; }
        .pp-empty-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: var(--dark); margin-bottom: 0.5rem; }
        .pp-empty-sub { font-size: 0.88rem; color: var(--muted); }
        .pp-skeleton { background: linear-gradient(90deg, var(--warm) 25%, var(--sand) 50%, var(--warm) 75%); background-size: 200% 100%; animation: pp-shimmer 1.4s infinite; border-radius: 18px; height: 300px; }
        @keyframes pp-shimmer { to { background-position: -200% 0; } }

        @media (max-width: 1024px) { .pp-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .pp-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 420px)  { .pp-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="pp-page">
        <Navbar />

        {/* Header */}
        <div className="pp-header">
          <div className="pp-header-inner">
            <div className="pp-breadcrumb">
              <button className="pp-bc-link" onClick={() => navigate('/')}>Home</button>
              <span className="pp-bc-sep">›</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--dark)', fontFamily: 'Lato, sans-serif' }}>{activeCatLabel}</span>
            </div>
            <h1 className="pp-title">{activeCatLabel}</h1>
            {!loading && <p className="pp-count">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</p>}
          </div>
        </div>

        {/* Toolbar */}
        <div className="pp-toolbar">
          <div className="pp-toolbar-inner">
            <div className="pp-search-wrap">
              <Search size={14} className="pp-search-icon" />
              <input className="pp-search" type="text" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="pp-sort-wrap">
              <select className="pp-sort" value={sort} onChange={e => setSort(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={14} className="pp-sort-icon" />
            </div>
            {hasFilters && (
              <button className="pp-clear-btn" onClick={clearFilters}><X size={12} /> Clear filters</button>
            )}
          </div>
        </div>

        {/* Category pills */}
        <div className="pp-cat-bar">
          <div className="pp-cat-inner">
            {CATEGORIES.map(cat => (
              <button key={cat.value} className={`pp-cat-pill${category === cat.value ? ' active' : ''}`}
                onClick={() => { setCategory(cat.value); navigate(cat.value ? `/products?category=${cat.value}` : '/products'); }}>
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="pp-body">
          <div className="pp-grid">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <div key={i} className="pp-skeleton" />)
            ) : filtered.length === 0 ? (
              <div className="pp-empty">
                <span className="pp-empty-icon">🧺</span>
                <div className="pp-empty-title">No products found</div>
                <div className="pp-empty-sub">{hasFilters ? 'Try clearing your filters.' : 'Check back soon — more handcrafted items coming!'}</div>
              </div>
            ) : (
              <AnimatePresence>
                {filtered.map((product, i) => (
                  <motion.div key={product._id} className="pp-card"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ delay: Math.min(i * 0.05, 0.3) }}
                    onClick={() => navigate(`/products/${product._id}`)}>
                    <div className="pp-card-img">
                      {product.images?.[0]?.url
                        ? <img src={product.images[0].url} alt={product.name} onError={e => { e.target.src = PLACEHOLDER; }} />
                        : <div className="pp-card-img-ph">🌸</div>}
                    </div>
                    <div className="pp-card-body">
                      {product.category && <div className="pp-card-cat">{product.category}</div>}
                      <h3 className="pp-card-name">{product.name}</h3>
                      {product.colors?.length > 0 && (
                        <div className="pp-card-colors">
                          {product.colors.slice(0, 6).map(c => (
                            <div key={c} className="pp-color-dot" style={{ background: COLOR_MAP[c] || '#ccc' }} title={c} />
                          ))}
                          {product.colors.length > 6 && <span style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>+{product.colors.length - 6}</span>}
                        </div>
                      )}
                      <div className="pp-card-footer">
                        <span className="pp-card-price">₹{parseFloat(product.base_price).toLocaleString('en-IN')}</span>
                        <span className={`pp-badge ${product.in_stock ? 'pp-badge-in' : 'pp-badge-out'}`}>
                          {product.in_stock ? 'In Stock' : 'Sold Out'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
import { BACKEND_URL, optimizeImageUrl } from '@/lib/constants';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import axios from 'axios';
import { toast } from 'sonner';
import usePageMeta from '@/hooks/usePageMeta';

const CATEGORIES = [
  { label: 'All Products',     value: '',                 emoji: '✨', seoTitle: 'Shop Handmade Crochet & Woollen Products — Besties Craft India', seoDesc: 'Browse 100% handmade crochet bracelets, woollen flowers, keychains, hair accessories and gifting items. Custom orders. Pan-India delivery from Varanasi.' },
  { label: 'Bracelets',        value: 'bracelets',        emoji: '📿', seoTitle: 'Handmade Crochet Bracelets Online India — Besties Craft', seoDesc: 'Buy handmade crochet bracelets online in India. Custom colours, friendship bracelets, woollen wrist accessories. Pan-India delivery. Order from Besties Craft, Varanasi.' },
  { label: 'Handmade Flowers', value: 'handmade-flowers', emoji: '🌸', seoTitle: 'Handmade Woollen Crochet Flowers Online India — Besties Craft', seoDesc: 'Shop handmade woollen and crochet flowers online in India. Perfect as gifts, bouquets and home décor. Custom orders accepted. Pan-India delivery from Varanasi.' },
  { label: 'Keychains',        value: 'keychains',        emoji: '🔑', seoTitle: 'Handmade Crochet Keychains Online India — Besties Craft', seoDesc: 'Buy cute handmade crochet keychains online in India. Customisable woollen keychains — perfect gifts for friends. Pan-India delivery from Besties Craft, Varanasi.' },
  { label: 'Hair Accessories', value: 'hair-accessories', emoji: '🎀', seoTitle: 'Handmade Crochet Hair Accessories Online India — Besties Craft', seoDesc: 'Shop handmade crochet and woollen hair accessories online in India — clips, bands, scrunchies and more. Custom orders. Pan-India delivery from Varanasi.' },
  { label: 'Gifting Items',    value: 'gifting-items',    emoji: '🎁', seoTitle: 'Handmade Crochet Gifting Items Online India — Besties Craft', seoDesc: "Buy unique handmade crochet gifting items online in India. Birthdays, anniversaries, Valentine's Day, festivals — we make the perfect custom handmade gift. Pan-India delivery." },
  { label: 'Crafts',           value: 'crafts',           emoji: '🎨', seoTitle: 'Handmade Crochet Crafts Online India — Besties Craft', seoDesc: 'Shop unique handmade crochet and woollen crafts online in India. Custom orders accepted. Pan-India delivery from Besties Craft, Varanasi.' },
];

const LEGACY_MAP = {
  scarves: 'handmade-flowers', blankets: 'keychains',
  bags: 'hair-accessories', wool: 'gifting-items',
  handmade: 'crafts', general: 'crafts',
};

const PLACEHOLDER = 'https://placehold.co/400x400/e8e0d5/a09080?text=Craft';

const normalizeCategory = (val) => {
  if (!val) return '';
  return LEGACY_MAP[val] || val;
};

const getCatLabel = (val) => {
  const normalized = normalizeCategory(val);
  return CATEGORIES.find(c => c.value === normalized)?.label || val;
};

const SORT_OPTIONS = [
  { label: 'Newest First',      value: 'newest'     },
  { label: 'Price: Low → High', value: 'price_low'  },
  { label: 'Price: High → Low', value: 'price_high' },
  { label: 'Top Rated',         value: 'rating'     },
];

const COLOR_MAP = {
  Red: '#EF4444', Pink: '#EC4899', Purple: '#A855F7', Blue: '#3B82F6',
  'Sky Blue': '#38BDF8', Green: '#22C55E', Yellow: '#EAB308', Orange: '#F97316',
  White: '#F5F5F5', Black: '#1E293B', Brown: '#92400E', Beige: '#D4C5A9',
  Grey: '#94A3B8', Cream: '#FFF9E6', Maroon: '#7F1D1D', Navy: '#1E3A5F',
};

export default function ProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('');
  const [sort,     setSort]     = useState('newest');

  const activeCatObj = CATEGORIES.find(c => c.value === category) || CATEGORIES[0];
  usePageMeta({
    title: activeCatObj.seoTitle,
    description: activeCatObj.seoDesc,
    url: category ? `/products?category=${category}` : '/products',
  });

  const pageSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: activeCatObj.seoTitle,
    description: activeCatObj.seoDesc,
    url: `https://www.bestiescraft.in${category ? `/products?category=${category}` : '/products'}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',     item: 'https://www.bestiescraft.in/' },
        { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://www.bestiescraft.in/products' },
        ...(category ? [{ '@type': 'ListItem', position: 3, name: activeCatObj.label, item: `https://www.bestiescraft.in/products?category=${category}` }] : []),
      ],
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setCategory(normalizeCategory(params.get('category') || ''));
  }, [location.search]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ sort });
      const res = await axios.get(`${BACKEND_URL}/api/products?${params}`);
      setProducts(res.data.products || []);
    } catch {
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filtered = products.filter(p => {
    const matchSearch = !search.trim() ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());

    const rawCats = [
      ...(Array.isArray(p.categories) ? p.categories : p.categories ? [p.categories] : []),
      ...(p.category && !Array.isArray(p.category) ? [p.category] : []),
    ];
    const productCats = [...new Set(rawCats.map(normalizeCategory).filter(Boolean))];
    const matchCat = !category || productCats.includes(category);

    return matchSearch && matchCat;
  });

  const hasFilters  = search || category || sort !== 'newest';
  const clearFilter = () => { setSearch(''); setCategory(''); setSort('newest'); navigate('/products'); };
  const activeCatLabel = CATEGORIES.find(c => c.value === category)?.label || 'All Products';

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageSchema }} />

      <style>{`
        :root {
          --cream: #faf7f2; --warm: #f2ede4; --sand: #e8dfd0;
          --terracotta: #c2602a; --brown: #5c3d2e; --dark: #2c1810;
          --text: #4a3728; --muted: #9a8070;
        }
        .pp-page { background: var(--cream); min-height: 100vh; font-family: 'Lato', sans-serif; }

        .pp-header { background: var(--warm); border-bottom: 1px solid var(--sand); padding: 2rem 2rem 1.5rem; }
        .pp-header-inner { max-width: 1180px; margin: 0 auto; }
        .pp-breadcrumb { display: flex; align-items: center; gap: .4rem; margin-bottom: .85rem; }
        .pp-bc-link { background: none; border: none; cursor: pointer; padding: 0; font-size: .78rem; color: var(--muted); font-family: 'Lato', sans-serif; transition: color .15s; }
        .pp-bc-link:hover { color: var(--dark); }
        .pp-bc-sep { color: var(--sand); font-size: .78rem; }
        .pp-title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.6rem, 2.8vw, 2.2rem); font-weight: 700; color: var(--dark); margin: 0 0 .3rem; }
        .pp-seo-sub { font-size: .82rem; color: var(--muted); font-family: 'Lato', sans-serif; max-width: 640px; line-height: 1.5; margin: .3rem 0 0; }
        .pp-count { font-size: .82rem; color: var(--muted); font-family: 'Lato', sans-serif; margin-top: .3rem; }

        .pp-toolbar { background: #fff; border-bottom: 1px solid var(--sand); padding: .75rem 2rem; position: sticky; top: 68px; z-index: 40; box-shadow: 0 2px 10px rgba(44,24,16,.05); }
        .pp-toolbar-inner { max-width: 1180px; margin: 0 auto; display: flex; align-items: center; gap: .65rem; flex-wrap: wrap; }
        .pp-search-wrap { position: relative; flex: 1; min-width: 180px; }
        .pp-search-icon { position: absolute; left: .85rem; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
        .pp-search { width: 100%; padding: .55rem .9rem .55rem 2.4rem; border: 1.5px solid var(--sand); border-radius: 50px; font-size: .86rem; font-family: 'Lato', sans-serif; background: var(--cream); color: var(--dark); outline: none; transition: border-color .15s; box-sizing: border-box; }
        .pp-search:focus { border-color: var(--terracotta); }
        .pp-sort-wrap { position: relative; }
        .pp-sort { appearance: none; -webkit-appearance: none; padding: .55rem 2.4rem .55rem 1rem; border: 1.5px solid var(--sand); border-radius: 50px; font-size: .84rem; font-family: 'Lato', sans-serif; background: var(--cream); color: var(--dark); cursor: pointer; outline: none; transition: border-color .15s; }
        .pp-sort:focus { border-color: var(--terracotta); }
        .pp-sort-icon { position: absolute; right: .75rem; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--muted); }
        .pp-clear-btn { display: flex; align-items: center; gap: .3rem; padding: .52rem 1rem; border-radius: 50px; border: 1.5px solid #fecdd3; background: #fff1f2; font-size: .78rem; font-family: 'Lato', sans-serif; color: #be123c; cursor: pointer; transition: all .15s; white-space: nowrap; }
        .pp-clear-btn:hover { background: #ffe4e6; }

        .pp-cat-bar { padding: .7rem 2rem; background: var(--warm); border-bottom: 1px solid var(--sand); overflow-x: auto; scrollbar-width: none; }
        .pp-cat-bar::-webkit-scrollbar { display: none; }
        .pp-cat-inner { max-width: 1180px; margin: 0 auto; display: flex; gap: .45rem; align-items: center; }
        .pp-cat-pill { display: flex; align-items: center; gap: .3rem; padding: .4rem 1rem; border-radius: 50px; white-space: nowrap; border: 1.5px solid var(--sand); background: transparent; font-size: .8rem; font-family: 'Lato', sans-serif; color: var(--text); cursor: pointer; transition: all .15s; font-weight: 600; }
        .pp-cat-pill:hover { border-color: var(--terracotta); color: var(--terracotta); }
        .pp-cat-pill.active { background: var(--dark); border-color: var(--dark); color: #fff; }

        .pp-body { max-width: 1180px; margin: 0 auto; padding: 2rem 2rem 4rem; }
        .pp-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.35rem; }
        .pp-card { background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid var(--sand); cursor: pointer; transition: transform .2s, box-shadow .2s; font-family: 'Lato', sans-serif; }
        .pp-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(44,24,16,.12); }
        .pp-card-img { height: 210px; overflow: hidden; background: var(--warm); position: relative; }
        .pp-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .4s ease; }
        .pp-card:hover .pp-card-img img { transform: scale(1.06); }
        .pp-card-img-ph { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2.8rem; background: var(--warm); }
        .pp-card-body { padding: 1rem 1.1rem 1.2rem; }
        .pp-card-cats { display: flex; gap: .3rem; flex-wrap: wrap; margin-bottom: .35rem; }
        .pp-card-cat { font-size: .6rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--terracotta); background: rgba(194,96,42,.08); padding: .13rem .45rem; border-radius: 20px; }
        .pp-card-name { font-family: 'Playfair Display', serif; font-size: .95rem; font-weight: 600; color: var(--dark); margin: 0 0 .5rem; line-height: 1.28; }
        .pp-card-colors { display: flex; gap: 4px; margin-bottom: .55rem; flex-wrap: wrap; align-items: center; }
        .pp-color-dot { width: 11px; height: 11px; border-radius: 50%; border: 1.5px solid rgba(0,0,0,.12); }
        .pp-card-footer { display: flex; align-items: center; justify-content: space-between; }
        .pp-card-price { font-size: 1rem; font-weight: 700; color: var(--brown); }
        .pp-badge { font-size: .63rem; font-weight: 700; padding: .2rem .55rem; border-radius: 20px; }
        .pp-badge-in { background: #d1fae5; color: #065f46; }
        .pp-badge-out { background: #fee2e2; color: #991b1b; }

        .pp-empty { grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; }
        .pp-empty-icon { font-size: 3rem; margin-bottom: .85rem; display: block; }
        .pp-empty-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: var(--dark); margin-bottom: .4rem; }
        .pp-empty-sub { font-size: .86rem; color: var(--muted); }

        .pp-skeleton { background: linear-gradient(90deg, var(--warm) 25%, var(--sand) 50%, var(--warm) 75%); background-size: 200% 100%; animation: pp-shimmer 1.4s infinite; border-radius: 16px; height: 290px; }
        @keyframes pp-shimmer { to { background-position: -200% 0; } }

        .pp-seo-block { grid-column: 1 / -1; background: var(--warm); border-radius: 14px; border: 1px solid var(--sand); padding: 1.75rem; margin-top: 1.25rem; }
        .pp-seo-block h2 { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 700; color: var(--dark); margin: 0 0 .65rem; }
        .pp-seo-block p { font-size: .8rem; color: var(--muted); line-height: 1.75; margin: 0; }

        @media (max-width: 1024px) { .pp-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .pp-grid { grid-template-columns: repeat(2, 1fr); } .pp-toolbar { top: 60px; } .pp-body { padding: 1.5rem 1rem 3rem; } .pp-header { padding: 1.5rem 1rem 1.25rem; } }
        @media (max-width: 420px)  { .pp-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="pp-page">
        <Navbar />

        <header className="pp-header">
          <div className="pp-header-inner">
            <nav className="pp-breadcrumb" aria-label="Breadcrumb">
              <button className="pp-bc-link" onClick={() => navigate('/')}>Home</button>
              <span className="pp-bc-sep" aria-hidden="true">›</span>
              {category ? (
                <>
                  <button className="pp-bc-link" onClick={() => navigate('/products')}>Products</button>
                  <span className="pp-bc-sep" aria-hidden="true">›</span>
                  <span style={{ fontSize: '.78rem', color: 'var(--dark)', fontFamily: 'Lato,sans-serif' }}>{activeCatLabel}</span>
                </>
              ) : (
                <span style={{ fontSize: '.78rem', color: 'var(--dark)', fontFamily: 'Lato,sans-serif' }}>Products</span>
              )}
            </nav>
            <h1 className="pp-title">
              {category ? `Handmade ${activeCatLabel} — Besties Craft India` : 'Handmade Crochet & Woollen Products India'}
            </h1>
            <p className="pp-seo-sub">{activeCatObj.seoDesc}</p>
            {!loading && <p className="pp-count">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</p>}
          </div>
        </header>

        <div className="pp-toolbar" role="search" aria-label="Filter products">
          <div className="pp-toolbar-inner">
            <div className="pp-search-wrap">
              <Search size={13} className="pp-search-icon" aria-hidden="true" />
              <input
                className="pp-search"
                type="search"
                placeholder="Search handmade crochet products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search products"
              />
            </div>
            <div className="pp-sort-wrap">
              <select className="pp-sort" value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort products">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={13} className="pp-sort-icon" aria-hidden="true" />
            </div>
            {hasFilters && (
              <button className="pp-clear-btn" onClick={clearFilter} aria-label="Clear all filters">
                <X size={11} aria-hidden="true" /> Clear filters
              </button>
            )}
          </div>
        </div>

        <nav className="pp-cat-bar" aria-label="Product categories">
          <div className="pp-cat-inner">
            {CATEGORIES.map(cat => (
              <button key={cat.value}
                className={`pp-cat-pill${category === cat.value ? ' active' : ''}`}
                aria-pressed={category === cat.value}
                onClick={() => {
                  setCategory(cat.value);
                  navigate(cat.value ? `/products?category=${cat.value}` : '/products');
                }}>
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </nav>

        <main className="pp-body">
          <div className="pp-grid" role="list" aria-label="Product listing">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="pp-skeleton" role="listitem" aria-label="Loading product" />
              ))
            ) : filtered.length === 0 ? (
              <div className="pp-empty" role="listitem">
                <span className="pp-empty-icon" aria-hidden="true">🧺</span>
                <div className="pp-empty-title">No products found</div>
                <div className="pp-empty-sub">
                  {hasFilters ? 'Try clearing your filters.' : 'Check back soon — more handcrafted items coming!'}
                </div>
              </div>
            ) : (
              <AnimatePresence>
                {filtered.map((product, i) => {
                  const rawCats = [
                    ...(Array.isArray(product.categories) ? product.categories : product.categories ? [product.categories] : []),
                    ...(product.category && !Array.isArray(product.category) ? [product.category] : []),
                  ];
                  const productCats = [...new Set(rawCats.map(normalizeCategory).filter(Boolean))];

                  return (
                    <motion.article
                      key={product._id}
                      className="pp-card"
                      role="listitem"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: Math.min(i * 0.04, 0.25) }}
                      onClick={() => navigate(`/products/${product._id}`)}
                      aria-label={`${product.name} — ₹${parseFloat(product.base_price).toLocaleString('en-IN')}`}
                    >
                      <div className="pp-card-img">
                        {product.images?.[0]?.url
                          ? <img
                              src={product.images[0].url}
                              alt={`Handmade ${product.name} — ${getCatLabel(productCats[0] || '')} by Besties Craft India`}
                              loading="lazy"
                              width="400"
                              height="210"
                              onError={e => { e.target.src = PLACEHOLDER; }}
                            />
                          : <div className="pp-card-img-ph" aria-hidden="true">🌸</div>}
                      </div>
                      <div className="pp-card-body">
                        {productCats.length > 0 && (
                          <div className="pp-card-cats">
                            {productCats.map(cat => (
                              <span key={cat} className="pp-card-cat">{getCatLabel(cat)}</span>
                            ))}
                          </div>
                        )}
                        <h2 className="pp-card-name">{product.name}</h2>
                        {product.colors?.length > 0 && (
                          <div className="pp-card-colors" aria-label={`Available colours: ${product.colors.join(', ')}`}>
                            {product.colors.slice(0, 6).map(c => (
                              <div key={c} className="pp-color-dot" style={{ background: COLOR_MAP[c] || '#ccc' }} title={c} aria-label={c} />
                            ))}
                            {product.colors.length > 6 && (
                              <span style={{ fontSize: '.6rem', color: 'var(--muted)' }}>+{product.colors.length - 6}</span>
                            )}
                          </div>
                        )}
                        <div className="pp-card-footer">
                          <span className="pp-card-price">₹{parseFloat(product.base_price).toLocaleString('en-IN')}</span>
                          <span className={`pp-badge ${product.in_stock ? 'pp-badge-in' : 'pp-badge-out'}`}>
                            {product.in_stock ? 'In Stock' : 'Sold Out'}
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            )}

            {!loading && (
              <div className="pp-seo-block">
                <h2>
                  {category
                    ? `Buy Handmade ${activeCatLabel} Online in India`
                    : 'Buy Handmade Crochet & Woollen Products Online in India'}
                </h2>
                <p>
                  Besties Craft offers 100% handmade crochet and woollen products crafted with
                  love in Varanasi, Uttar Pradesh. We deliver across India — Mumbai, Delhi,
                  Bangalore, Chennai, Hyderabad, Kolkata, Pune, Ahmedabad, Jaipur, Lucknow,
                  Surat, Indore, Chandigarh, Kochi, Nagpur, Noida and Gurgaon. Every item is
                  handcrafted and fully customisable — choose your colour, add a name or a
                  personal message. Perfect handmade gifts for birthdays, Valentine's Day,
                  friendships, weddings, anniversaries and festivals. Secure payment via
                  Razorpay (UPI, Cards, Net Banking). Custom crochet orders welcome — WhatsApp
                  us at +91 88107 76486.
                </p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
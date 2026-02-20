import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, Package, Star } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import axios from 'axios';

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL?.replace(/\/$/, '') ||
  'https://besties-craft-backend-1.onrender.com';

const CATEGORIES = [
  { name: 'Bracelets',         emoji: '📿', value: 'bracelets',    desc: 'Handcrafted wrist wear' },
  { name: 'Handmade Flowers',  emoji: '🌸', value: 'scarves',      desc: 'Delicate floral pieces' },
  { name: 'Keychains',         emoji: '🔑', value: 'blankets',     desc: 'Cute & custom keychains' },
  { name: 'Hair Accessories',  emoji: '🎀', value: 'bags',         desc: 'Clips, bands & more' },
  { name: 'Gifting Items',     emoji: '🎁', value: 'wool',         desc: 'Perfect for every occasion' },
  { name: 'Crafts',            emoji: '🎨', value: 'crafts',       desc: 'Unique handmade crafts' },
];

const FEATURES = [
  { icon: <Heart size={22} />,    title: 'Made with Love',     desc: 'Every piece is handcrafted with care and attention to detail.' },
  { icon: <Sparkles size={22} />, title: '100% Handmade',      desc: 'Authentic handmade goods — no factories, no mass production.' },
  { icon: <Package size={22} />,  title: 'Pan-India Delivery', desc: 'We ship to every corner of India with love-packed packaging.' },
  { icon: <Star size={22} />,     title: 'Quality Guaranteed', desc: 'Premium materials, skilled hands — quality you can feel in every stitch.' },
];

const PLACEHOLDER = 'https://placehold.co/400x400/e8e0d5/a09080?text=Craft';

export default function HomePage() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => { fetchFeatured(); }, []);

  const fetchFeatured = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/products?sort=newest`);
      setFeatured((res.data.products || []).slice(0, 4));
    } catch {
      setFeatured([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        :root {
          --cream: #faf7f2; --warm: #f2ede4; --sand: #e8dfd0;
          --terracotta: #c2602a; --brown: #5c3d2e;
          --dark: #2c1810; --text: #4a3728; --muted: #9a8070;
        }
        .hp-page { background: var(--cream); font-family: 'Lato', sans-serif; }

        .hp-hero {
          min-height: 88vh; display: flex; align-items: center;
          background: var(--warm); position: relative; overflow: hidden; padding: 4rem 2rem;
        }
        .hp-hero::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 50% at 80% 50%, rgba(194,96,42,0.08) 0%, transparent 70%),
                      radial-gradient(ellipse 40% 60% at 10% 80%, rgba(92,61,46,0.06) 0%, transparent 60%);
          pointer-events: none;
        }
        .hp-hero-inner {
          max-width: 1180px; margin: 0 auto; width: 100%;
          display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; position: relative; z-index: 1;
        }
        .hp-hero-tag {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: rgba(194,96,42,0.12); color: var(--terracotta);
          font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; padding: 0.4rem 1rem; border-radius: 20px; margin-bottom: 1.5rem;
        }
        .hp-hero-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 700; color: var(--dark);
          line-height: 1.15; margin: 0 0 1.5rem;
        }
        .hp-hero-title em { font-style: italic; color: var(--terracotta); }
        .hp-hero-sub {
          font-size: 1.05rem; color: var(--text); line-height: 1.75; margin: 0 0 2.5rem; max-width: 480px;
        }
        .hp-hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
        .hp-btn-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: var(--dark); color: #fff; padding: 0.9rem 2rem; border-radius: 50px;
          font-size: 0.95rem; font-weight: 700; border: none; cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s; font-family: 'Lato', sans-serif;
        }
        .hp-btn-primary:hover { background: var(--brown); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(44,24,16,0.2); }
        .hp-btn-outline {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: transparent; color: var(--dark); padding: 0.9rem 2rem; border-radius: 50px;
          font-size: 0.95rem; font-weight: 700; border: 2px solid var(--sand); cursor: pointer;
          transition: border-color 0.2s, background 0.2s; font-family: 'Lato', sans-serif;
        }
        .hp-btn-outline:hover { border-color: var(--dark); background: var(--warm); }
        .hp-hero-imgs {
          display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 0.75rem; height: 480px;
        }
        .hp-hero-img-main { grid-row: 1 / 3; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(44,24,16,0.18); }
        .hp-hero-img-sm { border-radius: 14px; overflow: hidden; box-shadow: 0 8px 24px rgba(44,24,16,0.12); }
        .hp-hero-img-main img, .hp-hero-img-sm img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .hp-hero-img-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, var(--sand) 0%, var(--warm) 100%); display: flex; align-items: center; justify-content: center; font-size: 3rem; }

        .hp-stats { background: var(--dark); color: #fff; padding: 1.5rem 2rem; }
        .hp-stats-inner { max-width: 1180px; margin: 0 auto; display: flex; justify-content: space-around; flex-wrap: wrap; gap: 1rem; }
        .hp-stat { text-align: center; font-family: 'Lato', sans-serif; }
        .hp-stat-num { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 700; color: #e8a87c; display: block; }
        .hp-stat-label { font-size: 0.78rem; color: rgba(255,255,255,0.6); letter-spacing: 0.06em; }

        .hp-sec-head { text-align: center; margin-bottom: 3rem; }
        .hp-sec-tag { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--terracotta); display: block; margin-bottom: 0.75rem; }
        .hp-sec-title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 700; color: var(--dark); margin: 0 0 0.75rem; }
        .hp-sec-sub { font-size: 0.95rem; color: var(--muted); max-width: 500px; margin: 0 auto; line-height: 1.7; }

        .hp-cats { padding: 5rem 2rem; background: var(--cream); }
        .hp-cats-grid { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: repeat(6, 1fr); gap: 1rem; }
        .hp-cat-card {
          background: var(--warm); border-radius: 18px; padding: 1.6rem 1rem 1.3rem;
          text-align: center; cursor: pointer; border: 1.5px solid transparent;
          transition: all 0.22s; font-family: 'Lato', sans-serif;
        }
        .hp-cat-card:hover {
          border-color: var(--terracotta); background: #fff;
          transform: translateY(-5px); box-shadow: 0 12px 32px rgba(194,96,42,0.13);
        }
        .hp-cat-emoji { font-size: 2.2rem; display: block; margin-bottom: 0.65rem; }
        .hp-cat-name { font-size: 0.82rem; font-weight: 700; color: var(--brown); display: block; margin-bottom: 0.25rem; }
        .hp-cat-desc { font-size: 0.68rem; color: var(--muted); display: block; line-height: 1.4; }

        .hp-featured { padding: 5rem 2rem; background: var(--warm); }
        .hp-products-grid { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .hp-prod-card {
          background: #fff; border-radius: 16px; overflow: hidden;
          border: 1px solid var(--sand); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; font-family: 'Lato', sans-serif;
        }
        .hp-prod-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(44,24,16,0.14); }
        .hp-prod-img { height: 220px; overflow: hidden; position: relative; background: var(--warm); }
        .hp-prod-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .hp-prod-card:hover .hp-prod-img img { transform: scale(1.07); }
        .hp-prod-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; background: var(--warm); }
        .hp-prod-body { padding: 1.1rem 1.2rem 1.3rem; }
        .hp-prod-cat { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--terracotta); margin-bottom: 0.3rem; }
        .hp-prod-name { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 600; color: var(--dark); margin: 0 0 0.6rem; line-height: 1.35; }
        .hp-prod-price { font-size: 1.05rem; font-weight: 700; color: var(--brown); }
        .hp-prod-stock { font-size: 0.72rem; color: #6b9e6b; font-weight: 600; margin-left: 0.6rem; }
        .hp-view-all { text-align: center; margin-top: 3rem; }

        .hp-why { padding: 5rem 2rem; background: var(--cream); }
        .hp-why-grid { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
        .hp-why-card { text-align: center; padding: 2rem 1.5rem; background: var(--warm); border-radius: 16px; border: 1px solid var(--sand); }
        .hp-why-icon { width: 52px; height: 52px; border-radius: 14px; background: rgba(194,96,42,0.1); color: var(--terracotta); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
        .hp-why-title { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 600; color: var(--dark); margin: 0 0 0.5rem; }
        .hp-why-desc { font-size: 0.85rem; color: var(--muted); line-height: 1.65; margin: 0; }

        .hp-cta { padding: 5rem 2rem; background: var(--dark); text-align: center; position: relative; overflow: hidden; }
        .hp-cta::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 70% 80% at 50% 50%, rgba(194,96,42,0.15) 0%, transparent 70%); pointer-events: none; }
        .hp-cta-title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.8rem, 3vw, 2.8rem); font-weight: 700; color: #fff; margin: 0 0 1rem; position: relative; z-index: 1; }
        .hp-cta-title em { font-style: italic; color: #e8a87c; }
        .hp-cta-sub { font-size: 1rem; color: rgba(255,255,255,0.6); margin: 0 auto 2.5rem; max-width: 480px; line-height: 1.7; position: relative; z-index: 1; }
        .hp-cta-btn { display: inline-flex; align-items: center; gap: 0.5rem; background: var(--terracotta); color: #fff; padding: 1rem 2.5rem; border-radius: 50px; font-size: 1rem; font-weight: 700; border: none; cursor: pointer; transition: background 0.2s, transform 0.15s; font-family: 'Lato', sans-serif; position: relative; z-index: 1; }
        .hp-cta-btn:hover { background: #a8512a; transform: translateY(-2px); }

        @media (max-width: 1024px) { .hp-cats-grid { grid-template-columns: repeat(3, 1fr); } .hp-products-grid { grid-template-columns: repeat(2, 1fr); } .hp-why-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px)  { .hp-hero-inner { grid-template-columns: 1fr; } .hp-hero-imgs { display: none; } .hp-cats-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 480px)  { .hp-cats-grid { grid-template-columns: repeat(2, 1fr); } .hp-products-grid { grid-template-columns: 1fr; } .hp-why-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="hp-page">
        <Navbar />

        {/* HERO */}
        <section className="hp-hero">
          <div className="hp-hero-inner">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="hp-hero-tag"><Sparkles size={13} /> Handcrafted in India</div>
              <h1 className="hp-hero-title">Crafted with hands,<br />gifted with <em>love</em></h1>
              <p className="hp-hero-sub">Discover our collection of handmade bracelets, flowers, keychains, hair accessories and more — each piece lovingly crafted by skilled artisans.</p>
              <div className="hp-hero-btns">
                <button className="hp-btn-primary" onClick={() => navigate('/products')}>Shop Now <ArrowRight size={16} /></button>
                <button className="hp-btn-outline" onClick={() => navigate('/about')}>Our Story</button>
              </div>
            </motion.div>
            <motion.div className="hp-hero-imgs" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="hp-hero-img-main">
                {featured[0]?.images?.[0]?.url ? <img src={featured[0].images[0].url} alt="Featured" onError={e => { e.target.parentNode.innerHTML = '<div class="hp-hero-img-placeholder">🌸</div>'; }} /> : <div className="hp-hero-img-placeholder">🌸</div>}
              </div>
              <div className="hp-hero-img-sm">
                {featured[1]?.images?.[0]?.url ? <img src={featured[1].images[0].url} alt="Featured" onError={e => { e.target.parentNode.innerHTML = '<div class="hp-hero-img-placeholder">📿</div>'; }} /> : <div className="hp-hero-img-placeholder">📿</div>}
              </div>
              <div className="hp-hero-img-sm">
                {featured[2]?.images?.[0]?.url ? <img src={featured[2].images[0].url} alt="Featured" onError={e => { e.target.parentNode.innerHTML = '<div class="hp-hero-img-placeholder">🎀</div>'; }} /> : <div className="hp-hero-img-placeholder">🎀</div>}
              </div>
            </motion.div>
          </div>
        </section>

        {/* STATS — "Easy Returns" removed, replaced with "Customisable" */}
        <div className="hp-stats">
          <div className="hp-stats-inner">
            {[
              { num: '500+',  label: 'Happy Customers' },
              { num: '100%',  label: 'Handmade' },
              { num: '50+',   label: 'Unique Designs' },
              { num: '✦',     label: 'Customisable Orders' },
            ].map((s, i) => (
              <motion.div key={i} className="hp-stat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.4 }}>
                <span className="hp-stat-num">{s.num}</span>
                <span className="hp-stat-label">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CATEGORIES */}
        <section className="hp-cats">
          <div style={{ maxWidth: 1180, margin: '0 auto' }}>
            <div className="hp-sec-head">
              <span className="hp-sec-tag">Browse by Category</span>
              <h2 className="hp-sec-title">What are you looking for?</h2>
              <p className="hp-sec-sub">From bracelets to gifting items — find your perfect handcrafted piece.</p>
            </div>
            <div className="hp-cats-grid">
              {CATEGORIES.map((cat, i) => (
                <motion.div key={cat.value} className="hp-cat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} onClick={() => navigate(`/products?category=${cat.value}`)}>
                  <span className="hp-cat-emoji">{cat.emoji}</span>
                  <span className="hp-cat-name">{cat.name}</span>
                  <span className="hp-cat-desc">{cat.desc}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="hp-featured">
          <div style={{ maxWidth: 1180, margin: '0 auto' }}>
            <div className="hp-sec-head">
              <span className="hp-sec-tag">Just In</span>
              <h2 className="hp-sec-title">New Arrivals</h2>
              <p className="hp-sec-sub">Fresh handcrafted pieces, made just for you.</p>
            </div>
            {loadingProducts ? (
              <p style={{ textAlign: 'center', color: '#aaa', fontFamily: 'sans-serif' }}>Loading products…</p>
            ) : featured.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#aaa', fontFamily: 'sans-serif' }}>No products yet.</p>
            ) : (
              <div className="hp-products-grid">
                {featured.map((product, i) => (
                  <motion.div key={product._id} className="hp-prod-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} onClick={() => navigate(`/products/${product._id}`)}>
                    <div className="hp-prod-img">
                      {product.images?.[0]?.url ? <img src={product.images[0].url} alt={product.name} onError={e => { e.target.src = PLACEHOLDER; }} /> : <div className="hp-prod-img-placeholder">🌸</div>}
                    </div>
                    <div className="hp-prod-body">
                      {product.category && <div className="hp-prod-cat">{product.category}</div>}
                      <h3 className="hp-prod-name">{product.name}</h3>
                      <div>
                        <span className="hp-prod-price">₹{parseFloat(product.base_price).toLocaleString('en-IN')}</span>
                        {product.in_stock && <span className="hp-prod-stock">● In Stock</span>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            <div className="hp-view-all">
              <button className="hp-btn-primary" onClick={() => navigate('/products')}>View All Products <ArrowRight size={16} /></button>
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section className="hp-why">
          <div style={{ maxWidth: 1180, margin: '0 auto' }}>
            <div className="hp-sec-head">
              <span className="hp-sec-tag">Why Besties Craft</span>
              <h2 className="hp-sec-title">Made differently, with love</h2>
            </div>
            <div className="hp-why-grid">
              {FEATURES.map((f, i) => (
                <motion.div key={i} className="hp-why-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className="hp-why-icon">{f.icon}</div>
                  <h3 className="hp-why-title">{f.title}</h3>
                  <p className="hp-why-desc">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="hp-cta">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="hp-cta-title">Every piece tells a <em>story</em></h2>
            <p className="hp-cta-sub">Gift something truly special — handmade with heart, wrapped with love. Perfect for every occasion.</p>
            <button className="hp-cta-btn" onClick={() => navigate('/products')}>Start Shopping <ArrowRight size={16} /></button>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
}
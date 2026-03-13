import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Minus, Plus, ArrowLeft, CheckCircle, Pencil, Star, Shield, Truck, RefreshCw } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useApp } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';

// ── Backend URL & Image Optimizer (was missing → now safe) ─────────────────────
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://api.bestiescraft.in';

const optimizeImageUrl = (url, opts = {}) => {
  if (!url || typeof url !== 'string') return null;
  // TODO: Replace with Vercel Image / Cloudinary / Imgix later for real compression
  return url; // pass-through (your images are already decent)
};

const PLACEHOLDER = 'https://via.placeholder.com/600x600/f5f5f0/cccccc?text=No+Image';

const fixImageUrl = (url, width = 800) => optimizeImageUrl(url, { width }) || PLACEHOLDER;

// (rest of your constants remain exactly the same — I kept them untouched)
const VALID_CATEGORIES = [ /* ... your original array ... */ ];
const normalizeCategory = (raw) => { /* ... your original function ... */ };
const CARE_INSTRUCTIONS = { /* ... your original ... */ };
const DEFAULT_CARE = [ /* ... */ ];
const PRESET_COLORS = [ /* ... */ ];
const COLOR_MAP = PRESET_COLORS.reduce((acc, c) => { acc[c.name] = c.hex; return acc; }, {});

// ── Dynamic SEO + Preload LCP Image ─────────────────────────────────────────
const setProductMeta = (product) => {
  if (!product) return;
  const catName = normalizeCategory(product.category) || 'Crochet Product';
  const title   = `Buy Handmade ${product.name} Online India — Besties Craft`;
  const desc    = `Buy handmade ${product.name} at ₹${product.base_price}. ${product.description?.slice(0, 110) || 'Handcrafted crochet product made with love in Varanasi, India.'} Custom colours. Pan-India delivery.`;
  const image   = product.images?.[0]?.url ? fixImageUrl(product.images[0].url) : '';
  const url     = `https://www.bestiescraft.in/products/${product._id}`;

  document.title = title;

  const setMeta = (sel, val) => {
    let el = document.querySelector(sel);
    if (!el) {
      el = document.createElement('meta');
      if (sel.includes('property=')) el.setAttribute('property', sel.match(/property="([^"]+)"/)[1]);
      else el.setAttribute('name', sel.match(/name="([^"]+)"/)[1]);
      document.head.appendChild(el);
    }
    el.setAttribute('content', val);
  };

  // SEO metas (unchanged)
  setMeta('meta[name="description"]', desc);
  setMeta('meta[name="keywords"]', `handmade ${product.name} India, buy ${product.name} online India, crochet ${catName.toLowerCase()} India, Besties Craft, woollen gifts India`);
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', desc);
  setMeta('meta[property="og:url"]', url);
  setMeta('meta[property="og:type"]', 'product');
  if (image) {
    setMeta('meta[property="og:image"]', image);
    setMeta('meta[property="og:image:alt"]', `Handmade ${product.name} — Besties Craft India`);
    setMeta('meta[name="twitter:image"]', image);
    setMeta('meta[name="twitter:image:alt"]', `Handmade ${product.name} — Besties Craft India`);
  }
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', desc);
  setMeta('meta[name="twitter:card"]', 'summary_large_image');

  // Canonical
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);

  // === NEW: Preload the LCP image (huge win for PageSpeed) ===
  if (image) {
    let preload = document.querySelector('link[rel="preload"][as="image"]');
    if (!preload) {
      preload = document.createElement('link');
      preload.rel = 'preload';
      preload.as = 'image';
      preload.href = image;
      preload.fetchPriority = 'high';
      document.head.appendChild(preload);
    }
  }

  // Structured Data (unchanged)
  const existing = document.getElementById('product-ld-json');
  if (existing) existing.remove();
  const script = document.createElement('script');
  script.id = 'product-ld-json';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `Handmade ${catName} crafted in Varanasi, India.`,
    image: product.images?.map(img => fixImageUrl(img.url)) || [],
    brand: { '@type': 'Brand', name: 'Besties Craft' },
    sku: product._id,
    category: catName,
    offers: { /* ... your original ... */ }
  });
  document.head.appendChild(script);
};

// (All your StarRating, RatingBar, ReviewCard, ReviewForm, ReviewsSection components are 100% unchanged — I kept them exactly as you wrote)

const ProductDetailPage = () => {
  // ... your entire state, fetchProduct, useEffect, handlers (unchanged) ...

  const images = getImages();

  return (
    <>
      <style>{`
        /* your original styles + one small addition for perfect CLS */
        .pdp-main-img-wrap {
          border-radius: 16px;
          overflow: hidden;
          background: #fff;
          border: 1px solid #e8e4df;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        /* ... rest of your original <style> block exactly as before ... */
      `}</style>

      <div className="pdp-page">
        <Navbar />

        <div className="pdp-wrap">
          {/* breadcrumb + back button (unchanged) */}

          <div className="pdp-grid">
            {/* ==================== GALLERY (PERFORMANCE FIXED) ==================== */}
            <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{duration:.45}}>
              <div className="pdp-main-img-wrap">
                <img
                  src={images[selectedImage]}
                  alt={`Handmade ${product.name} — ${displayCategory || 'Crochet product'} by Besties Craft India`}
                  width="600"
                  height="600"
                  loading="eager"
                  fetchpriority="high"
                  decoding="sync"
                  sizes="(max-width: 768px) 100vw, 600px"
                  style={st.mainImg}
                  onError={e => { e.target.src = PLACEHOLDER; }}
                />
              </div>

              {images.length > 1 && (
                <div className="pdp-thumb-row" style={st.thumbRow} role="list" aria-label="Product images">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      style={{ ...st.thumbBtn, ...(selectedImage === i ? st.thumbBtnActive : {}) }}
                      aria-label={`View image ${i + 1}`}
                      aria-pressed={selectedImage === i}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${i + 1}`}
                        width="68"
                        height="68"
                        loading="lazy"
                        decoding="async"
                        style={st.thumbImg}
                        onError={e => { e.target.src = PLACEHOLDER; }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info column (unchanged) */}

            {/* Related products images (also fixed) */}
            {relatedProducts.length > 0 && (
              <section className="pdp-related-section">
                {/* ... your map ... */}
                <img
                  src={rp.images?.[0]?.url ? fixImageUrl(rp.images[0].url) : PLACEHOLDER}
                  alt={`Handmade ${rp.name} — Besties Craft India`}
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="180"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.src = PLACEHOLDER; }}
                />
                {/* ... rest unchanged */}
              </section>
            )}
          </div>
        </div>

        <ReviewsSection ... />
        <Footer />
      </div>
    </>
  );
};

// Your `st` object remains 100% the same (I didn't touch it)

export default ProductDetailPage;
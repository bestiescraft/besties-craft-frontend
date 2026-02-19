import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Minus, Plus, ArrowLeft, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useApp } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL =
  process.env.REACT_APP_API_URL?.replace(/\/$/, '') ||
  process.env.REACT_APP_BACKEND_URL?.replace(/\/$/, '') ||
  'https://besties-craft-backend-1.onrender.com';

const PRESET_COLORS = [
  { name: 'Red',      hex: '#EF4444' },
  { name: 'Pink',     hex: '#EC4899' },
  { name: 'Purple',   hex: '#A855F7' },
  { name: 'Blue',     hex: '#3B82F6' },
  { name: 'Sky Blue', hex: '#38BDF8' },
  { name: 'Green',    hex: '#22C55E' },
  { name: 'Yellow',   hex: '#EAB308' },
  { name: 'Orange',   hex: '#F97316' },
  { name: 'White',    hex: '#F8FAFC' },
  { name: 'Black',    hex: '#1E293B' },
  { name: 'Brown',    hex: '#92400E' },
  { name: 'Beige',    hex: '#D4C5A9' },
  { name: 'Grey',     hex: '#94A3B8' },
  { name: 'Cream',    hex: '#FFFBEB' },
  { name: 'Maroon',   hex: '#7F1D1D' },
  { name: 'Navy',     hex: '#1E3A5F' },
];

const PLACEHOLDER = 'https://via.placeholder.com/600x600/f5f5f0/cccccc?text=No+Image';

const fixImageUrl = (url) => {
  if (!url) return PLACEHOLDER;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BACKEND_URL}${url}`;
};

const COLOR_MAP = PRESET_COLORS.reduce((acc, c) => { acc[c.name] = c.hex; return acc; }, {});

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { cart, setCart } = useApp();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const colorFromUrl = searchParams.get('color');
  const [selectedColor, setSelectedColor] = useState(colorFromUrl || null);

  useEffect(() => { if (id) fetchProduct(); }, [id]);

  useEffect(() => {
    if (product?.colors?.length > 0) {
      if (colorFromUrl && product.colors.includes(colorFromUrl)) {
        setSelectedColor(colorFromUrl);
      } else {
        setSelectedColor(product.colors[0]);
        setSearchParams({ color: product.colors[0] }, { replace: true });
      }
    }
    if (product?.category) fetchRelated(product.category, product._id);
  }, [product]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setSelectedImage(0);
      const response = await axios.get(`${BACKEND_URL}/api/products/${id}`);
      setProduct(response.data.product);
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Unable to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelated = async (category, currentId) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/products?category=${category}&sort=newest`);
      const others = (res.data.products || []).filter(p => p._id !== currentId).slice(0, 4);
      setRelatedProducts(others);
    } catch {
      setRelatedProducts([]);
    }
  };

  const handleColorSelect = (colorName) => {
    setSelectedColor(colorName);
    setSearchParams({ color: colorName }, { replace: true });
  };

  const addToCart = () => {
    if (!product) return;
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color first');
      return;
    }
    const existingItem = cart.find(
      item => item.product_id === product._id && item.color === selectedColor
    );
    let newCart;
    if (existingItem) {
      newCart = cart.map(item =>
        item.product_id === product._id && item.color === selectedColor
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [
        ...cart,
        {
          product_id: product._id,
          product_name: product.name,
          price: product.base_price,
          image: product.images?.length > 0 ? fixImageUrl(product.images[0].url) : '',
          quantity,
          color: selectedColor || null,
        }
      ];
    }
    setCart(newCart);
    toast.success(`${product.name}${selectedColor ? ` (${selectedColor})` : ''} added to cart!`);
  };

  const getImages = () => {
    if (product?.images && product.images.length > 0) {
      return product.images.map(img => fixImageUrl(img.url));
    }
    return [PLACEHOLDER];
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f7f4' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={styles.spinner} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f7f4' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <p style={{ color: '#888', fontFamily: 'sans-serif' }}>Product not found</p>
          <button style={styles.backBtn} onClick={() => navigate('/products')}>← Back to Products</button>
        </div>
      </div>
    );
  }

  const images = getImages();
  const inStock = (product.in_stock === true) || (product.stock !== undefined && product.stock > 0);
  const colors = product.colors || [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');

        .pdp-page { background: #f8f7f4; min-height: 100vh; display: flex; flex-direction: column; }

        .pdp-wrap { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem 4rem; width: 100%; box-sizing: border-box; }

        .pdp-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        /* ===== MOBILE FIXES ===== */
        @media (max-width: 768px) {
          .pdp-wrap { padding: 1rem 0 3rem; }
          .pdp-back { margin: 0 1rem 1.25rem !important; }
          .pdp-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }
          .pdp-gallery { padding: 0 !important; }
          .pdp-main-img-wrap {
            border-radius: 0 !important;
            border-left: none !important;
            border-right: none !important;
            aspect-ratio: 1 !important;
          }
          .pdp-thumb-row { padding: 0 1rem !important; }
          .pdp-info-col { padding: 1.25rem 1rem 0 !important; }
          .pdp-product-name { font-size: 1.6rem !important; }
          .pdp-price { font-size: 1.7rem !important; }

          /* Related products: 2 columns on mobile */
          .pdp-related-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
          }
          .pdp-related-section { padding: 2rem 1rem !important; }
          .pdp-related-img { height: 150px !important; }
        }

        @media (max-width: 380px) {
          .pdp-related-grid { grid-template-columns: 1fr !important; }
        }

        /* Related products section */
        .pdp-related-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 3rem 1.5rem 4rem;
          width: 100%;
          box-sizing: border-box;
        }
        .pdp-related-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 1.5rem;
        }
        .pdp-related-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }
        .pdp-related-card {
          background: #fff;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #e8e4df;
          cursor: pointer;
          transition: transform 0.22s, box-shadow 0.22s;
        }
        .pdp-related-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.1);
        }
        .pdp-related-img {
          height: 180px;
          overflow: hidden;
          background: #f5f0ea;
        }
        .pdp-related-img img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.4s ease;
        }
        .pdp-related-card:hover .pdp-related-img img { transform: scale(1.06); }
        .pdp-related-body { padding: 0.85rem 1rem 1rem; }
        .pdp-related-name {
          font-family: 'Playfair Display', serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 0.4rem;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pdp-related-price {
          font-family: sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: #5c3d2e;
        }
        .pdp-related-colors {
          display: flex; gap: 3px; margin-bottom: 0.4rem; flex-wrap: wrap;
        }
        .pdp-color-dot {
          width: 10px; height: 10px; border-radius: 50%;
          border: 1.5px solid rgba(0,0,0,0.1);
        }
        .pdp-divider {
          border: none; border-top: 1px solid #e8e4df;
          margin: 0; width: 100%;
        }
      `}</style>

      <div className="pdp-page">
        <Navbar />

        <div className="pdp-wrap">
          {/* Back button */}
          <button className="pdp-back" style={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back to Products
          </button>

          <div className="pdp-grid">
            {/* LEFT: Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className="pdp-gallery"
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <div className="pdp-main-img-wrap" style={styles.mainImgWrap}>
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  style={styles.mainImg}
                  onError={e => { e.target.src = PLACEHOLDER; }}
                />
              </div>

              {images.length > 1 && (
                <div className="pdp-thumb-row" style={styles.thumbRow}>
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      style={{
                        ...styles.thumbBtn,
                        ...(selectedImage === i ? styles.thumbBtnActive : {})
                      }}
                    >
                      <img
                        src={img}
                        alt={`View ${i + 1}`}
                        style={styles.thumbImg}
                        onError={e => { e.target.src = PLACEHOLDER; }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* RIGHT: Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="pdp-info-col"
              style={styles.infoCol}
            >
              {product.category && (
                <span style={styles.categoryTag}>{product.category.toUpperCase()}</span>
              )}

              <h1 className="pdp-product-name" style={styles.productName}>{product.name}</h1>

              <div style={styles.priceRow}>
                <span className="pdp-price" style={styles.price}>
                  ₹{parseFloat(product.base_price).toLocaleString('en-IN')}
                </span>
                {inStock ? (
                  <span style={styles.inStockBadge}><CheckCircle size={13} /> In Stock</span>
                ) : (
                  <span style={styles.outStockBadge}>Out of Stock</span>
                )}
              </div>

              {product.description && (
                <p style={styles.description}>{product.description}</p>
              )}

              {inStock && (
                <>
                  {colors.length > 0 && (
                    <div style={styles.section}>
                      <div style={styles.sectionLabel}>
                        Colour:&nbsp;
                        <span style={styles.selectedColorName}>{selectedColor || '—'}</span>
                      </div>
                      <div style={styles.swatchRow}>
                        {colors.map(colorName => {
                          const preset = PRESET_COLORS.find(p => p.name === colorName);
                          const hex = preset ? preset.hex : '#ccc';
                          const isSelected = selectedColor === colorName;
                          return (
                            <button
                              key={colorName}
                              title={colorName}
                              onClick={() => handleColorSelect(colorName)}
                              style={{
                                ...styles.swatch,
                                background: hex,
                                ...(isSelected ? styles.swatchSelected : {})
                              }}
                            >
                              {isSelected && <span style={styles.swatchCheck}>✓</span>}
                            </button>
                          );
                        })}
                      </div>
                      {selectedColor && (
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.82rem', color: '#888', fontFamily: 'sans-serif' }}>
                          Selected: <strong style={{ color: '#333' }}>{selectedColor}</strong>
                        </p>
                      )}
                    </div>
                  )}

                  <div style={styles.section}>
                    <div style={styles.sectionLabel}>Quantity</div>
                    <div style={styles.qtyRow}>
                      <button style={styles.qtyBtn} onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>
                        <Minus size={16} />
                      </button>
                      <span style={styles.qtyNum}>{quantity}</span>
                      <button style={styles.qtyBtn} onClick={() => setQuantity(q => q + 1)}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <button style={styles.cartBtn} onClick={addToCart}>
                    <ShoppingCart size={20} /> Add to Cart
                  </button>
                </>
              )}

              {!inStock && (
                <div style={styles.outOfStockBox}>
                  <p style={{ margin: 0, color: '#be123c', fontWeight: 600 }}>
                    This product is currently out of stock.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* ===== RELATED PRODUCTS ===== */}
        {relatedProducts.length > 0 && (
          <>
            <hr className="pdp-divider" />
            <div className="pdp-related-section">
              <h2 className="pdp-related-title">✨ You May Also Like</h2>
              <div className="pdp-related-grid">
                {relatedProducts.map((rp, i) => (
                  <motion.div
                    key={rp._id}
                    className="pdp-related-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => { navigate(`/products/${rp._id}`); window.scrollTo(0, 0); }}
                  >
                    <div className="pdp-related-img">
                      <img
                        src={rp.images?.[0]?.url ? fixImageUrl(rp.images[0].url) : PLACEHOLDER}
                        alt={rp.name}
                        onError={e => { e.target.src = PLACEHOLDER; }}
                      />
                    </div>
                    <div className="pdp-related-body">
                      {rp.colors?.length > 0 && (
                        <div className="pdp-related-colors">
                          {rp.colors.slice(0, 5).map(c => (
                            <div key={c} className="pdp-color-dot" style={{ background: COLOR_MAP[c] || '#ccc' }} title={c} />
                          ))}
                        </div>
                      )}
                      <div className="pdp-related-name">{rp.name}</div>
                      <div className="pdp-related-price">₹{parseFloat(rp.base_price).toLocaleString('en-IN')}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}

        <Footer />
      </div>
    </>
  );
};

const styles = {
  backBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#666', fontSize: '0.9rem', fontFamily: 'sans-serif',
    marginBottom: '2rem', padding: 0, transition: 'color 0.15s',
  },
  mainImgWrap: {
    borderRadius: '16px', overflow: 'hidden', background: '#fff',
    border: '1px solid #e8e4df', aspectRatio: '1',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  mainImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  thumbRow: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  thumbBtn: {
    width: 68, height: 68, borderRadius: '10px', overflow: 'hidden',
    border: '2px solid #e8e4df', padding: 0, cursor: 'pointer',
    background: '#fff', flexShrink: 0, transition: 'border-color 0.15s',
  },
  thumbBtnActive: { borderColor: '#1a1a1a', boxShadow: '0 0 0 1px #1a1a1a' },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  infoCol: { display: 'flex', flexDirection: 'column', gap: 0, paddingTop: '0.5rem' },
  categoryTag: {
    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
    color: '#c2410c', fontFamily: 'sans-serif', marginBottom: '0.5rem', display: 'block',
  },
  productName: {
    fontFamily: 'Georgia, serif', fontSize: '2.2rem', fontWeight: 700,
    color: '#1a1a1a', margin: '0 0 1rem', lineHeight: 1.2,
  },
  priceRow: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' },
  price: { fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 700, color: '#1a1a1a' },
  inStockBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    background: '#d1fae5', color: '#065f46', fontSize: '0.78rem',
    fontWeight: 600, padding: '0.3rem 0.75rem', borderRadius: '20px', fontFamily: 'sans-serif',
  },
  outStockBadge: {
    background: '#fee2e2', color: '#991b1b', fontSize: '0.78rem',
    fontWeight: 600, padding: '0.3rem 0.75rem', borderRadius: '20px', fontFamily: 'sans-serif',
  },
  description: {
    fontFamily: 'sans-serif', fontSize: '0.95rem', color: '#555',
    lineHeight: 1.7, margin: '0 0 1.5rem',
  },
  section: { marginBottom: '1.5rem' },
  sectionLabel: { fontFamily: 'sans-serif', fontSize: '0.85rem', fontWeight: 600, color: '#444', marginBottom: '0.6rem' },
  selectedColorName: { fontWeight: 400, color: '#888' },
  swatchRow: { display: 'flex', gap: '0.6rem', flexWrap: 'wrap' },
  swatch: {
    width: 36, height: 36, borderRadius: '50%', border: '2.5px solid transparent',
    cursor: 'pointer', position: 'relative', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 0 0 1.5px rgba(0,0,0,0.12)',
    transition: 'transform 0.15s, box-shadow 0.15s', outline: 'none',
  },
  swatchSelected: { boxShadow: '0 0 0 2px #fff, 0 0 0 4px #1a1a1a', transform: 'scale(1.1)' },
  swatchCheck: { color: '#fff', fontSize: '0.8rem', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.5)', lineHeight: 1 },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '1rem' },
  qtyBtn: {
    width: 42, height: 42, borderRadius: '50%', border: '1.5px solid #e8e4df',
    background: '#fff', cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center', color: '#444', transition: 'background 0.15s',
  },
  qtyNum: {
    fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: 600,
    color: '#1a1a1a', minWidth: 32, textAlign: 'center',
  },
  cartBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '0.6rem', width: '100%', padding: '1rem',
    background: '#1a1a1a', color: '#fff', border: 'none',
    borderRadius: '12px', fontSize: '1rem', fontWeight: 600,
    fontFamily: 'sans-serif', cursor: 'pointer', transition: 'background 0.2s', marginTop: '0.5rem',
  },
  outOfStockBox: {
    background: '#fff1f2', border: '1px solid #fecdd3',
    borderRadius: '12px', padding: '1rem 1.25rem', marginTop: '1rem',
  },
  spinner: {
    width: 36, height: 36, border: '3px solid #e8e4df',
    borderTop: '3px solid #1a1a1a', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

export default ProductDetailPage;
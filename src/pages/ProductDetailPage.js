import React, { useEffect, useState } from 'react';
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

// ✅ FIX 2: Helper to ensure image URLs are always absolute
const fixImageUrl = (url) => {
  if (!url) return PLACEHOLDER;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BACKEND_URL}${url}`;
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { cart, setCart } = useApp();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // ✅ FIX 3: Read selected color from URL query param so sharing a color link works
  // e.g. /products/123?color=Red
  const colorFromUrl = searchParams.get('color');
  const [selectedColor, setSelectedColor] = useState(colorFromUrl || null);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  // Sync color from URL when product loads
  useEffect(() => {
    if (product?.colors?.length > 0) {
      // If URL has a valid color, use it; otherwise default to first color
      if (colorFromUrl && product.colors.includes(colorFromUrl)) {
        setSelectedColor(colorFromUrl);
      } else {
        setSelectedColor(product.colors[0]);
        setSearchParams({ color: product.colors[0] }, { replace: true });
      }
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/products/${id}`);
      setProduct(response.data.product);
    } catch (error) {
      toast.error(error?.response?.data?.detail || error?.message || 'Unable to fetch product');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX 3: When user clicks a color swatch, update URL so it's shareable/navigable
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
          // ✅ FIX 2: fix image URL for cart item too
          image: product.images?.length > 0 ? fixImageUrl(product.images[0].url) : '',
          quantity,
          color: selectedColor || null,
        }
      ];
    }
    setCart(newCart);
    toast.success(`${product.name}${selectedColor ? ` (${selectedColor})` : ''} added to cart!`);
  };

  // ✅ FIX 2: All image URLs go through fixImageUrl
  const getImages = () => {
    if (product?.images && product.images.length > 0) {
      return product.images.map(img => fixImageUrl(img.url));
    }
    return [PLACEHOLDER];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div style={styles.spinner} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p style={{ color: '#888', fontFamily: 'sans-serif' }}>Product not found</p>
          <button style={styles.backBtn} onClick={() => navigate('/products')}>
            ← Back to Products
          </button>
        </div>
      </div>
    );
  }

  const images = getImages();
  const inStock = (product.in_stock === true) || (product.stock !== undefined && product.stock > 0);
  const colors = product.colors || [];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f8f7f4' }}>
      <Navbar />

      <div style={styles.page}>
        {/* ✅ Back button — goes back to previous page (products list) */}
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Back to Products
        </button>

        <div style={styles.grid}>
          {/* LEFT: Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            style={styles.galleryCol}
          >
            <div style={styles.mainImgWrap}>
              <img
                src={images[selectedImage]}
                alt={product.name}
                style={styles.mainImg}
                onError={e => { e.target.src = PLACEHOLDER; }}
              />
            </div>

            {images.length > 1 && (
              <div style={styles.thumbRow}>
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
            style={styles.infoCol}
          >
            {product.category && (
              <span style={styles.categoryTag}>
                {product.category.toUpperCase()}
              </span>
            )}

            <h1 style={styles.productName}>{product.name}</h1>

            <div style={styles.priceRow}>
              <span style={styles.price}>₹{parseFloat(product.base_price).toLocaleString('en-IN')}</span>
              {inStock ? (
                <span style={styles.inStockBadge}>
                  <CheckCircle size={13} />
                  In Stock
                </span>
              ) : (
                <span style={styles.outStockBadge}>Out of Stock</span>
              )}
            </div>

            {product.description && (
              <p style={styles.description}>{product.description}</p>
            )}

            {inStock && (
              <>
                {/* ✅ FIX 3: Colour swatches — clicking updates URL param */}
                {colors.length > 0 && (
                  <div style={styles.section}>
                    <div style={styles.sectionLabel}>
                      Colour:&nbsp;
                      <span style={styles.selectedColorName}>
                        {selectedColor || '—'}
                      </span>
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
                            {isSelected && (
                              <span style={styles.swatchCheck}>✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {/* Colour name label below swatches */}
                    {selectedColor && (
                      <p style={{ margin: '0.5rem 0 0', fontSize: '0.82rem', color: '#888', fontFamily: 'sans-serif' }}>
                        Selected: <strong style={{ color: '#333' }}>{selectedColor}</strong>
                      </p>
                    )}
                  </div>
                )}

                {/* Quantity */}
                <div style={styles.section}>
                  <div style={styles.sectionLabel}>Quantity</div>
                  <div style={styles.qtyRow}>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span style={styles.qtyNum}>{quantity}</span>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => setQuantity(q => q + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <button style={styles.cartBtn} onClick={addToCart}>
                  <ShoppingCart size={20} />
                  Add to Cart
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

      <Footer />
    </div>
  );
};

const styles = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem 4rem' },
  backBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#666', fontSize: '0.9rem', fontFamily: 'sans-serif',
    marginBottom: '2rem', padding: 0, transition: 'color 0.15s',
  },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' },
  galleryCol: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
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
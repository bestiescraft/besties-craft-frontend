import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Minus, Plus, ArrowLeft, CheckCircle, Pencil, Star } from 'lucide-react';
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
  { name: 'Red',      hex: '#EF4444' }, { name: 'Pink',     hex: '#EC4899' },
  { name: 'Purple',   hex: '#A855F7' }, { name: 'Blue',     hex: '#3B82F6' },
  { name: 'Sky Blue', hex: '#38BDF8' }, { name: 'Green',    hex: '#22C55E' },
  { name: 'Yellow',   hex: '#EAB308' }, { name: 'Orange',   hex: '#F97316' },
  { name: 'White',    hex: '#F8FAFC' }, { name: 'Black',    hex: '#1E293B' },
  { name: 'Brown',    hex: '#92400E' }, { name: 'Beige',    hex: '#D4C5A9' },
  { name: 'Grey',     hex: '#94A3B8' }, { name: 'Cream',    hex: '#FFFBEB' },
  { name: 'Maroon',   hex: '#7F1D1D' }, { name: 'Navy',     hex: '#1E3A5F' },
];

const PLACEHOLDER = 'https://via.placeholder.com/600x600/f5f5f0/cccccc?text=No+Image';
const fixImageUrl = (url) => {
  if (!url) return PLACEHOLDER;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BACKEND_URL}${url}`;
};
const COLOR_MAP = PRESET_COLORS.reduce((acc, c) => { acc[c.name] = c.hex; return acc; }, {});

// ── Star Rating ──────────────────────────────────────────────────────────────
const StarRating = ({ value = 0, max = 5, size = 18, interactive = false, onChange }) => {
  const [hovered, setHovered] = useState(0);
  const display = interactive ? (hovered || value) : value;
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(display);
        return (
          <span key={i}
            onClick={() => interactive && onChange && onChange(i + 1)}
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onMouseLeave={() => interactive && setHovered(0)}
            style={{ cursor: interactive ? 'pointer' : 'default', color: filled ? '#f59e0b' : '#d1d5db', fontSize: size, lineHeight: 1, transition: 'color 0.12s' }}>
            {filled ? '★' : '☆'}
          </span>
        );
      })}
    </div>
  );
};

// ── Rating Bar ───────────────────────────────────────────────────────────────
const RatingBar = ({ star, count, total }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
      <span style={{ fontSize: '0.78rem', color: '#9a8070', fontFamily: 'sans-serif', minWidth: 10 }}>{star}</span>
      <span style={{ color: '#f59e0b', fontSize: 11 }}>★</span>
      <div style={{ flex: 1, height: 7, background: '#f0ebe3', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#f59e0b', borderRadius: 99, transition: 'width 0.5s' }} />
      </div>
      <span style={{ fontSize: '0.75rem', color: '#9a8070', fontFamily: 'sans-serif', minWidth: 20, textAlign: 'right' }}>{count}</span>
    </div>
  );
};

// ── Review Card ──────────────────────────────────────────────────────────────
const ReviewCard = ({ review, index }) => {
  const initial = (review.reviewer_name || review.user_email || 'A')[0].toUpperCase();
  const name    = review.reviewer_name || review.user_email?.split('@')[0] || 'Anonymous';
  const date    = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0ebe3', padding: '1.25rem 1.4rem', marginBottom: '0.85rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#c2602a,#5c3d2e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem', fontWeight: 700, fontFamily: 'sans-serif', flexShrink: 0 }}>
          {initial}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.3rem' }}>
            <span style={{ fontFamily: 'sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#2c1810' }}>{name}</span>
            <span style={{ fontSize: '0.72rem', color: '#9a8070', fontFamily: 'sans-serif' }}>{date}</span>
          </div>
          <div style={{ marginTop: '0.25rem', marginBottom: '0.5rem' }}>
            <StarRating value={review.rating} size={14} />
          </div>
          {review.title && (
            <p style={{ fontFamily: 'Georgia,serif', fontWeight: 600, fontSize: '0.92rem', color: '#2c1810', margin: '0 0 0.35rem' }}>{review.title}</p>
          )}
          {review.comment && (
            <p style={{ fontFamily: 'sans-serif', fontSize: '0.87rem', color: '#4a3728', lineHeight: 1.65, margin: 0 }}>{review.comment}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ── Write Review Form ────────────────────────────────────────────────────────
const ReviewForm = ({ productId, user, onSubmitted }) => {
  const [rating,  setRating]  = useState(0);
  const [title,   setTitle]   = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [open,    setOpen]    = useState(false);

  const submit = async () => {
    if (!user) { toast.error('Please login to write a review'); return; }
    if (rating === 0) { toast.error('Please select a star rating'); return; }
    if (!comment.trim()) { toast.error('Please write a comment'); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${BACKEND_URL}/api/reviews/${productId}`,
        { user_id: user.id, reviewer_name: user.name || user.email?.split('@')[0] || 'Customer', user_email: user.email || '', rating, title: title.trim(), comment: comment.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Review submitted! Thank you ✦');
      setRating(0); setTitle(''); setComment(''); setOpen(false);
      onSubmitted && onSubmitted();
    } catch {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const labelSt = { display: 'block', fontFamily: 'sans-serif', fontSize: '0.82rem', fontWeight: 700, color: '#444', marginBottom: '0.4rem' };
  const inputSt = { width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e8e4df', borderRadius: '10px', fontFamily: 'sans-serif', fontSize: '0.9rem', color: '#333', background: '#faf7f2', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' };

  if (!open) return (
    <button onClick={() => setOpen(true)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.7rem 1.4rem', border: '1.5px solid #c2602a', borderRadius: '50px', background: 'transparent', color: '#c2602a', fontFamily: 'sans-serif', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>
      ★ Write a Review
    </button>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #e8dfd0', padding: '1.75rem', marginBottom: '1.5rem' }}>
      <h3 style={{ fontFamily: 'Playfair Display,Georgia,serif', fontSize: '1.2rem', fontWeight: 700, color: '#2c1810', margin: '0 0 1.25rem' }}>Write a Review</h3>

      <div style={{ marginBottom: '1.1rem' }}>
        <label style={labelSt}>Your Rating *</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
          <StarRating value={rating} size={28} interactive onChange={setRating} />
          {rating > 0 && <span style={{ fontSize: '0.82rem', color: '#9a8070', fontFamily: 'sans-serif' }}>{['','Poor','Fair','Good','Very Good','Excellent'][rating]}</span>}
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={labelSt}>Review Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Summarise your experience…" maxLength={100} style={inputSt} />
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={labelSt}>Your Review *</label>
        <textarea value={comment} onChange={e => setComment(e.target.value.slice(0, 1000))} placeholder="Share details about quality, colour accuracy, delivery…" maxLength={1000} rows={4}
          style={{ ...inputSt, resize: 'vertical', minHeight: 100, lineHeight: 1.6 }} />
        <div style={{ textAlign: 'right', fontSize: '0.72rem', color: '#bbb', fontFamily: 'sans-serif', marginTop: '0.25rem' }}>{comment.length} / 1000</div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button onClick={submit} disabled={loading}
          style={{ padding: '0.75rem 1.75rem', background: '#2c1810', color: '#fff', border: 'none', borderRadius: '50px', fontFamily: 'sans-serif', fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Submitting…' : 'Submit Review'}
        </button>
        <button onClick={() => setOpen(false)}
          style={{ padding: '0.75rem 1.25rem', background: 'transparent', border: '1.5px solid #e8dfd0', borderRadius: '50px', fontFamily: 'sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#9a8070', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </motion.div>
  );
};

// ── Reviews Section ──────────────────────────────────────────────────────────
const ReviewsSection = ({ productId, initialReviews = [], initialRating = 0, user }) => {
  const [reviews, setReviews] = useState(initialReviews);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/reviews/${productId}`);
      setReviews(res.data.reviews || []);
    } catch { } finally { setLoading(false); }
  };

  const avgRating  = reviews.length > 0 ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length : initialRating;
  const starCounts = [5, 4, 3, 2, 1].map(star => ({ star, count: reviews.filter(r => Math.round(r.rating) === star).length }));
  const displayed  = showAll ? reviews : reviews.slice(0, 4);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 5rem', boxSizing: 'border-box' }}>
      <hr style={{ border: 'none', borderTop: '1px solid #e8e4df', margin: '0 0 3rem' }} />
      <h2 style={{ fontFamily: 'Playfair Display,Georgia,serif', fontSize: '1.8rem', fontWeight: 700, color: '#1a1a1a', margin: '0 0 2rem' }}>Customer Reviews</h2>

      {/* Summary */}
      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center', padding: '1.5rem 2rem', background: '#fff', borderRadius: 18, border: '1px solid #f0ebe3', minWidth: 130 }}>
          <div style={{ fontFamily: 'Playfair Display,Georgia,serif', fontSize: '3.5rem', fontWeight: 700, color: '#2c1810', lineHeight: 1 }}>
            {reviews.length > 0 ? avgRating.toFixed(1) : '—'}
          </div>
          <div style={{ marginTop: '0.4rem', marginBottom: '0.5rem' }}><StarRating value={avgRating} size={16} /></div>
          <div style={{ fontSize: '0.78rem', color: '#9a8070', fontFamily: 'sans-serif' }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
        </div>
        <div style={{ flex: 1, paddingTop: '0.5rem', minWidth: 180 }}>
          {starCounts.map(({ star, count }) => <RatingBar key={star} star={star} count={count} total={reviews.length} />)}
        </div>
      </div>

      {/* Write review */}
      <div style={{ marginBottom: '2rem' }}>
        <ReviewForm productId={productId} user={user} onSubmitted={fetchReviews} />
      </div>

      {/* Cards */}
      {loading ? (
        <p style={{ color: '#9a8070', fontFamily: 'sans-serif', fontSize: '0.9rem' }}>Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#fff', borderRadius: 18, border: '1px solid #f0ebe3' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✍️</div>
          <p style={{ fontFamily: 'Playfair Display,Georgia,serif', fontSize: '1.1rem', color: '#2c1810', margin: '0 0 0.4rem' }}>No reviews yet</p>
          <p style={{ fontFamily: 'sans-serif', fontSize: '0.85rem', color: '#9a8070', margin: 0 }}>Be the first to share your experience!</p>
        </div>
      ) : (
        <>
          <AnimatePresence>
            {displayed.map((review, i) => <ReviewCard key={review._id || i} review={review} index={i} />)}
          </AnimatePresence>
          {reviews.length > 4 && (
            <button onClick={() => setShowAll(s => !s)}
              style={{ display: 'block', margin: '1.25rem auto 0', padding: '0.7rem 2rem', background: 'transparent', border: '1.5px solid #e8dfd0', borderRadius: '50px', fontFamily: 'sans-serif', fontWeight: 700, fontSize: '0.88rem', color: '#9a8070', cursor: 'pointer' }}>
              {showAll ? 'Show Less' : `Show All ${reviews.length} Reviews`}
            </button>
          )}
        </>
      )}
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { cart, setCart, user } = useApp();

  const [product,         setProduct]         = useState(null);
  const [relatedProducts, setRelatedProducts]  = useState([]);
  const [quantity,        setQuantity]         = useState(1);
  const [loading,         setLoading]          = useState(true);
  const [selectedImage,   setSelectedImage]    = useState(0);
  const [customisation,   setCustomisation]    = useState('');
  const colorFromUrl = searchParams.get('color');
  const [selectedColor, setSelectedColor] = useState(colorFromUrl || null);

  useEffect(() => { if (id) fetchProduct(); }, [id]);

  useEffect(() => {
    if (product?.colors?.length > 0) {
      if (colorFromUrl && product.colors.includes(colorFromUrl)) setSelectedColor(colorFromUrl);
      else { setSelectedColor(product.colors[0]); setSearchParams({ color: product.colors[0] }, { replace: true }); }
    }
    if (product?.category) fetchRelated(product.category, product._id);
  }, [product]);

  const fetchProduct = async () => {
    try {
      setLoading(true); setSelectedImage(0); setCustomisation('');
      const res = await axios.get(`${BACKEND_URL}/api/products/${id}`);
      setProduct(res.data.product);
    } catch (err) { toast.error(err?.response?.data?.detail || 'Unable to fetch product'); }
    finally { setLoading(false); }
  };

  const fetchRelated = async (category, currentId) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/products?category=${category}&sort=newest`);
      setRelatedProducts((res.data.products || []).filter(p => p._id !== currentId).slice(0, 4));
    } catch { setRelatedProducts([]); }
  };

  const handleColorSelect = (colorName) => {
    setSelectedColor(colorName);
    setSearchParams({ color: colorName }, { replace: true });
  };

  const addToCart = () => {
    if (!product) return;
    if (product.colors?.length > 0 && !selectedColor) { toast.error('Please select a colour first'); return; }
    const customKey = customisation.trim();
    const existing  = cart.find(item => item.product_id === product._id && item.color === selectedColor && (item.customisation || '') === customKey);
    const newCart   = existing
      ? cart.map(item => item.product_id === product._id && item.color === selectedColor && (item.customisation || '') === customKey ? { ...item, quantity: item.quantity + quantity } : item)
      : [...cart, { product_id: product._id, product_name: product.name, price: product.base_price, image: product.images?.length > 0 ? fixImageUrl(product.images[0].url) : '', quantity, color: selectedColor || null, customisation: customKey || null }];
    setCart(newCart);
    toast.success(`${product.name}${selectedColor ? ` (${selectedColor})` : ''}${customKey ? ' with custom note' : ''} added to cart!`);
    setCustomisation('');
  };

  const getImages = () => product?.images?.length > 0 ? product.images.map(img => fixImageUrl(img.url)) : [PLACEHOLDER];

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background:'#f8f7f4' }}>
      <Navbar /><div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}><div style={st.spinner} /></div>
    </div>
  );
  if (!product) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background:'#f8f7f4' }}>
      <Navbar /><div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem' }}>
        <p style={{ color:'#888', fontFamily:'sans-serif' }}>Product not found</p>
        <button style={st.backBtn} onClick={() => navigate('/products')}>← Back to Products</button>
      </div>
    </div>
  );

  const images  = getImages();
  const inStock = (product.in_stock === true) || (product.stock !== undefined && product.stock > 0);
  const colors  = product.colors || [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');
        .pdp-page{background:#f8f7f4;min-height:100vh;display:flex;flex-direction:column;}
        .pdp-wrap{max-width:1100px;margin:0 auto;padding:2rem 1.5rem 4rem;width:100%;box-sizing:border-box;}
        .pdp-grid{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:start;}
        .pdp-custom-wrap{margin-bottom:1.5rem;}
        .pdp-custom-label{display:flex;align-items:center;gap:.45rem;font-family:'Lato',sans-serif;font-size:.85rem;font-weight:700;color:#444;margin-bottom:.5rem;}
        .pdp-custom-sublabel{font-size:.75rem;color:#9a8070;font-family:'Lato',sans-serif;margin-bottom:.65rem;line-height:1.5;display:block;}
        .pdp-custom-textarea{width:100%;min-height:100px;padding:.85rem 1rem;border:1.5px solid #e8e4df;border-radius:12px;font-size:.9rem;font-family:'Lato',sans-serif;color:#333;background:#fff;resize:vertical;outline:none;transition:border-color .18s,box-shadow .18s;box-sizing:border-box;line-height:1.6;}
        .pdp-custom-textarea:focus{border-color:#c2602a;box-shadow:0 0 0 3px rgba(194,96,42,.1);}
        .pdp-custom-textarea::placeholder{color:#bbb;font-size:.85rem;}
        .pdp-custom-counter{text-align:right;font-size:.72rem;color:#bbb;font-family:'Lato',sans-serif;margin-top:.3rem;}
        .pdp-custom-badge{display:inline-flex;align-items:center;gap:.3rem;background:rgba(194,96,42,.1);color:#c2602a;font-size:.7rem;font-weight:700;text-transform:uppercase;padding:.2rem .6rem;border-radius:20px;margin-left:.4rem;}
        @media(max-width:768px){
          .pdp-wrap{padding:1rem 0 3rem;} .pdp-back{margin:0 1rem 1.25rem!important;}
          .pdp-grid{grid-template-columns:1fr!important;gap:0!important;}
          .pdp-main-img-wrap{border-radius:0!important;border-left:none!important;border-right:none!important;aspect-ratio:1!important;}
          .pdp-thumb-row{padding:0 1rem!important;} .pdp-info-col{padding:1.25rem 1rem 0!important;}
          .pdp-product-name{font-size:1.6rem!important;} .pdp-price{font-size:1.7rem!important;}
          .pdp-related-grid{grid-template-columns:repeat(2,1fr)!important;gap:.75rem!important;}
          .pdp-related-section{padding:2rem 1rem!important;} .pdp-related-img{height:150px!important;}
        }
        @media(max-width:380px){.pdp-related-grid{grid-template-columns:1fr!important;}}
        .pdp-related-section{max-width:1100px;margin:0 auto;padding:3rem 1.5rem 2rem;width:100%;box-sizing:border-box;}
        .pdp-related-title{font-family:'Playfair Display',Georgia,serif;font-size:1.6rem;font-weight:700;color:#1a1a1a;margin:0 0 1.5rem;}
        .pdp-related-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.25rem;}
        .pdp-related-card{background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e8e4df;cursor:pointer;transition:transform .22s,box-shadow .22s;}
        .pdp-related-card:hover{transform:translateY(-5px);box-shadow:0 16px 40px rgba(0,0,0,.1);}
        .pdp-related-img{height:180px;overflow:hidden;background:#f5f0ea;}
        .pdp-related-img img{width:100%;height:100%;object-fit:cover;transition:transform .4s ease;}
        .pdp-related-card:hover .pdp-related-img img{transform:scale(1.06);}
        .pdp-related-body{padding:.85rem 1rem 1rem;}
        .pdp-related-name{font-family:'Playfair Display',serif;font-size:.88rem;font-weight:600;color:#1a1a1a;margin:0 0 .4rem;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
        .pdp-related-price{font-family:sans-serif;font-size:.95rem;font-weight:700;color:#5c3d2e;}
        .pdp-related-colors{display:flex;gap:3px;margin-bottom:.4rem;flex-wrap:wrap;}
        .pdp-color-dot{width:10px;height:10px;border-radius:50%;border:1.5px solid rgba(0,0,0,.1);}
        .pdp-divider{border:none;border-top:1px solid #e8e4df;margin:0;width:100%;}
        @keyframes spin{to{transform:rotate(360deg);}}
      `}</style>

      <div className="pdp-page">
        <Navbar />
        <div className="pdp-wrap">
          <button className="pdp-back" style={st.backBtn} onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back to Products</button>
          <div className="pdp-grid">
            {/* Gallery */}
            <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{duration:.45}} className="pdp-gallery" style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
              <div className="pdp-main-img-wrap" style={st.mainImgWrap}>
                <img src={images[selectedImage]} alt={product.name} style={st.mainImg} onError={e=>{e.target.src=PLACEHOLDER;}} />
              </div>
              {images.length > 1 && (
                <div className="pdp-thumb-row" style={st.thumbRow}>
                  {images.map((img,i) => (
                    <button key={i} onClick={()=>setSelectedImage(i)} style={{...st.thumbBtn,...(selectedImage===i?st.thumbBtnActive:{})}}>
                      <img src={img} alt={`View ${i+1}`} style={st.thumbImg} onError={e=>{e.target.src=PLACEHOLDER;}} />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{duration:.45,delay:.15}} className="pdp-info-col" style={st.infoCol}>
              {product.category && <span style={st.categoryTag}>{product.category.toUpperCase()}</span>}
              <h1 className="pdp-product-name" style={st.productName}>{product.name}</h1>

              {/* Inline rating */}
              {product.reviews_count > 0 && (
                <div style={{display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'.85rem'}}>
                  <StarRating value={product.rating||0} size={15}/>
                  <span style={{fontSize:'.8rem',color:'#9a8070',fontFamily:'sans-serif'}}>
                    {(product.rating||0).toFixed(1)} ({product.reviews_count} review{product.reviews_count!==1?'s':''})
                  </span>
                </div>
              )}

              <div style={st.priceRow}>
                <span className="pdp-price" style={st.price}>₹{parseFloat(product.base_price).toLocaleString('en-IN')}</span>
                {inStock ? <span style={st.inStockBadge}><CheckCircle size={13}/> In Stock</span> : <span style={st.outStockBadge}>Out of Stock</span>}
              </div>
              {product.description && <p style={st.description}>{product.description}</p>}

              {inStock && (
                <>
                  {colors.length > 0 && (
                    <div style={st.section}>
                      <div style={st.sectionLabel}>Colour:&nbsp;<span style={st.selectedColorName}>{selectedColor||'—'}</span></div>
                      <div style={st.swatchRow}>
                        {colors.map(colorName => {
                          const preset=PRESET_COLORS.find(p=>p.name===colorName); const isSelected=selectedColor===colorName;
                          return (<button key={colorName} title={colorName} onClick={()=>handleColorSelect(colorName)}
                            style={{...st.swatch,background:preset?.hex||'#ccc',...(isSelected?st.swatchSelected:{})}}>
                            {isSelected&&<span style={st.swatchCheck}>✓</span>}
                          </button>);
                        })}
                      </div>
                      {selectedColor && <p style={{margin:'.5rem 0 0',fontSize:'.82rem',color:'#888',fontFamily:'sans-serif'}}>Selected: <strong style={{color:'#333'}}>{selectedColor}</strong></p>}
                    </div>
                  )}
                  <div style={st.section}>
                    <div style={st.sectionLabel}>Quantity</div>
                    <div style={st.qtyRow}>
                      <button style={st.qtyBtn} onClick={()=>setQuantity(q=>Math.max(1,q-1))} disabled={quantity<=1}><Minus size={16}/></button>
                      <span style={st.qtyNum}>{quantity}</span>
                      <button style={st.qtyBtn} onClick={()=>setQuantity(q=>q+1)}><Plus size={16}/></button>
                    </div>
                  </div>
                  <div className="pdp-custom-wrap">
                    <div className="pdp-custom-label"><Pencil size={14}/> Customisation <span className="pdp-custom-badge">✦ Optional</span></div>
                    <span className="pdp-custom-sublabel">Since everything is handmade, you can personalise your order. Tell us colours, name, size, pattern, occasion — anything you'd like.</span>
                    <textarea className="pdp-custom-textarea"
                      placeholder="e.g. Please make it in light pink with my name 'Priya' — it's for a birthday gift…"
                      value={customisation} onChange={e=>setCustomisation(e.target.value.slice(0,500))} maxLength={500}/>
                    <div className="pdp-custom-counter">{customisation.length} / 500</div>
                  </div>
                  <button style={st.cartBtn} onClick={addToCart}>
                    <ShoppingCart size={20}/>{customisation.trim()?'Add to Cart with Customisation':'Add to Cart'}
                  </button>
                  {customisation.trim()&&<p style={{marginTop:'.65rem',fontSize:'.78rem',color:'#9a8070',fontFamily:'sans-serif',textAlign:'center',lineHeight:1.5}}>✦ Your customisation note will be sent to us with the order</p>}
                </>
              )}
              {!inStock&&<div style={st.outOfStockBox}><p style={{margin:0,color:'#be123c',fontWeight:600}}>This product is currently out of stock.</p></div>}
            </motion.div>
          </div>
        </div>

        {/* ── REVIEWS ── */}
        <ReviewsSection productId={id} initialReviews={product.reviews||[]} initialRating={product.rating||0} user={user}/>

        {/* Related */}
        {relatedProducts.length>0&&(
          <>
            <hr className="pdp-divider"/>
            <div className="pdp-related-section">
              <h2 className="pdp-related-title">✨ You May Also Like</h2>
              <div className="pdp-related-grid">
                {relatedProducts.map((rp,i)=>(
                  <motion.div key={rp._id} className="pdp-related-card" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*.08}}
                    onClick={()=>{navigate(`/products/${rp._id}`);window.scrollTo(0,0);}}>
                    <div className="pdp-related-img"><img src={rp.images?.[0]?.url?fixImageUrl(rp.images[0].url):PLACEHOLDER} alt={rp.name} onError={e=>{e.target.src=PLACEHOLDER;}}/></div>
                    <div className="pdp-related-body">
                      {rp.colors?.length>0&&<div className="pdp-related-colors">{rp.colors.slice(0,5).map(c=><div key={c} className="pdp-color-dot" style={{background:COLOR_MAP[c]||'#ccc'}} title={c}/>)}</div>}
                      <div className="pdp-related-name">{rp.name}</div>
                      <div className="pdp-related-price">₹{parseFloat(rp.base_price).toLocaleString('en-IN')}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
        <Footer/>
      </div>
    </>
  );
};

const st = {
  backBtn:          {display:'inline-flex',alignItems:'center',gap:'.4rem',background:'none',border:'none',cursor:'pointer',color:'#666',fontSize:'.9rem',fontFamily:'sans-serif',marginBottom:'2rem',padding:0},
  mainImgWrap:      {borderRadius:'16px',overflow:'hidden',background:'#fff',border:'1px solid #e8e4df',aspectRatio:'1',display:'flex',alignItems:'center',justifyContent:'center'},
  mainImg:          {width:'100%',height:'100%',objectFit:'cover',display:'block'},
  thumbRow:         {display:'flex',gap:'.5rem',flexWrap:'wrap'},
  thumbBtn:         {width:68,height:68,borderRadius:'10px',overflow:'hidden',border:'2px solid #e8e4df',padding:0,cursor:'pointer',background:'#fff',flexShrink:0,transition:'border-color .15s'},
  thumbBtnActive:   {borderColor:'#1a1a1a',boxShadow:'0 0 0 1px #1a1a1a'},
  thumbImg:         {width:'100%',height:'100%',objectFit:'cover',display:'block'},
  infoCol:          {display:'flex',flexDirection:'column',gap:0,paddingTop:'.5rem'},
  categoryTag:      {fontSize:'.72rem',fontWeight:700,letterSpacing:'.1em',color:'#c2410c',fontFamily:'sans-serif',marginBottom:'.5rem',display:'block'},
  productName:      {fontFamily:'Georgia,serif',fontSize:'2.2rem',fontWeight:700,color:'#1a1a1a',margin:'0 0 1rem',lineHeight:1.2},
  priceRow:         {display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.25rem'},
  price:            {fontFamily:'Georgia,serif',fontSize:'2rem',fontWeight:700,color:'#1a1a1a'},
  inStockBadge:     {display:'inline-flex',alignItems:'center',gap:'.3rem',background:'#d1fae5',color:'#065f46',fontSize:'.78rem',fontWeight:600,padding:'.3rem .75rem',borderRadius:'20px',fontFamily:'sans-serif'},
  outStockBadge:    {background:'#fee2e2',color:'#991b1b',fontSize:'.78rem',fontWeight:600,padding:'.3rem .75rem',borderRadius:'20px',fontFamily:'sans-serif'},
  description:      {fontFamily:'sans-serif',fontSize:'.95rem',color:'#555',lineHeight:1.7,margin:'0 0 1.5rem'},
  section:          {marginBottom:'1.5rem'},
  sectionLabel:     {fontFamily:'sans-serif',fontSize:'.85rem',fontWeight:600,color:'#444',marginBottom:'.6rem'},
  selectedColorName:{fontWeight:400,color:'#888'},
  swatchRow:        {display:'flex',gap:'.6rem',flexWrap:'wrap'},
  swatch:           {width:36,height:36,borderRadius:'50%',border:'2.5px solid transparent',cursor:'pointer',position:'relative',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 0 1.5px rgba(0,0,0,.12)',transition:'transform .15s,box-shadow .15s',outline:'none'},
  swatchSelected:   {boxShadow:'0 0 0 2px #fff, 0 0 0 4px #1a1a1a',transform:'scale(1.1)'},
  swatchCheck:      {color:'#fff',fontSize:'.8rem',fontWeight:700,textShadow:'0 1px 3px rgba(0,0,0,.5)',lineHeight:1},
  qtyRow:           {display:'flex',alignItems:'center',gap:'1rem'},
  qtyBtn:           {width:42,height:42,borderRadius:'50%',border:'1.5px solid #e8e4df',background:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#444',transition:'background .15s'},
  qtyNum:           {fontFamily:'Georgia,serif',fontSize:'1.4rem',fontWeight:600,color:'#1a1a1a',minWidth:32,textAlign:'center'},
  cartBtn:          {display:'flex',alignItems:'center',justifyContent:'center',gap:'.6rem',width:'100%',padding:'1rem',background:'#1a1a1a',color:'#fff',border:'none',borderRadius:'12px',fontSize:'1rem',fontWeight:600,fontFamily:'sans-serif',cursor:'pointer',transition:'background .2s',marginTop:'.5rem'},
  outOfStockBox:    {background:'#fff1f2',border:'1px solid #fecdd3',borderRadius:'12px',padding:'1rem 1.25rem',marginTop:'1rem'},
  spinner:          {width:36,height:36,border:'3px solid #e8e4df',borderTop:'3px solid #1a1a1a',borderRadius:'50%',animation:'spin 0.8s linear infinite'},
};

export default ProductDetailPage;
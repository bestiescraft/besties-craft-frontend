import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useApp } from '@/App';

const BACKEND_URL =
  process.env.REACT_APP_API_URL?.replace(/\/$/, '') ||
  'https://besties-craft-backend-1.onrender.com';

const fixImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BACKEND_URL}${url}`;
};

const PLACEHOLDER = 'https://via.placeholder.com/100x100/f2ede4/9a8070?text=🧶';

const COLOR_MAP = {
  Red:'#EF4444', Pink:'#EC4899', Purple:'#A855F7', Blue:'#3B82F6',
  'Sky Blue':'#38BDF8', Green:'#22C55E', Yellow:'#EAB308', Orange:'#F97316',
  White:'#e8e8e8', Black:'#1E293B', Brown:'#92400E', Beige:'#D4C5A9',
  Grey:'#94A3B8', Cream:'#FFFBEB', Maroon:'#7F1D1D', Navy:'#1E3A5F',
};

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useApp();

  const updateQuantity = (productId, color, newQty) => {
    if (newQty <= 0) { removeItem(productId, color); return; }
    setCart(cart.map(item =>
      item.product_id === productId && item.color === color
        ? { ...item, quantity: newQty }
        : item
    ));
  };

  const removeItem = (productId, color) => {
    setCart(cart.filter(item => !(item.product_id === productId && item.color === color)));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#faf7f2' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', padding: '4rem 2rem' }}>
          <ShoppingBag size={72} color="#e8dfd0" />
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2rem', color: '#2c1810', margin: 0, textAlign: 'center' }}>Your cart is empty</h2>
          <p style={{ color: '#9a8070', fontFamily: 'sans-serif', margin: 0, textAlign: 'center' }}>Add some beautiful handmade products to get started!</p>
          <button style={btnStyle.dark} onClick={() => navigate('/products')}>Shop Now</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');

        .cart-wrap {
          flex: 1;
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
          padding: 2.5rem 1.5rem 5rem;
          box-sizing: border-box;
        }

        .cart-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 2rem;
          align-items: start;
        }

        .cart-summary-box {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #e8dfd0;
          padding: 1.75rem;
          position: sticky;
          top: 1.5rem;
        }

        .cart-item-img {
          width: 100px;
          height: 100px;
          border-radius: 12px;
          object-fit: cover;
          flex-shrink: 0;
          border: 1px solid #e8dfd0;
          background: #f2ede4;
        }

        /* ===== MOBILE FIXES ===== */
        @media (max-width: 700px) {
          .cart-wrap {
            padding: 1.5rem 1rem 4rem;
          }

          .cart-title {
            font-size: 1.8rem !important;
          }

          /* Stack to single column — Order Summary goes BELOW items */
          .cart-grid {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }

          /* Order summary NOT sticky on mobile */
          .cart-summary-box {
            position: static !important;
          }

          /* Bigger image on mobile */
          .cart-item-img {
            width: 85px !important;
            height: 85px !important;
          }

          /* Cart item card padding */
          .cart-item-card {
            padding: 1rem !important;
          }

          /* Make product name smaller on mobile */
          .cart-item-name {
            font-size: 0.95rem !important;
          }
        }

        @media (max-width: 380px) {
          .cart-item-img {
            width: 70px !important;
            height: 70px !important;
          }
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#faf7f2' }}>
        <Navbar />

        <div className="cart-wrap">
          {/* Back + Title */}
          <button style={btnStyle.back} onClick={() => navigate('/products')}>
            <ArrowLeft size={15} /> Continue Shopping
          </button>

          <h1 className="cart-title" style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.4rem', fontWeight: 700, color: '#2c1810', margin: '0 0 2rem' }}>
            Shopping Cart{' '}
            <span style={{ fontSize: '1rem', color: '#9a8070', fontFamily: 'sans-serif', fontWeight: 400 }}>
              ({itemCount} item{itemCount !== 1 ? 's' : ''})
            </span>
          </h1>

          <div className="cart-grid">

            {/* ===== CART ITEMS ===== */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.map((item, index) => {
                const imgSrc = fixImageUrl(item.image || item.image_url || '');
                return (
                  <motion.div
                    key={`${item.product_id}-${item.color || index}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.07 }}
                    className="cart-item-card"
                    style={cartItemStyle}
                  >
                    <img
                      src={imgSrc || PLACEHOLDER}
                      alt={item.product_name}
                      className="cart-item-img"
                      onError={e => { e.target.src = PLACEHOLDER; }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Top row: name + delete */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.5rem' }}>
                        <div style={{ flex: 1, minWidth: 0, paddingRight: '0.5rem' }}>
                          <h3
                            className="cart-item-name"
                            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.05rem', fontWeight: 700, color: '#2c1810', margin: '0 0 .25rem', lineHeight: 1.3 }}
                          >
                            {item.product_name}
                          </h3>
                          {item.color && (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.35rem', fontSize: '.78rem', color: '#9a8070', fontFamily: 'sans-serif' }}>
                              <span style={{ width: 11, height: 11, borderRadius: '50%', background: COLOR_MAP[item.color] || '#ccc', border: '1px solid rgba(0,0,0,.12)', display: 'inline-block', flexShrink: 0 }} />
                              {item.color}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.product_id, item.color)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d4c5b0', padding: '.25rem', borderRadius: '6px', display: 'flex', transition: 'color .15s', flexShrink: 0 }}
                          onMouseEnter={e => e.currentTarget.style.color = '#be123c'}
                          onMouseLeave={e => e.currentTarget.style.color = '#d4c5b0'}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Bottom row: qty + price */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
                          <button style={qtyBtnStyle} onClick={() => updateQuantity(item.product_id, item.color, item.quantity - 1)}>
                            <Minus size={14} />
                          </button>
                          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2c1810', minWidth: 28, textAlign: 'center', fontFamily: 'sans-serif' }}>
                            {item.quantity}
                          </span>
                          <button style={qtyBtnStyle} onClick={() => updateQuantity(item.product_id, item.color, item.quantity + 1)}>
                            <Plus size={14} />
                          </button>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.25rem', fontWeight: 700, color: '#2c1810' }}>
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: '.75rem', color: '#9a8070', fontFamily: 'sans-serif' }}>
                            ₹{item.price.toLocaleString('en-IN')} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ===== ORDER SUMMARY ===== */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="cart-summary-box"
            >
              <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.4rem', fontWeight: 700, color: '#2c1810', margin: '0 0 1.5rem' }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', marginBottom: '1.25rem' }}>
                <div style={summaryRow}>
                  <span style={summaryLabel}>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                  <span style={summaryVal}>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={summaryRow}>
                  <span style={summaryLabel}>Shipping</span>
                  <span style={{ ...summaryVal, color: '#22c55e', fontSize: '.8rem' }}>Calculated at checkout</span>
                </div>
                <div style={{ borderTop: '1px solid #e8dfd0', paddingTop: '1rem', marginTop: '.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.1rem', fontWeight: 700, color: '#2c1810' }}>Total</span>
                  <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.6rem', fontWeight: 700, color: '#2c1810' }}>
                    ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <button
                style={{ ...btnStyle.dark, width: '100%', padding: '1rem', fontSize: '1rem', borderRadius: '12px', marginBottom: '.75rem', justifyContent: 'center' }}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout →
              </button>

              <button
                style={{ width: '100%', padding: '.8rem', background: 'transparent', border: '1.5px solid #e8dfd0', borderRadius: '12px', color: '#9a8070', fontFamily: 'sans-serif', fontSize: '.88rem', fontWeight: 700, cursor: 'pointer', transition: 'all .15s' }}
                onClick={() => navigate('/products')}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#c2602a'; e.currentTarget.style.color = '#c2602a'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8dfd0'; e.currentTarget.style.color = '#9a8070'; }}
              >
                Continue Shopping
              </button>

              {/* Trust badge */}
              <div style={{ marginTop: '1.25rem', padding: '.85rem', background: '#faf7f2', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                <span style={{ fontSize: '1rem' }}>🔒</span>
                <span style={{ fontSize: '.75rem', color: '#9a8070', fontFamily: 'sans-serif', lineHeight: 1.4 }}>
                  Secure checkout. Your information is always protected.
                </span>
              </div>
            </motion.div>

          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

const cartItemStyle = {
  background: '#fff',
  borderRadius: '16px',
  padding: '1.25rem',
  border: '1px solid #e8dfd0',
  display: 'flex',
  gap: '1.1rem',
  alignItems: 'flex-start',
};

const qtyBtnStyle = {
  width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #e8dfd0',
  background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
  justifyContent: 'center', color: '#4a3728', transition: 'all .15s',
};

const summaryRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const summaryLabel = { fontSize: '.88rem', color: '#9a8070', fontFamily: 'sans-serif' };
const summaryVal = { fontSize: '.88rem', color: '#2c1810', fontWeight: 600, fontFamily: 'sans-serif' };

const btnStyle = {
  dark: {
    background: '#2c1810', color: '#fff', border: 'none', padding: '.75rem 1.5rem',
    borderRadius: '10px', fontFamily: 'sans-serif', fontSize: '.9rem', fontWeight: 700,
    cursor: 'pointer', transition: 'background .2s', display: 'inline-flex', alignItems: 'center', gap: '.4rem',
  },
  back: {
    background: 'none', border: 'none', cursor: 'pointer', color: '#9a8070',
    fontFamily: 'sans-serif', fontSize: '.88rem', display: 'inline-flex', alignItems: 'center',
    gap: '.35rem', padding: '0', marginBottom: '1.5rem', transition: 'color .15s',
  },
};

export default CartPage;
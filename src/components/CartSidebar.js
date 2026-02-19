import React from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus, Package } from 'lucide-react';
import { useApp } from '@/App';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL =
  process.env.REACT_APP_API_URL?.replace(/\/$/, '') ||
  'https://besties-craft-backend-1.onrender.com';

// Fix relative image URLs — same helper used across the app
const fixImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BACKEND_URL}${url}`;
};

const PLACEHOLDER = 'https://via.placeholder.com/80x80/f2ede4/9a8070?text=🧶';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, setCart } = useApp();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const removeFromCart = (productId, color) => {
    setCart(cart.filter(item => !(item.product_id === productId && item.color === color)));
  };

  const updateQuantity = (productId, color, newQty) => {
    if (newQty <= 0) { removeFromCart(productId, color); return; }
    setCart(cart.map(item =>
      item.product_id === productId && item.color === color
        ? { ...item, quantity: newQty }
        : item
    ));
  };

  const goTo = (path) => { navigate(path); onClose(); };

  return (
    <>
      <style>{`
        .cart-sidebar-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:400;backdrop-filter:blur(2px);transition:opacity 0.3s}
        .cart-sidebar{position:fixed;right:0;top:0;height:100vh;width:min(420px,100vw);background:#fff;z-index:401;display:flex;flex-direction:column;box-shadow:-8px 0 40px rgba(0,0,0,0.15);transition:transform 0.35s cubic-bezier(.4,0,.2,1)}
        .cart-sidebar.open{transform:translateX(0)}
        .cart-sidebar.closed{transform:translateX(100%)}
        .cs-head{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.5rem;border-bottom:1px solid #f0ebe3;background:#faf7f2;flex-shrink:0}
        .cs-head-left{display:flex;align-items:center;gap:.65rem}
        .cs-title{font-family:'Playfair Display',Georgia,serif;font-size:1.2rem;font-weight:700;color:#2c1810;margin:0}
        .cs-badge{background:#c2602a;color:#fff;font-size:.65rem;font-weight:700;padding:.2rem .5rem;border-radius:20px;font-family:sans-serif;min-width:20px;text-align:center}
        .cs-close{background:#f2ede4;border:none;width:34px;height:34px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#9a8070;transition:background .15s,color .15s}
        .cs-close:hover{background:#e8dfd0;color:#2c1810}
        .cs-body{flex:1;overflow-y:auto;padding:1rem 1.5rem}
        .cs-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:1rem;padding:2rem 0;color:#9a8070;text-align:center}
        .cs-empty-icon{font-size:3.5rem;opacity:.5}
        .cs-empty-text{font-size:.9rem;font-family:sans-serif}
        .cs-empty-btn{padding:.65rem 1.5rem;background:#2c1810;color:#fff;border:none;border-radius:10px;font-size:.88rem;font-weight:700;cursor:pointer;font-family:sans-serif;transition:background .2s}
        .cs-empty-btn:hover{background:#5c3d2e}
        .cs-items{display:flex;flex-direction:column;gap:.75rem}
        .cs-item{display:flex;gap:.85rem;padding:.9rem;background:#faf7f2;border-radius:14px;border:1px solid #f0ebe3;align-items:flex-start}
        .cs-img{width:72px;height:72px;border-radius:10px;object-fit:cover;flex-shrink:0;border:1px solid #e8dfd0;background:#f2ede4}
        .cs-item-info{flex:1;min-width:0}
        .cs-item-name{font-weight:700;color:#2c1810;font-size:.9rem;font-family:sans-serif;margin-bottom:.2rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .cs-item-color{display:inline-flex;align-items:center;gap:.3rem;font-size:.72rem;color:#9a8070;font-family:sans-serif;margin-bottom:.45rem}
        .cs-color-dot{width:10px;height:10px;border-radius:50%;border:1px solid rgba(0,0,0,.15);flex-shrink:0}
        .cs-item-price{font-size:.88rem;color:#5c3d2e;font-weight:700;font-family:sans-serif}
        .cs-qty{display:flex;align-items:center;gap:.5rem;margin-top:.5rem}
        .cs-qty-btn{width:28px;height:28px;border-radius:50%;border:1.5px solid #e8dfd0;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#4a3728;transition:all .15s;flex-shrink:0}
        .cs-qty-btn:hover{border-color:#c2602a;color:#c2602a}
        .cs-qty-num{font-size:.9rem;font-weight:700;color:#2c1810;min-width:20px;text-align:center;font-family:sans-serif}
        .cs-remove{background:none;border:none;color:#e8dfd0;cursor:pointer;padding:.25rem;border-radius:6px;display:flex;align-items:center;transition:color .15s;flex-shrink:0;margin-top:-.1rem}
        .cs-remove:hover{color:#be123c}
        .cs-footer{flex-shrink:0;padding:1.25rem 1.5rem;border-top:1px solid #f0ebe3;background:#faf7f2}
        .cs-summary{margin-bottom:1rem}
        .cs-summary-row{display:flex;justify-content:space-between;align-items:center;font-size:.85rem;color:#9a8070;font-family:sans-serif;margin-bottom:.35rem}
        .cs-total-row{display:flex;justify-content:space-between;align-items:center;border-top:1px solid #e8dfd0;padding-top:.75rem;margin-top:.5rem}
        .cs-total-label{font-size:1rem;font-weight:700;color:#2c1810;font-family:sans-serif}
        .cs-total-value{font-family:'Playfair Display',Georgia,serif;font-size:1.3rem;font-weight:700;color:#2c1810}
        .cs-checkout-btn{width:100%;padding:.85rem;background:#2c1810;color:#fff;border:none;border-radius:12px;font-size:.95rem;font-weight:700;cursor:pointer;font-family:sans-serif;transition:background .2s;margin-bottom:.6rem}
        .cs-checkout-btn:hover{background:#5c3d2e}
        .cs-continue-btn{width:100%;padding:.7rem;background:transparent;color:#9a8070;border:1.5px solid #e8dfd0;border-radius:12px;font-size:.85rem;font-weight:700;cursor:pointer;font-family:sans-serif;transition:all .15s}
        .cs-continue-btn:hover{border-color:#c2602a;color:#c2602a}
      `}</style>

      {/* Overlay */}
      {isOpen && <div className="cart-sidebar-overlay" onClick={onClose} />}

      {/* Sidebar */}
      <div className={`cart-sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* Header */}
        <div className="cs-head">
          <div className="cs-head-left">
            <ShoppingCart size={20} color="#c2602a" />
            <h2 className="cs-title">Your Cart</h2>
            {itemCount > 0 && <span className="cs-badge">{itemCount}</span>}
          </div>
          <button className="cs-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="cs-body">
          {cart.length === 0 ? (
            <div className="cs-empty">
              <span className="cs-empty-icon">🛒</span>
              <p className="cs-empty-text">Your cart is empty.<br />Add something beautiful!</p>
              <button className="cs-empty-btn" onClick={() => goTo('/products')}>Shop Now</button>
            </div>
          ) : (
            <div className="cs-items">
              {cart.map((item, i) => {
                // ✅ Fix: use either item.image or item.image_url, fix relative paths
                const imgSrc = fixImageUrl(item.image || item.image_url || '');
                return (
                  <div key={`${item.product_id}-${item.color || i}`} className="cs-item">
                    <img
                      src={imgSrc || PLACEHOLDER}
                      alt={item.product_name}
                      className="cs-img"
                      onError={e => { e.target.src = PLACEHOLDER; }}
                    />
                    <div className="cs-item-info">
                      <div className="cs-item-name">{item.product_name}</div>
                      {item.color && (
                        <div className="cs-item-color">
                          <span className="cs-color-dot" style={{ background: getColorHex(item.color) }} />
                          {item.color}
                        </div>
                      )}
                      <div className="cs-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                      <div className="cs-qty">
                        <button className="cs-qty-btn" onClick={() => updateQuantity(item.product_id, item.color, item.quantity - 1)}>
                          <Minus size={12} />
                        </button>
                        <span className="cs-qty-num">{item.quantity}</span>
                        <button className="cs-qty-btn" onClick={() => updateQuantity(item.product_id, item.color, item.quantity + 1)}>
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <button className="cs-remove" onClick={() => removeFromCart(item.product_id, item.color)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="cs-footer">
            <div className="cs-summary">
              <div className="cs-summary-row">
                <span>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="cs-summary-row">
                <span>Shipping</span>
                <span>At checkout</span>
              </div>
              <div className="cs-total-row">
                <span className="cs-total-label">Total</span>
                <span className="cs-total-value">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <button className="cs-checkout-btn" onClick={() => goTo('/checkout')}>
              Proceed to Checkout →
            </button>
            <button className="cs-continue-btn" onClick={() => goTo('/products')}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// Helper — maps color name to hex for the swatch in the cart
const COLOR_MAP = {
  Red:'#EF4444', Pink:'#EC4899', Purple:'#A855F7', Blue:'#3B82F6',
  'Sky Blue':'#38BDF8', Green:'#22C55E', Yellow:'#EAB308', Orange:'#F97316',
  White:'#e8e8e8', Black:'#1E293B', Brown:'#92400E', Beige:'#D4C5A9',
  Grey:'#94A3B8', Cream:'#FFFBEB', Maroon:'#7F1D1D', Navy:'#1E3A5F',
};
const getColorHex = (name) => COLOR_MAP[name] || '#ccc';

export { CartSidebar };
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail, ArrowLeft, ExternalLink, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import axios from 'axios';
import usePageMeta from '@/hooks/usePageMeta';

import { BACKEND_URL } from '@/lib/constants';

const STATUS_STEPS = [
  { key: 'confirmed',  label: 'Order Confirmed',  icon: CheckCircle, desc: 'We received your order!' },
  { key: 'processing', label: 'Being Prepared',   icon: Package,     desc: 'Crafting your item with love 🌸' },
  { key: 'shipped',    label: 'Shipped',           icon: Truck,       desc: 'On its way to you!' },
  { key: 'delivered',  label: 'Delivered',         icon: MapPin,      desc: 'Enjoy your handmade piece!' },
];

const getStepIndex = (status) => {
  const map = {
    confirmed:  0,
    processing: 1,
    packed:     1,
    shipped:    2,
    out_for_delivery: 2,
    delivered:  3,
  };
  return map[status?.toLowerCase()] ?? 0;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return dateStr; }
};

export default function OrderTrackingPage() {
  usePageMeta({
    title: 'Track Your Order — Besties Craft',
    description: 'Track your Besties Craft handmade crochet order. See real-time delivery status.',
    url: '/track-order',
  });

  const { orderId }   = useParams();
  const navigate      = useNavigate();
  const [order,       setOrder]       = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [inputId,     setInputId]     = useState(orderId || '');

  useEffect(() => {
    if (orderId) fetchOrder(orderId);
    else setLoading(false);
  }, [orderId]);

  const fetchOrder = async (id) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res   = await axios.get(`${BACKEND_URL}/api/orders/track/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setOrder(res.data.order);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Order not found. Please check the Order ID and try again.');
      } else {
        setError('Unable to fetch order details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputId.trim()) return;
    navigate(`/track-order/${inputId.trim()}`);
    fetchOrder(inputId.trim());
  };

  const currentStep = order ? getStepIndex(order.order_status) : -1;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#faf7f2' }}>
      <Navbar />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lato:wght@400;700&display=swap');
        :root {
          --cream: #faf7f2; --warm: #f2ede4; --sand: #e8dfd0;
          --terracotta: #c2602a; --brown: #5c3d2e; --dark: #2c1810;
          --text: #4a3728; --muted: #9a8070;
        }
        .ot-page   { flex: 1; padding: 4rem 1.5rem 5rem; }
        .ot-inner  { max-width: 760px; margin: 0 auto; }
        .ot-back   { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--muted); font-size: 0.88rem; font-weight: 700; text-decoration: none; margin-bottom: 2.5rem; transition: color 0.2s; font-family: 'Lato', sans-serif; }
        .ot-back:hover { color: var(--dark); }
        .ot-title  { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 700; color: var(--dark); margin: 0 0 0.5rem; }
        .ot-sub    { color: var(--muted); font-size: 0.95rem; margin: 0 0 2.5rem; font-family: 'Lato', sans-serif; }

        /* Search box */
        .ot-search { background: #fff; border-radius: 18px; padding: 2rem; border: 1px solid var(--sand); margin-bottom: 2rem; }
        .ot-search-label { font-family: 'Lato', sans-serif; font-weight: 700; color: var(--dark); font-size: 0.92rem; display: block; margin-bottom: 0.75rem; }
        .ot-search-row { display: flex; gap: 0.75rem; }
        .ot-search-input {
          flex: 1; padding: 0.85rem 1.2rem; border-radius: 12px;
          border: 1.5px solid var(--sand); font-family: 'Lato', sans-serif;
          font-size: 0.95rem; color: var(--dark); background: var(--warm);
          outline: none; transition: border-color 0.2s;
        }
        .ot-search-input:focus { border-color: var(--terracotta); }
        .ot-search-btn {
          padding: 0.85rem 1.75rem; background: var(--dark); color: #fff;
          border: none; border-radius: 12px; font-family: 'Lato', sans-serif;
          font-weight: 700; font-size: 0.92rem; cursor: pointer;
          transition: background 0.2s; white-space: nowrap;
        }
        .ot-search-btn:hover { background: var(--brown); }

        /* Error / loading */
        .ot-error { background: #fff3f3; border: 1px solid #ffc5c5; border-radius: 14px; padding: 1.25rem 1.5rem; display: flex; align-items: center; gap: 0.75rem; color: #c0392b; font-family: 'Lato', sans-serif; font-size: 0.9rem; }
        .ot-loading { text-align: center; padding: 3rem; color: var(--muted); font-family: 'Lato', sans-serif; }

        /* Order card */
        .ot-card { background: #fff; border-radius: 20px; border: 1px solid var(--sand); overflow: hidden; }
        .ot-card-head { background: var(--dark); color: #fff; padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; }
        .ot-order-id { font-family: 'Lato', sans-serif; font-size: 0.78rem; color: rgba(255,255,255,0.6); letter-spacing: 0.08em; margin-bottom: 0.3rem; }
        .ot-order-num { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; color: #fff; }
        .ot-order-date { font-family: 'Lato', sans-serif; font-size: 0.82rem; color: rgba(255,255,255,0.6); }
        .ot-status-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: rgba(255,255,255,0.15); color: #fff;
          padding: 0.4rem 1rem; border-radius: 20px;
          font-family: 'Lato', sans-serif; font-size: 0.8rem; font-weight: 700;
          border: 1px solid rgba(255,255,255,0.2); text-transform: capitalize;
        }
        .ot-status-dot { width: 8px; height: 8px; border-radius: 50%; background: #4ade80; }

        /* Progress stepper */
        .ot-stepper { padding: 2.5rem 2rem; }
        .ot-stepper-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 600; color: var(--dark); margin: 0 0 2rem; }
        .ot-steps { display: flex; align-items: flex-start; gap: 0; }
        .ot-step { flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; }
        .ot-step:not(:last-child)::after {
          content: ''; position: absolute; top: 22px; left: 50%; width: 100%;
          height: 2px; background: var(--sand); z-index: 0;
        }
        .ot-step.done:not(:last-child)::after { background: var(--terracotta); }
        .ot-step-icon {
          width: 46px; height: 46px; border-radius: 50%; z-index: 1;
          display: flex; align-items: center; justify-content: center;
          background: var(--sand); color: var(--muted);
          border: 2px solid var(--sand); transition: all 0.3s;
          position: relative;
        }
        .ot-step.done  .ot-step-icon { background: var(--terracotta); color: #fff; border-color: var(--terracotta); }
        .ot-step.active .ot-step-icon { background: #fff; color: var(--terracotta); border-color: var(--terracotta); box-shadow: 0 0 0 4px rgba(194,96,42,0.15); }
        .ot-step-label { font-family: 'Lato', sans-serif; font-size: 0.72rem; font-weight: 700; color: var(--muted); margin-top: 0.6rem; line-height: 1.3; }
        .ot-step.done .ot-step-label, .ot-step.active .ot-step-label { color: var(--dark); }

        /* Details section */
        .ot-details { padding: 0 2rem 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .ot-detail-box { background: var(--warm); border-radius: 14px; padding: 1.25rem; }
        .ot-detail-label { font-family: 'Lato', sans-serif; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.75rem; }
        .ot-detail-value { font-family: 'Lato', sans-serif; font-size: 0.88rem; color: var(--text); line-height: 1.6; }

        /* Courier tracking */
        .ot-courier { padding: 0 2rem 2rem; }
        .ot-courier-box { background: linear-gradient(135deg, #f0f9f4, #e8f5ec); border: 1px solid #b7e2c5; border-radius: 14px; padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
        .ot-courier-info { font-family: 'Lato', sans-serif; }
        .ot-courier-name { font-weight: 700; color: #1a6b3a; font-size: 0.95rem; }
        .ot-courier-awb { font-size: 0.8rem; color: #2d8c55; margin-top: 0.2rem; }
        .ot-track-link { display: inline-flex; align-items: center; gap: 0.4rem; background: #1a6b3a; color: #fff; padding: 0.6rem 1.25rem; border-radius: 10px; font-family: 'Lato', sans-serif; font-size: 0.85rem; font-weight: 700; text-decoration: none; transition: background 0.2s; }
        .ot-track-link:hover { background: #145530; }

        /* Items */
        .ot-items { padding: 0 2rem 2rem; }
        .ot-items-title { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 600; color: var(--dark); margin: 0 0 1rem; }
        .ot-item { display: flex; gap: 1rem; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--sand); }
        .ot-item:last-child { border-bottom: none; }
        .ot-item-name { font-family: 'Lato', sans-serif; font-weight: 700; color: var(--dark); font-size: 0.9rem; }
        .ot-item-meta { font-size: 0.78rem; color: var(--muted); margin-top: 0.2rem; }
        .ot-item-price { font-family: 'Lato', sans-serif; font-weight: 700; color: var(--brown); font-size: 0.9rem; margin-left: auto; flex-shrink: 0; }

        /* Total */
        .ot-total { padding: 1rem 2rem 2rem; border-top: 1px solid var(--sand); display: flex; justify-content: flex-end; }
        .ot-total-box { text-align: right; font-family: 'Lato', sans-serif; }
        .ot-total-label { font-size: 0.8rem; color: var(--muted); margin-bottom: 0.25rem; }
        .ot-total-value { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; color: var(--dark); }

        /* Help section */
        .ot-help { margin-top: 2rem; background: var(--warm); border-radius: 16px; padding: 1.5rem 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; border: 1px solid var(--sand); }
        .ot-help-text { font-family: 'Lato', sans-serif; }
        .ot-help-title { font-weight: 700; color: var(--dark); font-size: 0.95rem; margin-bottom: 0.3rem; }
        .ot-help-sub { font-size: 0.82rem; color: var(--muted); }
        .ot-help-wa { display: inline-flex; align-items: center; gap: 0.5rem; background: #25D366; color: #fff; padding: 0.65rem 1.4rem; border-radius: 10px; font-family: 'Lato', sans-serif; font-size: 0.88rem; font-weight: 700; text-decoration: none; transition: background 0.2s; }
        .ot-help-wa:hover { background: #1db954; }

        @media (max-width: 600px) {
          .ot-details { grid-template-columns: 1fr; }
          .ot-steps   { gap: 0; }
          .ot-step-label { font-size: 0.62rem; }
          .ot-step-icon  { width: 38px; height: 38px; }
          .ot-card-head  { flex-direction: column; }
          .ot-search-row { flex-direction: column; }
        }
      `}</style>

      <main className="ot-page">
        <div className="ot-inner">
          <Link to="/" className="ot-back">
            <ArrowLeft size={15} /> Back to Home
          </Link>

          <h1 className="ot-title">Track Your Order</h1>
          <p className="ot-sub">Enter your Order ID to see the latest status of your delivery.</p>

          {/* Search box */}
          <div className="ot-search">
            <label className="ot-search-label">Order ID</label>
            <form className="ot-search-row" onSubmit={handleSearch}>
              <input
                className="ot-search-input"
                type="text"
                placeholder="e.g. 6838ab12cd34ef567890abcd"
                value={inputId}
                onChange={e => setInputId(e.target.value)}
              />
              <button className="ot-search-btn" type="submit">
                Track Order
              </button>
            </form>
          </div>

          {/* Loading */}
          {loading && (
            <div className="ot-loading">
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📦</div>
              <p>Fetching your order details…</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ot-error">
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          {/* Order card */}
          {!loading && order && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="ot-card">

                {/* Header */}
                <div className="ot-card-head">
                  <div>
                    <div className="ot-order-id">ORDER ID</div>
                    <div className="ot-order-num">#{String(order._id || order.id).slice(-8).toUpperCase()}</div>
                    <div className="ot-order-date">{formatDate(order.created_at || order.createdAt)}</div>
                  </div>
                  <div className="ot-status-badge">
                    <span className="ot-status-dot" />
                    {order.order_status?.replace(/_/g, ' ') || 'Confirmed'}
                  </div>
                </div>

                {/* Progress stepper */}
                <div className="ot-stepper">
                  <div className="ot-stepper-title">Delivery Progress</div>
                  <div className="ot-steps">
                    {STATUS_STEPS.map((step, i) => {
                      const Icon = step.icon;
                      const isDone   = i < currentStep;
                      const isActive = i === currentStep;
                      return (
                        <div key={step.key}
                          className={`ot-step${isDone ? ' done' : ''}${isActive ? ' active' : ''}`}>
                          <div className="ot-step-icon">
                            <Icon size={20} />
                          </div>
                          <div className="ot-step-label">{step.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Courier tracking */}
                {order.shiprocket_awb && (
                  <div className="ot-courier">
                    <div className="ot-courier-box">
                      <div className="ot-courier-info">
                        <div className="ot-courier-name">
                          🚚 {order.shiprocket_courier || 'Courier Partner'}
                        </div>
                        <div className="ot-courier-awb">AWB: {order.shiprocket_awb}</div>
                        {order.etd && <div className="ot-courier-awb">Est. delivery: {order.etd}</div>}
                      </div>
                      {order.tracking_url && (
                        <a href={order.tracking_url} target="_blank" rel="noopener noreferrer"
                          className="ot-track-link">
                          <ExternalLink size={14} /> Live Tracking
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Delivery address + Contact */}
                <div className="ot-details">
                  <div className="ot-detail-box">
                    <div className="ot-detail-label">📦 Delivery Address</div>
                    <div className="ot-detail-value">
                      <strong>{order.shipping_details?.fullName}</strong><br />
                      {order.shipping_details?.address}<br />
                      {order.shipping_details?.city}, {order.shipping_details?.state}<br />
                      {order.shipping_details?.postalCode}, {order.shipping_details?.country}
                    </div>
                  </div>
                  <div className="ot-detail-box">
                    <div className="ot-detail-label">📬 Contact</div>
                    <div className="ot-detail-value">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                        <Mail size={13} /> {order.shipping_details?.email || order.user_email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Phone size={13} /> {order.shipping_details?.phone || order.user_phone}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                {order.items?.length > 0 && (
                  <div className="ot-items">
                    <div className="ot-items-title">Items Ordered</div>
                    {order.items.map((item, i) => (
                      <div key={i} className="ot-item">
                        <div style={{ flex: 1 }}>
                          <div className="ot-item-name">{item.product_name || 'Handmade Product'}</div>
                          <div className="ot-item-meta">
                            Qty: {item.quantity}
                            {item.color && ` · Colour: ${item.color}`}
                            {item.customisation && ` · ✎ ${item.customisation}`}
                          </div>
                        </div>
                        <div className="ot-item-price">
                          ₹{((item.price || 0) * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total */}
                <div className="ot-total">
                  <div className="ot-total-box">
                    <div className="ot-total-label">Total Paid</div>
                    <div className="ot-total-value">
                      ₹{(order.total_amount || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Help section */}
              <div className="ot-help">
                <div className="ot-help-text">
                  <div className="ot-help-title">Need help with your order?</div>
                  <div className="ot-help-sub">We're here to help — chat with us on WhatsApp</div>
                </div>
                <a
                  href={`https://wa.me/918810776486?text=${encodeURIComponent(`Hi! I need help with my order #${String(order._id || order.id).slice(-8).toUpperCase()}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="ot-help-wa">
                  <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M16 2C8.28 2 2 8.28 2 16c0 2.46.66 4.76 1.8 6.76L2 30l7.44-1.76A13.9 13.9 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm6.24 19.86c-.34-.17-2-.98-2.32-1.1-.3-.1-.52-.17-.74.18-.22.34-.86 1.1-1.06 1.32-.2.22-.38.24-.72.08a9.1 9.1 0 0 1-2.68-1.66 10.04 10.04 0 0 1-1.86-2.32c-.2-.34-.02-.52.14-.7.16-.16.34-.4.52-.6.17-.2.22-.34.34-.56.1-.22.06-.42-.02-.6-.08-.16-.74-1.78-1.02-2.44-.26-.62-.54-.54-.74-.54h-.62c-.22 0-.56.08-.86.4-.3.3-1.12 1.1-1.12 2.68s1.14 3.1 1.3 3.32c.16.22 2.24 3.4 5.42 4.76.76.32 1.34.52 1.8.68.76.24 1.44.2 1.98.12.6-.1 1.86-.76 2.12-1.5.26-.72.26-1.34.18-1.48-.08-.14-.3-.22-.64-.38z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </motion.div>
          )}

          {/* No order ID entered yet */}
          {!loading && !error && !order && !orderId && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9a8070', fontFamily: 'Lato, sans-serif' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
              <p style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 700, color: '#4a3728' }}>
                Enter your Order ID above
              </p>
              <p style={{ fontSize: '0.88rem' }}>
                You can find it in your order confirmation email or in My Orders page.
              </p>
              <Link to="/orders" style={{ display: 'inline-block', marginTop: '1.25rem', color: '#c2602a', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
                View My Orders →
              </Link>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
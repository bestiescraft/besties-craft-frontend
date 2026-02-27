import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, MapPin } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import usePageMeta from '@/hooks/usePageMeta'; // ← NEW

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL?.replace(/\/$/, '') ||
  'https://besties-craft-backend-1.onrender.com';
const API = `${BACKEND_URL}/api`;

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── NEW: SEO meta tags ──
  usePageMeta({
    title: 'Order Confirmed — Besties Craft',
    description: 'Your Besties Craft order has been confirmed. Thank you for shopping handmade crochet products with us!',
    url: `/order-confirmation/${orderId}`,
  });

  const fetchOrder = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const userRaw = localStorage.getItem('user');
      if (!userRaw) { setLoading(false); return; }
      const user = JSON.parse(userRaw);
      const response = await axios.get(
        `${API}/orders/user/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const orders = Array.isArray(response.data) ? response.data : [];
      const foundOrder = orders.find(o => o.id === orderId || o._id === orderId);
      setOrder(foundOrder || null);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  // Safe price calculation — handles null/undefined price
  const safePrice = (price) => {
    const p = parseFloat(price);
    return isNaN(p) ? 0 : p;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⏳</div>
            <p className="text-stone-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
          <p className="text-stone-700 font-medium mb-2">Order not found</p>
          <p className="text-stone-400 text-sm mb-6">It may still be processing. Check your orders page.</p>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/orders')} className="btn-primary">
              View My Orders
            </Button>
            <Button onClick={() => navigate('/')} variant="outline">
              Go Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#faf7f2' }}>
      <Navbar />

      <div className="py-12 md:py-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">

          {/* ── Success Header ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-stone-900 mb-4">
              Order Confirmed! 🎉
            </h1>
            <p className="text-lg text-stone-500">
              Thank you for your order. We'll contact you shortly for confirmation.
            </p>
          </motion.div>

          {/* ── Order Details Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 md:p-10 shadow-md border border-stone-100 mb-8"
          >
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-6">Order Details</h2>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between py-3 border-b border-stone-100">
                <span className="text-stone-500">Order ID</span>
                <span className="font-medium text-stone-900 text-sm break-all ml-4">{order.id || order._id}</span>
              </div>
              {order.user_email && (
                <div className="flex justify-between py-3 border-b border-stone-100">
                  <span className="text-stone-500">Email</span>
                  <span className="font-medium text-stone-900">{order.user_email}</span>
                </div>
              )}
              {order.user_phone && (
                <div className="flex justify-between py-3 border-b border-stone-100">
                  <span className="text-stone-500">Phone</span>
                  <span className="font-medium text-stone-900">{order.user_phone}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-b border-stone-100">
                <span className="text-stone-500">Payment Status</span>
                <span className={`font-medium capitalize px-2 py-0.5 rounded-full text-sm ${
                  order.payment_status === 'paid'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {order.payment_status || 'pending'}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-stone-100">
                <span className="text-stone-500">Order Status</span>
                <span className="font-medium text-amber-700 capitalize">
                  {order.order_status || 'confirmed'}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-stone-500">Total Amount</span>
                <span className="font-bold text-stone-900 text-2xl">
                  ₹{parseFloat(order.total_amount || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* ── Items ── */}
            <h3 className="text-xl font-serif font-semibold text-stone-900 mb-4">Items Ordered</h3>
            <div className="space-y-3">
              {(order.items || []).map((item, index) => {
                const itemPrice = safePrice(item.price);
                const itemQty   = parseInt(item.quantity) || 1;
                const itemTotal = itemPrice * itemQty;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-900 truncate">
                        {item.product_name || 'Product'}
                      </p>
                      <p className="text-sm text-stone-400">Qty: {itemQty}</p>
                      {item.color && (
                        <p className="text-xs text-stone-400">Colour: {item.color}</p>
                      )}
                      {item.customisation && (
                        <p className="text-xs text-amber-600 mt-0.5">
                          ✦ Custom: {item.customisation}
                        </p>
                      )}
                    </div>
                    <p className="font-semibold text-stone-900 ml-4">
                      {itemPrice > 0
                        ? `₹${itemTotal.toLocaleString('en-IN')}`
                        : '—'}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ── Actions ── */}
          {/* ── NEW: Track Order button added ── */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate(`/track-order/${order.id || order._id}`)}
              className="btn-primary">
              <MapPin className="w-5 h-5 mr-2" />
              Track Order
            </Button>
            <Button onClick={() => navigate('/orders')} variant="outline">
              <Package className="w-5 h-5 mr-2" />
              View All Orders
            </Button>
            <Button onClick={() => navigate('/products')} variant="outline">
              Continue Shopping
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;

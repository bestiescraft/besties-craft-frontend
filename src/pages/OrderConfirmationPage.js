import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(
        `${API}/orders/user/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const foundOrder = response.data.find(o => o.id === orderId);
      setOrder(foundOrder);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-stone-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-stone-600 mb-4">Order not found</p>
          <Button onClick={() => navigate('/')} className="btn-primary">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="py-12 md:py-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" data-testid="success-icon" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-stone-900 mb-4" data-testid="confirmation-title">
              Order Confirmed!
            </h1>
            <p className="text-lg text-stone-600">
              Thank you for your order. We'll contact you shortly for confirmation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-stone-100 mb-8"
          >
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-6">Order Details</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between pb-3 border-b border-stone-100">
                <span className="text-stone-600">Order ID</span>
                <span className="font-medium text-stone-900" data-testid="order-id">{order.id}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-stone-100">
                <span className="text-stone-600">Email</span>
                <span className="font-medium text-stone-900" data-testid="order-email">{order.user_email}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-stone-100">
                <span className="text-stone-600">Phone</span>
                <span className="font-medium text-stone-900" data-testid="order-phone">{order.user_phone}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-stone-100">
                <span className="text-stone-600">Payment Status</span>
                <span className="font-medium text-green-600 capitalize" data-testid="payment-status">{order.payment_status}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-stone-100">
                <span className="text-stone-600">Order Status</span>
                <span className="font-medium text-terracotta capitalize" data-testid="order-status">{order.order_status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Total Amount</span>
                <span className="font-semibold text-stone-900 text-2xl" data-testid="order-total">₹{order.total_amount}</span>
              </div>
            </div>

            <h3 className="text-xl font-serif font-semibold text-stone-900 mb-4">Items Ordered</h3>
            <div className="space-y-3" data-testid="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0" data-testid={`order-item-${index}`}>
                  <div>
                    <p className="font-medium text-stone-900">{item.product_name}</p>
                    <p className="text-sm text-stone-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-stone-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/orders')} className="btn-primary" data-testid="view-orders-button">
              <Package className="w-5 h-5 mr-2" />
              View All Orders
            </Button>
            <Button onClick={() => navigate('/products')} className="btn-secondary" data-testid="continue-shopping-button">
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
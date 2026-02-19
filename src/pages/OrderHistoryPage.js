import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ShoppingBag } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useApp } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/checkout');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API}/orders/user/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'confirmed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-terracotta bg-orange-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-stone-600 bg-stone-50';
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-stone-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="py-12 md:py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-stone-900 mb-12" data-testid="order-history-title">
            My Orders
          </h1>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <ShoppingBag className="w-24 h-24 text-stone-300 mb-6" />
              <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4" data-testid="no-orders-title">
                No orders yet
              </h2>
              <p className="text-stone-600 mb-8">Start shopping to see your orders here!</p>
              <Button onClick={() => navigate('/products')} className="btn-primary" data-testid="start-shopping-button">
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6" data-testid="orders-list">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-stone-100"
                  data-testid={`order-card-${index}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-6 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="w-5 h-5 text-stone-600" />
                        <h3 className="font-serif text-xl font-semibold text-stone-900" data-testid={`order-id-${index}`}>
                          Order #{order.id.slice(0, 8)}
                        </h3>
                      </div>
                      <p className="text-sm text-stone-600" data-testid={`order-date-${index}`}>
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end gap-2">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(order.order_status)}`} data-testid={`order-status-${index}`}>
                        {order.order_status}
                      </span>
                      <span className="text-2xl font-semibold text-stone-900" data-testid={`order-amount-${index}`}>₹{order.total_amount}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-stone-900 mb-3">Items:</h4>
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between py-2" data-testid={`order-item-${index}-${itemIndex}`}>
                        <div>
                          <p className="font-medium text-stone-900">{item.product_name}</p>
                          <p className="text-sm text-stone-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-stone-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-stone-100 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                    <div className="text-sm text-stone-600">
                      <p>Email: {order.user_email}</p>
                      <p>Phone: {order.user_phone}</p>
                    </div>
                    <Button
                      onClick={() => navigate(`/order-confirmation/${order.id}`)}
                      variant="outline"
                      className="rounded-full"
                      data-testid={`view-details-${index}`}
                    >
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderHistoryPage;
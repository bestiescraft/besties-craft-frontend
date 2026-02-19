import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Phone, Mail } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(
        `${API}/orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('admin_token');
    try {
      await axios.put(
        `${API}/orders/${orderId}/status`,
        { order_status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
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

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.order_status === filter;
  });

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-serif font-semibold text-stone-900 mb-2" data-testid="admin-orders-title">Orders</h1>
            <p className="text-stone-600">Manage customer orders</p>
          </div>
          <div className="w-full md:w-48">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger data-testid="order-filter">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-stone-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-6" data-testid="orders-list">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-stone-100"
                data-testid={`order-card-${index}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 pb-6 border-b border-stone-100 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Package className="w-5 h-5 text-stone-600" />
                      <h3 className="font-serif text-xl font-semibold text-stone-900" data-testid={`order-id-${index}`}>
                        Order #{order.id.slice(0, 8)}
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-stone-600" data-testid={`order-date-${index}`}>
                        <strong>Date:</strong> {new Date(order.created_at).toLocaleString()}
                      </p>
                      <p className="flex items-center gap-2 text-stone-600">
                        <Mail className="w-4 h-4" />
                        {order.user_email}
                      </p>
                      <p className="flex items-center gap-2 text-stone-600">
                        <Phone className="w-4 h-4" />
                        {order.user_phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start lg:items-end gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(order.order_status)}`} data-testid={`order-status-${index}`}>
                      {order.order_status}
                    </span>
                    <span className="text-3xl font-semibold text-stone-900" data-testid={`order-total-${index}`}>₹{order.total_amount}</span>
                    <span className={`text-sm px-3 py-1 rounded-full ${order.payment_status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                      Payment: {order.payment_status}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-stone-900 mb-3">Order Items:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between py-2 px-4 bg-stone-50 rounded-lg" data-testid={`order-item-${index}-${itemIndex}`}>
                        <div>
                          <p className="font-medium text-stone-900">{item.product_name}</p>
                          <p className="text-sm text-stone-600">Qty: {item.quantity} x ₹{item.price}</p>
                        </div>
                        <p className="font-semibold text-stone-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-stone-700 mb-2">Update Status:</label>
                    <Select
                      value={order.order_status}
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-full sm:w-48" data-testid={`status-select-${index}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-stone-100">
            <p className="text-stone-600">No orders found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Phone, Mail, Pencil, AlertCircle } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminOrdersPage = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${API}/admin/orders`, {
        headers: { 'admin-token': token }
      });
      setOrders(response.data.orders || response.data || []);
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
        `${API}/admin/orders/${orderId}`,
        { status: newStatus },
        { headers: { 'admin-token': token } }
      );
      toast.success('Order status updated');
      setOrders(prev =>
        prev.map(o => (o._id === orderId || o.id === orderId) ? { ...o, order_status: newStatus } : o)
      );
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
      case 'completed':
      case 'confirmed': return 'text-green-600 bg-green-50';
      case 'pending':   return 'text-amber-600 bg-amber-50';
      case 'shipped':   return 'text-blue-600 bg-blue-50';
      case 'processing':return 'text-purple-600 bg-purple-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default:          return 'text-stone-600 bg-stone-50';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all')    return true;
    if (filter === 'custom') return order.has_customisation;
    return order.order_status === filter;
  });

  const customCount = orders.filter(o => o.has_customisation).length;

  return (
    <AdminLayout>
      <style>{`
        .custom-note-box {
          display: flex; align-items: flex-start; gap: 0.5rem;
          background: #fff7ed; border: 1.5px solid #fdba74;
          border-radius: 10px; padding: 0.65rem 0.9rem; margin-top: 0.5rem;
          font-size: 0.82rem; color: #7c2d12; line-height: 1.55; word-break: break-word;
        }
        .custom-note-box svg { flex-shrink: 0; margin-top: 2px; color: #ea580c; }
        .custom-note-label {
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: #ea580c; display: block; margin-bottom: 0.2rem;
        }
        .custom-order-border { border-left: 4px solid #f97316 !important; }
        .custom-flag {
          display: inline-flex; align-items: center; gap: 0.25rem;
          font-size: 0.68rem; font-weight: 700; background: #fff7ed; color: #ea580c;
          border: 1px solid #fdba74; padding: 0.2rem 0.6rem; border-radius: 20px;
        }
        .custom-banner {
          display: flex; align-items: center; gap: 0.75rem;
          background: #fff7ed; border: 1.5px solid #fdba74; border-radius: 12px;
          padding: 0.85rem 1.25rem; margin-bottom: 1.5rem;
          font-size: 0.88rem; color: #92400e;
        }
      `}</style>

      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-serif font-semibold text-stone-900 mb-2" data-testid="admin-orders-title">Orders</h1>
            <p className="text-stone-600">Manage customer orders</p>
          </div>
          <div className="w-full md:w-56">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger data-testid="order-filter"><SelectValue placeholder="Filter by status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="custom">✦ Custom Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {customCount > 0 && (
          <div className="custom-banner">
            <AlertCircle size={18} color="#f97316" />
            <span>
              <strong>{customCount} order{customCount !== 1 ? 's' : ''}</strong> ha{customCount !== 1 ? 've' : 's'} a
              customisation note — use <strong>"✦ Custom Orders"</strong> to view them quickly.
            </span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12"><p className="text-stone-600">Loading orders...</p></div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-6" data-testid="orders-list">
            {filteredOrders.map((order, index) => {
              const orderId   = order._id || order.id;
              const ship      = order.shipping_details || {};
              const hasCustom = order.has_customisation;

              return (
                <motion.div
                  key={orderId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`bg-white rounded-xl p-6 md:p-8 shadow-sm border border-stone-100${hasCustom ? ' custom-order-border' : ''}`}
                  data-testid={`order-card-${index}`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 pb-6 border-b border-stone-100 gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <Package className="w-5 h-5 text-stone-600" />
                        <h3 className="font-serif text-xl font-semibold text-stone-900" data-testid={`order-id-${index}`}>
                          Order #{orderId.slice(-8).toUpperCase()}
                        </h3>
                        {hasCustom && <span className="custom-flag"><Pencil size={10} /> Custom</span>}
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-stone-600" data-testid={`order-date-${index}`}>
                          <strong>Date:</strong>{' '}
                          {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN')
                           : order.created_at ? new Date(order.created_at).toLocaleString('en-IN') : '—'}
                        </p>
                        {(ship.fullName || order.user_name) && (
                          <p className="text-stone-600"><strong>Name:</strong> {ship.fullName || order.user_name}</p>
                        )}
                        <p className="flex items-center gap-2 text-stone-600">
                          <Mail className="w-4 h-4" />{ship.email || order.user_email || '—'}
                        </p>
                        <p className="flex items-center gap-2 text-stone-600">
                          <Phone className="w-4 h-4" />{ship.phone || order.user_phone || '—'}
                        </p>
                        {ship.address && (
                          <p className="text-stone-600 text-xs mt-1">
                            📍 {ship.address}, {ship.city}, {ship.state} {ship.postalCode}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-start lg:items-end gap-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(order.order_status)}`} data-testid={`order-status-${index}`}>
                        {order.order_status || 'pending'}
                      </span>
                      <span className="text-3xl font-semibold text-stone-900" data-testid={`order-total-${index}`}>
                        ₹{parseFloat(order.total_amount || 0).toLocaleString('en-IN')}
                      </span>
                      <span className={`text-sm px-3 py-1 rounded-full ${
                        order.payment_status === 'paid' || order.payment_status === 'completed'
                          ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                        Payment: {order.payment_status || 'pending'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-stone-900 mb-3">Order Items:</h4>
                    <div className="space-y-3">
                      {(order.items || []).map((item, itemIndex) => (
                        <div key={itemIndex} data-testid={`order-item-${index}-${itemIndex}`}>
                          <div className="flex items-center justify-between py-2 px-4 bg-stone-50 rounded-lg">
                            <div>
                              <p className="font-medium text-stone-900">{item.product_name}</p>
                              <p className="text-sm text-stone-600">
                                Qty: {item.quantity} × ₹{item.price}
                                {item.color && <> · Colour: <strong>{item.color}</strong></>}
                              </p>
                            </div>
                            <p className="font-semibold text-stone-900">
                              ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </p>
                          </div>
                          {item.customisation && (
                            <div className="custom-note-box">
                              <Pencil size={13} />
                              <div>
                                <span className="custom-note-label">Customer's Customisation Request</span>
                                {item.customisation}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-stone-700 mb-2">Update Status:</label>
                      <Select value={order.order_status || 'pending'} onValueChange={(value) => updateOrderStatus(orderId, value)}>
                        <SelectTrigger className="w-full sm:w-56" data-testid={`status-select-${index}`}><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
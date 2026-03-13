import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Phone, Mail, Pencil, AlertCircle, Printer, Truck, ExternalLink } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { toast } from 'sonner';

import { API } from '@/lib/constants';

// ─── Print Shipping Label ───────────────────────────────────────────────────
const printShippingLabel = (order) => {
  const ship    = order.shipping_details || {};
  const orderId = (order._id || order.id || '').slice(-8).toUpperCase();
  const date    = order.createdAt || order.created_at
    ? new Date(order.createdAt || order.created_at).toLocaleDateString('en-IN')
    : new Date().toLocaleDateString('en-IN');
  const items = (order.items || [])
    .map(i => `${i.product_name} × ${i.quantity}${i.color ? ` (${i.color})` : ''}`)
    .join('<br/>');

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
    <title>Shipping Label — Order #${orderId}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box;}
      body{font-family:sans-serif;background:#fff;padding:20px;}
      .label{width:10cm;min-height:15cm;border:2.5px solid #2c1810;border-radius:8px;padding:18px;margin:0 auto;}
      .header{text-align:center;border-bottom:2px solid #2c1810;padding-bottom:12px;margin-bottom:14px;}
      .brand{font-size:20px;color:#2c1810;font-weight:700;}
      .brand-sub{font-size:9px;letter-spacing:0.2em;color:#c2602a;text-transform:uppercase;margin-top:2px;}
      .section{margin-bottom:12px;}
      .section-title{font-size:8px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#c2602a;border-bottom:1px solid #e8dfd0;padding-bottom:3px;margin-bottom:6px;}
      .address-name{font-size:14px;font-weight:700;color:#1a0a04;margin-bottom:3px;}
      .address-line{font-size:11px;color:#3a2010;line-height:1.6;}
      .order-box{background:#f5ede0;border-radius:6px;padding:8px 10px;margin-bottom:12px;display:flex;justify-content:space-between;}
      .order-id{font-size:13px;font-weight:700;color:#2c1810;}
      .items{font-size:10px;color:#3a2010;line-height:1.7;}
      .total-row{display:flex;justify-content:space-between;margin-top:8px;padding-top:8px;border-top:1px solid #e8dfd0;}
      .from-box{border:1px dashed #c2602a;border-radius:6px;padding:8px 10px;margin-top:12px;}
      .barcode-area{text-align:center;margin-top:12px;font-size:9px;color:#9a8070;letter-spacing:0.15em;border-top:1px solid #e8dfd0;padding-top:10px;}
      .barcode-text{font-size:16px;letter-spacing:0.3em;color:#2c1810;font-weight:700;}
      @media print{.no-print{display:none;}}
    </style></head><body>
    <div class="no-print" style="text-align:center;margin-bottom:16px;">
      <button onclick="window.print()" style="background:#2c1810;color:#fff;border:none;padding:10px 28px;border-radius:6px;font-size:14px;cursor:pointer;">🖨️ Print Label</button>
    </div>
    <div class="label">
      <div class="header"><div class="brand">Besties Craft</div><div class="brand-sub">Handcrafted with Love · India</div></div>
      <div class="order-box">
        <div><div style="font-size:8px;color:#c2602a;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:2px;">Order ID</div><div class="order-id">#${orderId}</div></div>
        <div style="text-align:right;"><div style="font-size:8px;color:#c2602a;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:2px;">Date</div><div style="font-size:10px;color:#7a6050;">${date}</div></div>
      </div>
      <div class="section">
        <div class="section-title">📦 Ship To</div>
        <div class="address-name">${ship.fullName || '—'}</div>
        <div class="address-line">${ship.address || '—'}</div>
        <div class="address-line">${ship.city || ''}, ${ship.state || ''} — ${ship.postalCode || ''}</div>
        <div class="address-line">${ship.country || 'India'}</div>
        <div class="address-line" style="margin-top:4px;">📱 ${ship.phone || '—'}</div>
        <div class="address-line">✉️ ${ship.email || '—'}</div>
      </div>
      <div class="section">
        <div class="section-title">🛍️ Items</div>
        <div class="items">${items}</div>
        <div class="total-row"><div style="font-size:10px;font-weight:700;color:#2c1810;">Total</div><div style="font-size:13px;font-weight:700;color:#2c1810;">₹${parseFloat(order.total_amount || 0).toLocaleString('en-IN')}</div></div>
      </div>
      <div class="from-box">
        <div style="font-size:8px;font-weight:700;color:#c2602a;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:4px;">Return Address</div>
        <div style="font-size:11px;font-weight:700;color:#2c1810;">Besties Craft</div>
        <div style="font-size:10px;color:#7a6050;">Sai Nagar Colony, Phase 2, Singhpur, Sarnath</div>
        <div style="font-size:10px;color:#7a6050;">Varanasi, Uttar Pradesh — 221007</div>
        <div style="font-size:10px;color:#7a6050;">📱 9415837769</div>
      </div>
      <div class="barcode-area"><div class="barcode-text">||||| ${orderId} |||||</div><div style="margin-top:4px;">Order Ref: ${orderId}</div></div>
    </div></body></html>`;

  const win = window.open('', '_blank', 'width=450,height=700');
  win.document.write(html);
  win.document.close();
};
// ───────────────────────────────────────────────────────────────────────────

const AdminOrdersPage = () => {
  const [orders,         setOrders]         = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [filter,         setFilter]         = useState('all');
  const [bookingOrderId, setBookingOrderId] = useState(null);

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

  // ── Book Courier via Shiprocket ──
  const bookCourier = async (orderId) => {
    const token = localStorage.getItem('admin_token');
    setBookingOrderId(orderId);
    try {
      const res = await axios.post(
        `${API}/admin/orders/${orderId}/book-courier`,
        {},
        { headers: { 'admin-token': token } }
      );
      const data = res.data;
      toast.success(`✅ Courier booked via ${data.courier || 'Shiprocket'}! AWB: ${data.awb}`);
      setOrders(prev => prev.map(o => {
        if ((o._id || o.id) === orderId) {
          return {
            ...o,
            order_status:        'processing',
            shiprocket_awb:      data.awb,
            shiprocket_courier:  data.courier,
            tracking_url:        data.tracking_url,
          };
        }
        return o;
      }));
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to book courier';
      toast.error(msg);
    } finally {
      setBookingOrderId(null);
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
        .action-btn {
          display: inline-flex; align-items: center; gap: 0.4rem;
          border: none; border-radius: 8px;
          padding: 0.55rem 1.1rem; font-size: 0.82rem; font-weight: 600;
          cursor: pointer; transition: background 0.2s; font-family: inherit;
        }
        .print-btn  { background: #2c1810; color: #f2e8d8; }
        .print-btn:hover { background: #c2602a; }
        .courier-btn { background: #7c3aed; color: #fff; }
        .courier-btn:hover { background: #6d28d9; }
        .courier-btn:disabled { background: #a78bfa; cursor: not-allowed; }
        .booked-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: #ede9fe; color: #5b21b6; border: 1px solid #c4b5fd;
          border-radius: 8px; padding: 0.45rem 0.9rem; font-size: 0.78rem; font-weight: 600;
        }
        .tracking-link {
          display: inline-flex; align-items: center; gap: 0.3rem;
          color: #7c3aed; font-size: 0.78rem; font-weight: 600;
          text-decoration: underline; cursor: pointer; background: none; border: none;
        }
        .status-done-note {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.78rem; color: #9a8070; font-style: italic;
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
              const hasAwb    = !!order.shiprocket_awb;
              const isBooking = bookingOrderId === orderId;

              // ── Hide action buttons for completed/cancelled orders ──
              const status        = order.order_status || 'pending';
              const isClosedOrder = status === 'delivered' || status === 'cancelled';

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
                        <p className="text-stone-600">
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
                      <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(status)}`}>
                        {status}
                      </span>
                      <span className="text-3xl font-semibold text-stone-900">
                        ₹{parseFloat(order.total_amount || 0).toLocaleString('en-IN')}
                      </span>
                      <span className={`text-sm px-3 py-1 rounded-full ${
                        order.payment_status === 'paid' || order.payment_status === 'completed'
                          ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                        Payment: {order.payment_status || 'pending'}
                      </span>

                      {/* ── ACTION BUTTONS — hidden for delivered / cancelled ── */}
                      {isClosedOrder ? (
                        <span className="status-done-note">
                          {status === 'delivered' ? '✅ Order delivered' : '❌ Order cancelled'}
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-2 justify-end">
                          {/* Print Label */}
                          <button className="action-btn print-btn" onClick={() => printShippingLabel(order)}>
                            <Printer size={13} /> Print Label
                          </button>

                          {/* Book Courier or Show Tracking */}
                          {hasAwb ? (
                            <div className="flex flex-col items-end gap-1">
                              <div className="booked-badge">
                                <Truck size={12} /> {order.shiprocket_courier || 'Courier'} · {order.shiprocket_awb}
                              </div>
                              {order.tracking_url && (
                                <a href={order.tracking_url} target="_blank" rel="noreferrer" className="tracking-link">
                                  <ExternalLink size={11} /> Track Parcel
                                </a>
                              )}
                            </div>
                          ) : (
                            <button
                              className="action-btn courier-btn"
                              onClick={() => bookCourier(orderId)}
                              disabled={isBooking}
                            >
                              <Truck size={13} />
                              {isBooking ? 'Booking...' : 'Book Courier'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-stone-900 mb-3">Order Items:</h4>
                    <div className="space-y-3">
                      {(order.items || []).map((item, itemIndex) => (
                        <div key={itemIndex}>
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
                      <Select value={status} onValueChange={(value) => updateOrderStatus(orderId, value)}>
                        <SelectTrigger className="w-full sm:w-56"><SelectValue /></SelectTrigger>
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
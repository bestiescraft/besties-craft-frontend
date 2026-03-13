import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Phone, Calendar, Search, MessageCircle, ShoppingBag } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import axios from 'axios';
import { toast } from 'sonner';

import { API } from '@/lib/constants';

const AdminCustomersPage = () => {
  const [customers, setCustomers]   = useState([]);
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const token   = localStorage.getItem('admin_token');
      const headers = { 'admin-token': token };
      const [custRes, orderRes] = await Promise.all([
        axios.get(`${API}/admin/customers`, { headers }),
        axios.get(`${API}/admin/orders`,    { headers }),
      ]);
      setCustomers(custRes.data.customers  || custRes.data  || []);
      setOrders(orderRes.data.orders       || orderRes.data || []);
    } catch {
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  // Count orders per customer
  const orderCountMap = orders.reduce((acc, order) => {
    const uid = order.user_id || order.userId;
    if (uid) acc[uid] = (acc[uid] || 0) + 1;
    return acc;
  }, {});

  // Search filter
  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    return (
      (c.name  || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q)
    );
  });

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif font-semibold text-stone-900 mb-2">Customers</h1>
            <p className="text-stone-500 text-sm">
              {customers.length} total customer{customers.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 320 }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#a8a29e', pointerEvents: 'none' }}
            />
            <input
              type="text"
              placeholder="Search name, email or phone…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '0.6rem 1rem 0.6rem 2.25rem',
                border: '1px solid #e7e5e4', borderRadius: 12,
                fontSize: '0.88rem', outline: 'none', fontFamily: 'inherit',
                background: '#fff', color: '#1c1917',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧶</div>
            <p className="text-stone-500 text-sm">Loading customers…</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Orders</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Joined</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filtered.map((customer, index) => {
                    const uid        = customer.id || customer._id || '';
                    const orderCount = orderCountMap[uid] || 0;
                    const phone      = customer.phone || '';

                    return (
                      <motion.tr
                        key={uid || index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.04 }}
                        className="hover:bg-stone-50 transition-colors"
                      >
                        {/* Customer */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              style={{
                                width: 40, height: 40, borderRadius: '50%',
                                background: 'rgba(194,96,42,0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: 'serif', fontWeight: 700, fontSize: '1rem', color: '#c2602a',
                                flexShrink: 0,
                              }}
                            >
                              {(customer.name || customer.email || 'C')[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-stone-900">{customer.name || 'Customer'}</p>
                              <p className="text-xs text-stone-400">ID: {uid.toString().slice(0, 8)}</p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-stone-600">
                            <Mail size={14} />
                            {customer.email
                              ? <a href={`mailto:${customer.email}`} className="text-sm hover:text-orange-600 transition-colors">{customer.email}</a>
                              : <span className="text-sm text-stone-400">—</span>
                            }
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-stone-600">
                            <Phone size={14} />
                            <span className="text-sm">{phone || '—'}</span>
                          </div>
                        </td>

                        {/* Orders count */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <ShoppingBag size={14} className="text-stone-400" />
                            <span
                              style={{
                                background: orderCount > 0 ? 'rgba(194,96,42,0.1)' : '#f5f5f4',
                                color: orderCount > 0 ? '#c2602a' : '#a8a29e',
                                borderRadius: 20, padding: '2px 10px',
                                fontSize: '0.78rem', fontWeight: 700,
                              }}
                            >
                              {orderCount} order{orderCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </td>

                        {/* Joined */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-stone-500">
                            <Calendar size={14} />
                            <span className="text-sm">
                              {customer.created_at
                                ? new Date(customer.created_at).toLocaleDateString('en-IN')
                                : '—'}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {phone ? (
                              <a
                                href={`https://wa.me/91${phone.replace(/\D/g, '').slice(-10)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Chat on WhatsApp"
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 5,
                                  background: '#25d366', color: '#fff',
                                  padding: '0.35rem 0.75rem', borderRadius: 8,
                                  fontSize: '0.78rem', fontWeight: 700,
                                  textDecoration: 'none', transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#1ebe5d'}
                                onMouseLeave={e => e.currentTarget.style.background = '#25d366'}
                              >
                                <MessageCircle size={13} /> WhatsApp
                              </a>
                            ) : (
                              <span style={{ fontSize: '0.78rem', color: '#d4ccc8' }}>No phone</span>
                            )}
                          </div>
                        </td>

                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* No search results */}
            {filtered.length === 0 && search && (
              <div className="text-center py-10 text-stone-400 text-sm">
                No customers found for "{search}"
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-stone-100">
            <Users className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500">No customers yet</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCustomersPage;
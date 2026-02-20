import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import axios from 'axios';
import { toast } from 'sonner';

const API =
  (process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL || 'https://besties-craft-backend-1.onrender.com').replace(/\/$/, '');

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardStats(); }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) { toast.error('Admin session expired'); setLoading(false); return; }

      const response = await axios.get(`${API}/api/admin/dashboard`, {
        headers: { 'admin-token': token }   // ✅ fixed: was Authorization Bearer
      });
      setStats(response.data);
    } catch (error) {
      // If /dashboard endpoint doesn't exist, build stats from orders + products
      try {
        const token = localStorage.getItem('admin_token');
        const headers = { 'admin-token': token };
        const [prodRes, orderRes] = await Promise.all([
          axios.get(`${API}/api/admin/products`, { headers }),
          axios.get(`${API}/api/admin/orders`, { headers }),
        ]);
        const products = prodRes.data.products || prodRes.data || [];
        const orders   = orderRes.data.orders   || orderRes.data || [];
        const revenue  = orders.reduce((s, o) => s + (parseFloat(o.total_amount) || 0), 0);
        setStats({
          total_products:   products.length,
          total_orders:     orders.length,
          total_users:      new Set(orders.map(o => o.user_id).filter(Boolean)).size,
          total_revenue:    revenue,
          pending_orders:   orders.filter(o => o.status === 'pending').length,
          confirmed_orders: orders.filter(o => o.status === 'confirmed').length,
        });
      } catch {
        toast.error('Failed to fetch dashboard stats');
      }
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Products',  value: stats?.total_products ?? 0,                       icon: Package,     color: 'bg-blue-50 text-blue-600' },
    { title: 'Total Orders',    value: stats?.total_orders ?? 0,                         icon: ShoppingCart, color: 'bg-green-50 text-green-600' },
    { title: 'Total Customers', value: stats?.total_users ?? 0,                          icon: Users,       color: 'bg-purple-50 text-purple-600' },
    { title: 'Total Revenue',   value: `₹${(stats?.total_revenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'bg-orange-50 text-orange-500' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧶</div>
            <p className="text-stone-500 text-sm">Loading dashboard…</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-4xl font-serif font-semibold text-stone-900 mb-2">Dashboard</h1>
        <p className="text-stone-500 mb-10 text-sm">Overview of your store</p>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100"
              >
                <div className={`inline-flex p-3 rounded-xl mb-4 ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-stone-900 mb-1">{stat.value}</p>
                <p className="text-sm text-stone-500">{stat.title}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Order status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="bg-white rounded-2xl p-7 shadow-sm border border-stone-100"
          >
            <h2 className="text-xl font-serif font-semibold text-stone-900 mb-5">Order Status</h2>
            <div className="space-y-3">
              {[
                { label: 'Pending Orders',   sub: 'Awaiting confirmation', val: stats?.pending_orders   ?? 0, bg: 'bg-orange-50', color: 'text-orange-500' },
                { label: 'Confirmed Orders', sub: 'In progress',           val: stats?.confirmed_orders ?? 0, bg: 'bg-green-50',  color: 'text-green-600' },
                { label: 'Delivered',        sub: 'Completed',             val: stats?.delivered_orders ?? 0, bg: 'bg-blue-50',   color: 'text-blue-600'  },
              ].map(row => (
                <div key={row.label} className={`flex items-center justify-between p-4 ${row.bg} rounded-xl`}>
                  <div>
                    <p className="font-semibold text-stone-800 text-sm">{row.label}</p>
                    <p className="text-xs text-stone-500">{row.sub}</p>
                  </div>
                  <span className={`text-2xl font-bold ${row.color}`}>{row.val}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="bg-white rounded-2xl p-7 shadow-sm border border-stone-100"
          >
            <h2 className="text-xl font-serif font-semibold text-stone-900 mb-5">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
                <div className="p-3 bg-amber-50 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 font-semibold uppercase tracking-wide">Avg. Order Value</p>
                  <p className="text-2xl font-bold text-stone-900">
                    ₹{stats?.total_orders > 0
                      ? (stats.total_revenue / stats.total_orders).toLocaleString('en-IN', { minimumFractionDigits: 2 })
                      : '0.00'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
                <div className="p-3 bg-green-50 rounded-xl">
                  <Package className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 font-semibold uppercase tracking-wide">Products Listed</p>
                  <p className="text-2xl font-bold text-stone-900">{stats?.total_products ?? 0}</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
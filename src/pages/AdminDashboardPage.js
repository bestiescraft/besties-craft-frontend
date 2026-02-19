import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(
        `${API}/admin/dashboard`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard stats');
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.total_products || 0,
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
      testId: 'total-products'
    },
    {
      title: 'Total Orders',
      value: stats?.total_orders || 0,
      icon: ShoppingCart,
      color: 'bg-green-50 text-green-600',
      testId: 'total-orders'
    },
    {
      title: 'Total Customers',
      value: stats?.total_users || 0,
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
      testId: 'total-customers'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats?.total_revenue?.toFixed(2) || 0}`,
      icon: DollarSign,
      color: 'bg-terracotta/10 text-terracotta',
      testId: 'total-revenue'
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-stone-600">Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-4xl font-serif font-semibold text-stone-900 mb-2" data-testid="dashboard-title">Dashboard</h1>
        <p className="text-stone-600 mb-12">Overview of your store</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-stone-100"
                data-testid={stat.testId}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-stone-900 mb-1">{stat.value}</h3>
                <p className="text-stone-600">{stat.title}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-stone-100"
          >
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-6">Order Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-stone-900">Pending Orders</p>
                  <p className="text-sm text-stone-600">Awaiting confirmation</p>
                </div>
                <span className="text-3xl font-bold text-terracotta" data-testid="pending-orders">{stats?.pending_orders || 0}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-stone-900">Confirmed Orders</p>
                  <p className="text-sm text-stone-600">In progress</p>
                </div>
                <span className="text-3xl font-bold text-green-600" data-testid="confirmed-orders">{stats?.confirmed_orders || 0}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-stone-100"
          >
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-6">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg">
                <div className="p-3 bg-terracotta/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-terracotta" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Average Order Value</p>
                  <p className="text-2xl font-bold text-stone-900">
                    ₹{stats?.total_orders > 0 ? (stats.total_revenue / stats.total_orders).toFixed(2) : 0}
                  </p>
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
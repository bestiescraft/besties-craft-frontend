import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Phone, Calendar } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(
        `${API}/admin/customers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCustomers(response.data);
    } catch (error) {
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-semibold text-stone-900 mb-2" data-testid="admin-customers-title">Customers</h1>
          <p className="text-stone-600">Manage your customer base</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-stone-600">Loading customers...</p>
          </div>
        ) : customers.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="customers-table">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {customers.map((customer, index) => (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-stone-50 transition-colors"
                      data-testid={`customer-row-${index}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-terracotta/10 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-terracotta" />
                          </div>
                          <div>
                            <p className="font-medium text-stone-900">{customer.name || 'Customer'}</p>
                            <p className="text-xs text-stone-500">ID: {customer.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-stone-600">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm" data-testid={`customer-email-${index}`}>{customer.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-stone-600">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm" data-testid={`customer-phone-${index}`}>{customer.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-stone-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm" data-testid={`customer-date-${index}`}>
                            {new Date(customer.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-stone-100">
            <Users className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-600">No customers yet</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCustomersPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { setIsAdmin } = useApp();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!password) {
      toast.error('Please enter password');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting login with API URL:', `${API}/auth/admin-login`);
      const response = await axios.post(`${API}/auth/admin-login`, { password });
      const { token } = response.data;
      
      console.log('Login successful, token:', token);
      localStorage.setItem('admin_token', token);
      setIsAdmin(true);
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.detail || 'Invalid password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-stone-100 to-stone-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-900 rounded-full mb-4">
            <Shield className="w-8 h-8 text-stone-50" />
          </div>
          <h1 className="text-3xl font-serif font-semibold text-stone-900 mb-2" data-testid="admin-login-title">
            Admin Portal
          </h1>
          <p className="text-stone-600">Besties Craft Management</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl border border-stone-200">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="password" className="text-stone-700 font-medium mb-2">Admin Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 py-6 text-lg"
                  data-testid="admin-password-input"
                  autoFocus
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-6 text-lg"
              data-testid="admin-login-button"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-stone-600 hover:text-stone-900 transition-colors text-sm"
              data-testid="back-to-home-link"
            >
              Back to Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;

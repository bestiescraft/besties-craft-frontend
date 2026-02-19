import React, { createContext, useState, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import '@/App.css';

import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderConfirmationPage from '@/pages/OrderConfirmationPage';
import OrderHistoryPage from '@/pages/OrderHistoryPage';
import LoginPage from '@/pages/LoginPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import AdminProductsPage from '@/pages/AdminProductsPage';
import AdminOrdersPage from '@/pages/AdminOrdersPage';
import AdminCustomersPage from '@/pages/AdminCustomersPage';

export const AppContext = createContext();
export const useApp = () => useContext(AppContext);

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const adminToken = localStorage.getItem('admin_token');

    if (token && userData) setUser(JSON.parse(userData));
    if (adminToken) setIsAdmin(true);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCart([]);
  };

  const adminLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
  };

  return (
    <AppContext.Provider value={{ user, setUser, cart, setCart, logout, isAdmin, setIsAdmin, adminLogout }}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={isAdmin ? <AdminDashboardPage /> : <Navigate to="/admin/login" />} />
            <Route path="/admin/products" element={isAdmin ? <AdminProductsPage /> : <Navigate to="/admin/login" />} />
            <Route path="/admin/orders" element={isAdmin ? <AdminOrdersPage /> : <Navigate to="/admin/login" />} />
            <Route path="/admin/customers" element={isAdmin ? <AdminCustomersPage /> : <Navigate to="/admin/login" />} />
          </Routes>
        </BrowserRouter>

        <Toaster position="top-right" richColors />
      </div>
    </AppContext.Provider>
  );
}

export default App;

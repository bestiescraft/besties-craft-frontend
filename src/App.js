import React, { createContext, useState, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import '@/App.css';

// ── Firebase ──
import './firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// ── Pages ──
import HomePage              from '@/pages/HomePage';
import ProductsPage          from '@/pages/ProductsPage';
import ProductDetailPage     from '@/pages/ProductDetailPage';
import CartPage              from '@/pages/CartPage';
import CheckoutPage          from '@/pages/CheckoutPage';
import OrderConfirmationPage from '@/pages/OrderConfirmationPage';
import OrderHistoryPage      from '@/pages/OrderHistoryPage';
import LoginPage             from '@/pages/LoginPage';
import AboutPage             from '@/pages/AboutPage';
import ContactPage           from '@/pages/ContactPage';
import AdminLoginPage        from '@/pages/AdminLoginPage';
import AdminDashboardPage    from '@/pages/AdminDashboardPage';
import AdminProductsPage     from '@/pages/AdminProductsPage';
import AdminOrdersPage       from '@/pages/AdminOrdersPage';
import AdminCustomersPage    from '@/pages/AdminCustomersPage';

// ── NEW Pages ──
import OrderTrackingPage from '@/pages/OrderTrackingPage';
import BlogPage          from '@/pages/BlogPage';
import PoliciesPage      from '@/pages/PoliciesPage';

// ── Components ──
import WhatsAppButton from '@/components/WhatsAppButton';

export const AppContext = createContext();
export const useApp = () => useContext(AppContext);

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('admin_token')) setIsAdmin(true);

    const unsubscribe = onAuthStateChanged(getAuth(), async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        const userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name:
            firebaseUser.displayName ||
            firebaseUser.email?.split('@')[0] ||
            'Customer',
        };

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await getAuth().signOut();
    setUser(null);
    setCart([]);
  };

  const adminLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        cart,
        setCart,
        logout,
        isAdmin,
        setIsAdmin,
        adminLogout,
      }}
    >
      <div className="App">
        <BrowserRouter>
          <Routes>

            {/* ── Public Routes ── */}
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

            {/* ── NEW Routes ── */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/policies" element={<PoliciesPage />} />

            {/* ── Order Tracking ── */}
            <Route path="/track-order" element={<OrderTrackingPage />} />
            <Route path="/track-order/:orderId" element={<OrderTrackingPage />} />

            {/* ── Admin Routes ── */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin/dashboard"
              element={isAdmin ? <AdminDashboardPage /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/products"
              element={isAdmin ? <AdminProductsPage /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/orders"
              element={isAdmin ? <AdminOrdersPage /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/customers"
              element={isAdmin ? <AdminCustomersPage /> : <Navigate to="/admin/login" />}
            />

          </Routes>

          {/* WhatsApp floating button */}
          <WhatsAppButton />
        </BrowserRouter>

        <Toaster position="top-right" richColors />
      </div>
    </AppContext.Provider>
  );
}

export default App;
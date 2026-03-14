import React, { createContext, useState, useContext, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import '@/App.css';

// ── Pages (lazy loaded — each becomes its own JS chunk) ──
const HomePage              = lazy(() => import('@/pages/HomePage'));
const ProductsPage          = lazy(() => import('@/pages/ProductsPage'));
const ProductDetailPage     = lazy(() => import('@/pages/ProductDetailPage'));
const CartPage              = lazy(() => import('@/pages/CartPage'));
const CheckoutPage          = lazy(() => import('@/pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('@/pages/OrderConfirmationPage'));
const OrderHistoryPage      = lazy(() => import('@/pages/OrderHistoryPage'));
const LoginPage             = lazy(() => import('@/pages/LoginPage'));
const AboutPage             = lazy(() => import('@/pages/AboutPage'));
const ContactPage           = lazy(() => import('@/pages/ContactPage'));
const AdminLoginPage        = lazy(() => import('@/pages/AdminLoginPage'));
const AdminDashboardPage    = lazy(() => import('@/pages/AdminDashboardPage'));
const AdminProductsPage     = lazy(() => import('@/pages/AdminProductsPage'));
const AdminOrdersPage       = lazy(() => import('@/pages/AdminOrdersPage'));
const AdminCustomersPage    = lazy(() => import('@/pages/AdminCustomersPage'));
const OrderTrackingPage     = lazy(() => import('@/pages/OrderTrackingPage'));
const BlogPage              = lazy(() => import('@/pages/BlogPage'));
const PoliciesPage          = lazy(() => import('@/pages/PoliciesPage'));

// ── Components ──
import WhatsAppButton from '@/components/WhatsAppButton';

// ── Backend URL ──
const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL?.replace(/\/$/, '') ||
  'https://besties-craft-backend-1.onrender.com';

// ── Page loading spinner ──
const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#faf7f2'
  }}>
    <div style={{
      width: 36,
      height: 36,
      border: '3px solid #e8dfd0',
      borderTop: '3px solid #c2602a',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export const AppContext = createContext();
export const useApp = () => useContext(AppContext);

function App() {
  const [user,    setUser]    = useState(null);
  const [cart,    setCart]    = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('admin_token')) setIsAdmin(true);

    // FIX: Wake up Render backend immediately on app load.
    // Render free tier sleeps after inactivity — even with UptimeRobot at 5min,
    // the very first visitor after a deploy or gap could hit a cold start.
    // This silent ping fires as soon as the app mounts so the backend is warm
    // before any page needs it. Uses fetch with keepalive so it doesn't block
    // the render or slow down the page.
    const wakeUpBackend = () => {
      try {
        fetch(`${BACKEND_URL}/health`, {
          method: 'GET',
          keepalive: true,
          // No await — fire and forget, we don't care about the response
        }).catch(() => {
          // Silently ignore — this is just a wake-up ping
        });
      } catch {
        // Silently ignore
      }
    };

    // Delay by 100ms so it runs after first render paints
    const wakeTimer = setTimeout(wakeUpBackend, 100);

    // Firebase lazy init — keeps firebase OUT of initial JS bundle
    let unsubscribe = () => {};

    const initFirebase = async () => {
      await import('./firebase');
      const { getAuth, onAuthStateChanged } = await import('firebase/auth');

      unsubscribe = onAuthStateChanged(getAuth(), async (firebaseUser) => {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          const userData = {
            id:    firebaseUser.uid,
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
    };

    // Defer firebase init by 1 tick so the first render paints immediately
    const firebaseTimer = setTimeout(initFirebase, 0);

    return () => {
      clearTimeout(wakeTimer);
      clearTimeout(firebaseTimer);
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    const { getAuth } = await import('firebase/auth');
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
          <Suspense fallback={<PageLoader />}>
            <Routes>

              {/* ── Public Routes ── */}
              <Route path="/"                            element={<HomePage />} />
              <Route path="/products"                    element={<ProductsPage />} />
              <Route path="/products/:id"                element={<ProductDetailPage />} />
              <Route path="/cart"                        element={<CartPage />} />
              <Route path="/checkout"                    element={<CheckoutPage />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
              <Route path="/orders"                      element={<OrderHistoryPage />} />
              <Route path="/login"                       element={<LoginPage />} />
              <Route path="/about"                       element={<AboutPage />} />
              <Route path="/contact"                     element={<ContactPage />} />

              {/* ── New Routes ── */}
              <Route path="/blog"                        element={<BlogPage />} />
              <Route path="/policies"                    element={<PoliciesPage />} />

              {/* ── Order Tracking ── */}
              <Route path="/track-order"                 element={<OrderTrackingPage />} />
              <Route path="/track-order/:orderId"        element={<OrderTrackingPage />} />

              {/* ── Admin Routes ── */}
              <Route path="/admin/login"      element={<AdminLoginPage />} />
              <Route path="/admin/dashboard"  element={isAdmin ? <AdminDashboardPage /> : <Navigate to="/admin/login" />} />
              <Route path="/admin/products"   element={isAdmin ? <AdminProductsPage />  : <Navigate to="/admin/login" />} />
              <Route path="/admin/orders"     element={isAdmin ? <AdminOrdersPage />    : <Navigate to="/admin/login" />} />
              <Route path="/admin/customers"  element={isAdmin ? <AdminCustomersPage /> : <Navigate to="/admin/login" />} />

            </Routes>
          </Suspense>

          {/* WhatsApp floating button — outside Suspense so it's always visible */}
          <WhatsAppButton />
        </BrowserRouter>

        <Toaster position="top-right" richColors />
      </div>
    </AppContext.Provider>
  );
}

export default App;
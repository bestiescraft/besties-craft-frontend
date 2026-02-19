import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Menu, X, Home, Store } from 'lucide-react';
import { useApp } from '@/App';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const AdminLayout = ({ children }) => {
  const { adminLogout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      adminLogout();
      toast.success('Logged out successfully');
      navigate('/admin/login');
    }
  };

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', testId: 'dashboard-link' },
    { path: '/admin/products',  icon: Package,         label: 'Products',  testId: 'products-link'  },
    { path: '/admin/orders',    icon: ShoppingCart,    label: 'Orders',    testId: 'orders-link'    },
    { path: '/admin/customers', icon: Users,           label: 'Customers', testId: 'customers-link' },
  ];

  const closeSidebar = () => setIsSidebarOpen(false);

  const activeLabel = navItems.find(n => n.path === location.pathname)?.label || 'Admin';

  return (
    <div className="min-h-screen bg-stone-50">

      {/* ── TOP HEADER ── */}
      <header className="sticky top-0 z-40 bg-stone-900 text-white border-b border-stone-800 shadow-lg">
        <div className="px-4 md:px-8 h-16 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 hover:bg-stone-800 rounded-lg transition"
              data-testid="toggle-sidebar-button"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <span className="text-xl select-none">🧶</span>

            <div className="leading-tight">
              <h1 className="text-lg font-serif font-semibold tracking-tight" data-testid="admin-header-title">
                Besties Craft Admin
              </h1>
              {/* Current page hint on small screens */}
              <p className="text-xs text-stone-400 md:hidden">{activeLabel}</p>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="text-white border-stone-600 hover:bg-stone-800 hover:border-stone-500 gap-1.5 text-sm font-semibold"
            data-testid="admin-logout-button"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <div className="flex relative">

        {/* ── MOBILE OVERLAY ── */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 md:hidden z-20 backdrop-blur-sm"
            onClick={closeSidebar}
          />
        )}

        {/* ── SIDEBAR ── */}
        <aside
          className={`
            fixed md:static top-16 left-0
            w-60 bg-stone-900 border-r border-stone-800
            min-h-[calc(100vh-4rem)] flex flex-col
            p-4 z-30 transition-transform duration-300 ease-in-out
            md:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          data-testid="admin-sidebar"
        >
          {/* Sidebar brand (desktop) */}
          <div className="hidden md:flex items-center gap-2.5 px-3 py-3 mb-2 border-b border-stone-800">
            <span className="text-2xl">🧶</span>
            <div>
              <p className="text-white text-sm font-serif font-semibold leading-tight">Besties Craft</p>
              <p className="text-stone-500 text-xs">Admin Panel</p>
            </div>
          </div>

          {/* Nav label */}
          <p className="text-stone-500 text-xs font-bold uppercase tracking-widest px-3 mb-1.5 mt-2">Menu</p>

          {/* Nav items */}
          <nav className="space-y-0.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group
                    ${isActive
                      ? 'bg-terracotta/20 text-white font-semibold'
                      : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                    }
                  `}
                  data-testid={item.testId}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-terracotta' : 'text-stone-500 group-hover:text-stone-300'}`} />
                  <span className="text-sm">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-terracotta flex-shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="border-t border-stone-800 pt-3 mt-4 space-y-0.5">
            <p className="text-stone-500 text-xs font-bold uppercase tracking-widest px-3 mb-1.5">Store</p>

            <Link
              to="/"
              onClick={closeSidebar}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-400 hover:bg-stone-800 hover:text-white transition-all duration-150 group"
              data-testid="back-to-home-link"
            >
              <Home className="w-4 h-4 flex-shrink-0 text-stone-500 group-hover:text-stone-300" />
              <span className="text-sm">Back to Home</span>
            </Link>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-400 hover:bg-stone-800 hover:text-white transition-all duration-150 group"
            >
              <Store className="w-4 h-4 flex-shrink-0 text-stone-500 group-hover:text-stone-300" />
              <span className="text-sm">View Live Store</span>
            </a>

            {/* Logout in sidebar — handy on mobile */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-950/60 hover:text-red-300 transition-all duration-150 mt-1"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-semibold">Logout</span>
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main
          className="flex-1 p-6 md:p-8 w-full overflow-auto"
          data-testid="admin-main-content"
        >
          {children}
        </main>
      </div>
    </div>
  );
};
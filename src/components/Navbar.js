import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useApp } from '@/App';
import { Button } from '@/components/ui/button';
import { CartSidebar } from '@/components/CartSidebar';

const Navbar = () => {
  const { user, cart, logout } = useApp();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const navigate = useNavigate();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-20">

            <Link to="/" className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight">
              Besties Craft
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/products" className="text-stone-600 hover:text-stone-900 font-medium">
                Products
              </Link>

              <Link to="/about" className="text-stone-600 hover:text-stone-900 font-medium">
                About
              </Link>

              <Link to="/contact" className="text-stone-600 hover:text-stone-900 font-medium">
                Contact
              </Link>

              {user && (
                <Link to="/orders" className="text-stone-600 hover:text-stone-900 font-medium">
                  My Orders
                </Link>
              )}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-stone-600 hover:text-stone-900"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>

              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-stone-600">{user.email}</span>
                  <Button onClick={logout} variant="outline" size="sm" className="rounded-full">
                    Logout
                  </Button>
                </div>
              ) : (
                <Button onClick={() => navigate('/login')} className="btn-primary">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-stone-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-stone-200">
              <div className="flex flex-col gap-4">

                <Link to="/products" onClick={() => setIsMenuOpen(false)}>
                  Products
                </Link>

                <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                  About
                </Link>

                <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                  Contact
                </Link>

                {user && (
                  <Link to="/orders" onClick={() => setIsMenuOpen(false)}>
                    My Orders
                  </Link>
                )}

                <button onClick={() => { setIsCartOpen(true); setIsMenuOpen(false); }}>
                  Cart {cartCount > 0 && `(${cartCount})`}
                </button>

                {user ? (
                  <button onClick={() => { logout(); setIsMenuOpen(false); }}>
                    Logout
                  </button>
                ) : (
                  <button onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>
                    Login
                  </button>
                )}

              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export { Navbar };

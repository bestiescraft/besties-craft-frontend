import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-stone-100 border-t border-stone-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-serif font-semibold text-stone-900 mb-4">Besties Craft</h3>
            <p className="text-stone-600 leading-relaxed max-w-md">
              Handmade woollen crochet products crafted with love and care. Each piece is unique and tells its own story.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-stone-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-stone-600 hover:text-stone-900 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-stone-600 hover:text-stone-900 transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-stone-600 hover:text-stone-900 transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-stone-900 mb-4">Admin</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/admin/login" className="text-stone-600 hover:text-stone-900 transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-200 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-stone-600 text-sm flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-terracotta fill-terracotta" /> by Besties Craft
          </p>
          <p className="text-stone-500 text-sm">
            © {new Date().getFullYear()} Besties Craft. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/App';
import { auth } from '@/firebase';
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';
import { toast } from 'sonner';

const ACTION_CODE_SETTINGS = {
  url:             window.location.origin + '/login',
  handleCodeInApp: true,
};

const LoginPage = () => {
  const navigate     = useNavigate();
  const { user }     = useApp();
  const [email,      setEmail]     = useState('');
  const [linkSent,   setLinkSent]  = useState(false);
  const [loading,    setLoading]   = useState(false);
  const [verifying,  setVerifying] = useState(false);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  // Complete sign-in when user returns via the email link
  useEffect(() => {
    if (!isSignInWithEmailLink(auth, window.location.href)) return;
    setVerifying(true);

    let savedEmail = localStorage.getItem('emailForSignIn');
    if (!savedEmail) {
      savedEmail = window.prompt('Please enter the email you used to login:');
    }
    if (!savedEmail) { setVerifying(false); return; }

    setLoading(true);
    signInWithEmailLink(auth, savedEmail, window.location.href)
      .then(() => {
        localStorage.removeItem('emailForSignIn');
        window.history.replaceState({}, document.title, '/login');
        toast.success('Welcome to Besties Craft! ✦');
        navigate('/');
      })
      .catch((err) => {
        console.error(err);
        toast.error('Login link is invalid or expired. Please request a new one.');
        setVerifying(false);
      })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  const sendLoginLink = async () => {
    if (!email.trim()) { toast.error('Please enter your email address'); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { toast.error('Please enter a valid email address'); return; }

    setLoading(true);
    try {
      await sendSignInLinkToEmail(auth, email, ACTION_CODE_SETTINGS);
      localStorage.setItem('emailForSignIn', email);
      setLinkSent(true);
      toast.success('Login link sent! Check your inbox.');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        toast.error('Email link sign-in not enabled in Firebase Console yet.');
      } else {
        toast.error('Failed to send login link. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-3">Verifying your login…</h2>
            <p className="text-stone-500 text-sm">Please wait a moment.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#faf7f2' }}>
      <Navbar />

      <div className="flex-1 py-12 md:py-20 px-6 md:px-12">
        <div className="max-w-xl mx-auto">

          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-stone-900 mb-3">
            Login to Your Account
          </h1>
          <p className="text-stone-500 mb-10 text-base">
            Access your profile, view orders, and manage your account
          </p>

          {/* ── Main login card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 md:p-10 shadow-md border border-stone-100 mb-6"
          >
            {!linkSent ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <span style={{ fontSize: '1.4rem' }}>✉️</span>
                  <h2 className="text-lg font-serif font-semibold text-stone-900">Login with Email</h2>
                </div>
                <p className="text-stone-400 text-sm mb-7">
                  We'll send a secure one-click login link to your inbox — no password needed.
                </p>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-stone-700 font-medium mb-1.5 block">
                      Email Address
                    </Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendLoginLink()}
                        className="pl-12 py-6 text-base"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={sendLoginLink}
                    disabled={loading}
                    className="btn-primary w-full py-6 text-base"
                  >
                    {loading ? 'Sending…' : 'Send Login Link'}
                  </Button>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📬</div>
                <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-3">Check your inbox!</h2>
                <p className="text-stone-500 mb-2">We sent a login link to:</p>
                <p className="text-amber-700 font-semibold text-lg mb-5">{email}</p>
                <p className="text-stone-400 text-sm mb-7 leading-relaxed">
                  Click the link in the email to log in instantly.<br />
                  It expires in 10 minutes. Check your spam folder too.
                </p>
                <button
                  onClick={() => { setLinkSent(false); setEmail(''); }}
                  className="text-stone-400 hover:text-stone-700 text-sm underline transition-colors"
                >
                  Use a different email
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* ── Info cards ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          >
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
              <h3 className="text-base font-semibold text-stone-900 mb-3">Why Login?</h3>
              <ul className="space-y-2 text-stone-600 text-sm">
                <li className="flex items-start gap-2"><span className="text-amber-600 font-bold">✓</span> View your order history</li>
                <li className="flex items-start gap-2"><span className="text-amber-600 font-bold">✓</span> Track your shipments</li>
                <li className="flex items-start gap-2"><span className="text-amber-600 font-bold">✓</span> Faster checkout experience</li>
              </ul>
            </div>
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100">
              <h3 className="text-base font-semibold text-stone-900 mb-3">Security</h3>
              <ul className="space-y-2 text-stone-600 text-sm">
                <li className="flex items-start gap-2"><Lock className="w-4 h-4 text-stone-500 flex-shrink-0 mt-0.5" /> Secure one-click link — no password needed</li>
                <li className="flex items-start gap-2"><Lock className="w-4 h-4 text-stone-500 flex-shrink-0 mt-0.5" /> Powered by Google Firebase</li>
              </ul>
            </div>
          </motion.div>

          {/* ── CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-r from-amber-50 to-stone-50 rounded-2xl p-7 border border-amber-100"
          >
            <h3 className="text-xl font-serif font-semibold text-stone-900 mb-3">Ready to Shop?</h3>
            <p className="text-stone-600 text-sm mb-5">Browse our handmade collection and place your order.</p>
            <Button onClick={() => navigate('/products')} className="btn-primary px-7 py-5 text-base">
              Browse Products
            </Button>
          </motion.div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
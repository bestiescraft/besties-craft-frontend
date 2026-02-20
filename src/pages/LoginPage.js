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

// ── This URL must be added to Firebase Console →
//    Authentication → Settings → Authorised domains
const ACTION_CODE_SETTINGS = {
  url:              window.location.origin + '/login',
  handleCodeInApp:  true,
};

const LoginPage = () => {
  const navigate       = useNavigate();
  const { user }       = useApp();

  const [email,     setEmail]     = useState('');
  const [linkSent,  setLinkSent]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [verifying, setVerifying] = useState(false);

  // ── If user is already logged in, redirect home ──
  useEffect(() => {
    if (user) { navigate('/'); }
  }, [user, navigate]);

  // ── On mount: check if this is the redirect back from the email link ──
  useEffect(() => {
    if (!isSignInWithEmailLink(auth, window.location.href)) return;

    setVerifying(true);

    // Retrieve the email we saved before sending the link
    let savedEmail = localStorage.getItem('emailForSignIn');
    if (!savedEmail) {
      // Edge case: user opened link on a different device/browser
      savedEmail = window.prompt('Please enter the email you used to login:');
    }
    if (!savedEmail) { setVerifying(false); return; }

    setLoading(true);
    signInWithEmailLink(auth, savedEmail, window.location.href)
      .then(() => {
        // App.js onAuthStateChanged will fire and set the user automatically
        localStorage.removeItem('emailForSignIn');
        // Clean the long Firebase URL from the address bar
        window.history.replaceState({}, document.title, '/login');
        toast.success('Login successful! Welcome to Besties Craft ✦');
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
      localStorage.setItem('emailForSignIn', email); // save so we can complete sign-in on return
      setLinkSent(true);
      toast.success('Login link sent! Check your inbox.');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        toast.error('Email link sign-in not enabled. Enable it in Firebase Console → Authentication → Sign-in method → Email/Password → also enable "Email link".');
      } else {
        toast.error('Failed to send login link. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Shown while auto-completing the link on return ──
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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 py-12 md:py-20 px-6 md:px-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-stone-900 mb-4">
            Login to Your Account
          </h1>
          <p className="text-stone-600 mb-12 text-lg">
            Access your profile, view orders, and manage your account
          </p>

          {/* ── Main card ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-stone-100 mb-8">

            {!linkSent ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <span style={{ fontSize: '1.5rem' }}>✉️</span>
                  <h2 className="text-xl font-serif font-semibold text-stone-900">Login with Email</h2>
                </div>
                <p className="text-stone-500 text-sm mb-8">
                  We'll send a secure one-click login link to your email — no password needed.
                </p>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="email" className="text-stone-700 font-medium mb-2 block">Email Address</Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendLoginLink()}
                        className="pl-12 py-6 text-lg"
                        data-testid="login-email-input"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={sendLoginLink}
                    disabled={loading}
                    className="btn-primary w-full py-6 text-lg"
                    data-testid="login-send-otp-button"
                  >
                    {loading ? 'Sending…' : 'Send Login Link'}
                  </Button>
                </div>
              </>
            ) : (
              /* ── Link sent state ── */
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📬</div>
                <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-3">Check your inbox!</h2>
                <p className="text-stone-600 mb-2">We sent a login link to:</p>
                <p className="text-amber-700 font-semibold text-lg mb-6">{email}</p>
                <p className="text-stone-500 text-sm mb-8 leading-relaxed">
                  Click the link in the email to log in instantly.<br />
                  It expires in 10 minutes. Check your spam folder too.
                </p>
                <button
                  onClick={() => { setLinkSent(false); setEmail(''); }}
                  className="text-stone-500 hover:text-stone-800 text-sm underline transition-colors"
                >
                  Use a different email
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* ── Info cards ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="text-lg font-semibold text-stone-900 mb-3">Why Login?</h3>
              <ul className="space-y-2 text-stone-700 text-sm">
                <li className="flex items-start gap-2"><span className="text-amber-600 font-bold">✓</span><span>View your order history</span></li>
                <li className="flex items-start gap-2"><span className="text-amber-600 font-bold">✓</span><span>Track your shipments</span></li>
                <li className="flex items-start gap-2"><span className="text-amber-600 font-bold">✓</span><span>Faster checkout experience</span></li>
              </ul>
            </div>
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
              <h3 className="text-lg font-semibold text-stone-900 mb-3">Security</h3>
              <ul className="space-y-2 text-stone-700 text-sm">
                <li className="flex items-start gap-2"><Lock className="w-5 h-5 text-stone-600 flex-shrink-0 mt-0.5" /><span>Secure one-click link — no password needed</span></li>
                <li className="flex items-start gap-2"><Lock className="w-5 h-5 text-stone-600 flex-shrink-0 mt-0.5" /><span>Powered by Google Firebase</span></li>
              </ul>
            </div>
          </motion.div>

          {/* ── CTA ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-r from-amber-50 to-stone-50 rounded-2xl p-8 border border-amber-200">
            <h3 className="text-2xl font-serif font-semibold text-stone-900 mb-4">Ready to Shop?</h3>
            <p className="text-stone-700 mb-6">Browse our handmade collection and place your order.</p>
            <Button onClick={() => navigate('/checkout')} className="btn-primary px-8 py-6 text-lg" data-testid="login-go-to-checkout-button">
              Go to Checkout & Shop
            </Button>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
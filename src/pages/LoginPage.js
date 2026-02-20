import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, KeyRound } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/App';
import { toast } from 'sonner';

const API_BASE = process.env.REACT_APP_API_URL || 'https://besties-craft-backend-1.onrender.com';

const LoginPage = () => {
  const navigate       = useNavigate();
  const { user, setUser } = useApp();

  const [email,   setEmail]   = useState('');
  const [otp,     setOtp]     = useState('');
  const [step,    setStep]    = useState('email');   // 'email' | 'otp'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  // ── Step 1: Send OTP ──
  const sendOtp = async () => {
    if (!email.trim()) { toast.error('Please enter your email address'); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { toast.error('Please enter a valid email address'); return; }

    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || 'Failed to send OTP');

      setStep('otp');
      toast.success('OTP sent! Check your inbox.');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ──
  const verifyOtp = async () => {
    if (!otp.trim() || otp.length !== 6) { toast.error('Please enter the 6-digit OTP'); return; }

    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim() }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || 'Invalid OTP');

      // Save user to app context + localStorage
      const userData = data.user;
      localStorage.setItem('user',  JSON.stringify(userData));
      localStorage.setItem('token', `otp_${userData.id}`);
      setUser(userData);

      toast.success('Welcome to Besties Craft! ✦');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

          {/* ── Main card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 md:p-10 shadow-md border border-stone-100 mb-6"
          >
            {step === 'email' ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <span style={{ fontSize: '1.4rem' }}>✉️</span>
                  <h2 className="text-lg font-serif font-semibold text-stone-900">Login with Email OTP</h2>
                </div>
                <p className="text-stone-400 text-sm mb-7">
                  We'll send a 6-digit code to your inbox — no password needed.
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
                        onKeyDown={e => e.key === 'Enter' && sendOtp()}
                        className="pl-12 py-6 text-base"
                      />
                    </div>
                  </div>

                  <Button onClick={sendOtp} disabled={loading} className="btn-primary w-full py-6 text-base">
                    {loading ? 'Sending OTP…' : 'Send OTP'}
                  </Button>
                </div>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-2">
                  <span style={{ fontSize: '1.4rem' }}>🔐</span>
                  <h2 className="text-lg font-serif font-semibold text-stone-900">Enter Your OTP</h2>
                </div>
                <p className="text-stone-400 text-sm mb-1">
                  We sent a 6-digit code to:
                </p>
                <p className="text-amber-700 font-semibold mb-7">{email}</p>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="otp" className="text-stone-700 font-medium mb-1.5 block">
                      6-Digit Code
                    </Label>
                    <div className="relative mt-1">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                      <Input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="123456"
                        value={otp}
                        onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                        onKeyDown={e => e.key === 'Enter' && verifyOtp()}
                        className="pl-12 py-6 text-base tracking-widest"
                        autoFocus
                      />
                    </div>
                  </div>

                  <Button onClick={verifyOtp} disabled={loading} className="btn-primary w-full py-6 text-base">
                    {loading ? 'Verifying…' : 'Verify & Login'}
                  </Button>

                  <button
                    onClick={() => { setStep('email'); setOtp(''); }}
                    className="w-full text-stone-400 hover:text-stone-700 text-sm underline transition-colors"
                  >
                    Use a different email
                  </button>

                  <button
                    onClick={sendOtp}
                    disabled={loading}
                    className="w-full text-amber-600 hover:text-amber-800 text-sm underline transition-colors"
                  >
                    Resend OTP
                  </button>
                </div>
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
                <li className="flex items-start gap-2"><span>🔒</span> 6-digit OTP expires in 10 minutes</li>
                <li className="flex items-start gap-2"><span>🔒</span> No password needed</li>
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
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/App';
import { toast } from 'sonner';

const API_BASE = process.env.REACT_APP_API_URL || 'https://besties-craft-backend-1.onrender.com';

const LoginPage = () => {
  const navigate          = useNavigate();
  const { user, setUser } = useApp();

  const [email,     setEmail]     = useState('');
  const [step,      setStep]      = useState('email');  // 'email' | 'otp' | 'done'
  const [otp,       setOtp]       = useState(['', '', '', '', '', '']);
  const [loading,   setLoading]   = useState(false);
  const [resendTimer, setTimer]   = useState(0);

  const inputRefs = useRef([]);

  // If already logged in, go home
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  // Countdown for resend button
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [resendTimer]);

  // ── Step 1: Send OTP via ZeptoMail ──────────────────────
  const sendOTP = async () => {
    if (!email.trim())                        { toast.error('Please enter your email address'); return; }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { toast.error('Please enter a valid email address'); return; }

    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStep('otp');
        setTimer(60);
        toast.success(`OTP sent to ${email}! Check your inbox.`);
        setTimeout(() => inputRefs.current[0]?.focus(), 150);
      } else {
        throw new Error(data.detail || 'Failed to send OTP');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ───────────────────────────────────
  const verifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) { toast.error('Please enter the full 6-digit OTP'); return; }

    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim().toLowerCase(), otp: otpString }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // OTP verified — create user session
        const userData = {
          id:    email.trim().toLowerCase(),
          email: email.trim().toLowerCase(),
          name:  email.split('@')[0],
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        toast.success('Welcome to Besties Craft! ✦');
        navigate('/');
      } else {
        throw new Error(data.detail || 'Incorrect OTP');
      }
    } catch (err) {
      toast.error(err.message || 'OTP verification failed. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input handlers ───────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    // Auto-submit on last digit
    if (index === 5 && value) {
      const full = [...newOtp.slice(0, 5), value].join('');
      if (full.length === 6) setTimeout(verifyOTP, 100);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') verifyOTP();
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    sendOTP();
  };

  // ── Render ───────────────────────────────────────────────
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 md:p-10 shadow-md border border-stone-100 mb-6"
          >

            {/* STEP 1 — Email input */}
            {step === 'email' && (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <span style={{ fontSize: '1.4rem' }}>✉️</span>
                  <h2 className="text-lg font-serif font-semibold text-stone-900">Login with Email</h2>
                </div>
                <p className="text-stone-400 text-sm mb-7">
                  We'll send a 6-digit OTP to your inbox — no password needed.
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
                        onKeyDown={e => e.key === 'Enter' && sendOTP()}
                        className="pl-12 py-6 text-base"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={sendOTP}
                    disabled={loading}
                    className="btn-primary w-full py-6 text-base"
                  >
                    {loading ? 'Sending OTP…' : 'Send OTP'}
                  </Button>
                </div>
              </>
            )}

            {/* STEP 2 — OTP input */}
            {step === 'otp' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span style={{ fontSize: '1.4rem' }}>🔐</span>
                  <h2 className="text-lg font-serif font-semibold text-stone-900">Enter your OTP</h2>
                </div>
                <p className="text-stone-400 text-sm mb-1">
                  We sent a 6-digit code to:
                </p>
                <p className="text-amber-700 font-semibold mb-6">{email}</p>

                {/* OTP boxes */}
                <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => (inputRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      onFocus={e => e.target.select()}
                      style={{
                        width: 48, height: 56, textAlign: 'center',
                        fontSize: '1.4rem', fontWeight: 700,
                        border: `2px solid ${digit ? '#c0556a' : '#e7e5e4'}`,
                        borderRadius: 10, color: '#1c1917',
                        background: '#faf7f2', outline: 'none',
                        fontFamily: 'monospace', transition: 'border-color 0.15s',
                      }}
                    />
                  ))}
                </div>

                <p className="text-stone-400 text-xs text-center mb-5">
                  Code expires in 10 minutes. Check your spam folder too.
                </p>

                <Button
                  onClick={verifyOTP}
                  disabled={loading || otp.join('').length !== 6}
                  className="btn-primary w-full py-6 text-base mb-4"
                >
                  {loading ? 'Verifying…' : 'Verify OTP ✓'}
                </Button>

                {/* Resend + change email */}
                <div className="flex items-center justify-between text-sm">
                  <button
                    onClick={() => { setStep('email'); setOtp(['','','','','','']); }}
                    className="text-stone-400 hover:text-stone-700 underline transition-colors"
                  >
                    ← Change email
                  </button>
                  <button
                    onClick={handleResend}
                    disabled={resendTimer > 0}
                    style={{
                      color: resendTimer > 0 ? '#d4ccc8' : '#c0556a',
                      fontWeight: 700, background: 'none', border: 'none',
                      cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                  </button>
                </div>
              </motion.div>
            )}

          </motion.div>

          {/* ── Info cards ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
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
                <li className="flex items-start gap-2"><Lock className="w-4 h-4 text-stone-500 flex-shrink-0 mt-0.5" /> Secure 6-digit OTP — no password needed</li>
                <li className="flex items-start gap-2"><Lock className="w-4 h-4 text-stone-500 flex-shrink-0 mt-0.5" /> Powered by ZeptoMail</li>
              </ul>
            </div>
          </motion.div>

          {/* ── CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
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
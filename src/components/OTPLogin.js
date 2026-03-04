import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

// ─────────────────────────────────────────────────────────────
// OTPLogin.js
// Drop-in email OTP login component for BestiesCraft.
//
// Usage in LoginPage.js:
//   import OTPLogin from '@/components/OTPLogin';
//   <OTPLogin onSuccess={(email) => { /* log user in */ }} />
//
// Props:
//   onSuccess(email) — called after OTP is verified successfully
// ─────────────────────────────────────────────────────────────

const API_BASE = process.env.REACT_APP_API_URL || 'https://besties-craft-backend-1.onrender.com';

const OTPLogin = ({ onSuccess }) => {
  const [step, setStep]         = useState('email');   // 'email' | 'otp' | 'done'
  const [email, setEmail]       = useState('');
  const [name, setName]         = useState('');
  const [otp, setOtp]           = useState(['', '', '', '', '', '']);
  const [loading, setLoading]   = useState(false);
  const [resendTimer, setTimer] = useState(0);

  const inputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [resendTimer]);

  // ── Step 1: Send OTP ──────────────────────────────────────
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim().toLowerCase(), name: name.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStep('otp');
        setTimer(60);   // 60s before resend allowed
        toast.success(`OTP sent to ${email}! Check your inbox.`);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else {
        throw new Error(data.detail || 'Failed to send OTP');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────
  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter the full 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim().toLowerCase(), otp: otpString }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStep('done');
        toast.success('Verified! Logging you in…');
        onSuccess && onSuccess(email.trim().toLowerCase());
      } else {
        throw new Error(data.detail || 'Incorrect OTP');
      }
    } catch (err) {
      toast.error(err.message || 'OTP verification failed');
      // Clear OTP fields on wrong attempt
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ── OTP box keydown handler ───────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;   // digits only
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);    // one digit per box
    setOtp(newOtp);
    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // Auto-submit when last digit entered
    if (index === 5 && value) {
      const full = [...newOtp.slice(0, 5), value].join('');
      if (full.length === 6) {
        setTimeout(() => handleVerifyOTP(), 100);
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    handleSendOTP({ preventDefault: () => {} });
  };

  // ── Styles ────────────────────────────────────────────────
  const s = {
    wrap: {
      background: '#fff', borderRadius: 20, padding: '2rem',
      border: '1px solid #e8dfd0', boxShadow: '0 4px 24px rgba(44,24,16,0.07)',
      maxWidth: 440, width: '100%', margin: '0 auto', fontFamily: "'Lato', sans-serif",
    },
    title: {
      fontFamily: "'Playfair Display', serif", fontSize: '1.4rem',
      fontWeight: 700, color: '#2c1810', margin: '0 0 0.4rem',
    },
    sub: { fontSize: '0.88rem', color: '#9a8070', margin: '0 0 1.75rem' },
    label: {
      display: 'block', fontSize: '0.8rem', fontWeight: 700,
      color: '#5c3d2e', marginBottom: '0.4rem', letterSpacing: '0.04em',
    },
    input: {
      width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e8dfd0',
      borderRadius: 10, fontSize: '0.9rem', color: '#2c1810',
      background: '#faf7f2', outline: 'none', boxSizing: 'border-box',
      fontFamily: "'Lato', sans-serif",
    },
    btn: {
      width: '100%', padding: '0.9rem', marginTop: '1rem',
      background: 'linear-gradient(135deg,#c0556a,#e8899a)',
      color: '#fff', border: 'none', borderRadius: 12,
      fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
      fontFamily: "'Lato', sans-serif", transition: 'opacity 0.2s',
    },
    otpRow: { display: 'flex', gap: '0.6rem', justifyContent: 'center', margin: '1.5rem 0' },
    otpBox: {
      width: 48, height: 56, textAlign: 'center', fontSize: '1.4rem', fontWeight: 700,
      border: '2px solid #e8dfd0', borderRadius: 10, color: '#2c1810',
      background: '#faf7f2', outline: 'none', fontFamily: 'monospace',
      transition: 'border-color 0.15s',
    },
    back: {
      background: 'none', border: 'none', color: '#9a8070',
      fontSize: '0.85rem', cursor: 'pointer', marginTop: '0.75rem',
      display: 'block', width: '100%', textAlign: 'center',
    },
    resend: {
      background: 'none', border: 'none', fontSize: '0.85rem', cursor: 'pointer',
      color: resendTimer > 0 ? '#ccc' : '#c0556a',
      fontWeight: 700, padding: 0,
    },
  };

  return (
    <div style={s.wrap}>
      {step === 'email' && (
        <>
          <h2 style={s.title}>Login to BestiesCraft 🎀</h2>
          <p style={s.sub}>Enter your email — we'll send you a one-time code.</p>
          <form onSubmit={handleSendOTP}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={s.label} htmlFor="otp-name">Your Name (optional)</label>
              <input
                style={s.input} id="otp-name" type="text"
                placeholder="Your name" value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={s.label} htmlFor="otp-email">Email Address *</label>
              <input
                style={s.input} id="otp-email" type="email" required
                placeholder="your@email.com" value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <button style={{ ...s.btn, opacity: loading ? 0.6 : 1 }} type="submit" disabled={loading}>
              {loading ? 'Sending OTP…' : 'Send OTP →'}
            </button>
          </form>
        </>
      )}

      {step === 'otp' && (
        <>
          <h2 style={s.title}>Check your email 📧</h2>
          <p style={s.sub}>
            We sent a 6-digit code to <strong>{email}</strong>.<br />
            Enter it below. It expires in 10 minutes.
          </p>

          <div style={s.otpRow}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => (inputRefs.current[i] = el)}
                style={{
                  ...s.otpBox,
                  borderColor: digit ? '#c0556a' : '#e8dfd0',
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(i, e)}
                onFocus={e => e.target.select()}
              />
            ))}
          </div>

          <button
            style={{ ...s.btn, opacity: loading ? 0.6 : 1 }}
            onClick={handleVerifyOTP}
            disabled={loading || otp.join('').length !== 6}
          >
            {loading ? 'Verifying…' : 'Verify OTP ✓'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#9a8070' }}>Didn't get it? </span>
            <button style={s.resend} onClick={handleResend} disabled={resendTimer > 0}>
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
            </button>
          </div>

          <button style={s.back} onClick={() => { setStep('email'); setOtp(['','','','','','']); }}>
            ← Change email
          </button>
        </>
      )}

      {step === 'done' && (
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <h2 style={{ ...s.title, textAlign: 'center' }}>You're logged in!</h2>
          <p style={{ ...s.sub, textAlign: 'center' }}>Welcome back to BestiesCraft 🎀</p>
        </div>
      )}
    </div>
  );
};

export default OTPLogin;
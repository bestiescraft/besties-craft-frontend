import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, Lock } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useApp } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useApp();
  const [loginType, setLoginType] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      toast.info('You are already logged in!');
      navigate('/');
    }
  }, [user, navigate]);

  const sendOTP = async () => {
    if (loginType === 'email') {
      if (!email) {
        toast.error('Please enter your email');
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        toast.error('Please enter a valid email');
        return;
      }
    } else {
      if (!phone) {
        toast.error('Please enter your phone number');
        return;
      }
      if (!/^\d{10}$/.test(phone)) {
        toast.error('Please enter a valid 10-digit phone number');
        return;
      }
    }

    setLoading(true);
    try {
      const payload = loginType === 'email' ? { email } : { phone };
      await axios.post(`${API}/auth/send-otp`, payload);
      setOtpSent(true);
      toast.success(`OTP sent to your ${loginType}!`);
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const payload = loginType === 'email' 
        ? { email, otp }
        : { phone, otp };
      
      const response = await axios.post(`${API}/auth/verify-otp`, payload);
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-stone-100 mb-8"
          >
            <p className="text-stone-600 mb-8">We'll send you an OTP to verify your identity</p>

            {/* Toggle Buttons for Email/Phone Selection */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => {
                  setLoginType('email');
                  setEmail('');
                  setPhone('');
                  setOtp('');
                  setOtpSent(false);
                }}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                  loginType === 'email'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                📧 Email
              </button>
              <button
                onClick={() => {
                  setLoginType('phone');
                  setEmail('');
                  setPhone('');
                  setOtp('');
                  setOtpSent(false);
                }}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                  loginType === 'phone'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                📱 Phone
              </button>
            </div>

            {!otpSent ? (
              <div className="space-y-6">
                {/* Email Input - Show only when Email is selected */}
                {loginType === 'email' && (
                  <div>
                    <Label htmlFor="email" className="text-stone-700 font-medium mb-2">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 py-6 text-lg"
                        data-testid="login-email-input"
                      />
                    </div>
                  </div>
                )}

                {/* Phone Input - Show only when Phone is selected */}
                {loginType === 'phone' && (
                  <div>
                    <Label htmlFor="phone" className="text-stone-700 font-medium mb-2">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="10-digit phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        maxLength={10}
                        className="pl-12 py-6 text-lg"
                        data-testid="login-phone-input"
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={sendOTP}
                  disabled={loading}
                  className="btn-primary w-full py-6 text-lg"
                  data-testid="login-send-otp-button"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <Label className="text-stone-700 font-medium mb-4 block">Enter 6-digit OTP</Label>
                  <p className="text-stone-600 text-sm mb-4">OTP sent to your {loginType}</p>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp} data-testid="login-otp-input">
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="w-14 h-14 text-xl" />
                        <InputOTPSlot index={1} className="w-14 h-14 text-xl" />
                        <InputOTPSlot index={2} className="w-14 h-14 text-xl" />
                        <InputOTPSlot index={3} className="w-14 h-14 text-xl" />
                        <InputOTPSlot index={4} className="w-14 h-14 text-xl" />
                        <InputOTPSlot index={5} className="w-14 h-14 text-xl" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <Button
                  onClick={verifyOTP}
                  disabled={loading || otp.length !== 6}
                  className="btn-primary w-full py-6 text-lg"
                  data-testid="login-verify-otp-button"
                >
                  {loading ? 'Verifying...' : 'Verify OTP & Login'}
                </Button>

                <button
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                  }}
                  className="w-full text-center text-stone-600 hover:text-stone-900 transition-colors"
                  data-testid="login-change-details-button"
                >
                  Change Email/Phone
                </button>
              </div>
            )}
          </motion.div>

          {/* Additional Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="text-lg font-semibold text-stone-900 mb-3">Why Login?</h3>
              <ul className="space-y-2 text-stone-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">✓</span>
                  <span>View your order history</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">✓</span>
                  <span>Track your shipments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">✓</span>
                  <span>Faster checkout experience</span>
                </li>
              </ul>
            </div>

            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
              <h3 className="text-lg font-semibold text-stone-900 mb-3">Security</h3>
              <ul className="space-y-2 text-stone-700 text-sm">
                <li className="flex items-start gap-2">
                  <Lock className="w-5 h-5 text-stone-600 flex-shrink-0 mt-0.5" />
                  <span>OTP verification via email or phone</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lock className="w-5 h-5 text-stone-600 flex-shrink-0 mt-0.5" />
                  <span>End-to-end encrypted connection</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Checkout Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-r from-amber-50 to-stone-50 rounded-2xl p-8 border border-amber-200"
          >
            <h3 className="text-2xl font-serif font-semibold text-stone-900 mb-4">
              Ready to Shop?
            </h3>
            <p className="text-stone-700 mb-6">
              Proceed to checkout to browse our handmade collection and place your order.
            </p>
            <Button
              onClick={() => navigate('/checkout')}
              className="btn-primary px-8 py-6 text-lg"
              data-testid="login-go-to-checkout-button"
            >
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

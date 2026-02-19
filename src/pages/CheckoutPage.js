import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, Lock, MapPin, User } from 'lucide-react';
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

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, setUser, cart, setCart } = useApp();
  const [step, setStep] = useState(user ? 'shipping' : 'login');
  const [loginType, setLoginType] = useState('email'); // Toggle between 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Shipping Details State
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const [shippingErrors, setShippingErrors] = useState({});

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
      setStep('shipping');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateShippingDetails = () => {
    const errors = {};

    if (!shippingDetails.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!shippingDetails.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(shippingDetails.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!shippingDetails.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(shippingDetails.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!shippingDetails.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!shippingDetails.city.trim()) {
      errors.city = 'City is required';
    }

    if (!shippingDetails.state.trim()) {
      errors.state = 'State is required';
    }

    if (!shippingDetails.postalCode.trim()) {
      errors.postalCode = 'Postal code is required';
    } else if (!/^\d{6}$/.test(shippingDetails.postalCode)) {
      errors.postalCode = 'Please enter a valid 6-digit postal code';
    }

    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleShippingChange = (field, value) => {
    setShippingDetails(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field when user starts typing
    if (shippingErrors[field]) {
      setShippingErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleContinueToPayment = () => {
    if (validateShippingDetails()) {
      setStep('payment');
      toast.success('Shipping details saved!');
    } else {
      toast.error('Please fill in all required fields correctly');
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setProcessingPayment(true);

    try {
      const token = localStorage.getItem('token');
      const orderItems = cart.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price
      }));
      const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const orderResponse = await axios.post(
        `${API}/orders/create`,
        {
          user_id: user.id,
          items: orderItems,
          total_amount: totalAmount,
          shipping_details: shippingDetails
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const { order, razorpay_order } = orderResponse.data;

      if (!razorpay_order) {
        toast.error('Payment gateway not configured. Please contact admin.');
        setProcessingPayment(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        setProcessingPayment(false);
        return;
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || '',
        amount: razorpay_order.amount,
        currency: 'INR',
        name: 'Besties Craft',
        description: 'Handmade Woollen Crochet Products',
        order_id: razorpay_order.id,
        handler: async (response) => {
          try {
            await axios.post(`${API}/orders/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order.id
            });

            setCart([]);
            toast.success('Payment successful!');
            navigate(`/order-confirmation/${order.id}`);
          } catch (error) {
            toast.error('Payment verification failed');
          } finally {
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: shippingDetails.fullName,
          email: shippingDetails.email,
          contact: shippingDetails.phone
        },
        theme: {
          color: '#D97706'
        },
        modal: {
          ondismiss: () => {
            setProcessingPayment(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error('Failed to process payment');
      setProcessingPayment(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="py-12 md:py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-stone-900 mb-12" data-testid="checkout-title">
            Checkout
          </h1>

          {step === 'login' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-stone-100"
            >
              <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-6" data-testid="login-section-title">
                Login to Continue
              </h2>
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
                          data-testid="email-input"
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
                          data-testid="phone-input"
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={sendOTP}
                    disabled={loading}
                    className="btn-primary w-full py-6 text-lg"
                    data-testid="send-otp-button"
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
                      <InputOTP maxLength={6} value={otp} onChange={setOtp} data-testid="otp-input">
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
                    data-testid="verify-otp-button"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </Button>

                  <button
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                    }}
                    className="w-full text-center text-stone-600 hover:text-stone-900 transition-colors"
                    data-testid="change-details-button"
                  >
                    Change Email/Phone
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {step === 'shipping' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-stone-100"
            >
              <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-2" data-testid="shipping-section-title">
                Shipping Address
              </h2>
              <p className="text-stone-600 mb-8">Please enter your delivery address</p>

              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <Label htmlFor="fullName" className="text-stone-700 font-medium mb-2">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={shippingDetails.fullName}
                      onChange={(e) => handleShippingChange('fullName', e.target.value)}
                      className="pl-12 py-6 text-lg"
                      data-testid="full-name-input"
                    />
                  </div>
                  {shippingErrors.fullName && <p className="text-red-600 text-sm mt-2">{shippingErrors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="shippingEmail" className="text-stone-700 font-medium mb-2">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                    <Input
                      id="shippingEmail"
                      type="email"
                      placeholder="your@email.com"
                      value={shippingDetails.email}
                      onChange={(e) => handleShippingChange('email', e.target.value)}
                      className="pl-12 py-6 text-lg"
                      data-testid="shipping-email-input"
                    />
                  </div>
                  {shippingErrors.email && <p className="text-red-600 text-sm mt-2">{shippingErrors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="shippingPhone" className="text-stone-700 font-medium mb-2">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                    <Input
                      id="shippingPhone"
                      type="tel"
                      placeholder="10-digit phone number"
                      value={shippingDetails.phone}
                      onChange={(e) => handleShippingChange('phone', e.target.value)}
                      maxLength={10}
                      className="pl-12 py-6 text-lg"
                      data-testid="shipping-phone-input"
                    />
                  </div>
                  {shippingErrors.phone && <p className="text-red-600 text-sm mt-2">{shippingErrors.phone}</p>}
                </div>

                {/* Address */}
                <div>
                  <Label htmlFor="address" className="text-stone-700 font-medium mb-2">Street Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-6 text-stone-400 w-5 h-5" />
                    <Input
                      id="address"
                      type="text"
                      placeholder="Enter your street address"
                      value={shippingDetails.address}
                      onChange={(e) => handleShippingChange('address', e.target.value)}
                      className="pl-12 py-6 text-lg"
                      data-testid="address-input"
                    />
                  </div>
                  {shippingErrors.address && <p className="text-red-600 text-sm mt-2">{shippingErrors.address}</p>}
                </div>

                {/* City */}
                <div>
                  <Label htmlFor="city" className="text-stone-700 font-medium mb-2">City *</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Enter your city"
                    value={shippingDetails.city}
                    onChange={(e) => handleShippingChange('city', e.target.value)}
                    className="py-6 text-lg"
                    data-testid="city-input"
                  />
                  {shippingErrors.city && <p className="text-red-600 text-sm mt-2">{shippingErrors.city}</p>}
                </div>

                {/* State */}
                <div>
                  <Label htmlFor="state" className="text-stone-700 font-medium mb-2">State *</Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder="Enter your state"
                    value={shippingDetails.state}
                    onChange={(e) => handleShippingChange('state', e.target.value)}
                    className="py-6 text-lg"
                    data-testid="state-input"
                  />
                  {shippingErrors.state && <p className="text-red-600 text-sm mt-2">{shippingErrors.state}</p>}
                </div>

                {/* Postal Code */}
                <div>
                  <Label htmlFor="postalCode" className="text-stone-700 font-medium mb-2">Postal Code (6-digit) *</Label>
                  <Input
                    id="postalCode"
                    type="tel"
                    placeholder="Enter 6-digit postal code"
                    value={shippingDetails.postalCode}
                    onChange={(e) => handleShippingChange('postalCode', e.target.value)}
                    maxLength={6}
                    className="py-6 text-lg"
                    data-testid="postal-code-input"
                  />
                  {shippingErrors.postalCode && <p className="text-red-600 text-sm mt-2">{shippingErrors.postalCode}</p>}
                </div>

                {/* Country */}
                <div>
                  <Label htmlFor="country" className="text-stone-700 font-medium mb-2">Country</Label>
                  <Input
                    id="country"
                    type="text"
                    value={shippingDetails.country}
                    disabled
                    className="py-6 text-lg bg-stone-100 cursor-not-allowed"
                    data-testid="country-input"
                  />
                </div>

                <Button
                  onClick={handleContinueToPayment}
                  className="btn-primary w-full py-6 text-lg"
                  data-testid="continue-to-payment-button"
                >
                  Continue to Payment
                </Button>

                <button
                  onClick={() => setStep('login')}
                  className="w-full text-center text-stone-600 hover:text-stone-900 transition-colors"
                  data-testid="back-to-login-button"
                >
                  Back to Login
                </button>
              </div>
            </motion.div>
          )}

          {step === 'payment' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-stone-100">
                  <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-6">Order Items</h2>
                  <div className="space-y-4" data-testid="checkout-items">
                    {cart.map((item, index) => (
                      <div key={item.product_id} className="flex items-center gap-4 pb-4 border-b border-stone-100 last:border-0" data-testid={`checkout-item-${index}`}>
                        <img src={item.image_url} alt={item.product_name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                          <h3 className="font-medium text-stone-900">{item.product_name}</h3>
                          <p className="text-sm text-stone-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-stone-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg border border-stone-100">
                  <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-6">Delivery Address</h2>
                  <div className="space-y-2 text-stone-700">
                    <p className="font-semibold">{shippingDetails.fullName}</p>
                    <p>{shippingDetails.address}</p>
                    <p>{shippingDetails.city}, {shippingDetails.state} {shippingDetails.postalCode}</p>
                    <p>{shippingDetails.country}</p>
                    <p className="text-sm pt-4">📧 {shippingDetails.email}</p>
                    <p className="text-sm">📱 {shippingDetails.phone}</p>
                  </div>
                  <button
                    onClick={() => setStep('shipping')}
                    className="mt-6 text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                    data-testid="edit-address-button"
                  >
                    Edit Address
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-stone-100 rounded-2xl p-8 sticky top-24">
                  <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-6">Payment Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-stone-600">
                      <span>Subtotal</span>
                      <span data-testid="payment-subtotal">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-stone-300 pt-4">
                      <div className="flex justify-between text-stone-900 text-xl font-semibold">
                        <span>Total</span>
                        <span data-testid="payment-total">₹{subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={processingPayment || cart.length === 0}
                    className="btn-primary w-full py-6 text-lg"
                    data-testid="pay-now-button"
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    {processingPayment ? 'Processing...' : 'Pay Now'}
                  </Button>

                  <p className="text-center text-sm text-stone-600 mt-4">
                    Secured by Razorpay
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;

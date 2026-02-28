import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, MapPin, User, Phone, Truck, Loader } from 'lucide-react';
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
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PLACEHOLDER_IMG = 'https://placehold.co/64x64/e8e0d5/a09080?text=Item';
const FALLBACK_SHIPPING = 60;

const getItemImage = (item) => {
  const url = item.image || item.image_url || '';
  if (!url) return PLACEHOLDER_IMG;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BACKEND_URL}${url}`;
};

const ACTION_CODE_SETTINGS = {
  url:             window.location.origin + '/checkout',
  handleCodeInApp: true,
};

const CheckoutPage = () => {
  const navigate                        = useNavigate();
  const { user, setUser, cart, setCart } = useApp();

  const [step,              setStep]              = useState(user ? 'shipping' : 'login');
  const [email,             setEmail]             = useState('');
  const [linkSent,          setLinkSent]          = useState(false);
  const [loading,           setLoading]           = useState(false);
  const [verifying,         setVerifying]         = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const [shippingCost,    setShippingCost]    = useState(null);
  const [shippingCourier, setShippingCourier] = useState('');
  const [shippingEtd,     setShippingEtd]     = useState('');
  const [fetchingRate,    setFetchingRate]    = useState(false);
  const [rateError,       setRateError]       = useState('');

  const [shippingDetails, setShippingDetails] = useState({
    fullName: '', email: '', phone: '',
    address: '', city: '', state: '',
    postalCode: '', country: 'India',
  });
  const [shippingErrors, setShippingErrors] = useState({});

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    if (user && step === 'login') setStep('shipping');
  }, [user]); // eslint-disable-line

  useEffect(() => {
    if (!isSignInWithEmailLink(auth, window.location.href)) return;
    setVerifying(true);
    let savedEmail = localStorage.getItem('emailForSignIn');
    if (!savedEmail) savedEmail = window.prompt('Please enter the email you used to login:');
    if (!savedEmail) { setVerifying(false); return; }
    setLoading(true);
    signInWithEmailLink(auth, savedEmail, window.location.href)
      .then(async (result) => {
        localStorage.removeItem('emailForSignIn');
        window.history.replaceState({}, document.title, '/checkout');
        const firebaseUser = result.user;
        const token        = await firebaseUser.getIdToken();
        const userData     = {
          id:    firebaseUser.uid,
          email: firebaseUser.email,
          name:  firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Customer',
        };
        localStorage.setItem('token', token);
        localStorage.setItem('user',  JSON.stringify(userData));
        setUser(userData);
        toast.success('Login successful! Now fill in your shipping details.');
        setStep('shipping');
      })
      .catch((err) => {
        console.error(err);
        toast.error('Login link is invalid or expired. Please request a new one.');
      })
      .finally(() => { setLoading(false); setVerifying(false); });
  }, []); // eslint-disable-line

  const fetchShippingRate = useCallback(async (pincode) => {
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      setShippingCost(null);
      setRateError('');
      return;
    }
    setFetchingRate(true);
    setRateError('');
    setShippingCost(null);
    setShippingCourier('');
    setShippingEtd('');
    try {
      const res = await axios.post(`${API}/shipping-rates`, {
        delivery_pincode: pincode,
        cart_items: cart.map(i => ({
          product_id: i.product_id,
          quantity:   i.quantity,
        })),
      }, { timeout: 15000 });
      const data = res.data;
      setShippingCost(data.shipping_cost ?? FALLBACK_SHIPPING);
      setShippingCourier(data.courier || '');
      setShippingEtd(data.etd || '');
      if (!data.success) {
        setRateError(data.message || '');
      }
    } catch (err) {
      console.error('Shipping rate fetch error:', err);
      setShippingCost(FALLBACK_SHIPPING);
      setRateError('Could not fetch live rates. Flat ₹60 applied.');
    } finally {
      setFetchingRate(false);
    }
  }, [cart]);

  useEffect(() => {
    const pincode = shippingDetails.postalCode;
    if (/^\d{6}$/.test(pincode)) {
      fetchShippingRate(pincode);
    } else {
      setShippingCost(null);
      setShippingCourier('');
      setShippingEtd('');
      setRateError('');
    }
  }, [shippingDetails.postalCode, fetchShippingRate]);

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
        toast.error('Email link sign-in not enabled in Firebase Console.');
      } else {
        toast.error('Failed to send login link. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const validateShipping = () => {
    const errors = {};
    if (!shippingDetails.fullName.trim())                             errors.fullName   = 'Full name is required';
    if (!shippingDetails.email.trim())                                errors.email      = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(shippingDetails.email))          errors.email      = 'Please enter a valid email';
    if (!shippingDetails.phone.trim())                                errors.phone      = 'Phone number is required';
    else if (!/^\d{10}$/.test(shippingDetails.phone))                 errors.phone      = 'Please enter a valid 10-digit phone number';
    if (!shippingDetails.address.trim())                              errors.address    = 'Address is required';
    if (!shippingDetails.city.trim())                                 errors.city       = 'City is required';
    if (!shippingDetails.state.trim())                                errors.state      = 'State is required';
    if (!shippingDetails.postalCode.trim())                           errors.postalCode = 'Postal code is required';
    else if (!/^\d{6}$/.test(shippingDetails.postalCode))             errors.postalCode = 'Please enter a valid 6-digit postal code';
    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleShippingChange = (field, value) => {
    setShippingDetails(prev => ({ ...prev, [field]: value }));
    if (shippingErrors[field]) setShippingErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleContinueToPayment = () => {
    if (!validateShipping()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }
    if (fetchingRate) {
      toast.info('Fetching shipping rate, please wait a moment…');
      return;
    }
    if (shippingCost === null) {
      setShippingCost(FALLBACK_SHIPPING);
    }
    setStep('payment');
    toast.success('Shipping details saved!');
  };

  const loadRazorpayScript = () => new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src     = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

  const handlePayment = async () => {
    if (cart.length === 0) { toast.error('Your cart is empty'); return; }
    setProcessingPayment(true);

    let razorpayOrderId = null;

    try {
      const token       = localStorage.getItem('token');
      const subtotal    = cart.reduce((s, i) => s + i.price * i.quantity, 0);
      const shipping    = shippingCost ?? FALLBACK_SHIPPING;
      const totalAmount = subtotal + shipping;

      const orderResponse = await axios.post(
        `${API}/orders/create`,
        {
          user_id:  user.id,
          items:    cart.map(i => ({
            product_id:    i.product_id,
            product_name:  i.product_name,
            quantity:      i.quantity,
            price:         i.price,
            color:         i.color         || null,
            customisation: i.customisation || null,
          })),
          total_amount:     totalAmount,
          shipping_details: shippingDetails,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { razorpay_order } = orderResponse.data;

      if (!razorpay_order) {
        toast.error('Payment gateway not configured. Please contact admin.');
        setProcessingPayment(false);
        return;
      }

      razorpayOrderId = razorpay_order.id;

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        setProcessingPayment(false);
        return;
      }

      const options = {
        key:         process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount:      razorpay_order.amount,
        currency:    'INR',
        name:        'Besties Craft',
        description: 'Handmade Products',
        order_id:    razorpay_order.id,

        handler: async (response) => {
          try {
            const verifyRes = await axios.post(`${API}/orders/verify-payment`, {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            const confirmedOrderId = verifyRes.data.order_id;
            setCart([]);
            toast.success('Payment successful! 🎉');
            navigate(`/order-confirmation/${confirmedOrderId}`);
          } catch (err) {
            console.error('Payment verification failed:', err);
            toast.error('Payment verification failed. Please contact support.');
          } finally {
            setProcessingPayment(false);
          }
        },

        prefill: {
          name:    shippingDetails.fullName,
          email:   shippingDetails.email,
          contact: shippingDetails.phone,
        },
        theme: { color: '#c2602a' },

        modal: {
          ondismiss: async () => {
            try {
              await axios.post(`${API}/orders/cancel-pending`, {
                razorpay_order_id: razorpayOrderId
              });
            } catch (e) {
              console.warn('Cancel cleanup failed:', e);
            }
            toast.info('Payment cancelled.');
            setProcessingPayment(false);
          }
        },
      };

      new window.Razorpay(options).open();

    } catch (err) {
      console.error('Payment error:', err);
      if (razorpayOrderId) {
        try {
          await axios.post(`${API}/orders/cancel-pending`, { razorpay_order_id: razorpayOrderId });
        } catch (e) { /* ignore */ }
      }
      toast.error('Failed to process payment. Please try again.');
      setProcessingPayment(false);
    }
  };

  const subtotal      = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const finalShipping = shippingCost ?? 0;
  const total         = subtotal + finalShipping;

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

      <div className="py-12 md:py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-stone-900 mb-12" data-testid="checkout-title">
            Checkout
          </h1>

          {/* ════════ STEP: LOGIN ════════ */}
          {step === 'login' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-stone-100">
              <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-2" data-testid="login-section-title">
                Login to Continue
              </h2>
              {!linkSent ? (
                <>
                  <p className="text-stone-500 text-sm mb-8">
                    We'll send a secure one-click login link to your email — no password needed.
                  </p>
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="checkout-email" className="text-stone-700 font-medium mb-2 block">Email Address</Label>
                      <div className="relative mt-1.5">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                        <Input id="checkout-email" type="email" placeholder="your@email.com" value={email}
                          onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendLoginLink()}
                          className="pl-12 py-6 text-lg" data-testid="email-input" />
                      </div>
                    </div>
                    <Button onClick={sendLoginLink} disabled={loading} className="btn-primary w-full py-6 text-lg" data-testid="send-otp-button">
                      {loading ? 'Sending…' : 'Send Login Link'}
                    </Button>
                  </div>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                  <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📬</div>
                  <h3 className="text-xl font-serif font-semibold text-stone-900 mb-3">Check your inbox!</h3>
                  <p className="text-stone-600 mb-2">We sent a login link to:</p>
                  <p className="text-amber-700 font-semibold text-lg mb-6">{email}</p>
                  <p className="text-stone-500 text-sm mb-8 leading-relaxed">
                    Click the link in the email to continue checkout.<br />
                    It expires in 10 minutes. Check your spam folder too.
                  </p>
                  <button onClick={() => { setLinkSent(false); setEmail(''); }}
                    className="text-stone-500 hover:text-stone-800 text-sm underline transition-colors">
                    Use a different email
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ════════ STEP: SHIPPING ════════ */}
          {step === 'shipping' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-stone-100">
              <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-2" data-testid="shipping-section-title">Shipping Address</h2>
              <p className="text-stone-600 mb-8">Please enter your delivery address</p>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="fullName" className="text-stone-700 font-medium mb-2">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                    <Input id="fullName" type="text" placeholder="Enter your full name"
                      value={shippingDetails.fullName} onChange={e => handleShippingChange('fullName', e.target.value)}
                      className="pl-12 py-6 text-lg" data-testid="full-name-input" />
                  </div>
                  {shippingErrors.fullName && <p className="text-red-600 text-sm mt-2">{shippingErrors.fullName}</p>}
                </div>
                <div>
                  <Label htmlFor="shippingEmail" className="text-stone-700 font-medium mb-2">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                    <Input id="shippingEmail" type="email" placeholder="your@email.com"
                      value={shippingDetails.email} onChange={e => handleShippingChange('email', e.target.value)}
                      className="pl-12 py-6 text-lg" data-testid="shipping-email-input" />
                  </div>
                  {shippingErrors.email && <p className="text-red-600 text-sm mt-2">{shippingErrors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="shippingPhone" className="text-stone-700 font-medium mb-2">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                    <Input id="shippingPhone" type="tel" placeholder="10-digit phone number"
                      value={shippingDetails.phone} onChange={e => handleShippingChange('phone', e.target.value)}
                      maxLength={10} className="pl-12 py-6 text-lg" data-testid="shipping-phone-input" />
                  </div>
                  {shippingErrors.phone && <p className="text-red-600 text-sm mt-2">{shippingErrors.phone}</p>}
                </div>
                <div>
                  <Label htmlFor="address" className="text-stone-700 font-medium mb-2">Street Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                    <Input id="address" type="text" placeholder="Enter your street address"
                      value={shippingDetails.address} onChange={e => handleShippingChange('address', e.target.value)}
                      className="pl-12 py-6 text-lg" data-testid="address-input" />
                  </div>
                  {shippingErrors.address && <p className="text-red-600 text-sm mt-2">{shippingErrors.address}</p>}
                </div>
                <div>
                  <Label htmlFor="city" className="text-stone-700 font-medium mb-2">City *</Label>
                  <Input id="city" type="text" placeholder="Enter your city"
                    value={shippingDetails.city} onChange={e => handleShippingChange('city', e.target.value)}
                    className="py-6 text-lg" data-testid="city-input" />
                  {shippingErrors.city && <p className="text-red-600 text-sm mt-2">{shippingErrors.city}</p>}
                </div>
                <div>
                  <Label htmlFor="state" className="text-stone-700 font-medium mb-2">State *</Label>
                  <Input id="state" type="text" placeholder="Enter your state"
                    value={shippingDetails.state} onChange={e => handleShippingChange('state', e.target.value)}
                    className="py-6 text-lg" data-testid="state-input" />
                  {shippingErrors.state && <p className="text-red-600 text-sm mt-2">{shippingErrors.state}</p>}
                </div>

                <div>
                  <Label htmlFor="postalCode" className="text-stone-700 font-medium mb-2">Postal Code (6-digit) *</Label>
                  <Input id="postalCode" type="tel" placeholder="Enter 6-digit postal code"
                    value={shippingDetails.postalCode} onChange={e => handleShippingChange('postalCode', e.target.value)}
                    maxLength={6} className="py-6 text-lg" data-testid="postal-code-input" />
                  {shippingErrors.postalCode && <p className="text-red-600 text-sm mt-2">{shippingErrors.postalCode}</p>}

                  {/^\d{6}$/.test(shippingDetails.postalCode) && (
                    <div className="mt-3">
                      {fetchingRate && (
                        <div className="flex items-center gap-2 text-sm text-stone-500">
                          <Loader size={14} className="animate-spin" />
                          Fetching live shipping rate…
                        </div>
                      )}
                      {!fetchingRate && shippingCost !== null && (
                        <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg w-fit
                          ${rateError ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                          <Truck size={14} />
                          {rateError
                            ? `⚠ ${rateError}`
                            : `₹${shippingCost}${shippingCourier ? ` via ${shippingCourier}` : ''}${shippingEtd ? ` · Est: ${shippingEtd}` : ''}`
                          }
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="country" className="text-stone-700 font-medium mb-2">Country</Label>
                  <Input id="country" type="text" value="India" disabled className="py-6 text-lg bg-stone-100 cursor-not-allowed" data-testid="country-input" />
                </div>

                <Button onClick={handleContinueToPayment} disabled={fetchingRate}
                  className="btn-primary w-full py-6 text-lg" data-testid="continue-to-payment-button">
                  {fetchingRate ? 'Calculating shipping…' : 'Continue to Payment'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* ════════ STEP: PAYMENT ════════ */}
          {step === 'payment' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-stone-100">
                  <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-6">Order Items</h2>
                  <div className="space-y-4" data-testid="checkout-items">
                    {cart.map((item, index) => (
                      <div key={`${item.product_id}-${index}`}
                        className="flex items-center gap-4 pb-4 border-b border-stone-100 last:border-0"
                        data-testid={`checkout-item-${index}`}>
                        <img src={getItemImage(item)} alt={item.product_name || 'Product'}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-stone-100"
                          onError={e => { e.target.src = PLACEHOLDER_IMG; }} />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-stone-900 truncate">{item.product_name}</h3>
                          {item.color && <p className="text-xs text-stone-500">Colour: {item.color}</p>}
                          {item.customisation && <p className="text-xs text-amber-700 mt-0.5 truncate">✎ {item.customisation}</p>}
                          <p className="text-sm text-stone-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-stone-900 flex-shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg border border-stone-100">
                  <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-6">Delivery Address</h2>
                  <div className="space-y-1 text-stone-700">
                    <p className="font-semibold">{shippingDetails.fullName}</p>
                    <p>{shippingDetails.address}</p>
                    <p>{shippingDetails.city}, {shippingDetails.state} {shippingDetails.postalCode}</p>
                    <p>{shippingDetails.country}</p>
                    <p className="text-sm pt-3">📧 {shippingDetails.email}</p>
                    <p className="text-sm">📱 {shippingDetails.phone}</p>
                  </div>
                  <button onClick={() => setStep('shipping')}
                    className="mt-6 text-amber-600 hover:text-amber-700 font-semibold transition-colors text-sm"
                    data-testid="edit-address-button">
                    Edit Address
                  </button>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <div className="bg-stone-100 rounded-2xl p-8 sticky top-24">
                  <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-6">Payment Summary</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-stone-600">
                      <span>Subtotal</span>
                      <span data-testid="payment-subtotal">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-stone-600">
                      <span className="flex items-center gap-1.5">
                        Shipping
                        {shippingCourier && (
                          <span className="text-xs text-stone-400">({shippingCourier})</span>
                        )}
                      </span>
                      <span className="font-semibold text-stone-800">
                        {shippingCost === null
                          ? <span className="text-stone-400 text-sm">Calculating…</span>
                          : `₹${finalShipping.toLocaleString('en-IN')}`
                        }
                      </span>
                    </div>

                    {shippingEtd && (
                      <p className="text-xs text-stone-500 -mt-2 flex items-center gap-1">
                        <Truck size={11} /> Est. delivery: {shippingEtd}
                      </p>
                    )}

                    <div className="border-t border-stone-300 pt-4">
                      <div className="flex justify-between text-stone-900 text-xl font-semibold">
                        <span>Total</span>
                        <span data-testid="payment-total">₹{total.toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">Includes ₹{finalShipping} shipping</p>
                    </div>
                  </div>

                  {/* ── Pay button ── */}
                  <Button onClick={handlePayment} disabled={processingPayment || cart.length === 0}
                    className="btn-primary w-full py-6 text-lg" data-testid="pay-now-button">
                    <Lock className="w-5 h-5 mr-2" />
                    {processingPayment ? 'Processing…' : `Pay ₹${total.toLocaleString('en-IN')}`}
                  </Button>

                  {/* ── T&C consent ── */}
                  <p style={{ textAlign: 'center', fontSize: '0.73rem', color: '#9a8070', marginTop: '0.85rem', lineHeight: 1.65, fontFamily: "'Lato', sans-serif" }}>
                    By placing this order, you agree to our{' '}
                    <Link to="/policies" style={{ color: '#c2602a', textDecoration: 'underline', fontWeight: 600 }}>
                      Terms & Conditions
                    </Link>
                    {' '}and{' '}
                    <Link to="/policies" style={{ color: '#c2602a', textDecoration: 'underline', fontWeight: 600 }}>
                      Refund Policy
                    </Link>.
                  </p>

                  <p className="text-center text-sm text-stone-600 mt-3">🔒 Secured by Razorpay</p>
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
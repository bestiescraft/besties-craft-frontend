import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Mail, Phone, Clock, Send, MessageCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import usePageMeta from '@/hooks/usePageMeta';

import { API } from '@/lib/constants';
const WHATSAPP_NUMBER = '918810776486';

const ContactPage = () => {
  usePageMeta({
    title: 'Contact Us — Besties Craft | Handmade Crochet Products India',
    description: 'Get in touch with Besties Craft. WhatsApp, call or email us for custom crochet orders, queries or just a hello! We reply within 24 hours.',
    url: '/contact',
  });

  const [formData, setFormData]   = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── Submit via backend API (sends real email via ZeptoMail) ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in your name, email and message');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/contact`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:    formData.name.trim(),
          email:   formData.email.trim(),
          phone:   formData.phone.trim(),
          message: formData.message.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        toast.success('Message sent! We\'ll get back to you within 24–48 hours. 💌');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        throw new Error(data.detail || 'Something went wrong');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      toast.error('Failed to send message. Please try WhatsApp or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lato:wght@400;700&display=swap');
        :root {
          --cream: #faf7f2; --warm: #f2ede4; --sand: #e8dfd0;
          --terracotta: #c2602a; --brown: #5c3d2e; --dark: #2c1810; --muted: #9a8070;
        }
        .cp-page { background: var(--cream); min-height: 100vh; display: flex; flex-direction: column; font-family: 'Lato', sans-serif; }
        .cp-body { flex: 1; padding: 3.5rem 2rem 5rem; }
        .cp-inner { max-width: 980px; margin: 0 auto; }

        .cp-heading { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; color: var(--dark); margin: 0 0 0.4rem; }
        .cp-subhead { font-size: 0.95rem; color: var(--muted); margin: 0 0 3rem; }

        .cp-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 2rem; }

        /* Info card */
        .cp-info-card { background: #fff; border-radius: 20px; padding: 2rem; border: 1px solid var(--sand); box-shadow: 0 4px 24px rgba(44,24,16,0.07); height: fit-content; }
        .cp-info-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; color: var(--dark); margin: 0 0 1.75rem; }
        .cp-info-item { display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1.5rem; }
        .cp-info-icon { width: 40px; height: 40px; border-radius: 12px; background: rgba(194,96,42,0.1); color: var(--terracotta); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .cp-info-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 0.2rem; }
        .cp-info-value { font-size: 0.92rem; color: var(--dark); font-weight: 700; margin-bottom: 0.15rem; }
        .cp-info-sub { font-size: 0.78rem; color: var(--muted); }

        .cp-wa-btn {
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          width: 100%; margin-top: 1.75rem; padding: 0.8rem;
          background: #25D366; color: #fff; border: none; border-radius: 12px;
          font-size: 0.88rem; font-weight: 700; cursor: pointer; font-family: 'Lato', sans-serif;
          transition: background 0.2s;
        }
        .cp-wa-btn:hover { background: #1ebe5d; }

        /* Form card */
        .cp-form-card { background: #fff; border-radius: 20px; padding: 2rem; border: 1px solid var(--sand); box-shadow: 0 4px 24px rgba(44,24,16,0.07); }
        .cp-form-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; color: var(--dark); margin: 0 0 1.75rem; }
        .cp-field { margin-bottom: 1.1rem; }
        .cp-label { display: block; font-size: 0.8rem; font-weight: 700; color: var(--brown); margin-bottom: 0.4rem; letter-spacing: 0.04em; }
        .cp-input {
          width: 100%; padding: 0.72rem 1rem; border: 1.5px solid var(--sand);
          border-radius: 10px; font-size: 0.9rem; font-family: 'Lato', sans-serif;
          color: var(--dark); background: var(--cream); outline: none;
          transition: border-color 0.15s, background 0.15s; box-sizing: border-box;
        }
        .cp-input:focus { border-color: var(--terracotta); background: #fff; }
        .cp-textarea { resize: vertical; min-height: 120px; }
        .cp-submit {
          width: 100%; padding: 0.9rem; margin-top: 0.5rem;
          background: var(--dark); color: #fff; border: none; border-radius: 12px;
          font-size: 0.95rem; font-weight: 700; cursor: pointer; font-family: 'Lato', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: background 0.2s;
        }
        .cp-submit:hover { background: var(--brown); }
        .cp-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Success state */
        .cp-success {
          text-align: center; padding: 2.5rem 1.5rem;
        }
        .cp-success-icon {
          width: 64px; height: 64px; background: #e8f8f0; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem; color: #2ecc71;
        }
        .cp-success h3 { font-family: 'Playfair Display', serif; color: var(--dark); margin: 0 0 0.5rem; }
        .cp-success p { color: var(--muted); font-size: 0.9rem; margin: 0 0 1.5rem; }
        .cp-send-another {
          padding: 0.7rem 1.5rem; background: transparent; color: var(--terracotta);
          border: 1.5px solid var(--terracotta); border-radius: 10px;
          font-size: 0.88rem; font-weight: 700; cursor: pointer; font-family: 'Lato', sans-serif;
          transition: all 0.2s;
        }
        .cp-send-another:hover { background: var(--terracotta); color: #fff; }

        @media (max-width: 700px) {
          .cp-grid { grid-template-columns: 1fr; }
          .cp-body { padding: 2rem 1.25rem 4rem; }
        }
      `}</style>

      <div className="cp-page">
        <Navbar />
        <div className="cp-body">
          <div className="cp-inner">
            <h1 className="cp-heading">Contact Us</h1>
            <p className="cp-subhead">We'd love to hear from you — orders, customisation queries, or just a hello!</p>

            <div className="cp-grid">

              {/* ── Info panel ── */}
              <div className="cp-info-card">
                <h2 className="cp-info-title">Get in Touch</h2>

                <div className="cp-info-item">
                  <div className="cp-info-icon"><Mail size={18} /></div>
                  <div>
                    <div className="cp-info-label">Email</div>
                    <div className="cp-info-value">bestiescraft1434@gmail.com</div>
                    <div className="cp-info-sub">We reply within 24 hours</div>
                  </div>
                </div>

                <div className="cp-info-item">
                  <div className="cp-info-icon"><Phone size={18} /></div>
                  <div>
                    <div className="cp-info-label">Phone / WhatsApp</div>
                    <div className="cp-info-value">+91 88107 76486</div>
                    <div className="cp-info-sub">Available for calls & WhatsApp</div>
                  </div>
                </div>

                <div className="cp-info-item" style={{ marginBottom: 0 }}>
                  <div className="cp-info-icon"><Clock size={18} /></div>
                  <div>
                    <div className="cp-info-label">Business Hours</div>
                    <div className="cp-info-value">10:00 AM – 8:00 PM</div>
                    <div className="cp-info-sub">All days</div>
                  </div>
                </div>

                <button
                  className="cp-wa-btn"
                  onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
                >
                  <MessageCircle size={17} /> Chat on WhatsApp
                </button>
              </div>

              {/* ── Form panel ── */}
              <div className="cp-form-card">
                {submitted ? (
                  /* Success state */
                  <div className="cp-success">
                    <div className="cp-success-icon">
                      <CheckCircle size={32} />
                    </div>
                    <h3>Message Sent! 💌</h3>
                    <p>
                      Thanks for reaching out! We've received your message and
                      sent a confirmation to your email.<br />
                      We'll get back to you within <strong>24–48 hours</strong>.
                    </p>
                    <button
                      className="cp-send-another"
                      onClick={() => setSubmitted(false)}
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  /* Form */
                  <>
                    <h2 className="cp-form-title">Send us a Message</h2>
                    <form onSubmit={handleSubmit}>
                      <div className="cp-field">
                        <label className="cp-label" htmlFor="name">Full Name *</label>
                        <input
                          className="cp-input" id="name" name="name" type="text"
                          placeholder="Your name" value={formData.name} onChange={handleChange}
                        />
                      </div>
                      <div className="cp-field">
                        <label className="cp-label" htmlFor="email">Email Address *</label>
                        <input
                          className="cp-input" id="email" name="email" type="email"
                          placeholder="your@email.com" value={formData.email} onChange={handleChange}
                        />
                      </div>
                      <div className="cp-field">
                        <label className="cp-label" htmlFor="phone">
                          Phone Number{' '}
                          <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(optional)</span>
                        </label>
                        <input
                          className="cp-input" id="phone" name="phone" type="tel"
                          placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={handleChange}
                        />
                      </div>
                      <div className="cp-field">
                        <label className="cp-label" htmlFor="message">Message *</label>
                        <textarea
                          className="cp-input cp-textarea" id="message" name="message"
                          placeholder="Tell us about your order, customisation idea, or any question…"
                          value={formData.message} onChange={handleChange}
                        />
                      </div>
                      <button className="cp-submit" type="submit" disabled={loading}>
                        <Send size={16} />
                        {loading ? 'Sending…' : 'Send Message'}
                      </button>
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'center', marginTop: '0.75rem' }}>
                        We'll email you a confirmation and reply within 24–48 hours.
                      </p>
                    </form>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
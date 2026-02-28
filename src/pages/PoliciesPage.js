import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Truck, RotateCcw, Shield, FileText, BookOpen, RefreshCw, Heart, Sparkles, Package, Star, ChevronRight, ChevronDown } from 'lucide-react';
import usePageMeta from '@/hooks/usePageMeta';
import { Link } from 'react-router-dom';

const CONTACT_PHONE = '+91 88107 76486';
const CONTACT_EMAIL = 'bestiescraft1434@gmail.com';

// ── Safe string-only arrays (no JSX at module level) ──
const EXPLORE_SECTIONS = [
  { id: 'ethos',      label: 'Our Ethos'      },
  { id: 'products',   label: 'Our Products'   },
  { id: 'categories', label: 'Our Categories' },
];

const POLICY_SECTIONS = [
  { id: 'shipping', label: 'Shipping Policy'    },
  { id: 'returns',  label: 'Returns & Refunds'  },
  { id: 'privacy',  label: 'Privacy Policy'     },
  { id: 'terms',    label: 'Terms & Conditions' },
  { id: 'service',  label: 'Terms of Service'   },
  { id: 'refund',   label: 'Refund Policy'      },
];

// Icons rendered inside component scope only
function SectionIcon({ id }) {
  const map = {
    ethos: <Heart size={14} />, products: <Sparkles size={14} />, categories: <Package size={14} />,
    shipping: <Truck size={14} />, returns: <RotateCcw size={14} />, privacy: <Shield size={14} />,
    terms: <FileText size={14} />, service: <BookOpen size={14} />, refund: <RefreshCw size={14} />,
  };
  return map[id] || null;
}

// ── Shared UI helpers ──
function SectionLabel({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#c2602a', marginBottom: '0.85rem' }}>
      <span style={{ width: 22, height: 1.5, background: '#c2602a', display: 'inline-block', flexShrink: 0 }} />
      {children}
    </div>
  );
}
function H2({ children }) {
  return <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.5rem, 3vw, 1.9rem)', fontWeight: 700, color: '#2c1810', margin: '0 0 0.4rem', lineHeight: 1.2 }}>{children}</h2>;
}
function DateLine({ children }) {
  return <p style={{ fontSize: '0.72rem', color: '#9a8070', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.75rem', paddingBottom: '1.4rem', borderBottom: '1px solid #e8dfd0', fontFamily: "'Lato', sans-serif" }}>{children}</p>;
}
function H3({ children }) {
  return <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.05rem', fontWeight: 700, color: '#5c3d2e', margin: '1.75rem 0 0.5rem' }}>{children}</h3>;
}
function P({ children }) {
  return <p style={{ fontSize: '0.93rem', color: '#4a3728', lineHeight: 1.85, marginBottom: '0.75rem', fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>{children}</p>;
}
function Ul({ items }) {
  return (
    <ul style={{ listStyle: 'none', margin: '0 0 1rem', padding: 0 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.93rem', color: '#4a3728', lineHeight: 1.8, marginBottom: '0.3rem', fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
          <span style={{ color: '#c2602a', flexShrink: 0 }}>—</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
function Box({ children }) {
  return (
    <div style={{ background: '#f2ede4', borderLeft: '3px solid #c2602a', padding: '1rem 1.25rem', margin: '1.25rem 0', borderRadius: '0 8px 8px 0' }}>
      <p style={{ fontSize: '0.88rem', color: '#4a3728', lineHeight: 1.8, margin: 0, fontFamily: "'Lato', sans-serif", whiteSpace: 'pre-line' }}>{children}</p>
    </div>
  );
}

// ── Page sections ──
function ShippingContent() {
  return (
    <>
      <SectionLabel>Besties Craft Policy</SectionLabel>
      <H2>Shipping Policy</H2>
      <DateLine>Last updated — February 2026</DateLine>
      <P>At Besties Craft, we take great care in packaging and dispatching every order. Each item is lovingly packed to ensure it reaches you safely and beautifully.</P>
      <H3>Processing Time</H3>
      <P>All orders are processed within 2–4 business days. Orders placed on weekends or public holidays will be processed on the next working day.</P>
      <H3>Delivery Timelines</H3>
      <Ul items={['Standard Delivery: 5–8 business days', 'Express Delivery: 2–4 business days']} />
      <H3>Shipping Charges</H3>
      <P>Shipping charges are calculated based on your delivery pin code and are shown at checkout. We offer <strong>free standard shipping on all orders above ₹999</strong> — applied automatically, no coupon needed.</P>
      <Box>Once your order is dispatched, you will receive a tracking number via SMS. Please allow 24 hours for the tracking to become active.</Box>
    </>
  );
}

function ReturnsContent() {
  return (
    <>
      <SectionLabel>Besties Craft Policy</SectionLabel>
      <H2>Returns & Refunds</H2>
      <DateLine>Last updated — February 2026</DateLine>
      <P>We stand behind every product we send. Returns are accepted strictly in cases where a wrong or damaged product has been received.</P>
      <H3>Return Window</H3>
      <P>Returns must be reported within <strong>48 hours of delivery</strong>. Any claims raised after this period will not be eligible for return or replacement. The item must be unused and in its original packaging.</P>
      <H3>Eligible Reasons for Return</H3>
      <Ul items={['Wrong product delivered', 'Product received in damaged condition']} />
      <H3>Non-Returnable Items</H3>
      <Ul items={['Customised or personalised products', 'Digital downloads', 'Items marked as Final Sale', 'Gift cards', 'Items reported after the 48-hour window']} />
      <H3>How to Initiate a Return</H3>
      <P>Reach out to us within 48 hours of delivery with your order number, a description of the issue, and clear photographs of the product received.</P>
      <Box>{'📱 WhatsApp: ' + CONTACT_PHONE + '\n✉️ Email: ' + CONTACT_EMAIL + '\n\nOur team will review and respond within 48 hours. Approved refunds are processed within 5–7 business days.'}</Box>
    </>
  );
}

function PrivacyContent() {
  return (
    <>
      <SectionLabel>Besties Craft Policy</SectionLabel>
      <H2>Privacy Policy</H2>
      <DateLine>Last updated — February 2026</DateLine>
      <P>Your privacy is important to us. This policy explains how Besties Craft collects, uses, and protects your personal information.</P>
      <H3>Information We Collect</H3>
      <Ul items={['Name, email address, and contact number', 'Shipping and billing address', 'Payment information (processed securely via Razorpay)', 'Browsing behaviour on our website']} />
      <H3>How We Use Your Information</H3>
      <P>We use your information to process orders, send shipping updates, improve our services, and occasionally share promotional offers. We never sell your data to third parties.</P>
      <H3>Cookies</H3>
      <P>Our website uses cookies to enhance your browsing experience. You may disable cookies in your browser settings, though this may affect some functionality.</P>
      <Box>You have the right to request access to, correction of, or deletion of your personal data at any time by contacting us via our details below.</Box>
      <H3>Data Security</H3>
      <P>All payments are processed through Razorpay's secure, PCI-DSS compliant gateway. We implement industry-standard security measures to protect your information at all times.</P>
    </>
  );
}

function TermsContent() {
  return (
    <>
      <SectionLabel>Besties Craft Policy</SectionLabel>
      <H2>Terms & Conditions</H2>
      <DateLine>Last updated — February 2026</DateLine>
      <P>By accessing or placing an order on the Besties Craft website, you agree to be bound by the following terms and conditions. Please read them carefully.</P>
      <H3>Acceptance of Terms</H3>
      <P>These Terms & Conditions govern your use of our website and services. We reserve the right to update these at any time without prior notice. Continued use constitutes acceptance.</P>
      <H3>Products & Pricing</H3>
      <P>All product descriptions, images, and prices are accurate to the best of our knowledge. We reserve the right to correct errors. Prices are inclusive of applicable taxes unless stated otherwise.</P>
      <H3>Intellectual Property</H3>
      <P>All content on this website — including images, designs, text, logos, and graphics — is the intellectual property of Besties Craft. Reproduction without written permission is strictly prohibited.</P>
      <H3>Limitation of Liability</H3>
      <P>Besties Craft shall not be liable for any indirect, incidental, or consequential damages arising from use of our products or website. Our liability is limited to the value of the order placed.</P>
      <Box>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Varanasi, Uttar Pradesh, India.</Box>
      <H3>Contact</H3>
      <P>For any queries, reach us at <strong>{CONTACT_EMAIL}</strong> or WhatsApp <strong>{CONTACT_PHONE}</strong>.</P>
    </>
  );
}

function ServiceContent() {
  return (
    <>
      <SectionLabel>Besties Craft Policy</SectionLabel>
      <H2>Terms of Service</H2>
      <DateLine>Last updated — February 2026</DateLine>
      <P>These Terms of Service outline the rules and regulations for the use of Besties Craft's website and services.</P>
      <H3>Account Responsibility</H3>
      <P>If you create an account with us, you are responsible for maintaining the confidentiality of your login credentials and all activities under your account.</P>
      <H3>Prohibited Activities</H3>
      <Ul items={['Using the site for unlawful purposes', 'Attempting to gain unauthorised access to our systems', 'Scraping, copying, or reproducing website content', 'Submitting false or fraudulent orders']} />
      <H3>Order Acceptance</H3>
      <P>Placing an order does not constitute a binding contract. We reserve the right to accept or decline any order. You will be notified if an order cannot be fulfilled.</P>
      <H3>Amendments</H3>
      <P>We may revise these terms at any time. Your continued use of the website after changes are posted constitutes your acceptance of the revised terms.</P>
      <Box>{'For service-related queries:\n📱 ' + CONTACT_PHONE + '\n✉️ ' + CONTACT_EMAIL}</Box>
    </>
  );
}

function RefundContent() {
  return (
    <>
      <SectionLabel>Besties Craft Policy</SectionLabel>
      <H2>Refund Policy</H2>
      <DateLine>Last updated — February 2026</DateLine>
      <P>We believe in the quality of our products. Refunds are processed in cases where an error on our part has occurred.</P>
      <H3>Eligible for Refund</H3>
      <Ul items={['Items received damaged or defective', 'Wrong item delivered', 'Order not delivered within 15 business days']} />
      <H3>Refund Process</H3>
      <P>Once your return is received and inspected, we will notify you of the approval or rejection. Approved refunds are processed within 5–7 business days to your original payment method.</P>
      <Box>UPI and wallet payments are typically refunded within 24–48 hours. Bank transfers may take up to 7 business days depending on your bank.</Box>
      <H3>Non-Refundable Situations</H3>
      <Ul items={['Change of mind after the return window has passed', 'Products damaged due to customer misuse', 'Customised and personalised orders', 'Claims raised after 48 hours of delivery']} />
      <H3>How to Request</H3>
      <P>Contact us within 48 hours of delivery via WhatsApp at <strong>{CONTACT_PHONE}</strong> or email at <strong>{CONTACT_EMAIL}</strong> with your order number and photos.</P>
    </>
  );
}

function EthosContent() {
  return (
    <>
      <SectionLabel>Who We Are</SectionLabel>
      <H2>Our Ethos</H2>
      <DateLine>The Besties Craft Story</DateLine>
      <P>Besties Craft was born from a deep love for handmade things — the kind made with patience, care, and a little bit of joy tucked into every stitch and fold.</P>
      <P>We believe that craft is more than a product; it is a conversation between maker and recipient. Every piece we create carries intention, warmth, and the unmistakable touch of human hands.</P>
      <P>Our commitment is simple: beautifully crafted goods that bring a smile, spark creativity, and last beyond fleeting trends. No factories, no shortcuts — crafted with love in Varanasi.</P>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem', marginTop: '1.5rem' }}>
        {[
          { title: 'Made with Love',      desc: 'Every piece handcrafted with care.' },
          { title: '100% Handmade',       desc: 'No factories, no mass production.'  },
          { title: 'Pan-India Delivery',  desc: 'We ship to every corner of India.'  },
          { title: 'Quality Guaranteed',  desc: 'Premium materials, skilled hands.'  },
        ].map((v, i) => (
          <div key={i} style={{ background: '#f2ede4', borderRadius: 12, padding: '1.1rem', border: '1px solid #e8dfd0' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#2c1810', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{v.title}</div>
            <div style={{ fontSize: '0.8rem', color: '#9a8070', fontFamily: "'Lato', sans-serif" }}>{v.desc}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function ProductsContent() {
  return (
    <>
      <SectionLabel>What We Make</SectionLabel>
      <H2>Our Products</H2>
      <DateLine>Crafted with care, delivered with love</DateLine>
      <P>Every product in the Besties Craft collection is thoughtfully designed and carefully made. From crochet bracelets and woollen flowers to personalised gifting items and hair accessories — each item is a little work of art.</P>
      <P>We use premium quality yarns and materials so that what reaches your doorstep is exactly what you imagined. All products can be customised on request.</P>
      <Box>{'Want something custom? WhatsApp us at ' + CONTACT_PHONE + ' and we\'ll make it just for you.'}</Box>
    </>
  );
}

function CategoriesContent() {
  const cats = [
    { emoji: '📿', name: 'Bracelets' },
    { emoji: '🌸', name: 'Handmade Flowers' },
    { emoji: '🔑', name: 'Keychains' },
    { emoji: '🎀', name: 'Hair Accessories' },
    { emoji: '🎁', name: 'Gifting Items' },
    { emoji: '🎨', name: 'Crafts' },
  ];
  return (
    <>
      <SectionLabel>Browse</SectionLabel>
      <H2>Our Categories</H2>
      <DateLine>Find your favourite</DateLine>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
        {cats.map((cat, i) => (
          <div key={i} style={{ background: '#f2ede4', borderRadius: 12, padding: '1rem 1.1rem', border: '1px solid #e8dfd0', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{cat.emoji}</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: '#2c1810', fontSize: '0.92rem' }}>{cat.name}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// Map of section id → component (rendered here, inside module scope is fine for static JSX)
function SectionContent({ id }) {
  switch (id) {
    case 'shipping':   return <ShippingContent />;
    case 'returns':    return <ReturnsContent />;
    case 'privacy':    return <PrivacyContent />;
    case 'terms':      return <TermsContent />;
    case 'service':    return <ServiceContent />;
    case 'refund':     return <RefundContent />;
    case 'ethos':      return <EthosContent />;
    case 'products':   return <ProductsContent />;
    case 'categories': return <CategoriesContent />;
    default:           return <ShippingContent />;
  }
}

// ── Main export ──
const PoliciesPage = () => {
  const [active, setActive] = useState('shipping');
  const [mobileOpen, setMobileOpen] = useState(false);

  usePageMeta({
    title: 'Policies — Besties Craft | Shipping, Returns & More',
    description: 'Read Besties Craft policies — shipping, returns, refunds, privacy, terms and conditions.',
    url: '/policies',
  });

  const allSections = [...POLICY_SECTIONS, ...EXPLORE_SECTIONS];
  const activeLabel = allSections.find(s => s.id === active)?.label || 'Policies';

  const handleSelect = (id) => {
    setActive(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        .pol-page { background: #faf7f2; min-height: 100vh; display: flex; flex-direction: column; font-family: 'Lato', sans-serif; }
        .pol-hero { background: linear-gradient(135deg, #2c1810 0%, #4a2518 60%, #5c3d2e 100%); padding: 4rem 2rem 3rem; text-align: center; }
        .pol-hero-tag { display: inline-block; background: rgba(194,96,42,0.25); color: #f4a06a; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; padding: 0.38rem 1rem; border-radius: 30px; border: 1px solid rgba(194,96,42,0.4); margin-bottom: 1.1rem; font-family: 'Lato', sans-serif; }
        .pol-hero h1 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 700; color: #fff; margin: 0 0 0.65rem; line-height: 1.15; }
        .pol-hero h1 em { color: #f4a06a; font-style: italic; }
        .pol-hero-sub { font-size: 0.95rem; color: rgba(255,255,255,0.5); max-width: 420px; margin: 0 auto; line-height: 1.7; font-weight: 300; }
        .pol-wrap { max-width: 1080px; margin: 0 auto; width: 100%; display: flex; flex: 1; }
        .pol-sidebar { width: 230px; flex-shrink: 0; border-right: 1px solid #e8dfd0; padding: 2rem 1.25rem; position: sticky; top: 72px; height: fit-content; background: #faf7f2; }
        .pol-group { margin-bottom: 1.75rem; }
        .pol-group-label { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #c2602a; margin-bottom: 0.5rem; display: block; padding-left: 0.2rem; }
        .pol-link { display: flex; align-items: center; gap: 0.55rem; font-size: 0.86rem; color: #9a8070; padding: 0.55rem 0.65rem; border-radius: 8px; cursor: pointer; transition: all 0.15s; font-family: 'Lato', sans-serif; border: none; background: none; width: 100%; text-align: left; }
        .pol-link:hover { color: #5c3d2e; background: #f2ede4; }
        .pol-link.pol-active { color: #c2602a; background: rgba(194,96,42,0.09); font-weight: 700; }
        .pol-content { flex: 1; padding: 2.5rem 3rem; min-height: 60vh; }
        .pol-mobile-nav { display: none; background: #f2ede4; border-bottom: 1px solid #e8dfd0; padding: 0.85rem 1.25rem; }
        .pol-mobile-toggle { display: flex; align-items: center; justify-content: space-between; width: 100%; background: #fff; border: 1px solid #e8dfd0; border-radius: 10px; padding: 0.7rem 1rem; cursor: pointer; font-size: 0.88rem; font-weight: 600; color: #2c1810; font-family: 'Lato', sans-serif; }
        .pol-mobile-drop { background: #fff; border: 1px solid #e8dfd0; border-radius: 10px; margin-top: 0.4rem; overflow: hidden; }
        .pol-mobile-glabel { font-size: 0.6rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #c2602a; padding: 0.65rem 1rem 0.2rem; display: block; }
        .pol-mobile-item { display: flex; align-items: center; gap: 0.55rem; width: 100%; padding: 0.65rem 1rem; border: none; background: none; text-align: left; font-size: 0.86rem; color: #4a3728; cursor: pointer; font-family: 'Lato', sans-serif; transition: background 0.12s; }
        .pol-mobile-item:hover { background: #f2ede4; }
        .pol-mobile-item.pol-active { color: #c2602a; font-weight: 700; background: rgba(194,96,42,0.06); }
        @media (max-width: 768px) {
          .pol-wrap { flex-direction: column; }
          .pol-sidebar { display: none; }
          .pol-mobile-nav { display: block; }
          .pol-content { padding: 1.75rem 1.25rem; }
        }
      `}</style>

      <div className="pol-page">
        <Navbar />

        <div className="pol-hero">
          <div className="pol-hero-tag">✦ Policies & Information</div>
          <h1>Everything you need<br />to <em>know</em></h1>
          <p className="pol-hero-sub">Shipping, returns, privacy and more — clearly laid out for you.</p>
        </div>

        {/* Mobile dropdown */}
        <div className="pol-mobile-nav">
          <button className="pol-mobile-toggle" onClick={() => setMobileOpen(o => !o)}>
            <span>{activeLabel}</span>
            {mobileOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>
          {mobileOpen && (
            <div className="pol-mobile-drop">
              <span className="pol-mobile-glabel">Explore</span>
              {EXPLORE_SECTIONS.map(s => (
                <button key={s.id} className={`pol-mobile-item${active === s.id ? ' pol-active' : ''}`} onClick={() => handleSelect(s.id)}>
                  <SectionIcon id={s.id} /> {s.label}
                </button>
              ))}
              <span className="pol-mobile-glabel">Policies</span>
              {POLICY_SECTIONS.map(s => (
                <button key={s.id} className={`pol-mobile-item${active === s.id ? ' pol-active' : ''}`} onClick={() => handleSelect(s.id)}>
                  <SectionIcon id={s.id} /> {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pol-wrap">
          {/* Desktop sidebar */}
          <aside className="pol-sidebar">
            <div className="pol-group">
              <span className="pol-group-label">Explore</span>
              {EXPLORE_SECTIONS.map(s => (
                <button key={s.id} className={`pol-link${active === s.id ? ' pol-active' : ''}`} onClick={() => handleSelect(s.id)}>
                  <SectionIcon id={s.id} /> {s.label}
                </button>
              ))}
            </div>
            <div className="pol-group">
              <span className="pol-group-label">Besties Craft Policies</span>
              {POLICY_SECTIONS.map(s => (
                <button key={s.id} className={`pol-link${active === s.id ? ' pol-active' : ''}`} onClick={() => handleSelect(s.id)}>
                  <SectionIcon id={s.id} /> {s.label}
                </button>
              ))}
            </div>
          </aside>

          <main className="pol-content">
            <SectionContent id={active} />
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default PoliciesPage;
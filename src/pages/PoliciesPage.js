import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Truck, RotateCcw, Shield, FileText, BookOpen, RefreshCw, Heart, Sparkles, Package, Star, ChevronRight } from 'lucide-react';
import usePageMeta from '@/hooks/usePageMeta';

const CONTACT_PHONE = '+91 88107 76486';
const CONTACT_EMAIL = 'bestiescraft1434@gmail.com';

const EXPLORE_SECTIONS = [
  { id: 'ethos',      label: 'Our Ethos',      icon: <Heart size={15} /> },
  { id: 'products',   label: 'Our Products',   icon: <Sparkles size={15} /> },
  { id: 'categories', label: 'Our Categories', icon: <Package size={15} /> },
];

const POLICY_SECTIONS = [
  { id: 'shipping', label: 'Shipping Policy',    icon: <Truck size={15} /> },
  { id: 'returns',  label: 'Returns & Refunds',  icon: <RotateCcw size={15} /> },
  { id: 'privacy',  label: 'Privacy Policy',     icon: <Shield size={15} /> },
  { id: 'terms',    label: 'Terms & Conditions', icon: <FileText size={15} /> },
  { id: 'service',  label: 'Terms of Service',   icon: <BookOpen size={15} /> },
  { id: 'refund',   label: 'Refund Policy',      icon: <RefreshCw size={15} /> },
];

const CATEGORIES = [
  { emoji: '📿', name: 'Bracelets' },
  { emoji: '🌸', name: 'Handmade Flowers' },
  { emoji: '🔑', name: 'Keychains' },
  { emoji: '🎀', name: 'Hair Accessories' },
  { emoji: '🎁', name: 'Gifting Items' },
  { emoji: '🎨', name: 'Crafts' },
];

// ─── Reusable sub-components ───────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c2602a', marginBottom: '0.85rem' }}>
      <span style={{ width: 28, height: 1.5, background: '#c2602a', display: 'inline-block' }} />
      {children}
    </div>
  );
}

function PolicyH2({ children }) {
  return (
    <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.9rem', fontWeight: 700, color: '#2c1810', margin: '0 0 0.5rem' }}>
      {children}
    </h2>
  );
}

function PolicyDate({ children }) {
  return (
    <p style={{ fontSize: '0.75rem', color: '#9a8070', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e8dfd0' }}>
      {children}
    </p>
  );
}

function PolicyH3({ children }) {
  return (
    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, color: '#5c3d2e', margin: '2rem 0 0.6rem' }}>
      {children}
    </h3>
  );
}

function PolicyP({ children }) {
  return (
    <p style={{ fontSize: '0.95rem', color: '#4a3728', lineHeight: 1.85, marginBottom: '0.75rem', fontFamily: "'Lato', sans-serif" }}>
      {children}
    </p>
  );
}

function PolicyList({ items }) {
  return (
    <ul style={{ listStyle: 'none', margin: '0 0 1rem', padding: 0 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.95rem', color: '#4a3728', lineHeight: 1.75, marginBottom: '0.4rem', fontFamily: "'Lato', sans-serif" }}>
          <span style={{ color: '#c2602a', marginTop: '0.1rem', flexShrink: 0 }}>—</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function HighlightBox({ children }) {
  return (
    <div style={{ background: '#f2ede4', borderLeft: '3px solid #c2602a', padding: '1.1rem 1.4rem', margin: '1.5rem 0', borderRadius: '0 8px 8px 0' }}>
      <p style={{ fontSize: '0.9rem', color: '#4a3728', lineHeight: 1.8, margin: 0, fontFamily: "'Lato', sans-serif" }}>{children}</p>
    </div>
  );
}

// ─── Page content sections ─────────────────────────────────────────────────

function ShippingContent() {
  return (
    <>
      <SectionLabel>Besties Craft Policy</SectionLabel>
      <PolicyH2>Shipping Policy</PolicyH2>
      <PolicyDate>Last updated — February 2026</PolicyDate>
      <PolicyP>At Besties Craft, we take great care in packaging and dispatching your orders. Each item is lovingly packed to ensure it reaches you safely and beautifully.</PolicyP>

      <PolicyH3>Processing Time</PolicyH3>
      <PolicyP>All orders are processed within 2–4 business days. Orders placed on weekends or public holidays will be processed on the next working day.</PolicyP>

      <PolicyH3>Delivery Timelines</PolicyH3>
      <PolicyList items={[
        'Standard Delivery: 5–8 business days',
        'Express Delivery: 2–4 business days',
      ]} />

      <PolicyH3>Shipping Charges</PolicyH3>
      <PolicyP>Shipping charges are calculated based on your delivery pin code and will be displayed at checkout. We offer <strong>free standard shipping on all orders above ₹999</strong> — applied automatically, no coupon needed.</PolicyP>

      <HighlightBox>
        Once your order is dispatched, you will receive a tracking number via SMS. Please allow 24 hours for tracking to become active.
      </HighlightBox>
    </>
  );
}

function ReturnsContent() {
  return (
    <>
      <SectionLabel>Besties Craft Policy</SectionLabel>
      <PolicyH2>Returns & Refunds</PolicyH2>
      <PolicyDate>Last updated — February 2026</PolicyDate>
      <PolicyP>We stand behind every product we send. Returns are accepted strictly in cases where a wrong or damaged product has been received.</PolicyP>

      <PolicyH3>Return Window</PolicyH3>
      <PolicyP>Returns must be reported within <strong>48 hours of delivery</strong>. Any claims raised after this period will not be eligible for return or replacement. The item must be unused and in its original packaging.</PolicyP>

      <PolicyH3>Eligible Reasons for Return</PolicyH3>
      <PolicyList items={[
        'Wrong product delivered',
        'Product received in damaged condition',
      ]} />

      <PolicyH3>Non-Returnable Items</PolicyH3>
      <PolicyList items={[
        'Customised or personalised products',
        'Digital downloads',
        'Items marked as Final Sale',
        'Gift cards',
        'Items reported after the 48-hour window',
      ]} />

      <PolicyH3>How to Initiate a Return</PolicyH3>
      <PolicyP>To raise a return request, please reach out to us via the contact details provided below within 48 hours of receiving your order. Share your order number, a brief description of the issue, and clear photographs of the product received.</PolicyP>

      <HighlightBox>
        📱 WhatsApp: {CONTACT_PHONE} &nbsp;|&nbsp; ✉️ Email: {CONTACT_EMAIL}{'\n'}Our team will review your request and respond within 48 hours. Approved refunds are processed to the original payment method within 5–7 business days.
      </HighlightBox>
    </>
  );
}

function PrivacyContent() {
  return (
    <>
      <SectionLabel>Besties Craft Policy</SectionLabel>
      <PolicyH2>Privacy Policy</PolicyH2>
      <PolicyDate>Last updated — February 2026</PolicyDate>
      <PolicyP>Your privacy is important to us. This policy explains how Besties Craft collects, uses, and protects your personal information.</PolicyP>

      <PolicyH3>Information We Collect</PolicyH3>
      <PolicyList items={[
        'Name, email address, and contact number',
        'Shipping and billing address',
        'Payment information (processed securely via Razorpay)',
        'Browsing behaviour on our website',
      ]} />

      <PolicyH3>How We Use Your Information</PolicyH3>
      <PolicyP>We use your information to process orders, send shipping updates, improve our services, and occasionally share promotional offers. We never sell your data to third parties.</PolicyP>

      <PolicyH3>Cookies</PolicyH3>
      <PolicyP>Our website uses cookies to enhance your browsing experience and understand how visitors use our site. You may disable cookies in your browser settings, though this may affect functionality.</PolicyP>

      <HighlightBox>
        You have the right to request access to, correction of, or deletion of your personal data at any time by reaching out to us via our contact details.
      </HighlightBox>

      <PolicyH3>Data Security</PolicyH3>
      <PolicyP>We implement industry-standard security measures to protect your information. All payments are processed through Razorpay's secure, PCI-DSS compliant gateway.</PolicyP>
    </>
  );
}

function TermsContent() {
  return (
    <>
      <SectionLabel>Besties Craft Policy</SectionLabel>
      <PolicyH2>Terms & Conditions</PolicyH2>
      <PolicyDate>Last updated — February 2026</PolicyDate>
      <PolicyP>By accessing or placing an order on the Besties Craft website, you agree to be bound by the following terms and conditions. Please read them carefully before proceeding.</PolicyP>

      <PolicyH3>Acceptance of Terms</PolicyH3>
      <PolicyP>These Terms & Conditions govern your use of our website and services. We reserve the right to update these terms at any time without prior notice. Continued use of the site constitutes your acceptance of the revised terms.</PolicyP>

      <PolicyH3>Products & Pricing</PolicyH3>
      <PolicyP>All product descriptions, images, and prices are accurate to the best of our knowledge. We reserve the right to correct any errors and to change prices without prior notice. Prices are inclusive of applicable taxes unless stated otherwise.</PolicyP>

      <PolicyH3>Intellectual Property</PolicyH3>
      <PolicyP>All content on this website — including images, designs, text, logos, and graphics — is the intellectual property of Besties Craft. Reproduction or use without written permission is strictly prohibited.</PolicyP>

      <PolicyH3>Limitation of Liability</PolicyH3>
      <PolicyP>Besties Craft shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our liability is limited to the value of the order placed.</PolicyP>

      <HighlightBox>
        These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Varanasi, Uttar Pradesh, India.
      </HighlightBox>

      <PolicyH3>Contact</PolicyH3>
      <PolicyP>For any queries regarding these terms, please reach out to us at <strong>{CONTACT_EMAIL}</strong> or call/WhatsApp us at <strong>{CONTACT_PHONE}</strong>.</PolicyP>
    </>
  );
}

function ServiceContent() {
  return (
    <>
      <SectionLabel>Besties Craft Policy</SectionLabel>
      <PolicyH2>Terms of Service</PolicyH2>
      <PolicyDate>Last updated — February 2026</PolicyDate>
      <PolicyP>These Terms of Service outline the rules and regulations for the use of Besties Craft's website and services.</PolicyP>

      <PolicyH3>Account Responsibility</PolicyH3>
      <PolicyP>If you create an account with us, you are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</PolicyP>

      <PolicyH3>Prohibited Activities</PolicyH3>
      <PolicyList items={[
        'Using the site for unlawful purposes',
        'Attempting to gain unauthorised access to our systems',
        'Scraping, copying, or reproducing website content',
        'Submitting false or fraudulent orders',
      ]} />

      <PolicyH3>Order Acceptance</PolicyH3>
      <PolicyP>Placing an order does not constitute a binding contract. We reserve the right to accept or decline any order at our discretion. You will be notified if your order cannot be fulfilled.</PolicyP>

      <PolicyH3>Amendments</PolicyH3>
      <PolicyP>We may revise these terms at any time. The most current version will always be available on our website. Your continued use after changes are posted constitutes your acceptance.</PolicyP>

      <HighlightBox>
        For any service-related queries, contact us at {CONTACT_EMAIL} or WhatsApp {CONTACT_PHONE}.
      </HighlightBox>
    </>
  );
}

function RefundContent() {
  return (
    <>
      <SectionLabel>Besties Craft Policy</SectionLabel>
      <PolicyH2>Refund Policy</PolicyH2>
      <PolicyDate>Last updated — February 2026</PolicyDate>
      <PolicyP>We believe in the quality of our products. If you are not fully satisfied due to an error on our part, our refund policy ensures a smooth resolution.</PolicyP>

      <PolicyH3>Eligible Refunds</PolicyH3>
      <PolicyList items={[
        'Items received damaged or defective',
        'Wrong item delivered',
        'Order not delivered within 15 business days',
      ]} />

      <PolicyH3>Refund Process</PolicyH3>
      <PolicyP>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. Approved refunds are processed within 5–7 business days to your original payment method.</PolicyP>

      <HighlightBox>
        UPI and wallet payments are typically refunded within 24–48 hours. Bank transfers may take up to 7 business days depending on your bank.
      </HighlightBox>

      <PolicyH3>Non-Refundable Situations</PolicyH3>
      <PolicyList items={[
        'Change of mind after the return window has passed',
        'Products damaged due to customer misuse',
        'Customised and personalised orders',
        'Claims raised after 48 hours of delivery',
      ]} />

      <PolicyH3>How to Request a Refund</PolicyH3>
      <PolicyP>Contact us within 48 hours of delivery via WhatsApp at <strong>{CONTACT_PHONE}</strong> or email at <strong>{CONTACT_EMAIL}</strong> with your order number and photographs of the item received.</PolicyP>
    </>
  );
}

function EthosContent() {
  return (
    <>
      <SectionLabel>Who We Are</SectionLabel>
      <PolicyH2>Our Ethos</PolicyH2>
      <PolicyDate>The Besties Craft Story</PolicyDate>
      <PolicyP>Besties Craft was born from a deep love for handmade things — the kind made with patience, care, and a little bit of joy tucked into every stitch and fold.</PolicyP>
      <PolicyP>We believe that craft is more than a product; it's a conversation between maker and recipient. Every piece we create carries intention, warmth, and the unmistakable touch of human hands.</PolicyP>
      <PolicyP>Our commitment is simple: to offer beautifully crafted goods that bring a smile, spark creativity, and last beyond fleeting trends. No factories, no shortcuts — just skill, love, and handmade goodness crafted in Varanasi.</PolicyP>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '2rem' }}>
        {[
          { icon: <Heart size={18} />, title: 'Made with Love', desc: 'Every piece is handcrafted with care.' },
          { icon: <Sparkles size={18} />, title: '100% Handmade', desc: 'No factories, no mass production.' },
          { icon: <Package size={18} />, title: 'Pan-India Delivery', desc: 'We ship to every corner of India.' },
          { icon: <Star size={18} />, title: 'Quality Guaranteed', desc: 'Premium materials, skilled hands.' },
        ].map((v, i) => (
          <div key={i} style={{ background: '#f2ede4', borderRadius: 14, padding: '1.25rem', border: '1px solid #e8dfd0' }}>
            <div style={{ color: '#c2602a', marginBottom: '0.5rem' }}>{v.icon}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#2c1810', fontSize: '0.95rem', marginBottom: '0.25rem' }}>{v.title}</div>
            <div style={{ fontSize: '0.82rem', color: '#9a8070', fontFamily: "'Lato', sans-serif" }}>{v.desc}</div>
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
      <PolicyH2>Our Products</PolicyH2>
      <PolicyDate>Crafted with care, delivered with love</PolicyDate>
      <PolicyP>Every product in the Besties Craft collection is thoughtfully designed and carefully made. From crochet bracelets and woollen flowers to personalised gifting items and hair accessories — each item is a little work of art.</PolicyP>
      <PolicyP>We work with premium quality yarns and materials to ensure that what reaches your doorstep is exactly what you imagined — and perhaps even more. All products can be customised on request.</PolicyP>
      <HighlightBox>
        Want something custom? WhatsApp us at {CONTACT_PHONE} and we'll make it just for you.
      </HighlightBox>
    </>
  );
}

function CategoriesContent() {
  return (
    <>
      <SectionLabel>Browse</SectionLabel>
      <PolicyH2>Our Categories</PolicyH2>
      <PolicyDate>Find your favourite</PolicyDate>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem', marginTop: '0.5rem' }}>
        {CATEGORIES.map((cat, i) => (
          <div key={i} style={{ background: '#f2ede4', borderRadius: 14, padding: '1.1rem 1.25rem', border: '1px solid #e8dfd0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.6rem' }}>{cat.emoji}</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: '#2c1810', fontSize: '0.95rem' }}>{cat.name}</span>
          </div>
        ))}
      </div>
    </>
  );
}

const CONTENT_MAP = {
  shipping:   <ShippingContent />,
  returns:    <ReturnsContent />,
  privacy:    <PrivacyContent />,
  terms:      <TermsContent />,
  service:    <ServiceContent />,
  refund:     <RefundContent />,
  ethos:      <EthosContent />,
  products:   <ProductsContent />,
  categories: <CategoriesContent />,
};

// ─── Main Page ─────────────────────────────────────────────────────────────

const PoliciesPage = () => {
  const [active, setActive] = useState('shipping');
  const [mobileOpen, setMobileOpen] = useState(false);

  usePageMeta({
    title: 'Policies — Besties Craft | Shipping, Returns & More',
    description: 'Read Besties Craft policies — shipping, returns, refunds, privacy, terms and conditions. Handmade products delivered pan-India.',
    url: '/policies',
  });

  const allSections = [...POLICY_SECTIONS, ...EXPLORE_SECTIONS];
  const activeLabel = allSections.find(s => s.id === active)?.label || '';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');

        :root {
          --cream: #faf7f2; --warm: #f2ede4; --sand: #e8dfd0;
          --terracotta: #c2602a; --brown: #5c3d2e;
          --dark: #2c1810; --text: #4a3728; --muted: #9a8070;
        }

        .pol-page { background: var(--cream); min-height: 100vh; display: flex; flex-direction: column; font-family: 'Lato', sans-serif; }

        /* Hero */
        .pol-hero { background: linear-gradient(135deg, var(--dark) 0%, #4a2518 60%, var(--brown) 100%); padding: 4.5rem 2rem 3.5rem; text-align: center; position: relative; overflow: hidden; }
        .pol-hero::before { content: ''; position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); pointer-events: none; }
        .pol-hero-tag { display: inline-block; background: rgba(194,96,42,0.25); color: #f4a06a; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; padding: 0.4rem 1.1rem; border-radius: 30px; border: 1px solid rgba(194,96,42,0.4); margin-bottom: 1.25rem; }
        .pol-hero h1 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; color: #fff; margin: 0 0 0.75rem; line-height: 1.15; }
        .pol-hero h1 em { color: #f4a06a; font-style: italic; }
        .pol-hero-sub { font-size: 0.98rem; color: rgba(255,255,255,0.55); max-width: 460px; margin: 0 auto; line-height: 1.7; font-weight: 300; }

        /* Layout */
        .pol-layout { max-width: 1100px; margin: 0 auto; width: 100%; display: grid; grid-template-columns: 250px 1fr; flex: 1; }

        /* Sidebar */
        .pol-sidebar { border-right: 1px solid var(--sand); padding: 2.5rem 1.5rem; position: sticky; top: 72px; height: fit-content; background: var(--cream); }
        .pol-sidebar-group { margin-bottom: 2rem; }
        .pol-sidebar-group-label { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--terracotta); margin-bottom: 0.6rem; display: block; padding-left: 0.25rem; }
        .pol-sidebar-link { display: flex; align-items: center; gap: 0.6rem; font-size: 0.88rem; color: var(--muted); padding: 0.6rem 0.75rem; border-radius: 10px; cursor: pointer; transition: all 0.18s; font-family: 'Lato', sans-serif; border: none; background: none; width: 100%; text-align: left; }
        .pol-sidebar-link:hover { color: var(--brown); background: var(--warm); }
        .pol-sidebar-link.active { color: var(--terracotta); background: rgba(194,96,42,0.08); font-weight: 700; }
        .pol-sidebar-link.active svg { color: var(--terracotta); }

        /* Content */
        .pol-content { padding: 3rem 3.5rem; min-height: 60vh; }

        /* Mobile dropdown */
        .pol-mobile-nav { display: none; background: var(--warm); border-bottom: 1px solid var(--sand); padding: 1rem 1.25rem; }
        .pol-mobile-toggle { display: flex; align-items: center; justify-content: space-between; width: 100%; background: #fff; border: 1px solid var(--sand); border-radius: 12px; padding: 0.75rem 1rem; cursor: pointer; font-size: 0.9rem; font-weight: 600; color: var(--dark); font-family: 'Lato', sans-serif; }
        .pol-mobile-dropdown { background: #fff; border: 1px solid var(--sand); border-radius: 12px; margin-top: 0.5rem; overflow: hidden; }
        .pol-mobile-group-label { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--terracotta); padding: 0.75rem 1rem 0.25rem; display: block; }
        .pol-mobile-item { display: flex; align-items: center; gap: 0.6rem; width: 100%; padding: 0.7rem 1rem; border: none; background: none; text-align: left; font-size: 0.88rem; color: var(--text); cursor: pointer; transition: background 0.15s; font-family: 'Lato', sans-serif; }
        .pol-mobile-item:hover { background: var(--warm); }
        .pol-mobile-item.active { color: var(--terracotta); font-weight: 700; background: rgba(194,96,42,0.06); }

        @media (max-width: 768px) {
          .pol-layout { grid-template-columns: 1fr; }
          .pol-sidebar { display: none; }
          .pol-mobile-nav { display: block; }
          .pol-content { padding: 2rem 1.25rem; }
        }
      `}</style>

      <div className="pol-page">
        <Navbar />

        {/* Hero */}
        <div className="pol-hero">
          <div className="pol-hero-tag">✦ Policies & Information</div>
          <h1>Everything you need<br />to <em>know</em></h1>
          <p className="pol-hero-sub">Shipping, returns, privacy and more — all our policies in one place, clearly laid out for you.</p>
        </div>

        {/* Mobile nav */}
        <div className="pol-mobile-nav">
          <button className="pol-mobile-toggle" onClick={() => setMobileOpen(o => !o)}>
            <span>{activeLabel}</span>
            <ChevronRight size={16} style={{ transform: mobileOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
          {mobileOpen && (
            <div className="pol-mobile-dropdown">
              <span className="pol-mobile-group-label">Explore</span>
              {EXPLORE_SECTIONS.map(s => (
                <button key={s.id} className={`pol-mobile-item${active === s.id ? ' active' : ''}`}
                  onClick={() => { setActive(s.id); setMobileOpen(false); }}>
                  {s.icon} {s.label}
                </button>
              ))}
              <span className="pol-mobile-group-label">Besties Craft Policies</span>
              {POLICY_SECTIONS.map(s => (
                <button key={s.id} className={`pol-mobile-item${active === s.id ? ' active' : ''}`}
                  onClick={() => { setActive(s.id); setMobileOpen(false); }}>
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pol-layout">
          {/* Desktop sidebar */}
          <aside className="pol-sidebar">
            <div className="pol-sidebar-group">
              <span className="pol-sidebar-group-label">Explore</span>
              {EXPLORE_SECTIONS.map(s => (
                <button key={s.id} className={`pol-sidebar-link${active === s.id ? ' active' : ''}`}
                  onClick={() => setActive(s.id)}>
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
            <div className="pol-sidebar-group">
              <span className="pol-sidebar-group-label">Besties Craft Policies</span>
              {POLICY_SECTIONS.map(s => (
                <button key={s.id} className={`pol-sidebar-link${active === s.id ? ' active' : ''}`}
                  onClick={() => setActive(s.id)}>
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Content */}
          <main className="pol-content">
            {CONTENT_MAP[active]}
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default PoliciesPage;
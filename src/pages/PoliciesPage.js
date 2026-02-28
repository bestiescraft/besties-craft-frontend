import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const PHONE = '+91 88107 76486';
const EMAIL = 'bestiescraft1434@gmail.com';

// ── SEO meta injected directly — no hook dependency that can crash ──
function PageMeta({ title, description, url }) {
  useEffect(() => {
    try {
      // Title
      document.title = title;

      // Helper to upsert a <meta> tag
      const setMeta = (selector, attr, value) => {
        let el = document.querySelector(selector);
        if (!el) {
          el = document.createElement('meta');
          document.head.appendChild(el);
        }
        el.setAttribute(attr, value);
      };

      // Standard SEO
      setMeta('meta[name="description"]',           'content',  description);
      setMeta('meta[name="keywords"]',              'content',
        'handmade crochet, crochet bracelets India, woollen flowers, handmade gifts India, keychains, hair accessories, gifting items, Besties Craft, buy crochet online India, handmade jewelry India, crochet gifts Varanasi');
      setMeta('meta[name="robots"]',                'content',  'index, follow');
      setMeta('meta[name="author"]',                'content',  'Besties Craft');

      // Open Graph (Facebook/WhatsApp preview)
      setMeta('meta[property="og:title"]',          'content',  title);
      setMeta('meta[property="og:description"]',    'content',  description);
      setMeta('meta[property="og:type"]',           'content',  'website');
      setMeta('meta[property="og:url"]',            'content',  'https://besties-craft-frontend.vercel.app' + url);
      setMeta('meta[property="og:site_name"]',      'content',  'Besties Craft');
      setMeta('meta[property="og:locale"]',         'content',  'en_IN');

      // Twitter card
      setMeta('meta[name="twitter:card"]',          'content',  'summary_large_image');
      setMeta('meta[name="twitter:title"]',         'content',  title);
      setMeta('meta[name="twitter:description"]',   'content',  description);

      // Canonical
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', 'https://besties-craft-frontend.vercel.app' + url);
    } catch (e) {
      // silently fail — never crash the page
    }
  }, [title, description, url]);

  return null;
}

/* ─── shared UI helpers ──────────────────────────────────────── */
const SecLabel = ({ t }) => (
  <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#c2602a', marginBottom: '0.7rem', display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ display: 'inline-block', width: 20, height: 2, background: '#c2602a', borderRadius: 2 }} />{t}
  </p>
);
const H2 = ({ t }) => (
  <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(1.45rem,3vw,1.85rem)', fontWeight: 700, color: '#2c1810', margin: '0 0 0.3rem', lineHeight: 1.2 }}>{t}</h2>
);
const DateStr = ({ t }) => (
  <p style={{ fontSize: '0.68rem', color: '#9a8070', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 1.6rem', paddingBottom: '1.4rem', borderBottom: '1px solid #e8dfd0' }}>{t}</p>
);
const H3 = ({ t }) => (
  <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '1rem', fontWeight: 700, color: '#5c3d2e', margin: '1.6rem 0 0.45rem' }}>{t}</h3>
);
const P = ({ children }) => (
  <p style={{ fontSize: '0.92rem', color: '#4a3728', lineHeight: 1.85, marginBottom: '0.7rem', fontFamily: 'Lato,sans-serif', fontWeight: 300 }}>{children}</p>
);
const Ul = ({ items }) => (
  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 0.9rem' }}>
    {items.map((it, i) => (
      <li key={i} style={{ display: 'flex', gap: 8, fontSize: '0.92rem', color: '#4a3728', lineHeight: 1.8, fontFamily: 'Lato,sans-serif', fontWeight: 300, marginBottom: 2 }}>
        <span style={{ color: '#c2602a', flexShrink: 0 }}>—</span><span>{it}</span>
      </li>
    ))}
  </ul>
);
const Box = ({ children }) => (
  <div style={{ background: '#f2ede4', borderLeft: '3px solid #c2602a', padding: '0.9rem 1.2rem', margin: '1.2rem 0', borderRadius: '0 8px 8px 0' }}>
    <p style={{ fontSize: '0.87rem', color: '#4a3728', lineHeight: 1.8, margin: 0, fontFamily: 'Lato,sans-serif', whiteSpace: 'pre-line' }}>{children}</p>
  </div>
);

/* ─── sections ───────────────────────────────────────────────── */
function Shipping() {
  return (
    <div>
      <SecLabel t="Besties Craft Policy" />
      <H2 t="Shipping Policy" />
      <DateStr t="Last updated — February 2026" />
      <P>At Besties Craft, every order is packed with care to ensure it reaches you safely and beautifully.</P>
      <H3 t="Processing Time" />
      <P>All orders are processed within 2–4 business days. Orders placed on weekends or public holidays are processed the next working day.</P>
      <H3 t="Delivery Timelines" />
      <Ul items={['Standard Delivery: 5–8 business days', 'Express Delivery: 2–4 business days']} />
      <H3 t="Shipping Charges" />
      <P>Shipping charges are calculated based on your pin code and shown at checkout. <strong>Free shipping on all orders above ₹999</strong> — applied automatically, no coupon needed.</P>
      <Box>Once your order is dispatched, you will receive a tracking number via SMS. Allow 24 hours for tracking to activate.</Box>
    </div>
  );
}

function Returns() {
  return (
    <div>
      <SecLabel t="Besties Craft Policy" />
      <H2 t="Returns & Refunds" />
      <DateStr t="Last updated — February 2026" />
      <P>Returns are accepted strictly for wrong or damaged products only.</P>
      <H3 t="Return Window" />
      <P>Returns must be reported within <strong>48 hours of delivery</strong>. Claims after this window are not eligible.</P>
      <H3 t="Eligible Reasons" />
      <Ul items={['Wrong product delivered', 'Product received in damaged condition']} />
      <H3 t="Non-Returnable Items" />
      <Ul items={['Customised or personalised products', 'Items marked as Final Sale', 'Gift cards', 'Items reported after 48 hours of delivery']} />
      <H3 t="How to Initiate" />
      <P>Contact us within 48 hours with your order number, issue description, and clear photos of the product received.</P>
      <Box>{'📱 WhatsApp: ' + PHONE + '\n✉️ Email: ' + EMAIL + '\n\nApproved refunds are processed within 5–7 business days.'}</Box>
    </div>
  );
}

function Privacy() {
  return (
    <div>
      <SecLabel t="Besties Craft Policy" />
      <H2 t="Privacy Policy" />
      <DateStr t="Last updated — February 2026" />
      <P>This policy explains how Besties Craft collects, uses, and protects your personal information.</P>
      <H3 t="Information We Collect" />
      <Ul items={['Name, email address, and contact number', 'Shipping and billing address', 'Payment info (processed securely via Razorpay)', 'Browsing behaviour on our website']} />
      <H3 t="How We Use It" />
      <P>We use your data to process orders, send updates, and improve our services. We never sell your data to third parties.</P>
      <H3 t="Data Security" />
      <P>All payments go through Razorpay's PCI-DSS compliant gateway. We implement industry-standard security to protect your information.</P>
      <Box>To request access, correction, or deletion of your data, contact us via the details below.</Box>
    </div>
  );
}

function Terms() {
  return (
    <div>
      <SecLabel t="Besties Craft Policy" />
      <H2 t="Terms & Conditions" />
      <DateStr t="Last updated — February 2026" />
      <P>By accessing or ordering from Besties Craft, you agree to these terms. Please read carefully.</P>
      <H3 t="Acceptance" />
      <P>We may update these terms at any time. Continued use of our site constitutes acceptance of the revised terms.</P>
      <H3 t="Products & Pricing" />
      <P>All prices are inclusive of applicable taxes unless stated otherwise. We reserve the right to correct errors without prior notice.</P>
      <H3 t="Intellectual Property" />
      <P>All content — images, designs, logos, text — belongs to Besties Craft. Reproduction without written permission is prohibited.</P>
      <H3 t="Limitation of Liability" />
      <P>Our liability is limited to the value of the order placed. We are not liable for indirect or consequential damages.</P>
      <Box>These terms are governed by Indian law. Disputes are subject to courts in Varanasi, Uttar Pradesh.</Box>
      <H3 t="Contact" />
      <P>Reach us at <strong>{EMAIL}</strong> or WhatsApp <strong>{PHONE}</strong>.</P>
    </div>
  );
}

function Service() {
  return (
    <div>
      <SecLabel t="Besties Craft Policy" />
      <H2 t="Terms of Service" />
      <DateStr t="Last updated — February 2026" />
      <P>These Terms of Service govern the use of the Besties Craft website and services.</P>
      <H3 t="Account Responsibility" />
      <P>You are responsible for maintaining the confidentiality of your account and all activities under it.</P>
      <H3 t="Prohibited Activities" />
      <Ul items={['Using the site for unlawful purposes', 'Unauthorised access to our systems', 'Scraping or reproducing website content', 'Submitting false or fraudulent orders']} />
      <H3 t="Order Acceptance" />
      <P>Placing an order is not a binding contract. We may accept or decline orders at our discretion and will notify you accordingly.</P>
      <H3 t="Amendments" />
      <P>We may revise these terms at any time. Continued use after changes means you accept the updated terms.</P>
      <Box>{'Questions?\n📱 ' + PHONE + '\n✉️ ' + EMAIL}</Box>
    </div>
  );
}

function Refund() {
  return (
    <div>
      <SecLabel t="Besties Craft Policy" />
      <H2 t="Refund Policy" />
      <DateStr t="Last updated — February 2026" />
      <P>Refunds are issued when an error on our part has occurred. We aim to resolve all issues fairly and promptly.</P>
      <H3 t="Eligible for Refund" />
      <Ul items={['Items received damaged or defective', 'Wrong item delivered', 'Order not delivered within 15 business days']} />
      <H3 t="Refund Timeline" />
      <P>Once approved, refunds are processed within 5–7 business days to the original payment method.</P>
      <Box>UPI and wallets: refunded in 24–48 hours. Bank transfers: up to 7 business days.</Box>
      <H3 t="Not Eligible" />
      <Ul items={['Change of mind after 48-hour return window', 'Damage due to customer misuse', 'Customised or personalised orders', 'Claims raised after 48 hours of delivery']} />
      <H3 t="How to Request" />
      <P>Contact us within 48 hours — WhatsApp <strong>{PHONE}</strong> or email <strong>{EMAIL}</strong> — with your order number and photos.</P>
    </div>
  );
}

function Ethos() {
  return (
    <div>
      <SecLabel t="Who We Are" />
      <H2 t="Our Ethos" />
      <DateStr t="The Besties Craft Story" />
      <P>Besties Craft was born from a deep love for handmade things — made with patience, care, and joy tucked into every stitch and fold.</P>
      <P>We believe craft is more than a product; it is a conversation between maker and recipient. Every piece carries intention, warmth, and the unmistakable touch of human hands.</P>
      <P>Our commitment: beautifully crafted goods that bring a smile, spark creativity, and last beyond fleeting trends. No factories, no shortcuts — crafted with love in Varanasi.</P>
    </div>
  );
}

function Products() {
  return (
    <div>
      <SecLabel t="What We Make" />
      <H2 t="Our Products" />
      <DateStr t="Crafted with care, delivered with love" />
      <P>From crochet bracelets and woollen flowers to personalised gifting items and hair accessories — every item is made by hand with love.</P>
      <P>We use premium quality materials so that what reaches your doorstep is exactly what you imagined. All products can be customised on request.</P>
      <Box>{'Want something custom?\nWhatsApp us at ' + PHONE}</Box>
    </div>
  );
}

function Categories() {
  const cats = [
    ['📿','Bracelets'], ['🌸','Handmade Flowers'], ['🔑','Keychains'],
    ['🎀','Hair Accessories'], ['🎁','Gifting Items'], ['🎨','Crafts'],
  ];
  return (
    <div>
      <SecLabel t="Browse" />
      <H2 t="Our Categories" />
      <DateStr t="Find your favourite" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.75rem' }}>
        {cats.map(([em, name], i) => (
          <div key={i} style={{ background: '#f2ede4', borderRadius: 12, padding: '1rem 1.1rem', border: '1px solid #e8dfd0', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{em}</span>
            <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 600, color: '#2c1810', fontSize: '0.92rem' }}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Section({ id }) {
  if (id === 'shipping')   return <Shipping />;
  if (id === 'returns')    return <Returns />;
  if (id === 'privacy')    return <Privacy />;
  if (id === 'terms')      return <Terms />;
  if (id === 'service')    return <Service />;
  if (id === 'refund')     return <Refund />;
  if (id === 'ethos')      return <Ethos />;
  if (id === 'products')   return <Products />;
  if (id === 'categories') return <Categories />;
  return <Shipping />;
}

const NAV = [
  { group: 'Explore', items: [
    { id: 'ethos',      label: 'Our Ethos'      },
    { id: 'products',   label: 'Our Products'   },
    { id: 'categories', label: 'Our Categories' },
  ]},
  { group: 'Besties Craft Policies', items: [
    { id: 'shipping', label: 'Shipping Policy'    },
    { id: 'returns',  label: 'Returns & Refunds'  },
    { id: 'privacy',  label: 'Privacy Policy'     },
    { id: 'terms',    label: 'Terms & Conditions' },
    { id: 'service',  label: 'Terms of Service'   },
    { id: 'refund',   label: 'Refund Policy'      },
  ]},
];

/* ─── main export ────────────────────────────────────────────── */
export default function PoliciesPage() {
  const [active, setActive] = useState('shipping');
  const [open,   setOpen]   = useState(false);

  const allItems = NAV.flatMap(g => g.items);
  const label    = allItems.find(s => s.id === active)?.label || 'Policies';
  const pick     = (id) => { setActive(id); setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <>
      {/* ── SEO — fully self-contained, never crashes ── */}
      <PageMeta
        title="Besties Craft Policies — Shipping, Returns & Refunds | Handmade Crochet India"
        description="Read all Besties Craft policies: shipping charges, return & refund policy, privacy policy and terms. 100% handmade crochet bracelets, keychains & gifts. Pan-India delivery."
        url="/policies"
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        .pp-page { background:#faf7f2; min-height:100vh; display:flex; flex-direction:column; font-family:Lato,sans-serif; }
        .pp-hero { background:linear-gradient(135deg,#2c1810 0%,#4a2518 60%,#5c3d2e 100%); padding:3.5rem 2rem 2.5rem; text-align:center; }
        .pp-hero h1 { font-family:'Playfair Display',Georgia,serif; font-size:clamp(1.7rem,4vw,2.6rem); font-weight:700; color:#fff; margin:0 0 0.6rem; line-height:1.15; }
        .pp-hero h1 em { color:#f4a06a; font-style:italic; }
        .pp-hero-tag { display:inline-block; background:rgba(194,96,42,0.22); color:#f4a06a; font-size:0.68rem; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; padding:0.35rem 0.9rem; border-radius:30px; border:1px solid rgba(194,96,42,0.4); margin-bottom:1rem; }
        .pp-hero p { font-size:0.92rem; color:rgba(255,255,255,0.5); max-width:400px; margin:0 auto; line-height:1.7; }
        .pp-body { max-width:1060px; margin:0 auto; width:100%; display:flex; flex:1; }
        .pp-side { width:220px; flex-shrink:0; border-right:1px solid #e8dfd0; padding:1.75rem 1.1rem; position:sticky; top:72px; height:fit-content; }
        .pp-grp  { margin-bottom:1.5rem; }
        .pp-grp-lbl { font-size:0.6rem; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:#c2602a; display:block; margin-bottom:0.45rem; padding-left:0.2rem; }
        .pp-btn { display:block; width:100%; text-align:left; background:none; border:none; cursor:pointer; font-family:Lato,sans-serif; font-size:0.84rem; color:#9a8070; padding:0.5rem 0.6rem; border-radius:7px; transition:all 0.14s; }
        .pp-btn:hover { color:#5c3d2e; background:#f2ede4; }
        .pp-btn.on { color:#c2602a; background:rgba(194,96,42,0.09); font-weight:700; }
        .pp-main { flex:1; padding:2.25rem 2.75rem; min-height:55vh; }
        .pp-mob { display:none; background:#f2ede4; border-bottom:1px solid #e8dfd0; padding:0.8rem 1.1rem; }
        .pp-mob-toggle { display:flex; align-items:center; justify-content:space-between; width:100%; background:#fff; border:1px solid #e8dfd0; border-radius:9px; padding:0.65rem 0.95rem; cursor:pointer; font-size:0.86rem; font-weight:600; color:#2c1810; font-family:Lato,sans-serif; }
        .pp-mob-drop { background:#fff; border:1px solid #e8dfd0; border-radius:9px; margin-top:0.35rem; overflow:hidden; }
        .pp-mob-glbl { font-size:0.58rem; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:#c2602a; padding:0.6rem 0.95rem 0.15rem; display:block; }
        .pp-mob-item { display:block; width:100%; text-align:left; background:none; border:none; padding:0.6rem 0.95rem; font-size:0.84rem; color:#4a3728; cursor:pointer; font-family:Lato,sans-serif; transition:background 0.12s; }
        .pp-mob-item:hover { background:#f2ede4; }
        .pp-mob-item.on { color:#c2602a; font-weight:700; background:rgba(194,96,42,0.06); }
        @media(max-width:768px){
          .pp-body { flex-direction:column; }
          .pp-side { display:none; }
          .pp-mob  { display:block; }
          .pp-main { padding:1.5rem 1.1rem; }
        }
      `}</style>

      <div className="pp-page">
        <Navbar />

        <div className="pp-hero">
          <div className="pp-hero-tag">✦ Policies & Information</div>
          <h1>Everything you need<br />to <em>know</em></h1>
          <p>Shipping, returns, privacy and more — clearly laid out for you.</p>
        </div>

        {/* mobile */}
        <div className="pp-mob">
          <button className="pp-mob-toggle" onClick={() => setOpen(o => !o)}>
            <span>{label}</span>
            <span style={{ fontSize: 11 }}>{open ? '▲' : '▼'}</span>
          </button>
          {open && (
            <div className="pp-mob-drop">
              {NAV.map(g => (
                <div key={g.group}>
                  <span className="pp-mob-glbl">{g.group}</span>
                  {g.items.map(s => (
                    <button key={s.id} className={`pp-mob-item${active === s.id ? ' on' : ''}`} onClick={() => pick(s.id)}>
                      {s.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pp-body">
          <aside className="pp-side">
            {NAV.map(g => (
              <div key={g.group} className="pp-grp">
                <span className="pp-grp-lbl">{g.group}</span>
                {g.items.map(s => (
                  <button key={s.id} className={`pp-btn${active === s.id ? ' on' : ''}`} onClick={() => pick(s.id)}>
                    {s.label}
                  </button>
                ))}
              </div>
            ))}
          </aside>

          <main className="pp-main">
            <Section id={active} />
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
}
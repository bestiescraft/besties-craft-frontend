import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const PHONE = '+91 88107 76486';
const EMAIL = 'bestiescraft1434@gmail.com';

function SEO() {
  useEffect(() => {
    try {
      document.title = 'Policies — Besties Craft | Shipping, Returns & Refunds | Handmade Crochet India';
      const set = (sel, val) => {
        let m = document.querySelector(sel);
        if (!m) { m = document.createElement('meta'); document.head.appendChild(m); }
        const attr = sel.includes('property') ? 'property' : 'name';
        if (!m.getAttribute(attr)) m.setAttribute(attr, sel.match(/["']([^"']+)["']/)[1]);
        m.setAttribute('content', val);
      };
      set('meta[name="description"]', 'Read Besties Craft policies: free shipping above Rs 999, 48-hour return window, refund process and privacy terms. 100% handmade crochet products delivered pan-India.');
      set('meta[name="keywords"]', 'handmade crochet bracelets India, crochet gifts online India, woollen flowers buy online, handmade keychains India, Besties Craft policies, crochet gifts Varanasi');
      set('meta[name="robots"]', 'index, follow');
      set('meta[name="author"]', 'Besties Craft');
      set('meta[property="og:title"]', 'Policies — Besties Craft | Handmade Crochet India');
      set('meta[property="og:description"]', 'Shipping, returns, refunds and privacy policies for Besties Craft — handmade crochet products pan-India.');
      set('meta[property="og:type"]', 'website');
      set('meta[property="og:locale"]', 'en_IN');
      let c = document.querySelector('link[rel="canonical"]');
      if (!c) { c = document.createElement('link'); c.rel = 'canonical'; document.head.appendChild(c); }
      c.href = 'https://www.bestiescraft.in/policies';
    } catch (_) {}
  }, []);
  return null;
}

const Tag = ({ t }) => (
  <p style={{ fontSize: '0.67rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#c2602a', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ display: 'inline-block', width: 18, height: 2, background: '#c2602a', borderRadius: 2, flexShrink: 0 }} />{t}
  </p>
);
const Title = ({ t }) => (
  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 700, color: '#2c1810', margin: '0 0 0.3rem', lineHeight: 1.2 }}>{t}</h2>
);
const Sub = ({ t }) => (
  <p style={{ fontSize: '0.67rem', color: '#9a8070', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 1.5rem', paddingBottom: '1.4rem', borderBottom: '1px solid #e8dfd0', fontFamily: 'Lato, sans-serif' }}>{t}</p>
);
const H3 = ({ t }) => (
  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '0.98rem', fontWeight: 700, color: '#5c3d2e', margin: '1.5rem 0 0.4rem' }}>{t}</h3>
);
const P = ({ children }) => (
  <p style={{ fontSize: '0.91rem', color: '#4a3728', lineHeight: 1.85, marginBottom: '0.65rem', fontFamily: 'Lato, sans-serif', fontWeight: 300 }}>{children}</p>
);
const List = ({ items }) => (
  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 0.85rem' }}>
    {items.map((it, i) => (
      <li key={i} style={{ display: 'flex', gap: 8, fontSize: '0.91rem', color: '#4a3728', lineHeight: 1.8, fontFamily: 'Lato, sans-serif', fontWeight: 300, marginBottom: 2 }}>
        <span style={{ color: '#c2602a', flexShrink: 0 }}>—</span><span>{it}</span>
      </li>
    ))}
  </ul>
);
const Callout = ({ children }) => (
  <div style={{ background: '#f2ede4', borderLeft: '3px solid #c2602a', padding: '0.85rem 1.15rem', margin: '1.1rem 0', borderRadius: '0 8px 8px 0' }}>
    <p style={{ fontSize: '0.86rem', color: '#4a3728', lineHeight: 1.8, margin: 0, fontFamily: 'Lato, sans-serif', whiteSpace: 'pre-line' }}>{children}</p>
  </div>
);

function Shipping() {
  return (
    <div>
      <Tag t="Besties Craft Policy" />
      <Title t="Shipping Policy" />
      <Sub t="Last updated — February 2026" />
      <P>At Besties Craft, every order is carefully packed with love to ensure it reaches you safely and beautifully.</P>
      <H3 t="Processing Time" />
      <P>All orders are processed within 2–4 business days. Orders placed on weekends or public holidays are processed on the next working day.</P>
      <H3 t="Delivery Timelines" />
      <List items={['Standard Delivery: 5–8 business days', 'Express Delivery: 2–4 business days']} />
      <H3 t="Shipping Charges" />
      <P>Shipping charges are calculated based on your pin code and shown at checkout. <strong>Free standard shipping on all orders above ₹999</strong> — applied automatically, no coupon needed.</P>
      <Callout>Once your order is dispatched, you will receive a tracking number via SMS. Allow 24 hours for tracking to activate.</Callout>
    </div>
  );
}

function Returns() {
  return (
    <div>
      <Tag t="Besties Craft Policy" />
      <Title t="Returns & Refunds" />
      <Sub t="Last updated — February 2026" />
      <P>We stand behind every product we send. Returns are accepted strictly for wrong or damaged products only.</P>
      <H3 t="Return Window" />
      <P>Returns must be reported within <strong>48 hours of delivery</strong>. Claims raised after this window will not be eligible.</P>
      <H3 t="Eligible Reasons for Return" />
      <List items={['Wrong product delivered', 'Product received in damaged condition']} />
      <H3 t="Non-Returnable Items" />
      <List items={['Customised or personalised products', 'Items marked as Final Sale', 'Gift cards', 'Items reported after the 48-hour window']} />
      <H3 t="How to Initiate a Return" />
      <P>Contact us within 48 hours with your order number, issue description, and clear photos of the product received.</P>
      <Callout>{'📱 WhatsApp: ' + PHONE + '\n✉️ Email: ' + EMAIL + '\n\nApproved refunds processed within 5–7 business days.'}</Callout>
    </div>
  );
}

function Privacy() {
  return (
    <div>
      <Tag t="Besties Craft Policy" />
      <Title t="Privacy Policy" />
      <Sub t="Last updated — February 2026" />
      <P>This policy explains how Besties Craft collects, uses, and protects your personal information.</P>
      <H3 t="Information We Collect" />
      <List items={['Name, email address, and contact number', 'Shipping and billing address', 'Payment information (processed securely via Razorpay)', 'Browsing behaviour on our website']} />
      <H3 t="How We Use Your Information" />
      <P>We use your data to process orders, send updates, and improve our services. We never sell your data to third parties.</P>
      <H3 t="Data Security" />
      <P>All payments go through Razorpay's PCI-DSS compliant gateway. We implement industry-standard security to protect your information at all times.</P>
      <Callout>To request access, correction, or deletion of your personal data, contact us via the details below.</Callout>
    </div>
  );
}

function Terms() {
  return (
    <div>
      <Tag t="Besties Craft Policy" />
      <Title t="Terms & Conditions" />
      <Sub t="Last updated — February 2026" />
      <P>By accessing or placing an order on Besties Craft, you agree to be bound by the following terms. Please read them carefully.</P>
      <H3 t="Acceptance of Terms" />
      <P>We may update these terms at any time. Continued use of our site constitutes acceptance of the revised terms.</P>
      <H3 t="Products & Pricing" />
      <P>All prices are inclusive of applicable taxes unless stated otherwise. We reserve the right to correct errors without prior notice.</P>
      <H3 t="Intellectual Property" />
      <P>All content — images, designs, logos, text — belongs to Besties Craft. Reproduction without written permission is strictly prohibited.</P>
      <H3 t="Limitation of Liability" />
      <P>Our liability is limited to the value of the order placed. We are not liable for indirect or consequential damages.</P>
      <Callout>These terms are governed by Indian law. Disputes are subject to courts in Varanasi, Uttar Pradesh.</Callout>
      <H3 t="Contact" />
      <P>Reach us at <strong>{EMAIL}</strong> or WhatsApp <strong>{PHONE}</strong>.</P>
    </div>
  );
}

function Service() {
  return (
    <div>
      <Tag t="Besties Craft Policy" />
      <Title t="Terms of Service" />
      <Sub t="Last updated — February 2026" />
      <P>These Terms of Service govern the use of the Besties Craft website and all related services.</P>
      <H3 t="Account Responsibility" />
      <P>You are responsible for maintaining the confidentiality of your account and all activities under it.</P>
      <H3 t="Prohibited Activities" />
      <List items={['Using the site for unlawful purposes', 'Unauthorised access to our systems', 'Scraping or reproducing website content', 'Submitting false or fraudulent orders']} />
      <H3 t="Order Acceptance" />
      <P>Placing an order is not a binding contract. We may accept or decline any order at our discretion.</P>
      <H3 t="Amendments" />
      <P>We may revise these terms at any time. Continued use after changes means you accept the updated terms.</P>
      <Callout>{'Questions?\n📱 ' + PHONE + '\n✉️ ' + EMAIL}</Callout>
    </div>
  );
}

function Refund() {
  return (
    <div>
      <Tag t="Besties Craft Policy" />
      <Title t="Refund Policy" />
      <Sub t="Last updated — February 2026" />
      <P>Refunds are issued when an error on our part has occurred. We aim to resolve all issues fairly and promptly.</P>
      <H3 t="Eligible for Refund" />
      <List items={['Items received damaged or defective', 'Wrong item delivered', 'Order not delivered within 15 business days']} />
      <H3 t="Refund Timeline" />
      <P>Approved refunds are processed within 5–7 business days to the original payment method.</P>
      <Callout>UPI and wallet payments: refunded in 24–48 hours. Bank transfers: up to 7 business days.</Callout>
      <H3 t="Not Eligible" />
      <List items={['Change of mind after the 48-hour return window', 'Products damaged due to customer misuse', 'Customised or personalised orders', 'Claims raised after 48 hours of delivery']} />
      <H3 t="How to Request" />
      <P>Contact us within 48 hours — WhatsApp <strong>{PHONE}</strong> or email <strong>{EMAIL}</strong> — with your order number and photos.</P>
    </div>
  );
}

function Ethos() {
  return (
    <div>
      <Tag t="Who We Are" />
      <Title t="Our Ethos" />
      <Sub t="The Besties Craft Story" />
      <P>Besties Craft was born from a deep love for handmade things — made with patience, care, and joy tucked into every stitch and fold.</P>
      <P>We believe craft is more than a product; it is a conversation between maker and recipient. Every piece carries intention, warmth, and the unmistakable touch of human hands.</P>
      <P>No factories, no shortcuts — just skill, love, and handmade goodness crafted in Varanasi, India.</P>
    </div>
  );
}

function Products() {
  return (
    <div>
      <Tag t="What We Make" />
      <Title t="Our Products" />
      <Sub t="Crafted with care, delivered with love" />
      <P>From crochet bracelets and woollen flowers to personalised gifting items and hair accessories — every item is made by hand using premium quality materials.</P>
      <P>All products can be customised — choose your colours, add a name, or specify an occasion.</P>
      <Callout>{'Want something custom? WhatsApp us at ' + PHONE}</Callout>
    </div>
  );
}

function Categories() {
  const cats = [
    ['📿','Bracelets'],['🌸','Handmade Flowers'],['🔑','Keychains'],
    ['🎀','Hair Accessories'],['🎁','Gifting Items'],['🎨','Crafts'],
  ];
  return (
    <div>
      <Tag t="Browse" />
      <Title t="Our Categories" />
      <Sub t="Find your favourite" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.7rem' }}>
        {cats.map(([em, name], i) => (
          <div key={i} style={{ background: '#f2ede4', borderRadius: 10, padding: '0.9rem 1rem', border: '1px solid #e8dfd0', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.4rem' }}>{em}</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: '#2c1810', fontSize: '0.9rem' }}>{name}</span>
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
    { id: 'ethos', label: 'Our Ethos' },
    { id: 'products', label: 'Our Products' },
    { id: 'categories', label: 'Our Categories' },
  ]},
  { group: 'Besties Craft Policies', items: [
    { id: 'shipping', label: 'Shipping Policy' },
    { id: 'returns',  label: 'Returns & Refunds' },
    { id: 'privacy',  label: 'Privacy Policy' },
    { id: 'terms',    label: 'Terms & Conditions' },
    { id: 'service',  label: 'Terms of Service' },
    { id: 'refund',   label: 'Refund Policy' },
  ]},
];

export default function PoliciesPage() {
  const [active, setActive] = useState('shipping');
  const [open,   setOpen]   = useState(false);

  const allItems = NAV.flatMap(g => g.items);
  const label    = allItems.find(s => s.id === active)?.label || 'Select Policy';
  const pick     = (id) => { setActive(id); setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <>
      <SEO />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        .pp { background:#faf7f2; min-height:100vh; display:flex; flex-direction:column; font-family:Lato,sans-serif; }
        .pp-hero { background:linear-gradient(135deg,#2c1810 0%,#4a2518 60%,#5c3d2e 100%); padding:3.5rem 2rem 2.5rem; text-align:center; }
        .pp-badge { display:inline-block; background:rgba(194,96,42,0.22); color:#f4a06a; font-size:0.67rem; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; padding:0.32rem 0.85rem; border-radius:30px; border:1px solid rgba(194,96,42,0.38); margin-bottom:0.9rem; }
        .pp-hero h1 { font-family:'Playfair Display',Georgia,serif; font-size:clamp(1.65rem,4vw,2.5rem); font-weight:700; color:#fff; margin:0 0 0.55rem; line-height:1.15; }
        .pp-hero h1 em { color:#f4a06a; font-style:italic; }
        .pp-hero p { font-size:0.9rem; color:rgba(255,255,255,0.48); max-width:380px; margin:0 auto; line-height:1.7; }
        .pp-wrap { max-width:1040px; margin:0 auto; width:100%; display:flex; flex:1; }
        .pp-side { width:210px; flex-shrink:0; border-right:1px solid #e8dfd0; padding:1.6rem 1rem; position:sticky; top:72px; height:fit-content; background:#faf7f2; }
        .pp-grp { margin-bottom:1.4rem; }
        .pp-gl { font-size:0.58rem; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:#c2602a; display:block; margin-bottom:0.4rem; padding-left:0.15rem; }
        .pp-lnk { display:block; width:100%; text-align:left; background:none; border:none; cursor:pointer; font-family:Lato,sans-serif; font-size:0.83rem; color:#9a8070; padding:0.48rem 0.55rem; border-radius:7px; transition:all 0.13s; line-height:1.4; }
        .pp-lnk:hover { color:#5c3d2e; background:#f2ede4; }
        .pp-lnk.act { color:#c2602a; background:rgba(194,96,42,0.09); font-weight:700; }
        .pp-main { flex:1; padding:2.2rem 2.6rem; min-height:55vh; }
        .pp-mob { display:none; background:#f2ede4; border-bottom:1px solid #e8dfd0; padding:0.75rem 1rem; position:relative; z-index:50; }
        .pp-mob-btn { display:flex; align-items:center; justify-content:space-between; width:100%; background:#fff; border:1px solid #e8dfd0; border-radius:9px; padding:0.62rem 0.9rem; cursor:pointer; font-size:0.85rem; font-weight:600; color:#2c1810; font-family:Lato,sans-serif; }
        .pp-mob-drop { position:absolute; top:100%; left:1rem; right:1rem; background:#fff; border:1px solid #e8dfd0; border-radius:10px; box-shadow:0 8px 24px rgba(44,24,16,0.12); z-index:100; overflow:hidden; }
        .pp-mob-gl { font-size:0.57rem; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:#c2602a; padding:0.55rem 0.9rem 0.12rem; display:block; }
        .pp-mob-it { display:block; width:100%; text-align:left; background:none; border:none; padding:0.58rem 0.9rem; font-size:0.83rem; color:#4a3728; cursor:pointer; font-family:Lato,sans-serif; transition:background 0.11s; }
        .pp-mob-it:hover { background:#f2ede4; }
        .pp-mob-it.act { color:#c2602a; font-weight:700; background:rgba(194,96,42,0.06); }
        @media(max-width:768px){ .pp-wrap{flex-direction:column;} .pp-side{display:none;} .pp-mob{display:block;} .pp-main{padding:1.4rem 1rem;} }
      `}</style>

      <div className="pp">
        <Navbar />
        <div className="pp-hero">
          <div className="pp-badge">✦ Policies & Information</div>
          <h1>Everything you need<br />to <em>know</em></h1>
          <p>Shipping, returns, privacy and more — clearly laid out for you.</p>
        </div>

        <div className="pp-mob">
          <button className="pp-mob-btn" onClick={() => setOpen(o => !o)}>
            <span>{label}</span>
            <span style={{ fontSize: 10 }}>{open ? '▲' : '▼'}</span>
          </button>
          {open && (
            <div className="pp-mob-drop">
              {NAV.map(g => (
                <div key={g.group}>
                  <span className="pp-mob-gl">{g.group}</span>
                  {g.items.map(s => (
                    <button key={s.id} className={'pp-mob-it' + (active === s.id ? ' act' : '')} onClick={() => pick(s.id)}>{s.label}</button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pp-wrap">
          <aside className="pp-side">
            {NAV.map(g => (
              <div key={g.group} className="pp-grp">
                <span className="pp-gl">{g.group}</span>
                {g.items.map(s => (
                  <button key={s.id} className={'pp-lnk' + (active === s.id ? ' act' : '')} onClick={() => pick(s.id)}>{s.label}</button>
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
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Heart, Sparkles, Phone, Mail, Shield, Leaf, Award, Clock } from 'lucide-react';
import usePageMeta from '@/hooks/usePageMeta';

const AboutPage = () => {
  usePageMeta({
    title: 'About Us — Besties Craft | Handmade Crochet with Love in Varanasi, India',
    description:
      'Learn the story behind Besties Craft — handmade crochet bracelets, woollen flowers, keychains and gifting items crafted with love in Varanasi, India. 100% handmade, fully customisable, pan-India delivery.',
    url: '/about',
  });

  // ── Inline structured data for the About page ──────────────────
  const aboutSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Besties Craft',
    url: 'https://www.bestiescraft.in/about',
    description:
      'Besties Craft makes 100% handmade crochet bracelets, woollen flowers, keychains, hair accessories and gifting items in Varanasi, India. Custom orders welcome. Pan-India delivery.',
    mainEntity: {
      '@type': 'Organization',
      name: 'Besties Craft',
      url: 'https://www.bestiescraft.in',
      foundingDate: '2025',
      description:
        'Handmade crochet and woollen products crafted with love in Varanasi, Uttar Pradesh, India.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Varanasi',
        addressRegion: 'Uttar Pradesh',
        postalCode: '221007',
        addressCountry: 'IN',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-8810776486',
        contactType: 'customer service',
        email: 'bestiescraft1434@gmail.com',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi'],
      },
    },
  });

  return (
    <>
      {/* Inline JSON-LD for this page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: aboutSchema }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');

        :root {
          --cream: #faf7f2;
          --warm: #f2ede4;
          --sand: #e8dfd0;
          --terracotta: #c2602a;
          --brown: #5c3d2e;
          --dark: #2c1810;
          --text: #4a3728;
          --muted: #9a8070;
        }

        .about-page {
          background: var(--cream);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'Lato', sans-serif;
        }

        /* ── Hero ── */
        .about-hero {
          background: linear-gradient(135deg, var(--dark) 0%, #4a2518 60%, var(--brown) 100%);
          padding: 5rem 2rem 4rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .about-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .about-hero-tag {
          display: inline-block;
          background: rgba(194,96,42,0.25);
          color: #f4a06a;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 0.4rem 1.1rem;
          border-radius: 30px;
          border: 1px solid rgba(194,96,42,0.4);
          margin-bottom: 1.5rem;
          font-family: 'Lato', sans-serif;
        }
        .about-hero h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          font-weight: 700;
          color: #fff;
          margin: 0 0 1rem;
          line-height: 1.15;
        }
        .about-hero h1 em {
          color: #f4a06a;
          font-style: italic;
        }
        .about-hero-sub {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.65);
          max-width: 560px;
          margin: 0 auto;
          line-height: 1.7;
          font-weight: 300;
        }

        /* ── Main content ── */
        .about-main {
          max-width: 1000px;
          margin: 0 auto;
          padding: 4rem 2rem 5rem;
          width: 100%;
          box-sizing: border-box;
        }

        /* ── Story card ── */
        .about-story {
          background: #fff;
          border-radius: 24px;
          border: 1px solid var(--sand);
          padding: 3rem;
          margin-bottom: 2.5rem;
          position: relative;
          overflow: hidden;
        }
        .about-story::before {
          content: '❝';
          position: absolute;
          top: 1.5rem;
          right: 2rem;
          font-size: 6rem;
          color: var(--sand);
          font-family: Georgia, serif;
          line-height: 1;
          pointer-events: none;
        }
        .about-section-label {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--terracotta);
          margin-bottom: 1rem;
        }
        .about-section-label span {
          width: 28px;
          height: 1.5px;
          background: var(--terracotta);
          display: inline-block;
        }
        .about-story h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.9rem;
          font-weight: 700;
          color: var(--dark);
          margin: 0 0 1.25rem;
        }
        .about-story p {
          font-size: 1rem;
          color: var(--text);
          line-height: 1.85;
          margin: 0;
        }

        /* ── Values grid ── */
        .about-values {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }
        .about-value-card {
          background: #fff;
          border-radius: 18px;
          border: 1px solid var(--sand);
          padding: 1.75rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .about-value-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 36px rgba(44,24,16,0.09);
        }
        .about-value-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--warm);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          color: var(--terracotta);
        }
        .about-value-card h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--dark);
          margin: 0 0 0.5rem;
        }
        .about-value-card p {
          font-size: 0.88rem;
          color: var(--muted);
          line-height: 1.65;
          margin: 0;
        }

        /* ── Cities / Delivery strip ── */
        .about-delivery {
          background: var(--warm);
          border-radius: 18px;
          border: 1px solid var(--sand);
          padding: 1.75rem 2rem;
          margin-bottom: 2.5rem;
          text-align: center;
        }
        .about-delivery h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--dark);
          margin: 0 0 0.75rem;
        }
        .about-delivery p {
          font-size: 0.85rem;
          color: var(--muted);
          line-height: 1.75;
          margin: 0;
        }

        /* ── Contact card ── */
        .about-contact {
          background: linear-gradient(135deg, var(--dark) 0%, #3d2015 100%);
          border-radius: 24px;
          padding: 3rem;
          color: #fff;
        }
        .about-contact .about-section-label {
          color: #f4a06a;
        }
        .about-contact .about-section-label span {
          background: #f4a06a;
        }
        .about-contact h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.9rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.75rem;
        }
        .about-contact-sub {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.55);
          margin: 0 0 2rem;
          line-height: 1.6;
        }
        .about-contact-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .about-contact-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 1.1rem 1.4rem;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s;
        }
        .about-contact-item:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(244,160,106,0.4);
        }
        .about-contact-item-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(194,96,42,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #f4a06a;
        }
        .about-contact-item-text {
          display: flex;
          flex-direction: column;
        }
        .about-contact-item-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-bottom: 0.15rem;
        }
        .about-contact-item-value {
          font-size: 0.98rem;
          font-weight: 700;
          color: #fff;
          font-family: 'Lato', sans-serif;
        }
        .about-contact-note {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          color: rgba(255,255,255,0.4);
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .about-hero { padding: 3.5rem 1.5rem 3rem; }
          .about-main { padding: 2.5rem 1.25rem 4rem; }
          .about-story { padding: 2rem 1.5rem; }
          .about-story::before { font-size: 4rem; top: 1rem; right: 1rem; }
          .about-values { grid-template-columns: 1fr; }
          .about-contact { padding: 2rem 1.5rem; }
        }
      `}</style>

      <div className="about-page">
        <Navbar />

        {/* Hero — H1 contains primary keyword */}
        <header className="about-hero">
          <div className="about-hero-tag">✦ Handcrafted with love in Varanasi, India</div>
          <h1>
            Handmade Crochet &amp; Woollen Gifts,<br />
            <em>Crafted with Heart</em>
          </h1>
          <p className="about-hero-sub">
            Every stitch tells a story. Every handmade crochet bracelet, flower and gifting item
            carries the warmth of hands that genuinely care about what they create — delivered
            pan-India from Varanasi.
          </p>
        </header>

        <main className="about-main">

          {/* Story */}
          <article className="about-story">
            <div className="about-section-label"><span />Our Story</div>
            <h2>Where it all began — Besties Craft, Varanasi</h2>
            <p>
              Besties Craft started as a passion project in Varanasi, Uttar Pradesh — two
              friends, a shared love of handmade things, and the belief that something made by
              hand carries a feeling that no machine can replicate. What began in quiet
              afternoons with yarn and needles has grown into a small business built entirely
              on craft, care, and the joy of creating something beautiful for someone else.
              <br /><br />
              Every crochet bracelet, keychain, hair accessory, woollen flower and gifting
              piece you see here is made by hand — no factories, no shortcuts. Just skill,
              patience, and a whole lot of love poured into every order, shipped anywhere in
              India.
            </p>
          </article>

          {/* Values */}
          <section className="about-values" aria-label="Our values">
            <div className="about-value-card">
              <div className="about-value-icon"><Heart size={20} aria-hidden="true" /></div>
              <h3>Truly Handmade Crochet</h3>
              <p>Every single product is handcrafted. No mass production — just artisan skill and attention to detail in every piece of crochet or woollen craft.</p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon"><Sparkles size={20} aria-hidden="true" /></div>
              <h3>Fully Customisable Orders</h3>
              <p>We make crochet products tailored to you. Choose your colours, share your preferences, and we'll create something made just for you — perfect for gifts.</p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon"><Leaf size={20} aria-hidden="true" /></div>
              <h3>Premium Quality Materials</h3>
              <p>We use premium quality woollen and crochet materials that are durable, vibrant, and made to last — because you deserve the best handmade gift India has to offer.</p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon"><Award size={20} aria-hidden="true" /></div>
              <h3>Packed with Care</h3>
              <p>Each order is packed and sent with care for delivery across India. We treat every customer's order as if it were a gift to someone we love.</p>
            </div>
          </section>

          {/* Delivery coverage — boosts local SEO */}
          <aside className="about-delivery">
            <h3>Pan-India Delivery — We Ship Everywhere 🚚</h3>
            <p>
              We deliver handmade crochet products across India — Mumbai, Delhi, Bangalore,
              Chennai, Hyderabad, Kolkata, Pune, Ahmedabad, Jaipur, Lucknow, Surat, Indore,
              Chandigarh, Kochi, Nagpur, Vadodara, Noida, Gurgaon, Dehradun, Mysore,
              Udaipur, Jodhpur and every other city and town in India.
              Enter your pincode at checkout for live delivery rates and estimated time.
            </p>
          </aside>

          {/* Contact */}
          <section className="about-contact" aria-label="Contact Besties Craft">
            <div className="about-section-label"><span />Get in Touch</div>
            <h2>We'd love to hear from you</h2>
            <p className="about-contact-sub">
              Have a question, a custom crochet order request, or just want to say hello?
              Reach out — we're always happy to help customers across India.
            </p>
            <div className="about-contact-items">
              <a className="about-contact-item" href="tel:+918810776486" aria-label="Call or WhatsApp Besties Craft">
                <div className="about-contact-item-icon"><Phone size={18} aria-hidden="true" /></div>
                <div className="about-contact-item-text">
                  <span className="about-contact-item-label">Call or WhatsApp</span>
                  <span className="about-contact-item-value">+91 88107 76486</span>
                </div>
              </a>
              <a className="about-contact-item" href="mailto:bestiescraft1434@gmail.com" aria-label="Email Besties Craft">
                <div className="about-contact-item-icon"><Mail size={18} aria-hidden="true" /></div>
                <div className="about-contact-item-text">
                  <span className="about-contact-item-label">Email us</span>
                  <span className="about-contact-item-value">bestiescraft1434@gmail.com</span>
                </div>
              </a>
            </div>
            <div className="about-contact-note">
              <Clock size={13} aria-hidden="true" />
              We typically respond within 24 hours on business days.
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </>
  );
};

export default AboutPage;
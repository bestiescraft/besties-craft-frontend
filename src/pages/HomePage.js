import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, Package, Star, Shield, Truck, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import usePageMeta from '@/hooks/usePageMeta';
import { optimizeImageUrl } from '@/lib/constants';
import axios from 'axios';

// FIX: Removed framer-motion lazy wrappers from HomePage — they were adding
// a Suspense waterfall that delayed first paint. Simple divs render instantly.

// FIX: Correct backend URL with trailing slash protection
const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL?.replace(/\/$/, '') ||
  'https://besties-craft-backend-1.onrender.com';

export const CATEGORIES = [
  { name: 'Bracelets',        emoji: '📿', value: 'bracelets',        desc: 'Handcrafted wrist wear' },
  { name: 'Handmade Flowers', emoji: '🌸', value: 'handmade-flowers', desc: 'Delicate floral pieces' },
  { name: 'Keychains',        emoji: '🔑', value: 'keychains',        desc: 'Cute & custom keychains' },
  { name: 'Hair Accessories', emoji: '🎀', value: 'hair-accessories', desc: 'Clips, bands & more' },
  { name: 'Gifting Items',    emoji: '🎁', value: 'gifting-items',    desc: 'Perfect for every occasion' },
  { name: 'Crafts',           emoji: '🎨', value: 'crafts',           desc: 'Unique handmade crafts' },
];

export function normalizeCategory(raw) {
  if (!raw) return null;
  const slug  = raw.toLowerCase().trim().replace(/\s+/g, '-');
  const match = CATEGORIES.find(
    c => c.value === slug || c.name.toLowerCase() === slug.replace(/-/g, ' ')
  );
  return match ? match.name : null;
}

const FEATURES = [
  { icon: <Heart size={22} aria-hidden="true" />,    title: 'Made with Love',     desc: 'Every handmade crochet piece is crafted with care and genuine attention to detail.' },
  { icon: <Sparkles size={22} aria-hidden="true" />, title: '100% Handmade',      desc: 'Authentic handmade crochet goods — no factories, no mass production, only skilled hands.' },
  { icon: <Package size={22} aria-hidden="true" />,  title: 'Pan-India Delivery', desc: 'We ship handmade gifts to every corner of India with love-packed, secure packaging.' },
  { icon: <Star size={22} aria-hidden="true" />,     title: 'Quality Guaranteed', desc: 'Premium woollen and crochet materials, skilled hands — quality you can feel in every stitch.' },
];

const GIFTING_OCCASIONS = [
  { emoji: '💝', label: "Valentine's Day" },
  { emoji: '🎂', label: "Birthdays" },
  { emoji: '👭', label: "Friendship" },
  { emoji: '💒', label: "Weddings" },
  { emoji: '🎓', label: "Graduation" },
  { emoji: '🌸', label: "Mother's Day" },
  { emoji: '🎄', label: "Festivals" },
  { emoji: '🌟', label: "Just Because" },
];

const FAQS = [
  {
    q: 'Are all products 100% handmade?',
    a: 'Yes! Every single item at Besties Craft is handmade by skilled artisans in Varanasi, India. No factories, no mass production — each piece is crafted individually with love and attention to detail.',
  },
  {
    q: 'Can I customise my crochet order — colours, names, size?',
    a: "Absolutely! Since everything is handmade, customisation is easy. On any product page, you'll find a customisation box where you can specify colours, add a name, mention the occasion, or any special instructions. We love personalised handmade orders!",
  },
  {
    q: 'How long does delivery take across India?',
    a: "Most orders are delivered within 4–7 business days across India — Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Kolkata, Pune, Ahmedabad, Jaipur, Lucknow and everywhere else. You'll receive live shipping rates and estimated delivery dates at checkout.",
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major payment methods via Razorpay — UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Wallets. All payments are 100% secure.',
  },
  {
    q: 'How do I track my handmade order?',
    a: 'After your order is shipped, visit our Track Order page (in the navbar) and enter your order ID. You can also WhatsApp us at +91 8810776486 for real-time updates.',
  },
  {
    q: 'Do you ship handmade crochet products all over India?',
    a: 'Yes! We deliver pan-India — Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Kolkata, Pune, Ahmedabad, Jaipur, Lucknow, Surat, Indore, Chandigarh, Kochi, Nagpur, Vadodara, Noida, Gurgaon, Dehradun, Mysore, Udaipur, Jodhpur, Varanasi and everywhere else. Enter your pincode at checkout for live rates.',
  },
  {
    q: 'What if I receive a damaged or wrong product?',
    a: "We take quality very seriously. If you receive a damaged or incorrect handmade item, please WhatsApp us within 48 hours with a photo. We'll make it right immediately — replacement or full refund.",
  },
];

const PLACEHOLDER = 'https://placehold.co/400x400/e8e0d5/a09080?text=Craft';

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(faq => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
};

const sitelinksSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Besties Craft',
  url: 'https://www.bestiescraft.in',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.bestiescraft.in/products?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const LogoHero = () => (
  <div style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
      <div style={{ flex: 1, maxWidth: 56, height: 1, background: 'linear-gradient(90deg, transparent, rgba(194,96,42,0.6))' }} />
      <span style={{ color: '#c2602a', fontSize: '0.55rem', letterSpacing: '4px' }} aria-hidden="true">✦ ✦ ✦</span>
      <div style={{ flex: 1, maxWidth: 56, height: 1, background: 'linear-gradient(90deg, rgba(194,96,42,0.6), transparent)' }} />
    </div>
    <div style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif", fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: 700, letterSpacing: '0.04em', lineHeight: 1, color: '#2c1810', whiteSpace: 'nowrap' }}>
      Besties&nbsp;<em style={{ fontStyle: 'italic', color: '#c2602a', textShadow: '0 1px 18px rgba(194,96,42,0.18)' }}>Craft</em>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
      <div style={{ width: 36, height: 1, background: 'rgba(194,96,42,0.35)' }} />
      <span style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.48rem', letterSpacing: '0.28em', color: 'rgba(44,24,16,0.55)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
        Handcrafted in Varanasi, India · Est. 2025
      </span>
      <div style={{ width: 36, height: 1, background: 'rgba(194,96,42,0.35)' }} />
    </div>
  </div>
);

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{ borderBottom: '1px solid #e8dfd0', overflow: 'hidden' }}
      itemScope
      itemType="https://schema.org/Question"
    >
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label={faq.q}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1.25rem 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1rem', fontWeight: 600, color: '#2c1810', lineHeight: 1.4 }} itemProp="name">{faq.q}</span>
        <span style={{ color: '#c2602a', flexShrink: 0 }} aria-hidden="true">{open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
      </button>
      {open && (
        <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.92rem', color: '#4a3728', lineHeight: 1.75, margin: '0 0 1.25rem', paddingRight: '2rem' }} itemProp="text">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  usePageMeta({
    title: 'Besties Craft — Handmade Crochet Bracelets, Woollen Flowers & Gifts India',
    description: 'Shop 100% handmade crochet bracelets, woollen flowers, keychains, hair accessories & gifting items online in India. Custom orders accepted. Pan-India delivery. Crafted with love in Varanasi.',
    url: '/',
  });

  useEffect(() => { fetchFeatured(); }, []);

  const fetchFeatured = async () => {
    try {
      // FIX: Added 5s timeout — Render free tier cold-starts take up to 30s.
      // Without this, the page hangs waiting for the API before rendering anything.
      const res = await axios.get(`${BACKEND_URL}/api/products?sort=newest`, {
        timeout: 5000,
      });
      setFeatured((res.data.products || []).slice(0, 4));
    } catch {
      setFeatured([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sitelinksSchema) }} />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }

        :root {
          --cream: #faf7f2; --warm: #f2ede4; --sand: #e8dfd0;
          --terracotta: #c2602a; --brown: #5c3d2e;
          --dark: #2c1810; --text: #4a3728; --muted: #6b5245;
        }
        .hp-page { background: var(--cream); font-family: 'Lato', Georgia, sans-serif; }

        .hp-hero {
          display: flex; align-items: center;
          background: var(--warm); position: relative; overflow: hidden;
          padding: 4.5rem 2rem; margin-top: 0;
        }
        .hp-hero::before {
          content: ''; position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 80% 50%, rgba(194,96,42,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 10% 80%, rgba(92,61,46,0.06) 0%, transparent 60%);
          pointer-events: none;
        }
        .hp-hero-inner {
          max-width: 1180px; margin: 0 auto; width: 100%;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 4rem; align-items: center; position: relative; z-index: 1;
        }

        .hp-hero-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .hp-hero-tag {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 0.35rem 0.85rem;
          border-radius: 20px; font-family: 'Lato', sans-serif;
        }
        .hp-tag-primary   { background: rgba(194,96,42,0.12); color: #9e4a1a; }
        .hp-tag-secondary { background: rgba(44,24,16,0.07);  color: #4a2810; }
        .hp-tag-tertiary  { background: rgba(92,61,46,0.08);  color: #4a3728; }

        .hp-hero-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700; color: var(--dark); line-height: 1.15; margin: 0 0 1.5rem;
        }
        .hp-hero-title em { font-style: italic; color: var(--terracotta); }
        .hp-hero-sub {
          font-size: 1.05rem; color: #4a3728;
          line-height: 1.75; margin: 0 0 2.5rem; max-width: 480px;
        }
        .hp-hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
        .hp-btn-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: var(--dark); color: #fff; padding: 0.9rem 2rem;
          border-radius: 50px; font-size: 0.95rem; font-weight: 700;
          border: none; cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          font-family: 'Lato', sans-serif;
        }
        .hp-btn-primary:hover { background: var(--brown); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(44,24,16,0.2); }
        .hp-btn-outline {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: transparent; color: var(--dark); padding: 0.9rem 2rem;
          border-radius: 50px; font-size: 0.95rem; font-weight: 700;
          border: 2px solid var(--sand); cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          font-family: 'Lato', sans-serif;
        }
        .hp-btn-outline:hover { border-color: var(--dark); background: var(--warm); }

        /* FIX: Hero image grid — explicit aspect-ratio on BOTH wrappers prevents CLS */
        .hp-hero-imgs {
          display: grid; grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr; gap: 0.75rem; height: 480px;
        }
        .hp-hero-img-main {
          grid-row: 1 / 3; border-radius: 20px; overflow: hidden;
          box-shadow: 0 20px 50px rgba(44,24,16,0.18); background: var(--sand);
          /* FIX: explicit aspect-ratio prevents CLS jump when image loads */
          aspect-ratio: 5 / 6; width: 100%; position: relative;
        }
        .hp-hero-img-sm {
          border-radius: 14px; overflow: hidden;
          box-shadow: 0 8px 24px rgba(44,24,16,0.12); background: var(--sand);
          /* FIX: explicit aspect-ratio prevents CLS jump */
          aspect-ratio: 1 / 1; width: 100%; position: relative;
        }
        .hp-hero-img-main img, .hp-hero-img-sm img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .hp-hero-img-placeholder {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, var(--sand) 0%, var(--warm) 100%);
          display: flex; align-items: center; justify-content: center; font-size: 3rem;
        }

        .hp-stats { background: var(--dark); color: #fff; padding: 1.5rem 2rem; }
        .hp-stats-inner {
          max-width: 1180px; margin: 0 auto;
          display: flex; justify-content: space-around; flex-wrap: wrap; gap: 1rem;
        }
        .hp-stat { text-align: center; font-family: 'Lato', sans-serif; }
        .hp-stat-num   { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 700; color: #e8a87c; display: block; }
        .hp-stat-label { font-size: 0.78rem; color: rgba(255,255,255,0.75); letter-spacing: 0.06em; }

        .hp-sec-head  { text-align: center; margin-bottom: 3rem; }
        .hp-sec-tag   { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #9e4a1a; display: block; margin-bottom: 0.75rem; }
        .hp-sec-title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 700; color: var(--dark); margin: 0 0 0.75rem; }
        .hp-sec-sub   { font-size: 0.95rem; color: #6b5245; max-width: 500px; margin: 0 auto; line-height: 1.7; }

        .hp-cats { padding: 5rem 2rem; background: var(--cream); }
        .hp-cats-grid {
          max-width: 1180px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(6, 1fr); gap: 1rem;
        }
        .hp-cat-card {
          background: var(--warm); border-radius: 18px; padding: 1.6rem 1rem 1.3rem;
          text-align: center; cursor: pointer; border: 1.5px solid transparent;
          transition: all 0.22s; font-family: 'Lato', sans-serif;
          text-decoration: none; display: block;
        }
        .hp-cat-card:hover { border-color: var(--terracotta); background: #fff; transform: translateY(-5px); box-shadow: 0 12px 32px rgba(194,96,42,0.13); }
        .hp-cat-emoji { font-size: 2.2rem; display: block; margin-bottom: 0.65rem; }
        .hp-cat-name  { font-size: 0.82rem; font-weight: 700; color: #4a2810; display: block; margin-bottom: 0.25rem; }
        .hp-cat-desc  { font-size: 0.68rem; color: #6b5245; display: block; line-height: 1.4; }

        .hp-featured { padding: 5rem 2rem; background: var(--warm); }
        .hp-products-grid {
          max-width: 1180px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem;
        }
        .hp-prod-card {
          background: #fff; border-radius: 16px; overflow: hidden;
          border: 1px solid var(--sand); cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          font-family: 'Lato', sans-serif;
        }
        .hp-prod-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(44,24,16,0.14); }
        /* FIX: Fixed height + explicit dimensions on product images to prevent CLS */
        .hp-prod-img {
          height: 220px; overflow: hidden; position: relative; background: var(--warm);
          /* FIX: reserve space before image loads */
          min-height: 220px;
        }
        .hp-prod-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; display: block; }
        .hp-prod-card:hover .hp-prod-img img { transform: scale(1.07); }
        .hp-prod-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; background: var(--warm); }
        .hp-prod-body  { padding: 1.1rem 1.2rem 1.3rem; }
        .hp-prod-cat   { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #9e4a1a; margin-bottom: 0.3rem; }
        .hp-prod-name  { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 600; color: var(--dark); margin: 0 0 0.6rem; line-height: 1.35; }
        .hp-prod-price { font-size: 1.05rem; font-weight: 700; color: var(--brown); }
        .hp-prod-stock { font-size: 0.72rem; color: #256025; font-weight: 600; margin-left: 0.6rem; }
        .hp-view-all   { text-align: center; margin-top: 3rem; }

        .hp-why { padding: 5rem 2rem; background: var(--cream); }
        .hp-why-grid {
          max-width: 1180px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem;
        }
        .hp-why-card  { text-align: center; padding: 2rem 1.5rem; background: var(--warm); border-radius: 16px; border: 1px solid var(--sand); }
        .hp-why-icon  { width: 52px; height: 52px; border-radius: 14px; background: rgba(194,96,42,0.1); color: var(--terracotta); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
        .hp-why-title { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 600; color: var(--dark); margin: 0 0 0.5rem; }
        .hp-why-desc  { font-size: 0.85rem; color: #6b5245; line-height: 1.65; margin: 0; }

        .hp-trust { padding: 2rem 2rem; background: var(--dark); }
        .hp-trust-inner {
          max-width: 1180px; margin: 0 auto;
          display: flex; justify-content: center; flex-wrap: wrap; gap: 2rem 3rem;
        }
        .hp-trust-item { display: flex; align-items: center; gap: 0.6rem; color: rgba(255,255,255,0.85); font-family: 'Lato', sans-serif; font-size: 0.82rem; font-weight: 600; letter-spacing: 0.04em; }
        .hp-trust-icon { color: #e8a87c; }

        .hp-gifting {
          padding: 5rem 2rem;
          background: linear-gradient(135deg, #2c1810 0%, #5c3d2e 100%);
          position: relative; overflow: hidden;
        }
        .hp-gifting::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 80% at 50% 50%, rgba(194,96,42,0.18) 0%, transparent 70%); pointer-events: none; }
        .hp-gifting-inner {
          max-width: 1180px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr; gap: 4rem;
          align-items: center; position: relative; z-index: 1;
        }
        .hp-gifting-title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 700; color: #fff; margin: 0 0 1rem; }
        .hp-gifting-title em { font-style: italic; color: #e8a87c; }
        .hp-gifting-sub { font-size: 0.98rem; color: rgba(255,255,255,0.8); line-height: 1.75; margin: 0 0 2rem; }
        .hp-occasions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
        .hp-occasion-card { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 0.9rem 0.5rem; text-align: center; cursor: pointer; transition: background 0.2s, transform 0.15s; }
        .hp-occasion-card:hover { background: rgba(194,96,42,0.2); transform: translateY(-3px); }
        .hp-occasion-emoji { font-size: 1.5rem; display: block; margin-bottom: 0.3rem; }
        .hp-occasion-label { font-size: 0.68rem; color: rgba(255,255,255,0.85); font-family: 'Lato', sans-serif; font-weight: 600; display: block; }

        .hp-faq { padding: 5rem 2rem; background: var(--warm); }
        .hp-faq-inner { max-width: 780px; margin: 0 auto; }

        .hp-cta { padding: 5rem 2rem; background: var(--dark); text-align: center; position: relative; overflow: hidden; }
        .hp-cta::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 70% 80% at 50% 50%, rgba(194,96,42,0.15) 0%, transparent 70%); pointer-events: none; }
        .hp-cta-title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.8rem, 3vw, 2.8rem); font-weight: 700; color: #fff; margin: 0 0 1rem; position: relative; z-index: 1; }
        .hp-cta-title em { font-style: italic; color: #e8a87c; }
        .hp-cta-sub { font-size: 1rem; color: rgba(255,255,255,0.8); margin: 0 auto 2.5rem; max-width: 480px; line-height: 1.7; position: relative; z-index: 1; }
        .hp-cta-btn { display: inline-flex; align-items: center; gap: 0.5rem; background: var(--terracotta); color: #fff; padding: 1rem 2.5rem; border-radius: 50px; font-size: 1rem; font-weight: 700; border: none; cursor: pointer; transition: background 0.2s, transform 0.15s; font-family: 'Lato', sans-serif; position: relative; z-index: 1; }
        .hp-cta-btn:hover { background: #a8512a; transform: translateY(-2px); }

        .hp-whatsapp { padding: 3rem 2rem; background: var(--cream); text-align: center; }
        .hp-wa-inner { max-width: 600px; margin: 0 auto; background: var(--warm); border-radius: 20px; padding: 2.5rem; border: 1px solid var(--sand); }
        .hp-wa-title { font-family: 'Playfair Display', Georgia, serif; font-size: 1.6rem; font-weight: 700; color: var(--dark); margin: 0 0 0.75rem; }
        .hp-wa-sub { font-size: 0.92rem; color: #6b5245; line-height: 1.7; margin: 0 0 1.5rem; }
        .hp-wa-btn { display: inline-flex; align-items: center; gap: 0.6rem; background: #25d366; color: #fff; padding: 0.9rem 2rem; border-radius: 50px; font-size: 0.95rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Lato', sans-serif; text-decoration: none; transition: background 0.2s, transform 0.15s; }
        .hp-wa-btn:hover { background: #1ebe5d; transform: translateY(-2px); }

        .hp-seo-cities { padding: 2.5rem 2rem; background: var(--cream); border-top: 1px solid var(--sand); }
        .hp-seo-cities-inner { max-width: 1180px; margin: 0 auto; }
        .hp-seo-cities h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.1rem; font-weight: 700; color: var(--dark); margin: 0 0 0.75rem; }
        .hp-seo-cities p { font-size: 0.82rem; color: #6b5245; line-height: 1.85; margin: 0; }
        .hp-seo-cities a { color: #9e4a1a; text-decoration: underline; }

        @media (max-width: 1024px) {
          .hp-cats-grid     { grid-template-columns: repeat(3, 1fr); }
          .hp-products-grid { grid-template-columns: repeat(2, 1fr); }
          .hp-why-grid      { grid-template-columns: repeat(2, 1fr); }
          .hp-gifting-inner { grid-template-columns: 1fr; gap: 2rem; }
        }
        @media (max-width: 768px) {
          .hp-hero         { padding: 3rem 1.5rem; min-height: auto; }
          .hp-hero-inner   { grid-template-columns: 1fr; gap: 2rem; }
          .hp-hero-imgs    { display: none; }
          .hp-cats-grid    { grid-template-columns: repeat(3, 1fr); }
          .hp-occasions-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 480px) {
          .hp-hero          { padding: 2.5rem 1rem; }
          .hp-cats-grid     { grid-template-columns: repeat(2, 1fr); }
          .hp-products-grid { grid-template-columns: 1fr; }
          .hp-why-grid      { grid-template-columns: 1fr; }
          .hp-occasions-grid{ grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="hp-page">
        <Navbar />

        <main id="main-content">

          {/* HERO */}
          <section className="hp-hero" aria-label="Hero section">
            <div className="hp-hero-inner">
              <div>
                <LogoHero />
                <div className="hp-hero-tags" aria-hidden="true">
                  <span className="hp-hero-tag hp-tag-primary"><Sparkles size={12} /> Handcrafted in Varanasi, India</span>
                  <span className="hp-hero-tag hp-tag-secondary">🧶 Since 2025</span>
                  <span className="hp-hero-tag hp-tag-tertiary">✦ 100% Handmade</span>
                </div>

                <h1 className="hp-hero-title">
                  Handmade Crochet &amp; Woollen Gifts,<br />
                  Crafted with <em>Love</em> in India
                </h1>

                <p className="hp-hero-sub">
                  Discover handmade crochet bracelets, woollen flowers, keychains, hair
                  accessories and gifting items — each piece lovingly handcrafted by skilled
                  artisans in Varanasi and delivered pan-India.
                </p>
                <div className="hp-hero-btns">
                  <button className="hp-btn-primary" onClick={() => navigate('/products')} aria-label="Shop all handmade crochet products">
                    Shop Now <ArrowRight size={16} aria-hidden="true" />
                  </button>
                  <button className="hp-btn-outline" onClick={() => navigate('/about')} aria-label="Read our story">
                    Our Story
                  </button>
                </div>
              </div>

              {/* FIX: Hero images — fetchpriority="high" on first image for LCP,
                  explicit width/height on all images to prevent CLS */}
              <div className="hp-hero-imgs" aria-hidden="true">
                <div className="hp-hero-img-main">
                  {featured[0]?.images?.[0]?.url
                    ? <img
                        src={optimizeImageUrl(featured[0].images[0].url, { width: 800 })}
                        alt={`Handmade crochet ${featured[0].name} — Besties Craft India`}
                        fetchpriority="high"
                        loading="eager"
                        decoding="async"
                        width="400"
                        height="480"
                        onError={e => { e.target.parentNode.innerHTML = '<div class="hp-hero-img-placeholder">🌸</div>'; }}
                      />
                    : <div className="hp-hero-img-placeholder" aria-hidden="true">🌸</div>}
                </div>
                <div className="hp-hero-img-sm">
                  {featured[1]?.images?.[0]?.url
                    ? <img
                        src={optimizeImageUrl(featured[1].images[0].url, { width: 400 })}
                        alt={`Handmade crochet ${featured[1].name} — Besties Craft India`}
                        loading="lazy"
                        decoding="async"
                        width="200"
                        height="230"
                        onError={e => { e.target.parentNode.innerHTML = '<div class="hp-hero-img-placeholder">📿</div>'; }}
                      />
                    : <div className="hp-hero-img-placeholder" aria-hidden="true">📿</div>}
                </div>
                <div className="hp-hero-img-sm">
                  {featured[2]?.images?.[0]?.url
                    ? <img
                        src={optimizeImageUrl(featured[2].images[0].url, { width: 400 })}
                        alt={`Handmade crochet ${featured[2].name} — Besties Craft India`}
                        loading="lazy"
                        decoding="async"
                        width="200"
                        height="230"
                        onError={e => { e.target.parentNode.innerHTML = '<div class="hp-hero-img-placeholder">🎀</div>'; }}
                      />
                    : <div className="hp-hero-img-placeholder" aria-hidden="true">🎀</div>}
                </div>
              </div>
            </div>
          </section>

          {/* TRUST BADGES */}
          <div className="hp-trust" aria-label="Trust signals">
            <div className="hp-trust-inner">
              {[
                { icon: <Shield size={16} aria-hidden="true" />, text: 'Secure Payments via Razorpay' },
                { icon: <Truck size={16} aria-hidden="true" />,  text: 'Pan-India Delivery' },
                { icon: <Heart size={16} aria-hidden="true" />,  text: '100% Handmade Crochet' },
                { icon: <Star size={16} aria-hidden="true" />,   text: 'Customisable Orders' },
                { icon: <MessageCircle size={16} aria-hidden="true" />, text: 'WhatsApp Support' },
              ].map((item, i) => (
                <div key={i} className="hp-trust-item">
                  <span className="hp-trust-icon">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* STATS */}
          <div className="hp-stats" aria-label="Our numbers">
            <div className="hp-stats-inner">
              {[
                { num: '500+', label: 'Happy Customers Across India' },
                { num: '100%', label: 'Handmade Products' },
                { num: '50+',  label: 'Unique Crochet Designs' },
                { num: '✦',   label: 'Custom Orders Welcome' },
              ].map((s, i) => (
                <div key={i} className="hp-stat">
                  <span className="hp-stat-num">{s.num}</span>
                  <span className="hp-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CATEGORIES */}
          <section className="hp-cats" aria-labelledby="cats-heading">
            <div style={{ maxWidth: 1180, margin: '0 auto' }}>
              <div className="hp-sec-head">
                <span className="hp-sec-tag">Browse by Category</span>
                <h2 id="cats-heading" className="hp-sec-title">Shop Handmade Crochet by Category</h2>
                <p className="hp-sec-sub">From crochet bracelets to handmade gifting items — find your perfect handcrafted piece, made in India.</p>
              </div>
              <nav aria-label="Product categories" className="hp-cats-grid">
                {CATEGORIES.map((cat) => (
                  <a
                    key={cat.value}
                    href={`/products?category=${cat.value}`}
                    className="hp-cat-card"
                    onClick={e => { e.preventDefault(); navigate(`/products?category=${cat.value}`); }}
                    aria-label={`Shop handmade ${cat.name} — Besties Craft India`}
                  >
                    <span className="hp-cat-emoji" aria-hidden="true">{cat.emoji}</span>
                    <span className="hp-cat-name">{cat.name}</span>
                    <span className="hp-cat-desc">{cat.desc}</span>
                  </a>
                ))}
              </nav>
            </div>
          </section>

          {/* FEATURED PRODUCTS */}
          <section className="hp-featured" aria-labelledby="featured-heading">
            <div style={{ maxWidth: 1180, margin: '0 auto' }}>
              <div className="hp-sec-head">
                <span className="hp-sec-tag">Just In</span>
                <h2 id="featured-heading" className="hp-sec-title">New Handmade Crochet Arrivals</h2>
                <p className="hp-sec-sub">Fresh handcrafted crochet pieces from Varanasi, made just for you.</p>
              </div>
              {loadingProducts ? (
                <p style={{ textAlign: 'center', color: '#6b5245', fontFamily: 'sans-serif' }}>Loading handmade products…</p>
              ) : featured.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6b5245', fontFamily: 'sans-serif' }}>No products yet.</p>
              ) : (
                <div className="hp-products-grid">
                  {featured.map((product) => {
                    const displayCat = normalizeCategory(product.category);
                    return (
                      <article key={product._id} className="hp-prod-card"
                        onClick={() => navigate(`/products/${product._id}`)}
                        aria-label={`${product.name} — ₹${parseFloat(product.base_price).toLocaleString('en-IN')}`}
                      >
                        <div className="hp-prod-img">
                          {product.images?.[0]?.url
                            ? <img
                                src={optimizeImageUrl(product.images[0].url, { width: 400 })}
                                alt={`Handmade ${product.name} — ${displayCat || 'crochet product'} by Besties Craft India`}
                                loading="lazy"
                                decoding="async"
                                width="400"
                                height="220"
                                onError={e => { e.target.src = PLACEHOLDER; }}
                              />
                            : <div className="hp-prod-img-placeholder" aria-hidden="true">🌸</div>}
                        </div>
                        <div className="hp-prod-body">
                          {displayCat && <div className="hp-prod-cat">{displayCat}</div>}
                          <h3 className="hp-prod-name">{product.name}</h3>
                          <div>
                            <span className="hp-prod-price">₹{parseFloat(product.base_price).toLocaleString('en-IN')}</span>
                            {product.in_stock && <span className="hp-prod-stock" aria-label="In Stock">● In Stock</span>}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
              <div className="hp-view-all">
                <button className="hp-btn-primary" onClick={() => navigate('/products')} aria-label="View all handmade crochet products">
                  View All Handmade Products <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </section>

          {/* WHY US */}
          <section className="hp-why" aria-labelledby="why-heading">
            <div style={{ maxWidth: 1180, margin: '0 auto' }}>
              <div className="hp-sec-head">
                <span className="hp-sec-tag">Why Besties Craft</span>
                <h2 id="why-heading" className="hp-sec-title">Handmade differently, crafted with love</h2>
              </div>
              <div className="hp-why-grid">
                {FEATURES.map((f, i) => (
                  <div key={i} className="hp-why-card">
                    <div className="hp-why-icon">{f.icon}</div>
                    <h3 className="hp-why-title">{f.title}</h3>
                    <p className="hp-why-desc">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* GIFTING OCCASIONS */}
          <section className="hp-gifting" aria-labelledby="gifting-heading">
            <div className="hp-gifting-inner">
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#e8a87c', display: 'block', marginBottom: '0.75rem', fontFamily: "'Lato', sans-serif" }}>Perfect For Every Occasion</span>
                <h2 id="gifting-heading" className="hp-gifting-title">
                  The perfect <em>handmade gift</em> for everyone in India
                </h2>
                <p className="hp-gifting-sub">
                  Birthdays, weddings, anniversaries, Valentine's Day, festivals — our handmade
                  crochet gifts make every occasion extra special. Fully customisable with personal
                  touches. Delivered anywhere in India.
                </p>
                <button className="hp-btn-primary" style={{ background: '#c2602a' }} onClick={() => navigate('/products?category=gifting-items')} aria-label="Shop handmade gifting items India">
                  Shop Handmade Gifting Items <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
              <div>
                <div className="hp-occasions-grid" role="list">
                  {GIFTING_OCCASIONS.map((occ, i) => (
                    <div key={i} className="hp-occasion-card" role="listitem"
                      onClick={() => navigate('/products?category=gifting-items')}
                      aria-label={`Handmade gift for ${occ.label}`}
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && navigate('/products?category=gifting-items')}
                    >
                      <span className="hp-occasion-emoji" aria-hidden="true">{occ.emoji}</span>
                      <span className="hp-occasion-label">{occ.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* WHATSAPP */}
          <section className="hp-whatsapp" aria-labelledby="whatsapp-heading">
            <div className="hp-wa-inner">
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }} aria-hidden="true">💬</div>
              <h2 id="whatsapp-heading" className="hp-wa-title">Want a custom handmade crochet order?</h2>
              <p className="hp-wa-sub">
                Have a special crochet design in mind? Want a name, specific colour, or a unique
                pattern? We love custom handmade orders from across India! Just WhatsApp us and
                we'll make it happen.
              </p>
              <a
                href="https://wa.me/918810776486?text=Hi! I'd like to place a custom crochet order"
                className="hp-wa-btn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp for custom crochet orders"
              >
                <MessageCircle size={18} aria-hidden="true" /> Chat on WhatsApp
              </a>
            </div>
          </section>

          {/* FAQ */}
          <section className="hp-faq" aria-labelledby="faq-heading" itemScope itemType="https://schema.org/FAQPage">
            <div className="hp-faq-inner">
              <div className="hp-sec-head">
                <span className="hp-sec-tag">Got Questions?</span>
                <h2 id="faq-heading" className="hp-sec-title">Frequently Asked Questions</h2>
                <p className="hp-sec-sub">Everything you need to know about ordering handmade crochet products from Besties Craft.</p>
              </div>
              {FAQS.map((faq, i) => <FAQItem key={i} faq={faq} />)}
            </div>
          </section>

          {/* CTA */}
          <section className="hp-cta" aria-labelledby="cta-heading">
            <div>
              <h2 id="cta-heading" className="hp-cta-title">Every handmade piece tells a <em>story</em></h2>
              <p className="hp-cta-sub">
                Gift something truly special — handmade crochet, crafted with heart in Varanasi,
                wrapped with love. Perfect for every occasion across India.
              </p>
              <button className="hp-cta-btn" onClick={() => navigate('/products')} aria-label="Start shopping handmade crochet products">
                Start Shopping <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </section>

          {/* SEO CITY BLOCK */}
          <div className="hp-seo-cities" aria-label="Delivery information">
            <div className="hp-seo-cities-inner">
              <h2>Handmade Crochet Products Delivered Across India</h2>
              <p>
                Besties Craft delivers 100% handmade crochet bracelets, woollen flowers, keychains,
                hair accessories and gifting items to every city in India.
                Buy handmade crochet products online in <strong>Mumbai</strong>, <strong>Delhi</strong>,{' '}
                <strong>Bangalore</strong>, <strong>Chennai</strong>, <strong>Hyderabad</strong>,{' '}
                <strong>Kolkata</strong>, <strong>Pune</strong>, <strong>Ahmedabad</strong>,{' '}
                <strong>Jaipur</strong>, <strong>Lucknow</strong>, <strong>Surat</strong>,{' '}
                <strong>Indore</strong>, <strong>Bhopal</strong>, <strong>Chandigarh</strong>,{' '}
                <strong>Kochi</strong>, <strong>Nagpur</strong>, <strong>Vadodara</strong>,{' '}
                <strong>Noida</strong>, <strong>Gurgaon</strong>, <strong>Dehradun</strong>,{' '}
                <strong>Mysore</strong>, <strong>Udaipur</strong>, <strong>Jodhpur</strong>,{' '}
                <strong>Navi Mumbai</strong> and everywhere else in India.
                All products are handmade in Varanasi, Uttar Pradesh. Custom crochet orders accepted.
                Secure payments via Razorpay (UPI, Cards, Net Banking).
                WhatsApp us at <a href="tel:+918810776486">+91 88107 76486</a> for custom orders.
              </p>
            </div>
          </div>

        </main>

        <Footer />
      </div>
    </>
  );
}
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

function SEO() {
  useEffect(() => {
    try {
      document.title = 'Blog — Besties Craft | Handmade Crochet Ideas, Gifts & Stories India';
      const set = (sel, val) => {
        let m = document.querySelector(sel);
        if (!m) { m = document.createElement('meta'); document.head.appendChild(m); }
        const attr = sel.includes('property') ? 'property' : 'name';
        if (!m.getAttribute(attr)) m.setAttribute(attr, sel.match(/["']([^"']+)["']/)[1]);
        m.setAttribute('content', val);
      };
      set('meta[name="description"]', 'Read the Besties Craft blog — handmade crochet gift ideas, bracelet inspiration, Varanasi craft stories and tips for buying handmade gifts online in India.');
      set('meta[name="keywords"]', 'handmade crochet gifts India, crochet bracelet ideas, best handmade gifts birthday India, woollen flowers India, crochet gifts Varanasi, buy handmade gifts online India, friendship bracelet India');
      set('meta[name="robots"]', 'index, follow');
      set('meta[name="author"]', 'Besties Craft');
      set('meta[property="og:title"]', 'Blog — Besties Craft | Handmade Crochet India');
      set('meta[property="og:description"]', 'Handmade gift ideas, crochet inspiration and craft stories from Besties Craft, Varanasi.');
      set('meta[property="og:type"]', 'blog');
      set('meta[property="og:locale"]', 'en_IN');
      let c = document.querySelector('link[rel="canonical"]');
      if (!c) { c = document.createElement('link'); c.rel = 'canonical'; document.head.appendChild(c); }
      c.href = 'https://www.bestiescraft.in/blog';
    } catch (_) {}
  }, []);
  return null;
}

// ─── Blog posts data ───────────────────────────────────────────
// Each post targets a specific Google search keyword
const POSTS = [
  {
    id: 'best-handmade-gifts-birthday-india',
    emoji: '🎂',
    tag: 'Gift Ideas',
    title: '10 Best Handmade Gift Ideas for Birthdays in India (2025)',
    excerpt: 'Looking for a birthday gift that feels personal and special? Skip the generic — here are 10 handmade gift ideas that will actually be remembered.',
    date: 'February 20, 2026',
    readTime: '4 min read',
    keywords: 'best handmade gifts birthday India, unique birthday gift ideas India',
    content: [
      {
        heading: 'Why Handmade Gifts Hit Different',
        text: 'In a world of same-day Amazon deliveries and generic gift cards, a handmade gift stands out. It tells the recipient: someone thought about you, sat down, and made something with their hands — just for you. That feeling is priceless.',
      },
      {
        heading: '1. Personalised Crochet Bracelet',
        text: 'A crochet bracelet in the birthday person\'s favourite colour, with their initial or a charm that means something to them. Lightweight, beautiful, and completely one-of-a-kind. At Besties Craft, we customise every bracelet — just tell us the colours and we\'ll do the rest.',
      },
      {
        heading: '2. Handmade Woollen Flowers Bouquet',
        text: 'Unlike real flowers, handmade woollen flowers last forever. A small bouquet in soft pastels or bold colours makes a stunning desk decoration. They\'re increasingly popular as birthday gifts in India because they\'re unique and long-lasting.',
      },
      {
        heading: '3. Custom Keychain with Name or Initial',
        text: 'A cute crochet keychain with the person\'s name or a mini-charm is practical, personal, and adorable. We\'ve made hundreds of these for birthdays across India — they\'re always a hit.',
      },
      {
        heading: '4. Hair Accessories Set',
        text: 'Handmade crochet hair clips, scrunchies, and bands in a matching colour set make a thoughtful gift. Perfect for sisters, friends, and anyone who loves accessories.',
      },
      {
        heading: '5. Crochet Gift Hamper',
        text: 'Combine a bracelet, a keychain, and a small flower into one gift hamper. We at Besties Craft create custom gift hampers for birthdays — wrapped beautifully and ready to gift.',
      },
      {
        heading: 'The Besties Craft Promise',
        text: 'Every product at Besties Craft is 100% handmade in Varanasi. We accept custom orders with specific colour requests, names, and occasion-specific designs. WhatsApp us at +91 88107 76486 to place a custom birthday order.',
      },
    ],
  },
  {
    id: 'crochet-bracelets-friendship-india',
    emoji: '📿',
    tag: 'Bracelets',
    title: 'Why Crochet Friendship Bracelets Are the Best Gift in India Right Now',
    excerpt: 'Friendship bracelets have been a symbol of connection for centuries. Here\'s why the handmade crochet version is having a major moment in India.',
    date: 'February 15, 2026',
    readTime: '3 min read',
    keywords: 'crochet friendship bracelets India, handmade bracelets buy online India',
    content: [
      {
        heading: 'The Return of the Friendship Bracelet',
        text: 'From Taylor Swift concerts to Instagram feeds, friendship bracelets are everywhere in 2025. But the best ones aren\'t the plastic ones from childhood — they\'re handmade crochet bracelets crafted with care.',
      },
      {
        heading: 'What Makes Crochet Bracelets Special',
        text: 'Crochet bracelets are soft, adjustable, lightweight, and incredibly beautiful. Unlike metal jewellery, they don\'t irritate skin. Unlike factory-made accessories, each one is slightly unique. They\'re made stitch by stitch by a real person — and you can feel it when you wear one.',
      },
      {
        heading: 'Custom Colours for Every Friendship',
        text: 'The best part? You can choose exactly what you want. Best friend loves blue? We\'ll make it in blue. Want both your names on matching bracelets? Done. Want a set of five for your whole friend group? We\'ll make them all.',
      },
      {
        heading: 'Where to Buy Handmade Crochet Bracelets in India',
        text: 'Besties Craft ships pan-India. We\'re based in Varanasi, Uttar Pradesh, and we accept orders via our website or WhatsApp. Delivery takes 5–8 business days across India.',
      },
    ],
  },
  {
    id: 'handmade-gifts-varanasi-india',
    emoji: '🌸',
    tag: 'Our Story',
    title: 'Handmade with Heart: How Besties Craft Started in Varanasi',
    excerpt: 'Every brand has a story. Ours started with yarn, two friends, and a belief that handmade things carry a feeling that no machine can replicate.',
    date: 'February 10, 2026',
    readTime: '3 min read',
    keywords: 'handmade gifts Varanasi, crochet shop Varanasi, best handmade products Varanasi India',
    content: [
      {
        heading: 'Varanasi: A City of Craft',
        text: 'Varanasi has been a city of artisans for thousands of years. From the famous Banarasi silk to intricate brasswork, this city breathes craft. It\'s the perfect place to start a handmade products brand.',
      },
      {
        heading: 'How Besties Craft Was Born',
        text: 'Besties Craft started as a passion project — two friends who loved making things by hand and wanted to share that love with the world. What began in quiet afternoons with yarn and needles has grown into a small business built entirely on craft, care, and the joy of creating something beautiful for someone else.',
      },
      {
        heading: 'Everything is Made by Hand',
        text: 'We want to be very clear about this: every single product at Besties Craft is made by hand. No factories. No machines. No mass production. Each bracelet, keychain, flower, and hair accessory is crafted individually — with patience and attention to detail that you can see and feel.',
      },
      {
        heading: 'Delivering Across India',
        text: 'Though we\'re based in Varanasi, we deliver our handmade crochet products to every corner of India. From Delhi to Chennai, Mumbai to Guwahati — if you\'re in India, we can reach you.',
      },
    ],
  },
  {
    id: 'woollen-flowers-home-decor-india',
    emoji: '🌸',
    tag: 'Home Decor',
    title: 'Handmade Woollen Flowers: The New Home Decor Trend in India',
    excerpt: 'Move over dried flowers and artificial plants. Handmade woollen flowers are taking over Indian homes — and here\'s why they\'re worth every rupee.',
    date: 'February 5, 2026',
    readTime: '3 min read',
    keywords: 'handmade woollen flowers India, buy crochet flowers online India, woollen flower bouquet India',
    content: [
      {
        heading: 'Why Woollen Flowers Are Trending',
        text: 'Real flowers die in days. Artificial plastic flowers look cheap up close. But handmade woollen flowers? They last years, look beautiful from every angle, and carry the warmth of something made by human hands. That\'s why they\'re becoming a favourite across Indian homes and gifting occasions.',
      },
      {
        heading: 'Perfect for Every Room',
        text: 'A small bouquet of woollen flowers on a work desk. A larger arrangement on a living room shelf. A few blooms tucked into a gift hamper. The soft, muted colours and organic textures of handmade flowers work in any space and any setting.',
      },
      {
        heading: 'The Perfect Low-Maintenance Gift',
        text: 'For people who kill real plants (we all know someone), a handmade woollen flower arrangement is the perfect gift. It stays beautiful forever, requires zero maintenance, and always starts a conversation.',
      },
      {
        heading: 'Our Flower Collection',
        text: 'At Besties Craft, we make woollen flowers in a wide range of colours and styles. From single stems to full bouquets, from pastel pinks to bold magentas — each flower is handcrafted with care. You can also customise colours to match a room\'s palette or a recipient\'s favourite shades.',
      },
    ],
  },
];

// ─── Blog post card ────────────────────────────────────────────
function PostCard({ post, onClick }) {
  return (
    <article
      onClick={onClick}
      style={{
        background: '#fff', borderRadius: 16, border: '1px solid #e8dfd0',
        overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.18s, box-shadow 0.18s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(44,24,16,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ background: 'linear-gradient(135deg, #f2ede4, #e8dfd0)', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>
        {post.emoji}
      </div>
      <div style={{ padding: '1.25rem 1.4rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c2602a', background: 'rgba(194,96,42,0.1)', padding: '0.2rem 0.6rem', borderRadius: 20 }}>{post.tag}</span>
          <span style={{ fontSize: '0.7rem', color: '#9a8070', fontFamily: 'Lato, sans-serif' }}>{post.readTime}</span>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1rem', fontWeight: 700, color: '#2c1810', margin: '0 0 0.5rem', lineHeight: 1.35 }}>{post.title}</h2>
        <p style={{ fontSize: '0.85rem', color: '#7a6050', lineHeight: 1.7, margin: '0 0 0.9rem', fontFamily: 'Lato, sans-serif', fontWeight: 300 }}>{post.excerpt}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.7rem', color: '#9a8070', fontFamily: 'Lato, sans-serif' }}>{post.date}</span>
          <span style={{ fontSize: '0.78rem', color: '#c2602a', fontWeight: 700, fontFamily: 'Lato, sans-serif' }}>Read more →</span>
        </div>
      </div>
    </article>
  );
}

// ─── Full post view ────────────────────────────────────────────
function PostFull({ post, onBack }) {
  useEffect(() => {
    try {
      document.title = post.title + ' — Besties Craft Blog';
      const setMeta = (sel, val) => {
        let m = document.querySelector(sel);
        if (!m) { m = document.createElement('meta'); document.head.appendChild(m); }
        const attr = sel.includes('property') ? 'property' : 'name';
        if (!m.getAttribute(attr)) m.setAttribute(attr, sel.match(/["']([^"']+)["']/)[1]);
        m.setAttribute('content', val);
      };
      setMeta('meta[name="description"]', post.excerpt);
      setMeta('meta[name="keywords"]', post.keywords);
    } catch (_) {}
  }, [post]);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c2602a', fontFamily: 'Lato, sans-serif', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}
      >
        ← Back to Blog
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c2602a', background: 'rgba(194,96,42,0.1)', padding: '0.2rem 0.6rem', borderRadius: 20 }}>{post.tag}</span>
        <span style={{ fontSize: '0.72rem', color: '#9a8070', fontFamily: 'Lato, sans-serif' }}>{post.date} · {post.readTime}</span>
      </div>

      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#2c1810', margin: '0 0 1rem', lineHeight: 1.2 }}>{post.title}</h1>

      <p style={{ fontSize: '1rem', color: '#5c3d2e', lineHeight: 1.85, marginBottom: '2rem', fontFamily: 'Lato, sans-serif', fontWeight: 300, borderBottom: '1px solid #e8dfd0', paddingBottom: '1.5rem' }}>{post.excerpt}</p>

      <div style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center', background: 'linear-gradient(135deg,#f2ede4,#e8dfd0)', borderRadius: 12, padding: '2rem' }}>{post.emoji}</div>

      {post.content.map((section, i) => (
        <div key={i}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, color: '#5c3d2e', margin: '1.75rem 0 0.6rem' }}>{section.heading}</h2>
          <p style={{ fontSize: '0.93rem', color: '#4a3728', lineHeight: 1.9, marginBottom: '0.5rem', fontFamily: 'Lato, sans-serif', fontWeight: 300 }}>{section.text}</p>
        </div>
      ))}

      <div style={{ background: '#f2ede4', borderLeft: '3px solid #c2602a', padding: '1rem 1.25rem', margin: '2rem 0', borderRadius: '0 8px 8px 0' }}>
        <p style={{ fontSize: '0.88rem', color: '#4a3728', lineHeight: 1.8, margin: 0, fontFamily: 'Lato, sans-serif' }}>
          Shop all handmade products at <strong>Besties Craft</strong> — WhatsApp us at <strong>+91 88107 76486</strong> for custom orders.
        </p>
      </div>

      <button
        onClick={onBack}
        style={{ background: '#2c1810', color: '#fff', border: 'none', borderRadius: 50, padding: '0.75rem 1.75rem', fontFamily: 'Lato, sans-serif', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}
      >
        ← Back to Blog
      </button>
    </div>
  );
}

// ─── Main Blog Page ────────────────────────────────────────────
export default function BlogPage() {
  const [openPost, setOpenPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [openPost]);

  return (
    <>
      <SEO />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        .blog-page { background: #faf7f2; min-height: 100vh; display: flex; flex-direction: column; font-family: Lato, sans-serif; }
        .blog-hero { background: linear-gradient(135deg, #2c1810 0%, #4a2518 60%, #5c3d2e 100%); padding: 3.5rem 2rem 2.5rem; text-align: center; }
        .blog-hero h1 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.65rem, 4vw, 2.5rem); font-weight: 700; color: #fff; margin: 0 0 0.55rem; line-height: 1.15; }
        .blog-hero h1 em { color: #f4a06a; font-style: italic; }
        .blog-hero p { font-size: 0.9rem; color: rgba(255,255,255,0.48); max-width: 420px; margin: 0 auto; line-height: 1.7; }
        .blog-badge { display: inline-block; background: rgba(194,96,42,0.22); color: #f4a06a; font-size: 0.67rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; padding: 0.32rem 0.85rem; border-radius: 30px; border: 1px solid rgba(194,96,42,0.38); margin-bottom: 0.9rem; }
        .blog-grid { max-width: 1040px; margin: 0 auto; padding: 2.5rem 2rem 4rem; display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        @media (max-width: 640px) { .blog-grid { grid-template-columns: 1fr; padding: 1.5rem 1rem 3rem; } }
      `}</style>

      <div className="blog-page">
        <Navbar />

        {!openPost ? (
          <>
            <div className="blog-hero">
              <div className="blog-badge">✦ Stories & Ideas</div>
              <h1>The Besties Craft <em>Blog</em></h1>
              <p>Gift ideas, crochet inspiration, and handmade stories from Varanasi.</p>
            </div>
            <div className="blog-grid">
              {POSTS.map(post => (
                <PostCard key={post.id} post={post} onClick={() => setOpenPost(post)} />
              ))}
            </div>
          </>
        ) : (
          <PostFull post={openPost} onBack={() => setOpenPost(null)} />
        )}

        <Footer />
      </div>
    </>
  );
}
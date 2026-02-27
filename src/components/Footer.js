import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Instagram, MessageCircle, Mail, MapPin, Phone } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: '#1a0f0a', color: '#c8b8a8', fontFamily: "'Lato', sans-serif", marginTop: 0 }}>

      {/* Main footer grid */}
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '4rem 2rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem' }}>

        {/* Brand column */}
        <div style={{ gridColumn: 'span 1' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', fontWeight: 700, color: '#f2ede4', lineHeight: 1 }}>
              Besties <em style={{ fontStyle: 'italic', color: '#e8a87c' }}>Craft</em>
            </div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: '#6a5040', textTransform: 'uppercase', marginTop: '0.3rem' }}>
              Handcrafted in India · Est. 2025
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', lineHeight: 1.75, color: '#8a7060', maxWidth: 260, margin: '0 0 1.5rem' }}>
            100% handmade crochet products crafted with love in Varanasi. Every piece is unique — no factories, no mass production.
          </p>

          {/* Social links */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <a
              href="https://www.instagram.com/bestiescraft.in"
              target="_blank"
              rel="noopener noreferrer"
              title="Follow us on Instagram @bestiescraft.in"
              style={socialBtnStyle}
              onMouseEnter={e => e.currentTarget.style.background = '#c2602a'}
              onMouseLeave={e => e.currentTarget.style.background = '#2c1810'}
            >
              <Instagram size={17} />
            </a>
            <a
              href="https://wa.me/918810776486"
              target="_blank"
              rel="noopener noreferrer"
              title="Chat on WhatsApp"
              style={socialBtnStyle}
              onMouseEnter={e => e.currentTarget.style.background = '#25d366'}
              onMouseLeave={e => e.currentTarget.style.background = '#2c1810'}
            >
              <MessageCircle size={17} />
            </a>
            <a
              href="mailto:bestiescraft1434@gmail.com"
              title="Email us"
              style={socialBtnStyle}
              onMouseEnter={e => e.currentTarget.style.background = '#c2602a'}
              onMouseLeave={e => e.currentTarget.style.background = '#2c1810'}
            >
              <Mail size={17} />
            </a>
          </div>
        </div>

        {/* Shop links */}
        <div>
          <h4 style={headingStyle}>Shop</h4>
          <ul style={listStyle}>
            {[
              { to: '/products', label: 'All Products' },
              { to: '/products?category=bracelets', label: 'Bracelets' },
              { to: '/products?category=handmade-flowers', label: 'Handmade Flowers' },
              { to: '/products?category=keychains', label: 'Keychains' },
              { to: '/products?category=hair-accessories', label: 'Hair Accessories' },
              { to: '/products?category=gifting-items', label: 'Gifting Items' },
            ].map(link => (
              <li key={link.to}>
                <Link to={link.to} style={linkStyle}
                  onMouseEnter={e => e.currentTarget.style.color = '#e8a87c'}
                  onMouseLeave={e => e.currentTarget.style.color = '#7a6050'}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help links */}
        <div>
          <h4 style={headingStyle}>Help</h4>
          <ul style={listStyle}>
            {[
              { to: '/track-order', label: 'Track My Order' },
              { to: '/orders', label: 'My Orders' },
              { to: '/about', label: 'About Us' },
              { to: '/contact', label: 'Contact Us' },
              { to: '/admin/login', label: 'Admin Login' },
            ].map(link => (
              <li key={link.to}>
                <Link to={link.to} style={linkStyle}
                  onMouseEnter={e => e.currentTarget.style.color = '#e8a87c'}
                  onMouseLeave={e => e.currentTarget.style.color = '#7a6050'}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 style={headingStyle}>Contact Us</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <Phone size={14} style={{ color: '#c2602a', flexShrink: 0, marginTop: 3 }} />
              <a href="tel:+918810776486" style={{ ...linkStyle, fontSize: '0.88rem' }}
                onMouseEnter={e => e.currentTarget.style.color = '#e8a87c'}
                onMouseLeave={e => e.currentTarget.style.color = '#7a6050'}>
                +91 8810776486
              </a>
            </li>
            <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <MessageCircle size={14} style={{ color: '#25d366', flexShrink: 0, marginTop: 3 }} />
              <a href="https://wa.me/918810776486" target="_blank" rel="noopener noreferrer"
                style={{ ...linkStyle, fontSize: '0.88rem' }}
                onMouseEnter={e => e.currentTarget.style.color = '#e8a87c'}
                onMouseLeave={e => e.currentTarget.style.color = '#7a6050'}>
                WhatsApp us
              </a>
            </li>
            <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <Mail size={14} style={{ color: '#c2602a', flexShrink: 0, marginTop: 3 }} />
              <a href="mailto:bestiescraft1434@gmail.com" style={{ ...linkStyle, fontSize: '0.85rem', wordBreak: 'break-all' }}
                onMouseEnter={e => e.currentTarget.style.color = '#e8a87c'}
                onMouseLeave={e => e.currentTarget.style.color = '#7a6050'}>
                bestiescraft1434@gmail.com
              </a>
            </li>
            <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <MapPin size={14} style={{ color: '#c2602a', flexShrink: 0, marginTop: 3 }} />
              <span style={{ fontSize: '0.88rem', color: '#7a6050', lineHeight: 1.5 }}>
                Varanasi, Uttar Pradesh<br />India — 221007
              </span>
            </li>
            <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <Instagram size={14} style={{ color: '#c2602a', flexShrink: 0, marginTop: 3 }} />
              <a href="https://www.instagram.com/bestiescraft.in" target="_blank" rel="noopener noreferrer"
                style={{ ...linkStyle, fontSize: '0.88rem' }}
                onMouseEnter={e => e.currentTarget.style.color = '#e8a87c'}
                onMouseLeave={e => e.currentTarget.style.color = '#7a6050'}>
                @bestiescraft.in
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid #2c1810', maxWidth: 1180, margin: '0 auto', padding: '1.5rem 2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        <p style={{ fontSize: '0.82rem', color: '#4a3020', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          Made with <Heart size={13} style={{ color: '#c2602a', fill: '#c2602a' }} /> by Besties Craft
        </p>
        <p style={{ fontSize: '0.82rem', color: '#4a3020', margin: 0 }}>
          © {currentYear} Besties Craft. All rights reserved.
        </p>
        <p style={{ fontSize: '0.82rem', color: '#4a3020', margin: 0 }}>
          Payments secured by <span style={{ color: '#6a5040', fontWeight: 700 }}>Razorpay</span>
        </p>
      </div>
    </footer>
  );
};

const headingStyle = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: '1rem',
  fontWeight: 600,
  color: '#d4c4b4',
  marginBottom: '1rem',
  letterSpacing: '0.02em',
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
};

const linkStyle = {
  color: '#7a6050',
  textDecoration: 'none',
  fontSize: '0.88rem',
  transition: 'color 0.15s',
  display: 'inline-block',
};

const socialBtnStyle = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  background: '#2c1810',
  border: '1px solid #3d2010',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#e8a87c',
  textDecoration: 'none',
  transition: 'background 0.2s',
  cursor: 'pointer',
};
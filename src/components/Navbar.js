import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { useApp } from '@/App';
import { CartSidebar } from '@/components/CartSidebar';

/* ── Logo — Badge stamp matching pic 2 design ── */
const LogoB = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 76" height="64" style={{ display: 'block' }}>
    <defs>
      <radialGradient id="badgeBg" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#3d1e0e"/>
        <stop offset="100%" stopColor="#1a0804"/>
      </radialGradient>
    </defs>

    {/* ── Outer terracotta border ring ── */}
    <circle cx="38" cy="38" r="36" fill="#b85520"/>
    {/* ── Main dark badge fill ── */}
    <circle cx="38" cy="38" r="33" fill="url(#badgeBg)"/>
    {/* ── Outer thin ring ── */}
    <circle cx="38" cy="38" r="31.5" fill="none" stroke="#c2602a" strokeWidth="0.7" opacity="0.6"/>
    {/* ── Inner dashed ring ── */}
    <circle cx="38" cy="38" r="28" fill="none" stroke="#c2602a" strokeWidth="0.9" strokeDasharray="2.2,3.2" opacity="0.65"/>

    {/* ── HANDMADE curved top text ── */}
    <path id="topCurve" d="M 13,30 A 26,26 0 0,1 63,30" fill="none"/>
    <text fontSize="5.5" fontFamily="Georgia, serif" fontWeight="700" fill="#e8a87c" letterSpacing="2.5">
      <textPath href="#topCurve" startOffset="10%">HANDMADE</textPath>
    </text>
    {/* ── Sparkle diamonds ── */}
    <text x="15" y="27" fontSize="5" fill="#e8a87c" opacity="0.8">✦</text>
    <text x="55" y="27" fontSize="5" fill="#e8a87c" opacity="0.8">✦</text>

    {/* ── Top separator line ── */}
    <line x1="16" y1="31" x2="60" y2="31" stroke="#c2602a" strokeWidth="0.6" opacity="0.45"/>

    {/* ── Besties (cream/white, bold serif) ── */}
    <text x="38" y="45" textAnchor="middle"
      fontFamily="Georgia, 'Times New Roman', serif"
      fontSize="14.5" fontWeight="700"
      fill="#f5ead8" letterSpacing="0.4">Besties</text>

    {/* ── Craft (terracotta italic) ── */}
    <text x="38" y="57" textAnchor="middle"
      fontFamily="Georgia, 'Times New Roman', serif"
      fontSize="12.5" fontStyle="italic" fontWeight="700"
      fill="#c2602a" letterSpacing="0.4">Craft</text>

    {/* ── Bottom separator line ── */}
    <line x1="16" y1="60" x2="60" y2="60" stroke="#c2602a" strokeWidth="0.6" opacity="0.45"/>

    {/* ── INDIA · SINCE 2025 curved bottom text ── */}
    <path id="botCurve" d="M 13,48 A 26,26 0 0,0 63,48" fill="none"/>
    <text fontSize="5" fontFamily="Georgia, serif" fontWeight="600" fill="#e8a87c" letterSpacing="1.8">
      <textPath href="#botCurve" startOffset="8%">INDIA · SINCE 2025</textPath>
    </text>

    {/* ── Vertical divider ── */}
    <line x1="88" y1="14" x2="88" y2="62" stroke="#c2602a" strokeWidth="0.8" opacity="0.35"/>

    {/* ── Wordmark right side ── */}
    <text x="100" y="25" fontFamily="Georgia, serif" fontSize="6.5"
      fill="#c2602a" letterSpacing="2.8" opacity="0.85">✦ ARTISAN COLLECTION</text>
    <text x="100" y="52" fontFamily="Georgia, 'Times New Roman', serif" fontSize="28"
      fontWeight="bold" fill="#2c1810" letterSpacing="0.5">Besties </text>
    <text x="215" y="52" fontFamily="Georgia, 'Times New Roman', serif" fontSize="28"
      fontStyle="italic" fontWeight="bold" fill="#c2602a" letterSpacing="0.5">Craft</text>
    <rect x="100" y="57" width="190" height="1.2" fill="#c2602a" rx="0.5" opacity="0.4"/>
    <text x="100" y="68" fontFamily="Georgia, serif" fontSize="6"
      fill="#9a8070" letterSpacing="2.2">HANDCRAFTED IN INDIA</text>
  </svg>
);

const Navbar = () => {
  const { user, cart, logout } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/products',    label: 'Shop' },
    { to: '/about',       label: 'About' },
    { to: '/contact',     label: 'Contact' },
    { to: '/track-order', label: 'Track Order' },
    ...(user ? [{ to: '/orders', label: 'My Orders' }] : []),
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');
        .nb-root {
          position:sticky; top:0; z-index:200;
          background:rgba(250,247,242,0.97);
          backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
          border-bottom:1px solid #e8dfd0;
          transition:box-shadow 0.3s; font-family:'Lato',sans-serif;
        }
        .nb-root.scrolled { box-shadow:0 4px 28px rgba(44,24,16,0.1); }

        .nb-inner {
          max-width:1180px; margin:0 auto; padding:0 2rem;
          display:flex; align-items:center; justify-content:space-between;
          height:88px;
        }
        .nb-logo-link {
          text-decoration:none; display:flex; align-items:center;
          transition:opacity 0.2s;
        }
        .nb-logo-link:hover { opacity:0.85; }
        .nb-links {
          display:flex; align-items:center; gap:2.2rem;
          list-style:none; margin:0; padding:0;
        }
        .nb-link {
          text-decoration:none; font-size:0.92rem; font-weight:700;
          color:#9a8070; letter-spacing:0.06em; position:relative; padding-bottom:3px;
          transition:color 0.2s;
        }
        .nb-link::after {
          content:''; position:absolute; bottom:-2px; left:0;
          width:0; height:2px; background:#c2602a;
          transition:width 0.25s ease; border-radius:2px;
        }
        .nb-link:hover,.nb-link.active { color:#2c1810; }
        .nb-link:hover::after,.nb-link.active::after { width:100%; }
        .nb-actions { display:flex; align-items:center; gap:0.6rem; }
        .nb-cart-btn {
          position:relative; background:none; border:none; width:44px; height:44px;
          border-radius:50%; display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:#4a3728; transition:background 0.2s,color 0.2s;
        }
        .nb-cart-btn:hover { background:#f2ede4; color:#c2602a; }
        .nb-cart-count {
          position:absolute; top:4px; right:4px; background:#c2602a; color:#fff;
          font-size:0.6rem; font-weight:700; min-width:17px; height:17px;
          border-radius:10px; display:flex; align-items:center; justify-content:center;
          padding:0 4px; border:2px solid #faf7f2; line-height:1;
        }
        .nb-user-pill {
          display:flex; align-items:center; gap:0.5rem;
          background:#f2ede4; border:1.5px solid #e8dfd0; border-radius:50px;
          padding:0.45rem 1.1rem 0.45rem 0.6rem;
          font-size:0.82rem; color:#5c3d2e; font-weight:700;
        }
        .nb-user-icon {
          width:28px; height:28px; border-radius:50%; background:#c2602a; color:#fff;
          display:flex; align-items:center; justify-content:center;
          font-size:0.68rem; font-weight:700; flex-shrink:0;
        }
        .nb-logout-btn {
          background:none; border:none; cursor:pointer; color:#9a8070;
          padding:0.25rem; border-radius:6px; display:flex; align-items:center;
          transition:color 0.2s;
        }
        .nb-logout-btn:hover { color:#c2602a; }
        .nb-login-btn {
          display:inline-flex; align-items:center; gap:0.4rem;
          background:#2c1810; color:#fff; border:none; border-radius:50px;
          padding:0.6rem 1.4rem; font-size:0.88rem; font-weight:700;
          cursor:pointer; font-family:'Lato',sans-serif; transition:background 0.2s;
        }
        .nb-login-btn:hover { background:#5c3d2e; }
        .nb-hamburger {
          display:none; background:none; border:none; width:42px; height:42px;
          border-radius:10px; align-items:center; justify-content:center;
          cursor:pointer; color:#4a3728; transition:background 0.2s;
        }
        .nb-hamburger:hover { background:#f2ede4; }

        /* Mobile drawer */
        .nb-mobile-overlay {
          display:none; position:fixed; inset:0;
          background:rgba(44,24,16,0.4); z-index:299; backdrop-filter:blur(2px);
        }
        .nb-mobile-drawer {
          position:fixed; top:0; left:0; bottom:0; width:min(300px,85vw);
          background:#faf7f2; z-index:300; display:flex; flex-direction:column;
          transform:translateX(-100%); transition:transform 0.32s cubic-bezier(.4,0,.2,1);
          box-shadow:8px 0 40px rgba(44,24,16,0.15); overflow:hidden;
        }
        .nb-mobile-drawer.open { transform:translateX(0); }
        .nb-mobile-overlay.open { display:block; }
        .nb-drawer-head {
          display:flex; align-items:center; justify-content:space-between;
          padding:1rem 1.25rem; border-bottom:1px solid #e8dfd0; background:#f2ede4;
        }
        .nb-drawer-close {
          background:#fff; border:1.5px solid #e8dfd0; width:34px; height:34px;
          border-radius:50%; display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:#9a8070; transition:all 0.15s; flex-shrink:0;
        }
        .nb-drawer-close:hover { background:#e8dfd0; color:#2c1810; }
        .nb-drawer-links {
          flex:1; padding:1.5rem 1rem; display:flex; flex-direction:column;
          gap:0.35rem; overflow-y:auto;
        }
        .nb-drawer-link {
          display:flex; align-items:center; text-decoration:none;
          font-size:0.95rem; font-weight:700; color:#4a3728;
          padding:0.8rem 1rem; border-radius:12px;
          transition:background 0.15s,color 0.15s; font-family:'Lato',sans-serif;
        }
        .nb-drawer-link:hover,.nb-drawer-link.active { background:#f2ede4; color:#c2602a; }
        .nb-drawer-link.active { border-left:3px solid #c2602a; padding-left:calc(1rem - 3px); }
        .nb-drawer-footer {
          padding:1.25rem 1.5rem; border-top:1px solid #e8dfd0;
          display:flex; flex-direction:column; gap:0.65rem;
        }
        .nb-drawer-cart-btn {
          display:flex; align-items:center; justify-content:space-between;
          background:#2c1810; color:#fff; border:none; border-radius:12px;
          padding:0.85rem 1.2rem; font-size:0.9rem; font-weight:700;
          cursor:pointer; font-family:'Lato',sans-serif; transition:background 0.2s;
        }
        .nb-drawer-cart-btn:hover { background:#5c3d2e; }
        .nb-drawer-cart-left { display:flex; align-items:center; gap:0.6rem; }
        .nb-drawer-login-btn {
          display:flex; align-items:center; justify-content:center; gap:0.5rem;
          background:#f2ede4; color:#2c1810; border:1.5px solid #e8dfd0;
          border-radius:12px; padding:0.75rem; font-size:0.88rem; font-weight:700;
          cursor:pointer; font-family:'Lato',sans-serif; transition:all 0.15s;
        }
        .nb-drawer-login-btn:hover { border-color:#c2602a; color:#c2602a; }
        .nb-drawer-user {
          display:flex; align-items:center; justify-content:space-between;
          background:#f2ede4; border-radius:12px; padding:0.75rem 1rem;
        }
        .nb-drawer-user-info { display:flex; align-items:center; gap:0.65rem; }
        .nb-drawer-user-avatar {
          width:34px; height:34px; border-radius:50%; background:#c2602a; color:#fff;
          display:flex; align-items:center; justify-content:center;
          font-size:0.75rem; font-weight:700;
        }
        .nb-drawer-user-email {
          font-size:0.78rem; color:#5c3d2e; font-weight:700;
          max-width:160px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
        }
        .nb-drawer-logout {
          background:none; border:none; cursor:pointer; color:#9a8070;
          padding:0.3rem; border-radius:8px; display:flex; align-items:center;
          transition:color 0.15s;
        }
        .nb-drawer-logout:hover { color:#c2602a; }

        @media (max-width:768px) {
          .nb-links,.nb-actions { display:none !important; }
          .nb-hamburger { display:flex; }
          .nb-inner { height:76px; padding:0 1.25rem; }
        }
      `}</style>

      <nav className={`nb-root${scrolled ? ' scrolled' : ''}`}>
        <div className="nb-inner">
          <Link to="/" className="nb-logo-link" aria-label="Besties Craft Home">
            <LogoB />
          </Link>

          <ul className="nb-links">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link to={link.to} className={`nb-link${isActive(link.to) ? ' active' : ''}`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nb-actions">
            <button className="nb-cart-btn" onClick={() => setIsCartOpen(true)} aria-label="Cart">
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="nb-cart-count">{cartCount}</span>}
            </button>
            {user ? (
              <div className="nb-user-pill">
                <div className="nb-user-icon">{user.email?.[0]?.toUpperCase() || 'U'}</div>
                <span style={{ maxWidth:130, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {user.email}
                </span>
                <button className="nb-logout-btn" onClick={logout} title="Logout">
                  <LogOut size={14}/>
                </button>
              </div>
            ) : (
              <button className="nb-login-btn" onClick={() => navigate('/login')}>
                <User size={15}/> Login
              </button>
            )}
          </div>

          <button className="nb-hamburger" onClick={() => setIsMenuOpen(true)} aria-label="Menu">
            <Menu size={22}/>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`nb-mobile-overlay${isMenuOpen ? ' open' : ''}`} onClick={() => setIsMenuOpen(false)}/>
      <div className={`nb-mobile-drawer${isMenuOpen ? ' open' : ''}`}>
        <div className="nb-drawer-head">
          <Link to="/" onClick={() => setIsMenuOpen(false)}><LogoB /></Link>
          <button className="nb-drawer-close" onClick={() => setIsMenuOpen(false)}><X size={16}/></button>
        </div>
        <div className="nb-drawer-links">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              className={`nb-drawer-link${isActive(link.to) ? ' active' : ''}`}
              onClick={() => setIsMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="nb-drawer-footer">
          <button className="nb-drawer-cart-btn" onClick={() => { setIsCartOpen(true); setIsMenuOpen(false); }}>
            <span className="nb-drawer-cart-left"><ShoppingCart size={18}/> My Cart</span>
            {cartCount > 0 && (
              <span style={{ background:'#c2602a', color:'#fff', borderRadius:20, padding:'2px 10px', fontSize:'0.75rem', fontWeight:700 }}>
                {cartCount} items
              </span>
            )}
          </button>
          {user ? (
            <div className="nb-drawer-user">
              <div className="nb-drawer-user-info">
                <div className="nb-drawer-user-avatar">{user.email?.[0]?.toUpperCase() || 'U'}</div>
                <span className="nb-drawer-user-email">{user.email}</span>
              </div>
              <button className="nb-drawer-logout" onClick={() => { logout(); setIsMenuOpen(false); }}>
                <LogOut size={16}/>
              </button>
            </div>
          ) : (
            <button className="nb-drawer-login-btn" onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>
              <User size={15}/> Login / Sign Up
            </button>
          )}
        </div>
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}/>
    </>
  );
};

export { Navbar };

import React, { useState, useEffect } from 'react';

const WHATSAPP_NUMBER = '918810776486';
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hi Besties Craft! 🌸 I\'m interested in your handmade crochet products. Can you help me?'
);

const WhatsAppButton = () => {
  const [visible,  setVisible]  = useState(false);
  const [tooltip,  setTooltip]  = useState(false);
  const [pulse,    setPulse]    = useState(true);

  // Show button after 2 seconds
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Stop pulse after 6 seconds
  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 6000);
    return () => clearTimeout(t);
  }, []);

  const handleClick = () => {
    // Fire GA4 event
    if (window.gtag) {
      window.gtag('event', 'whatsapp_click', {
        event_category: 'engagement',
        event_label: 'whatsapp_float_button',
      });
    }
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        .wa-wrap {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }

        /* Tooltip bubble */
        .wa-tooltip {
          background: #fff;
          color: #1a1a1a;
          font-family: 'Lato', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 0.55rem 1rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.14);
          white-space: nowrap;
          animation: wa-slide-in 0.25s ease;
          border: 1px solid #f0f0f0;
          max-width: 220px;
        }
        .wa-tooltip::after {
          content: '';
          position: absolute;
          right: 18px;
          bottom: -6px;
          width: 12px; height: 12px;
          background: #fff;
          border-right: 1px solid #f0f0f0;
          border-bottom: 1px solid #f0f0f0;
          transform: rotate(45deg);
        }
        .wa-tooltip-wrap {
          position: relative;
        }

        /* Main button */
        .wa-btn {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          background: #25D366;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 24px rgba(37,211,102,0.45);
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
        }
        .wa-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 32px rgba(37,211,102,0.55);
        }
        .wa-btn:active { transform: scale(0.97); }

        /* Pulse ring */
        .wa-btn.pulse::before {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 3px solid rgba(37,211,102,0.5);
          animation: wa-pulse 1.8s ease-out infinite;
        }

        @keyframes wa-pulse {
          0%   { transform: scale(0.9); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes wa-slide-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes wa-fade-in {
          from { opacity: 0; transform: translateY(16px) scale(0.92); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .wa-wrap { animation: wa-fade-in 0.4s ease; }

        @media (max-width: 480px) {
          .wa-wrap { bottom: 20px; right: 18px; }
          .wa-btn  { width: 56px; height: 56px; }
        }
      `}</style>

      <div className="wa-wrap">
        {/* Tooltip — shown on hover */}
        {tooltip && (
          <div className="wa-tooltip-wrap">
            <div className="wa-tooltip">
              💬 Chat with us on WhatsApp!
            </div>
          </div>
        )}

        <button
          className={`wa-btn${pulse ? ' pulse' : ''}`}
          onClick={handleClick}
          onMouseEnter={() => setTooltip(true)}
          onMouseLeave={() => setTooltip(false)}
          aria-label="Chat on WhatsApp"
          title="Chat with Besties Craft on WhatsApp"
        >
          {/* WhatsApp SVG icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width="34"
            height="34"
            fill="#fff"
          >
            <path d="M16 2C8.28 2 2 8.28 2 16c0 2.46.66 4.76 1.8 6.76L2 30l7.44-1.76A13.9 13.9 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.4a11.4 11.4 0 0 1-5.8-1.58l-.42-.24-4.4 1.04 1.06-4.3-.28-.44A11.38 11.38 0 0 1 4.6 16C4.6 9.7 9.7 4.6 16 4.6S27.4 9.7 27.4 16 22.3 27.4 16 27.4zm6.24-8.54c-.34-.17-2-.98-2.32-1.1-.3-.1-.52-.17-.74.18-.22.34-.86 1.1-1.06 1.32-.2.22-.38.24-.72.08a9.1 9.1 0 0 1-2.68-1.66 10.04 10.04 0 0 1-1.86-2.32c-.2-.34-.02-.52.14-.7.16-.16.34-.4.52-.6.17-.2.22-.34.34-.56.1-.22.06-.42-.02-.6-.08-.16-.74-1.78-1.02-2.44-.26-.62-.54-.54-.74-.54h-.62c-.22 0-.56.08-.86.4-.3.3-1.12 1.1-1.12 2.68s1.14 3.1 1.3 3.32c.16.22 2.24 3.4 5.42 4.76.76.32 1.34.52 1.8.68.76.24 1.44.2 1.98.12.6-.1 1.86-.76 2.12-1.5.26-.72.26-1.34.18-1.48-.08-.14-.3-.22-.64-.38z"/>
          </svg>
        </button>
      </div>
    </>
  );
};

export default WhatsAppButton;
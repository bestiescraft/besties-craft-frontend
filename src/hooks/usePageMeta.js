import { useEffect } from 'react';

/**
 * usePageMeta — sets document title + meta tags dynamically per page
 * Usage:
 *   usePageMeta({
 *     title: 'Shop Crochet Bracelets — Besties Craft',
 *     description: 'Browse our handmade crochet bracelets...',
 *     image: 'https://...',   // optional OG image
 *     url: '/products',       // optional canonical path
 *   });
 */
const BASE_URL = 'https://besties-craft-frontend.vercel.app';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

const usePageMeta = ({ title, description, image, url, type = 'website' }) => {
  useEffect(() => {
    // ── Title ──
    if (title) document.title = title;

    const setMeta = (selector, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        // extract name or property from selector
        if (selector.includes('property=')) {
          el.setAttribute('property', selector.match(/property="([^"]+)"/)[1]);
        } else if (selector.includes('name=')) {
          el.setAttribute('name', selector.match(/name="([^"]+)"/)[1]);
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    if (description) {
      setMeta('meta[name="description"]',         description);
      setMeta('meta[property="og:description"]',  description);
      setMeta('meta[name="twitter:description"]', description);
    }

    if (title) {
      setMeta('meta[property="og:title"]',  title);
      setMeta('meta[name="twitter:title"]', title);
    }

    const ogImage = image || DEFAULT_IMAGE;
    setMeta('meta[property="og:image"]',  ogImage);
    setMeta('meta[name="twitter:image"]', ogImage);

    if (url) {
      const fullUrl = `${BASE_URL}${url}`;
      setMeta('meta[property="og:url"]',  fullUrl);
      setMeta('meta[name="twitter:url"]', fullUrl);

      // canonical link
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', fullUrl);
    }

    if (type) {
      setMeta('meta[property="og:type"]', type);
    }

    // Fire GA4 page view on route change
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title:    title,
        page_location: window.location.href,
        page_path:     window.location.pathname,
      });
    }
  }, [title, description, image, url, type]);
};

export default usePageMeta;
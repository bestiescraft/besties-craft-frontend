// src/lib/constants.js
// ─────────────────────────────────────────────────────────────
// Single source of truth for all shared constants.
// Import from here — never redefine BACKEND_URL in individual files.
// ─────────────────────────────────────────────────────────────

export const BACKEND_URL =
  (process.env.REACT_APP_BACKEND_URL || 'https://besties-craft-backend-1.onrender.com')
    .replace(/\/$/, '');

export const API = `${BACKEND_URL}/api`;

// ── Colour helpers ────────────────────────────────────────────
export const COLOR_MAP = {
  Red:        '#EF4444',
  Pink:       '#EC4899',
  Purple:     '#A855F7',
  Blue:       '#3B82F6',
  'Sky Blue': '#38BDF8',
  Green:      '#22C55E',
  Yellow:     '#EAB308',
  Orange:     '#F97316',
  White:      '#F5F5F5',
  Black:      '#1E293B',
  Brown:      '#92400E',
  Beige:      '#D4C5A9',
  Grey:       '#94A3B8',
  Cream:      '#FFF9E6',
  Maroon:     '#7F1D1D',
  Navy:       '#1E3A5F',
};

export const getColorHex = (name) => COLOR_MAP[name] || '#ccc';

// ── Image helpers ─────────────────────────────────────────────
export const PLACEHOLDER_IMG =
  'https://placehold.co/400x400/e8e0d5/a09080?text=Craft';

/** Normalise a possibly-relative image URL to an absolute one */
export const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BACKEND_URL}${url}`;
};
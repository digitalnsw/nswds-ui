/**
 * Presentation metadata for the live demos, importable from server components
 * (components/demos.tsx is a client module, so plain values can't cross from
 * there).
 */

/** Slugs whose demo spans the panel edge to edge (page-chrome components). */
export const bleedDemos = new Set([
  'masthead',
  'header',
  'footer',
  'main-nav',
  'footer-simple-centred',
  'footer-compact',
  'footer-sitemap',
  'footer-sitemap-brand',
  'footer-newsletter',
  'footer-contact',
  'footer-cta',
  'footer-accordion',
])

/**
 * Shared overlay treatment (design-shotgun, overlays-20260923), so every
 * overlay in the package dims the page and draws its rules the same way.
 * Class strings, not components: each consumer keeps its own element and
 * merges these in with `cn()`. Tailwind scans this file like any source file.
 */

/**
 * The page scrim behind a modal overlay — Dialog, AlertDialog, Sheet, Drawer.
 * Flat `grey-950` at 70%: no blur (glassmorphism is off-brand, DESIGN.md) and
 * no shadow on the popup above it — depth is drawn by the popup's ring.
 */
const overlayScrim = 'bg-grey-950/70'

/**
 * Sets `--overlay-ink`, the interactive ink the `rule` look paints its cap and
 * rail with: primary-800 light / primary-200 dark (DESIGN.md, The Role-Flip
 * Rule). One declaration, so the dialog cap, the alert cap and the menu rail
 * cannot drift apart.
 */
const overlayInk = '[--overlay-ink:var(--primary-800)] dark:[--overlay-ink:var(--primary-200)]'

export { overlayInk, overlayScrim }

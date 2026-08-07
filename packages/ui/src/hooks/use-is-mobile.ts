'use client'

import * as React from 'react'

/**
 * Viewport width below which `useIsMobile` reports `true`. Matches Tailwind's
 * `md` breakpoint (768px) so JS behaviour switches at the same point as the
 * `md:` utilities that hide/show the desktop sidebar.
 */
const MOBILE_BREAKPOINT = 768

/**
 * SSR-safe "is this a mobile viewport?" hook.
 *
 * Subscribes to `window.matchMedia` through `useSyncExternalStore`, so the
 * value updates on viewport resize without a manual resize listener and stays
 * tear-free under concurrent rendering. During server rendering (and the
 * first client render before hydration) it returns `false` — mobile-only UI
 * appears after hydration rather than flashing desktop UI on phones being
 * declared "correct" by the server. Components that must avoid a
 * desktop-to-mobile swap on first paint should also gate with CSS (as the
 * Sidebar does with `hidden md:flex`).
 *
 * Departure from the nswds-app source (`useIsMobile` with `useState` +
 * `useEffect`): same behaviour, but `useSyncExternalStore` removes the
 * initial `undefined` state and the double render on mount, and gives an
 * explicit server snapshot instead of relying on `!!undefined`.
 *
 * @param breakpoint Viewport width in px at which "mobile" ends. Defaults to
 *   768 (Tailwind `md`). The query used is `(max-width: breakpoint - 1px)`.
 */
function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT): boolean {
  const query = `(max-width: ${breakpoint - 1}px)`

  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      const mediaQueryList = window.matchMedia(query)
      mediaQueryList.addEventListener('change', onStoreChange)
      return () => mediaQueryList.removeEventListener('change', onStoreChange)
    },
    [query],
  )

  const getSnapshot = React.useCallback(() => window.matchMedia(query).matches, [query])

  // Server snapshot: no window, so assume desktop. Documented above.
  const getServerSnapshot = React.useCallback(() => false, [])

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export { MOBILE_BREAKPOINT, useIsMobile }

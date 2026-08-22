'use client'

import * as React from 'react'

/** Default custom property the measured height is published to. */
const DEFAULT_PROPERTY = '--chrome-height'

type UseChromeHeightOptions = {
  /**
   * Custom property to publish the measured height to, on `<html>`. Pass
   * `null` to publish nothing and use the returned number only.
   *
   * @default '--chrome-height'
   */
  property?: string | null
}

type UseChromeHeightResult<T extends HTMLElement> = {
  /** Attach to the element whose height should be tracked. */
  ref: React.RefObject<T | null>
  /** Live measured height in CSS pixels. `0` until the first measurement. */
  height: number
}

/**
 * Measures a sticky chrome element and publishes its height as a CSS custom
 * property on `<html>`, keeping it current as the element resizes.
 *
 * **Why this belongs in the package.** Several components already need the
 * height of the chrome above them and have no way to ask for it: `MainNav`
 * documents that a consumer stacking it under a sticky `Header` must set
 * `--main-nav-top` to the header's height, and any page with anchor links
 * needs the same number for `scroll-padding-top` or its targets land behind
 * the chrome. Every consumer was therefore writing the same `ResizeObserver`,
 * and the failure it prevents only appears at the widths where the header
 * wraps to a second line — which is exactly where hand-written versions were
 * hardcoding a constant instead.
 *
 * ```tsx
 * const { ref, height } = useChromeHeight({ property: '--site-chrome-height' })
 *
 * return (
 *   <div ref={ref} className='sticky top-0 z-40'>
 *     <Header sticky={false} />
 *     <MainNav navigation={nav} />
 *   </div>
 * )
 * ```
 *
 * ```css
 * html {
 *   scroll-padding-top: calc(var(--site-chrome-height, 0px) + 1.5rem);
 * }
 * ```
 *
 * Notes:
 *
 * - **The number is `0` until after mount.** It is measured in an effect, so
 *   the server render and the first client render agree — reading the DOM
 *   during render would be a hydration mismatch. Give the custom property a
 *   fallback in CSS (`var(--site-chrome-height, 0px)`) for that first paint.
 * - **The property is removed on unmount**, so a chrome element that unmounts
 *   does not leave a stale offset behind for whatever renders next.
 * - Height comes from `borderBoxSize`, not `getBoundingClientRect()`: the
 *   latter reports the *transformed* size, so a chrome element that animates
 *   with a transform would publish a height that does not match the space it
 *   occupies in layout.
 */
function useChromeHeight<T extends HTMLElement = HTMLElement>({
  property = DEFAULT_PROPERTY,
}: UseChromeHeightOptions = {}): UseChromeHeightResult<T> {
  const ref = React.useRef<T>(null)
  const [height, setHeight] = React.useState(0)

  React.useEffect(() => {
    const element = ref.current
    if (!element) {
      return
    }

    const root = element.ownerDocument.documentElement

    function publish(next: number) {
      setHeight(next)
      if (property) {
        root.style.setProperty(property, `${next}px`)
      }
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) {
        return
      }

      // `borderBoxSize` is the layout size, unaffected by any transform on the
      // element. It is an array to allow for fragmented boxes; the first entry
      // is the whole box for everything this hook is used on. The fallback
      // covers the (now historical) browsers that reported only contentRect.
      const box = entry.borderBoxSize?.[0]
      publish(box ? box.blockSize : entry.contentRect.height)
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
      if (property) {
        root.style.removeProperty(property)
      }
    }
  }, [property])

  return { ref, height }
}

export { useChromeHeight }
export type { UseChromeHeightOptions, UseChromeHeightResult }

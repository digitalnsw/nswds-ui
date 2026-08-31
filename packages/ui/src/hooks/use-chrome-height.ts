'use client'

import * as React from 'react'

/** Default custom property the measured height is published to. */
const DEFAULT_PROPERTY = '--chrome-height'

/**
 * Which hook instance currently owns each published property, keyed by
 * `<html>` element and then by property name.
 *
 * Two instances CAN legitimately share a property name — the default one, most
 * obviously, on a page with a sticky header and a sticky sub-nav that both
 * want to publish. Without an owner check the first to unmount removes the
 * property out from under the survivor, and no ResizeObserver fires on the
 * survivor afterwards to put it back: the offset silently reverts to the CSS
 * fallback and anchor targets start landing behind the chrome. Removing only
 * when THIS instance is the last writer keeps the JSDoc promise ("a chrome
 * element that goes away does not leave a stale offset behind") true without
 * breaking the other instance.
 *
 * Keyed by document so an instance rendered into a portal in another document
 * (a popped-out window) does not collide with the main one. A WeakMap because
 * a torn-down document must stay collectable.
 */
const propertyOwners = new WeakMap<HTMLElement, Map<string, symbol>>()

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
  /**
   * Attach to the element whose height should be tracked.
   *
   * A CALLBACK ref, not a ref object, for two reasons. It re-attaches the
   * observer when the element itself changes — a chrome wrapper that unmounts
   * and remounts, or swaps between two elements, would otherwise leave the
   * observer watching the detached node, because an effect keyed on a ref
   * object never re-runs when only `.current` changes. And it keeps the
   * returned value readable during render: React Compiler's lint rejects
   * reading a ref there, which a consumer doing `ref={chrome.ref}` would
   * otherwise trip on every use.
   */
  ref: React.RefCallback<T>
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
 * - **Destructure the result, as above — do not hold it as one object.**
 *   `const chrome = useChromeHeight(); chrome.height` fails React Compiler's
 *   lint with *"Cannot access refs during render"*: the returned object carries
 *   a `ref`, so the compiler treats reading any property off it as reading a
 *   ref. Destructuring at the call site gives two plain bindings and the rule
 *   does not apply. Projects without that lint are unaffected either way.
 * - **The number is `0` until after mount.** It is measured in an effect, so
 *   the server render and the first client render agree — reading the DOM
 *   during render would be a hydration mismatch. Give the custom property a
 *   fallback in CSS (`var(--site-chrome-height, 0px)`) for that first paint.
 * - **The property is removed on unmount**, and whenever the tracked element
 *   changes, so a chrome element that goes away does not leave a stale offset
 *   behind for whatever renders next. Two instances may safely share one
 *   property name: the removal is skipped unless this instance was the last to
 *   publish, so unmounting one never blanks the value the other still owns.
 * - Height comes from `borderBoxSize`, not `getBoundingClientRect()`: the
 *   latter reports the *transformed* size, so a chrome element that animates
 *   with a transform would publish a height that does not match the space it
 *   occupies in layout.
 */
function useChromeHeight<T extends HTMLElement = HTMLElement>({
  property = DEFAULT_PROPERTY,
}: UseChromeHeightOptions = {}): UseChromeHeightResult<T> {
  // The measured element is STATE, not a ref: the effect below has to re-run
  // when it changes, and a ref mutation does not re-render or re-run anything.
  const [element, setElement] = React.useState<T | null>(null)
  const [height, setHeight] = React.useState(0)

  // Wrapped rather than handing back `setElement` directly. A state setter also
  // accepts an updater FUNCTION, so its type is wider than a ref callback's and
  // its contract subtly different; this is exactly `RefCallback<T>` and nothing
  // more. `useCallback` keeps it stable, so React does not detach and reattach
  // the ref on every render.
  const ref = React.useCallback<React.RefCallback<T>>((node) => {
    setElement(node)
  }, [])

  // Identity for this hook instance, used to decide whether it is still the
  // property's owner at cleanup time. Created lazily INSIDE the effect, not
  // during render: it is only ever read there, and a render-phase ref write
  // would be a side effect in render for no benefit. `??=` keeps the same
  // symbol across the effect's re-runs (a changed element or property), which
  // is what makes ownership survive them.
  const instanceRef = React.useRef<symbol | null>(null)

  React.useEffect(() => {
    if (!element) {
      return
    }

    const root = element.ownerDocument.documentElement
    const instance = (instanceRef.current ??= Symbol('useChromeHeight'))

    function publish(next: number) {
      setHeight(next)
      if (property) {
        let owners = propertyOwners.get(root)
        if (!owners) {
          owners = new Map()
          propertyOwners.set(root, owners)
        }
        // Last writer wins, matching what the CSS custom property itself does.
        owners.set(property, instance)
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
      // covers the (now historical) browsers that reported only contentRect —
      // and reads `offsetHeight`, NOT `contentRect.height`, because the latter
      // is the CONTENT box: on a chrome element with padding or a border the
      // two disagree by exactly that amount, so the fallback would publish a
      // height smaller than the space the element occupies. offsetHeight is
      // border-box and untransformed, which is what borderBoxSize reports.
      const box = entry.borderBoxSize?.[0]
      publish(box ? box.blockSize : element.offsetHeight)
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
      if (!property) {
        return
      }
      const owners = propertyOwners.get(root)
      // Only the last writer clears the property. Another instance publishing
      // to the same name has already taken ownership, and its value is the one
      // on the element — tearing it down here would strand that instance with
      // no way to republish (its element has not resized, so no observer
      // callback is coming).
      if (owners?.get(property) === instance) {
        owners.delete(property)
        root.style.removeProperty(property)
      }
    }
  }, [element, property])

  return { ref, height }
}

export { useChromeHeight }
export type { UseChromeHeightOptions, UseChromeHeightResult }

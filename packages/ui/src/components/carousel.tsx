'use client'

import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import * as React from 'react'

import { IconChevronLeft } from '../icons/chevron-left.js'
import { IconChevronRight } from '../icons/chevron-right.js'
import { cn } from '../lib/utils.js'
import { Button } from './button.js'
import { useDirection } from './direction.js'

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

/**
 * Roles whose keyboard contract claims the arrow keys.
 *
 * Three groups, and the split matters for how they are matched:
 *
 * 1. Roles that consume arrows on the FOCUSED element itself — a caret or a
 *    thumb lives there.
 * 2. COMPOSITE roles that consume arrows on behalf of a focused descendant.
 *    Under a roving tabindex the focus sits on the `tab`/`option`/`menuitem`
 *    while the contract lives on the container, so matching the event target's
 *    own role alone misses every one of them. The ancestor walk in
 *    `ownsArrowKeys` is what finds these.
 * 3. The descendant halves of those composites. Redundant with the walk when
 *    the pair is nested in the DOM, but a composite may own its items through
 *    `aria-owns` instead, and no ancestor walk can see that association.
 */
const ARROW_CONSUMING_ROLES = new Set([
  // 1 — consumed by the focused element
  'combobox',
  'scrollbar',
  'searchbox',
  // `separator` is the focusable window-splitter form, and it is not
  // hypothetical here: this package's own ResizableHandle wraps
  // react-resizable-panels, which renders role="separator" and handles all
  // four arrows. A Resizable inside a slide loses its keyboard resizing
  // without this entry.
  'separator',
  'slider',
  'spinbutton',
  'textbox',
  // 2 — consumed by an ancestor composite
  'application',
  'grid',
  'listbox',
  'menu',
  'menubar',
  'radiogroup',
  'tablist',
  // `toolbar` matters more than it looks: its controls are usually plain
  // buttons, which have no native arrow behaviour, so a toolbar can move focus
  // WITHOUT calling preventDefault — meaning the defaultPrevented guard in the
  // handler does not cover it and only this list can.
  'toolbar',
  'tree',
  'treegrid',
  // 3 — the descendant halves, for aria-owns associations
  'columnheader',
  'gridcell',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'radio',
  'row',
  'rowheader',
  'tab',
  'treeitem',
])

/**
 * Whether the event target owns the arrow keys itself.
 *
 * The carousel's key handler runs on the region, so without this test it would
 * act on arrows the user meant for a control INSIDE a slide — moving the
 * carousel instead of the caret in a text field, or the thumb on a slider.
 * Slides carrying form controls are ordinary (a filter row, a step in a form),
 * so this is the common case, not an exotic one.
 *
 * Native elements are matched by tag rather than by their implicit role,
 * because an `<input type='checkbox'>` reports no `role` attribute and its
 * implicit role is not readable from the DOM without a mapping table. Every
 * `<input>` is treated as arrow-consuming: the types that do not strictly need
 * arrows (checkbox, button) are still ones a user would not expect to scroll a
 * carousel from.
 */
function ownsArrowKeys(target: EventTarget | null, boundary: EventTarget | null): boolean {
  // Walks ANCESTORS, not just the target. Every roving-tabindex composite
  // focuses a descendant — the `tab` inside the `tablist`, the `option` inside
  // the `listbox` — so testing only the focused element's own role misses the
  // entire class, and the carousel scrolls while the user is moving between
  // tabs. Stops at the carousel region so the walk cannot escape into the
  // consumer's page and match something unrelated.
  //
  // Duck-typed on nodeType rather than `instanceof Element`. `instanceof` is
  // per-realm: a carousel rendered into another document (a portal, a
  // popped-out window) would fail the check and fall through to `false`, and
  // false is the ANSWER THAT STEALS THE KEY — the exact bug this guard exists
  // to prevent. Getting it wrong should not depend on which realm the node
  // came from.
  let element = target as Element | null

  while (element && element.nodeType === 1 && typeof element.getAttribute === 'function') {
    const tag = element.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
      return true
    }
    if ((element as HTMLElement).isContentEditable) {
      return true
    }
    const role = element.getAttribute('role')
    if (role !== null && ARROW_CONSUMING_ROLES.has(role)) {
      return true
    }
    // Tested first, then stopped on: the region itself gets the same checks as
    // anything else, but nothing above it does.
    if (element === boundary) {
      return false
    }
    element = element.parentElement
  }

  return false
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }

  return context
}

function Carousel({
  orientation = 'horizontal',
  opts,
  setApi,
  plugins,
  className,
  children,
  onKeyDown,
  ...props
}: React.ComponentProps<'div'> & CarouselProps) {
  // Read once, and used for BOTH halves of direction handling: embla's own
  // scroll axis and the arrow-key mapping below. Wiring only the keys (which
  // an earlier version of this file did) leaves the engine scrolling ltr while
  // the keyboard and the RTL flex layout both run the other way — the two
  // disagree on every press unless the consumer separately passes
  // `opts.direction`, which nothing documented or enforced.
  //
  // `direction` sits BEFORE the spread so an explicit `opts.direction` still
  // wins; a consumer who wants the engine mirrored independently of the
  // ambient DirectionProvider keeps that escape hatch.
  // `opts.direction` wins for the engine because it is spread later, so it has
  // to win for the KEYS too. Deriving both from one effective value is what
  // makes the escape hatch documented below actually safe: passing
  // `opts={{ direction: 'rtl' }}` under a default LTR provider previously ran
  // the engine RTL while mapping keys LTR, so the two halves disagreed on every
  // press — the same class of desync this comment claims to prevent.
  const providerDirection = useDirection()
  const direction = opts?.direction ?? providerDirection
  const [carouselRef, api] = useEmblaCarousel(
    {
      direction,
      ...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y',
    },
    plugins,
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  // Which arrow key means "previous". A vertical carousel moves on the block
  // axis, and a horizontal one follows the reading direction — in RTL the
  // first slide sits on the RIGHT, so ArrowRight goes back. The rest of this
  // file is already direction-aware through logical properties (`-ms-4`,
  // `ps-4`, `-start-12`) and `rtl:` variants; keys have to agree with them or
  // the keyboard drives the carousel the opposite way to what is on screen.
  //
  // `useDirection` (read above, and also handed to embla) comes from the
  // nearest DirectionProvider. Consumers must ALSO set `dir` on a DOM ancestor
  // for the CSS half — see the note on DirectionProvider in
  // direction.stories.tsx.
  const [previousKey, nextKey] =
    orientation === 'vertical'
      ? (['ArrowUp', 'ArrowDown'] as const)
      : direction === 'rtl'
        ? (['ArrowRight', 'ArrowLeft'] as const)
        : (['ArrowLeft', 'ArrowRight'] as const)

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // The consumer's handler runs FIRST, and is destructured out of `props`
      // rather than left to the trailing spread. The spread sits after
      // `onKeyDown` on the root element, so a consumer passing one used to
      // REPLACE this handler outright and silently switch off every arrow key
      // — on a component whose props type explicitly accepts `onKeyDown`.
      //
      // Running theirs first also gives them a working opt-out for free: the
      // defaultPrevented test below already covers it, so `preventDefault()`
      // in a consumer handler suppresses the carousel exactly as it does for a
      // widget inside a slide. Errors are deliberately not caught — a throwing
      // consumer handler should surface, as it would on a plain <div>.
      onKeyDown?.(event)

      // Somebody nearer the key already dealt with it. ownsArrowKeys below is a
      // list of the things we know consume arrows; this is the open-ended half,
      // covering any custom widget in a slide that handles its own keys and
      // says so the standard way.
      //
      // It also covers a nested carousel, because the inner one calls
      // preventDefault when it acts: by the time the event reaches an outer
      // carousel's handler this test is already true. Measured — removing this
      // OR the stopPropagation below leaves the Nested story passing, and
      // removing both fails it. The two overlap deliberately; see below.
      if (event.defaultPrevented) {
        return
      }
      // A control inside a slide gets its arrows untouched. See ownsArrowKeys.
      if (ownsArrowKeys(event.target, event.currentTarget)) {
        return
      }
      if (event.key === previousKey) {
        event.preventDefault()
        // Keeps the press from reaching ancestors at all. For an ancestor
        // CAROUSEL the defaultPrevented test above already handles it, so this
        // is not what fixes nesting on its own — it is here for ancestors that
        // are not carousels: a native keydown listener on a wrapper does not
        // consult defaultPrevented unless its author remembered to, and a key
        // this component has consumed should not also scroll someone's custom
        // shell.
        event.stopPropagation()
        scrollPrev()
      } else if (event.key === nextKey) {
        event.preventDefault()
        event.stopPropagation()
        scrollNext()
      }
    },
    [onKeyDown, previousKey, nextKey, scrollPrev, scrollNext],
  )

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) return
    // Seed the button state from Embla on mount: the api only exists after
    // Embla has initialised (so its 'init'/'reInit' event has already fired
    // before we subscribe below), and without this the "next" control would
    // stay disabled until the first scroll. The one extra render is intended.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect(api)
    api.on('reInit', onSelect)
    api.on('select', onSelect)

    return () => {
      // BOTH subscriptions come off. Embla clears its own event store on
      // destroy, so leaving 'reInit' attached is harmless while the api lives
      // and dies with this component — but the moment `api` is recreated
      // (a plugin change, a remount) the previous instance keeps a live
      // handler, and the asymmetry reads as an oversight either way.
      api.off('reInit', onSelect)
      api.off('select', onSelect)
    }
  }, [api, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        // Bubble phase, not capture: a capture listener here runs BEFORE the
        // event reaches the focused descendant, so it would take the arrows
        // off an input in a slide no matter what that input wanted. Bubbling
        // lets the control handle (and, where it cares, preventDefault) first.
        //
        // Safe to sit before `{...props}` only because `onKeyDown` is
        // destructured out of props and composed inside handleKeyDown. Do not
        // "simplify" that away — the spread would silently win.
        onKeyDown={handleKeyDown}
        className={cn('relative', className)}
        role='region'
        aria-roledescription='carousel'
        data-slot='carousel'
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className='overflow-hidden' data-slot='carousel-content'>
      <div
        className={cn('flex', orientation === 'horizontal' ? '-ms-4' : '-mt-4 flex-col', className)}
        {...props}
      />
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<'div'>) {
  const { orientation } = useCarousel()

  return (
    <div
      role='group'
      aria-roledescription='slide'
      data-slot='carousel-item'
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'ps-4' : 'pt-4',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Whether a control should render its own default icon — and therefore whether
 * it must supply its own accessible name.
 *
 * ONE test, because the fallback content and the `aria-label` have to agree
 * about what "the consumer supplied content" means, and they once did not:
 * `??` treats null and undefined alike while the label test named only
 * `undefined`, so `children={null}` — what `cond ? <Icon/> : null` yields —
 * rendered the default chevron with NO accessible name, on a control whose
 * only name is that label. Both call sites now derive from here, so they
 * cannot drift apart again.
 *
 * `children={false}` (from `{cond && <Icon/>}`) is deliberately excluded: that
 * consumer asked for no content, and substituting the default icon would be a
 * surprise. The resulting unnamed button is reported by Button's own dev-time
 * icon-only warning.
 */
function usesDefaultContent(children: React.ReactNode): boolean {
  return children === undefined || children === null
}

function CarouselPrevious({
  className,
  variant = 'outline',
  size = 'icon',
  label = 'Previous slide',
  children,
  ...props
}: React.ComponentProps<typeof Button> & {
  /**
   * Screen-reader name for the control. Override to translate it — the
   * control is icon-only, so this string is the only name AT ever hears.
   */
  label?: string
}) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  const usesDefaultIcon = usesDefaultContent(children)

  return (
    <Button
      data-slot='carousel-previous'
      // Named via aria-label rather than an sr-only child. Both give AT the
      // same name, but Button's dev-time icon-only warning only inspects
      // aria-label/aria-labelledby — with the sr-only span it fired on every
      // render of a control that was correctly named all along, which is the
      // fastest way to teach a team to ignore the warning. Set only when we
      // render the default icon: a consumer passing `children` supplies their
      // own content, and an aria-label would mask it.
      aria-label={usesDefaultIcon ? label : undefined}
      variant={variant}
      size={size}
      className={cn(
        'absolute touch-manipulation rounded-full',
        orientation === 'horizontal'
          ? 'inset-y-0 -start-12 my-auto'
          : 'start-1/2 -top-12 -translate-x-1/2 rotate-90 rtl:translate-x-1/2',
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      {usesDefaultIcon ? <IconChevronLeft className='rtl:rotate-180' /> : children}
    </Button>
  )
}

function CarouselNext({
  className,
  variant = 'outline',
  size = 'icon',
  label = 'Next slide',
  children,
  ...props
}: React.ComponentProps<typeof Button> & {
  /**
   * Screen-reader name for the control. Override to translate it — the
   * control is icon-only, so this string is the only name AT ever hears.
   */
  label?: string
}) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  const usesDefaultIcon = usesDefaultContent(children)

  return (
    <Button
      data-slot='carousel-next'
      // Named via aria-label rather than an sr-only child. Both give AT the
      // same name, but Button's dev-time icon-only warning only inspects
      // aria-label/aria-labelledby — with the sr-only span it fired on every
      // render of a control that was correctly named all along, which is the
      // fastest way to teach a team to ignore the warning. Set only when we
      // render the default icon: a consumer passing `children` supplies their
      // own content, and an aria-label would mask it.
      aria-label={usesDefaultIcon ? label : undefined}
      variant={variant}
      size={size}
      className={cn(
        'absolute touch-manipulation rounded-full',
        orientation === 'horizontal'
          ? 'inset-y-0 -end-12 my-auto'
          : 'start-1/2 -bottom-12 -translate-x-1/2 rotate-90 rtl:translate-x-1/2',
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      {usesDefaultIcon ? <IconChevronRight className='rtl:rotate-180' /> : children}
    </Button>
  )
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
  type CarouselApi,
}

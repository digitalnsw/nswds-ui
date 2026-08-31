/**
 * Carousel — Default, Variants, Keyboard, Vertical, RightToLeft, CssCheck
 *
 * A slide carousel built on embla-carousel-react. CarouselContent owns the
 * embla viewport and must wrap the CarouselItems; CarouselPrevious/CarouselNext
 * render real Buttons wired to embla's scroll API.
 *
 * Embla initialises asynchronously, so every assertion about scroll state has
 * to poll rather than read once — `waitFor` below. Asserting only that the
 * controls RENDER (which is all this file used to do) leaves the whole
 * interactive surface untested: the arrow-key mapping, the enabled/disabled
 * transitions, the vertical axis and the RTL mapping were all silently wrong
 * or untested behind a passing suite.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './carousel.js'
import { DirectionProvider } from './direction.js'

/**
 * Poll until `predicate` holds. Embla settles its scroll state over a few
 * frames and its `select` event drives the control's disabled state, so a
 * synchronous read straight after an interaction is a race.
 */
async function waitFor(predicate: () => boolean, message: string, timeout = 2000) {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    if (predicate()) {
      return
    }
    await new Promise((resolve) => requestAnimationFrame(resolve))
  }
  throw new Error(message)
}

/** Dispatch a real keydown from `target` so it bubbles to the carousel region. */
function pressKey(target: Element, key: string) {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
}

/**
 * Index of the slide whose centre currently sits inside the embla viewport.
 *
 * Asserting on the controls' `disabled` state is NOT enough to test direction:
 * that reflects embla's INDEX, which advances identically whether the engine
 * runs ltr or rtl. Only the geometry differs — the engine translates the track
 * one way or the other — so distinguishing a correctly-configured RTL carousel
 * from a mis-configured one means asking which slide you can actually see.
 * Returns -1 when none qualifies.
 */
function visibleSlideIndex(canvasElement: HTMLElement): number {
  const viewport = canvasElement.querySelector<HTMLElement>('[data-slot="carousel-content"]')
  if (!viewport) {
    throw new Error('Could not find the embla viewport.')
  }
  const view = viewport.getBoundingClientRect()
  const slides = [...canvasElement.querySelectorAll<HTMLElement>('[data-slot="carousel-item"]')]
  return slides.findIndex((slide) => {
    const rect = slide.getBoundingClientRect()
    const centreX = rect.left + rect.width / 2
    const centreY = rect.top + rect.height / 2
    return (
      centreX > view.left && centreX < view.right && centreY > view.top && centreY < view.bottom
    )
  })
}

// Annotated (not `satisfies`) so the inferred meta type does not surface
// embla-carousel's internal Options/Plugins modules (TS2742 portability error).
const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A slide carousel built on embla-carousel-react. Wrap CarouselItems in CarouselContent and add CarouselPrevious/CarouselNext for keyboard- and pointer-accessible navigation.',
      },
    },
  },
  render: (args) => (
    <div className='w-64'>
      <Carousel {...args}>
        <CarouselContent>
          {[1, 2, 3].map((n) => (
            <CarouselItem key={n}>
              <div className='flex h-32 items-center justify-center rounded-md bg-muted text-2xl font-semibold text-muted-foreground'>
                {n}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The navigation controls render as real, named buttons.
    const next = canvas.getByRole('button', { name: /next slide/i })
    const previous = canvas.getByRole('button', { name: /previous slide/i })
    await expect(next).toBeInTheDocument()
    await expect(previous).toBeInTheDocument()

    // Three slides mounted inside the embla viewport.
    const slides = canvasElement.querySelectorAll('[data-slot="carousel-item"]')
    await expect(slides).toHaveLength(3)

    // Control state is seeded from embla on mount, not left until the first
    // scroll: at slide one there is nothing behind and something ahead.
    await waitFor(
      () => !next.hasAttribute('disabled') && previous.hasAttribute('disabled'),
      'Expected the initial state to enable Next and disable Previous.',
    )

    // Clicking Next actually advances, and the state follows.
    next.click()
    await waitFor(
      () => !previous.hasAttribute('disabled'),
      'Expected Previous to become enabled after advancing a slide.',
    )

    // …and back again, returning to the seeded state.
    previous.click()
    await waitFor(
      () => previous.hasAttribute('disabled'),
      'Expected Previous to disable again on returning to the first slide.',
    )
  },
}

/**
 * Arrow keys drive the carousel — but ONLY when the key was not meant for a
 * control inside a slide. The handler runs on the region, so without the
 * `ownsArrowKeys` guard it would take ArrowLeft/ArrowRight off every text
 * field in a slide and scroll the carousel instead of moving the caret. Slides
 * carrying form controls are ordinary (a filter row, a step in a form), which
 * is why this is a first-class story rather than an edge case.
 */
export const Keyboard: Story = {
  name: 'Keyboard',
  render: () => (
    <div className='w-64'>
      <Carousel>
        <CarouselContent>
          {[1, 2, 3].map((n) => (
            <CarouselItem key={n}>
              <div className='flex h-32 flex-col items-center justify-center gap-2 rounded-md bg-muted text-muted-foreground'>
                <span className='text-2xl font-semibold'>{n}</span>
                <input
                  aria-label={`Note for slide ${n}`}
                  defaultValue='abc'
                  className='w-24 rounded-sm border border-input bg-background px-1 text-sm text-foreground'
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvasElement.querySelector<HTMLElement>('[data-slot="carousel"]')!
    const previous = canvas.getByRole('button', { name: /previous slide/i })

    await waitFor(() => previous.hasAttribute('disabled'), 'Expected to start on the first slide.')

    // ArrowRight on the region advances (LTR, horizontal).
    pressKey(region, 'ArrowRight')
    await waitFor(
      () => !previous.hasAttribute('disabled'),
      'Expected ArrowRight to advance the carousel.',
    )

    // ArrowLeft goes back.
    pressKey(region, 'ArrowLeft')
    await waitFor(
      () => previous.hasAttribute('disabled'),
      'Expected ArrowLeft to move the carousel back.',
    )

    // The guard: an arrow key from an input inside a slide belongs to the
    // input. The carousel must not move, and must not preventDefault.
    const input = canvasElement.querySelector<HTMLInputElement>('input')!
    input.focus()
    const event = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true,
      cancelable: true,
    })
    input.dispatchEvent(event)
    await expect(event.defaultPrevented).toBe(false)
    // Give embla the frames it would have needed had it (wrongly) scrolled.
    await new Promise((resolve) => setTimeout(resolve, 120))
    await expect(previous.hasAttribute('disabled')).toBe(true)
  },
}

/**
 * A roving-tabindex composite inside a slide keeps its arrows. Focus sits on
 * the `tab`, but the keyboard contract belongs to the `tablist` ABOVE it — so
 * a guard that reads only the focused element's own role misses every
 * composite (tabs, listboxes, menus, radio groups, trees) and scrolls the
 * carousel while the user is moving between tabs.
 */
export const CompositeInSlide: Story = {
  name: 'Composite widget in a slide',
  render: () => (
    <div className='w-72'>
      <Carousel>
        <CarouselContent>
          {[1, 2].map((n) => (
            <CarouselItem key={n}>
              <div className='flex h-32 flex-col justify-center gap-2 rounded-md bg-muted p-3'>
                {/* Deliberately hand-rolled: this is a stand-in for any
                    consumer widget, not a NSWDS component. The roles are what
                    the guard has to read. */}
                <div role='tablist' aria-label={`Slide ${n} views`} className='flex gap-2'>
                  {['List', 'Map'].map((view, index) => (
                    <button
                      key={view}
                      type='button'
                      role='tab'
                      aria-selected={index === 0}
                      tabIndex={index === 0 ? 0 : -1}
                      className='rounded-sm bg-background px-2 py-1 text-sm text-foreground'
                    >
                      {view}
                    </button>
                  ))}
                </div>
                {/* The harder half: a composite whose focused descendant has
                    NO role of its own. `application` is the realistic case —
                    an embedded map or canvas widget that pans with the arrow
                    keys and puts focus on a plain element. Only walking
                    ancestors can find the contract here; matching the focused
                    element's own role cannot. */}
                <div
                  role='application'
                  aria-label={`Slide ${n} map`}
                  className='rounded-sm bg-background p-2'
                >
                  <div
                    tabIndex={0}
                    data-slot='roleless-focus-target'
                    className='text-sm text-foreground'
                  >
                    Pan with arrow keys
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const previous = canvas.getByRole('button', { name: /previous slide/i })
    await waitFor(() => previous.hasAttribute('disabled'), 'Expected to start on the first slide.')

    // The role that consumes arrows is on the ANCESTOR tablist, not on the tab
    // that has focus — the case an own-role-only check cannot see.
    const tab = canvasElement.querySelector<HTMLElement>('[role="tab"]')!
    await expect(tab.getAttribute('role')).toBe('tab')
    await expect(tab.closest('[role="tablist"]')).toBeInTheDocument()

    const press = async (from: HTMLElement) => {
      from.focus()
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        cancelable: true,
      })
      from.dispatchEvent(event)
      // The carousel must neither consume the key nor move.
      await expect(event.defaultPrevented).toBe(false)
      await new Promise((resolve) => setTimeout(resolve, 120))
      await expect(previous.hasAttribute('disabled')).toBe(true)
    }

    await press(tab)

    // The case only the ancestor walk can catch: the focused element carries
    // no role at all, and the contract is on the `application` above it.
    const roleless = canvasElement.querySelector<HTMLElement>(
      '[data-slot="roleless-focus-target"]',
    )!
    await expect(roleless.getAttribute('role')).toBeNull()
    await expect(roleless.closest('[role="application"]')).toBeInTheDocument()
    await press(roleless)
  },
}

/**
 * `opts.direction` is the documented escape hatch for driving the engine
 * independently of the ambient provider — and it has to move the KEYS with it.
 * It is spread into embla's options after the provider value, so it wins there;
 * if the key mapping kept reading the provider, the hatch would leave the
 * engine running RTL while the keyboard ran LTR and the two would disagree on
 * every press.
 */
export const DirectionFromOpts: Story = {
  name: 'Direction from opts',
  render: () => (
    // No DirectionProvider and no `dir` — the provider stays at its ltr
    // default, so `opts` is the only thing saying rtl.
    <div className='w-64'>
      <Carousel opts={{ direction: 'rtl' }}>
        <CarouselContent>
          {[1, 2, 3].map((n) => (
            <CarouselItem key={n}>
              <div className='flex h-32 items-center justify-center rounded-md bg-muted text-2xl font-semibold text-muted-foreground'>
                {n}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvasElement.querySelector<HTMLElement>('[data-slot="carousel"]')!
    const previous = canvas.getByRole('button', { name: /previous slide/i })

    await waitFor(() => previous.hasAttribute('disabled'), 'Expected to start on the first slide.')

    // Keys must follow `opts`, not the (ltr) provider: ArrowLeft is "next".
    pressKey(region, 'ArrowLeft')
    await waitFor(
      () => !previous.hasAttribute('disabled'),
      'Expected ArrowLeft to advance when opts.direction is rtl — the key map is still reading the provider.',
    )

    pressKey(region, 'ArrowRight')
    await waitFor(
      () => previous.hasAttribute('disabled'),
      'Expected ArrowRight to go back when opts.direction is rtl.',
    )
  },
}

/**
 * A carousel inside another carousel's slide must consume the key it acts on,
 * or one press moves both: the outer region's role is `region`, which is not
 * something `ownsArrowKeys` rejects, so without `stopPropagation` the event
 * bubbles straight into the outer handler.
 *
 * Two mechanisms cover this and they overlap on purpose: the inner carousel
 * calls preventDefault (which the outer one now checks) AND stopPropagation.
 * Removing either alone leaves this story passing; removing both fails it. The
 * redundancy is deliberate — defaultPrevented is what makes the open-ended case
 * work (any custom widget in a slide that handles arrows itself), while
 * stopPropagation covers non-React ancestor listeners that never consult it.
 */
export const Nested: Story = {
  name: 'Nested carousels',
  render: () => (
    // Both carousels position their controls OUTSIDE themselves (-start-12 /
    // -end-12), so a nested pair needs real gutters or the two sets overlap:
    // axe fails them under WCAG 2.2 target-size (2.5.8) at 12px of clear
    // space. The generous padding here is what a nested carousel genuinely
    // requires, not a workaround for the test.
    <div className='w-[34rem] px-14 py-6' data-slot='outer-wrap'>
      <Carousel>
        <CarouselContent>
          {[1, 2, 3].map((n) => (
            <CarouselItem key={n}>
              <div className='rounded-md bg-muted px-20 py-4' data-slot={`outer-slide-${n}`}>
                <Carousel>
                  <CarouselContent>
                    {['a', 'b', 'c'].map((letter) => (
                      <CarouselItem key={letter}>
                        <div className='flex h-20 items-center justify-center rounded-sm bg-background text-xl font-semibold text-foreground'>
                          {n}
                          {letter}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious label={`Previous inner slide ${n}`} />
                  <CarouselNext label={`Next inner slide ${n}`} />
                </Carousel>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious label='Previous outer slide' />
        <CarouselNext label='Next outer slide' />
      </Carousel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const outerPrevious = canvas.getByRole('button', { name: 'Previous outer slide' })
    const innerPrevious = canvas.getByRole('button', { name: 'Previous inner slide 1' })

    // Both start at their first slide.
    await waitFor(
      () => outerPrevious.hasAttribute('disabled') && innerPrevious.hasAttribute('disabled'),
      'Expected both carousels to start on their first slide.',
    )

    // Press from INSIDE the inner carousel's region. The inner one should
    // advance; the outer one must not move at all.
    const regions = canvasElement.querySelectorAll<HTMLElement>('[data-slot="carousel"]')
    const innerRegion = regions[1]!
    pressKey(innerRegion, 'ArrowRight')

    await waitFor(
      () => !innerPrevious.hasAttribute('disabled'),
      'Expected the inner carousel to advance.',
    )
    // Give the outer carousel the frames it would have needed had the event
    // reached it, then assert it stayed put.
    await new Promise((resolve) => setTimeout(resolve, 120))
    await expect(outerPrevious.hasAttribute('disabled')).toBe(true)
  },
}

/**
 * A vertical carousel moves on the block axis, so Up/Down drive it and
 * Left/Right must not. Pointer support for `orientation='vertical'` has always
 * been there; the keyboard half was mapped to Left/Right regardless, which
 * left the axis unreachable from the keyboard.
 */
export const Vertical: Story = {
  name: 'Vertical',
  render: () => (
    <div className='h-48 w-64'>
      <Carousel orientation='vertical' className='h-full'>
        <CarouselContent className='h-48'>
          {[1, 2, 3].map((n) => (
            <CarouselItem key={n}>
              <div className='flex h-40 items-center justify-center rounded-md bg-muted text-2xl font-semibold text-muted-foreground'>
                {n}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvasElement.querySelector<HTMLElement>('[data-slot="carousel"]')!
    const previous = canvas.getByRole('button', { name: /previous slide/i })

    await waitFor(() => previous.hasAttribute('disabled'), 'Expected to start on the first slide.')

    // Left/Right belong to the inline axis and must be inert here.
    pressKey(region, 'ArrowRight')
    await new Promise((resolve) => setTimeout(resolve, 120))
    await expect(previous.hasAttribute('disabled')).toBe(true)

    // ArrowDown is this orientation's "next".
    pressKey(region, 'ArrowDown')
    await waitFor(
      () => !previous.hasAttribute('disabled'),
      'Expected ArrowDown to advance a vertical carousel.',
    )

    pressKey(region, 'ArrowUp')
    await waitFor(
      () => previous.hasAttribute('disabled'),
      'Expected ArrowUp to move a vertical carousel back.',
    )
  },
}

/**
 * In RTL the first slide sits on the RIGHT, so ArrowRight goes BACK and
 * ArrowLeft goes forward — the keys have to agree with the logical properties
 * (`-ms-4`, `ps-4`, `-start-12`) the rest of the component already uses.
 *
 * Both halves of RTL are set here: `dir` for the CSS, DirectionProvider for
 * the JS. See direction.stories.tsx for why one without the other is not RTL.
 *
 * Deliberately NO `opts={{ direction: 'rtl' }}` — the component derives embla's
 * direction from the same provider. Passing it here would configure the engine
 * from the story and let a component that wired only the KEYS pass, which is
 * exactly the hole this story existed with before.
 */
export const RightToLeft: Story = {
  name: 'Right to left',
  render: () => (
    <div dir='rtl'>
      <DirectionProvider direction='rtl'>
        <div className='w-64'>
          <Carousel>
            <CarouselContent>
              {[1, 2, 3].map((n) => (
                <CarouselItem key={n}>
                  <div className='flex h-32 items-center justify-center rounded-md bg-muted text-2xl font-semibold text-muted-foreground'>
                    {n}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </DirectionProvider>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvasElement.querySelector<HTMLElement>('[data-slot="carousel"]')!
    const previous = canvas.getByRole('button', { name: /previous slide/i })

    // Guard the premise — a story that quietly laid out LTR would pass the
    // assertions below for the wrong reason.
    await expect(getComputedStyle(region).direction).toBe('rtl')
    await waitFor(() => previous.hasAttribute('disabled'), 'Expected to start on the first slide.')

    // Slide 1 is the one on screen to begin with.
    await waitFor(
      () => visibleSlideIndex(canvasElement) === 0,
      'Expected the first slide to be the visible one at rest.',
    )

    // ArrowLeft is "next" in RTL. Assert the INDEX advances and that the
    // second slide is what you can actually see — the geometry is the half
    // that proves embla itself was configured rtl. With the engine left on
    // ltr while the layout and keys run rtl, the track translates the wrong
    // way and the visible slide does not follow the index.
    pressKey(region, 'ArrowLeft')
    await waitFor(
      () => !previous.hasAttribute('disabled'),
      'Expected ArrowLeft to advance an RTL carousel.',
    )
    await waitFor(
      () => visibleSlideIndex(canvasElement) === 1,
      'Expected the SECOND slide to be visible after advancing an RTL carousel — the index moved but the track did not follow, so embla is not running rtl.',
    )

    // ArrowRight is "previous" in RTL.
    pressKey(region, 'ArrowRight')
    await waitFor(
      () => previous.hasAttribute('disabled'),
      'Expected ArrowRight to move an RTL carousel back.',
    )
    await waitFor(
      () => visibleSlideIndex(canvasElement) === 0,
      'Expected the first slide to be visible again after going back.',
    )
  },
}

/**
 * The controls are icon-only, so their `label` prop is the only accessible
 * name AT ever hears — and the only way a consumer can translate them. It used
 * to be hardcoded English rendered after the props spread, i.e. unreachable.
 *
 * The `null` cases are the regression guard. The fallback and the label test
 * must agree about what "no children" means: `??` treats null and undefined
 * alike, so a label test naming only `undefined` left `children={null}` — what
 * `cond ? <Icon/> : null` yields — rendering the default chevron with no
 * accessible name at all.
 */
export const TranslatedLabels: Story = {
  name: 'Translated labels',
  render: () => (
    <div className='flex w-64 flex-col gap-10'>
      <Carousel>
        <CarouselContent>
          {[1, 2].map((n) => (
            <CarouselItem key={n}>
              <div className='flex h-32 items-center justify-center rounded-md bg-muted text-2xl font-semibold text-muted-foreground'>
                {n}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious label='Diapositiva anterior' />
        <CarouselNext label='Diapositiva siguiente' />
      </Carousel>
      {/* Same labels, but with an explicit `null` child — the shape a
          conditional icon collapses to. */}
      <Carousel>
        <CarouselContent>
          {[1, 2].map((n) => (
            <CarouselItem key={n}>
              <div className='flex h-32 items-center justify-center rounded-md bg-muted text-2xl font-semibold text-muted-foreground'>
                {n}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious label='Anterior con null'>{null}</CarouselPrevious>
        <CarouselNext label='Siguiente con null'>{null}</CarouselNext>
      </Carousel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Diapositiva anterior' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Diapositiva siguiente' })).toBeInTheDocument()

    // `children={null}` still resolves BY ACCESSIBLE NAME, which is the whole
    // point: the control renders the default icon, so it must carry the label.
    // getByRole throws if the name is absent, so this is the assertion.
    await expect(canvas.getByRole('button', { name: 'Anterior con null' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Siguiente con null' })).toBeInTheDocument()

    // And the icon really did render — otherwise the name could be passing on
    // an empty button, which is a different (and also wrong) outcome.
    const nullPrevious = canvas.getByRole('button', { name: 'Anterior con null' })
    await expect(nullPrevious.querySelector('svg')).toBeInTheDocument()
  },
}

export const Variants: Story = {
  render: () => (
    <div className='w-72'>
      <Carousel orientation='horizontal'>
        <CarouselContent>
          {['One', 'Two', 'Three', 'Four'].map((label) => (
            <CarouselItem key={label} className='basis-1/2'>
              <div className='flex h-24 items-center justify-center rounded-md bg-muted text-sm font-medium text-muted-foreground'>
                {label}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    // The slide content carries bg-muted; querying the item's inner element
    // gives us a reliably token-coloured target.
    const slideContent = canvasElement.querySelector<HTMLElement>(
      '[data-slot="carousel-item"] > div',
    )
    if (!slideContent) {
      throw new Error('Could not find the slide content inside [data-slot="carousel-item"].')
    }

    // Proves globals.css loaded: bg-muted resolves to a real colour rather
    // than staying transparent.
    const background = getComputedStyle(slideContent).backgroundColor
    if (background === '' || background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
      throw new Error(`Expected bg-muted to resolve, received "${background}".`)
    }
  },
}

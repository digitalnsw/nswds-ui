/**
 * Carousel — the story set for docs/reference-storybook-standard.md.
 *
 *   Components/Carousel                → this file: Docs, Default, Playground
 *   Components/Carousel/Features       → carousel.features.stories.tsx
 *   Components/Carousel/Accessibility  → carousel.accessibility.stories.tsx
 *   Components/Carousel/Tests          → carousel.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 *
 * A slide carousel built on embla-carousel-react. CarouselContent owns the
 * embla viewport and must wrap the CarouselItems; CarouselPrevious and
 * CarouselNext render real Buttons wired to embla's scroll API. The controls
 * sit OUTSIDE the carousel (`-start-12` / `-end-12`), so every example leaves
 * a gutter for them.
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
import { DocsApi, DocsPage, DocsUsage, Example, ExampleSection } from './story-helpers.js'

const services = [
  'Renew a driver licence',
  'Book a vehicle inspection',
  'Apply for a fishing licence',
  'Register a birth',
]

function Slide({ children, tall }: { children: string; tall?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center rounded-md bg-foreground/5 p-4 text-center text-lg font-semibold ring-1 ring-foreground/10 ring-inset ${tall ? 'h-40' : 'h-32'}`}
    >
      {children}
    </div>
  )
}

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

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

export function SlidesPerViewSection() {
  return (
    <ExampleSection
      title='Slides per view'
      description={
        <>
          Each <code>CarouselItem</code> is a full slide wide by default. Give it a{' '}
          <code>basis-*</code> class to show more than one at a time — <code>basis-1/2</code> for
          two, <code>basis-1/3</code> for three. Next and Previous move one slide at a time.
        </>
      }
    >
      <Example code={`<CarouselItem className="basis-1/2">…</CarouselItem>`}>
        <div className='w-full max-w-lg px-12'>
          <Carousel>
            <CarouselContent>
              {services.map((service) => (
                <CarouselItem key={service} className='basis-1/2'>
                  <Slide>{service}</Slide>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </Example>
    </ExampleSection>
  )
}

export function VerticalSection() {
  return (
    <ExampleSection
      title='Vertical'
      description={
        <>
          <code>orientation=&quot;vertical&quot;</code> moves on the block axis: the controls sit
          above and below, and Up and Down are the arrow keys that drive it. Give the content a
          fixed height.
        </>
      }
    >
      <Example
        code={`<Carousel orientation="vertical">
  <CarouselContent className="h-48">…</CarouselContent>
</Carousel>`}
      >
        <div className='w-64 py-12'>
          <Carousel orientation='vertical'>
            <CarouselContent className='h-48'>
              {services.slice(0, 3).map((service) => (
                <CarouselItem key={service}>
                  <Slide tall>{service}</Slide>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </Example>
    </ExampleSection>
  )
}

export function RightToLeftSection() {
  return (
    <ExampleSection
      title='Right to left'
      description={
        <>
          In a right-to-left page the first slide sits on the right and the arrows swap meaning. RTL
          needs both halves: <code>dir=&quot;rtl&quot;</code> on an ancestor for the layout, and{' '}
          <code>DirectionProvider</code> for the keyboard and the scroll engine.
        </>
      }
    >
      <Example
        code={`<html dir="rtl">
  <DirectionProvider direction="rtl">
    <Carousel>…</Carousel>
  </DirectionProvider>
</html>`}
      >
        <div dir='rtl' className='w-full max-w-sm px-12'>
          <DirectionProvider direction='rtl'>
            <Carousel>
              <CarouselContent>
                {services.slice(0, 3).map((service) => (
                  <CarouselItem key={service}>
                    <Slide>{service}</Slide>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </DirectionProvider>
        </div>
      </Example>
    </ExampleSection>
  )
}

export function ControlLabelsSection() {
  return (
    <ExampleSection
      title='Control labels'
      description={
        <>
          Previous and Next are icon-only buttons, so their accessible names — “Previous slide” and
          “Next slide” — are the only thing a screen reader hears. Pass <code>label</code> to
          translate them, or to say what the slides are. Pass your own <code>children</code> and the
          control is named by them instead.
        </>
      }
    >
      <Example
        code={`<CarouselPrevious label="Previous service" />
<CarouselNext label="Next service" />`}
      >
        <div className='w-full max-w-lg px-12'>
          <Carousel>
            <CarouselContent>
              {services.map((service) => (
                <CarouselItem key={service}>
                  <Slide>{service}</Slide>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious label='Previous service' />
            <CarouselNext label='Next service' />
          </Carousel>
        </div>
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Popular services on a landing page, three to a view on wide screens. Every slide is also reachable without the carousel — the full list is one link away.'
    >
      <Example
        layout='fill'
        code={`<Carousel>
  <CarouselContent>
    <CarouselItem className="basis-full sm:basis-1/3">…</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`}
      >
        <div className='max-w-3xl space-y-4 px-12'>
          <p className='text-2xl font-bold'>Popular services</p>
          <Carousel>
            <CarouselContent>
              {[...services, 'Pay a fine', 'Find a Service NSW centre'].map((service) => (
                <CarouselItem key={service} className='basis-full sm:basis-1/3'>
                  <Slide>{service}</Slide>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function CarouselDocs() {
  return (
    <DocsPage
      title='Carousel'
      npm={['Carousel', 'CarouselContent', 'CarouselItem', 'CarouselPrevious', 'CarouselNext']}
      registry='carousel'
      summary={
        <>
          A row of slides moved with Previous and Next buttons, the arrow keys, or a swipe. Wrap the{' '}
          <strong>CarouselItem</strong>s in <strong>CarouselContent</strong>, and add the two
          controls. Slides that scroll out of view are easy to miss, so keep anything important out
          of a carousel.
        </>
      }
    >
      <DocsUsage
        use={[
          'A short, optional set of related items, such as featured services.',
          'Browsing photos or cards where the order does not matter.',
          'Saving space on a narrow screen for content most people skim.',
        ]}
        avoid={[
          'Content everyone must see — lay it out on the page, or in a grid of LinkCards.',
          'Steps in a process — use StepIndicator.',
          'Switching between parallel views of one thing — use Tabs.',
        ]}
      />
      <SlidesPerViewSection />
      <VerticalSection />
      <RightToLeftSection />
      <ControlLabelsSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

// Annotated (not `satisfies`) so the inferred meta type does not surface
// embla-carousel's internal Options/Plugins modules (TS2742 portability error).
const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: CarouselDocs },
  },
  args: {
    orientation: 'horizontal',
    className: 'mx-14 max-w-xs',
    children: [
      <CarouselContent key='content'>
        {services.slice(0, 3).map((service) => (
          <CarouselItem key={service}>
            <Slide>{service}</Slide>
          </CarouselItem>
        ))}
      </CarouselContent>,
      <CarouselPrevious key='previous' />,
      <CarouselNext key='next' />,
    ],
  },
  argTypes: {
    children: {
      control: false,
      description: 'A CarouselContent of CarouselItems, then CarouselPrevious and CarouselNext.',
      table: { category: 'Content' },
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Axis the slides move along; sets the arrow keys to match.',
      table: { category: 'Appearance' },
    },
    opts: {
      control: 'object',
      description: 'Embla options, e.g. `{ loop: true }` or `{ direction: "rtl" }`.',
      table: { category: 'Behavior' },
    },
    plugins: {
      control: false,
      description: 'Embla plugins, such as autoplay.',
      table: { category: 'Behavior' },
    },
    setApi: {
      control: false,
      description: 'Receives the embla API, to drive the carousel from outside.',
      table: { category: 'Behavior' },
    },
    className: { table: { disable: true } },
  },
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

export const Playground: Story = {}

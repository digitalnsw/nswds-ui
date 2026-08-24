/**
 * Carousel — Default, Variants, CssCheck
 *
 * A slide carousel built on embla-carousel-react. CarouselContent owns the
 * embla viewport and must wrap the CarouselItems; CarouselPrevious/CarouselNext
 * render real Buttons wired to embla's scroll API. Embla initialises
 * asynchronously, so interactions here stay minimal — asserting the controls
 * render is enough to prove the composition mounts.
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
    await expect(next).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: /previous slide/i })).toBeInTheDocument()

    // Three slides mounted inside the embla viewport.
    const slides = canvasElement.querySelectorAll('[data-slot="carousel-item"]')
    await expect(slides).toHaveLength(3)
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

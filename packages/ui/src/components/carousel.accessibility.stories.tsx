/**
 * Carousel — Accessibility
 *
 * One story per WCAG 2.2 criterion a carousel has to meet, each asserting it
 * in play(). The component follows the WAI-ARIA carousel pattern: a region
 * described as a carousel, each slide a group described as a slide, and named
 * Previous / Next buttons that disable at the ends. The arrow-key handling and
 * its edge cases are covered in depth in carousel.tests.stories.tsx.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './carousel.js'
import { wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/Carousel/Accessibility',
  component: Carousel,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Carousel>

export default meta

type Story = StoryObj<typeof meta>

const services = ['Renew a driver licence', 'Book a vehicle inspection', 'Register a birth']

function PopularServices() {
  return (
    <div className='w-full max-w-lg px-12'>
      <Carousel aria-label='Popular services'>
        <CarouselContent>
          {services.map((service) => (
            <CarouselItem key={service}>
              <div className='flex h-32 items-center justify-center rounded-md bg-foreground/5 p-4 text-lg font-semibold'>
                {service}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

const controls = (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement)
  return {
    previous: canvas.getByRole('button', { name: 'Previous slide' }),
    next: canvas.getByRole('button', { name: 'Next slide' }),
  }
}

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'A screen reader user needs to know they are in a carousel, how its slides are grouped, and which controls move it — and that Previous is unavailable on the first slide.',
          how: 'The play() asserts the named region described as a carousel, three groups described as slides, the two named controls, and that Previous starts disabled and Next enabled.',
          caveat:
            'The region takes its name from you: pass aria-label (or aria-labelledby a heading) to Carousel, as here, or it is announced only as “carousel”.',
        }),
      },
    },
  },
  render: () => <PopularServices />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: 'Popular services' })
    await expect(region).toHaveAttribute('aria-roledescription', 'carousel')

    const slides = within(region).getAllByRole('group')
    await expect(slides).toHaveLength(services.length)
    for (const slide of slides) await expect(slide).toHaveAttribute('aria-roledescription', 'slide')

    const { previous, next } = controls(canvasElement)
    await waitFor(() => expect(previous).toBeDisabled())
    await expect(next).toBeEnabled()
  },
}

// ─── 2.1.1 — Keyboard ─────────────────────────────────────────────────────────

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    wcag: ['2.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'Every slide a pointer can reach must be reachable from the keyboard, through the same controls.',
          how: 'Tab to Next — Previous is disabled on the first slide, so it is skipped — and press Enter: the carousel advances and Previous becomes available. Shift+Tab to Previous and press Space to go back. The play() asserts each step.',
          caveat:
            'The arrow keys also move the carousel while focus is inside it; carousel.tests.stories.tsx covers them, including right-to-left and nested carousels.',
        }),
      },
    },
  },
  render: () => <PopularServices />,
  play: async ({ canvasElement }) => {
    const { previous, next } = controls(canvasElement)
    await waitFor(() => expect(previous).toBeDisabled())

    await userEvent.tab()
    await expect(next).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(previous).toBeEnabled())

    await userEvent.tab({ shift: true })
    await expect(previous).toHaveFocus()
    await userEvent.keyboard(' ')
    await waitFor(() => expect(previous).toBeDisabled())
  },
}

// ─── 2.4.7 — Focus Visible ────────────────────────────────────────────────────

export const FocusVisible: Story = {
  name: 'Focus Visible — 2.4.7',
  parameters: {
    wcag: ['2.4.7'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.4.7',
          why: 'The controls sit at the carousel’s edges, away from the slides. A keyboard user has to see which one Enter will press.',
          how: 'Tab to Next. The play() asserts a solid outline at least 2px wide that the button does not draw at rest.',
          caveat:
            'The controls are Buttons, so they carry Button’s focus ring; restyling them with className keeps it unless the outline is overridden.',
        }),
      },
    },
  },
  render: () => <PopularServices />,
  play: async ({ canvasElement }) => {
    const { previous, next } = controls(canvasElement)
    await waitFor(() => expect(previous).toBeDisabled())
    await expect(getComputedStyle(next).outlineStyle).toBe('none')
    await userEvent.tab()
    await expect(next).toHaveFocus()
    const style = getComputedStyle(next)
    await expect(style.outlineStyle).toBe('solid')
    await expect(parseFloat(style.outlineWidth)).toBeGreaterThanOrEqual(2)
  },
}

// ─── 2.5.8 — Target Size (Minimum) ────────────────────────────────────────────

export const TargetSizeMinimum: Story = {
  name: 'Target Size (Minimum) — 2.5.8',
  parameters: {
    wcag: ['2.5.8'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.5.8',
          why: 'Previous and Next are the only way to move the carousel with a pointer that cannot swipe, so they have to be easy to hit: at least 24 by 24 CSS pixels.',
          how: 'The play() measures both controls’ rendered boxes and asserts each is at least 24px in both directions.',
          caveat:
            'They render at Button’s 40px icon size by default. A smaller size passed through className would need re-checking.',
        }),
      },
    },
  },
  render: () => <PopularServices />,
  play: async ({ canvasElement }) => {
    for (const control of Object.values(controls(canvasElement))) {
      const { width, height } = control.getBoundingClientRect()
      await expect(width).toBeGreaterThanOrEqual(24)
      await expect(height).toBeGreaterThanOrEqual(24)
    }
  },
}

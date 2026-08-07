/**
 * Skeleton — Default + Shapes + CssCheck
 *
 * Pulsing `bg-muted` loading placeholder. Purely presentational; shape it
 * with utility classes.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Skeleton } from './skeleton.js'

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      page: () => (
        <div className='max-w-3xl space-y-8 p-6 text-foreground'>
          <section className='space-y-3'>
            <h1 className='text-4xl font-bold tracking-normal'>Skeleton</h1>
            <p className='text-base text-muted-foreground'>
              A loading placeholder block. Size and shape it with utility classes; announce the
              loading state on the region being populated (<code>aria-busy</code> or a live region),
              not on individual skeleton blocks.
            </p>
          </section>
          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Shapes</h2>
            <div className='flex items-center gap-4'>
              <Skeleton className='size-12 rounded-pill' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-56' />
                <Skeleton className='h-4 w-40' />
              </div>
            </div>
          </section>
        </div>
      ),
      description: {
        component:
          'Pulsing bg-muted loading placeholder. Decorative — carries no role or text; convey the loading state on the surrounding region.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Utility classes that give the block its size and shape.',
      table: { category: 'Appearance' },
    },
    children: {
      table: { disable: true, category: 'Content' },
    },
  },
} satisfies Meta<typeof Skeleton>

export default meta

type Story = StoryObj<typeof meta>

function getSkeleton(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="skeleton"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="skeleton"].')
  }
  return el
}

export const Default: Story = {
  args: {
    className: 'h-4 w-64',
  },
  play: async ({ canvasElement }) => {
    const skeleton = getSkeleton(canvasElement)

    // Decorative: no role, no accessible text.
    if (skeleton.getAttribute('role')) {
      throw new Error(
        `Expected the skeleton to carry no ARIA role, got "${skeleton.getAttribute('role')}".`,
      )
    }
    if (skeleton.textContent !== '') {
      throw new Error('Expected the skeleton to render no text content.')
    }

    // The pulse animation is applied.
    const animationName = getComputedStyle(skeleton).animationName
    if (animationName === 'none' || animationName === '') {
      throw new Error(
        `Expected animate-pulse to resolve to a keyframe animation, got "${animationName}".`,
      )
    }
  },
}

export const Shapes: Story = {
  name: 'Shapes',
  render: () => (
    <div className='flex w-80 items-center gap-4'>
      <Skeleton className='size-12 shrink-0 rounded-pill' />
      <div className='w-full space-y-2'>
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-4 w-1/2' />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const skeletons = canvasElement.querySelectorAll('[data-slot="skeleton"]')
    if (skeletons.length !== 3) {
      throw new Error(`Expected 3 skeleton blocks, found ${skeletons.length}.`)
    }
  },
}

export const CssCheck: Story = {
  name: 'CSS Check',
  args: {
    className: 'h-4 w-64',
  },
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: bg-muted resolves to a real,
    // non-transparent colour.
    const skeleton = getSkeleton(canvasElement)
    const bg = getComputedStyle(skeleton).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected bg-muted to resolve to a visible colour, got "${bg}". Is globals.css loaded?`,
      )
    }
  },
}

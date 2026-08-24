/**
 * Direction — Default, Variants, CssCheck
 *
 * DirectionProvider sets the LTR/RTL text-direction context that direction-aware
 * Base UI components and logical CSS properties read. useDirection returns the
 * nearest provider's direction. This is a re-export of the Base UI primitive; we
 * add no styling of our own.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { DirectionProvider, useDirection } from './direction.js'

/** Reads the ambient direction and writes it into the DOM so a play() can assert it. */
function DirReadout() {
  const direction = useDirection()
  return <span data-slot='dir-readout'>{direction}</span>
}

/** Renders the ambient direction as a labelled swatch, for the Variants gallery. */
function DirectionSample({ hint }: { hint: string }) {
  const direction = useDirection()
  return (
    <div className='flex items-center gap-2 border p-2'>
      <span data-slot='dir-readout' className='text-xs font-medium text-foreground uppercase'>
        {direction}
      </span>
      <span className='text-xs text-muted-foreground'>{hint}</span>
    </div>
  )
}

const meta = {
  title: 'Components/Direction',
  component: DirectionProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'DirectionProvider supplies the LTR/RTL text-direction context consumed by direction-aware components and logical properties. Read the current value with the useDirection hook.',
      },
    },
  },
  render: (args) => (
    <DirectionProvider {...args}>
      <DirReadout />
    </DirectionProvider>
  ),
  args: {
    direction: 'rtl',
  },
} satisfies Meta<typeof DirectionProvider>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // useDirection must surface the value set on the surrounding provider.
    const readout = canvasElement.querySelector('[data-slot="dir-readout"]')
    await expect(readout).toBeInTheDocument()
    await expect(readout).toHaveTextContent('rtl')
  },
}

export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <div className='flex flex-col gap-6'>
      <DirectionProvider direction='ltr'>
        <DirectionSample hint='start ▸ end (LTR)' />
      </DirectionProvider>
      <DirectionProvider direction='rtl'>
        <DirectionSample hint='start ◂ end (RTL)' />
      </DirectionProvider>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  render: () => (
    <DirectionProvider direction='ltr'>
      <div className='size-8 bg-primary' data-slot='dir-swatch' />
    </DirectionProvider>
  ),
  play: async ({ canvasElement }) => {
    // Proves globals.css loaded: the swatch's bg-primary resolves to a real
    // colour rather than staying transparent.
    const swatch = canvasElement.querySelector<HTMLElement>('[data-slot="dir-swatch"]')
    if (!swatch) {
      throw new Error('Could not find [data-slot="dir-swatch"].')
    }
    const background = getComputedStyle(swatch).backgroundColor
    if (background === '' || background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
      throw new Error(`Expected bg-primary to resolve, received "${background}".`)
    }
  },
}

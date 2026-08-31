/**
 * Direction — Default, Variants, CssCheck
 *
 * DirectionProvider supplies the LTR/RTL direction as REACT CONTEXT, read by
 * direction-aware components via useDirection. It renders no DOM element of its
 * own, so it does NOT set `dir` and it does NOT drive CSS: logical properties
 * (`ps-*`, `-ms-*`, `start-*`) and the `rtl:` variant follow the DOM `dir`
 * attribute, which is a separate thing entirely.
 *
 * RTL therefore needs BOTH halves — see the RtlNeedsDirAttribute story:
 *
 *     <html dir='rtl'>                        ← the CSS half
 *       <DirectionProvider direction='rtl'>   ← the JS half
 *
 * Setting only the provider gives you direction-aware JS behaviour on top of an
 * LTR layout; setting only `dir` gives you a mirrored layout whose keyboard
 * handling still moves the other way. This is a re-export of the Base UI
 * primitive; we add no styling of our own.
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
          'DirectionProvider supplies the LTR/RTL direction as React context, read via the useDirection hook. It renders no DOM element, so it does not set `dir` and does not affect CSS — logical properties and the `rtl:` variant follow the DOM `dir` attribute. Full RTL needs both: `dir="rtl"` on an ancestor element for the CSS, and this provider for direction-aware JS.',
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

/**
 * The provider alone does NOT mirror CSS — `dir` on a DOM ancestor does. This
 * story asserts both halves independently so the documented split cannot drift
 * back into the old (wrong) claim that the provider drives logical properties.
 */
export const RtlNeedsDirAttribute: Story = {
  name: 'RTL needs dir as well',
  render: () => (
    <div className='flex flex-col gap-6'>
      {/* Provider only — JS sees rtl, the box still has LTR padding. */}
      <DirectionProvider direction='rtl'>
        <div data-slot='dir-provider-only' className='bg-muted ps-8'>
          <DirReadout />
        </div>
      </DirectionProvider>

      {/* Both halves — this is what a consumer actually wants. */}
      <div dir='rtl'>
        <DirectionProvider direction='rtl'>
          <div data-slot='dir-both' className='bg-muted ps-8'>
            <DirReadout />
          </div>
        </DirectionProvider>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const providerOnly = canvasElement.querySelector<HTMLElement>('[data-slot="dir-provider-only"]')
    const both = canvasElement.querySelector<HTMLElement>('[data-slot="dir-both"]')
    if (!providerOnly || !both) {
      throw new Error('Could not find the direction sample elements.')
    }

    // Both report rtl to JS — the context reaches useDirection either way.
    await expect(providerOnly.querySelector('[data-slot="dir-readout"]')).toHaveTextContent('rtl')
    await expect(both.querySelector('[data-slot="dir-readout"]')).toHaveTextContent('rtl')

    // But only the one with `dir` mirrors the CSS. `ps-8` is padding-inline-
    // start: it resolves to padding-LEFT without `dir`, padding-RIGHT with it.
    const withoutDir = getComputedStyle(providerOnly)
    const withDir = getComputedStyle(both)
    await expect(withoutDir.direction).toBe('ltr')
    await expect(withDir.direction).toBe('rtl')
    await expect(parseFloat(withoutDir.paddingLeft)).toBeGreaterThan(0)
    await expect(parseFloat(withoutDir.paddingRight)).toBe(0)
    await expect(parseFloat(withDir.paddingRight)).toBeGreaterThan(0)
    await expect(parseFloat(withDir.paddingLeft)).toBe(0)
  },
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

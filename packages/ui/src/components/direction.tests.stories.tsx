/**
 * DirectionProvider — Tests
 *
 * The provider/`dir` split asserted half by half, and a CSS check.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { DirectionProvider, useDirection } from './direction.js'

/** Reads the ambient direction and writes it into the DOM so a play() can assert it. */
function DirReadout() {
  const direction = useDirection()
  return <span data-slot='dir-readout'>{direction}</span>
}

const meta = {
  title: 'Components/DirectionProvider/Tests',
  component: DirectionProvider,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    direction: 'rtl',
  },
} satisfies Meta<typeof DirectionProvider>

export default meta

type Story = StoryObj<typeof meta>

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
  name: 'CSS check',
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

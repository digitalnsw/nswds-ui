import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { IconCheck } from '../icons/check.js'
import { Badge } from './badge.js'
import { Button } from './button.js'
import { ThemeSurface } from './story-helpers.js'

const colors = [
  'primary',
  'grey',
  'secondary',
  'white',
  'tertiary',
  'accent',
  'danger',
  'success',
  'warning',
] as const
const variants = ['solid', 'soft', 'surface', 'outline'] as const
const meta = {
  title: 'Components/Badge/Tests',
  tags: ['!dev', '!autodocs'],
  component: Badge,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Badge>
export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div className='space-y-4'>
      {colors.map((color) => (
        <ThemeSurface key={color} color={color}>
          <div className='flex flex-wrap gap-3'>
            {variants.map((variant) => (
              <Badge key={variant} color={color} variant={variant}>
                {color} {variant}
              </Badge>
            ))}
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
}

export const StatusAndCounts: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-3'>
      <Badge dot color='success'>
        Approved
      </Badge>
      <Badge dot color='warning'>
        Pending
      </Badge>
      <Badge dot color='grey'>
        Draft
      </Badge>
      <Badge dot>New</Badge>
      <Badge color='grey'>3</Badge>
      <Badge>99+</Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const badges = canvasElement.querySelectorAll<HTMLElement>('[data-slot=badge]')
    await expect(badges).toHaveLength(6)
    for (const badge of badges) {
      await expect(badge.tabIndex).toBe(-1)
      await expect(badge).not.toHaveAttribute('role')
    }
    for (const dot of canvasElement.querySelectorAll('[data-slot=badge-dot]'))
      await expect(dot).toHaveAttribute('aria-hidden', 'true')
  },
}

export const Sizes: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-4'>
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <Badge key={size} size={size} dot color='success'>
          Approved
        </Badge>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    // No size may render text below the 16px floor or tighter than 1.5 line spacing.
    for (const badge of canvasElement.querySelectorAll('[data-slot=badge]')) {
      const { fontSize, lineHeight } = getComputedStyle(badge)
      await expect(parseFloat(fontSize)).toBeGreaterThanOrEqual(16)
      await expect(parseFloat(lineHeight)).toBeGreaterThanOrEqual(1.5 * parseFloat(fontSize))
    }
  },
}

export const CssCheck: Story = {
  render: () => (
    <div className='group flex flex-wrap items-center gap-3'>
      <Badge dot color='success'>
        Approved
      </Badge>
      <Badge variant='solid'>3</Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const badge = canvasElement.querySelector<HTMLElement>('[data-slot=badge]')!
    const before = getComputedStyle(badge)
    const background = before.backgroundColor
    await expect(parseFloat(before.borderRadius)).toBeGreaterThanOrEqual(badge.offsetHeight / 2)
    await expect(before.boxShadow).toBe('none')
    await expect(background).not.toBe('rgba(0, 0, 0, 0)')
    await expect(getComputedStyle(badge, '::before').content).toBe('none')
    await expect(getComputedStyle(badge, '::after').content).toBe('none')

    // Brand typeface, theme-wide. theme.css once redeclared --font-sans and
    // --font-mono as var() of themselves, which voids both: body text fell
    // through to preflight's system-font fallback and font-mono utilities
    // rendered sans, with every other check still green. Assert the stacks
    // preset.css defines actually resolve, and that body text (and the badge
    // inheriting it) uses the sans one. verify-dist.mjs guards the compiled
    // stylesheet the same way, so this is not the only line of defence.
    const root = getComputedStyle(document.documentElement)
    await expect(root.getPropertyValue('--font-sans').trim()).toMatch(/^["']?Public Sans["']?,/)
    await expect(root.getPropertyValue('--font-mono').trim()).toMatch(/^["']?JetBrains Mono["']?,/)
    await expect(getComputedStyle(document.body).fontFamily).toMatch(/^["']?Public Sans["']?,/)
    await expect(before.fontFamily).toMatch(/^["']?Public Sans["']?,/)
  },
}

export const Dark: Story = { ...Variants, globals: { theme: 'dark' } }

/** The retained light colour must stay readable on the normal page surface. */
export const LightColour: Story = {
  globals: { theme: 'light' },
  render: () => (
    <div className='flex flex-wrap gap-3 bg-background'>
      <Badge color='light'>Default appearance</Badge>
      {variants.map((variant) => (
        <Badge key={variant} color='light' variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Let Chromium resolve OKLCH and composite translucent fills onto the page.
    const context = document.createElement('canvas').getContext('2d')!
    const luminance = () => {
      const channels = [...context.getImageData(0, 0, 1, 1).data].slice(0, 3).map((value) => {
        const channel = value / 255
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
      })
      return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722
    }
    const surface = canvasElement.firstElementChild!
    for (const badge of surface.querySelectorAll('[data-slot=badge]')) {
      const style = getComputedStyle(badge)
      context.fillStyle = getComputedStyle(surface).backgroundColor
      context.fillRect(0, 0, 1, 1)
      context.fillStyle = style.backgroundColor
      context.fillRect(0, 0, 1, 1)
      const background = luminance()
      context.fillStyle = style.color
      context.fillRect(0, 0, 1, 1)
      const foreground = luminance()
      const contrast =
        (Math.max(background, foreground) + 0.05) / (Math.min(background, foreground) + 0.05)
      await expect(contrast).toBeGreaterThanOrEqual(4.5)
    }
  },
}
export const LightColourDark: Story = { ...LightColour, globals: { theme: 'dark' } }

/** Colours remain shared with Button, while badge surfaces are deliberately flat. */
export const ColourParity: Story = {
  render: () => (
    <div className='space-y-4'>
      {colors.map((color) => (
        <ThemeSurface key={color} color={color}>
          {variants.map((variant) => (
            <div key={variant} data-pair className='mb-3 flex items-center gap-4'>
              <Button color={color} variant={variant}>
                {color}
              </Button>
              <Badge color={color} variant={variant}>
                {color}
              </Badge>
            </div>
          ))}
        </ThemeSurface>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const pair of canvasElement.querySelectorAll('[data-pair]')) {
      const button = getComputedStyle(pair.querySelector('button')!)
      const badge = getComputedStyle(pair.querySelector('[data-slot=badge]')!)
      for (const token of ['--btn-bg', '--btn-fill', '--btn-text']) {
        await expect(badge.getPropertyValue(token).trim()).not.toBe('')
        await expect(badge.getPropertyValue(token)).toBe(button.getPropertyValue(token))
      }
      await expect(badge.color).toBe(button.color)
    }
  },
}
export const ColourParityDark: Story = { ...ColourParity, globals: { theme: 'dark' } }

export const WithIcon: Story = {
  render: () => (
    <Badge color='success'>
      <IconCheck aria-hidden /> Approved
    </Badge>
  ),
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('svg')!
    await expect(icon.getBoundingClientRect().width).toBe(16)
    await expect(icon.getBoundingClientRect().height).toBe(16)
  },
}

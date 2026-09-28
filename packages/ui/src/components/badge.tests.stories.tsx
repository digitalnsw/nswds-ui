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
  },
}

export const Dark: Story = { ...Variants, globals: { theme: 'dark' } }

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

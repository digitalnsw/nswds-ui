/**
 * Separator — Tests
 *
 * The axis sizing rules: `data-orientation="horizontal"` draws `h-px w-full`,
 * `data-orientation="vertical"` draws `w-px self-stretch`. Both have broken
 * silently before — the previous `data-horizontal:` / `data-vertical:`
 * selectors never matched, and the rule rendered with no axis sizing at all.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Separator } from './separator.js'

const meta = {
  title: 'Components/Separator/Tests',
  component: Separator,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Separator>

export default meta

type Story = StoryObj<typeof meta>

export const AxisSizing: Story = {
  name: 'Axis sizing',
  render: () => (
    <div className='space-y-8'>
      <div className='w-80 space-y-3'>
        <p>Personal details</p>
        <Separator data-testid='horizontal' />
        <p>Contact details</p>
      </div>
      <div className='flex h-12 items-stretch gap-3'>
        <span className='flex items-center'>Licences</span>
        <Separator orientation='vertical' data-testid='vertical' />
        <span className='flex items-center'>Permits</span>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const horizontal = canvasElement.querySelector<HTMLElement>('[data-testid="horizontal"]')!
    const vertical = canvasElement.querySelector<HTMLElement>('[data-testid="vertical"]')!

    // Horizontal: one pixel tall, the full width of its 320px container.
    const h = horizontal.getBoundingClientRect()
    await expect(h.height).toBe(1)
    await expect(h.width).toBe(320)

    // Vertical: one pixel wide, stretched to the 48px row.
    const v = vertical.getBoundingClientRect()
    await expect(v.width).toBe(1)
    await expect(v.height).toBe(48)

    // The rule paints the border token, not nothing.
    const background = getComputedStyle(horizontal).backgroundColor
    await expect(background).not.toBe('rgba(0, 0, 0, 0)')
  },
}

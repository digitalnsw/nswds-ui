/**
 * Skeleton — Tests
 *
 * Stories that prove something rather than show it. They stay out of the
 * sidebar (`!dev`) but run in the Vitest suite.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Skeleton } from './skeleton.js'

const meta = {
  title: 'Components/Skeleton/Tests',
  component: Skeleton,
  tags: ['!dev', '!autodocs'],
  parameters: { layout: 'padded' },
  render: (args) => (
    <div aria-busy='true' className='flex items-center gap-4'>
      <span className='sr-only'>Loading profile</span>
      <Skeleton {...args} className='size-12 rounded-full' />
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-4 w-64' />
        <Skeleton className='h-4 w-48' />
      </div>
    </div>
  ),
} satisfies Meta<typeof Skeleton>

export default meta

type Story = StoryObj<typeof meta>

/** The profile placeholder the main file's Default used to render: three blocks. */
export const Profile: Story = {
  name: 'Profile placeholder',
  play: async ({ canvasElement }) => {
    const blocks = canvasElement.querySelectorAll('[data-slot="skeleton"]')
    await expect(blocks).toHaveLength(3)
  },
}

/** The three approved looks: filled (default), square band, and outlined rule. */
export const Looks: Story = {
  name: 'Looks',
  render: () => (
    <div aria-busy='true' className='grid w-80 max-w-full gap-6'>
      <span className='sr-only'>Loading</span>
      {(['default', 'band', 'rule'] as const).map((look) => (
        <div key={look} data-look={look} className='grid gap-2'>
          <Skeleton variant={look} className='aspect-video w-full' />
          <Skeleton variant={look} className='h-4 w-3/4' />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const first = (look: string) =>
      canvasElement.querySelector<HTMLElement>(`[data-look="${look}"] [data-slot="skeleton"]`)!
    await expect(first('band')).toHaveAttribute('data-variant', 'band')
    await expect(getComputedStyle(first('band')).borderRadius).toBe('0px')
    await expect(getComputedStyle(first('rule')).borderTopWidth).toBe('1px')
    await expect(getComputedStyle(first('rule')).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    await expect(getComputedStyle(first('default')).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
  },
}

export const CssCheck: Story = {
  name: 'CSS check',
  play: async ({ canvasElement }) => {
    // Proves globals.css loaded: the foreground ink tint resolves to a visible fill.
    const block = canvasElement.querySelector<HTMLElement>('[data-slot="skeleton"]')
    if (!block) throw new Error('Skeleton not found.')
    await expect(getComputedStyle(block).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    // The pulse runs unless the user asked for reduced motion (the suite's
    // browser does not), and it is the only animation on the block.
    await expect(getComputedStyle(block).animationName).toBe('pulse')
  },
}

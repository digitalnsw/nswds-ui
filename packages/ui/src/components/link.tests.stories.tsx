/**
 * Link — Tests
 *
 * The variant × state matrix, kept for visual regression review: every
 * variant (`primary`, `secondary`, `white`) against default, hover, focus and
 * active, each forced at rest with the same `--link-halo` / `--link-color`
 * utilities the real pseudo-class rules apply. `secondary` and `white` sit on
 * the brand band they are designed for.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Link, type LinkProps } from './link.js'

type LinkVariant = NonNullable<LinkProps['variant']>

const linkVariants = ['primary', 'secondary', 'white'] as const satisfies readonly LinkVariant[]
const darkSurfaceVariants = new Set<LinkVariant>(['secondary', 'white'])

const forcedStates = {
  default: '',
  hover:
    'bg-(--link-halo) decoration-2 shadow-[0_-2px_0_var(--link-halo),0_4px_0_var(--link-halo)]',
  focus: 'outline outline-2 outline-offset-2 outline-(--link-color)',
  active:
    'bg-(--link-halo-active) decoration-2 shadow-[0_-2px_0_var(--link-halo-active),0_4px_0_var(--link-halo-active)]',
} as const

const meta = {
  title: 'Components/Link/Tests',
  component: Link,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    href: '/about',
    children: 'About NSW Government',
  },
} satisfies Meta<typeof Link>

export default meta

type Story = StoryObj<typeof meta>

export const VariantStateMatrix: Story = {
  name: 'Variant × state matrix',
  render: () => (
    <div className='w-full max-w-7xl space-y-3'>
      <div className='grid grid-cols-[9rem_repeat(4,minmax(0,1fr))] items-center gap-2 px-4 text-base font-semibold text-muted-foreground'>
        <span>Variant</span>
        {Object.keys(forcedStates).map((state) => (
          <span key={state} className='text-center capitalize'>
            {state}
          </span>
        ))}
      </div>

      {linkVariants.map((variant) => (
        <div
          key={variant}
          data-variant-row={variant}
          className={
            darkSurfaceVariants.has(variant)
              ? 'rounded-sm bg-primary-800 p-4 text-white dark:bg-primary-950'
              : 'rounded-sm bg-background p-4 text-foreground ring-1 ring-foreground/10'
          }
        >
          <div className='grid grid-cols-[9rem_repeat(4,minmax(0,1fr))] items-center gap-2'>
            <span className='text-base font-semibold capitalize'>{variant}</span>
            {Object.entries(forcedStates).map(([state, className]) => (
              <div key={state} className='text-center'>
                <Link
                  href={`/${variant}/${state}`}
                  variant={variant}
                  data-state={state}
                  className={className}
                >
                  About NSW Government
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Every forced halo must resolve to a painted colour — a broken
    // --link-halo derivation would leave the hover and active columns bare.
    for (const variant of linkVariants) {
      for (const state of ['hover', 'active'] as const) {
        const link = canvasElement.querySelector<HTMLElement>(
          `[data-variant-row="${variant}"] a[data-state="${state}"]`,
        )
        await expect(link).not.toBeNull()
        const background = getComputedStyle(link!).backgroundColor
        await expect(background).not.toBe('rgba(0, 0, 0, 0)')
        await expect(background).not.toBe('')
      }
    }
  },
}

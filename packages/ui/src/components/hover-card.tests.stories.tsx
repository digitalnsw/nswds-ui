/**
 * HoverCard — Tests
 *
 * The CSS check: proves globals.css loaded by reading a semantic token off a
 * trigger painted with it. Hidden from the sidebar; it runs in the Vitest
 * suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card.js'

// A raw trigger painted with the semantic --primary token, which CssCheck reads.
const triggerClasses =
  'rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground'

const meta = {
  title: 'Components/HoverCard/Tests',
  component: HoverCard,
  tags: ['!dev', '!autodocs'],
  parameters: { layout: 'padded' },
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger className={triggerClasses}>Service NSW</HoverCardTrigger>
      <HoverCardContent>
        <p className='text-popover-foreground'>
          Service NSW is the one place to go for NSW Government services online, by phone and in
          person.
        </p>
      </HoverCardContent>
    </HoverCard>
  ),
} satisfies Meta<typeof HoverCard>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const CssCheck: Story = {
  name: 'CSS Check',
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the trigger resolves the semantic
    // --primary token to a real, non-transparent colour.
    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="hover-card-trigger"]')
    if (!trigger) throw new Error('HoverCard trigger not found.')
    const bg = getComputedStyle(trigger).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the --primary token to resolve to a visible colour, got "${bg}". Is globals.css loaded?`,
      )
    }
  },
}

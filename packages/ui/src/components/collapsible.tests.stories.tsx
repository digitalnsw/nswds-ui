/**
 * Collapsible — Tests
 *
 * CSS check: proves globals.css loaded and the open panel's fill token resolves.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible.js'

const meta = {
  title: 'Components/Collapsible/Tests',
  component: Collapsible,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <Collapsible {...args} className='w-full max-w-md'>
      <CollapsibleTrigger className='flex w-full items-center justify-between rounded-md border border-border bg-background px-4 py-2 text-base font-medium text-foreground'>
        What to bring
      </CollapsibleTrigger>
      <CollapsibleContent className='mt-2 rounded-md border border-border bg-muted p-4 text-base text-muted-foreground'>
        Bring photo ID and proof of your NSW address.
      </CollapsibleContent>
    </Collapsible>
  ),
} satisfies Meta<typeof Collapsible>

export default meta

type Story = StoryObj<typeof meta>

export const CssCheck: Story = {
  name: 'CSS check',
  args: { defaultOpen: true },
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: with the panel open, the --muted token
    // resolves to a real, non-transparent colour.
    const panel = canvasElement.querySelector<HTMLElement>('[data-slot="collapsible-content"]')
    if (!panel) throw new Error('Open collapsible panel not found.')
    const bg = getComputedStyle(panel).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the --muted token to resolve to a visible colour, got "${bg}". Is globals.css loaded?`,
      )
    }
  },
}

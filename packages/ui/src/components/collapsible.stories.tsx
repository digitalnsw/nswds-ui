/**
 * Collapsible — an expandable section on the Base UI collapsible primitive.
 *
 * Base UI owns the disclosure ARIA wiring (aria-expanded / aria-controls) and
 * keyboard handling; we only style the trigger and panel.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible.js'

const triggerClasses =
  'flex w-full items-center justify-between rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground'
const panelClasses =
  'mt-2 rounded-md border border-border bg-muted p-4 text-sm text-muted-foreground'

const meta = {
  title: 'Components/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An expandable/collapsible disclosure section. Base UI manages the ARIA and keyboard behaviour; the panel mounts only while open.',
      },
    },
  },
  render: (args) => (
    <Collapsible {...args} className='w-full max-w-md'>
      <CollapsibleTrigger className={triggerClasses}>Toggle details</CollapsibleTrigger>
      <CollapsibleContent className={panelClasses}>
        Hidden content revealed when the trigger is activated.
      </CollapsibleContent>
    </Collapsible>
  ),
} satisfies Meta<typeof Collapsible>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[data-slot="collapsible-trigger"]')
    if (!trigger) {
      throw new Error('Could not find [data-slot="collapsible-trigger"].')
    }
  },
}

export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <div className='flex w-full max-w-md flex-col gap-8'>
      {[false, true].map((open) => (
        <Collapsible key={String(open)} defaultOpen={open}>
          <CollapsibleTrigger className={triggerClasses}>
            {open ? 'Open by default' : 'Closed by default'}
          </CollapsibleTrigger>
          <CollapsibleContent className={panelClasses}>
            Panel content for the {open ? 'open' : 'closed'} example.
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CSS Check',
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

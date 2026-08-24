/**
 * Kbd — Default, Variants, CssCheck
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Kbd, KbdGroup } from './kbd.js'

const meta = {
  title: 'Components/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Renders a keyboard key or key sequence. `Kbd` is a single `<kbd>` badge; `KbdGroup` lays out several `Kbd` elements as one shortcut. Presentational only — no ARIA or focus behaviour.',
      },
    },
  },
  args: {
    children: 'Esc',
  },
  render: (args) => <Kbd {...args} />,
} satisfies Meta<typeof Kbd>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The rendered key text is the whole contract for this presentational badge.
    const kbd = canvas.getByText('Esc')
    await expect(kbd).toBeInTheDocument()
    await expect(kbd).toHaveAttribute('data-slot', 'kbd')
  },
}

export const Variants: Story = {
  render: () => (
    <div className='flex flex-col items-start gap-4'>
      <Kbd>Enter</Kbd>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    const kbd = canvasElement.querySelector<HTMLElement>('[data-slot="kbd"]')
    if (!kbd) {
      throw new Error('Could not find [data-slot="kbd"].')
    }

    // Proves globals.css loaded: bg-muted resolves to a real colour rather than
    // staying transparent.
    const background = getComputedStyle(kbd).backgroundColor
    if (background === '' || background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
      throw new Error(`Expected bg-muted to resolve, received "${background}".`)
    }
  },
}

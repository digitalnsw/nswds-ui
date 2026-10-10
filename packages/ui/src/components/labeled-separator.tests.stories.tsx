/**
 * LabeledSeparator — Tests
 *
 * CSS check: proves globals.css loaded and the layout and rule token resolve.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { LabeledSeparator } from './labeled-separator.js'

const meta = {
  title: 'Components/LabeledSeparator/Tests',
  component: LabeledSeparator,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    children: 'or',
  },
  render: (args) => (
    <div className='w-full max-w-md'>
      <LabeledSeparator {...args} />
    </div>
  ),
} satisfies Meta<typeof LabeledSeparator>

export default meta

type Story = StoryObj<typeof meta>

export const CssCheck: Story = {
  name: 'CSS check',
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the decorative rule resolves the
    // semantic --border token to a real, non-transparent colour, and the
    // flex container lays the children out on a single row.
    const root = canvasElement.querySelector<HTMLElement>('[data-slot="labeled-separator"]')
    if (!root) throw new Error('LabeledSeparator root not found.')
    const display = getComputedStyle(root).display
    if (display !== 'flex') {
      throw new Error(`Expected display:flex on the root, got "${display}".`)
    }

    const rule = canvasElement.querySelector<HTMLElement>('[data-slot="separator"]')
    if (!rule) throw new Error('Separator rule not found.')
    const bg = getComputedStyle(rule).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the rule's --border token to resolve to a visible colour, got "${bg}". Is globals.css loaded?`,
      )
    }
  },
}

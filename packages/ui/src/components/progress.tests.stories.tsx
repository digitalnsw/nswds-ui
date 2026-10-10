/**
 * Progress — Tests
 *
 * Stories that prove something rather than show it. They stay out of the
 * sidebar (`!dev`) but run in the Vitest suite.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Progress } from './progress.js'

const meta = {
  title: 'Components/Progress/Tests',
  component: Progress,
  tags: ['!dev', '!autodocs'],
  parameters: { layout: 'padded' },
  args: {
    value: 60,
    'aria-label': 'Upload progress',
  },
  render: (args) => (
    <div className='max-w-md'>
      <Progress {...args} />
    </div>
  ),
} satisfies Meta<typeof Progress>

export default meta

type Story = StoryObj<typeof meta>

export const CssCheck: Story = {
  name: 'CssCheck',
  // A non-zero value gives the indicator a width so it is laid out.
  args: { value: 60 },
  play: async ({ canvasElement }) => {
    const indicator = canvasElement.querySelector<HTMLElement>('[data-slot="progress-indicator"]')
    if (!indicator) {
      throw new Error('Could not find [data-slot="progress-indicator"].')
    }

    // Proves globals.css loaded: bg-primary resolves to a real colour rather
    // than staying transparent.
    const background = getComputedStyle(indicator).backgroundColor
    if (background === '' || background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
      throw new Error(`Expected bg-primary to resolve, received "${background}".`)
    }
  },
}

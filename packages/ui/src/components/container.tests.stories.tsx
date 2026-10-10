/**
 * Container — Tests
 *
 * CSS check: proves globals.css loaded and the `narrow` cap resolves.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Container } from './container.js'

const meta = {
  title: 'Components/Container/Tests',
  component: Container,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Container>

export default meta

type Story = StoryObj<typeof meta>

export const CssCheck: Story = {
  name: 'CSS check',
  render: () => (
    <Container size='narrow'>
      <div className='bg-muted p-4 text-foreground'>Constrained to the reading measure.</div>
    </Container>
  ),
  play: async ({ canvasElement }) => {
    const container = canvasElement.querySelector<HTMLElement>('[data-slot="container"]')
    if (!container) {
      throw new Error('Could not find an element with [data-slot="container"].')
    }
    const maxWidth = getComputedStyle(container).maxWidth

    // 45rem at the 16px root — proves globals.css loaded and the variant applied.
    if (maxWidth !== '720px') {
      throw new Error(`Expected max-width 720px for size="narrow", received "${maxWidth}".`)
    }
  },
}

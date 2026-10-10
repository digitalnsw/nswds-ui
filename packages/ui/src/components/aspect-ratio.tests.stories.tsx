/**
 * AspectRatio — Tests
 *
 * CSS check: proves globals.css loaded and the fill token resolves.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { AspectRatio } from './aspect-ratio.js'

const meta = {
  title: 'Components/AspectRatio/Tests',
  component: AspectRatio,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: { ratio: 16 / 9 },
  render: (args) => (
    <div className='w-full max-w-sm'>
      <AspectRatio {...args}>
        <div className='flex size-full items-center justify-center rounded-md bg-muted text-base text-muted-foreground'>
          {args.ratio.toFixed(2)}
        </div>
      </AspectRatio>
    </div>
  ),
} satisfies Meta<typeof AspectRatio>

export default meta

type Story = StoryObj<typeof meta>

export const CssCheck: Story = {
  name: 'CSS check',
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the inner fill resolves the semantic
    // --muted token to a real, non-transparent colour.
    const fill = canvasElement.querySelector<HTMLElement>('[data-slot="aspect-ratio"] > div')
    if (!fill) throw new Error('AspectRatio fill element not found.')
    const bg = getComputedStyle(fill).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the --muted token to resolve to a visible colour, got "${bg}". Is globals.css loaded?`,
      )
    }
  },
}

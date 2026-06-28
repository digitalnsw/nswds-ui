/**
 * AspectRatio — constrains content to a fixed width-to-height ratio.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { AspectRatio } from './aspect-ratio.js'

const meta = {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Constrains its content to a fixed width-to-height ratio. Pass `ratio` as a number (e.g. 16 / 9 ≈ 1.78); the child fills the box.',
      },
    },
  },
  args: { ratio: 16 / 9 },
  argTypes: {
    ratio: {
      control: { type: 'number', step: 0.1 },
      description: 'Width-to-height ratio, e.g. 16 / 9 ≈ 1.78.',
      table: { category: 'Appearance' },
    },
    className: { table: { disable: true, category: 'Advanced' } },
  },
  render: (args) => (
    <div className="w-full max-w-sm">
      <AspectRatio {...args}>
        <div className="flex size-full items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
          {args.ratio.toFixed(2)}
        </div>
      </AspectRatio>
    </div>
  ),
} satisfies Meta<typeof AspectRatio>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>(
      '[data-slot="aspect-ratio"]'
    )
    if (!root) throw new Error('Could not find [data-slot="aspect-ratio"].')
    const ratio = getComputedStyle(root).aspectRatio
    if (!ratio || ratio === 'auto') {
      throw new Error(`Expected an aspect-ratio to be set, got "${ratio}".`)
    }
  },
}

export const Variants: Story = {
  name: 'Variants',
  render: () => {
    const ratios: Array<[string, number]> = [
      ['16 / 9', 16 / 9],
      ['4 / 3', 4 / 3],
      ['1 / 1', 1],
    ]
    return (
      <div className="flex w-full max-w-3xl flex-wrap gap-6">
        {ratios.map(([label, ratio]) => (
          <div key={label} className="w-56">
            <AspectRatio ratio={ratio}>
              <div className="flex size-full items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
                {label}
              </div>
            </AspectRatio>
          </div>
        ))}
      </div>
    )
  },
}

export const CssCheck: Story = {
  name: 'CSS Check',
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the inner fill resolves the semantic
    // --muted token to a real, non-transparent colour.
    const fill = canvasElement.querySelector<HTMLElement>(
      '[data-slot="aspect-ratio"] > div'
    )
    if (!fill) throw new Error('AspectRatio fill element not found.')
    const bg = getComputedStyle(fill).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the --muted token to resolve to a visible colour, got "${bg}". Is globals.css loaded?`
      )
    }
  },
}

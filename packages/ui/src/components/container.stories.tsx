/**
 * Container — Default, Variants, CssCheck
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Container } from './container.js'

const meta = {
  title: 'Components/Container',
  component: Container,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: {
      description: {
        component:
          'Container is the page-width column. It carries the same 16px → 24px → 48px lateral rhythm that Masthead, Header, MainNav and Footer apply to their own inner wrappers, so page content lines up with the chrome above it at every breakpoint.',
      },
    },
  },
  args: {
    size: 'fluid',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['fluid', 'contained', 'wide', 'narrow'],
      description:
        'Maximum width of the column. `fluid` matches the chrome components’ own default.',
      table: { category: 'Appearance' },
    },
    className: { table: { disable: true, category: 'Advanced' } },
  },
  render: (args) => (
    <Container {...args}>
      <div className='bg-muted p-4 text-foreground'>
        Page content. The gap either side is the container’s padding.
      </div>
    </Container>
  ),
} satisfies Meta<typeof Container>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getContainer(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="container"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="container"].')
  }
  return el
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const container = getContainer(canvasElement)

    // The padding is what page content depends on to align with the chrome, so
    // assert the resolved value rather than the class.
    const paddingLeft = getComputedStyle(container).paddingLeft
    if (paddingLeft === '' || paddingLeft === '0px') {
      throw new Error(`Expected the container to carry lateral padding, received "${paddingLeft}".`)
    }

    if (
      getComputedStyle(container).marginInlineStart !== getComputedStyle(container).marginInlineEnd
    ) {
      throw new Error('Expected the container to be centred (equal inline margins).')
    }
  },
}

export const Variants: Story = {
  render: () => (
    <div className='flex flex-col gap-4 py-4'>
      {(['fluid', 'contained', 'wide', 'narrow'] as const).map((size) => (
        <Container key={size} size={size}>
          <div className='bg-muted p-4 text-foreground'>
            <code>size=&quot;{size}&quot;</code>
          </div>
        </Container>
      ))}
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  render: () => (
    <Container size='narrow'>
      <div className='bg-muted p-4 text-foreground'>Constrained to the reading measure.</div>
    </Container>
  ),
  play: async ({ canvasElement }) => {
    const container = getContainer(canvasElement)
    const maxWidth = getComputedStyle(container).maxWidth

    // 45rem at the 16px root — proves globals.css loaded and the variant applied.
    if (maxWidth !== '720px') {
      throw new Error(`Expected max-width 720px for size="narrow", received "${maxWidth}".`)
    }
  },
}

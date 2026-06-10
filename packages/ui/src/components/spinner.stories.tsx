/**
 * Spinner — Default + Playground
 *
 * Sub-groups live in separate story files so Storybook renders them as
 * collapsible sidebar folders:
 *   Components/Spinner/Features        → spinner.features.stories.tsx
 *   Components/Spinner/Accessibility   → spinner.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Spinner } from './spinner.js'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const colors = ['primary', 'accent', 'white'] as const

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        <div className="text-foreground max-w-3xl space-y-8">
          <section className="space-y-3">
            <h1 className="text-4xl font-bold tracking-normal">Spinner</h1>
            <p className="text-muted-foreground text-base">
              Spinner is a busy-state indicator for in-flight asynchronous work.
              Use it to communicate that the page or a region is loading
              content, submitting a form, or otherwise waiting on a response
              before the result can be shown.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-normal">Default</h2>
            <Spinner aria-label="Loading" />
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-normal">Sizes</h2>
            <div className="flex flex-wrap items-end gap-6">
              {sizes.map((size) => (
                <div key={size} className="flex flex-col items-center gap-2">
                  <Spinner size={size} aria-label={`Loading (${size})`} />
                  <span className="text-muted-foreground text-xs">{size}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-normal">Usage</h2>
            <p className="text-muted-foreground text-base">
              Always supply an <code>aria-label</code> describing what is
              loading. The outer element has{' '}
              <code>role=&quot;status&quot;</code> so assistive tech announces
              the label politely when the spinner appears.
            </p>
            <div className="flex items-center gap-3">
              <Spinner aria-label="Loading results" />
              <span className="text-foreground text-sm">Loading results…</span>
            </div>
          </section>
        </div>
      ),
      description: {
        component:
          'Spinner is a compact busy-state indicator for in-flight asynchronous work. It announces loading politely via role="status" and requires consumers to supply an accessible name through aria-label.',
      },
    },
  },
  args: {
    size: 'md',
    color: 'primary',
    'aria-label': 'Loading',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizes,
      description:
        'Diameter preset for the spinner. Maps to fixed Tailwind size utilities (xs=12px through xl=40px).',
      table: { category: 'Appearance' },
    },
    color: {
      control: 'inline-radio',
      options: colors,
      description:
        'Colour token for the spinning arc. `primary` and `accent` use the masterbrand theme; `white` is for use on dark or coloured surfaces.',
      table: { category: 'Appearance' },
    },
    'aria-label': {
      control: 'text',
      description:
        'Accessible name announced via the role="status" live region. Describe what is loading (e.g. "Loading results").',
      table: { category: 'Accessibility' },
    },
    className: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Spinner>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    size: 'md',
    color: 'primary',
    'aria-label': 'Loading',
  },
  play: async ({ canvasElement, args }) => {
    const status = canvasElement.querySelector('[role="status"]')

    if (!status) {
      throw new Error('Could not find element with role="status".')
    }

    const expectedLabel = args['aria-label']
    const receivedLabel = status.getAttribute('aria-label')

    if (receivedLabel !== expectedLabel) {
      throw new Error(
        `Expected aria-label="${expectedLabel}", received "${receivedLabel}".`
      )
    }
  },
}

export const Playground: Story = {
  name: 'Playground',
  parameters: {
    controls: {
      // Compact view: Name + Control only, no description/type/default columns
      expanded: false,
      sort: 'requiredFirst',
    },
  },
  render: (args) => (
    <div className="border-border bg-background flex w-full max-w-xl items-center justify-center rounded-sm border p-6">
      <Spinner {...args} />
    </div>
  ),
}

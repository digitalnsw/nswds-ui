/**
 * Separator — Default + Playground
 *
 * Sub-groups live in separate story files so Storybook renders them as
 * collapsible sidebar folders:
 *   Components/Separator/Features        → separator.features.stories.tsx
 *   Components/Separator/Accessibility   → separator.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Separator } from './separator.js'

const meta = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        <div className="max-w-3xl space-y-8 text-foreground">
          <section className="space-y-3">
            <h1 className="text-4xl font-bold tracking-normal">Separator</h1>
            <p className="text-base text-muted-foreground">
              A thin horizontal or vertical divider that visually splits related
              groups of content. Use it to organise sections inside menus,
              toolbars, cards, and lists where added whitespace alone would not
              make the boundary clear enough.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-normal">Horizontal</h2>
            <div className="w-full max-w-md space-y-3 rounded-sm border border-border bg-background p-4">
              <p className="text-sm text-foreground">Section one</p>
              <Separator />
              <p className="text-sm text-foreground">Section two</p>
              <Separator />
              <p className="text-sm text-foreground">Section three</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-normal">Vertical</h2>
            <div className="flex h-12 items-stretch gap-3 rounded-sm border border-border bg-background px-4">
              <span className="flex items-center text-sm text-foreground">
                Home
              </span>
              <Separator orientation="vertical" />
              <span className="flex items-center text-sm text-foreground">
                About
              </span>
              <Separator orientation="vertical" />
              <span className="flex items-center text-sm text-foreground">
                Contact
              </span>
            </div>
          </section>
        </div>
      ),
      description: {
        component:
          'Separator is a thin horizontal or vertical divider that splits related content into visually distinct groups, used inside menus, toolbars, cards, and stacked sections.',
      },
    },
  },
  args: {
    orientation: 'horizontal',
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description:
        'Axis along which the separator is drawn — horizontal fills width, vertical fills height.',
      table: { category: 'Appearance' },
    },
    decorative: {
      control: 'boolean',
      description:
        'When true, the separator is hidden from assistive tech (role="none"); when false it exposes role="separator".',
      table: { category: 'Accessibility' },
    },
    className: {
      table: { disable: true, category: 'Advanced' },
    },
  },
  render: (args) => {
    if (args.orientation === 'vertical') {
      return (
        <div className="flex h-12 items-stretch gap-3 rounded-sm border border-border bg-background px-4">
          <span className="flex items-center text-sm text-foreground">A</span>
          <Separator {...args} />
          <span className="flex items-center text-sm text-foreground">B</span>
        </div>
      )
    }
    return (
      <div className="w-full max-w-md space-y-3 rounded-sm border border-border bg-background p-4">
        <p className="text-sm text-foreground">Above</p>
        <Separator {...args} />
        <p className="text-sm text-foreground">Below</p>
      </div>
    )
  },
} satisfies Meta<typeof Separator>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSeparator(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector('[data-slot="separator"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="separator"].')
  }
  return el
}

function expectAttribute(
  element: Element,
  name: string,
  expectedValue: string
) {
  const receivedValue = element.getAttribute(name)

  if (receivedValue !== expectedValue) {
    throw new Error(
      `Expected ${name}="${expectedValue}", received "${receivedValue}".`
    )
  }
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    orientation: 'horizontal',
  },
  play: async ({ canvasElement, args }) => {
    const separator = getSeparator(canvasElement)
    expectAttribute(
      separator,
      'data-orientation',
      args.orientation ?? 'horizontal'
    )
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
    <div className="w-full max-w-xl rounded-sm border border-border bg-background p-6">
      {args.orientation === 'vertical' ? (
        <div className="flex h-12 items-stretch gap-3">
          <span className="flex items-center text-sm text-foreground">
            Item A
          </span>
          <Separator {...args} />
          <span className="flex items-center text-sm text-foreground">
            Item B
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-foreground">Block above</p>
          <Separator {...args} />
          <p className="text-sm text-foreground">Block below</p>
        </div>
      )}
    </div>
  ),
}

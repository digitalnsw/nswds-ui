/**
 * Button — Default + Playground
 *
 * Sub-groups live in separate story files so Storybook renders them as
 * collapsible sidebar folders:
 *   Components/Button/Features   → button.features.stories.tsx
 *   Components/Button/Examples   → button.examples.stories.tsx
 *   Components/Button/Tests      → button.tests.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { Button } from './button.js'
import { Icons } from './icons.js'

const variants = ['solid', 'soft', 'surface', 'outline', 'ghost', 'link'] as const
const sizes = ['sm', 'default', 'lg', 'icon'] as const
const colors = [
  'white',
  'grey',
  'primary',
  'secondary',
  'tertiary',
  'accent',
  'danger',
] as const

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component:
          'High-detail button stories for design QA, interaction regression testing, and accessibility verification. Stories are organized by **theme first** and include matrix, stress, and touch-target diagnostics.',
      },
    },
  },
  args: {
    children: 'Continue',
    variant: 'solid',
    color: 'primary',
    size: 'default',
    disabled: false,
    loading: false,
    block: false,
    alignContent: 'center',
    onClick: fn(),
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Button label/content.',
      table: { category: 'Content' },
    },
    leadingVisual: {
      control: 'select',
      options: ['none', 'arrow_forward', 'add', 'search', 'chevron_down'],
      mapping: {
        none: undefined,
        arrow_forward: Icons.arrow_forward,
        add: Icons.add,
        search: Icons.search,
        chevron_down: Icons.expand_more,
      },
      description: 'Icon component rendered before the label.',
      table: { category: 'Content' },
    },
    trailingVisual: {
      control: 'select',
      options: ['none', 'arrow_forward', 'add', 'search', 'chevron_down'],
      mapping: {
        none: undefined,
        arrow_forward: Icons.arrow_forward,
        add: Icons.add,
        search: Icons.search,
        chevron_down: Icons.expand_more,
      },
      description: 'Icon component rendered after the label.',
      table: { category: 'Content' },
    },
    trailingAction: {
      control: 'select',
      options: ['none', 'arrow_forward', 'add', 'chevron_down'],
      mapping: {
        none: undefined,
        arrow_forward: Icons.arrow_forward,
        add: Icons.add,
        chevron_down: Icons.expand_more,
      },
      description: 'Icon component rendered as a trailing action (far end).',
      table: { category: 'Content' },
    },
    labelWrap: {
      control: 'boolean',
      description: 'Allow the button label to wrap onto multiple lines.',
      table: { category: 'Content' },
    },
    count: {
      control: 'number',
      description: 'Optional numeric badge rendered after the label.',
      table: { category: 'Content' },
    },
    href: {
      control: 'text',
      description: 'When provided, button renders as a link.',
      table: { category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables click/tap and applies disabled styles.',
      table: { category: 'Behavior' },
    },
    loading: {
      control: 'boolean',
      description: 'Shows a spinner and disables the button.',
      table: { category: 'Behavior' },
    },
    variant: {
      control: 'inline-radio',
      options: variants,
      description: 'Visual treatment of the button.',
      table: { category: 'Appearance' },
    },
    color: {
      control: 'select',
      options: colors,
      description: 'Theme token mapped to button foreground/background/border.',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'inline-radio',
      options: sizes,
      description: 'Height/padding preset including icon-only mode.',
      table: { category: 'Appearance' },
    },
    block: {
      control: 'boolean',
      description: 'Stretches the button to fill its container width.',
      table: { category: 'Appearance' },
    },
    alignContent: {
      control: 'inline-radio',
      options: ['center', 'start'],
      description: 'Horizontal alignment of button content.',
      table: { category: 'Appearance' },
    },
    onClick: {
      description: 'Click handler (logged in Actions panel).',
      table: { category: 'Events' },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name for icon-only or non-text content.',
      table: { category: 'Accessibility' },
    },
    'aria-disabled': {
      control: 'boolean',
      description: 'Marks the button as disabled without removing it from the tab order.',
      table: { category: 'Accessibility' },
    },
    className: {
      table: { disable: true, category: 'Advanced' },
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getButton(canvasElement: HTMLElement, name: string) {
  const button = Array.from(canvasElement.querySelectorAll('button')).find(
    (el) => el.textContent === name || el.getAttribute('aria-label') === name
  )

  if (!button) throw new Error(`Could not find button named "${name}".`)

  return button
}

function expectAttribute(element: Element, name: string, expectedValue: string) {
  const receivedValue = element.getAttribute(name)

  if (receivedValue !== expectedValue) {
    throw new Error(`Expected ${name}="${expectedValue}", received "${receivedValue}".`)
  }
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    children: 'Continue',
    variant: 'solid',
  },
  play: async ({ canvasElement }) => {
    const button = getButton(canvasElement, 'Continue')
    expectAttribute(button, 'data-variant', 'solid')
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
      <Button {...args}>{args.children}</Button>
    </div>
  ),
}

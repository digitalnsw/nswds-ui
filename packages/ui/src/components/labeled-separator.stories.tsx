/**
 * LabeledSeparator — a horizontal rule broken by a centred label.
 *
 * The canonical use is the "or" divider that separates one sign-in method
 * (email/password) from another (social login) in a login form.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { LabeledSeparator } from './labeled-separator.js'

const meta = {
  title: 'Components/LabeledSeparator',
  component: LabeledSeparator,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A horizontal divider with a centred label. The flanking rules are decorative; the visible label carries the meaning for assistive technology.',
      },
    },
  },
  args: {
    children: 'or',
  },
  argTypes: {
    children: {
      control: 'text',
      description:
        'The label rendered between the two rules. Defaults to "or". For an unbroken divider, use the Separator component instead.',
      table: { category: 'Content' },
    },
    className: {
      table: { disable: true, category: 'Advanced' },
    },
  },
  render: (args) => (
    <div className='w-full max-w-md'>
      <LabeledSeparator {...args} />
    </div>
  ),
} satisfies Meta<typeof LabeledSeparator>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // The wrapper mounts and the default "or" label renders.
    const root = canvasElement.querySelector('[data-slot="labeled-separator"]')
    if (!root) {
      throw new Error('Could not find [data-slot="labeled-separator"].')
    }
    const label = canvasElement.querySelector('[data-slot="labeled-separator-content"]')
    if (label?.textContent?.trim() !== 'or') {
      throw new Error(`Expected default label "or", received "${label?.textContent?.trim()}".`)
    }

    // Two flanking rules, both decorative (hidden from assistive tech).
    const rules = canvasElement.querySelectorAll('[data-slot="separator"]')
    if (rules.length !== 2) {
      throw new Error(`Expected 2 decorative rules, found ${rules.length}.`)
    }
    rules.forEach((rule) => {
      if (rule.getAttribute('role') !== 'none') {
        throw new Error(
          `Expected flanking rule to be decorative (role="none"), got role="${rule.getAttribute('role')}".`,
        )
      }
    })
  },
}

export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <div className='w-full max-w-md space-y-8'>
      {/* Default "or" label */}
      <LabeledSeparator />
      {/* Custom label */}
      <LabeledSeparator>continue with</LabeledSeparator>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CSS Check',
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

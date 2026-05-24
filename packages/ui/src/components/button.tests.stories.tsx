/**
 * Button — Tests
 *
 * Automated play-function tests for disabled state, CSS token application,
 * and boundary/edge-case rendering.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './button.js'
import { Icons } from './icons.js'

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Button/Tests',
  component: Button,
  parameters: {
    layout: 'padded',
  },
  args: {
    children: 'Button',
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function IconLabel({ text }: { text: string }) {
  return (
    <>
      {text}
      <Icons.arrow_forward data-slot="icon" />
    </>
  )
}

function getButton(canvasElement: HTMLElement, name: string) {
  const button = Array.from(canvasElement.querySelectorAll('button')).find(
    (el) => el.textContent === name || el.getAttribute('aria-label') === name
  )

  if (!button) throw new Error(`Could not find button named "${name}".`)

  return button
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    children: 'Unavailable',
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const button = getButton(canvasElement, 'Unavailable')

    if (!button.hasAttribute('disabled')) {
      throw new Error('Expected disabled button to render disabled attribute.')
    }
  },
}

export const CssCheck: Story = {
  name: 'CSS Tokens',
  args: {
    children: 'Token styled button',
  },
  play: async ({ canvasElement }) => {
    const button = getButton(canvasElement, 'Token styled button')
    const styles = getComputedStyle(button)

    if (styles.backgroundColor === 'rgba(0, 0, 0, 0)') {
      throw new Error('Expected token styling to apply a background color.')
    }
  },
}

export const PrimaryActiveState: Story = {
  name: 'Primary Active State',
  render: () => (
    <Button data-active="" color="primary" variant="solid">
      Pressed primary
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const button = getButton(canvasElement, 'Pressed primary')
    const styles = getComputedStyle(button)
    const hoverOverlay = styles.getPropertyValue('--btn-hover-overlay').trim()
    const activeOverlay = styles.getPropertyValue('--btn-active-overlay').trim()

    if (!activeOverlay) {
      throw new Error('Expected primary button active state to define an active overlay.')
    }

    if (activeOverlay === hoverOverlay) {
      throw new Error('Expected primary button active state to differ from hover state.')
    }
  },
}

export const EdgeCases: Story = {
  name: 'Edge Cases',
  render: () => (
    <div className="space-y-2 rounded-sm border border-border bg-background p-4">
      <div className="flex flex-wrap gap-2">
        <Button size="icon" aria-label="Only icon">
          <Icons.add data-slot="icon" />
        </Button>
        <Button variant="outline" color="accent">
          {' '}
        </Button>
        <Button size="sm" color="grey">
          ---
        </Button>
        <Button size="lg" color="accent">
          <IconLabel text="A very very very long call to action label" />
        </Button>
      </div>
    </div>
  ),
}

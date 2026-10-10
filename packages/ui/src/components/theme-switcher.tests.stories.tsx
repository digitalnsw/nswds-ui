/**
 * ThemeSwitcher — Tests
 *
 * Stories that prove something rather than show something. Hidden from the
 * sidebar; run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { ThemeSwitcher, type ThemeSwitcherTheme } from './theme-switcher.js'

const meta = {
  title: 'Components/ThemeSwitcher/Tests',
  component: ThemeSwitcher,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    defaultTheme: 'light',
    variant: 'surface',
    color: 'grey',
    size: 'icon',
  },
} satisfies Meta<typeof ThemeSwitcher>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSwitcher(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLButtonElement>('[data-slot="theme-switcher"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="theme-switcher"].')
  }
  return el
}

/** Poll until `predicate` holds, so React re-renders have time to settle. */
async function waitFor(predicate: () => boolean, message: string, timeout = 2000) {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    if (predicate()) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 16))
  }
  throw new Error(message)
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * A stateful owner driving the `theme` prop, exercising both directions. This
 * is the shape every real app uses — next-themes' `setTheme` slots in exactly
 * where the useState setter sits here.
 */
function ControlledDemo() {
  const [theme, setTheme] = React.useState<ThemeSwitcherTheme>('dark')
  return (
    <div className='flex items-center gap-3'>
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />
      <span className='text-base text-foreground'>
        App theme: <code data-demo='controlled-readout'>{theme}</code>
      </span>
    </div>
  )
}

export const Controlled: Story = {
  name: 'Controlled round trip',
  render: () => <ControlledDemo />,
  play: async ({ canvasElement }) => {
    const button = getSwitcher(canvasElement)
    const readout = canvasElement.querySelector<HTMLElement>('[data-demo="controlled-readout"]')
    if (!readout) {
      throw new Error('Could not find the controlled-readout element.')
    }

    // Seeded dark by its owner, so the offered action is "go light".
    if (readout.textContent !== 'dark') {
      throw new Error(`Expected the owner to start dark, got "${readout.textContent}".`)
    }
    if (button.getAttribute('aria-label') !== 'Switch to light theme') {
      throw new Error(
        `Expected aria-label "Switch to light theme" while dark, got "${button.getAttribute('aria-label')}".`,
      )
    }

    // dark → light: onThemeChange('light') reaches the owner, which re-renders
    // the switcher via the theme prop.
    button.click()
    await waitFor(
      () => readout.textContent === 'light',
      'Expected the owner state to become "light" after the first click.',
    )
    await waitFor(
      () => button.getAttribute('aria-label') === 'Switch to dark theme',
      'Expected the label to flip back to "Switch to dark theme" once controlled light.',
    )

    // light → dark: the reverse direction round-trips too.
    button.click()
    await waitFor(
      () => readout.textContent === 'dark',
      'Expected the owner state to return to "dark" after the second click.',
    )
    if (button.getAttribute('data-mode') !== 'dark') {
      throw new Error('Expected data-mode to track the controlled prop back to "dark".')
    }
  },
}

export const Variants: Story = {
  name: 'Button variants keep independent state',
  render: () => (
    <div className='flex items-center gap-3'>
      <ThemeSwitcher />
      <ThemeSwitcher variant='ghost' color='grey' />
      <ThemeSwitcher variant='solid' color='primary' />
      <ThemeSwitcher variant='outline' color='primary' />
      <ThemeSwitcher variant='soft' color='accent' defaultTheme='dark' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const switchers = canvasElement.querySelectorAll<HTMLElement>('[data-slot="theme-switcher"]')
    if (switchers.length !== 5) {
      throw new Error(`Expected 5 switchers, got ${switchers.length}.`)
    }
    // Each instance owns its state: the dark-seeded one offers the opposite
    // action and shows the sun, independent of its siblings.
    const darkSeeded = switchers[4]!
    if (darkSeeded.getAttribute('aria-label') !== 'Switch to light theme') {
      throw new Error('Expected the defaultTheme="dark" instance to offer "Switch to light theme".')
    }
    if (switchers[0]!.getAttribute('aria-label') !== 'Switch to dark theme') {
      throw new Error('Expected the light instances to offer "Switch to dark theme".')
    }
  },
}

export const CssCheck: Story = {
  name: 'CSS Check',
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the default surface/grey Button resolves
    // its --btn-bg-driven border and background to real colours, and the icon
    // paints in the Button ink through fill-current.
    const button = getSwitcher(canvasElement)
    const styles = getComputedStyle(button)

    if (styles.borderTopWidth !== '2px') {
      throw new Error(
        `Expected the surface variant's 2px border, got "${styles.borderTopWidth}". Is globals.css loaded?`,
      )
    }
    if (styles.borderTopColor === '' || styles.borderTopColor === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the border to resolve from --btn-bg to a visible colour, got "${styles.borderTopColor}".`,
      )
    }
    if (styles.backgroundColor === '' || styles.backgroundColor === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the surface tint to resolve to a non-transparent colour, got "${styles.backgroundColor}".`,
      )
    }

    const icon = button.querySelector('svg')
    if (!icon) {
      throw new Error('Expected the switcher to contain an icon svg.')
    }
    const fill = getComputedStyle(icon).fill
    if (fill === '' || fill === 'none') {
      throw new Error(`Expected the icon fill to resolve, got "${fill}".`)
    }
    if (fill !== styles.color) {
      throw new Error(
        `Expected fill-current to paint the icon in the Button ink (${styles.color}), got "${fill}".`,
      )
    }
  },
}

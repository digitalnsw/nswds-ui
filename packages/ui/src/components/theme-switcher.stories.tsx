/**
 * ThemeSwitcher — Default + Controlled + Variants + CSS Check + Playground
 *
 * The light/dark toggle button. Framework-free: the component only reports the
 * requested theme through `onThemeChange`; the app (next-themes, a class
 * toggle, anything) applies it. Clicking the switcher in these stories does
 * NOT restyle the canvas — Storybook's own toolbar toggle drives `.dark` via
 * addon-themes, and no provider connects this component to it.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { ThemeSwitcher, type ThemeSwitcherTheme } from './theme-switcher.js'

const nextThemesSnippet = `'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { ThemeSwitcher } from '@nswds/ui'

export function AppThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme()

  // resolvedTheme is undefined during SSR — gate rendering yourself if the
  // first-paint icon swap bothers you. The mounted dance is the app's
  // concern, not the design system's.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <ThemeSwitcher
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      onThemeChange={setTheme}
    />
  )
}`

const meta = {
  title: 'Components/ThemeSwitcher',
  component: ThemeSwitcher,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        <div className='max-w-3xl space-y-8 p-6 text-foreground'>
          <section className='space-y-3'>
            <h1 className='text-4xl font-bold tracking-normal'>ThemeSwitcher</h1>
            <p className='text-base text-muted-foreground'>
              An icon Button that toggles between light and dark themes. It owns the toggle
              affordance only — <code>onThemeChange</code> reports the requested theme and the app
              applies it. The <code>aria-label</code> announces the action (&ldquo;Switch to dark
              theme&rdquo;) and flips with each activation; there is deliberately no{' '}
              <code>aria-pressed</code>, because a mode switch between two named states is not a
              pressed/unpressed toggle.
            </p>
          </section>

          <section className='space-y-3'>
            <h2 className='text-2xl font-bold tracking-normal'>Wiring next-themes</h2>
            <p className='text-base text-muted-foreground'>
              The nswds-app source bundled next-themes and a mounted-gate; the design system cannot
              depend on a theming framework, so that plumbing moves to the app. There is also no DS{' '}
              <code>ThemeProvider</code> — the app&rsquo;s source merely re-exported
              next-themes&rsquo;. A typical Next.js wiring:
            </p>
            <pre className='overflow-x-auto rounded-sm bg-muted p-4 text-sm'>
              <code>{nextThemesSnippet}</code>
            </pre>
          </section>

          <section className='space-y-3'>
            <h2 className='text-2xl font-bold tracking-normal'>In Storybook</h2>
            <p className='text-base text-muted-foreground'>
              Clicking the switcher in these stories does <strong>not</strong> change the
              canvas&rsquo;s theme: no provider is wired here. Storybook&rsquo;s toolbar toggle
              drives the <code>.dark</code> class via addon-themes. Watch the{' '}
              <code>aria-label</code>, icon and <code>data-mode</code> flip instead.
            </p>
          </section>
        </div>
      ),
      description: {
        component:
          'Light/dark toggle button with an action-phrased, flipping aria-label. Controlled or uncontrolled; the app owns the actual theme plumbing.',
      },
    },
  },
  args: {
    defaultTheme: 'light',
    variant: 'surface',
    color: 'grey',
    size: 'icon',
  },
  argTypes: {
    theme: {
      control: false,
      description:
        'Current theme (controlled). Left un-set in the playground — a controlled switcher with no owner updating it would appear frozen. See the Controlled story.',
      table: { category: 'Behaviour' },
    },
    defaultTheme: {
      control: 'inline-radio',
      options: ['light', 'dark'],
      description: 'Initial theme when uncontrolled.',
      table: { category: 'Behaviour' },
    },
    onThemeChange: {
      control: false,
      description: 'Called with the NEXT theme on every activation.',
      table: { category: 'Behaviour' },
    },
    variant: {
      control: 'inline-radio',
      options: ['solid', 'soft', 'surface', 'outline', 'ghost'],
      description: 'Button variant. Defaults to surface, matching the nswds-app header chip.',
      table: { category: 'Appearance' },
    },
    color: {
      control: 'select',
      options: ['white', 'grey', 'primary', 'secondary', 'tertiary', 'accent'],
      description:
        "Button ink. Defaults to grey — the source's color='light' does not exist on this Button.",
      table: { category: 'Appearance' },
    },
    size: {
      control: 'inline-radio',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Button size. Defaults to the 40px icon square.',
      table: { category: 'Appearance' },
    },
    className: {
      table: { disable: true, category: 'Advanced' },
    },
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

// Module-level capture for the Default play() — reset at the start of each run.
const capturedThemes: ThemeSwitcherTheme[] = []

export const Default: Story = {
  render: (args) => <ThemeSwitcher {...args} onThemeChange={(next) => capturedThemes.push(next)} />,
  play: async ({ canvasElement }) => {
    capturedThemes.length = 0
    const button = getSwitcher(canvasElement)

    // Uncontrolled, seeded light: the accessible name announces the ACTION.
    if (button.getAttribute('aria-label') !== 'Switch to dark theme') {
      throw new Error(
        `Expected aria-label "Switch to dark theme" while light, got "${button.getAttribute('aria-label')}".`,
      )
    }
    if (button.getAttribute('data-mode') !== 'light') {
      throw new Error(`Expected data-mode="light", got "${button.getAttribute('data-mode')}".`)
    }
    if (!button.querySelector('svg[data-slot="icon"]')) {
      throw new Error('Expected a [data-slot="icon"] svg inside the switcher.')
    }
    // Deliberate omissions: no aria-pressed (mode switch, not a pressed
    // toggle) and no sr-only duplicate of the label (double announcement).
    if (button.hasAttribute('aria-pressed')) {
      throw new Error('Expected no aria-pressed — the flipping action label alone conveys state.')
    }
    if (button.textContent && button.textContent.trim() !== '') {
      throw new Error(
        `Expected no text content (the aria-label alone names the control), got "${button.textContent}".`,
      )
    }

    // Interactive: focusable, and a click flips everything and reports 'dark'.
    button.focus()
    if (document.activeElement !== button) {
      throw new Error('Expected the switcher to be focusable.')
    }
    button.click()

    await waitFor(
      () => button.getAttribute('aria-label') === 'Switch to light theme',
      'Expected the aria-label to flip to "Switch to light theme" after a click.',
    )
    if (button.getAttribute('data-mode') !== 'dark') {
      throw new Error(
        `Expected data-mode="dark" after a click, got "${button.getAttribute('data-mode')}".`,
      )
    }
    if (capturedThemes.join(',') !== 'dark') {
      throw new Error(
        `Expected onThemeChange to fire once with "dark", got [${capturedThemes.join(', ')}].`,
      )
    }
  },
}

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
      <span className='text-sm text-foreground'>
        App theme: <code data-demo='controlled-readout'>{theme}</code>
      </span>
    </div>
  )
}

export const Controlled: Story = {
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
  name: 'Button variants',
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

export const Playground: Story = {
  parameters: {
    controls: {
      expanded: false,
      sort: 'requiredFirst',
    },
  },
}

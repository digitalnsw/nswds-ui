/**
 * ThemeSwitcher — the story set, per docs/reference-storybook-standard.md.
 *
 *   Components/ThemeSwitcher        → this file: Docs, Default, Playground and
 *                                     one story per docs section
 *   Components/ThemeSwitcher/Tests  → theme-switcher.tests.stories.tsx
 *
 * The light/dark toggle button. Framework-free: the component only reports the
 * requested theme through `onThemeChange`; the app (next-themes, a class
 * toggle, anything) applies it. Clicking the switcher in these stories does
 * NOT restyle the canvas — Storybook's own toolbar toggle drives `.dark` via
 * addon-themes, and no provider connects this component to it.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { expect, fn } from 'storybook/test'

import { Header, HeaderActions, HeaderBrand } from './header.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'
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

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description={
        <>
          Every prop but <code>children</code> passes through to Button, so the switcher takes
          Button&apos;s <code>variant</code> and <code>color</code>. The default is a{' '}
          <code>surface</code> <code>grey</code> chip; match the other controls in the header it
          sits in.
        </>
      }
    >
      <Example code={`<ThemeSwitcher variant="ghost" />`}>
        <ExampleCell label='surface (default)'>
          <ThemeSwitcher />
        </ExampleCell>
        <ExampleCell label='ghost'>
          <ThemeSwitcher variant='ghost' />
        </ExampleCell>
        <ExampleCell label='outline primary'>
          <ThemeSwitcher variant='outline' color='primary' />
        </ExampleCell>
        <ExampleCell label='solid primary'>
          <ThemeSwitcher variant='solid' color='primary' />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description={
        <>
          The icon and the accessible name both describe where pressing will take you: a moon and
          &ldquo;Switch to dark theme&rdquo; while light, a sun and &ldquo;Switch to light
          theme&rdquo; while dark. There is deliberately no <code>aria-pressed</code> — a switch
          between two named modes is not a pressed or unpressed toggle.
        </>
      }
    >
      <Example code={`<ThemeSwitcher defaultTheme="dark" />`}>
        <ExampleCell label='light — “Switch to dark theme”'>
          <ThemeSwitcher defaultTheme='light' />
        </ExampleCell>
        <ExampleCell label='dark — “Switch to light theme”'>
          <ThemeSwitcher defaultTheme='dark' />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

/**
 * A stateful owner driving the `theme` prop. This is the shape every real app
 * uses — next-themes' `setTheme` slots in exactly where the useState setter
 * sits here.
 */
function ControlledDemo() {
  const [theme, setTheme] = React.useState<ThemeSwitcherTheme>('dark')
  return (
    <div className='flex items-center gap-3'>
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />
      <span className='text-base text-foreground'>
        App theme: <code>{theme}</code>
      </span>
    </div>
  )
}

function ControlledSection() {
  return (
    <ExampleSection
      title='Controlled'
      description={
        <>
          The switcher owns the button, not the theme. Pass <code>theme</code> and apply what{' '}
          <code>onThemeChange</code> reports — with next-themes, a class on the root, or anything
          else. There is no design-system <code>ThemeProvider</code>: theme plumbing is the
          app&apos;s. In these stories the switcher does not restyle the page; Storybook&apos;s
          toolbar owns the canvas theme.
        </>
      }
    >
      <Example code={nextThemesSnippet}>
        <ControlledDemo />
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='In the header actions, at the end of the row, where people look for site-wide settings.'
    >
      <Example layout='fill' className='max-sm:p-0 sm:p-0'>
        <Header sticky={false} shadow={false}>
          <HeaderBrand sitename='Digital NSW' />
          <HeaderActions>
            <ThemeSwitcher />
          </HeaderActions>
        </Header>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function ThemeSwitcherDocs() {
  return (
    <DocsPage
      title='ThemeSwitcher'
      npm='ThemeSwitcher'
      registry='theme-switcher'
      summary={
        <>
          An icon button that switches a site between light and dark themes. It owns the control
          only: <code>onThemeChange</code> reports the theme someone asked for, and your app applies
          it.
        </>
      }
    >
      <DocsUsage
        use={[
          'Letting people choose light or dark for a whole site, from the Header.',
          'A product whose theme your app already manages, such as with next-themes.',
          'Overriding the operating system preference for one site.',
        ]}
        avoid={[
          'Turning any other setting on or off — use Switch.',
          'Offering more than two themes, or a “match my device” option — use RadioGroup or Select.',
          'Changing the appearance of one part of a page — use Toggle.',
        ]}
      />
      <VariantsSection />
      <StatesSection />
      <ControlledSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/ThemeSwitcher',
  component: ThemeSwitcher,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: ThemeSwitcherDocs },
  },
  args: {
    defaultTheme: 'light',
    variant: 'surface',
    color: 'grey',
    size: 'icon',
    onThemeChange: fn(),
  },
  argTypes: {
    theme: {
      control: false,
      description:
        'Current theme (controlled). Left un-set in the playground — a controlled switcher with no owner updating it would appear frozen. See the Controlled story.',
      table: { category: 'Behavior' },
    },
    defaultTheme: {
      control: 'inline-radio',
      options: ['light', 'dark'],
      description: 'Initial theme when uncontrolled.',
      table: { category: 'Behavior' },
    },
    onThemeChange: {
      control: false,
      description: 'Called with the NEXT theme on every activation.',
      table: { category: 'Events' },
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
    'aria-label': {
      control: 'text',
      description:
        'Overrides the action-phrased name ("Switch to dark theme"). Leave unset unless translating.',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
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

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
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
    // onThemeChange fired exactly once, with the theme asked for.
    await expect(args.onThemeChange).toHaveBeenCalledTimes(1)
    await expect(args.onThemeChange).toHaveBeenCalledWith('dark')
  },
}

export const Playground: Story = {}

export const Variants: Story = { name: 'Variants', render: () => <VariantsSection /> }

export const States: Story = { name: 'States', render: () => <StatesSection /> }

export const Controlled: Story = { name: 'Controlled', render: () => <ControlledSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

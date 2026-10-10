/**
 * ThemeSwitcher — the story set, per docs/reference-storybook-standard.md.
 *
 *   Components/ThemeSwitcher               → this file: Docs, Default, Playground
 *   Components/ThemeSwitcher/Features      → theme-switcher.features.stories.tsx
 *   Components/ThemeSwitcher/Accessibility → theme-switcher.accessibility.stories.tsx
 *   Components/ThemeSwitcher/Tests         → theme-switcher.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
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
import {
  ThemeSwitcher,
  type ThemeSwitcherProps,
  type ThemeSwitcherTheme,
} from './theme-switcher.js'

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
// Each section is one part of the docs page AND one Features story.

const variantDocs = [
  ['surface', 'surface (default)', 'A tinted fill with a border — the nswds-app header chip.'],
  ['ghost', 'ghost', 'No fill or border until hovered, for a row of quiet header icons.'],
  ['outline', 'outline', 'Border only, beside other outlined controls.'],
  ['soft', 'soft', 'A tinted fill with no border.'],
  ['solid', 'solid', 'A full fill, where the switcher is the main action in its bar.'],
] as const

export function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description={
        <>
          Every prop but <code>children</code> passes through to Button, so the switcher takes
          Button&apos;s <code>variant</code>. The default is <code>surface</code>; match the other
          controls in the header it sits in.
        </>
      }
    >
      <Example code={`<ThemeSwitcher variant="ghost" />`}>
        {variantDocs.map(([variant, label]) => (
          <ExampleCell key={variant} label={label}>
            <ThemeSwitcher variant={variant} />
          </ExampleCell>
        ))}
      </Example>
      <dl className='grid gap-x-8 gap-y-3 text-base sm:grid-cols-2'>
        {variantDocs.map(([variant, , description]) => (
          <div key={variant} className='flex gap-3'>
            <dt className='w-20 shrink-0 font-semibold'>{variant}</dt>
            <dd className='text-muted-foreground'>{description}</dd>
          </div>
        ))}
      </dl>
    </ExampleSection>
  )
}

const colourVariants = ['surface', 'ghost', 'outline', 'solid'] as const

/** The variant names over the columns of the colour rows. */
function ColourHeader() {
  return (
    <div aria-hidden='true' className='flex items-center gap-3'>
      <span className='w-24 shrink-0' />
      {colourVariants.map((variant) => (
        <span key={variant} className='w-20 text-center text-base'>
          {variant}
        </span>
      ))}
    </div>
  )
}

/** One colour across the variants a header uses, under ColourHeader's labels. */
function ColourRow({ color }: { color: NonNullable<ThemeSwitcherProps['color']> }) {
  return (
    <div className='flex items-center gap-3'>
      <span className='w-24 shrink-0 text-base font-semibold'>{color}</span>
      {colourVariants.map((variant) => (
        <span key={variant} className='flex w-20 justify-center'>
          <ThemeSwitcher color={color} variant={variant} />
        </span>
      ))}
    </div>
  )
}

export function ColoursSection() {
  return (
    <ExampleSection
      title='Colours'
      description={
        <>
          <code>color</code> is Button&apos;s too, and maps to a role, not a hue. The default is{' '}
          <code>grey</code>. Each colour is shown across the variants a header usually uses.
        </>
      }
    >
      <div className='space-y-10'>
        <div className='space-y-4'>
          <div className='space-y-1'>
            <h3 className='text-lg font-semibold'>On light surfaces</h3>
            <p className='max-w-2xl text-base leading-relaxed text-muted-foreground'>
              <code>grey</code> for a neutral header control; <code>primary</code>,{' '}
              <code>tertiary</code> and <code>accent</code> to match brand-coloured actions beside
              it.
            </p>
          </div>
          <Example layout='stack' code={`<ThemeSwitcher color="primary" variant="outline" />`}>
            <ColourHeader />
            {(['grey', 'primary', 'tertiary', 'accent'] as const).map((color) => (
              <ColourRow key={color} color={color} />
            ))}
          </Example>
        </div>
        <div className='space-y-4'>
          <div className='space-y-1'>
            <h3 className='text-lg font-semibold'>On dark surfaces</h3>
            <p className='max-w-2xl text-base leading-relaxed text-muted-foreground'>
              <code>white</code> and <code>secondary</code> are made for a dark or brand-coloured
              header — their light treatments do not read on white. Shown here on the primary band.
            </p>
          </div>
          <Example
            layout='stack'
            surface='brand'
            code={`<ThemeSwitcher color="white" variant="ghost" />`}
          >
            <ColourHeader />
            {(['white', 'secondary'] as const).map((color) => (
              <ColourRow key={color} color={color} />
            ))}
          </Example>
        </div>
      </div>
    </ExampleSection>
  )
}

export function SizesSection() {
  return (
    <ExampleSection
      title='Sizes'
      description={
        <>
          The default is <code>size=&quot;icon&quot;</code>, Button&apos;s 40px chrome square. To
          sit level with text buttons beside it, add <code>iconOnly</code> and pick the same{' '}
          <code>size</code> step they use.
        </>
      }
    >
      <Example code={`<ThemeSwitcher size="default" iconOnly />`}>
        <ExampleCell label='icon (default)'>
          <ThemeSwitcher />
        </ExampleCell>
        {(['sm', 'default', 'lg'] as const).map((size) => (
          <ExampleCell key={size} label={`${size}, iconOnly`}>
            <ThemeSwitcher size={size} iconOnly />
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

export function StatesSection() {
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

export function ControlledSection() {
  return (
    <ExampleSection
      title='Controlled'
      description={
        <>
          The switcher owns the button, not the theme. Pass <code>theme</code> and apply what{' '}
          <code>onThemeChange</code> reports — with next-themes, a class on the root, or anything
          else. Without <code>theme</code> it keeps its own state, starting from{' '}
          <code>defaultTheme</code>.
        </>
      }
    >
      <Example
        code={`const [theme, setTheme] = useState<ThemeSwitcherTheme>('dark')

<ThemeSwitcher theme={theme} onThemeChange={setTheme} />`}
      >
        <ControlledDemo />
      </Example>
    </ExampleSection>
  )
}

export function WiringNextThemesSection() {
  return (
    <ExampleSection
      title='Wiring next-themes'
      description={
        <>
          The nswds-app source bundled next-themes and a mounted-gate; the design system cannot
          depend on a theming framework, so that plumbing moves to the app. There is also no DS{' '}
          <code>ThemeProvider</code> — the app&rsquo;s source merely re-exported next-themes&rsquo;.
          A typical Next.js wiring:
        </>
      }
    >
      <pre className='rounded-xl border border-border bg-background px-5 py-4 text-base leading-relaxed break-words whitespace-pre-wrap text-foreground'>
        <code>{nextThemesSnippet}</code>
      </pre>
    </ExampleSection>
  )
}

/** An uncontrolled switcher with its own name and mode written out beside it. */
function WatchedSwitcher() {
  const [theme, setTheme] = React.useState<ThemeSwitcherTheme>('light')
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <div className='flex flex-wrap items-center gap-6'>
      <ThemeSwitcher onThemeChange={setTheme} />
      <dl className='space-y-1 text-base'>
        <div className='flex gap-3'>
          <dt className='w-28 font-semibold'>aria-label</dt>
          <dd>
            <code>Switch to {next} theme</code>
          </dd>
        </div>
        <div className='flex gap-3'>
          <dt className='w-28 font-semibold'>data-mode</dt>
          <dd>
            <code>{theme}</code>
          </dd>
        </div>
      </dl>
    </div>
  )
}

export function InStorybookSection() {
  return (
    <ExampleSection
      title='In Storybook'
      description={
        <>
          Clicking the switcher in these stories does <strong>not</strong> change the canvas&rsquo;s
          theme: no provider is wired here. Storybook&rsquo;s toolbar toggle drives the{' '}
          <code>.dark</code> class via addon-themes. Watch the <code>aria-label</code>, icon and{' '}
          <code>data-mode</code> flip instead.
        </>
      }
    >
      <Example code={`<ThemeSwitcher onThemeChange={(theme) => console.log(theme)} />`}>
        <WatchedSwitcher />
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='In the header actions, at the end of the row, where people look for site-wide settings.'
    >
      <Example
        layout='fill'
        className='max-sm:p-0 sm:p-0'
        code={`<Header>
  <HeaderBrand sitename="Digital NSW" />
  <HeaderActions>
    <AppThemeSwitcher />
  </HeaderActions>
</Header>`}
      >
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
          An icon Button that toggles between light and dark themes. It owns the toggle affordance
          only — <code>onThemeChange</code> reports the requested theme and the app applies it. The{' '}
          <code>aria-label</code> announces the action (&ldquo;Switch to dark theme&rdquo;) and
          flips with each activation; there is deliberately no <code>aria-pressed</code>, because a
          mode switch between two named states is not a pressed/unpressed toggle.
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
      <ColoursSection />
      <SizesSection />
      <StatesSection />
      <ControlledSection />
      <WiringNextThemesSection />
      <InStorybookSection />
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
  excludeStories: /Section$/,
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

/**
 * SiteSearch — Tests
 *
 * Stories that prove something rather than show something: the Cmd/Ctrl-K
 * toggle, the empty state, custom trigger naming, the controlled veto
 * regression, the shared accessible name, the footer slot and the CSS check.
 * Hidden from the sidebar; run in the Vitest suite and Chromatic.
 *
 * NOTE: the panel renders through a portal — play() functions query `document`,
 * not `canvasElement`.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Button } from './button.js'
import { SiteSearch, type SiteSearchGroup, type SiteSearchItem } from './site-search.js'

const demoGroups: SiteSearchGroup[] = [
  {
    title: 'Getting started',
    items: [
      { title: 'Installation', href: '/getting-started/installation' },
      { title: 'Design tokens', href: '/getting-started/tokens', keywords: ['colour', 'theme'] },
    ],
  },
  {
    title: 'Components',
    items: [
      { title: 'Button', href: '/components/button' },
      { title: 'Header', href: '/components/header', keywords: ['navigation', 'banner'] },
      { title: 'Footer', href: '/components/footer', keywords: ['navigation'] },
    ],
  },
]

const meta = {
  title: 'Components/SiteSearch/Tests',
  component: SiteSearch,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    groups: demoGroups,
    // Typed noop — a bare `() => {}` would make TS infer the meta-level arg as
    // `() => void`, and per-story overrides would then need the intersection
    // of both signatures.
    onSelect: (() => {}) as (item: SiteSearchItem) => void,
    shortcut: false,
    placeholder: 'Type to search across the site...',
    emptyMessage: 'No results found.',
  },
} satisfies Meta<typeof SiteSearch>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Poll until `predicate` holds, so portal/transition state has time to settle. */
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

function getTrigger(canvasElement: HTMLElement) {
  const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="site-search-trigger"]')
  if (!trigger) {
    throw new Error('Could not find an element with [data-slot="site-search-trigger"].')
  }
  return trigger
}

/** The panel is portalled to the body — query document, not the canvas. */
function getPanel() {
  return document.querySelector<HTMLElement>('[data-slot="site-search-panel"]')
}

function getInput() {
  const input = document.querySelector<HTMLInputElement>('[data-slot="site-search-input"]')
  if (!input) {
    throw new Error('Could not find the [data-slot="site-search-input"] field.')
  }
  return input
}

/**
 * Set a React-controlled input's value the way a user would: through the
 * native setter (so React's value tracking notices) plus a bubbling `input`
 * event. Typing per-keystroke is unnecessary — the combobox filters on the
 * input event, which this fires exactly once.
 */
function typeIntoInput(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
  if (!setter) {
    throw new Error('Could not access the native HTMLInputElement value setter.')
  }
  setter.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

/**
 * Dispatch a keydown and report whether a handler claimed it. `SiteSearch`
 * calls `preventDefault()` on the chord it acts on, so the return value is a
 * reliable "this press was handled" signal — which lets a caller wait for a
 * listener to attach instead of assuming it already has.
 */
function pressKey(target: EventTarget, key: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init })
  target.dispatchEvent(event)
  return event.defaultPrevented
}

async function openPalette(canvasElement: HTMLElement) {
  getTrigger(canvasElement).click()
  await waitFor(() => getPanel() !== null, 'Expected the palette panel to open on trigger click.')
  await waitFor(
    () => document.activeElement === getInput(),
    'Expected the search input to receive focus when the palette opens.',
  )
}

async function closePalette() {
  const input = document.querySelector<HTMLInputElement>('[data-slot="site-search-input"]')
  if (input) {
    pressKey(input, 'Escape')
  }
  await waitFor(() => getPanel() === null, 'Expected Escape to close the palette.')
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Shortcut: Story = {
  name: 'Keyboard shortcut',
  args: {
    shortcut: true,
  },
  play: async () => {
    if (getPanel() !== null) {
      throw new Error('Expected the palette to start closed.')
    }

    // Ctrl-K on the document opens…
    //
    // The listener is attached in an effect, and on a cold production build
    // that effect can flush after the trigger is already in the DOM — a single
    // dispatch then lands on nothing, so this passed in dev and failed in the
    // built Storybook Chromatic snapshots. Retry until a press is actually
    // claimed, then stop: the chord toggles, so pressing again once it has
    // landed would close the palette we just opened.
    await waitFor(
      () => pressKey(document, 'k', { ctrlKey: true }),
      'Expected the Ctrl-K listener to attach.',
    )
    await waitFor(() => getPanel() !== null, 'Expected Ctrl-K to open the palette.')

    // …and the same chord toggles it closed again, per the nswds-app source.
    pressKey(document, 'k', { ctrlKey: true })
    await waitFor(() => getPanel() === null, 'Expected a second Ctrl-K to close the palette.')
  },
}

export const EmptyState: Story = {
  name: 'Empty state',
  args: {
    emptyMessage: 'Nothing matches that search.',
  },
  play: async ({ canvasElement }) => {
    await openPalette(canvasElement)

    typeIntoInput(getInput(), 'xyzzy')
    await waitFor(
      () => document.querySelectorAll('[data-slot="site-search-item"]').length === 0,
      'Expected no items to match "xyzzy".',
    )
    await waitFor(() => {
      const empty = document.querySelector('[data-slot="site-search-empty"]')
      return empty?.textContent === 'Nothing matches that search.'
    }, 'Expected the empty state to announce the configured message.')

    await closePalette()
  },
}

export const CustomTrigger: Story = {
  name: 'Custom trigger',
  args: {
    // A text trigger is the composable path — the element owns its accessible
    // name. `label` still names the panel and input, but must NOT reach here.
    label: 'Search documentation',
    trigger: (
      <Button variant='outline' color='primary'>
        Search this site
      </Button>
    ),
  },
  play: async ({ canvasElement }) => {
    const trigger = getTrigger(canvasElement)
    if (trigger.dataset.slot !== 'site-search-trigger') {
      throw new Error('Expected the custom trigger element to carry the trigger data-slot.')
    }
    if (!trigger.textContent?.includes('Search this site')) {
      throw new Error('Expected the custom trigger element to render its own label.')
    }
    if (trigger.getAttribute('aria-haspopup') !== 'dialog') {
      throw new Error('Expected the custom trigger to inherit the dialog trigger ARIA.')
    }
    // The default icon button's `aria-label={label}` must not be applied to a
    // custom trigger — doing so would replace "Search this site" as the
    // accessible name (WCAG 2.2, 2.5.3 Label in Name).
    if (trigger.hasAttribute('aria-label')) {
      throw new Error(
        `Expected no aria-label on the custom trigger, got "${trigger.getAttribute('aria-label')}".`,
      )
    }

    await openPalette(canvasElement)
    if (getPanel()!.getAttribute('aria-label') !== 'Search documentation') {
      throw new Error('Expected `label` to still name the panel when a custom trigger is passed.')
    }
    await closePalette()
  },
}

// ─── Controlled veto ──────────────────────────────────────────────────────────

// Module-level channel between the veto harness and its play(): the harness
// records every open-change request, and `veto.released` decides whether it
// applies them — a stand-in for a parent with its own "may I close?" logic.
const vetoLog: boolean[] = []
const veto = { released: false }

function VetoHarness() {
  const [open, setOpen] = React.useState(true)
  return (
    <SiteSearch
      groups={demoGroups}
      onSelect={() => {}}
      shortcut={false}
      open={open}
      onOpenChange={(next) => {
        vetoLog.push(next)
        if (veto.released) {
          setOpen(next)
        }
      }}
    />
  )
}

export const ControlledVeto: Story = {
  name: 'Controlled veto',
  render: () => <VetoHarness />,
  play: async () => {
    vetoLog.length = 0
    veto.released = false

    await waitFor(() => getPanel() !== null, 'Expected the controlled palette to start open.')
    await waitFor(
      () => document.activeElement === getInput(),
      'Expected the search input to receive focus when the palette opens.',
    )

    // First Escape: the parent vetoes — the request is recorded but not
    // applied, so the palette stays open and no re-render happens.
    pressKey(getInput(), 'Escape')
    await waitFor(() => vetoLog.length > 0, 'Expected the first Escape to request a close.')
    if (vetoLog.some((requested) => requested !== false)) {
      throw new Error(`Expected only close requests, got [${vetoLog.join(', ')}].`)
    }
    if (getPanel() === null) {
      throw new Error('Expected the vetoing parent to keep the palette open.')
    }
    const afterFirstEscape = vetoLog.length

    // Second Escape: the regression this story pins. An optimistic openRef
    // write used to make the component believe it was already closed, so a
    // vetoed close permanently swallowed every later identical request.
    pressKey(getInput(), 'Escape')
    await waitFor(
      () => vetoLog.length > afterFirstEscape,
      'Expected a second Escape to reach onOpenChange again after a vetoed close.',
    )
    if (getPanel() === null) {
      throw new Error('Expected the still-vetoing parent to keep the palette open.')
    }

    // Release the veto: the next request applies and the palette closes.
    veto.released = true
    pressKey(getInput(), 'Escape')
    await waitFor(() => getPanel() === null, 'Expected the close to apply once the veto lifted.')
  },
}

export const CustomLabel: Story = {
  name: 'Custom accessible name',
  args: {
    label: 'Search documentation',
  },
  play: async ({ canvasElement }) => {
    // One `label` prop names all three surfaces: the default trigger, the
    // dialog panel and the combobox input.
    const trigger = getTrigger(canvasElement)
    if (trigger.getAttribute('aria-label') !== 'Search documentation') {
      throw new Error(
        `Expected the default trigger to carry the custom label, got "${trigger.getAttribute('aria-label')}".`,
      )
    }

    await openPalette(canvasElement)
    if (getPanel()!.getAttribute('aria-label') !== 'Search documentation') {
      throw new Error(
        `Expected the panel to carry the custom label, got "${getPanel()!.getAttribute('aria-label')}".`,
      )
    }
    if (getInput().getAttribute('aria-label') !== 'Search documentation') {
      throw new Error(
        `Expected the input to carry the custom label, got "${getInput().getAttribute('aria-label')}".`,
      )
    }
    await closePalette()
  },
}

export const WithFooter: Story = {
  name: 'With footer hint',
  args: {
    children: (
      <span>
        Press <kbd className='font-mono'>Esc</kbd> to close, <kbd className='font-mono'>↵</kbd> to
        open the highlighted page.
      </span>
    ),
  },
  play: async ({ canvasElement }) => {
    await openPalette(canvasElement)
    const footer = document.querySelector('[data-slot="site-search-footer"]')
    if (!footer) {
      throw new Error('Expected children to render in a [data-slot="site-search-footer"] region.')
    }
    await closePalette()
  },
}

export const CssCheck: Story = {
  name: 'CSS Check',
  play: async ({ canvasElement }) => {
    await openPalette(canvasElement)

    // Proves globals.css is loaded: the panel's bg-popover resolves to a real,
    // non-transparent colour, and result rows honour the 44px minimum target.
    const panel = getPanel()!
    const styles = getComputedStyle(panel)
    if (styles.backgroundColor === '' || styles.backgroundColor === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected bg-popover to resolve to a visible colour, got "${styles.backgroundColor}". Is globals.css loaded?`,
      )
    }

    // Wait for the entry animation to finish before measuring: the panel
    // scales in from 95% (data-starting-style:scale-95), and a mid-animation
    // getBoundingClientRect reports the scaled size (44px × 0.95 = 41.8px).
    // Tailwind v4's scale-95 sets the standalone `scale` property — NOT
    // `transform`, which reads "none" throughout — so poll `scale`.
    await waitFor(() => {
      const scale = getComputedStyle(getPanel()!).scale
      return scale === 'none' || scale === '1'
    }, 'Expected the panel entry animation to settle before measuring.')

    const item = document.querySelector<HTMLElement>('[data-slot="site-search-item"]')
    if (!item) {
      throw new Error('Expected at least one result row to render.')
    }
    // Sub-pixel tolerance: `scale` serialises as "1" once it rounds there, so
    // the poll above can clear while the composited value is still a hair
    // under (44 × 0.99999965 = 43.99998), which failed this intermittently in
    // the built Storybook. The assertion is about the 44px target size, not
    // float-exactness.
    const height = item.getBoundingClientRect().height
    if (height < 44 - 0.05) {
      throw new Error(`Expected result rows to be at least 44px tall, got ${height}px.`)
    }

    await closePalette()
  },
}

/**
 * SiteSearch — Default + Shortcut + Empty + Custom trigger + Controlled veto
 * + Custom label + CssCheck
 *
 * Cmd/Ctrl-K command-palette site search: a centred modal panel with a
 * filter-as-you-type input over grouped destinations. Selection is handed to
 * the app via `onSelect`; the component never navigates itself.
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
  title: 'Components/SiteSearch',
  component: SiteSearch,
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
            <h1 className='text-4xl font-bold tracking-normal'>SiteSearch</h1>
            <p className='text-base text-muted-foreground'>
              A command-palette search over the site map: a trigger (or{' '}
              <kbd className='rounded-sm border border-foreground/20 px-1 font-mono text-sm'>
                ⌘K
              </kbd>
              ) opens a centred modal panel whose input filters titled groups of destinations as you
              type. Choosing a result calls <code>onSelect</code> with the item — navigation stays
              in the app (call your router there), keeping the design system framework-free.
            </p>
          </section>

          <section className='space-y-3'>
            <h2 className='text-2xl font-bold tracking-normal'>Accessibility</h2>
            <p className='text-base text-muted-foreground'>
              The panel is a Base UI Dialog (focus trap, Escape, backdrop dismissal, focus restore);
              the search itself is a Base UI Autocomplete rendered inline within it, so the input is
              announced as a combobox, arrow keys move the highlight while focus stays in the field,
              and Enter activates the highlighted result. Result rows are at least 44px tall.
            </p>
          </section>
        </div>
      ),
      description: {
        component:
          'Cmd/Ctrl-K command-palette site search: a modal panel filtering grouped destinations by title and keywords, handing the chosen item to the app via onSelect.',
      },
    },
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
  argTypes: {
    groups: {
      description: 'The searchable site map — titled groups of { title, href, keywords? } items.',
      table: { category: 'Content' },
    },
    onSelect: {
      description:
        'Called with the chosen item after the palette closes. Do your navigation here (e.g. router.push(item.href)).',
      table: { category: 'Behaviour' },
    },
    shortcut: {
      control: 'boolean',
      description:
        'Wire the global Cmd/Ctrl-K toggle on document. Off in these stories (except Shortcut) so multiple mounted instances on the docs page do not all toggle at once.',
      table: { category: 'Behaviour' },
    },
    open: {
      control: false,
      description: 'Controlled open state.',
      table: { category: 'Behaviour' },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Uncontrolled initial open state.',
      table: { category: 'Behaviour' },
    },
    onOpenChange: {
      table: { disable: true, category: 'Behaviour' },
    },
    label: {
      control: 'text',
      description:
        'Accessible name for the palette — the dialog panel, the input and the default trigger. Localise it rather than shipping English.',
      table: { category: 'Content' },
    },
    placeholder: {
      control: 'text',
      table: { category: 'Content' },
    },
    emptyMessage: {
      control: 'text',
      table: { category: 'Content' },
    },
    trigger: {
      table: { disable: true, category: 'Content' },
    },
    children: {
      table: { disable: true, category: 'Content' },
    },
    className: {
      table: { disable: true, category: 'Advanced' },
    },
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

function pressKey(target: EventTarget, key: string, init: KeyboardEventInit = {}) {
  target.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }),
  )
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

const selections: SiteSearchItem[] = []

export const Default: Story = {
  args: {
    onSelect: (item) => {
      selections.push(item)
    },
  },
  play: async ({ canvasElement }) => {
    selections.length = 0

    // The trigger is an icon-only button with an accessible name.
    const trigger = getTrigger(canvasElement)
    if (trigger.getAttribute('aria-haspopup') !== 'dialog') {
      throw new Error('Expected the trigger to advertise aria-haspopup="dialog".')
    }
    if (!trigger.getAttribute('aria-label')) {
      throw new Error('Expected the default trigger to carry an aria-label.')
    }

    await openPalette(canvasElement)

    // The input is a combobox controlling the results listbox.
    const input = getInput()
    if (input.getAttribute('role') !== 'combobox') {
      throw new Error(
        `Expected the search input to have role="combobox", got "${input.getAttribute('role')}".`,
      )
    }

    // Unfiltered: both groups and all five items render.
    await waitFor(
      () => document.querySelectorAll('[data-slot="site-search-item"]').length === 5,
      'Expected all 5 items to render before filtering.',
    )

    // Type to filter: "head" matches only the Header item (title match), so the
    // whole "Getting started" group must disappear, heading included.
    typeIntoInput(input, 'head')
    await waitFor(() => {
      const items = document.querySelectorAll('[data-slot="site-search-item"]')
      return items.length === 1 && items[0]!.textContent === 'Header'
    }, 'Expected filtering by "head" to leave exactly the "Header" item.')
    const labels = Array.from(
      document.querySelectorAll('[data-slot="site-search-group-label"]'),
      (label) => label.textContent,
    )
    if (labels.includes('Getting started')) {
      throw new Error('Expected the non-matching "Getting started" group to be hidden.')
    }

    // Keyboard select: highlight the match, press Enter — onSelect receives the
    // item and the palette closes.
    pressKey(input, 'ArrowDown')
    await waitFor(
      () => document.querySelector('[data-slot="site-search-item"][data-highlighted]') !== null,
      'Expected ArrowDown to highlight the matching item.',
    )
    pressKey(input, 'Enter')
    await waitFor(
      () => selections.length === 1,
      'Expected Enter on the highlighted item to call onSelect once.',
    )
    if (selections[0]!.href !== '/components/header') {
      throw new Error(`Expected onSelect to receive the Header item, got "${selections[0]!.href}".`)
    }
    await waitFor(() => getPanel() === null, 'Expected the palette to close after selection.')
  },
}

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
    pressKey(document, 'k', { ctrlKey: true })
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
    trigger: (
      <Button variant='outline' color='primary'>
        Search this site
      </Button>
    ),
  },
  play: async ({ canvasElement }) => {
    const trigger = getTrigger(canvasElement)
    if (!trigger.textContent?.includes('Search this site')) {
      throw new Error('Expected the custom trigger element to render its own label.')
    }
    if (trigger.getAttribute('aria-haspopup') !== 'dialog') {
      throw new Error('Expected the custom trigger to inherit the dialog trigger ARIA.')
    }

    await openPalette(canvasElement)
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
    if (item.getBoundingClientRect().height < 44) {
      throw new Error(
        `Expected result rows to be at least 44px tall, got ${item.getBoundingClientRect().height}px.`,
      )
    }

    await closePalette()
  },
}

export const Playground: Story = {
  name: 'Playground',
  parameters: {
    controls: {
      expanded: false,
      sort: 'requiredFirst',
    },
  },
}

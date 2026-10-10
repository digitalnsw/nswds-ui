/**
 * SiteSearch — the story set, per docs/reference-storybook-standard.md.
 *
 *   Components/SiteSearch               → this file: Docs, Default, Playground
 *   Components/SiteSearch/Features      → site-search.features.stories.tsx
 *   Components/SiteSearch/Accessibility → site-search.accessibility.stories.tsx
 *   Components/SiteSearch/Tests         → site-search.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 *
 * Cmd/Ctrl-K command-palette site search: a centred modal panel with a
 * filter-as-you-type input over grouped destinations. Selection is handed to
 * the app via `onSelect`; the component never navigates itself.
 *
 * NOTE: the panel renders through a portal — play() functions query `document`,
 * not `canvasElement`.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { IconSearch } from '../icons/search.js'
import { Button } from './button.js'
import { Header, HeaderActions, HeaderBrand } from './header.js'
import { Kbd, KbdGroup } from './kbd.js'
import { SiteSearch, type SiteSearchGroup, type SiteSearchItem } from './site-search.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

/** The site map Default and Playground search — Default's play() filters it. */
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

/** A service site map for the examples. */
const serviceGroups: SiteSearchGroup[] = [
  {
    title: 'Driving and transport',
    items: [
      {
        title: 'Renew a driver licence',
        href: '/driving/renew-licence',
        keywords: ['license', 'car'],
      },
      { title: 'Pay a fine', href: '/fines/pay', keywords: ['penalty', 'infringement'] },
      { title: 'Check a vehicle registration', href: '/vehicles/rego-check', keywords: ['rego'] },
    ],
  },
  {
    title: 'Births, deaths and marriages',
    items: [
      { title: 'Order a birth certificate', href: '/bdm/birth-certificate' },
      { title: 'Register a marriage', href: '/bdm/marriage', keywords: ['wedding'] },
    ],
  },
  {
    title: 'Business',
    items: [
      { title: 'Apply for a liquor licence', href: '/business/liquor-licence' },
      { title: 'Find a grant', href: '/business/grants', keywords: ['funding'] },
    ],
  },
]

const noop = () => {}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function TriggersSection() {
  return (
    <ExampleSection
      title='Triggers'
      description={
        <>
          By default the trigger is a ghost icon button named by <code>label</code>. Pass{' '}
          <code>trigger</code> to use your own element — it inherits the dialog-opening behaviour
          and owns its accessible name, so <code>label</code> is not applied to it. Pass{' '}
          <code>null</code> for no trigger at all.
        </>
      }
    >
      <Example
        code={`<SiteSearch
  groups={groups}
  onSelect={(item) => router.push(item.href)}
  trigger={<Button variant="outline">Search this site</Button>}
/>`}
      >
        <ExampleCell label='default'>
          <SiteSearch groups={serviceGroups} onSelect={noop} shortcut={false} />
        </ExampleCell>
        <ExampleCell label='custom trigger'>
          <SiteSearch
            groups={serviceGroups}
            onSelect={noop}
            shortcut={false}
            trigger={
              <Button variant='outline' leadingVisual={IconSearch}>
                Search this site
              </Button>
            }
          />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function ResultsSection() {
  return (
    <ExampleSection
      title='Results'
      description={
        <>
          <code>groups</code> is the site map: titled groups of <code>title</code>,{' '}
          <code>href</code> and optional <code>keywords</code>. Typing matches titles and keywords,
          and drops any group left empty. Choosing a result closes the palette and calls{' '}
          <code>onSelect</code> with the item — navigate there with your own router. Open it and try
          &ldquo;rego&rdquo;.
        </>
      }
    >
      <Example
        code={`const groups = [
  {
    title: 'Driving and transport',
    items: [
      { title: 'Renew a driver licence', href: '/driving/renew-licence', keywords: ['license'] },
      { title: 'Check a vehicle registration', href: '/vehicles/rego-check', keywords: ['rego'] },
    ],
  },
]`}
      >
        <SiteSearch
          groups={serviceGroups}
          onSelect={noop}
          shortcut={false}
          placeholder='Search services'
          emptyMessage='No services match that search.'
          trigger={<Button variant='outline'>Open the palette</Button>}
        />
      </Example>
    </ExampleSection>
  )
}

export function KeyboardShortcutSection() {
  return (
    <ExampleSection
      title='Keyboard shortcut'
      description={
        <>
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>{' '}
          (or{' '}
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
          ) opens and closes the palette from anywhere on the page. It is on by default; mount only
          one SiteSearch with <code>shortcut</code> on per page, or one press toggles them all. Show
          the shortcut in a custom trigger so people can find it.
        </>
      }
    >
      <Example
        code={`<SiteSearch
  groups={groups}
  onSelect={onSelect}
  trigger={
    <Button variant="outline" leadingVisual={IconSearch}>
      Search <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
    </Button>
  }
/>`}
      >
        <SiteSearch
          groups={serviceGroups}
          onSelect={noop}
          shortcut={false}
          trigger={
            <Button variant='outline' leadingVisual={IconSearch}>
              Search{' '}
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </Button>
          }
        />
      </Example>
    </ExampleSection>
  )
}

export function LabelsAndMessagesSection() {
  return (
    <ExampleSection
      title='Labels and messages'
      description={
        <>
          <code>label</code> names the panel, the input and the default trigger — say what is being
          searched, and translate it rather than shipping English. <code>placeholder</code> and{' '}
          <code>emptyMessage</code> set the field&apos;s hint and the line shown when nothing
          matches. Anything passed as <code>children</code> sits in a footer under the results, for
          a hint such as how to close. Open it and search for &ldquo;passport&rdquo;.
        </>
      }
    >
      <Example
        code={`<SiteSearch
  groups={groups}
  onSelect={onSelect}
  label="Search Service NSW"
  placeholder="Search services"
  emptyMessage="No services match that search. Try another word."
>
  Press <Kbd>Esc</Kbd> to close.
</SiteSearch>`}
      >
        <SiteSearch
          groups={serviceGroups}
          onSelect={noop}
          shortcut={false}
          label='Search Service NSW'
          placeholder='Search services'
          emptyMessage='No services match that search. Try another word.'
          trigger={<Button variant='outline'>Search Service NSW</Button>}
        >
          <span>
            Press <Kbd>Esc</Kbd> to close.
          </span>
        </SiteSearch>
      </Example>
    </ExampleSection>
  )
}

export function AccessibilitySection() {
  return (
    <ExampleSection
      title='Accessibility'
      description={
        <>
          The panel is a Base UI Dialog (focus trap, Escape, backdrop dismissal, focus restore); the
          search itself is a Base UI Autocomplete rendered inline within it, so the input is
          announced as a combobox, arrow keys move the highlight while focus stays in the field, and
          Enter activates the highlighted result. Result rows are at least 44px tall.
        </>
      }
    >
      <Example
        code={`<SiteSearch groups={groups} onSelect={onSelect} label="Search Service NSW" />`}
      >
        <ExampleCell label='Tab here and press Enter, then use the arrow keys'>
          <SiteSearch
            groups={serviceGroups}
            onSelect={noop}
            shortcut={false}
            label='Search Service NSW'
          />
        </ExampleCell>
      </Example>
      <p className='max-w-2xl text-base leading-relaxed text-muted-foreground'>
        Name, Role, Value (4.1.2), Keyboard (2.1.1), Focus Order (2.4.3), Status Messages (4.1.3)
        and Target Size (2.5.8 and 2.5.5) are each asserted in the{' '}
        <strong className='font-semibold text-foreground'>Accessibility</strong> stories under this
        component.
      </p>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='In the header actions of a service site, with the shortcut on. The panel opens centred over the page, whatever the width.'
    >
      <Example
        layout='fill'
        className='max-sm:p-0 sm:p-0'
        code={`<Header>
  <HeaderBrand sitename="Service NSW" />
  <HeaderActions>
    <SiteSearch groups={groups} onSelect={onSelect} label="Search Service NSW" />
  </HeaderActions>
</Header>`}
      >
        <Header sticky={false} shadow={false}>
          <HeaderBrand sitename='Service NSW' />
          <HeaderActions>
            <SiteSearch
              groups={serviceGroups}
              onSelect={noop}
              label='Search Service NSW'
              placeholder='Search services'
            >
              <span>
                Press <Kbd>Esc</Kbd> to close.
              </span>
            </SiteSearch>
          </HeaderActions>
        </Header>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function SiteSearchDocs() {
  return (
    <DocsPage
      title='SiteSearch'
      npm='SiteSearch'
      registry='site-search'
      summary={
        <>
          A command-palette search over the site map: a trigger (or{' '}
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
          ) opens a centred modal panel whose input filters titled groups of destinations as you
          type. Choosing a result calls <code>onSelect</code> with the item — navigation stays in
          the app (call your router there), keeping the design system framework-free.
        </>
      }
    >
      <DocsUsage
        use={[
          'Jumping straight to a known page on a large site, such as a service or a form.',
          'A keyboard-first search across a fixed site map, opened from anywhere with ⌘K.',
          'A compact search entry in the Header that opens a full panel on demand.',
        ]}
        avoid={[
          'Full-text search across page content that needs a results page — use ExpandableSearch or an InputGroup that submits.',
          'Filtering a list already on the page — use Input.',
          'Choosing a value for a form field — use Combobox.',
        ]}
      />
      <TriggersSection />
      <ResultsSection />
      <KeyboardShortcutSection />
      <LabelsAndMessagesSection />
      <InContextSection />
      <AccessibilitySection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/SiteSearch',
  component: SiteSearch,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: SiteSearchDocs },
  },
  args: {
    groups: demoGroups,
    onSelect: fn() as (item: SiteSearchItem) => void,
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
      table: { category: 'Events' },
    },
    shortcut: {
      control: 'boolean',
      description:
        'Wire the global Cmd/Ctrl-K toggle on document. Off in these stories (except In context) so several mounted instances do not all toggle at once.',
      table: { category: 'Behavior' },
    },
    open: {
      control: false,
      description: 'Controlled open state.',
      table: { category: 'Behavior' },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Uncontrolled initial open state.',
      table: { category: 'Behavior' },
    },
    onOpenChange: {
      description: 'Called whenever the palette asks to open or close.',
      table: { category: 'Events' },
    },
    label: {
      control: 'text',
      description:
        'Accessible name for the palette — the dialog panel, the input and the default trigger. Localise it rather than shipping English.',
      table: { category: 'Accessibility' },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder for the search input.',
      table: { category: 'Content' },
    },
    emptyMessage: {
      control: 'text',
      description: 'Message shown when no items match the query.',
      table: { category: 'Content' },
    },
    trigger: {
      control: false,
      description: 'The element that opens the palette, or null for none.',
      table: { category: 'Content' },
    },
    children: {
      control: false,
      description: 'Content at the foot of the panel, such as shortcut hints.',
      table: { category: 'Content' },
    },
    className: { table: { disable: true } },
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

/** Dispatch a keydown and report whether a handler claimed it. */
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

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    // The meta's onSelect is a spy, reset by Storybook before each run.
    const onSelect = args.onSelect as unknown as ReturnType<typeof fn>

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
      () => onSelect.mock.calls.length === 1,
      'Expected Enter on the highlighted item to call onSelect once.',
    )
    const selected = onSelect.mock.calls[0]![0] as SiteSearchItem
    if (selected.href !== '/components/header') {
      throw new Error(`Expected onSelect to receive the Header item, got "${selected.href}".`)
    }
    await waitFor(() => getPanel() === null, 'Expected the palette to close after selection.')
  },
}

export const Playground: Story = {}

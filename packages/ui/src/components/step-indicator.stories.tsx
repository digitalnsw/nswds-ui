/**
 * StepIndicator — Default + AllStatuses + DefaultFallback + Current + StepNav
 * + CssCheck
 *
 * Vertical journey progress list: one link per step with a status marker and
 * connector line, plus the sectioned StepNav shell (heading + indicator per
 * section inside a named nav landmark).
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { StepIndicator, StepNav, type Step, type StepStatus } from './step-indicator.js'

const journeySteps: Step[] = [
  {
    title: 'Your details',
    description: 'Name and contact information',
    href: '#your-details',
    status: 'completed',
  },
  { title: 'Eligibility', href: '#eligibility', status: 'saved' },
  {
    title: 'Documents',
    description: 'Upload supporting evidence',
    href: '#documents',
    status: 'in-progress',
  },
  { title: 'Review', href: '#review', status: 'not-started' },
  { title: 'Payment', href: '#payment', status: 'cannot-start' },
]

const allStatuses: StepStatus[] = [
  'default',
  'not-started',
  'in-progress',
  'completed',
  'saved',
  'error',
  'cannot-start',
]

// The 'default' entry omits the `status` key rather than setting it: 'default'
// is what the component's `step.status ?? 'default'` fallback resolves to, so
// setting it explicitly here would leave that fallback unexercised — and would
// make the label a claim the data contradicts.
const allStatusSteps: Step[] = allStatuses.map((status) =>
  status === 'default'
    ? { title: 'default (status omitted)', href: `#status-${status}` }
    : { title: status, href: `#status-${status}`, status },
)

// Rendered side by side so the omitted-status step can be compared against a
// real explicit-'default' step (see the DefaultFallback story).
const defaultFallbackSteps: Step[] = [
  { title: 'Status omitted', href: '#fallback-omitted' },
  { title: 'Status set to default', href: '#fallback-explicit', status: 'default' },
]

function getIndicator(canvasElement: HTMLElement): HTMLElement {
  const list = canvasElement.querySelector<HTMLElement>('[data-slot="step-indicator"]')
  if (!list) {
    throw new Error('Expected an <ol data-slot="step-indicator"> to have rendered.')
  }
  return list
}

const meta = {
  title: 'Components/StepIndicator',
  component: StepIndicator,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        <div className='max-w-3xl space-y-8 p-6 text-foreground'>
          <section className='space-y-3'>
            <h1 className='text-4xl font-bold tracking-normal'>Step indicator</h1>
            <p className='text-base text-muted-foreground'>
              A vertical list of the steps in a multi-step journey — one link per step, with a
              status marker, a connector line, and an emphasised treatment for the step being
              viewed. Pass status as data on each step; compare <code>currentHref</code> against
              step hrefs to mark the current page. <code>StepNav</code> wraps one indicator per
              titled section in a named <code>nav</code> landmark.
            </p>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Statuses</h2>
            <p className='text-base text-muted-foreground'>
              Seven statuses, one visual map: solid discs for completed / error / cannot-start,
              outlined discs that fill on hover for saved / in-progress, and a hover dot for steps
              not yet begun. Status is also announced to screen readers as a visually-hidden suffix
              — override the wording (or suppress it) via <code>statusLabels</code>.
            </p>
            <div className='max-w-xs'>
              <StepIndicator steps={allStatusSteps} />
            </div>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Current step</h2>
            <p className='text-base text-muted-foreground'>
              The step whose <code>href</code> matches <code>currentHref</code> gets{' '}
              <code>aria-current=&quot;step&quot;</code>. An in-progress current step is emphasised
              with a double ring; a not-yet-started current step gets a filled dot and the primary
              ink.
            </p>
            <div className='max-w-xs'>
              <StepIndicator steps={journeySteps} currentHref='#documents' />
            </div>
          </section>
        </div>
      ),
      description: {
        component:
          'Vertical journey progress list with seven data-driven step statuses, aria-current tracking and a sectioned StepNav shell.',
      },
    },
  },
  args: {
    steps: journeySteps,
  },
  argTypes: {
    steps: {
      control: 'object',
      description:
        'Steps in journey order. Each step: title, optional description, unique href, optional status (default | not-started | in-progress | completed | saved | error | cannot-start).',
      table: { category: 'Content' },
    },
    currentHref: {
      control: 'text',
      description:
        'href of the page being viewed. The matching step gets aria-current="step" and, for default / not-started / in-progress statuses, the emphasised current treatment.',
      table: { category: 'State' },
    },
    onNavigate: {
      control: false,
      description:
        'Click handler applied to every enabled step link (cannot-start steps are click-inert).',
      table: { category: 'Behaviour' },
    },
    statusLabels: {
      control: 'object',
      description:
        'Visually-hidden status announcements merged over the English defaults — supply strings to localise, or undefined to suppress a status.',
      table: { category: 'Localisation' },
    },
    className: {
      control: false,
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof StepIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    currentHref: '#documents',
    onNavigate: (event) => {
      // Storybook-only: prove the handler fired without navigating the
      // test iframe. Real apps receive the untouched click event.
      event.preventDefault()
      event.currentTarget.setAttribute('data-story-clicked', 'true')
    },
  },
  play: async ({ canvasElement }) => {
    const list = getIndicator(canvasElement)
    if (list.tagName !== 'OL') {
      throw new Error(
        `Expected the step list to be an <ol> (steps are a sequence), got <${list.tagName.toLowerCase()}>.`,
      )
    }

    const links = list.querySelectorAll<HTMLAnchorElement>('[data-slot="step-link"]')
    if (links.length !== journeySteps.length) {
      throw new Error(`Expected ${journeySteps.length} step links, found ${links.length}.`)
    }

    const first = links[0]!
    first.click()
    if (first.getAttribute('data-story-clicked') !== 'true') {
      throw new Error('Expected clicking an enabled step link to fire onNavigate.')
    }

    first.focus()
    if (document.activeElement !== first) {
      throw new Error('Expected an enabled step link to be keyboard-focusable.')
    }
  },
}

export const AllStatuses: Story = {
  name: 'All statuses',
  args: {
    steps: allStatusSteps,
  },
  play: async ({ canvasElement }) => {
    const list = getIndicator(canvasElement)

    for (const status of ['completed', 'saved', 'in-progress', 'error', 'cannot-start']) {
      const icon = list.querySelector(`[data-status="${status}"] [data-slot="step-marker"] svg`)
      if (!icon) {
        throw new Error(`Expected the "${status}" marker to render an icon glyph.`)
      }
    }

    for (const status of ['default', 'not-started']) {
      const item = list.querySelector(`[data-status="${status}"]`)
      if (!item) {
        throw new Error(`Expected a list item for the "${status}" status.`)
      }
      if (item.querySelector('[data-slot="step-marker"] svg')) {
        throw new Error(`Expected the "${status}" marker to be icon-free (hover dot only).`)
      }
    }

    const cannotStart = list.querySelector<HTMLAnchorElement>(
      '[data-status="cannot-start"] [data-slot="step-link"]',
    )
    if (!cannotStart) {
      throw new Error('Expected a link for the cannot-start step.')
    }
    if (cannotStart.getAttribute('aria-disabled') !== 'true') {
      throw new Error('Expected the cannot-start step link to carry aria-disabled="true".')
    }
    if (cannotStart.tabIndex !== -1) {
      throw new Error('Expected the cannot-start step link to be removed from the tab order.')
    }
    if (getComputedStyle(cannotStart).pointerEvents !== 'none') {
      throw new Error(
        'Expected the cannot-start step link to be click-inert (pointer-events: none).',
      )
    }

    // Connectors: one between each adjacent pair, none after the last step.
    const connectors = list.querySelectorAll('[data-slot="step-connector"]')
    if (connectors.length !== allStatusSteps.length - 1) {
      throw new Error(
        `Expected ${allStatusSteps.length - 1} connectors (none on the last step), found ${connectors.length}.`,
      )
    }
  },
}

export const DefaultFallback: Story = {
  name: 'Omitted status',
  args: {
    steps: defaultFallbackSteps,
  },
  play: async ({ canvasElement }) => {
    const list = getIndicator(canvasElement)
    const items = list.querySelectorAll<HTMLElement>('[data-slot="step"]')
    const [omitted, explicit] = [items[0], items[1]]
    if (!omitted || !explicit) {
      throw new Error(`Expected 2 step items (omitted + explicit), found ${items.length}.`)
    }

    if (omitted.getAttribute('data-status') !== 'default') {
      throw new Error(
        `Expected a step with no status key to fall back to data-status="default", got "${omitted.getAttribute('data-status')}".`,
      )
    }

    const markerOf = (item: HTMLElement) => {
      const marker = item.querySelector<HTMLElement>('[data-slot="step-marker"]')
      if (!marker) {
        throw new Error('Expected every step to render a marker.')
      }
      return marker
    }
    const omittedMarker = markerOf(omitted)
    const explicitMarker = markerOf(explicit)

    // Equivalence, not a smoke test: the omitted-status marker is compared
    // against a live explicit-'default' one rather than a hardcoded class
    // string, so a restyle moves both sides together and the test still means
    // "the ?? fallback picked the same treatment".
    if (omittedMarker.outerHTML !== explicitMarker.outerHTML) {
      throw new Error(
        `Expected an omitted status to render the same marker markup as status="default".\n  omitted:  ${omittedMarker.outerHTML}\n  explicit: ${explicitMarker.outerHTML}`,
      )
    }

    // …and the same resolved paint — the ink is declared per status on the
    // <li> and inherited, so matching classes with a mismatched ink would mean
    // the fallback landed on a different status entry.
    const ink = (el: HTMLElement) => getComputedStyle(el).getPropertyValue('--step-ink').trim()
    if (ink(omittedMarker) === '') {
      throw new Error('Expected the omitted-status marker to inherit a resolved --step-ink.')
    }
    if (ink(omittedMarker) !== ink(explicitMarker)) {
      throw new Error(
        `Expected the omitted-status --step-ink to match status="default" (${ink(explicitMarker)}), got "${ink(omittedMarker)}".`,
      )
    }
    for (const property of ['backgroundColor', 'borderTopColor'] as const) {
      const [a, b] = [
        getComputedStyle(omittedMarker)[property],
        getComputedStyle(explicitMarker)[property],
      ]
      if (a !== b) {
        throw new Error(
          `Expected the omitted-status marker's ${property} to match status="default" ("${b}"), got "${a}".`,
        )
      }
    }
  },
}

export const Current: Story = {
  args: {
    steps: journeySteps,
    currentHref: '#documents',
  },
  play: async ({ canvasElement }) => {
    const list = getIndicator(canvasElement)

    const currentLinks = list.querySelectorAll<HTMLAnchorElement>('[aria-current="step"]')
    if (currentLinks.length !== 1) {
      throw new Error(
        `Expected exactly one aria-current="step" link, found ${currentLinks.length}.`,
      )
    }
    const current = currentLinks[0]!
    if (!current.getAttribute('href')?.endsWith('#documents')) {
      throw new Error(
        `Expected the aria-current link to target #documents, got "${current.getAttribute('href')}".`,
      )
    }

    const currentItem = list.querySelector('[data-current]')
    if (!currentItem || currentItem.getAttribute('data-status') !== 'in-progress') {
      throw new Error('Expected the in-progress step item to carry the data-current attribute.')
    }

    // The emphasised in-progress-current marker is the 32px double ring:
    // an outer ring with a nested inner ring.
    const marker = currentItem.querySelector<HTMLElement>('[data-slot="step-marker"]')
    if (!marker || !marker.querySelector('span')) {
      throw new Error(
        'Expected the current in-progress marker to render the double-ring treatment.',
      )
    }
  },
}

const navSections = [
  {
    title: 'Before you start',
    steps: [
      { title: 'Your details', href: '#nav-your-details', status: 'completed' as const },
      { title: 'Eligibility', href: '#nav-eligibility', status: 'in-progress' as const },
    ],
  },
  {
    title: 'Your application',
    steps: [
      { title: 'Documents', href: '#nav-documents', status: 'not-started' as const },
      { title: 'Payment', href: '#nav-payment', status: 'cannot-start' as const },
    ],
  },
]

export const Sections: Story = {
  name: 'StepNav sections',
  render: () => <StepNav sections={navSections} headingLevel={3} currentHref='#nav-eligibility' />,
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector<HTMLElement>('nav[data-slot="step-nav"]')
    if (!nav) {
      throw new Error('Expected StepNav to render a <nav> landmark.')
    }
    if (nav.getAttribute('aria-label') !== 'Progress') {
      throw new Error(
        `Expected the landmark to default to aria-label="Progress", got "${nav.getAttribute('aria-label')}".`,
      )
    }

    const headings = nav.querySelectorAll('h3[data-slot="step-nav-heading"]')
    if (headings.length !== navSections.length) {
      throw new Error(
        `Expected ${navSections.length} h3 section headings (headingLevel={3}), found ${headings.length}.`,
      )
    }

    const indicators = nav.querySelectorAll('[data-slot="step-indicator"]')
    if (indicators.length !== navSections.length) {
      throw new Error(
        `Expected one StepIndicator per section (${navSections.length}), found ${indicators.length}.`,
      )
    }

    const current = nav.querySelectorAll('[aria-current="step"]')
    if (current.length !== 1) {
      throw new Error(
        `Expected currentHref to mark exactly one step across sections, found ${current.length}.`,
      )
    }
  },
}

export const CssCheck: Story = {
  name: 'CSS Check',
  args: {
    steps: [
      { title: 'Your details', href: '#css-completed', status: 'completed' },
      { title: 'Eligibility', href: '#css-not-started', status: 'not-started' },
    ],
  },
  play: async ({ canvasElement }) => {
    const list = getIndicator(canvasElement)

    // Proves globals.css loaded AND the raw --success-600 token resolved: the
    // completed marker's fill is bg-(--step-ink) — an unresolved ink computes
    // to a transparent background.
    const marker = list.querySelector<HTMLElement>(
      '[data-status="completed"] [data-slot="step-marker"]',
    )
    if (!marker) {
      throw new Error('Expected a marker on the completed step.')
    }
    const bg = getComputedStyle(marker).backgroundColor
    if (bg === '' || bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the completed marker's --step-ink (--success-600) to resolve to a visible fill, got "${bg}". Is globals.css loaded?`,
      )
    }

    // And the connector derives from the same ink.
    const connector = list.querySelector<HTMLElement>(
      '[data-status="completed"] [data-slot="step-connector"]',
    )
    if (!connector) {
      throw new Error('Expected a connector after the completed step.')
    }
    const connectorBg = getComputedStyle(connector).backgroundColor
    if (connectorBg === '' || connectorBg === 'transparent' || connectorBg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the completed connector to resolve --step-ink to a visible colour, got "${connectorBg}".`,
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
  args: {
    currentHref: '#documents',
  },
}

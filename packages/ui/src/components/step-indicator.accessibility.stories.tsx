/**
 * StepIndicator — Accessibility
 *
 * One story per WCAG 2.2 criterion the step indicator has to meet, each
 * asserting it in play(). Status is the component's whole job, so most of
 * these pin that status reaches every reader: in words for a screen reader,
 * in shape as well as hue for a sighted one, and with enough contrast to see.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { StepIndicator, StepNav, type Step, type StepStatus } from './step-indicator.js'
import { compositeOver, expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/StepIndicator/Accessibility',
  component: StepIndicator,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof StepIndicator>

export default meta

type Story = StoryObj<typeof meta>

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

const statuses: StepStatus[] = [
  'not-started',
  'in-progress',
  'completed',
  'saved',
  'error',
  'cannot-start',
]

/** One step per status, titled with the status, none of them current. */
const statusSteps: Step[] = statuses.map((status) => ({
  title: `Step ${status}`,
  href: `#a11y-${status}`,
  status,
}))

const stepLinks = (canvasElement: HTMLElement) =>
  Array.from(canvasElement.querySelectorAll<HTMLElement>('[data-slot="step-link"]'))

/** The opaque colour behind an element, compositing any translucent layers. */
function effectiveBackground(element: Element): string {
  const layers: string[] = []
  for (let el: Element | null = element; el; el = el.parentElement) {
    const bg = getComputedStyle(el).backgroundColor
    if (resolveColor(bg).a === 0) continue
    layers.push(bg)
    if (resolveColor(bg).a >= 1) break
  }
  const base = layers.length && resolveColor(layers.at(-1)!).a >= 1 ? layers.pop()! : 'white'
  let backdrop = resolveColor(base)
  for (const layer of layers.reverse())
    backdrop = { ...compositeOver(resolveColor(layer), backdrop), a: 1 }
  return `rgb(${Math.round(backdrop.r)}, ${Math.round(backdrop.g)}, ${Math.round(backdrop.b)})`
}

// ─── 1.3.1 — Info and Relationships ───────────────────────────────────────────

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

export const InfoAndRelationships: Story = {
  name: 'Info and Relationships — 1.3.1',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: 'The steps are a sequence, and a grouped journey has phases. A screen reader user needs both — how many steps, which one comes next, and which phase each belongs to.',
          how: 'With a screen reader, list landmarks: "Progress". Move by heading: "Before you start", "Your application". Enter a list: "list, 2 items". The play() asserts the landmark, a heading per section at the chosen level, and an ordered list of steps under each.',
          caveat:
            'StepNav headings default to h2. Set headingLevel so they slot into the outline of the page around them — here h3.',
        }),
      },
    },
  },
  render: () => <StepNav sections={navSections} headingLevel={3} />,
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', { name: 'Progress' })
    const headings = within(nav).getAllByRole('heading', { level: 3 })
    await expect(headings.map((h) => h.textContent)).toEqual([
      'Before you start',
      'Your application',
    ])
    const lists = nav.querySelectorAll('ol[data-slot="step-indicator"]')
    await expect(lists).toHaveLength(2)
    for (const [index, list] of Array.from(lists).entries()) {
      await expect(within(list as HTMLElement).getAllByRole('listitem')).toHaveLength(
        navSections[index]!.steps.length,
      )
      // The heading for a section precedes its list.
      await expect(headings[index]!.compareDocumentPosition(list) & 4).toBe(4)
    }
  },
}

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'Each step is a link, and its status and whether it is the current step are state a screen reader user cannot see.',
          how: 'Read the links: "Your details (Completed)", "Documents (In progress)", marked as the current step, and "Payment (Cannot start yet)", announced as unavailable. The play() asserts every link\'s name carries its status in words, the current step carries aria-current="step", and the blocked step aria-disabled="true".',
          caveat:
            'The words are English by default. Localise them, or suppress one, with statusLabels.',
        }),
      },
    },
  },
  render: () => <StepIndicator steps={journeySteps} currentHref='#documents' />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const [title, words] of [
      ['Your details', 'Completed'],
      ['Eligibility', 'Saved'],
      ['Documents', 'In progress'],
      ['Review', 'Not started'],
      ['Payment', 'Cannot start yet'],
    ] as const) {
      await expect(
        canvas.getByRole('link', { name: new RegExp(`^${title} \\(${words}\\)`) }),
      ).toBeInTheDocument()
    }
    const current = canvasElement.querySelectorAll('[aria-current]')
    await expect(current).toHaveLength(1)
    await expect(current[0]).toHaveAttribute('aria-current', 'step')
    await expect(current[0]).toHaveAccessibleName(/^Documents/)
    await expect(canvas.getByRole('link', { name: /^Payment/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
  },
}

// ─── 1.4.1 — Use of Color ─────────────────────────────────────────────────────

export const UseOfColor: Story = {
  name: 'Use of Color — 1.4.1',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.1',
          why: 'Green, blue, red and grey are the status colours, and a reader who cannot tell them apart still needs to know which steps are done, begun, wrong or blocked.',
          how: 'Look at the markers with colour removed (a greyscale filter): every status still differs — a tick on a solid disc, a tick on an outlined disc, an ellipsis, an error mark, a dash, an empty ring. The play() asserts that no two statuses share both a glyph and a fill style.',
          caveat:
            'A step with no status and a not-started step are the same on purpose: both mean "not begun". Only the not-started one is announced in words.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-72'>
      <StepIndicator steps={statusSteps} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const signatures = new Map<string, string>()
    for (const status of statuses) {
      const marker = canvasElement.querySelector<HTMLElement>(
        `[data-status="${status}"] [data-slot="step-marker"]`,
      )!
      const style = getComputedStyle(marker)
      const solid = resolveColor(style.backgroundColor).a === 1 && style.borderTopWidth === '0px'
      const glyph = marker.querySelector('svg path')?.getAttribute('d') ?? 'no glyph'
      const signature = `${solid ? 'solid' : 'outlined'} ${glyph}`
      const clash = signatures.get(signature)
      if (clash) {
        throw new Error(`"${status}" and "${clash}" differ only in colour.`)
      }
      signatures.set(signature, status)
    }
  },
}

// ─── 2.1.1 — Keyboard ─────────────────────────────────────────────────────────

const navigated = fn((event: { preventDefault: () => void }) => event.preventDefault())

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'Returning to a finished step is half of what the indicator is for, and it has to work without a pointer.',
          how: 'Tab through the list: every step that can be started takes focus in order, and the cannot-start step is skipped. Press Enter on a step: it is followed. The play() asserts the order, the skip, and that Enter fires onNavigate.',
          caveat:
            'A cannot-start step is out of the tab order and click-inert by design; its status is still announced to a screen reader reading the list.',
        }),
      },
    },
  },
  render: () => (
    <StepIndicator steps={journeySteps} currentHref='#documents' onNavigate={navigated} />
  ),
  play: async ({ canvasElement }) => {
    navigated.mockClear()
    const [details, eligibility, documents, review, payment] = stepLinks(canvasElement)
    for (const link of [details, eligibility, documents, review]) {
      await userEvent.tab()
      await expect(link).toHaveFocus()
    }
    await userEvent.tab()
    await expect(payment).not.toHaveFocus()
    details!.focus()
    await userEvent.keyboard('{Enter}')
    await expect(navigated).toHaveBeenCalledTimes(1)
  },
}

// ─── 2.4.7 — Focus Visible ────────────────────────────────────────────────────

export const FocusVisible: Story = {
  name: 'Focus Visible — 2.4.7',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.4.7',
          why: 'The steps are stacked close together, so a keyboard user needs a clear mark on the one that has focus.',
          how: "Tab to a step: a 2px ring is drawn around the marker and the title, in the step's own status colour. The play() asserts the ring on every focusable step and measures it against the page at 3:1.",
          caveat: 'The ring is focus-visible, so it does not appear on a mouse click.',
        }),
      },
    },
  },
  render: () => <StepIndicator steps={journeySteps} currentHref='#documents' />,
  play: async ({ canvasElement }) => {
    const focusable = stepLinks(canvasElement).filter((link) => link.tabIndex >= 0)
    for (const link of focusable) {
      await userEvent.tab()
      await expect(link).toHaveFocus()
      await waitFor(() => expect(getComputedStyle(link).outlineStyle).not.toBe('none'))
      const style = getComputedStyle(link)
      await expect(parseFloat(style.outlineWidth)).toBeGreaterThanOrEqual(2)
      expectContrast(style.outlineColor, effectiveBackground(link), {
        minimum: 3,
        label: `Focus ring on "${link.textContent}"`,
      })
    }
  },
}

// ─── 1.4.11 — Non-text Contrast ───────────────────────────────────────────────

const nonTextContrastStory: Story = {
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.11',
          why: "The marker is how a sighted reader sees a step's status at a glance, so the part that identifies it — the solid disc, or the ring of an outlined one — has to stand out from the page.",
          how: "The play() measures each marker's identifying colour against the page behind it: the fill of a solid disc, the border of an outlined disc or ring, at 3:1.",
          caveat:
            'A cannot-start step is an inactive component (aria-disabled), which 1.4.11 exempts, so its marker is not measured — in dark mode it keeps its light-mode grey-600 and sits at about 2.3:1. The connector line between steps is decoration. The (dark) story measures the dark-mode inks.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-72'>
      <StepIndicator steps={statusSteps} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Inactive components are exempt from 1.4.11.
    for (const status of statuses.filter((status) => status !== 'cannot-start')) {
      const marker = canvasElement.querySelector<HTMLElement>(
        `[data-status="${status}"] [data-slot="step-marker"]`,
      )!
      const style = getComputedStyle(marker)
      const solid = style.borderTopWidth === '0px'
      const ink = solid ? style.backgroundColor : style.borderTopColor
      expectContrast(ink, effectiveBackground(marker.parentElement!), {
        minimum: 3,
        label: `"${status}" marker`,
      })
    }
  },
}

export const NonTextContrast: Story = {
  ...nonTextContrastStory,
  name: 'Non-text Contrast — 1.4.11',
}

export const NonTextContrastDark: Story = {
  ...nonTextContrastStory,
  name: 'Non-text Contrast — 1.4.11 (dark)',
  globals: { theme: 'dark' },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

const contrastStory: Story = {
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: "Step titles and descriptions are small text read at a glance, and the current step's emphasis changes their colour.",
          how: 'The play() measures every title and description, current and not, against the page behind it with the same contrast maths axe uses, at 4.5:1.',
          caveat: 'The (dark) story measures the dark-mode text colours.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-72'>
      <StepIndicator steps={journeySteps} currentHref='#documents' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const text = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="step-title"], [data-slot="step-description"]',
    )
    await expect(text.length).toBeGreaterThan(journeySteps.length)
    for (const el of text) {
      expectContrast(getComputedStyle(el).color, effectiveBackground(el), {
        label: `"${el.textContent}"`,
      })
    }
  },
}

export const ContrastMinimum: Story = { ...contrastStory, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

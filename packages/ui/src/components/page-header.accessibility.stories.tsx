/**
 * PageHeader — Accessibility
 *
 * One story per WCAG 2.2 criterion the page opener has to meet, each
 * asserting it in play(). The header is a named region whose title is the
 * page's h1, painted white on a brand box that holds its colour in both
 * themes; the standfirst and meta row read the page's own text tokens.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderMeta,
  PageHeaderRule,
  PageHeaderTitle,
  type PageHeaderColor,
} from './page-header.js'
import { expectContrast, wcagStoryMeta } from './story-helpers.js'

const title = 'Discovery Pass'
const longTitle = 'Apply for a recreational fishing fee exemption'
const sectionTitle = 'Where you can travel with the pass'
const description = 'Get unlimited travel on NSW TrainLink Regional trains and coaches.'
const colors: PageHeaderColor[] = ['blue', 'navy', 'red']

/** WCAG's large-text threshold: 18pt regular, which is 24px; the title is semibold at 32px and up. */
const LARGE_TEXT_PX = 24

const meta = {
  title: 'Components/PageHeader/Accessibility',
  component: PageHeader,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PageHeader>

export default meta

type Story = StoryObj<typeof meta>

// ─── 1.3.1 — Info and Relationships ───────────────────────────────────────────

export const InfoAndRelationships: Story = {
  name: 'Info and Relationships — 1.3.1',
  parameters: {
    wcag: ['1.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: 'The header opens the page, so its title is the page’s title. A screen reader user who jumps to the first heading, or to the first landmark, has to land on it and hear it named — and the colour box, the rule and the hairline are decoration that must add nothing to the structure.',
          how: 'Three headers render: the page opener named by its h1 title, a section opener named by an h2 title (headingLevel={2}), and one with no labelledBy. The play() asserts the opener is a region named by its title, that its title is the document’s one h1 and the only element inside the title row, that the rule is hidden from assistive technology, that the section opener is an h2 whose region is named by it, and that the unnamed header is a plain section with no invented name.',
          caveat:
            'Pass headingLevel={2} for a header that opens a section of a page whose h1 sits elsewhere, so the outline keeps one h1; only levels 1 and 2 are offered, as a header deeper in the outline is a Section. The rule is decorative and must stay aria-hidden; the meta row is real text and is not hidden.',
        }),
      },
    },
  },
  render: () => (
    <>
      <PageHeader labelledBy='a11y-structure-title'>
        <PageHeaderTitle id='a11y-structure-title'>{title}</PageHeaderTitle>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageHeaderRule />
      </PageHeader>
      <PageHeader labelledBy='a11y-structure-h2'>
        <PageHeaderTitle id='a11y-structure-h2' headingLevel={2}>
          {sectionTitle}
        </PageHeaderTitle>
        <PageHeaderDescription>{description}</PageHeaderDescription>
      </PageHeader>
      <PageHeader data-testid='unnamed'>
        <PageHeaderTitle headingLevel={2}>Unnamed header</PageHeaderTitle>
      </PageHeader>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: title })
    await expect(region).toHaveAttribute('aria-labelledby', 'a11y-structure-title')
    const headings = canvas.getAllByRole('heading', { level: 1 })
    await expect(headings).toHaveLength(1)
    await expect(headings[0]).toHaveAttribute('id', 'a11y-structure-title')
    const row = region.querySelector<HTMLElement>('[data-slot="page-header-title-row"]')
    await expect(row?.children).toHaveLength(1)
    await expect(row?.firstElementChild).toBe(headings[0])
    const rule = region.querySelector('[data-slot="page-header-rule"]')
    await expect(rule).toHaveAttribute('aria-hidden', 'true')
    // headingLevel={2} steps the title down to an h2 and still names its region.
    const h2 = canvas.getByRole('heading', { level: 2, name: sectionTitle })
    await expect(h2.tagName).toBe('H2')
    await expect(canvas.getByRole('region', { name: sectionTitle })).toHaveAttribute(
      'aria-labelledby',
      'a11y-structure-h2',
    )
    // No fallback name is invented: without labelledBy the header is a plain
    // <section>, not a third region.
    await expect(canvas.getAllByRole('region')).toHaveLength(2)
    const unnamed = canvas.getByTestId('unnamed')
    await expect(unnamed.tagName).toBe('SECTION')
    await expect(unnamed).not.toHaveAttribute('aria-labelledby')
    await expect(unnamed).not.toHaveAttribute('aria-label')
  },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

function AllColours() {
  return (
    <div className='flex flex-col gap-4 bg-background' data-testid='page'>
      {colors.map((color) => (
        <PageHeader key={color} color={color} labelledBy={`a11y-contrast-${color}`}>
          <PageHeaderTitle id={`a11y-contrast-${color}`} headingLevel={2}>
            {title}
          </PageHeaderTitle>
          <PageHeaderDescription>{description}</PageHeaderDescription>
          <PageHeaderMeta>
            <span>Last updated 3 October 2026</span>
            <span>transportnsw.info</span>
          </PageHeaderMeta>
        </PageHeader>
      ))}
    </div>
  )
}

const contrastStory: Story = {
  parameters: {
    wcag: ['1.4.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'The title is white on a palette step, not a role token, and the default box — Blue 02 — carries white at 4.57:1, which clears the 4.5:1 normal-text bar with almost no headroom. The title is large text (32px and up, semibold), where the bar is 3:1, so a retuned palette has that margin before the title fails; a title restyled small would not. No other gate would notice either.',
          how: 'All three colourways render together. The play() measures the painted title colour against the painted box and holds it to the large-text floor of 3:1 while asserting the title is at least 24px, then measures the standfirst and the meta row against the page at 4.5:1.',
          caveat:
            'The (dark) story measures the dark theme, where blue and red hold their colour and navy lifts to primary-700. The title must stay large text: do not restyle it under 24px.',
        }),
      },
    },
  },
  render: () => <AllColours />,
  play: async ({ canvasElement }) => {
    const page = within(canvasElement).getByTestId('page')
    const pageColor = getComputedStyle(page).backgroundColor
    const headers = canvasElement.querySelectorAll<HTMLElement>('[data-slot="page-header"]')
    await expect(headers).toHaveLength(colors.length)
    for (const header of headers) {
      const color = header.dataset.color
      const heading = header.querySelector<HTMLElement>('[data-slot="page-header-title"]')
      const text = header.querySelector<HTMLElement>('[data-slot="page-header-description"]')
      const facts = header.querySelector<HTMLElement>('[data-slot="page-header-meta"]')
      if (!heading || !text || !facts) {
        throw new Error(`Expected a title, description and meta row on ${color}.`)
      }
      const headingStyle = getComputedStyle(heading)
      await expect(Number.parseFloat(headingStyle.fontSize)).toBeGreaterThanOrEqual(LARGE_TEXT_PX)
      expectContrast(headingStyle.color, headingStyle.backgroundColor, {
        minimum: 3,
        label: `Title on the ${color} box (large text)`,
      })
      expectContrast(getComputedStyle(text).color, pageColor, {
        label: `Description under the ${color} box`,
      })
      expectContrast(getComputedStyle(facts).color, pageColor, {
        label: `Meta row under the ${color} box`,
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

// ─── 1.4.10 — Reflow ──────────────────────────────────────────────────────────

export const Reflow: Story = {
  name: 'Reflow — 1.4.10',
  parameters: {
    wcag: ['1.4.10'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.10',
          why: 'The title box hangs into the margin by a negative start margin, and the heading is inline so its band is drawn per line. Either could push content past a 320px viewport if the margin outran the inset or a title refused to wrap, and the meta row’s two spans would collide if they stayed on one line.',
          how: 'The story opens at Storybook’s 320px “Small mobile” viewport — a real viewport, in the canvas and in the test runner alike — with a long title, the standfirst and a meta row, and a second header whose title is one unbreakable token. The play() asserts the phone type is in play, that the page does not scroll horizontally, that the title wraps onto more than one line with every line box inside the viewport, that the unbreakable token breaks inside the viewport too, and that the meta row has stacked.',
          caveat:
            'The viewport is set by the story’s globals; opening it at another size tests that size instead. The title row breaks words only when a token cannot fit the line, so ordinary titles still wrap at spaces.',
        }),
      },
    },
  },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  render: () => (
    <>
      <PageHeader labelledBy='a11y-reflow-title'>
        <PageHeaderTitle id='a11y-reflow-title'>{longTitle}</PageHeaderTitle>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageHeaderMeta>
          <span>Last updated 3 October 2026</span>
          <span>transportnsw.info</span>
        </PageHeaderMeta>
      </PageHeader>
      <PageHeader labelledBy='a11y-reflow-token'>
        <PageHeaderTitle id='a11y-reflow-token' headingLevel={2}>
          transportnsw.info/regional-travel/regional-offers/discovery-pass
        </PageHeaderTitle>
      </PageHeader>
    </>
  ),
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument
    const viewportWidth = doc.documentElement.clientWidth
    await expect(viewportWidth).toBeLessThanOrEqual(320)
    const heading = canvasElement.querySelector<HTMLElement>('[data-slot="page-header-title"]')
    const facts = canvasElement.querySelector<HTMLElement>('[data-slot="page-header-meta"]')
    if (!heading || !facts) throw new Error('Expected a PageHeaderTitle and a PageHeaderMeta.')
    // The phone step: 32px type, so the measure is the one the breakpoint designs for.
    await expect(getComputedStyle(heading).fontSize).toBe('32px')
    await expect(doc.documentElement.scrollWidth).toBeLessThanOrEqual(viewportWidth)
    const lines = Array.from(heading.getClientRects())
    await expect(lines.length).toBeGreaterThan(1)
    for (const line of lines) {
      await expect(line.left).toBeGreaterThanOrEqual(-0.5)
      await expect(line.right).toBeLessThanOrEqual(viewportWidth + 0.5)
    }
    await expect(getComputedStyle(facts).flexDirection).toBe('column')
    // One unbreakable token breaks inside the viewport rather than past it.
    const token = doc.getElementById('a11y-reflow-token')
    if (!token) throw new Error('Expected the unbreakable-token header.')
    const tokenLines = Array.from(token.getClientRects())
    await expect(tokenLines.length).toBeGreaterThan(1)
    for (const line of tokenLines) {
      await expect(line.right).toBeLessThanOrEqual(viewportWidth + 0.5)
    }
    await expect(doc.documentElement.scrollWidth).toBeLessThanOrEqual(viewportWidth)
  },
}

// ─── 2.4.6 — Headings and Labels ──────────────────────────────────────────────

export const HeadingsAndLabels: Story = {
  name: 'Headings and Labels — 2.4.6',
  parameters: {
    wcag: ['2.4.6'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.4.6',
          why: 'The title is the one heading a user navigating by headings meets first, and the name the landmark list shows for the region. It has to be the page’s title alone: the standfirst and the meta row are not part of it, and nothing hidden is added to it.',
          how: 'The play() asserts the heading’s accessible name is exactly its visible text, that the region takes that same name, and that the standfirst and meta row are outside the heading.',
          caveat:
            'The heading text is the consumer’s; this proves the component adds and hides nothing. Keep titles descriptive and in sentence case — the brand sets nothing in uppercase.',
        }),
      },
    },
  },
  render: () => (
    <PageHeader labelledBy='a11y-headings-title'>
      <PageHeaderTitle id='a11y-headings-title'>{title}</PageHeaderTitle>
      <PageHeaderDescription>{description}</PageHeaderDescription>
      <PageHeaderMeta>
        <span>Last updated 3 October 2026</span>
        <span>transportnsw.info</span>
      </PageHeaderMeta>
    </PageHeader>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByRole('heading', { level: 1 })
    await expect(heading).toHaveAccessibleName(title)
    await expect(heading.textContent?.trim()).toBe(title)
    await expect(getComputedStyle(heading).textTransform).toBe('none')
    const region = canvas.getByRole('region')
    await expect(region).toHaveAccessibleName(title)
    const text = canvasElement.querySelector('[data-slot="page-header-description"]')
    const facts = canvasElement.querySelector('[data-slot="page-header-meta"]')
    // `Node.contains(null)` is false, so the slots have to exist for the
    // assertions below to prove anything.
    if (!text || !facts) throw new Error('Expected a PageHeaderDescription and a PageHeaderMeta.')
    await expect(heading.contains(text)).toBe(false)
    await expect(heading.contains(facts)).toBe(false)
  },
}

/**
 * PageHeader — Tests
 *
 * CSS check: proves globals.css loaded and the title box is painted. Colourway
 * wiring: the one piece of logic the component owns is the map from `color`
 * to the box, rule and hairline custom properties, stated in three places
 * (the JSDoc, the Colours docs section, AGENTS.md §3) and otherwise asserted
 * nowhere — a typo in one arbitrary-property class lints, typechecks and
 * passes every other story. These compare painted pixels, never oklch
 * strings, in both themes.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderMeta,
  PageHeaderRule,
  PageHeaderTitle,
  type PageHeaderColor,
} from './page-header.js'
import { resolveColor } from './story-helpers.js'

const colors: PageHeaderColor[] = ['blue', 'navy', 'red']

const meta = {
  title: 'Components/PageHeader/Tests',
  component: PageHeader,
  tags: ['!dev', '!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PageHeader>

export default meta

type Story = StoryObj<typeof meta>

function AllColours() {
  return (
    <div className='flex flex-col gap-4 bg-background'>
      {colors.map((color) => (
        <PageHeader key={color} color={color} labelledBy={`tests-${color}-title`}>
          <PageHeaderTitle id={`tests-${color}-title`} headingLevel={2}>
            Discovery Pass
          </PageHeaderTitle>
          <PageHeaderDescription>Get unlimited travel on regional trains.</PageHeaderDescription>
          <PageHeaderRule />
          <PageHeaderMeta>
            <span>Last updated 3 October 2026</span>
            <span>transportnsw.info</span>
          </PageHeaderMeta>
        </PageHeader>
      ))}
    </div>
  )
}

type Rgba = ReturnType<typeof resolveColor>

const same = (a: Rgba, b: Rgba) =>
  Math.abs(a.r - b.r) <= 1 && Math.abs(a.g - b.g) <= 1 && Math.abs(a.b - b.b) <= 1

function paint(header: HTMLElement) {
  const title = header.querySelector<HTMLElement>('[data-slot="page-header-title"]')
  const rule = header.querySelector<HTMLElement>('[data-slot="page-header-rule"]')
  const facts = header.querySelector<HTMLElement>('[data-slot="page-header-meta"]')
  if (!title || !rule || !facts) {
    throw new Error(`Expected a title, rule and meta row on ${header.dataset.color}.`)
  }
  return {
    box: resolveColor(getComputedStyle(title).backgroundColor),
    rule: resolveColor(getComputedStyle(rule).backgroundColor),
    hairline: resolveColor(getComputedStyle(facts).borderTopColor),
    ink: resolveColor(getComputedStyle(header).getPropertyValue('--page-header-ink')),
    brandBand: resolveColor(getComputedStyle(header).getPropertyValue('--primary-800')),
  }
}

export const CssCheck: Story = {
  name: 'CSS check',
  render: () => <AllColours />,
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector<HTMLElement>('[data-slot="page-header"]')
    if (!header) throw new Error('Could not find an element with [data-slot="page-header"].')
    const { box, rule } = paint(header)
    // Proves globals.css loaded: the box is painted, not transparent, and the
    // rule has its 48×4 size.
    await expect(box.a).toBeGreaterThan(0)
    const ruleBox = header.querySelector('[data-slot="page-header-rule"]')?.getBoundingClientRect()
    await expect(ruleBox?.width).toBe(48)
    await expect(ruleBox?.height).toBe(4)
    await expect(rule.a).toBeGreaterThan(0)
  },
}

const wiring: Story = {
  render: () => <AllColours />,
  play: async ({ canvasElement, globals }) => {
    const headers = canvasElement.querySelectorAll<HTMLElement>('[data-slot="page-header"]')
    await expect(headers).toHaveLength(colors.length)
    const painted = new Map<string, ReturnType<typeof paint>>()
    for (const header of headers) painted.set(header.dataset.color ?? '', paint(header))

    for (const [color, p] of painted) {
      // The hairline is always the ink.
      await expect(same(p.hairline, p.ink)).toBe(true)
      // The rule follows the box in `red` and the ink elsewhere.
      await expect(same(p.rule, color === 'red' ? p.box : p.ink)).toBe(true)
      // Every box is its own colour: none of the three share a fill.
      for (const [other, q] of painted) {
        if (other !== color) await expect(same(p.box, q.box)).toBe(false)
      }
    }

    // `navy` is the brand band in light and lifts off it in dark; `blue` and
    // `red` hold still, so their boxes never equal the band either way.
    const navy = painted.get('navy')
    if (!navy) throw new Error('Expected the navy header.')
    const dark = globals.theme === 'dark'
    await expect(same(navy.box, navy.brandBand)).toBe(!dark)
  },
}

export const ColourwayWiring: Story = { ...wiring, name: 'Colourway wiring' }

export const ColourwayWiringDark: Story = {
  ...wiring,
  name: 'Colourway wiring (dark)',
  globals: { theme: 'dark' },
}

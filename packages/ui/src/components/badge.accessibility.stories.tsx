/**
 * Badge — Accessibility
 *
 * One story per WCAG 2.2 criterion a badge has to meet, each asserting it in
 * play(). A badge is a static span — no role, no focus, no interaction — so
 * what it owes readers is legible text and a meaning that never rests on
 * colour or on its decorative dot and icon.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { IconCheck } from '../icons/check.js'
import { cn } from '../lib/utils.js'
import { Badge } from './badge.js'
import { compositeOver, expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/Badge/Accessibility',
  component: Badge,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

const variants = ['solid', 'soft', 'surface', 'outline'] as const
const pageColors = [
  'primary',
  'tertiary',
  'accent',
  'grey',
  'success',
  'warning',
  'danger',
] as const
const onDarkColors = ['white', 'secondary'] as const

/**
 * The opaque colour an element is painted on: its own background composited
 * over each ancestor's until an opaque one is reached. Soft and surface badges
 * are translucent tints, so their real backdrop is the tint over the panel.
 */
function paintedBackground(element: Element): string {
  const layers: string[] = []
  for (let node: Element | null = element; node; node = node.parentElement) {
    const background = getComputedStyle(node).backgroundColor
    layers.push(background)
    if (resolveColor(background).a === 1) {
      const [base, ...tints] = layers.reverse()
      let painted = resolveColor(base!)
      for (const tint of tints) painted = { ...compositeOver(resolveColor(tint), painted), a: 1 }
      return `rgb(${painted.r} ${painted.g} ${painted.b})`
    }
  }
  throw new Error('No opaque background behind the element.')
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

function ContrastMatrix() {
  return (
    <div className='space-y-4'>
      {[
        { colors: pageColors, brand: false },
        { colors: onDarkColors, brand: true },
      ].map(({ colors, brand }) => (
        <div
          key={String(brand)}
          data-surface={brand ? 'brand' : 'page'}
          className={cn(
            'flex flex-col items-start gap-3 rounded-xl border p-6',
            brand
              ? 'border-transparent bg-primary-800 dark:bg-primary-950'
              : 'border-border bg-background',
          )}
        >
          {colors.map((color) => (
            <div key={color} className='flex flex-wrap gap-3'>
              {variants.map((variant) => (
                <Badge key={variant} color={color} variant={variant}>
                  {color} {variant}
                </Badge>
              ))}
            </div>
          ))}
        </div>
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
          why: 'A badge is 16px text that carries a status by itself, so its label must clear 4.5:1 against what it is actually painted on — for soft and surface, a translucent tint over the page.',
          how: 'Every colour is rendered in every variant on the surface it is made for: the page for the brand and status colours, the solid brand band (primary-800, deepening to primary-950 in dark) for white and secondary. The play() composites each badge’s tint over its panel and measures the label against the result.',
          caveat:
            'White and secondary are made for dark surfaces and are only measured on one; on a white page they fail, which is why the Colours section shows them on the band.',
        }),
      },
    },
  },
  render: () => <ContrastMatrix />,
  play: async ({ canvasElement }) => {
    const badges = canvasElement.querySelectorAll<HTMLElement>('[data-slot="badge"]')
    await expect(badges).toHaveLength((pageColors.length + onDarkColors.length) * variants.length)
    for (const badge of badges) {
      expectContrast(getComputedStyle(badge).color, paintedBackground(badge), {
        label: `Badge "${badge.textContent}"`,
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

// ─── 1.4.1 — Use of Color ─────────────────────────────────────────────────────

const statuses = [
  ['success', 'Approved'],
  ['warning', 'Pending'],
  ['danger', 'Declined'],
  ['grey', 'Draft'],
] as const

export const UseOfColor: Story = {
  name: 'Use of Color — 1.4.1',
  parameters: {
    wcag: ['1.4.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.1',
          why: 'Readers who cannot tell green from red, and screen reader users who never see either, must still learn the status. Colour and the dot can only reinforce what the words say.',
          how: 'Four status badges, each with a colour and a dot. The play() reads the text a screen reader gets from each: every one is different and none is empty, so the status survives with colour removed.',
          caveat:
            'Badge cannot enforce this — a badge with an empty label and a dot would still render. The written label is the consumer’s job; this story pins the pattern the docs teach.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-wrap gap-3'>
      {statuses.map(([color, label]) => (
        <Badge key={color} color={color} dot>
          {label}
        </Badge>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const badges = Array.from(canvasElement.querySelectorAll<HTMLElement>('[data-slot="badge"]'))
    const spoken = badges.map((badge) => badge.textContent?.trim())
    await expect(spoken).toEqual(statuses.map(([, label]) => label))
    await expect(new Set(spoken).size).toBe(statuses.length)
  },
}

// ─── 1.1.1 — Non-text Content ─────────────────────────────────────────────────

export const NonTextContent: Story = {
  name: 'Non-text Content — 1.1.1',
  parameters: {
    wcag: ['1.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.1.1',
          why: 'The dot and an icon repeat what the label already says. Exposed to assistive technology they would be announced as noise, or as an unlabelled image, before the status.',
          how: 'A badge with a dot and one with an icon. The play() asserts the dot is aria-hidden by the component and the icon by the example, so the accessible text of each badge is the label alone.',
          caveat:
            'Badge hides its own dot; an icon passed as a child is hidden only if the consumer adds aria-hidden, as the With an icon example does.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-wrap gap-3'>
      <Badge color='success' dot>
        Approved
      </Badge>
      <Badge color='success'>
        <IconCheck aria-hidden /> Verified
      </Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const dot = canvasElement.querySelector('[data-slot="badge-dot"]')
    await expect(dot).toHaveAttribute('aria-hidden', 'true')
    const icon = canvasElement.querySelector('svg')
    await expect(icon).toHaveAttribute('aria-hidden', 'true')

    // Nothing in either badge is exposed as an image.
    await expect(within(canvasElement).queryAllByRole('img')).toHaveLength(0)
    const [withDot, withIcon] = canvasElement.querySelectorAll('[data-slot="badge"]')
    await expect(withDot).toHaveTextContent(/^Approved$/)
    await expect(withIcon).toHaveTextContent(/^Verified$/)
  },
}

// ─── 1.3.1 — Info and Relationships ───────────────────────────────────────────

export const InfoAndRelationships: Story = {
  name: 'Info and Relationships — 1.3.1',
  parameters: {
    wcag: ['1.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: 'A count or status only means something next to what it describes. Placed in the same line of text, it is read in the same breath — “Applications 3” — rather than as a stray number.',
          how: 'A count badge inside the label it counts, and a status badge inside the heading row of the item it describes. The play() asserts each badge sits in the DOM beside its subject, so reading order matches visual order.',
          caveat:
            'A badge has no role and adds no semantics of its own; the relationship comes entirely from where it is placed.',
        }),
      },
    },
  },
  render: () => (
    <div className='space-y-6'>
      <p className='inline-flex items-center gap-2'>
        Applications <Badge color='grey'>3</Badge>
      </p>
      <article className='max-w-xl rounded-md border border-border p-6'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <h2 className='text-lg font-semibold'>Community garden grant</h2>
          <Badge color='success' dot>
            Approved
          </Badge>
        </div>
      </article>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const count = within(canvasElement).getByText('3')
    await expect(count.closest('p')).toHaveTextContent(/^Applications 3$/)

    const heading = within(canvasElement).getByRole('heading', { name: 'Community garden grant' })
    const status = within(canvasElement).getByText('Approved').closest('[data-slot="badge"]')!
    // The status follows its heading in the DOM, so it is read straight after it.
    await expect(heading.nextElementSibling).toBe(status)
  },
}

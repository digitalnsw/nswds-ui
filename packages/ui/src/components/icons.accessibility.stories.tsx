/**
 * Icons — Accessibility
 *
 * One story per WCAG 2.2 criterion an icon has to meet, each asserting it in
 * play(). An icon is an inline SVG that paints with currentColor and has no
 * name of its own: it is either decorative (hidden beside words that say the
 * same thing) or named — by the control that holds it, or by role="img" and
 * aria-label on the icon itself. These pin both patterns and the colours.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import {
  IconCheckCircle,
  IconDownload,
  IconError,
  IconSearch,
  IconWarning,
} from '../icons/index.js'
import { Button } from './button.js'
import { compositeOver, expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/Icons/Accessibility',
  component: IconSearch,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof IconSearch>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The opaque colour an element is painted on: its own background composited
 * over each ancestor's until an opaque one is reached.
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

// ─── 1.1.1 — Non-text Content ─────────────────────────────────────────────────

export const NonTextContent: Story = {
  name: 'Non-text Content — 1.1.1',
  parameters: {
    wcag: ['1.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.1.1',
          why: 'An icon that means something needs a text alternative; one that only repeats the words beside it must be hidden, or a screen reader announces the same thing twice — or reads out an unnamed graphic.',
          how: 'A status line pairs a decorative icon with its words; a standalone approval mark is named with role="img" and aria-label. The play() asserts the first is hidden and the second is an image named “Approved”.',
          caveat:
            'Icons carry no aria-hidden or role of their own, so every use has to choose one of the two patterns.',
        }),
      },
    },
  },
  render: () => (
    <div className='space-y-4'>
      <p className='flex items-center gap-2'>
        <IconWarning
          aria-hidden='true'
          data-testid='decorative'
          className='size-6 text-(--warning-text)'
        />
        Your licence expires in 14 days.
      </p>
      <IconCheckCircle role='img' aria-label='Approved' className='size-8 text-(--success-text)' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvasElement.querySelector('[data-testid="decorative"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    await expect(canvas.getAllByRole('img')).toHaveLength(1)
    await expect(canvas.getByRole('img', { name: 'Approved' })).toBeVisible()
  },
}

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'A control whose only content is an icon has no name unless one is given. The name belongs on the control — the thing a reader acts on — not on the graphic inside it.',
          how: 'An icon-only Search button and a Download form button with a visible label. The play() asserts each button’s accessible name is exactly its label — the icon adds nothing to it — and that neither icon is exposed as an image of its own.',
          caveat:
            'Button’s icon slots render the SVG with no role or name, so it stays out of the name. When you place an icon inside a control yourself, add aria-hidden to it to be sure.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-wrap gap-4'>
      <Button iconOnly variant='outline' aria-label='Search' leadingVisual={IconSearch} />
      <Button leadingVisual={IconDownload}>Download form</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const name of ['Search', 'Download form']) {
      const button = canvas.getByRole('button', { name })
      await expect(button).toHaveAccessibleName(name)
      await expect(button.querySelector('svg[data-slot="icon"]')).toBeInTheDocument()
    }
    await expect(canvas.queryAllByRole('img')).toHaveLength(0)
  },
}

// ─── 1.4.11 — Non-text Contrast ───────────────────────────────────────────────

const contrastStory: Story = {
  name: 'Non-text Contrast — 1.4.11',
  parameters: {
    wcag: ['1.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.11',
          why: 'An icon a reader needs to understand — a status mark, a control’s only content — has to stand out from its surface by 3:1.',
          how: 'The play() measures each icon’s painted colour, as coloured by the semantic text tokens the docs recommend, against the page behind it. The (dark) story repeats it in dark mode.',
          caveat:
            'text-muted-foreground is for secondary detail beside words; it is measured here too, so a muted icon still reads on its own.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-wrap gap-6'>
      <IconSearch aria-hidden='true' className='size-8 text-foreground' />
      <IconDownload aria-hidden='true' className='size-8 text-primary' />
      <IconSearch aria-hidden='true' className='size-8 text-muted-foreground' />
      <IconCheckCircle aria-hidden='true' className='size-8 text-(--success-text)' />
      <IconWarning aria-hidden='true' className='size-8 text-(--warning-text)' />
      <IconError aria-hidden='true' className='size-8 text-(--danger-text)' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const icons = canvasElement.querySelectorAll('svg')
    await expect(icons).toHaveLength(6)
    for (const icon of icons) {
      expectContrast(getComputedStyle(icon).color, paintedBackground(icon), {
        minimum: 3,
        label: icon.getAttribute('class') ?? 'icon',
      })
    }
  },
}

export const NonTextContrast: Story = { ...contrastStory, name: 'Non-text Contrast — 1.4.11' }

export const NonTextContrastDark: Story = {
  ...contrastStory,
  name: 'Non-text Contrast — 1.4.11 (dark)',
  globals: { theme: 'dark' },
}

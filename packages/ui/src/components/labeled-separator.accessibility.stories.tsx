/**
 * LabeledSeparator — Accessibility
 *
 * One story per WCAG 2.2 criterion a labelled divider has to meet, each
 * asserting it in play(). The component is presentational: two decorative
 * rules either side of a text label. What a consumer relies on is that only
 * the label reaches assistive technology, and that the label is readable.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { LabeledSeparator } from './labeled-separator.js'
import { compositeOver, expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/LabeledSeparator/Accessibility',
  component: LabeledSeparator,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof LabeledSeparator>

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

function SignInChoice() {
  return (
    <div className='max-w-sm space-y-4'>
      <p>Continue with your MyServiceNSW Account</p>
      <LabeledSeparator />
      <p>Sign in with your email address</p>
    </div>
  )
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
          why: 'The split between two choices is carried by the word in the middle. A screen reader should hear that word once, in reading order — not two unnamed separators either side of it.',
          how: 'The play() asserts there is no separator in the accessibility tree, that both rules are role="none", and that the label is ordinary text between the two choices.',
          caveat:
            'Because the rules are hidden, the label has to say what the split means on its own. Keep it to a word or two that reads as part of the sentence either side, such as “or”.',
        }),
      },
    },
  },
  render: () => <SignInChoice />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryAllByRole('separator')).toHaveLength(0)

    const rules = canvasElement.querySelectorAll('[data-slot="separator"]')
    await expect(rules).toHaveLength(2)
    for (const rule of rules) await expect(rule).toHaveAttribute('role', 'none')

    // The label sits between the two choices in the DOM, so it is read in order.
    const label = canvas.getByText('or')
    const before = canvas.getByText('Continue with your MyServiceNSW Account')
    const after = canvas.getByText('Sign in with your email address')
    await expect(
      before.compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    await expect(
      label.compareDocumentPosition(after) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

const contrastStory: Story = {
  name: 'Contrast (Minimum) — 1.4.3',
  parameters: {
    wcag: ['1.4.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'The label is the only part of the separator that carries meaning, so it must be readable: 4.5:1 against the surface behind it.',
          how: 'The play() measures the label’s muted-foreground text against the page it is painted on, on the page and on a muted section. The (dark) story repeats it in dark mode.',
          caveat:
            'The two rules are decorative and carry no information, so they are not held to 1.4.11 — the label is what the reader needs to perceive.',
        }),
      },
    },
  },
  render: () => (
    <div className='max-w-sm space-y-6'>
      <LabeledSeparator data-testid='page' />
      <div className='rounded-md bg-muted p-4'>
        <LabeledSeparator data-testid='muted' />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const surface of ['page', 'muted']) {
      const label = canvasElement.querySelector(
        `[data-testid="${surface}"] [data-slot="labeled-separator-content"]`,
      )!
      expectContrast(getComputedStyle(label).color, paintedBackground(label), {
        label: `Label on the ${surface} surface`,
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

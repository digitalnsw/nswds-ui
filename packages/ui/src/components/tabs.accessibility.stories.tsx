/**
 * Tabs — Accessibility
 *
 * One story per WCAG 2.2 criterion a tab set has to meet, each asserting it in
 * play(). Base UI supplies the WAI-ARIA tabs pattern — roles, selection state,
 * roving focus with the arrow keys — and this package supplies the focus ring
 * and the colours. These pin both.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { compositeOver, expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs.js'

const meta = {
  title: 'Components/Tabs/Accessibility',
  component: Tabs,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

type ListVariant = 'default' | 'line' | 'fullwidth' | 'bordered'

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

function LicenceTabs({ variant = 'default' }: { variant?: ListVariant }) {
  return (
    <Tabs defaultValue='eligibility' className='w-full max-w-xl' data-testid={variant}>
      <TabsList variant={variant} aria-label='About the licence'>
        <TabsTrigger value='eligibility'>Eligibility</TabsTrigger>
        <TabsTrigger value='apply'>How to apply</TabsTrigger>
        <TabsTrigger value='renew' disabled>
          Renew
        </TabsTrigger>
        <TabsTrigger value='fees'>Fees</TabsTrigger>
      </TabsList>
      <TabsContent value='eligibility' className='pt-2 text-base'>
        You must be 18 or older and live in NSW.
      </TabsContent>
      <TabsContent value='apply' className='pt-2 text-base'>
        Apply online with your MyServiceNSW Account.
      </TabsContent>
      <TabsContent value='renew' className='pt-2 text-base'>
        Renewal opens 30 days before your licence expires.
      </TabsContent>
      <TabsContent value='fees' className='pt-2 text-base'>
        The fee depends on how long the licence lasts.
      </TabsContent>
    </Tabs>
  )
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
          why: 'A screen reader announces “tab, 1 of 4, selected” only when the roles and state are in the tree: a tablist holding tabs, one tab selected, and a tabpanel named by its tab.',
          how: 'The play() asserts the named tablist and its four tabs, that Eligibility is selected and names the visible panel, then clicks How to apply and asserts the selection and the panel follow.',
          caveat:
            'The disabled tab stays in the list with aria-disabled, so a reader still learns it exists. Give the list an aria-label when the page has more than one tab set.',
        }),
      },
    },
  },
  render: () => <LicenceTabs />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const list = canvas.getByRole('tablist', { name: 'About the licence' })
    await expect(within(list).getAllByRole('tab')).toHaveLength(4)

    const eligibility = canvas.getByRole('tab', { name: 'Eligibility' })
    await expect(eligibility).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByRole('tabpanel', { name: 'Eligibility' })).toBeVisible()
    await expect(canvas.getByRole('tab', { name: 'Renew' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )

    const apply = canvas.getByRole('tab', { name: 'How to apply' })
    await userEvent.click(apply)
    await expect(apply).toHaveAttribute('aria-selected', 'true')
    await expect(eligibility).toHaveAttribute('aria-selected', 'false')
    await expect(canvas.getByRole('tabpanel', { name: 'How to apply' })).toBeVisible()
  },
}

// ─── 2.1.1 — Keyboard ─────────────────────────────────────────────────────────

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    wcag: ['2.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'A keyboard user reaches the tab set in one Tab stop and moves between tabs with the arrow keys, so the tab set does not cost them a stop per tab.',
          how: 'Tab once: focus lands on the selected tab. Arrow Right moves focus to the next tab and Enter selects it; Arrow Right again stops on the disabled tab, where Enter does nothing, and once more reaches Fees; Tab leaves the list for the selected panel. The play() asserts each step.',
          caveat:
            'Focus and selection are separate: the arrow keys move focus without changing the panel until Enter or Space, so a reader can look along the bar first. In a vertical tab set the keys are Up and Down.',
        }),
      },
    },
  },
  render: () => <LicenceTabs />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await expect(canvas.getByRole('tab', { name: 'Eligibility' })).toHaveFocus()

    await userEvent.keyboard('{ArrowRight}')
    const apply = canvas.getByRole('tab', { name: 'How to apply' })
    await expect(apply).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(apply).toHaveAttribute('aria-selected', 'true'))

    // The disabled tab takes focus, so a reader learns it exists, but cannot be selected.
    await userEvent.keyboard('{ArrowRight}')
    const renew = canvas.getByRole('tab', { name: 'Renew' })
    await expect(renew).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(renew).toHaveAttribute('aria-selected', 'false')
    await expect(apply).toHaveAttribute('aria-selected', 'true')

    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('tab', { name: 'Fees' })).toHaveFocus()

    await userEvent.tab()
    await expect(canvas.getByRole('tabpanel', { name: 'How to apply' })).toHaveFocus()
  },
}

// ─── 2.4.7 — Focus Visible ────────────────────────────────────────────────────

export const FocusVisible: Story = {
  name: 'Focus Visible — 2.4.7',
  parameters: {
    wcag: ['2.4.7'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.4.7',
          why: 'With roving focus, the focused tab and the selected tab can differ. The reader has to see which tab the arrow keys are on.',
          how: 'Tab to the tab set in each variant. The play() asserts the focused tab draws a 2px solid outline it does not draw at rest.',
          caveat:
            'The outline is in the ring colour; the line and fullwidth variants draw it inset so the bar’s own rule cannot cover it.',
        }),
      },
    },
  },
  render: () => (
    <div className='space-y-8'>
      <LicenceTabs variant='default' />
      <LicenceTabs variant='line' />
      <LicenceTabs variant='fullwidth' />
      <LicenceTabs variant='bordered' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const variant of ['default', 'line', 'fullwidth', 'bordered']) {
      const tab = within(
        canvasElement.querySelector<HTMLElement>(`[data-testid="${variant}"]`)!,
      ).getByRole('tab', { name: 'Eligibility' })
      await expect(getComputedStyle(tab).outlineStyle).toBe('none')
      await userEvent.tab()
      await expect(tab).toHaveFocus()
      const style = getComputedStyle(tab)
      await expect(style.outlineStyle).toBe('solid')
      await expect(style.outlineWidth).toBe('2px')
      // Leave this tab set: the selected tab, then its panel.
      await userEvent.tab()
    }
  },
}

// ─── 1.4.3 / 1.4.11 — Contrast ────────────────────────────────────────────────

const contrastStory: Story = {
  name: 'Contrast (Minimum) — 1.4.3 / 1.4.11',
  parameters: {
    wcag: ['1.4.3', '1.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: ['1.4.3', '1.4.11'],
          why: 'Every tab label must be readable — the unselected ones most of all, since they are what the reader is choosing between — and the mark that shows which tab is selected must stand out from the bar.',
          how: 'All four variants are rendered. The play() measures each enabled tab’s label against the colour painted behind it (4.5:1), and the selected tab’s indicator — its underline in line, fullwidth and bordered — against the bar (3:1).',
          caveat:
            'The disabled tab is exempt from 1.4.3 (inactive components), so it is not measured. In the default variant the selected tab is marked by its raised chip rather than a rule.',
        }),
      },
    },
  },
  render: () => (
    <div className='space-y-8'>
      <LicenceTabs variant='default' />
      <LicenceTabs variant='line' />
      <LicenceTabs variant='fullwidth' />
      <LicenceTabs variant='bordered' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const variant of ['default', 'line', 'fullwidth', 'bordered']) {
      const set = canvasElement.querySelector<HTMLElement>(`[data-testid="${variant}"]`)!
      for (const tab of within(set).getAllByRole('tab')) {
        if (tab.getAttribute('aria-disabled') === 'true') continue
        expectContrast(getComputedStyle(tab).color, paintedBackground(tab), {
          label: `${variant}: “${tab.textContent}”`,
        })
      }
      if (variant !== 'default') {
        const selected = within(set).getByRole('tab', { selected: true })
        expectContrast(
          getComputedStyle(selected).borderBottomColor,
          paintedBackground(selected.parentElement!),
          { minimum: 3, label: `${variant}: selected-tab indicator` },
        )
      }
    }
  },
}

export const ContrastMinimum: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 / 1.4.11',
}

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 / 1.4.11 (dark)',
  globals: { theme: 'dark' },
}

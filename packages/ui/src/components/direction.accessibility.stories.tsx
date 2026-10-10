/**
 * DirectionProvider — Accessibility
 *
 * One story per WCAG 2.2 criterion right-to-left support has to meet, each
 * asserting it in play(). The provider is context only: it tells Base UI
 * components which way the reading direction runs. The `dir` attribute on a
 * DOM ancestor is what mirrors the layout and tells assistive technology.
 * These pin both halves.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { DirectionProvider } from './direction.js'
import { wcagStoryMeta } from './story-helpers.js'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs.js'

const meta = {
  title: 'Components/DirectionProvider/Accessibility',
  component: DirectionProvider,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DirectionProvider>

export default meta

type Story = StoryObj<typeof meta>

function ArabicTabs() {
  return (
    <div dir='rtl' lang='ar' className='max-w-xl' data-testid='rtl-root'>
      <DirectionProvider direction='rtl'>
        <Tabs defaultValue='eligibility'>
          <TabsList variant='line' aria-label='معلومات الترخيص'>
            <TabsTrigger value='eligibility'>الأهلية</TabsTrigger>
            <TabsTrigger value='apply'>كيفية التقديم</TabsTrigger>
            <TabsTrigger value='fees'>الرسوم</TabsTrigger>
          </TabsList>
          <TabsContent value='eligibility' className='pt-2 text-base'>
            يجب أن يكون عمرك 18 عامًا أو أكثر وأن تقيم في نيو ساوث ويلز.
          </TabsContent>
          <TabsContent value='apply' className='pt-2 text-base'>
            قدّم طلبك عبر الإنترنت.
          </TabsContent>
          <TabsContent value='fees' className='pt-2 text-base'>
            تعتمد الرسوم على مدة الترخيص.
          </TabsContent>
        </Tabs>
      </DirectionProvider>
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
          why: 'Reading direction is information: right-to-left text laid out right to left must also be marked right to left in the markup, or a screen reader and the browser’s own text handling read it as left to right.',
          how: 'The play() asserts the wrapper carries dir="rtl" and lang="ar" in the DOM, that the computed direction inside it is rtl, and that the first tab sits to the right of the second — the layout and the markup agree.',
          caveat:
            'DirectionProvider renders no element and sets no attribute, so on its own it changes none of this. Set dir — usually on <html> — and use the provider alongside it.',
        }),
      },
    },
  },
  render: () => <ArabicTabs />,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>('[data-testid="rtl-root"]')!
    await expect(root).toHaveAttribute('dir', 'rtl')
    await expect(root).toHaveAttribute('lang', 'ar')

    const [first, second] = within(root).getAllByRole('tab')
    await expect(getComputedStyle(first!).direction).toBe('rtl')
    await expect(first!.getBoundingClientRect().left).toBeGreaterThan(
      second!.getBoundingClientRect().left,
    )
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
          why: 'In a right-to-left layout the next item is to the left, so the arrow key that moves forward has to be Left. Keys that ignored the direction would send a keyboard user the opposite way to the layout.',
          how: 'Tab to the first tab (on the right). Arrow Left moves focus to the second tab; Arrow Right moves back. The play() asserts both.',
          caveat:
            'This is the provider’s job: Base UI components read it with useDirection(). Without the provider the bar still mirrors (from dir) but Left would move backwards.',
        }),
      },
    },
  },
  render: () => <ArabicTabs />,
  play: async ({ canvasElement }) => {
    const [first, second] = within(canvasElement).getAllByRole('tab')
    await userEvent.tab()
    await expect(first).toHaveFocus()
    await userEvent.keyboard('{ArrowLeft}')
    await expect(second).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(first).toHaveFocus()
  },
}

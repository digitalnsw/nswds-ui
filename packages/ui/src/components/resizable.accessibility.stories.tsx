/**
 * ResizablePanelGroup — Accessibility
 *
 * One story per WCAG 2.2 criterion a resizable layout has to meet, each
 * asserting it in play(). The divider is react-resizable-panels' focusable
 * `role="separator"` widget: it carries the split as a value, takes focus and
 * moves with the arrow keys. These pin what a keyboard and screen reader user
 * relies on.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable.js'
import { wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/ResizablePanelGroup/Accessibility',
  component: ResizablePanelGroup,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ResizablePanelGroup>

export default meta

type Story = StoryObj<typeof meta>

function MapAndResults() {
  return (
    <ResizablePanelGroup
      orientation='horizontal'
      className='h-40 max-w-xl rounded-md border border-border'
    >
      <ResizablePanel
        id='a11y-map'
        defaultSize='50%'
        minSize='20%'
        className='flex items-center justify-center bg-foreground/5 p-4'
      >
        Map
      </ResizablePanel>
      <ResizableHandle withHandle aria-label='Resize the map' />
      <ResizablePanel defaultSize='50%' className='flex items-center justify-center p-4'>
        Results
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

const handle = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('separator', { name: 'Resize the map' })

const valueOf = (element: HTMLElement) => Number(element.getAttribute('aria-valuenow'))

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'A screen reader user has to know the divider is something they can move, what it resizes, and where it is now. A focusable separator exposes all three: its role, its name and its current value.',
          how: 'The play() finds the divider as a separator by name, and asserts it carries a current value between its minimum and maximum and points at the panel it resizes with aria-controls.',
          caveat:
            'The divider has no name of its own. Pass aria-label to ResizableHandle — say what it resizes — just as an icon-only button needs one.',
        }),
      },
    },
  },
  render: () => <MapAndResults />,
  play: async ({ canvasElement }) => {
    const divider = handle(canvasElement)
    await expect(divider).toHaveAttribute('aria-valuemin')
    await expect(divider).toHaveAttribute('aria-valuemax')
    await waitFor(() => expect(valueOf(divider)).toBeGreaterThan(0))
    await expect(valueOf(divider)).toBeGreaterThanOrEqual(
      Number(divider.getAttribute('aria-valuemin')),
    )
    await expect(valueOf(divider)).toBeLessThanOrEqual(
      Number(divider.getAttribute('aria-valuemax')),
    )
    await expect(divider).toHaveAttribute('aria-controls', 'a11y-map')
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
          why: 'Dragging is not available to everyone. Every size a pointer can drag the divider to has to be reachable from the keyboard as well.',
          how: 'Tab to the divider and press the arrow keys: Right grows the first panel, Left shrinks it, and Home takes it to its minimum. The play() asserts each change in the divider’s value.',
          caveat:
            'In a vertical group the keys are Up and Down. The minimum here is 20%, so Home stops there rather than collapsing the map.',
        }),
      },
    },
  },
  render: () => <MapAndResults />,
  play: async ({ canvasElement }) => {
    const divider = handle(canvasElement)
    await userEvent.tab()
    await expect(divider).toHaveFocus()
    await waitFor(() => expect(valueOf(divider)).toBeGreaterThan(0))

    const start = valueOf(divider)
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(valueOf(divider)).toBeGreaterThan(start))
    const grown = valueOf(divider)
    await userEvent.keyboard('{ArrowLeft}')
    await waitFor(() => expect(valueOf(divider)).toBeLessThan(grown))

    await userEvent.keyboard('{Home}')
    await waitFor(() =>
      expect(valueOf(divider)).toBe(Number(divider.getAttribute('aria-valuemin'))),
    )
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
          why: 'The divider is a one-pixel line. Without a focus indicator a keyboard user cannot see that the arrow keys will now move it rather than scroll the page.',
          how: 'Tab to the divider. The play() asserts it has focus and draws a ring — a box-shadow in the ring colour — that it does not draw at rest.',
          caveat:
            'The ring is one pixel either side of the line, which is visible but slight; withHandle adds a grip that makes the focused divider easier to find.',
        }),
      },
    },
  },
  render: () => <MapAndResults />,
  play: async ({ canvasElement }) => {
    const divider = handle(canvasElement)
    await expect(getComputedStyle(divider).boxShadow).toBe('none')
    await userEvent.tab()
    await expect(divider).toHaveFocus()
    await waitFor(() => expect(getComputedStyle(divider).boxShadow).not.toBe('none'))
  },
}

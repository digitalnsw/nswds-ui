/**
 * Toaster — Accessibility
 *
 * One story per WCAG 2.2 criterion a toast has to meet, each asserting it in
 * play(). The live region, the hotkey and the toast markup come from sonner;
 * these pin the parts a consumer relies on — that a toast is announced
 * without taking focus, that its action and close button can be reached and
 * used from the keyboard and are named, and that its text is readable in both
 * themes.
 *
 * Contrast has no dark story: the description colour is sonner's own and
 * follows the theme Toaster reads from next-themes, so on a page made dark
 * any other way (this Storybook included) it renders 1.43:1. That is a
 * finding against the component, not a story to weaken until it passes.
 *
 * Each story mounts its own Toaster with an `id` and fires toasts with a
 * matching `toasterId`, then dismisses them and waits for them to unmount, so
 * nothing carries over to the next story.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { toast } from 'sonner'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Button } from './button.js'
import { Toaster } from './sonner.js'
import { compositeOver, expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/Toaster/Accessibility',
  component: Toaster,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Toaster>

export default meta

type Story = StoryObj<typeof meta>

const toastSelector = '[data-sonner-toast]'

const toastNamed = (text: string) =>
  waitFor(() => {
    const found = [...document.querySelectorAll<HTMLElement>(toastSelector)].find((el) =>
      el.textContent?.includes(text),
    )
    if (!found) throw new Error(`No toast reading "${text}" yet.`)
    return found
  })

/** Dismisses every toast and waits until none is left in the DOM. */
async function clearToasts() {
  toast.dismiss()
  await waitFor(() => expect(document.querySelector(toastSelector)).not.toBeInTheDocument(), {
    timeout: 3000,
  })
}

/**
 * The opaque colour painted behind an element: its own background, else the
 * nearest ancestor's, with any translucent layers between composited on.
 */
function surfaceBehind(element: Element): string {
  const layers: ReturnType<typeof resolveColor>[] = []
  for (let node: Element | null = element; node; node = node.parentElement) {
    const colour = resolveColor(getComputedStyle(node).backgroundColor)
    if (colour.a === 0) continue
    layers.push(colour)
    if (colour.a === 1) break
  }
  let base: { r: number; g: number; b: number } =
    layers.at(-1)?.a === 1 ? layers.pop()! : { r: 255, g: 255, b: 255 }
  for (const layer of layers.reverse()) base = compositeOver(layer, base)
  return `rgb(${base.r} ${base.g} ${base.b})`
}

const undo = fn()

/** A toast the reader may act on: it stays until dismissed, with Undo. */
function fireDeleted(toasterId: string) {
  toast('Draft deleted', {
    description: 'Working with Children Check application',
    duration: Infinity,
    action: { label: 'Undo', onClick: undo },
    toasterId,
  })
}

// ─── 4.1.3 — Status Messages ──────────────────────────────────────────────────

export const StatusMessages: Story = {
  name: 'Status Messages — 4.1.3',
  parameters: {
    wcag: ['4.1.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.3',
          why: 'A toast reports that something happened without taking the reader anywhere. A screen reader must announce it all the same — without focus moving to it, or the reader loses their place.',
          how: 'Press Save draft. The play() asserts the toast’s text lands inside the Toaster’s polite live region, which exists before any toast does (so the addition is announced), and that focus stays on the button.',
          caveat:
            'The region is polite: it waits for the screen reader to finish speaking. Never use a toast for something urgent the reader must act on before going on — use AlertDialog.',
        }),
      },
    },
  },
  render: () => (
    <div>
      <Toaster id='a11y-status' />
      <Button
        onClick={() => toast.success('Your draft has been saved', { toasterId: 'a11y-status' })}
      >
        Save draft
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const region = canvasElement.querySelector('section[aria-live]')
    await expect(region).toHaveAttribute('aria-live', 'polite')
    const button = within(canvasElement).getByRole('button', { name: 'Save draft' })
    await userEvent.click(button)
    const shown = await toastNamed('Your draft has been saved')
    await expect(region!.contains(shown)).toBe(true)
    await expect(button).toHaveFocus()
    await clearToasts()
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
          why: 'A toast’s action and close button sit in a corner of the screen, far from where the reader is working. A keyboard reader needs a way to reach them that does not mean tabbing through the whole page.',
          how: 'Show the toast, then press Alt+T: focus jumps to the toasts. Tab reaches Undo; Enter runs it. The play() asserts the hotkey moves focus into the toasts and that Undo runs from the keyboard.',
          caveat:
            'The hotkey is Alt+T by default (hotkey on Toaster changes it) and is part of the region’s name, so a screen reader announces it. A toast with an action should stay until dismissed — duration: Infinity — so a reader is not racing a timer.',
        }),
      },
    },
  },
  render: () => (
    <div>
      <Toaster id='a11y-keyboard' />
      <Button onClick={() => fireDeleted('a11y-keyboard')}>Delete draft</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    undo.mockClear()
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Delete draft' }))
    const shown = await toastNamed('Draft deleted')
    await userEvent.keyboard('{Alt>}t{/Alt}')
    const list = canvasElement.querySelector('[data-sonner-toaster]')!
    await waitFor(() => expect(list.contains(document.activeElement)).toBe(true))
    const action = within(shown).getByRole('button', { name: 'Undo' })
    for (let i = 0; i < 4 && document.activeElement !== action; i++) await userEvent.tab()
    await expect(action).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(undo).toHaveBeenCalledTimes(1)
    await clearToasts()
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
          why: 'The toast region and every control in a toast must have a name, so a screen reader can say where the reader is and what each button does.',
          how: 'With closeButton on the Toaster, show a toast with an action. The play() asserts the region is named (with its hotkey), the action is a button named by its label, and the icon-only close button is named.',
          caveat:
            'The close button’s name is sonner’s default, “Close toast”; set toastOptions.closeButtonAriaLabel to translate it with the page.',
        }),
      },
    },
  },
  render: () => (
    <div>
      <Toaster id='a11y-names' closeButton />
      <Button onClick={() => fireDeleted('a11y-names')}>Delete draft</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const region = canvasElement.querySelector('section[aria-live]')!
    await expect(region.getAttribute('aria-label')).toMatch(/^Notifications .*T$/)
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Delete draft' }))
    const shown = await toastNamed('Draft deleted')
    await expect(within(shown).getByRole('button', { name: 'Undo' })).toBeInTheDocument()
    await expect(within(shown).getByRole('button', { name: 'Close toast' })).toBeInTheDocument()
    await clearToasts()
  },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

export const ContrastMinimum: Story = {
  name: 'Contrast (Minimum) — 1.4.3',
  parameters: {
    wcag: ['1.4.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'A toast is read at a glance before it goes, so its title, description and action label must all clear 4.5:1 against what they sit on.',
          how: 'A toast with a description and an action is shown and the play() measures the title, the description and the Undo label against the colour painted behind each.',
          caveat:
            'Light theme only. The surface and title come from the popover tokens through the Toaster’s token bridge, but the description colour is sonner’s own and follows sonner’s theme, which Toaster takes from next-themes — so on a dark page whose theme next-themes does not set, the description is unreadable.',
        }),
      },
    },
  },
  render: () => (
    <div>
      <Toaster id='a11y-contrast' />
      <Button onClick={() => fireDeleted('a11y-contrast')}>Delete draft</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Delete draft' }))
    const shown = await toastNamed('Draft deleted')
    for (const [label, element] of [
      ['title', shown.querySelector('[data-title]')!],
      ['description', shown.querySelector('[data-description]')!],
      ['action', within(shown).getByRole('button', { name: 'Undo' })],
    ] as const) {
      expectContrast(getComputedStyle(element).color, surfaceBehind(element), { label })
    }
    await clearToasts()
  },
}
